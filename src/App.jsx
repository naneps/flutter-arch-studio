import { useEffect, useState } from 'react'
import styles from './App.module.css'
import ConfigPanel from './components/ConfigPanel.jsx'
import Header from './components/Header.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import WelcomeModal from './components/WelcomeModal.jsx'
import { useDownload } from './hooks/useDownload.js'
import { useProjectConfig } from './hooks/useProjectConfig.js'

export default function App() {
  const {
    projectName, setProjectName,
    orgName, setOrgName,
    arch, setArch,
    state, setState,
    feats, toggleFeat,
    files
  } = useProjectConfig()
  const { download, downloading } = useDownload()
  const [showWelcome, setShowWelcome] = useState(true)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div className={styles.app}>
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      <Header
        arch={arch}
        state={state}
        fileCount={Object.keys(files).length}
        onHelp={() => setShowWelcome(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className={styles.body}>
        <ConfigPanel
          projectName={projectName} setProjectName={setProjectName}
          orgName={orgName} setOrgName={setOrgName}
          arch={arch} setArch={setArch}
          state={state} setState={setState}
          feats={feats} toggleFeat={toggleFeat}
          onDownload={() => download(files)}
          downloading={downloading}
          onHelp={() => setShowWelcome(true)}
        />
        <OutputPanel
          files={files}
          arch={arch}
          state={state}
          feats={feats}
        />
      </div>
    </div>
  )
}
