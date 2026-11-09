import { useState, type PointerEvent } from 'react'
import FadeIn from '../components/FadeIn'
import LiveProjectButton from '../components/LiveProjectButton'
import { goTo } from '../lib/links'
import { PROJECT_IMAGES, thumb } from '../data/assets'
import { PROJECTS } from '../data/content'

// Bei jedem Seitenaufruf 5 zufällige Projekte mit je einem zufälligen Foto. Mindestens ein Nicht-Sport-Projekt, damit die Mischung abwechslungsreich bleibt.
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
function pick() {
  const pool = shuffle(PROJECTS.filter((p) => (PROJECT_IMAGES[p.id]?.length ?? 0) > 0))
  const chosen = pool.slice(0, 5)
  if (!chosen.some((p) => p.group !== 'Sport')) {
    const other = pool.slice(5).find((p) => p.group !== 'Sport')
    if (other) chosen[4] = other
  }
  return shuffle(chosen).map((project) => {
    const imgs = PROJECT_IMAGES[project.id]
    return { project, src: imgs[Math.floor(Math.random() * imgs.length)] }
  })
}
const OFFSET = ['lg:mt-0', 'lg:mt-14', 'lg:mt-4', 'lg:mt-20', 'lg:mt-8']

// Kippen nur mit Maus (nicht auf Touch) und nur ohne „Bewegung reduzieren“
const canTilt = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
function tilt(e: PointerEvent<HTMLAnchorElement>) {
  if (e.pointerType !== 'mouse' || !canTilt()) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  el.style.setProperty('--rx', `${((0.5 - py) * 10).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${((px - 0.5) * 12).toFixed(2)}deg`)
  el.dataset.tilt = ''
}
function untilt(e: PointerEvent<HTMLAnchorElement>) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
  delete el.dataset.tilt
}

export default function ProjectsTeaser() {
  const [items] = useState(pick)
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn y={40}>
        <h2 className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-14" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Projekte
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-7xl">
        <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-24">
          {items.map(({ project, src }, i) => (
            <li key={project.id} className={`w-[62%] shrink-0 snap-center sm:w-[40%] lg:w-auto ${OFFSET[i]}`}>
              <FadeIn y={30} delay={i * 0.06}>
                <a
                  href={`/projekt/${project.id}`}
                  onClick={goTo}
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  aria-label={`Projekt ansehen: ${project.name}`}
                  className="ticket press group relative flex aspect-[3/4.6] flex-col overflow-hidden rounded-3xl bg-[#161616] md:rounded-[32px]"
                >
                  <span className="ticket-photo relative block overflow-hidden">
                    <img src={thumb(src)} width={600} height={750} alt={`${project.category}: ${project.name}`} loading="lazy" className="h-full w-full bg-[#161616] object-cover zoom group-hover:scale-[1.04]" />
                  </span>
                  <span className="ticket-perf absolute inset-x-4 border-t-2 border-dashed border-[#D7E2EA]/20" aria-hidden="true" />
                  <span className="flex min-h-0 flex-1 items-center justify-between gap-2 px-4 text-[0.62rem] font-medium uppercase tracking-[0.14em] sm:text-[0.68rem]">
                    <span className="min-w-0 truncate text-[#D7E2EA]/55">{project.group}</span>
                    <span className="ticket-go shrink-0">Ansehen →</span>
                  </span>
                </a>
              </FadeIn>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center lg:-mt-12">
          <LiveProjectButton href="/projekte" label="Zu Projekten" />
        </div>
      </div>
    </section>
  )
}
