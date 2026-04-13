import { useState } from 'react'
import { ARCHITECTURES, STATE_MANAGERS } from '../data/constants.js'
import { getCompatibilityNote } from '../data/recommendations.js'
import { highlightDart } from '../utils/highlighter.js'
import { Badge } from '@/components/ui/badge'
import { 
  Book, 
  Shapes, 
  Zap, 
  Link, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

function ArchDoc({ arch }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start gap-4 p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
          {arch.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-tight">{arch.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed italic">{arch.desc}</p>
        </div>
      </div>
      
      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
        <p className="text-sm leading-relaxed text-foreground/80">{arch.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest font-mono">
            <CheckCircle2 className="w-4 h-4" /> Pros
          </div>
          <div className="space-y-3">
            {arch.pros.map((p, i) => (
              <div key={i} className="flex gap-3 text-xs font-mono text-muted-foreground leading-relaxed">
                <span className="text-emerald-500 font-bold">›</span> {p}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest font-mono">
            <AlertTriangle className="w-4 h-4" /> Cons
          </div>
          <div className="space-y-3">
            {arch.cons.map((c, i) => (
              <div key={i} className="flex gap-3 text-xs font-mono text-muted-foreground leading-relaxed">
                <span className="text-amber-500 font-bold">›</span> {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StateDoc({ sm }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-start gap-4 p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
          {sm.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-tight" style={{ color: sm.color }}>{sm.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed italic">{sm.desc}</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-secondary/30 border border-border/40">
        <p className="text-sm leading-relaxed text-foreground/80">{sm.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
          {sm.pros.map((p, i) => (
            <div key={i} className="flex gap-3 text-xs font-mono text-muted-foreground leading-relaxed">
              <span className="text-primary font-bold">›</span> {p}
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border/40 space-y-4">
          {sm.cons.map((c, i) => (
            <div key={i} className="flex gap-3 text-xs font-mono text-muted-foreground leading-relaxed">
              <span className="text-muted-foreground opacity-50 font-bold italic">×</span> {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompatibilityMatrix({ currentArch, currentState }) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="grid grid-cols-5 divide-x divide-y divide-border/20">
          <div className="bg-muted/30 aspect-square" />
          {STATE_MANAGERS.map(s => (
            <div key={s.id} className={cn(
              "p-4 flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter transition-all",
              s.id === currentState ? "bg-primary/10 text-primary" : "text-muted-foreground opacity-60"
            )}>
              <span className="text-lg">{s.icon}</span>
              {s.name.split(' ')[0]}
            </div>
          ))}
          {ARCHITECTURES.map(a => (
            <>
              <div key={a.id + '-row'} className={cn(
                "p-4 flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter transition-all",
                a.id === currentArch ? "bg-primary/10 text-primary" : "text-muted-foreground opacity-60"
              )}>
                <span className="text-lg">{a.icon}</span>
                {a.name.split(' ')[0]}
              </div>
              {STATE_MANAGERS.map(s => {
                const note = getCompatibilityNote(a.id, s.id)
                const isGood = note.startsWith('✅')
                const isWarn = note.startsWith('⚠️')
                const isCurrent = a.id === currentArch && s.id === currentState
                return (
                  <div
                    key={a.id + '-' + s.id}
                    className={cn(
                      "aspect-square flex items-center justify-center text-xl transition-all relative group/cell",
                      isGood ? "bg-emerald-500/5 hover:bg-emerald-500/10" : isWarn ? "bg-amber-500/5 hover:bg-amber-500/10" : "bg-red-500/5 hover:bg-red-500/10",
                      isCurrent && "ring-2 ring-primary ring-inset z-10"
                    )}
                    title={note.replace(/^[✅⚠️❌]\s*/, '')}
                  >
                    {isGood ? '✅' : isWarn ? '⚠️' : '❌'}
                    {isCurrent && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-xs font-mono text-primary text-center leading-relaxed">
        {getCompatibilityNote(currentArch, currentState)}
      </div>
    </div>
  )
}

export default function DocsPanel({ arch, state }) {
  const [section, setSection] = useState('intro')

  const currentArch = ARCHITECTURES.find(a => a.id === arch)
  const currentState = STATE_MANAGERS.find(s => s.id === state)

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center gap-1 p-4 pb-0 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'intro', label: 'Introduction', icon: <Book className="w-4 h-4" /> },
          { id: 'arch', label: 'Architecture', icon: <Shapes className="w-4 h-4" /> },
          { id: 'state', label: 'State Mgmt', icon: <Zap className="w-4 h-4" /> },
          { id: 'compat', label: 'Compatibility', icon: <Link className="w-4 h-4" /> },
          { id: 'compare', label: 'Comparison', icon: <BarChart3 className="w-4 h-4" /> },
        ].map(s => (
          <button
            key={s.id}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-t-2xl text-xs font-bold uppercase tracking-widest transition-all",
              section === s.id 
                ? "bg-card border-l border-t border-r border-border/50 text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-card/30"
            )}
            onClick={() => setSection(s.id)}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-card border-l border-border/50">
        {section === 'intro' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">Usage Guide</h2>
              <p className="text-muted-foreground text-sm italic">Generate production-ready Flutter apps in seconds.</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: "Configure Project", desc: "Set your project name and org ID in the left panel." },
                  { title: "Select Patterns", desc: "Choose architecture & state management that fits your scale." },
                  { title: "Modular Features", desc: "Toggle Auth, API, Router, or Firebase with one click." },
                  { title: "Developer Preview", desc: "Explore the codebase before downloading." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-5 p-5 rounded-3xl bg-secondary/20 border border-border/40 group hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">{i+1}</div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-3xl bg-black/40 border-2 border-primary/20 space-y-4">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]">
                   <Terminal className="w-4 h-4" /> Quick Integration Command
                </div>
                <div className="font-mono text-xs leading-relaxed text-hl-type p-4 bg-black/20 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2"><span className="text-muted-foreground opacity-50"># 1.</span> <span>flutter create . --project-name app_name</span></div>
                  <div className="flex items-center gap-2"><span className="text-muted-foreground opacity-50"># 2.</span> <span>flutter pub get</span></div>
                  <div className="flex items-center gap-2"><span className="text-muted-foreground opacity-50"># 3.</span> <span>flutter run</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'arch' && currentArch && (
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">Architecture Deep Dive</h2>
              <p className="text-muted-foreground text-sm italic">Structured for scalability and maintainability.</p>
            </div>
            
            <ArchDoc arch={currentArch} />

            <div className="space-y-6 bg-secondary/20 p-8 rounded-[40px] border border-border/40 text-center">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-8">Data Flow Visualization</h4>
              {arch === 'clean' && (
                <div className="max-w-md mx-auto space-y-2">
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/30 text-xs font-bold uppercase text-red-500">Presentation</div>
                  <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground opacity-30" />
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/30 text-xs font-bold uppercase text-blue-500 italic">Domain (Core)</div>
                  <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground opacity-30 rotate-180" />
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 text-xs font-bold uppercase text-emerald-500">Data Impl</div>
                </div>
              )}
              {arch === 'mvvm' && (
                <div className="max-w-md mx-auto space-y-2">
                  <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/30 text-xs font-bold uppercase text-purple-500">View (UI)</div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground opacity-30 h-8">↕</div>
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/30 text-xs font-bold uppercase text-blue-500">ViewModel (Logic)</div>
                  <div className="flex items-center justify-center h-8 text-muted-foreground opacity-30">↓</div>
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/30 text-xs font-bold uppercase text-emerald-500">Model / Services</div>
                </div>
              )}
               {/* others handled similarly simple */}
            </div>
          </div>
        )}

        {section === 'state' && currentState && (
          <div className="space-y-12">
             <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">State Management</h2>
              <p className="text-muted-foreground text-sm italic">Reactive patterns for efficient UI updates.</p>
            </div>
            
            <StateDoc sm={currentState} />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] font-mono">
                <Code2 className="w-4 h-4" /> Implementation Snapshot
              </div>
              <div className="rounded-3xl border border-white/5 bg-[#0d1117] overflow-hidden shadow-2xl">
                <div className="px-6 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{state}_pattern.dart</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <pre
                  className="p-8 font-mono text-[13px] leading-[1.75] overflow-x-auto custom-scrollbar"
                  dangerouslySetInnerHTML={{
                    __html: highlightDart(
                      state === 'bloc' ? `// Cubit Implementation\nclass AuthCubit extends Cubit<AuthState> {\n  final LoginUseCase _login;\n  \n  void login(String e, String p) async {\n    emit(AuthLoading());\n    final result = await _login(params);\n    emit(result.fold((l) => AuthError(l), (r) => AuthSuccess(r)));\n  }\n}` :
                      state === 'riverpod' ? `// Functional Provider\n@riverpod\nclass UserNotifier extends _$UserNotifier {\n  @override\n  FutureOr<User?> build() => null;\n\n  Future<void> login(e, p) async {\n    state = const AsyncLoading();\n    state = await AsyncValue.guard(() => repo.login(e, p));\n  }\n}` :
                      `// Component Controller/Notifier\nclass StoreNotifier extends ChangeNotifier {\n  final List<Item> items = [];\n  \n  void add(Item item) {\n    items.add(item);\n    notifyListeners();\n  }\n}`
                    )
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {section === 'compat' && (
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">Compatibility</h2>
              <p className="text-muted-foreground text-sm italic">Best-fit pairings for your stack.</p>
            </div>
            <CompatibilityMatrix currentArch={arch} currentState={state} />
          </div>
        )}

        {section === 'compare' && (
          <div className="space-y-12 max-w-5xl">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">Side-By-Side Comparison</h2>
              <p className="text-muted-foreground text-sm italic">Every architecture has its place.</p>
            </div>
            
            <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="p-6 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/20">Metric</th>
                      {ARCHITECTURES.map(a => (
                        <th key={a.id} className={cn(
                          "p-6 text-center text-xs font-black uppercase tracking-tighter whitespace-nowrap",
                          a.id === arch ? "text-primary bg-primary/5 shadow-inner" : "text-foreground/80"
                        )}>
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl">{a.icon}</span>
                            {a.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {[
                      { label: 'Complexity', vals: ['High', 'Medium', 'Medium', 'Low'] },
                      { label: 'Testability', vals: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐'] },
                      { label: 'Boilerplate', vals: ['High', 'Medium', 'Medium', 'Low'] },
                      { label: 'Team Size', vals: ['Any', 'Small-Med', 'Any', 'Solo-Small'] },
                      { label: 'Best For', vals: ['Enterprise', 'SaaS/Apps', 'Large teams', 'Rapid MVP'] },
                      { label: 'Curve', vals: ['Steep', 'Moderate', 'Moderate', 'Easy'] },
                    ].map(row => (
                      <tr key={row.label} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-6 text-xs font-bold text-muted-foreground font-mono bg-secondary/10 w-40">{row.label}</td>
                        {row.vals.map((v, i) => (
                          <td key={i} className={cn(
                            "p-6 text-center text-[13px] font-medium tracking-tight whitespace-nowrap",
                            ARCHITECTURES[i].id === arch ? "bg-primary/5 text-primary-foreground font-bold shadow-inner" : "text-muted-foreground"
                          )}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
