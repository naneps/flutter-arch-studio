import { useEffect, useState } from 'react'
import { useGitHub } from '../hooks/useGitHub.js'
import styles from './GitHubModal.module.css'

export default function GitHubModal({ onClose, files, defaultRepoName }) {
    const [token, setToken] = useState('')
    const [repoName, setRepoName] = useState(defaultRepoName || 'flutter_arch_project')
    const [isPrivate, setIsPrivate] = useState(false)
    const [saveToken, setSaveToken] = useState(true)

    const { pushToGitHub, pushing, progress, error, successUrl } = useGitHub()

    useEffect(() => {
        const saved = localStorage.getItem('fas_github_token')
        if (saved) setToken(saved)
    }, [])

    const handlePush = () => {
        if (!token.trim() || !repoName.trim()) return

        if (saveToken) {
            localStorage.setItem('fas_github_token', token)
        } else {
            localStorage.removeItem('fas_github_token')
        }

        pushToGitHub(token, repoName, isPrivate, files)
    }

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.icon}>🐙</div>
                    <div>
                        <div className={styles.title}>Push to GitHub</div>
                        <div className={styles.subtitle}>Directly repository generation 🔥</div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} disabled={pushing}>✕</button>
                </div>

                <div className={styles.content}>
                    {successUrl ? (
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>🎉</div>
                            <h3>Repository Created!</h3>
                            <p>Your Flutter architecture has been successfully pushed.</p>
                            <a href={successUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                                Open in GitHub ↗
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className={styles.infoBox}>
                                <p>We need a <b>Personal Access Token (classic)</b> with the <code>repo</code> scope to create a repository on your behalf.</p>
                                <a href="https://github.com/settings/tokens/new?scopes=repo&description=Flutter+Arch+Studio" target="_blank" rel="noopener noreferrer" className={styles.guideLink}>
                                    👉 Click here to generate one quickly
                                </a>
                            </div>

                            <div className={styles.formGroup}>
                                <label>GitHub Token:</label>
                                <input
                                    type="password"
                                    value={token}
                                    onChange={e => setToken(e.target.value)}
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxx"
                                    className={styles.input}
                                    disabled={pushing}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Repository Name:</label>
                                <input
                                    type="text"
                                    value={repoName}
                                    onChange={e => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
                                    placeholder="my-flutter-app"
                                    className={styles.input}
                                    disabled={pushing}
                                />
                            </div>

                            <div className={styles.options}>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} disabled={pushing} />
                                    Make repository Private 🔒
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" checked={saveToken} onChange={e => setSaveToken(e.target.checked)} disabled={pushing} />
                                    Remember token locally 💾
                                </label>
                            </div>

                            {error && <div className={styles.error}>{error}</div>}
                            {pushing && <div className={styles.progress}>⏳ {progress}</div>}
                        </>
                    )}
                </div>

                {!successUrl && (
                    <div className={styles.footer}>
                        <button className={styles.cancelBtn} onClick={onClose} disabled={pushing}>Cancel</button>
                        <button
                            className={styles.pushBtn}
                            onClick={handlePush}
                            disabled={pushing || !token.trim() || !repoName.trim()}
                        >
                            {pushing ? 'Pushing...' : '🚀 Push to GitHub'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
