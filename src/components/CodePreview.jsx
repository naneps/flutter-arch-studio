import { useState, useMemo } from 'react'
import { highlight } from '../utils/highlighter.js'
import { getFileDescription } from '../data/fileDescriptions.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Info, 
  Copy, 
  Check, 
  FileCode, 
  FileSearch,
  Zap,
  Layout
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.05)]">
          <FileSearch className="w-10 h-10 text-primary opacity-40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground/50">Select a file to preview</h2>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Click any file in the project tree</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <EmptyHint icon={<Zap className="w-3.5 h-3.5 text-primary" />} text="Color-coded file types" />
          <EmptyHint icon={<Layout className="w-3.5 h-3.5 text-primary" />} text="Syntax highlighting" />
          <EmptyHint icon={<Copy className="w-3.5 h-3.5 text-primary" />} text="Quick copy to clipboard" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-code-bg overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant="cyber" className="font-mono text-[9px] h-5 py-0">
            {ext}
          </Badge>
          <span className="font-mono text-[11px] text-muted-foreground truncate opacity-70">
            {filePath}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-muted-foreground/60 mr-2 uppercase tracking-tighter">
            {lineCount} lines
          </span>
          {info && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 w-7 p-0 rounded-md border-white/10 transition-all",
                showInfo ? "bg-primary/10 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setShowInfo(s => !s)}
              title="Toggle file info"
            >
              <Info className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 px-3 gap-2 font-mono text-[10px] rounded-md border-white/10 transition-all",
              copied ? "border-green-500 text-green-500 bg-green-500/10" : "text-muted-foreground hover:text-primary hover:border-primary/50"
            )}
            onClick={copy}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar bg-black/10">
          <div className="flex min-h-full">
            <div className="pt-5 pb-5 w-12 shrink-0 bg-black/20 border-r border-white/5 select-none text-right pr-3 font-mono text-[11px] leading-[1.75] text-white/10">
              {content.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre
              className="flex-1 p-5 pt-5 pb-5 font-mono text-[13px] leading-[1.75] text-foreground/90 whitespace-pre overflow-visible select-text"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        </div>

        {showInfo && info && (
          <div className="w-64 border-l border-white/5 bg-black/30 p-5 overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3 font-mono">
              {info.role}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground mb-6">
              {info.desc}
            </p>
            {info.tips.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] font-mono">
                  < Zap className="w-3 h-3" />
                  Tips
                </div>
                <div className="space-y-3">
                  {info.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2 text-[11px] leading-snug text-muted-foreground/80 font-mono">
                      <span className="text-primary font-bold">›</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyHint({ icon, text }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/5 bg-black/20 text-muted-foreground text-[11px] font-mono whitespace-nowrap">
      {icon}
      {text}
    </div>
  )
}
