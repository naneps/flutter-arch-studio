import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Copy, 
  Terminal, 
  Package, 
  Code2,
  Check,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SuccessModal({ projectName, orgName, onClose }) {
  const [copied, setCopied] = useState(false)
  const snakeCaseName = projectName.replace(/-/g, '_').toLowerCase()
  const createCmd = `flutter create . --org ${orgName} --project-name ${snakeCaseName}`

  const copyCmd = () => {
    navigator.clipboard.writeText(createCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-card border border-primary/30 rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500">
        <div className="p-8 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-bounce duration-1000">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight uppercase">Project Generated!</h2>
            <p className="text-sm text-muted-foreground">
              Your project <span className="text-primary font-bold">{projectName}</span> is ready for take-off.
            </p>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] text-center">
            Critical First Step Required
          </p>
          
          <div className="space-y-3">
            <StepItem 
              num="01" 
              icon={<Package className="w-4 h-4" />}
              title="Extract & Navigate"
              desc="Extract the downloaded ZIP and open terminal in the folder."
            />
            
            <div className="p-5 rounded-2xl bg-black/20 border border-primary/10 space-y-3 group transition-all hover:border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-black shrink-0">02</div>
                <div className="flex-1">
                   <h4 className="text-xs font-bold uppercase tracking-wide">Generate Native Boilerplate</h4>
                   <p className="text-[10px] text-muted-foreground mt-0.5">Initialize Android, iOS, and other platforms</p>
                </div>
              </div>
              <div className="relative group/code">
                <div className="w-full bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-primary/90 break-all pr-12">
                  {createCmd}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "absolute top-1/2 right-2 -translate-y-1/2 rounded-lg transition-all",
                    copied ? "text-green-500 bg-green-500/10" : "text-primary/50 hover:text-primary hover:bg-primary/10"
                  )}
                  onClick={copyCmd}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <StepItem 
              num="03" 
              icon={<Zap className="w-4 h-4" />}
              title="Run & Develop"
              desc="Install packages and launch with 'flutter run'"
            />
          </div>
        </div>

        <div className="p-8 pt-0">
          <Button 
            variant="cyber" 
            className="w-full h-14 rounded-2xl text-base font-black gap-3 group"
            onClick={onClose}
          >
            GOT IT, LET'S GO!
            <Check className="w-5 h-5 transition-transform group-hover:scale-125" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function StepItem({ num, icon, title, desc }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-card border border-border/40 group hover:border-border transition-all">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground font-mono text-xs font-bold shrink-0">{num}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 rounded bg-muted text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wide">{title}</h4>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground/80 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
