import { useEffect, useState } from 'react'
import styles from './CustomCursor.module.css'

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
                target.closest('a')

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
        <>
            <div
                className={`${styles.cursorDot} ${isPointer ? styles.pointer : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            />
            <div
                className={`${styles.cursorOutline} ${isPointer ? styles.pointer : ''}`}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            />
        </>
    )
}
