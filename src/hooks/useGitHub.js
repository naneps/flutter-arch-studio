import { useState } from 'react'

export function useGitHub() {
  const [pushing, setPushing] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState(null)
  const [successUrl, setSuccessUrl] = useState(null)

  const pushToGitHub = async (token, repoName, isPrivate, files) => {
    setPushing(true)
    setError(null)
    setSuccessUrl(null)

    try {
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      }

      // 1. Get user info
      setProgress('Authenticating...')
      const userRes = await fetch('https://api.github.com/user', { headers })
      if (!userRes.ok) throw new Error('Invalid Personal Access Token')
      const targetUser = await userRes.json()
      const owner = targetUser.login

      // 2. Create Repository
      setProgress('Creating repository...')
      const repoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: repoName,
          description: 'Generated with Flutter Arch Studio',
          private: isPrivate,
          auto_init: true // create an initial commit to branch off of
        })
      })

      if (!repoRes.ok && repoRes.status !== 422) {
        throw new Error('Failed to create repository. Make sure your token has "repo" scope.')
      }
      
      // If 422, repo might exist. We proceed assuming it does, but we need the default branch.
      
      const targetRepoUrl = `https://github.com/${owner}/${repoName}`

      // 3. Get latest commit from default branch (assuming 'main' or 'master')
      setProgress('Preparing files...')
      
      // Try main first, fallback to master
      let branch = 'main'
      let refRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/main`, { headers })
      if (!refRes.ok) {
        branch = 'master'
        refRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/master`, { headers })
      }
      if (!refRes.ok) throw new Error('Could not find main/master branch. Repo might be completely empty.')

      const refData = await refRes.json()
      const latestCommitSha = refData.object.sha

      // 4. Create blobs for each file
      setProgress('Uploading files...')
      const tree = []
      
      for (const [path, content] of Object.entries(files)) {
        const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/blobs`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            content: content,
            encoding: 'utf-8'
          })
        })
        if (!blobRes.ok) throw new Error(`Failed to create blob for ${path}`)
        const blobData = await blobRes.json()
        
        tree.push({
          path: path,
          mode: '100644', // file mode
          type: 'blob',
          sha: blobData.sha
        })
      }

      // 5. Create Tree
      setProgress('Finalizing directory structure...')
      const getCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/commits/${latestCommitSha}`, { headers })
      const commitData = await getCommitRes.json()
      const baseTreeSha = commitData.tree.sha

      const createTreeRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: tree
        })
      })
      if (!createTreeRes.ok) throw new Error('Failed to create tree structure.')
      const treeData = await createTreeRes.json()

      // 6. Create Commit
      setProgress('Committing files...')
      const createCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: 'chore: initial generation via Flutter Arch Studio 🚀',
          tree: treeData.sha,
          parents: [latestCommitSha]
        })
      })
      if (!createCommitRes.ok) throw new Error('Failed to create commit.')
      const newCommitData = await createCommitRes.json()

      // 7. Update branch ref
      setProgress('Finishing up...')
      const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sha: newCommitData.sha,
          force: true
        })
      })
      if (!updateRefRes.ok) throw new Error('Failed to update branch reference.')

      setProgress('Done!')
      setSuccessUrl(targetRepoUrl)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setPushing(false)
    }
  }

  return { pushToGitHub, pushing, progress, error, successUrl }
}
