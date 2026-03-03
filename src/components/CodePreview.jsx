import { useState, useMemo } from 'react'
import { highlight } from '../utils/highlighter.js'
import { getFileDescription } from '../data/fileDescriptions.js'
import styles from './CodePreview.module.css'

export default function CodePreview({ filePath, content }) {
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(true)

  const highlighted = useMemo(
    () => filePath && content ? highlight(filePath, content) : '',
    [filePath, content]
  )

  const info = useMemo(
    () => filePath ? getFileDescription(filePath) : null,
    [filePath]
  )

  const lineCount = content ? content.split('\n').length : 0
  const ext = filePath ? filePath.split('.').pop() : ''

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!filePath || !content) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyGraphic}>
          <span className={styles.emptyIcon}>📂</span>
        </div>
        <div className={styles.emptyTitle}>Select a file to preview</div>
        <div className={styles.emptyHint}>Click any file in the tree on the left</div>
        <div className={styles.emptyShortcuts}>
          <span>💡 Files are color-coded by type</span>
          <span>🎯 .dart files have syntax highlighting</span>
          <span>📋 Click copy to grab the code</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.barLeft}>
          <span className={styles.extBadge} data-ext={ext}>{ext}</span>
          <span className={styles.path}>{filePath}</span>
        </div>
        <div className={styles.barRight}>
          <span className={styles.lineCount}>{lineCount} lines</span>
          {info && (
            <button
              className={`${styles.infoBtn} ${showInfo ? styles.infoBtnActive : ''}`}
              onClick={() => setShowInfo(s => !s)}
              title="Toggle file info"
            >
              ℹ️
            </button>
          )}
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
            onClick={copy}
          >
            {copied ? '✓ copied' : '⎘ copy'}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.codeWrapper}>
          <div className={styles.lineNumbers} aria-hidden="true">
            {content.split('\n').map((_, i) => (
              <div key={i} className={styles.lineNum}>{i + 1}</div>
            ))}
          </div>
          <pre
            className={styles.code}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>

        {showInfo && info && (
          <div className={styles.infoPanel}>
            <div className={styles.infoRole}>{info.role}</div>
            <p className={styles.infoDesc}>{info.desc}</p>
            {info.tips.length > 0 && (
              <div className={styles.infoTips}>
                <div className={styles.tipsLabel}>💡 Tips</div>
                {info.tips.map((tip, i) => (
                  <div key={i} className={styles.tip}>
                    <span className={styles.tipDot}>›</span>
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
