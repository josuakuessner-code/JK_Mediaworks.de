import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Lightbox from '../components/Lightbox'
import FadeIn from '../components/FadeIn'
import LiveProjectButton from '../components/LiveProjectButton'
import { PROJECT_IMAGES } from '../data/assets'
import { CATEGORIES, PROJECTS, type Category } from '../data/content'

const R = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'

type Project = (typeof PROJECTS)[number]

const gridCols = (n: number) => (n === 4 ? 'grid-cols-2 sm:grid-cols-4' : n >= 6 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3')

function Card({ p, index, total }: { p: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  const imgs = PROJECT_IMAGES[p.id] ?? []
  const [open, setOpen] = useState<number | null>(null)
  const items = imgs.map((src, i) => ({ src, alt: `${p.category}: ${p.name}, Aufnahme ${i + 1} von ${imgs.length}` }))

  return (
    <div ref={ref} className={index === total - 1 ? "" : "h-[85vh]"}>
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
        <div className={`grid gap-3 sm:gap-4 ${gridCols(imgs.length)}`}>
          {imgs.map((src, i) => (
            <button key={src} type="button" onClick={() => setOpen(i)} aria-label={`Bild vergrößern: ${items[i].alt}`} className="block cursor-zoom-in overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[36px]">
              <img src={src} alt={items[i].alt} loading="lazy" className="aspect-[4/5] w-full bg-[#161616] object-cover transition-transform duration-500 hover:scale-[1.03]" />
            </button>
          ))}
        </div>
      </motion.article>
      {open !== null && <Lightbox images={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  )
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<Category | 'Alle'>('Alle')
  const list = filter === 'Alle' ? PROJECTS : PROJECTS.filter((p) => p.group === filter)
  const chip = (active: boolean) =>
    `press rounded-full border-2 px-5 py-2 text-xs font-medium uppercase tracking-widest transition-colors sm:px-7 sm:py-2.5 sm:text-sm ${active ? 'border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C]' : 'border-[#D7E2EA]/60 text-[#D7E2EA] hover:bg-[#D7E2EA]/10'}`
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn y={40}>
        <h2 className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-12" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Projekte
        </h2>
      </FadeIn>
      <div role="group" aria-label="Projekte filtern" className="mb-12 flex flex-wrap justify-center gap-3 sm:mb-16 md:mb-20">
        {(['Alle', ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className={chip(filter === c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="mx-auto max-w-7xl">
        {list.map((p, i) => (
          <Card key={p.id} p={p} index={i} total={list.length} />
        ))}
      </div>
    </section>
  )
}
