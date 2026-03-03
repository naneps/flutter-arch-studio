import { useState } from 'react'
import { ARCHITECTURES, FEATURES, STATE_MANAGERS } from '../data/constants.js'
import { COMPATIBILITY, PROJECT_TYPES } from '../data/recommendations.js'
import styles from './ConfigPanel.module.css'

function ScoreDots({ score }) {
  return (
    <div className={styles.score}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`${styles.scoreDot} ${i < Math.round(score / 2) ? styles.scoreDotFill : ''}`} />
      ))}
    </div>
  )
}

function ChoiceCard({ item, active, onClick, score }) {
  return (
    <div
      className={`${styles.card} ${active ? styles.cardActive : ''}`}
      onClick={onClick}
    >
      <span className={styles.cardIcon}>{item.icon}</span>
      <div className={styles.cardBody}>
        <div className={`${styles.cardName} ${active ? styles.cardNameActive : ''}`}>
          {item.name}
        </div>
        <div className={styles.cardDesc}>{item.desc}</div>
      </div>
      {score !== undefined && <ScoreDots score={score} />}
    </div>
  )
}

export default function ConfigPanel({
  projectName, setProjectName,
  orgName, setOrgName,
  arch, setArch,
  state, setState,
  feats, toggleFeat,
  onDownload, downloading, onHelp
}) {
  const [showReco, setShowReco] = useState(false)

  const applyReco = (reco) => {
    setArch(reco.arch)
    setState(reco.state)
    // set feats
    reco.feats.forEach(f => {
      if (!feats.includes(f)) toggleFeat(f)
    })
    feats.forEach(f => {
      if (!reco.feats.includes(f)) toggleFeat(f)
    })
    setShowReco(false)
  }

  return (
    <aside className={styles.panel}>
      {/* Recommendation modal */}
      {showReco && (
        <div className={styles.recoOverlay}>
          <div className={styles.recoPanel}>
            <div className={styles.recoHeader}>
              <span className={styles.recoTitle}>💡 Project Type Recommendations</span>
              <button className={styles.recoClose} onClick={() => setShowReco(false)}>✕</button>
            </div>
            <div className={styles.recoList}>
              {PROJECT_TYPES.map(pt => (
                <div key={pt.id} className={styles.recoItem} onClick={() => applyReco(pt.recommend)}>
                  <div className={styles.recoItemHeader}>
                    <span className={styles.recoIcon}>{pt.icon}</span>
                    <div>
                      <div className={styles.recoItemTitle}>{pt.label}</div>
                      <div className={styles.recoItemDesc}>{pt.desc}</div>
                    </div>
                  </div>
                  <div className={styles.recoStack}>
                    <span className={styles.recoTag}>{pt.recommend.arch}</span>
                    <span className={styles.recoPlus}>+</span>
                    <span className={styles.recoTag}>{pt.recommend.state}</span>
                  </div>
                  <div className={styles.recoReason}>{pt.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.scroll}>
        {/* Reco button */}
        <button className={styles.recoBtn} onClick={() => setShowReco(true)}>
          💡 Recommend for my project type
        </button>

        <Section label="00" title="Project Info">
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Project Name</label>
            <input
              type="text"
              className={styles.inputField}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
              placeholder="my_app"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Organization / Bundle ID</label>
            <input
              type="text"
              className={styles.inputField}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
              placeholder="com.example"
            />
          </div>
        </Section>

        <Section label="01" title="Architecture">
          {ARCHITECTURES.map(a => (
            <ChoiceCard
              key={a.id}
              item={a}
              active={arch === a.id}
              onClick={() => setArch(a.id)}
            />
          ))}
        </Section>

        <Section label="02" title="State Management">
          {STATE_MANAGERS.map(s => (
            <ChoiceCard
              key={s.id}
              item={s}
              active={state === s.id}
              onClick={() => setState(s.id)}
              score={COMPATIBILITY[arch]?.[s.id]}
            />
          ))}
          <div className={styles.compatNote}>
            {COMPATIBILITY[arch]?.[state] >= 9 ? '✅' : COMPATIBILITY[arch]?.[state] >= 7 ? '⚠️' : '❌'}
            {' '}Compatibility with {arch}: {COMPATIBILITY[arch]?.[state]}/10
          </div>
        </Section>

        <Section label="03" title="Features">
          <div className={styles.pills}>
            {FEATURES.map(f => (
              <div
                key={f.id}
                className={`${styles.pill} ${feats.includes(f.id) ? styles.pillActive : ''}`}
                onClick={() => toggleFeat(f.id)}
                title={f.desc}
              >
                {f.label}
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className={styles.footer}>
        <button className={styles.helpBtn} onClick={onHelp} title="Show guide">
          ? Guide
        </button>
        <button
          className={styles.downloadBtn}
          onClick={onDownload}
          disabled={downloading}
        >
          {downloading ? '⏳ Generating...' : '⬇️ Download .zip'}
        </button>
      </div>
    </aside>
  )
}

function Section({ label, title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>
        <span>{label}</span>
        <span className={styles.divider} />
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}
