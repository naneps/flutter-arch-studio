import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const ORBS = [
    { color: 'bg-primary', size: '600px', top: '-15%', left: '-10%', delay: '0s', duration: '18s' },
    { color: 'bg-accent', size: '500px', top: '50%', left: '70%', delay: '-6s', duration: '22s' },
    { color: 'bg-primary', size: '350px', top: '70%', left: '10%', delay: '-10s', duration: '26s' },
    { color: 'bg-purple-500', size: '280px', top: '20%', left: '55%', delay: '-4s', duration: '20s' },
    { color: 'bg-accent', size: '220px', top: '85%', left: '80%', delay: '-14s', duration: '30s' },
]

export default function AnimatedBackground() {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background" aria-hidden="true">
            {/* Animated Orbs */}
            {ORBS.map((orb, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute rounded-full opacity-10 blur-[100px] animate-pulse-slow transition-all duration-[3000ms]",
                        orb.color
                    )}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        top: orb.top,
                        left: orb.left,
                        animationDelay: orb.delay,
                        animationDuration: orb.duration,
                    }}
                />
            ))}

            {/* Mouse Flow Spotlight */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.25] pointer-events-none bg-primary/40 -translate-x-1/2 -translate-y-1/2 transition-all duration-[400ms] ease-out mix-blend-screen"
                style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y}px`
                }}
            />

            {/* Cyber Grid */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    color: 'var(--primary)'
                }}
            />
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-vignette opacity-40" />
        </div>
    )
}
