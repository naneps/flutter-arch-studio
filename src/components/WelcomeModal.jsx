import { useState } from 'react'
import styles from './WelcomeModal.module.css'

const STEPS = [
  {
    icon: <img src="/favicon.png" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />,
    title: 'Flutter Arch Studio',
    subtitle: 'Generate Flutter project boilerplate yang siap production',
    content: (
      <div>
        <p>Tool ini membantu kamu generate Flutter project dengan struktur yang proper — tinggal pilih arsitektur, state management, dan fitur yang dibutuhkan.</p>
        <div className="feature-grid">
          {[
            { icon: '📁', text: 'Folder structure sesuai arch yang dipilih' },
            { icon: '🎯', text: 'File Dart dengan kode yang bisa langsung dipakai' },
            { icon: '⬇️', text: 'Download .zip — langsung flutter pub get' },
            { icon: '📚', text: 'Dokumentasi tiap arsitektur & state management' },
          ].map((f, i) => (
            <div key={i} className="feature-item">
              <span>{f.icon}</span> {f.text}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: '🏛️',
    title: 'Pilih Architecture',
    subtitle: 'Tiap arsitektur punya trade-off yang berbeda',
    content: (
      <div>
        {[
          { name: 'Clean Architecture', icon: '🏛️', when: 'Tim besar, enterprise, butuh testability tinggi', avoid: 'Solo project atau MVP yang harus ship cepat' },
          { name: 'MVVM', icon: '⚙️', when: 'Tim kecil-medium, SaaS, butuh balance simplicity & structure', avoid: 'Kalau ViewModel mulai fat, pertimbangkan Clean Arch' },
          { name: 'Feature-First', icon: '📦', when: 'Tim yang split per feature, app yang terus berkembang', avoid: 'Project kecil dengan 1-2 developer' },
          { name: 'MVC + GetX', icon: '🎯', when: 'MVP cepat, solo developer, prototype', avoid: 'App yang butuh testing intensif' },
        ].map(a => (
          <div key={a.name} className="arch-item">
            <div className="arch-name">{a.icon} {a.name}</div>
            <div className="arch-when">✅ Pakai kalau: {a.when}</div>
            <div className="arch-avoid">⚠️ Hindari kalau: {a.avoid}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '⚡',
    title: 'Pilih State Management',
    subtitle: 'Setiap pilihan punya karakteristik yang berbeda',
    content: (
      <div>
        {[
          { name: 'BLoC / Cubit', icon: '🧱', best: 'Clean Architecture, enterprise, butuh strict separation' },
          { name: 'Riverpod', icon: '🌊', best: 'Modern apps, compile-safe, flexible — recommended untuk most cases' },
          { name: 'Provider', icon: '🔌', best: 'Belajar Flutter, simple apps, atau tim yang sudah familiar' },
          { name: 'GetX', icon: '⚡', best: 'MVC pattern, rapid development, all-in-one solution' },
        ].map(s => (
          <div key={s.name} className="state-item">
            <div className="state-name">{s.icon} {s.name}</div>
            <div className="state-best">Best for: {s.best}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '📦',
    title: 'Cara Pakai Tool',
    subtitle: 'Step-by-step dari generate sampai coding',
    content: (
      <div>
        {[
          { step: '01', title: 'Pilih Architecture + State Management', desc: 'Klik card di left panel. Output otomatis update real-time.' },
          { step: '02', title: 'Toggle Features yang dibutuhkan', desc: 'Auth, API, Router, Theme, dll — setiap fitur menambahkan file dan dependency.' },
          { step: '03', title: 'Preview di Explorer tab', desc: 'Klik file di folder tree untuk lihat kodenya. Ada syntax highlighting dan file description.' },
          { step: '04', title: 'Download .zip', desc: 'Klik tombol Download. Extract, flutter pub get, langsung coding.' },
          { step: '05', title: 'Baca Dokumentasi', desc: 'Tab Docs punya architecture docs, state management guide, dan compatibility matrix.' },
        ].map(s => (
          <div key={s.step} className="how-item">
            <div className="how-step">{s.step}</div>
            <div>
              <div className="how-title">{s.title}</div>
              <div className="how-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '🚀',
    title: 'Cara Integrasi / Penggunaan',
    subtitle: 'Apa yang harus dilakukan setelah download?',
    content: (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>📍 Opsi 1: Project Baru (Rekomendasi)</p>
          <ul style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px', fontFamily: 'var(--font-mono)' }}>
            <li>Extract file <code>.zip</code> yang didownload ke folder kosong.</li>
            <li>Buka folder tersebut di terminal (VS Code / Android Studio).</li>
            <li>Jalankan script <code>sh setup.sh</code> atau klik <code>setup.bat</code> (di Windows).</li>
            <li><i>(Script ini akan menjalankan <code>flutter create .</code> untuk generate OS folder (iOS/Android/Web) & <code>flutter pub get</code>)</i></li>
            <li>Project siap di-run (<code>flutter run</code>).</li>
          </ul>
        </div>
        <div>
          <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>📍 Opsi 2: Replace ke Project Existing</p>
          <ul style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px', fontFamily: 'var(--font-mono)' }}>
            <li><i>Hati-hati! Sebaiknya backup project lama Anda.</i></li>
            <li>Extract zip, lalu copy folder <code>lib/</code>, <code>pubspec.yaml</code>, dan <code>analysis_options.yaml</code>.</li>
            <li>Paste dan replace file tersebut di project existing Anda.</li>
            <li>Jalankan <code>flutter pub get</code>.</li>
            <li>Sesuaikan nama package di import jika ada error (misal: <code>import 'package:nama_project_lama/...'</code>).</li>
          </ul>
        </div>
      </div>
    ),
  },
]

export default function WelcomeModal({ onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.icon}>{current.icon}</div>
          <div>
            <div className={styles.title}>{current.title}</div>
            <div className={styles.subtitle}>{current.subtitle}</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <style>{`
            .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
            .feature-item { background: #111118; border: 1px solid #2a2a38; border-radius: 8px; padding: 12px; font-size: 13px; color: #94a3b8; display: flex; align-items: center; gap: 10px; }
            .arch-item { background: #111118; border: 1px solid #2a2a38; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
            .arch-name { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; }
            .arch-when { font-size: 12px; color: #10b981; font-family: 'JetBrains Mono', monospace; margin-bottom: 3px; }
            .arch-avoid { font-size: 12px; color: #f59e0b; font-family: 'JetBrains Mono', monospace; }
            .state-item { background: #111118; border: 1px solid #2a2a38; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
            .state-name { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 5px; }
            .state-best { font-size: 12px; color: #64748b; font-family: 'JetBrains Mono', monospace; }
            .how-item { display: flex; gap: 16px; margin-bottom: 16px; align-items: flex-start; }
            .how-step { width: 32px; height: 32px; border-radius: 8px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: #00d4ff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'JetBrains Mono', monospace; }
            .how-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 4px; }
            .how-desc { font-size: 12px; color: #64748b; line-height: 1.5; font-family: 'JetBrains Mono', monospace; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.7; margin-bottom: 12px; }
          `}</style>
          {current.content}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {/* Dots */}
          <div className={styles.dots}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === step ? styles.dotActive : ''}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>

          <div className={styles.footerBtns}>
            {step > 0 && (
              <button className={styles.prevBtn} onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className={styles.nextBtn} onClick={() => setStep(s => s + 1)}>
                Next →
              </button>
            ) : (
              <button className={styles.startBtn} onClick={onClose}>
                🚀 Start Building
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
