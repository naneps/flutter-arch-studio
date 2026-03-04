import { useState } from 'react'
import styles from './WelcomeModal.module.css'

const STEPS = [
  {
    icon: <img src="/favicon.png" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />,
    title: 'Flutter Arch Studio',
    subtitle: 'Bikin boilerplate project Flutter yang udah siap production! 🚀',
    content: (
      <div>
        <p>Aplikasi ini bakal bantuin kamu generate project Flutter dengan struktur yang mantap — tinggal pilih arsitektur, state management, sama fitur yang kamu butuhin.</p>
        <div className="feature-grid">
          {[
            { icon: '📁', text: 'Struktur folder ngikutin arsitektur yang kamu pilih' },
            { icon: '🎯', text: 'File Dart-nya udah ada kode dasar, tinggal lanjutin ngoding aja' },
            { icon: '⬇️', text: 'Tinggal download .zip — langsung aja flutter pub get' },
            { icon: '📚', text: 'Dokumentasi lengkap buat tiap arsitektur & state management' },
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
    subtitle: 'Tiap arsitektur punya gaya masing-masing, pilih yang pas buat project-mu',
    content: (
      <div>
        {[
          { name: 'Clean Architecture', icon: '🏛️', when: 'Buat tim besar, enterprise, atau kalo butuh testability yang super tinggi', avoid: 'Project solo atau MVP yang pengen buru-buru rilis' },
          { name: 'MVVM', icon: '⚙️', when: 'Tim kecil-medium, aplikasi SaaS, yang butuh balance antara simplicity & struktur rapi', avoid: 'Kalo ViewModel udah kerasa kepanjangan (fat), mending beralih ke Clean Arch' },
          { name: 'Feature-First', icon: '📦', when: 'Kalo tim ngerjain per fitur, dan aplikasinya bakal terus berkembang gede', avoid: 'Project kecil-kecilan yang cuma digarap 1-2 orang' },
          { name: 'MVC + GetX', icon: '🎯', when: 'Bikin MVP cepet, solo dev yang males ribet, atau sekedar nyobain prototype', avoid: 'Aplikasi gede yang butuh testing ketat dan maintain jangka panjang' },
        ].map(a => (
          <div key={a.name} className="arch-item">
            <div className="arch-name">{a.icon} {a.name}</div>
            <div className="arch-when">✅ Cocok buat: {a.when}</div>
            <div className="arch-avoid">⚠️ Mending jangan buat: {a.avoid}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '⚡',
    title: 'Pilih State Management',
    subtitle: 'Pilih senjatamu! Tiap state management punya rasanya sendiri',
    content: (
      <div>
        {[
          { name: 'BLoC / Cubit', icon: '🧱', best: 'Clean Architecture, enterprise, yang butuh pemisahan logic bener-bener strict' },
          { name: 'Riverpod', icon: '🌊', best: 'Aplikasi modern, compile-safe, fleksibel — paling direkomendasiin buat banyak kasus!' },
          { name: 'Provider', icon: '🔌', best: 'Lagi belajar Flutter, aplikasi simple, atau kalo tim udah kebiasa pakenya' },
          { name: 'GetX', icon: '⚡', best: 'Gaya MVC, develop cepet banget, solusi all-in-one yang sat-set' },
        ].map(s => (
          <div key={s.name} className="state-item">
            <div className="state-name">{s.icon} {s.name}</div>
            <div className="state-best">Paling pas buat: {s.best}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: '📦',
    title: 'Cara Pakai Tool',
    subtitle: 'Step-by-step dari generate sampe siap ngoding',
    content: (
      <div>
        {[
          { step: '01', title: 'Pilih Architecture + State Management', desc: 'Tinggal klik card di panel kiri, output di kanan bakal langsung update otomatis lho.' },
          { step: '02', title: 'Toggle Fitur yang kamu butuhin', desc: 'Butuh Auth, API, Router, Theme, dll? Centang aja, file sama dependency-nya bakal otomatis ditambahin.' },
          { step: '03', title: 'Intip kodenya di Explorer', desc: 'Klik aja file di folder tree buat ngintip daleman kodenya. Udah ada syntax highlighting-nya juga!' },
          { step: '04', title: 'Download .zip', desc: 'Kalo udah sreg, klik Download. Tinggal extract, jalankan flutter pub get, langsung coding deh.' },
          { step: '05', title: 'Baca Dokumentasi', desc: 'Jangan lupa mampir ke tab Docs ya, ada panduan arsitektur sama compatibility matrix-nya lho.' },
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
    subtitle: 'Ngapain aja sih abis selesai download?',
    content: (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>📍 Opsi 1: Mulai Project Baru (Paling Disaranin)</p>
          <ul style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px', fontFamily: 'var(--font-mono)' }}>
            <li>Extract file <code>.zip</code> yang barusan kamu download ke folder kosong.</li>
            <li>Buka folder itu di terminal atau IDE (VS Code / Android Studio) kesayanganmu.</li>
            <li>Jalanin aja script <code>sh setup.sh</code> atau double-click <code>setup.bat</code> (kalo kamu di Windows).</li>
            <li><i>(Script ini bakal ngejalanin <code>flutter create .</code> buat bikin folder OS kayak iOS/Android/Web, plus <code>flutter pub get</code>)</i></li>
            <li>Boom! Project udah siap di-run (<code>flutter run</code>). 🚀</li>
          </ul>
        </div>
        <div>
          <p style={{ color: '#f59e0b', fontWeight: 'bold' }}>📍 Opsi 2: Timpa ke Project yang Udah Ada</p>
          <ul style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px', fontFamily: 'var(--font-mono)' }}>
            <li><i>Awas hati-hati! Mendingan kamu backup dulu project lama kamu ya.</i></li>
            <li>Extract zip-nya, terus copy folder <code>lib/</code>, <code>pubspec.yaml</code>, dan <code>analysis_options.yaml</code>.</li>
            <li>Paste dan timpa file-file itu di project kamu.</li>
            <li>Jalanin <code>flutter pub get</code> biar package-nya kedownload.</li>
            <li>Kalo ada error import, tinggal sesuaian aja nama package-nya (misalnya ganti ke <code>import 'package:nama_project_lama/...'</code>).</li>
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
                🚀 Mulai Bangun App-mu!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
