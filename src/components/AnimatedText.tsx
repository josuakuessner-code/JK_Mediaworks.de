import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function Char({ char, range, progress, still }: { char: string; range: [number, number]; progress: MotionValue<number>; still: boolean }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  // Buchstabe steckt nur im data-Attribut und wird per CSS gezeichnet, damit er nicht doppelt im Text steht
  return <motion.span data-c={char} className="inline-block after:content-[attr(data-c)]" style={{ opacity: still ? 1 : opacity }} />
}

export default function AnimatedText({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const total = text.length
  let i = 0
  const words = text.split(' ')

  return (
    <p ref={ref} className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split('').map((c) => {
            const idx = i++
            return <Char key={idx} char={c} progress={scrollYProgress} still={!!reduce} range={[idx / total, (idx + 1) / total]} />
          })}
          {w < words.length - 1 && <span aria-hidden="true">{(i++, ' ')}</span>}
        </span>
      ))}
      </span>
    </p>
  )
}
