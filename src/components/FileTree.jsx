import { useState } from 'react'
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  Settings,
  FileText,
  FileCode
} from 'lucide-react'
import { cn } from '@/lib/utils'

function getIcon(name, isDir) {
  if (isDir) return { icon: Folder, color: "text-amber-500" }
  if (name.endsWith('.dart')) return { icon: FileCode, color: "text-sky-400" }
  if (name.endsWith('.yaml') || name.endsWith('.yml')) return { icon: FileText, color: "text-emerald-400" }
  if (name.endsWith('.md')) return { icon: FileText, color: "text-purple-400" }
  if (name.startsWith('.')) return { icon: Settings, color: "text-muted-foreground" }
  return { icon: File, color: "text-muted-foreground/70" }
}

function TreeNode({ name, node, depth, fullPath, selectedFile, onSelect }) {
  const isDir = node !== null && typeof node === 'object'
  const [open, setOpen] = useState(depth < 2)
  const { icon: Icon, color } = getIcon(name, isDir)
  const isSelected = selectedFile === fullPath

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1 pr-2 rounded-md cursor-pointer transition-colors group",
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-card/40"
        )}
        style={{ paddingLeft: depth * 14 + 12 }}
        onClick={() => isDir ? setOpen(o => !o) : onSelect(fullPath)}
      >
        <div className="w-4 h-4 flex items-center justify-center text-muted-foreground">
          {isDir ? (open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : null}
        </div>
        <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-primary" : color)} />
        <span className={cn(
          "font-mono text-[12px] truncate",
          isSelected ? "text-primary font-bold" : "text-foreground/80 group-hover:text-foreground"
        )}>
          {name}
        </span>
      </div>
      {isDir && open && Object.entries(node).sort(([,a],[,b]) => {
        const aDir = a !== null && typeof a === 'object'
        const bDir = b !== null && typeof b === 'object'
        if (aDir && !bDir) return -1
        if (!aDir && bDir) return 1
        return 0
      }).map(([k, v]) => (
        <TreeNode
          key={k}
          name={k}
          node={v}
          depth={depth + 1}
          fullPath={fullPath ? `${fullPath}/${k}` : k}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export function buildTree(files) {
  const tree = {}
  Object.keys(files).sort().forEach(path => {
    const parts = path.split('/')
    let node = tree
    parts.forEach((part, i) => {
      if (!node[part]) node[part] = i === parts.length - 1 ? null : {}
      if (node[part] !== null) node = node[part]
    })
  })
  return tree
}

export default function FileTree({ files, selectedFile, onSelect }) {
  const tree = buildTree(files)

  return (
    <div className="py-2.5 px-2 h-full overflow-y-auto custom-scrollbar">
      <div className="font-mono text-[9px] text-muted-foreground/60 tracking-[0.2em] px-3 pb-3 uppercase">
        Project Explorer
      </div>
      {Object.entries(tree).map(([k, v]) => (
        <TreeNode
          key={k}
          name={k}
          node={v}
          depth={0}
          fullPath={k}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
