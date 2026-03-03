import styles from './Header.module.css'

export default function Header({ arch, state, fileCount, onHelp, theme, toggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🏗️</div>
        <span>Flutter <span className={styles.accent}>Arch</span> Studio</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.metaTag}>{fileCount} files generated</span>
        <span className={styles.separator}>·</span>
        <span className={styles.metaTag}>{arch}</span>
        <span className={styles.separator}>+</span>
        <span className={styles.metaTag}>{state}</span>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button className={styles.helpBtn} onClick={onHelp}>? Guide</button>
        <span className={styles.badge}>v2.0</span>
      </div>
    </header>
  )
}
