import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Layout, 
  Star,
  Terminal,
  Code2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    icon: <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent p-1 shadow-[0_0_20px_rgba(0,212,255,0.3)]"><img src="/favicon.png" alt="Logo" className="w-full h-full rounded-xl" /></div>,
    title: 'Flutter Arch Studio',
    subtitle: 'Bikin boilerplate project Flutter yang udah siap production! 🚀',
    content: (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-muted-foreground bg-card/50 p-4 rounded-2xl border border-border/50">
          Aplikasi ini bakal bantuin kamu generate project Flutter dengan struktur yang mantap — tinggal pilih arsitektur, state management, sama fitur yang kamu butuhin.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <Layout className="w-4 h-4 text-primary" />, text: 'Struktur folder industri' },
            { icon: <Code2 className="w-4 h-4 text-accent" />, text: 'Kode dasar boilerplate' },
            { icon: <Zap className="w-4 h-4 text-amber-500" />, text: 'Download .zip instan' },
            { icon: <Star className="w-4 h-4 text-purple-400" />, text: 'Best practices Docs' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/20 group hover:border-primary/30 transition-colors">
              <div className="shrink-0">{f.icon}</div>
              <span className="text-xs font-medium text-foreground/80">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <div className="text-4xl">🏛️</div>,
    title: 'Pilih Architecture',
    subtitle: 'Tiap arsitektur punya gaya masing-masing, pilih yang pas buat project-mu',
    content: (
      <div className="space-y-3">
        {[
          { name: 'Clean Architecture', icon: '🏛️', when: 'Buat tim besar, enterprise, testability tinggi', avoid: 'Project solo atau MVP buru-buru' },
          { name: 'MVVM', icon: '⚙️', when: 'Aplikasi SaaS, balance simplicity & struktur', avoid: 'Kalo ViewModel udah kerasa kepanjangan' },
          { name: 'Feature-First', icon: '📦', when: 'Tim ngerjain per fitur, aplikasi bakal gede', avoid: 'Project kecil 1-2 orang' },
          { name: 'MVC + GetX', icon: '🎯', when: 'Bikin MVP cepet, solo dev males ribet', avoid: 'Aplikasi gede yang butuh testing ketat' },
        ].map(a => (
          <div key={a.name} className="p-4 rounded-2xl border border-border/50 bg-card/30 space-y-2 hover:border-primary/30 transition-all">
            <div className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="text-lg">{a.icon}</span> {a.name}
            </div>
            <div className="text-[11px] font-mono text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/20">
              ✅ Cocok buat: {a.when}
            </div>
            <div className="text-[11px] font-mono text-amber-500 bg-amber-500/5 px-2 py-1 rounded-md border border-amber-500/20">
              ⚠️ Hindari buat: {a.avoid}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <div className="text-4xl">⚡</div>,
    title: 'State Management',
    subtitle: 'Pilih senjatamu! Tiap state management punya rasanya sendiri',
    content: (
      <div className="space-y-3">
        {[
          { name: 'BLoC / Cubit', icon: '🧱', best: 'Clean Arch, enterprise, strict logic separation' },
          { name: 'Riverpod', icon: '🌊', best: 'Modern, compile-safe, fleksibel — Recommended!' },
          { name: 'Provider', icon: '🔌', best: 'Lagi belajar, aplikasi simple, atau kebiasaan tim' },
          { name: 'GetX', icon: '⚡', best: 'Gaya MVC, develop cepet banget, all-in-one set-set' },
        ].map(s => (
          <div key={s.name} className="p-4 rounded-2xl border border-border/50 bg-card/30 flex items-center gap-4 group hover:border-primary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{s.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-bold">{s.name}</div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5 line-clamp-1">{s.best}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <div className="text-4xl text-primary">📦</div>,
    title: 'Cara Pakai Tool',
    subtitle: 'Step-by-step dari generate sampe siap ngoding',
    content: (
      <div className="space-y-3">
        {[
          { step: '01', title: 'Pilih Stack', desc: 'Klik card di panel kiri, preview langsung update.' },
          { step: '02', title: 'Toggle Fitur', desc: 'Auth, API, Router, dll? Centang aja langsung gas.' },
          { step: '03', title: 'Intip Kode', desc: 'Pake Explorer buat ngecek struktur & isi filenya.' },
          { step: '04', title: 'Download .zip', desc: 'Klik Download, extract, trus flutter pub get.' },
        ].map(s => (
          <div key={s.step} className="flex gap-4 p-4 rounded-2xl bg-card/20 border border-border/40 group hover:bg-card/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0">{s.step}</div>
            <div>
              <div className="text-sm font-bold mb-1 tracking-tight">{s.title}</div>
              <div className="text-[11px] font-mono text-muted-foreground leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <div className="text-4xl">🚀</div>,
    title: 'Integrasi',
    subtitle: 'Ngapain aja sih abis selesai download?',
    content: (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
            <Terminal className="w-4 h-4" /> 📍 Opsi 1: Mulai Project Baru
          </div>
          <ul className="space-y-2.5">
            {[
              "Extract file .zip ke folder kosong",
              "Buka terminal di folder tersebut",
              "Jalanin flutter create .",
              "Jalanin flutter pub get"
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-xs font-mono text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">{i+1}.</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" /> 📍 Opsi 2: Ke Project Lama
          </div>
          <p className="text-[11px] font-mono text-muted-foreground leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
            Backup dulu ya! Copy lib/ dan pubspec ke project lama, lalu sesuaikan nama package-nya.
          </p>
        </div>
      </div>
    ),
  },
]

export default function WelcomeModal({ onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-card border border-border/60 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-500">
        {/* Header */}
        <div className="p-8 pb-4 flex items-start gap-6 relative">
          <div className="shrink-0">{current.icon}</div>
          <div className="flex-1 pr-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{current.title}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed italic">{current.subtitle}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute top-6 right-6 rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          {current.content}
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 border-t border-border/40 bg-muted/20 flex flex-col gap-6">
          <div className="flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-8 bg-primary shadow-[0_0_8px_rgba(0,212,255,0.4)]" : "w-1.5 bg-border/60 hover:bg-border cursor-pointer"
                )}
                onClick={() => setStep(i)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-6 rounded-2xl gap-2 font-bold font-mono text-xs uppercase tracking-widest disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                className="px-8 rounded-2xl gap-2 font-bold font-mono text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground group shadow-lg shadow-primary/20"
              >
                Next <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button
                onClick={onClose}
                variant="cyber"
                className="px-8 rounded-2xl gap-2 font-extrabold font-mono text-xs uppercase tracking-widest group shadow-[0_0_20px_rgba(0,212,255,0.2)] animate-pulse"
              >
                🚀 Start Building
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
