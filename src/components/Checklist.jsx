import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

function buildChecklist(projectName, arch, state, feats) {
  const needsBuildRunner = state === 'bloc' || state === 'riverpod' || feats.includes('codegen')
  const snakeCaseName = projectName.replace(/-/g, '_').toLowerCase()
  return [
    { text: 'Extract .zip and buka terminal di folder tersebut', tag: 'file' },
    { text: `flutter create . --org com.example --project-name ${snakeCaseName}`, tag: 'terminal' },
    { text: 'flutter pub get (untuk sinkronisasi dependencies)', tag: 'terminal' },
    ...(feats.includes('env') ? [
      { text: 'cp .env.example .env  →  isi dengan value asli', tag: 'security' },
      { text: 'Tambahkan .env ke .gitignore (sudah ada di template)', tag: 'security' },
    ] : []),
    ...(feats.includes('firebase') ? [
      { text: 'flutter pub global activate flutterfire_cli', tag: 'terminal' },
      { text: 'flutterfire configure  →  pilih project Firebase', tag: 'terminal' },
    ] : []),
    ...(needsBuildRunner ? [
      { text: 'flutter pub run build_runner build --delete-conflicting-outputs', tag: 'codegen' },
    ] : []),
    { text: 'Setup DI / configureDependencies() di injection_container.dart', tag: 'code' },
    ...(feats.includes('router') ? [{ text: 'Define semua routes di app_router.dart', tag: 'code' }] : []),
    ...(feats.includes('auth') ? [
      { text: 'Ganti URL API di DioClient / AuthRemoteDataSource', tag: 'code' },
      { text: 'Test login flow end-to-end', tag: 'test' },
    ] : []),
    { text: 'Write unit tests untuk use cases / notifiers', tag: 'test' },
    { text: 'flutter run — selamat coding! 🎉', tag: 'done' },
  ]
}

const TAG_VARIANTS = {
  terminal: 'outline',
  file: 'secondary',
  security: 'destructive',
  codegen: 'cyber',
  code: 'default',
  test: 'secondary',
  done: 'cyber',
}

export default function Checklist({ projectName, arch, state, feats }) {
  const [checked, setChecked] = useState({})
  const items = buildChecklist(projectName, arch, state, feats)
  const doneCount = Object.values(checked).filter(Boolean).length
  const progress = (doneCount / items.length) * 100

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/40 p-6 rounded-3xl border border-border/50">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Setup Checklist</h2>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <span>{arch}</span>
            <span className="opacity-30">/</span>
            <span>{state}</span>
            <span className="opacity-30">/</span>
            <span className="text-primary">{feats.length} features</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-mono">{doneCount} / {items.length}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Completed</span>
          </div>
          <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden border border-border/30">
            <div 
              className="h-full bg-primary shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {items.map((item, i) => {
          const isDone = !!checked[i]
          return (
            <div
              key={i}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none",
                isDone 
                  ? "bg-primary/5 border-primary/20 opacity-70" 
                  : "bg-card/20 border-border/50 hover:border-primary/40 hover:bg-card/40"
              )}
              onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
            >
              <Checkbox 
                checked={isDone} 
                className="w-5 h-5 rounded-md border-2 border-border group-hover:border-primary/50"
              />
              <span className={cn(
                "flex-1 text-sm font-medium transition-all",
                isDone ? "line-through text-muted-foreground" : "text-foreground"
              )}>
                {item.text}
              </span>
              <Badge 
                variant={TAG_VARIANTS[item.tag] || 'outline'}
                className="font-mono text-[9px] uppercase tracking-wider h-5"
              >
                {item.tag}
              </Badge>
            </div>
          )
        })}

        <div className="mt-4 p-5 rounded-2xl bg-secondary/30 border border-border/40 flex gap-4 items-start">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Quick Start Tip</p>
            <p className="text-sm leading-relaxed text-foreground/80">
              Setelah download .zip, extract lalu jalankan: 
              <code className="ml-2 px-2 py-0.5 bg-black/40 rounded border border-border/50 text-primary font-mono text-xs">
                cd {projectName} && flutter pub get
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
