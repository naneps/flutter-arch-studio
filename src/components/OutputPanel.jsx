import { useMemo, useState } from 'react'
import Checklist from './Checklist.jsx'
import CodePreview from './CodePreview.jsx'
import DocsPanel from './DocsPanel.jsx'
import FileTree from './FileTree.jsx'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  FolderTree, 
  BookOpen, 
  Package, 
  CheckSquare, 
  Play,
  Search,
  X,
  Copy,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'explorer', label: 'Explorer', icon: <FolderTree className="w-3.5 h-3.5" /> },
  { id: 'docs', label: 'Docs', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'pubspec', label: 'pubspec.yaml', icon: <Package className="w-3.5 h-3.5" /> },
  { id: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-3.5 h-3.5" /> },
  { id: 'playground', label: 'Playground', icon: <Play className="w-3.5 h-3.5" /> },
]

export default function OutputPanel({ projectName, files, arch, state, feats }) {
  if (!files) return null

  const [activeTab, setActiveTab] = useState('explorer')
  const [selectedFile, setSelectedFile] = useState(null)
  const [copied, setCopied] = useState(false)
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
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between px-4 border-b border-border bg-card/40 backdrop-blur-sm">
          <TabsList className="bg-transparent border-none h-12 gap-1 px-0">
            {TABS.map(t => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-12 gap-2 text-xs font-medium text-muted-foreground transition-all px-4"
              >
                {t.icon}
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-4">
            {activeTab === 'explorer' && (
              <div className="relative group w-48 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  className="h-8 pl-9 pr-8 bg-background/40 border-border/50 text-xs rounded-full focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                  placeholder="Search files..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearch('')}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
            <div className="text-[10px] font-mono text-muted-foreground hidden sm:block">
              {Object.keys(files).length} FILES
            </div>
          </div>
        </div>

        <TabsContent value="explorer" className="flex-1 m-0 overflow-hidden outline-none">
          <div className="flex h-full">
            <div className="w-72 border-r border-border bg-card/20 flex flex-col">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <FileTree
                  files={filteredFiles}
                  selectedFile={selectedFile}
                  onSelect={setSelectedFile}
                />
              </div>
              {search && (
                <div className="p-2 border-t border-border bg-primary/5 text-[10px] font-mono text-primary text-center">
                  {Object.keys(filteredFiles).length} matches found
                </div>
              )}
            </div>
            <div className="flex-1 bg-code-bg overflow-hidden relative">
              <CodePreview
                filePath={selectedFile}
                content={selectedFile ? files[selectedFile] : null}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="flex-1 m-0 overflow-y-auto custom-scrollbar outline-none p-6">
          <DocsPanel arch={arch} state={state} />
        </TabsContent>

        <TabsContent value="pubspec" className="flex-1 m-0 overflow-hidden outline-none flex flex-col p-6 bg-code-bg">
          <div className="flex items-center justify-between mb-4 bg-card/40 p-3 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Badge variant="cyber" className="font-mono text-[10px]">YAML</Badge>
              <span className="font-mono text-sm tracking-tight opacity-70">pubspec.yaml</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground">
                {(pubspecContent.match(/^\s{2}\w/gm) || []).length} PACKAGES DETECTED
              </span>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-2 font-mono text-[11px] rounded-lg transition-all",
                  copied ? "border-green-500 text-green-500 bg-green-500/10" : "hover:border-primary hover:text-primary"
                )}
                onClick={copyPubspec}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Content'}
              </Button>
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-border overflow-hidden bg-black/20">
            <pre className="p-6 h-full overflow-auto font-mono text-sm leading-relaxed custom-scrollbar text-hl-type/90 select-text">
              {pubspecContent}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="flex-1 m-0 overflow-y-auto custom-scrollbar outline-none p-6">
          <div className="max-w-4xl mx-auto">
            <Checklist projectName={projectName} arch={arch} state={state} feats={feats} />
          </div>
        </TabsContent>

        <TabsContent value="playground" className="flex-1 m-0 overflow-hidden outline-none bg-black">
          <iframe
            src="https://dartpad.dev/embed-flutter.html?theme=dark&run=true"
            title="DartPad Playground"
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-popups allow-downloads"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
