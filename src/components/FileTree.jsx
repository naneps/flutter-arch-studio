import { useState } from 'react'
import styles from './FileTree.module.css'

function getIcon(name, isDir) {
  if (isDir) return { icon: '📁', color: '#f59e0b' }
  if (name.endsWith('.dart')) return { icon: '🎯', color: '#54c5f8' }
  if (name.endsWith('.yaml') || name.endsWith('.yml')) return { icon: '📄', color: '#10b981' }
  if (name.endsWith('.md')) return { icon: '📝', color: '#a78bfa' }
  if (name.startsWith('.')) return { icon: '⚙️', color: '#64748b' }
  return { icon: '📄', color: '#94a3b8' }
}

function TreeNode({ name, node, depth, fullPath, selectedFile, onSelect }) {
  const isDir = node !== null && typeof node === 'object'
  const [open, setOpen] = useState(depth < 2)
  const { icon, color } = getIcon(name, isDir)
  const isSelected = selectedFile === fullPath

  return (
    <div>
      <div
        className={`${styles.node} ${isSelected ? styles.nodeSelected : ''}`}
        style={{ paddingLeft: depth * 14 + 8 }}
        onClick={() => isDir ? setOpen(o => !o) : onSelect(fullPath)}
      >
        <span className={styles.arrow}>{isDir ? (open ? '▾' : '▸') : ' '}</span>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={{ color: isSelected ? 'var(--accent)' : color, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          {name}
        </span>
      </div>
      {isDir && open && Object.entries(node).sort(([,a],[,b]) => {
        // folders first
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
          fullPath={`${fullPath}/${k}`}
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
    <div className={styles.tree}>
      <div className={styles.hint}>Click a file to preview</div>
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
