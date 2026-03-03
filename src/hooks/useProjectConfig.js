import { useState, useMemo } from 'react'
import { buildProject } from '../generators/projectBuilder.js'

function getInitialFeats() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.has('feats')) {
      const incoming = params.get('feats').split(',').filter(Boolean)
      if (incoming.length > 0) return incoming
    }
  } catch (_) { }
  return ['auth', 'api']
}

export function useProjectConfig() {
  const [projectName, setProjectName] = useState('my_app')
  const [orgName, setOrgName] = useState('com.example')
  const [arch, setArch] = useState('clean')
  const [state, setState] = useState('bloc')
  const [feats, setFeats] = useState(getInitialFeats)

  const toggleFeat = (id) =>
    setFeats(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])

  const files = useMemo(() => buildProject(projectName, orgName, arch, state, feats), [projectName, orgName, arch, state, feats])

  return { projectName, setProjectName, orgName, setOrgName, arch, setArch, state, setState, feats, toggleFeat, files }
}
