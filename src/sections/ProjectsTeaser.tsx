import FadeIn from '../components/FadeIn'
import LiveProjectButton from '../components/LiveProjectButton'
import { goTo } from '../lib/links'
import { PROJECT_IMAGES } from '../data/assets'
import { PROJECTS } from '../data/content'

// Ein Foto pro Projekt, bewusst quer durch alle Themen, damit die Startseite kompakt bleibt.
const PICKS = ['barock-volleys', 'fk-performance-24h', 'hochzeit-schweden', 'u18-em-quali', 'media-day-eintracht']
const OFFSET = ['lg:mt-0', 'lg:mt-14', 'lg:mt-4', 'lg:mt-20', 'lg:mt-8']

export default function ProjectsTeaser() {
  const items = PICKS.map((id) => ({ project: PROJECTS.find((p) => p.id === id), src: PROJECT_IMAGES[id]?.[0] })).filter(
    (x): x is { project: (typeof PROJECTS)[number]; src: string } => Boolean(x.project && x.src),
  )
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
                <a href={`/projekt/${project.id}`} onClick={goTo} aria-label={`Projekt ansehen: ${project.name}`} className="group block overflow-hidden rounded-3xl md:rounded-[36px]">
                  <img src={src} alt={`${project.category}: ${project.name}`} loading="lazy" className="aspect-[4/5] w-full bg-[#161616] object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
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
