import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function Word({ word, range, progress, still }: { word: string; range: [number, number]; progress: MotionValue<number>; still: boolean }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  // Wort steckt nur im data-Attribut und wird per CSS gezeichnet, damit es nicht doppelt im Text steht
  return <motion.span data-c={word} className="inline-block whitespace-nowrap after:content-[attr(data-c)]" style={{ opacity: still ? 1 : opacity }} />
}

// Text wird beim Scrollen Wort für Wort heller (eine Animation pro Wort statt pro Buchstabe).
export default function AnimatedText({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const words = text.split(' ')
  const total = words.length

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <Word word={word} progress={scrollYProgress} still={!!reduce} range={[w / total, (w + 1) / total]} />
            {w < total - 1 && ' '}
          </span>
        ))}
      </span>
    </p>
  )
}
