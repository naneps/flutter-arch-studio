import styles from './AnimatedBackground.module.css'

const ORBS = [
    { color: 'var(--accent)', size: 600, top: '-15%', left: '-10%', delay: '0s', duration: '18s' },
    { color: 'var(--accent2)', size: 500, top: '50%', left: '70%', delay: '-6s', duration: '22s' },
    { color: 'var(--accent)', size: 350, top: '70%', left: '10%', delay: '-10s', duration: '26s' },
    { color: 'var(--accent3)', size: 280, top: '20%', left: '55%', delay: '-4s', duration: '20s' },
    { color: 'var(--accent2)', size: 220, top: '85%', left: '80%', delay: '-14s', duration: '30s' },
]

export default function AnimatedBackground() {
    return (
        <div className={styles.root} aria-hidden="true">
            {ORBS.map((orb, i) => (
                <div
                    key={i}
                    className={styles.orb}
                    style={{
                        '--orb-color': orb.color,
                        width: orb.size,
                        height: orb.size,
                        top: orb.top,
                        left: orb.left,
                        animationDelay: orb.delay,
                        animationDuration: orb.duration,
                    }}
                />
            ))}
            <div className={styles.grid} />
        </div>
    )
}
