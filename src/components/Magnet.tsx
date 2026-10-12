import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

type Props = {
  children: ReactNode
  padding?: number
  strength?: number
  className?: string
}

// Kritisch gedämpfte Feder: folgt der Maus ohne Nachschwingen und lässt sich jederzeit umlenken.
const SPRING = { stiffness: 170, damping: 26, mass: 1 }

export default function Magnet({ children, padding = 100, strength = 2, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  const x = useSpring(tx, SPRING)
  const y = useSpring(ty, SPRING)

  useEffect(() => {
    // only for devices with a real pointer; touch devices and reduced motion stay static
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let rect: DOMRect | null = null // Position wird zwischengespeichert und nur bei Scroll/Größenänderung (bzw. alle 500 ms) neu gemessen
    let measuredAt = 0
    const invalidate = () => { rect = null }
    let active = false
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      if (!rect || e.timeStamp - measuredAt > 500) {
        rect = el.getBoundingClientRect()
        measuredAt = e.timeStamp
      }
      const { left, top, width, height } = rect
      const cx = left + width / 2
      const cy = top + height / 2
      if (Math.abs(cx - e.clientX) < width / 2 + padding && Math.abs(cy - e.clientY) < height / 2 + padding) {
        active = true
        tx.set((e.clientX - cx) / strength)
        ty.set((e.clientY - cy) / strength)
      } else if (active) {
        active = false
        tx.set(0)
        ty.set(0)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
      tx.set(0)
      ty.set(0)
    }
  }, [padding, strength, reduce, tx, ty])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  )
}
