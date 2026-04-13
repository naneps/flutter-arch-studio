import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 })
    const [isPointer, setIsPointer] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
            if (!isVisible) setIsVisible(true)

            const target = e.target

            // Check if target or its parent is a clickable element
            const isClickable =
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]')

            setIsPointer(!!isClickable)
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', updatePosition)
        document.body.addEventListener('mouseleave', handleMouseLeave)
        document.body.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            window.removeEventListener('mousemove', updatePosition)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
            document.body.removeEventListener('mouseenter', handleMouseEnter)
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <div className="hidden lg:block">
            {/* Core Dot */}
            <div
                className={cn(
                    "fixed w-2 h-2 rounded-full bg-primary pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                    isPointer && "scale-0 opacity-0"
                )}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            />
            {/* Outline / Ring */}
            <div
                className={cn(
                    "fixed rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 border border-primary/50 transition-all ease-out duration-150",
                    isPointer 
                        ? "w-12 h-12 bg-primary/10 border-primary scale-110 shadow-[0_0_15px_rgba(0,212,255,0.2)]" 
                        : "w-8 h-8"
                )}
                style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px`,
                }}
            />
        </div>
    )
}
