import { useState } from 'react'
import styles from './Checklist.module.css'

function buildChecklist(arch, state, feats) {
  const needsBuildRunner = state === 'bloc' || state === 'riverpod'
  return [
    { text: 'flutter create my_app --org com.yourname', tag: 'terminal' },
    { text: 'flutter pub get  (setelah copy pubspec.yaml)', tag: 'terminal' },
    { text: `Buat folder structure: ${arch} architecture`, tag: 'structure' },
    { text: 'Copy semua file dari File Preview ke project', tag: 'file' },
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

const TAG_COLORS = {
  terminal: '#00d4ff',
  structure: '#f59e0b',
  file: '#a78bfa',
  security: '#ef4444',
  codegen: '#10b981',
  code: '#34d399',
  test: '#fb923c',
  done: '#10b981',
}

export default function Checklist({ arch, state, feats }) {
  const [checked, setChecked] = useState({})
  const items = buildChecklist(arch, state, feats)
  const doneCount = Object.values(checked).filter(Boolean).length

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Setup Checklist</div>
          <div className={styles.sub}>{arch} · {state} · {feats.length} features</div>
        </div>
        <div className={styles.progress}>
          <span className={styles.progressCount}>{doneCount}/{items.length}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(doneCount/items.length)*100}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {items.map((item, i) => {
          const done = !!checked[i]
          const color = TAG_COLORS[item.tag] || '#64748b'
          return (
            <div
              key={i}
              className={`${styles.item} ${done ? styles.itemDone : ''}`}
              onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
            >
              <div className={`${styles.checkbox} ${done ? styles.checkboxDone : ''}`}>
                {done && '✓'}
              </div>
              <span className={styles.itemText}>{item.text}</span>
              <span className={styles.tag} style={{ color, borderColor: color + '44' }}>
                {item.tag}
              </span>
            </div>
          )
        })}

        <div className={styles.tip}>
          💡 Setelah download .zip, extract lalu:
          {' '}<code className={styles.code}>cd my_app && flutter pub get</code>
        </div>
      </div>
    </div>
  )
}
