import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import LiveProjectButton from '../components/LiveProjectButton'
import { PROJECT_IMAGES } from '../data/assets'
import { PROJECTS } from '../data/content'

const R = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'

function Card({ index, total }: { index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  const p = PROJECTS[index]
  const imgs = PROJECT_IMAGES[index]

  return (
    <div ref={ref} className="h-[85vh]">
      <motion.article
        className={`sticky origin-top border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 [--base:6rem] sm:p-6 md:[--base:8rem] md:p-8 ${R}`}
        style={{ top: `calc(var(--base) + ${index * 28}px)`, scale: reduce ? 1 : scale }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col">
              <span className="font-light uppercase tracking-widest text-[#D7E2EA]/70" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}>{p.category}</span>
              <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{p.name}</h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>
        <div className={`grid gap-3 sm:gap-4 ${imgs.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
          {imgs.map((src, i) => (
            <img key={src} src={src} alt={`${p.name}, Foto ${i + 1}`} loading="lazy" className={`aspect-[4/5] w-full bg-[#161616] object-cover rounded-2xl sm:rounded-3xl md:rounded-[36px]`} />
          ))}
        </div>
      </motion.article>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn y={40}>
        <h2 className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Projekte
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-7xl">
        {PROJECTS.map((_, i) => (
          <Card key={i} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  )
}
