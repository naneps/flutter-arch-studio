import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Share2, 
  HelpCircle, 
  Sun, 
  Moon, 
  Coffee,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header({ arch, state, fileCount, onHelp, theme, toggleTheme, onShare }) {
  const [toastVisible, setToastVisible] = useState(false)

  const handleShare = () => {
    onShare?.()
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2200)
  }

  return (
    <header className="flex items-center justify-between px-7 py-3.5 border-b border-border bg-card/85 backdrop-blur-md shrink-0 z-10 relative animate-in fade-in slide-in-from-top-3 duration-500">
      <div className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight group cursor-pointer hover:opacity-85 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all group-hover:rotate-[-5deg] group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(0,212,255,0.5)]">
          <img src="/favicon.png" alt="" className="w-7 h-7 rounded-sm" />
        </div>
        <span>
          Flutter <span className="text-primary italic">Arch</span> Studio
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 mr-2">
          <MetaTag>{fileCount} files</MetaTag>
          <span className="text-border mx-0.5">·</span>
          <MetaTag>{arch}</MetaTag>
          <span className="text-border mx-0.5">+</span>
          <MetaTag>{state}</MetaTag>
        </div>

        <div className="flex items-center gap-1.5">
          <Button 
            variant="cyber" 
            size="sm" 
            onClick={handleShare}
            className="h-8 gap-1.5 text-[11px] font-mono"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTheme}
            className="h-8 w-10 p-0 md:w-auto md:px-3 gap-2 text-[11px] font-mono text-muted-foreground hover:text-primary transition-all"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </Button>

          <a
            href="https://saweria.co/nannndev"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-md flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/30 hover:bg-[#fbbf24]/20 hover:border-[#fbbf24] transition-all hover:-translate-y-0.5"
            title="Bantu support project ini ya!"
          >
            <Coffee className="w-3.5 h-3.5" />
            Support
          </a>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onHelp}
            className="h-8 gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-primary"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guide
          </Button>

          <span className="bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono px-2 py-0.5 rounded-full ml-1">
            v2.1
          </span>
        </div>
      </div>

      {toastVisible && (
        <div className="absolute top-[calc(100%+8px)] right-7 bg-card border border-primary/40 text-primary font-mono text-[12px] px-4 py-2 rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          Link copied to clipboard!
        </div>
      )}
    </header>
  )
}

function MetaTag({ children }) {
  return (
    <span className="font-mono text-[11px] text-muted-foreground bg-secondary border border-border px-2.5 py-1 rounded-md">
      {children}
    </span>
  )
}
