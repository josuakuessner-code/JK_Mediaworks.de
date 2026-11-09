import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Text-Reveal: Buchstaben lösen sich einmal von links nach rechts auf. Screenreader lesen nur den echten Text.
const CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ'

export default function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    const parts = Array.from(text)
    let shown = 0
    let id = 0
    const step = Math.max(1, Math.ceil(parts.length / 22))
    const paint = () => {
      el.textContent = parts.map((c, i) => (i < shown || c === ' ' || c === ',' ? c : CHARS[Math.floor(Math.random() * CHARS.length)])).join('')
    }
    // Breite festhalten, damit die Zeile beim Würfeln nicht springt
    el.style.minWidth = `${el.getBoundingClientRect().width}px`
    paint()
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        shown = Math.min(parts.length, shown + step)
        paint()
        if (shown >= parts.length) {
          window.clearInterval(id)
          el.textContent = text
          el.style.minWidth = ''
        }
      }, 40)
    }, delay * 1000)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
      el.textContent = text
      el.style.minWidth = ''
    }
  }, [text, delay, reduce])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="inline-block">
        {text}
      </span>
    </>
  )
}
