import { useEffect, useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import ConfigPanel from './components/ConfigPanel.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import GitHubModal from './components/GitHubModal.jsx'
import Header from './components/Header.jsx'
import OutputPanel from './components/OutputPanel.jsx'
import SuccessModal from './components/SuccessModal.jsx'
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
  const { download, downloading, showSuccess, setShowSuccess } = useDownload()
  const [showWelcome, setShowWelcome] = useState(true)
  const [showGitHub, setShowGitHub] = useState(false)
  const [theme, setTheme] = useState('dark')

  // Deep link: read URL params on first mount and apply config
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('arch')) setArch(params.get('arch'))
    if (params.has('state')) setState(params.get('state'))
    if (params.has('name')) setProjectName(params.get('name'))
    if (params.has('org')) setOrgName(params.get('org'))
    // feats are handled in useProjectConfig via getInitialFeats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleShare = () => {
    const params = new URLSearchParams({
      arch,
      state,
      name: projectName,
      org: orgName,
      feats: feats.join(','),
    })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', `?${params.toString()}`)
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground font-display selection:bg-primary/30">
      <CustomCursor />
      <AnimatedBackground />

      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      {showSuccess && (
        <SuccessModal
          projectName={projectName}
          orgName={orgName}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showGitHub && (() => {
        return (
          <GitHubModal
            onClose={() => setShowGitHub(false)}
            files={files}
            defaultRepoName={projectName}
          />
        )
      })()}

      {showSuccess && (
        <SuccessModal
          projectName={projectName}
          orgName={orgName}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <Header
        arch={arch}
        state={state}
        fileCount={Object.keys(files).length}
        onHelp={() => setShowWelcome(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        onShare={handleShare}
      />

      <main className="flex-1 flex overflow-hidden relative">
        <ConfigPanel
          projectName={projectName} setProjectName={setProjectName}
          orgName={orgName} setOrgName={setOrgName}
          arch={arch} setArch={setArch}
          state={state} setState={setState}
          feats={feats} toggleFeat={toggleFeat}
          onDownload={() => download(files)}
          onPushGithub={() => setShowGitHub(true)}
          downloading={downloading}
          onHelp={() => setShowWelcome(true)}
        />
        <OutputPanel
          projectName={projectName}
          files={files}
          arch={arch}
          state={state}
          feats={feats}
        />
      </main>
    </div>
  )
}
