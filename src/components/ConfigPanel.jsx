import { useState } from 'react'
import { ARCHITECTURES, FEATURES, STATE_MANAGERS } from '../data/constants.js'
import { COMPATIBILITY, PROJECT_TYPES } from '../data/recommendations.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  GitPullRequest, 
  Download, 
  Settings2, 
  Shapes, 
  Zap, 
  X,
  Plus,
  HelpCircle,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ScoreDots({ score }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "w-1.5 h-1.5 rounded-full border border-border",
            i < Math.round(score / 2) ? "bg-primary border-primary shadow-[0_0_5px_rgba(0,212,255,0.5)]" : "bg-transparent"
          )} 
        />
      ))}
    </div>
  )
}

function ChoiceCard({ item, active, onClick, score }) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none",
        active 
          ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(0,212,255,0.15)] ring-1 ring-primary/30" 
          : "border-border hover:border-border/80 hover:bg-card/40"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xl transition-all",
        active 
          ? "border-primary bg-primary/20 text-primary scale-105" 
          : "border-border bg-card text-muted-foreground group-hover:text-primary group-hover:border-primary/50"
      )}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-sm font-bold truncate transition-colors",
          active ? "text-primary" : "text-foreground"
        )}>
          {item.name}
        </div>
        <div className="text-xs text-muted-foreground truncate leading-relaxed">
          {item.desc}
        </div>
      </div>
      {score !== undefined && (
        <div className="flex flex-col items-end gap-1.5">
          <ScoreDots score={score} />
          <span className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">Compat</span>
        </div>
      )}
    </div>
  )
}

export default function ConfigPanel({
  projectName, setProjectName,
  orgName, setOrgName,
  arch, setArch,
  state, setState,
  feats, toggleFeat,
  onDownload, downloading, onHelp, onPushGithub
}) {
  const [showReco, setShowReco] = useState(false)
  const [activeSection, setActiveSection] = useState('project-info')

  const applyReco = (reco) => {
    setArch(reco.arch)
    setState(reco.state)
    // Synchronize features
    reco.feats.forEach(f => {
      if (!feats.includes(f)) toggleFeat(f)
    })
    feats.forEach(f => {
      if (!reco.feats.includes(f)) toggleFeat(f)
    })
    setShowReco(false)
  }

  const groupedFeatures = FEATURES.reduce((acc, feat) => {
    if (!acc[feat.category]) acc[feat.category] = []
    acc[feat.category].push(feat)
    return acc
  }, {})

  return (
    <aside className="w-[420px] border-r border-border bg-card/40 flex flex-col h-full relative z-20 overflow-hidden shrink-0 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Recommendation Overlay */}
      {showReco && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full h-full max-w-sm flex flex-col glass rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Lightbulb className="w-5 h-5" />
                <span className="font-bold tracking-tight">Recommendations</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowReco(false)} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {PROJECT_TYPES.map(pt => (
                <div 
                  key={pt.id} 
                  className="p-4 rounded-2xl border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                  onClick={() => applyReco(pt.recommend)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{pt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm tracking-tight">{pt.label}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug">{pt.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="font-mono text-[10px] uppercase">{pt.recommend.arch}</Badge>
                    <Plus className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="secondary" className="font-mono text-[10px] uppercase">{pt.recommend.state}</Badge>
                  </div>
                  <div className="text-[10px] italic text-muted-foreground/80 line-clamp-2">
                    {pt.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <Button 
          variant="outline" 
          className="w-full mb-6 gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 py-6 rounded-2xl transition-all shadow-[0_4px_15px_rgba(0,212,255,0.05)]"
          onClick={() => setShowReco(true)}
        >
          <Lightbulb className="w-4 h-4" />
          Recommend by Project Type
        </Button>

        <Accordion 
          type="single" 
          collapsible 
          value={activeSection} 
          onValueChange={setActiveSection}
          className="space-y-4"
        >
          <AccordionItem value="project-info" className="border-none">
            <AccordionTrigger className="hover:no-underline group [&[data-state=open]>div>div>div]:bg-primary">
              <HeaderLabel number="00" title="Project Info" icon={<Settings2 className="w-4 h-4" />} />
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-5">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-[11px] uppercase tracking-widest pl-1">Project Name</Label>
                <Input
                  className="bg-background/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl py-5"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  placeholder="my_app"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-[11px] uppercase tracking-widest pl-1">Organization / Bundle ID</Label>
                <Input
                  className="bg-background/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl py-5"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                  placeholder="com.example"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="architecture" className="border-none">
            <AccordionTrigger className="hover:no-underline group [&[data-state=open]>div>div>div]:bg-primary">
              <HeaderLabel number="01" title="Architecture" icon={<Shapes className="w-4 h-4" />} />
            </AccordionTrigger>
            <AccordionContent className="pt-2 grid grid-cols-1 gap-3">
              {ARCHITECTURES.map(a => (
                <ChoiceCard
                  key={a.id}
                  item={a}
                  active={arch === a.id}
                  onClick={() => setArch(a.id)}
                />
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="state" className="border-none">
            <AccordionTrigger className="hover:no-underline group [&[data-state=open]>div>div>div]:bg-primary">
              <HeaderLabel number="02" title="State Management" icon={<Zap className="w-4 h-4" />} />
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-3">
              {STATE_MANAGERS.map(s => (
                <ChoiceCard
                  key={s.id}
                  item={s}
                  active={state === s.id}
                  onClick={() => setState(s.id)}
                  score={COMPATIBILITY[arch]?.[s.id]}
                />
              ))}
              <div className={cn(
                "mt-4 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono",
                COMPATIBILITY[arch]?.[state] >= 9 ? "bg-green-500/10 border-green-500/30 text-green-500" :
                COMPATIBILITY[arch]?.[state] >= 7 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" :
                "bg-red-500/10 border-red-500/30 text-red-500"
              )}>
                {COMPATIBILITY[arch]?.[state] >= 9 ? '✅' : COMPATIBILITY[arch]?.[state] >= 7 ? '⚠️' : '❌'}
                Compatibility: {COMPATIBILITY[arch]?.[state]}/10
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features" className="border-none">
            <AccordionTrigger className="hover:no-underline group [&[data-state=open]>div>div>div]:bg-primary">
              <HeaderLabel number="03" title="Features" icon={<Package className="w-4 h-4" />} />
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-6">
              {Object.entries(groupedFeatures).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">{category}</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map(f => (
                      <div
                        key={f.id}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-all select-none",
                          feats.includes(f.id)
                            ? "bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(0,212,255,0.3)] scale-105"
                            : "bg-card/50 border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all-custom"
                        )}
                        onClick={() => toggleFeat(f.id)}
                        title={f.desc}
                      >
                        {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-card/60 backdrop-blur-md space-y-3">
        <div className="grid grid-cols-5 gap-2">
          <Button 
            variant="outline" 
            className="col-span-1 h-12 p-0 rounded-xl"
            onClick={onHelp}
            title="Guide"
          >
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button
            variant="outline"
            className="col-span-4 h-12 rounded-xl gap-2 font-bold border-accent/30 text-accent hover:bg-accent/10 transition-all group"
            onClick={onPushGithub}
            disabled={downloading}
          >
            <GitPullRequest className="w-4 h-4 transition-transform group-hover:scale-125" />
            Push to GitHub
          </Button>
        </div>
        <Button
          variant="cyber"
          className="w-full h-14 rounded-2xl gap-3 font-extrabold text-base transition-all-custom group"
          onClick={onDownload}
          disabled={downloading}
        >
          {downloading ? (
            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
          )}
          {downloading ? 'GENERATING...' : 'DOWNLOAD .ZIP'}
        </Button>
      </div>
    </aside>
  )
}

function HeaderLabel({ number, title, icon }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
        <span className="font-mono text-xs opacity-40">{number}</span>
        <div className="w-1 h-3 bg-border rounded-full transition-all" />
        <span className="font-bold tracking-tight text-sm uppercase">{title}</span>
      </div>
      <div className="text-muted-foreground ml-auto group-data-[state=open]:text-primary transition-colors">
        {icon}
      </div>
    </div>
  )
}
