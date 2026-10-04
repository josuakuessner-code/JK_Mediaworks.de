import { motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

const EASE = [0.25, 0.1, 0.25, 1] as const
const cache = new Map<string, ReturnType<typeof motion.create>>()
const getMotion = (tag: string) => {
  if (!cache.has(tag)) cache.set(tag, motion.create(tag as 'div'))
  return cache.get(tag)!
}

type Props = {
  children: ReactNode
  as?: ElementType
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
}

export default function FadeIn({ children, as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, className, style }: Props) {
  const Comp = getMotion(as as string) as ElementType
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}
