import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function Char({ char, range, progress, still }: { char: string; range: [number, number]; progress: MotionValue<number>; still: boolean }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative inline-block" aria-hidden="true">
      <span className="opacity-0">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity: still ? 1 : opacity }}>
        {char}
      </motion.span>
    </span>
  )
}

export default function AnimatedText({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const total = text.length
  let i = 0
  const words = text.split(' ')

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split('').map((c) => {
            const idx = i++
            return <Char key={idx} char={c} progress={scrollYProgress} still={!!reduce} range={[idx / total, (idx + 1) / total]} />
          })}
          {w < words.length - 1 && <span aria-hidden="true">{(i++, ' ')}</span>}
        </span>
      ))}
    </p>
  )
}
