import { useMemo, useState } from 'react'
import Checklist from './Checklist.jsx'
import CodePreview from './CodePreview.jsx'
import DocsPanel from './DocsPanel.jsx'
import FileTree from './FileTree.jsx'
import styles from './OutputPanel.module.css'

const TABS = [
  { id: 'explorer', label: '📁 Explorer' },
  { id: 'docs', label: '📚 Docs' },
  { id: 'pubspec', label: '📦 pubspec.yaml' },
  { id: 'checklist', label: '✅ Checklist' },
  { id: 'playground', label: '🎾 Playground' },
]

export default function OutputPanel({ files, arch, state, feats }) {
  const [activeTab, setActiveTab] = useState('explorer')
  const [selectedFile, setSelectedFile] = useState(null)
  const [copied, sCopied] = useState(false)
  const [search, setSearch] = useState('')

  const pubspecContent = files['pubspec.yaml'] || ''

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files
    const q = search.toLowerCase()
    return Object.fromEntries(
      Object.entries(files).filter(([path]) => path.toLowerCase().includes(q))
    )
  }, [files, search])

  const copyPubspec = () => {
    navigator.clipboard.writeText(pubspecContent)
    sCopied(true)
    setTimeout(() => sCopied(false), 1500)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <div className={styles.tabSpacer} />
        {activeTab === 'explorer' && (
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'explorer' && (
        <div className={styles.explorerLayout}>
          <div className={styles.treePane}>
            <FileTree
              files={filteredFiles}
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
            />
            {search && (
              <div className={styles.searchCount}>
                {Object.keys(filteredFiles).length} files matched
              </div>
            )}
          </div>
          <div className={styles.previewPane}>
            <CodePreview
              filePath={selectedFile}
              content={selectedFile ? files[selectedFile] : null}
            />
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <DocsPanel arch={arch} state={state} />
      )}

      {activeTab === 'pubspec' && (
        <div className={styles.fullPane}>
          <div className={styles.pubspecBar}>
            <div className={styles.pubspecLeft}>
              <span className={styles.pubspecBadge}>yaml</span>
              <span className={styles.pubspecTitle}>pubspec.yaml</span>
            </div>
            <div className={styles.pubspecRight}>
              <span className={styles.depCount}>
                {(pubspecContent.match(/^\s{2}\w/gm) || []).length} packages
              </span>
              <button
                className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
                onClick={copyPubspec}
              >
                {copied ? '✓ copied' : '⎘ copy'}
              </button>
            </div>
          </div>
          <pre className={styles.pubspecCode}>{pubspecContent}</pre>
        </div>
      )}

      {activeTab === 'checklist' && (
        <Checklist arch={arch} state={state} feats={feats} />
      )}

      {activeTab === 'playground' && (
        <div className={styles.playgroundWrap}>
          <iframe
            src="https://dartpad.dev/embed-flutter.html?theme=dark&run=true"
            title="DartPad Playground"
            className={styles.playgroundIframe}
            sandbox="allow-scripts allow-same-origin allow-popups allow-downloads"
          />
        </div>
      )}
    </div>
  )
}
