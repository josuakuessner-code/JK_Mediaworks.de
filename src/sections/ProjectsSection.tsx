import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import ProjectTicket from '../components/ProjectTicket'
import { goTo } from '../lib/links'
import { PROJECT_IMAGES } from '../data/assets'
import { CATEGORIES, PROJECTS, type Category } from '../data/content'

export default function ProjectsSection() {
  const [filter, setFilter] = useState<Category | 'Alle'>('Alle')
  const list = filter === 'Alle' ? PROJECTS : PROJECTS.filter((p) => p.group === filter)
  const chip = (active: boolean) =>
    `press min-h-11 rounded-full border-2 px-5 py-2 text-xs font-medium uppercase tracking-widest transition-colors sm:px-7 sm:py-2.5 sm:text-sm ${active ? 'border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C]' : 'border-[#D7E2EA]/60 text-[#D7E2EA] hover:bg-[#D7E2EA]/10'}`
  return (
    <main className="relative z-10 min-h-screen bg-[#0C0C0C] px-5 pb-20 pt-8 sm:px-8 sm:pb-24 md:px-10 md:pb-32 md:pt-12">
      <a href="/" onClick={goTo} className="press -mt-3 mb-7 inline-block py-3 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70">← Startseite</a>
      <FadeIn y={40}>
        <h1 className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-12" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Projekte
        </h1>
      </FadeIn>
      <div role="group" aria-label="Projekte filtern" className="mb-12 flex flex-wrap justify-center gap-3 sm:mb-16 md:mb-20">
        {(['Alle', ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className={chip(filter === c)}>
            {c}
          </button>
        ))}
      </div>
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3" aria-label="Alle Projekte">
        {list.map((p, i) => {
          const src = (PROJECT_IMAGES[p.id] ?? [])[0]
          return src ? (
            <li key={p.id}>
              <FadeIn y={30} delay={(i % 3) * 0.06}>
                <ProjectTicket project={p} src={src} label={p.category} eager={i < 3} showName />
              </FadeIn>
            </li>
          ) : null
        })}
      </ul>
    </main>
  )
}
