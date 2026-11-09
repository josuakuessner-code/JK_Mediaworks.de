import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'
import { PROJECT_IMAGES, thumb } from '../data/assets'
import { LEISTUNGSSEITEN, PROJECTS, type LeistungSlug } from '../data/content'
import { goTo } from '../lib/links'

export default function LeistungPage({ slug }: { slug: LeistungSlug }) {
  const l = LEISTUNGSSEITEN[slug]
  const projects = l.projects.map((id) => PROJECTS.find((p) => p.id === id)).filter((p): p is (typeof PROJECTS)[number] => !!p)
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-[#D7E2EA] sm:px-8 md:py-16">
      <a href="/" onClick={goTo} className="press -mt-3 mb-7 inline-block py-3 text-sm font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70">← Startseite</a>
      <FadeIn y={30}>
        <h1 className="hero-heading mb-8 font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 7vw, 96px)' }}>{l.h1}</h1>
        <p className="mb-14 max-w-3xl font-light leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}>{l.intro}</p>
      </FadeIn>
      <div className="mb-16 grid gap-10 md:grid-cols-2">
        {l.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-3 font-medium uppercase tracking-wider" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>{s.heading}</h2>
            <p className="font-light leading-relaxed text-[#D7E2EA]/85" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>{s.text}</p>
          </section>
        ))}
      </div>
      <h2 className="mb-6 font-black uppercase" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>Ausgewählte Projekte</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const img = PROJECT_IMAGES[p.id]?.[0]
          return (
            <li key={p.id} className="list-none">
              <a href={`/projekt/${p.id}`} onClick={goTo} className="press block overflow-hidden rounded-3xl border border-[#D7E2EA]/20">
                {img && <img src={thumb(img)} alt={`${p.category}: ${p.name}`} loading="lazy" width={600} height={750} className="aspect-[4/5] w-full bg-[#161616] object-cover" />}
                <span className="block p-4">
                  <span className="block text-xs font-light uppercase tracking-widest text-[#D7E2EA]/70">{p.category}</span>
                  <span className="block font-medium uppercase">{p.name}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      <div className="mt-16 flex flex-col items-center gap-6 border-t border-[#D7E2EA]/15 pt-14 text-center">
        <p className="max-w-[460px] font-medium leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>{l.cta}</p>
        <ContactButton />
      </div>
    </main>
  )
}
