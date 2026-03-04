import { useState } from 'react'
import styles from './Header.module.css'

export default function Header({ arch, state, fileCount, onHelp, theme, toggleTheme, onShare }) {
  const [toastVisible, setToastVisible] = useState(false)

  const handleShare = () => {
    onShare?.()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2200)
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/favicon.png" alt="Flutter Arch Studio" className={styles.logoIcon} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
        <span>Flutter <span className={styles.accent}>Arch</span> Studio</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.metaTag}>{fileCount} files generated</span>
        <span className={styles.separator}>·</span>
        <span className={styles.metaTag}>{arch}</span>
        <span className={styles.separator}>+</span>
        <span className={styles.metaTag}>{state}</span>
        <button className={styles.shareBtn} onClick={handleShare} title="Share this config via URL">
          🔗 Share
        </button>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <a
          href="https://saweria.co/nannndev"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.supportBtn}
          title="Bantu support project ini ya!"
        >
          ☕ Support
        </a>
        <button className={styles.helpBtn} onClick={onHelp}>? Guide</button>
        <span className={styles.badge}>v2.0</span>
      </div>

      {toastVisible && (
        <div className={styles.toast}>
          ✓ Link copied to clipboard!
        </div>
      )}
    </header>
  )
}
