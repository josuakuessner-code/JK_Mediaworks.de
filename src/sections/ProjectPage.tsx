import { useEffect, useRef, useState } from 'react'
import FadeIn from '../components/FadeIn'
import Lightbox from '../components/Lightbox'
import ContactButton from '../components/ContactButton'
import { PROJECT_IMAGES, thumb } from '../data/assets'
import { PROJECTS } from '../data/content'
import { goTo } from '../lib/links'

export default function ProjectPage({ id }: { id: string }) {
  const p = PROJECTS.find((x) => x.id === id)
  const imgs = PROJECT_IMAGES[id] ?? []
  const [open, setOpen] = useState<number | null>(null)
  // Große Galerien (bis 138 Fotos) in Portionen laden: erst 24, dann beim Scrollen oder per Knopf je 24 weitere
  const STEP = 24
  const [shown, setShown] = useState(STEP)
  const sentinel = useRef<HTMLDivElement>(null)
  const more = () => setShown((n) => Math.min(n + STEP, imgs.length))
  useEffect(() => {
    const el = sentinel.current
    if (!el || shown >= imgs.length) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && more(), { rootMargin: '600px 0px' })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, imgs.length])

  if (!p) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start gap-6 px-5 py-16 text-[#D7E2EA]">
        <h1 className="hero-heading text-5xl font-black uppercase">Projekt nicht gefunden</h1>
        <a href="/projekte" onClick={goTo} className="underline underline-offset-4">← Alle Projekte</a>
      </main>
    )
  }
  const items = imgs.map((src, i) => ({ src, alt: `${p.category}: ${p.name}, Aufnahme ${i + 1} von ${imgs.length}` }))

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-[#D7E2EA] sm:px-8 md:py-16">
      <a href="/projekte" onClick={goTo} className="press -mt-3 mb-7 inline-block py-3 text-sm font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70">← Alle Projekte</a>
      <FadeIn y={30}>
        <p className="font-light uppercase tracking-widest text-[#D7E2EA]/70" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}>{p.category}</p>
        <h1 className="hero-heading mb-10 mt-2 font-black uppercase leading-none tracking-tight sm:mb-14" style={{ fontSize: 'clamp(2rem, 7vw, 96px)' }}>{p.name}</h1>
      </FadeIn>
      <div className="grid grid-cols-2 items-start gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, shown).map((it, i) => (
          <button key={it.src} type="button" onClick={() => setOpen(i)} aria-label={`Bild vergrößern: ${it.alt}`} className="press block w-full cursor-zoom-in overflow-hidden rounded-2xl md:rounded-3xl">
            <img src={thumb(it.src)} alt={it.alt} loading={i < 4 ? 'eager' : 'lazy'} width={600} height={900} draggable={false} className="block h-auto w-full bg-[#161616] zoom hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      {shown < items.length && (
        <div ref={sentinel} className="mt-10 flex flex-col items-center gap-3 text-center">
          <p role="status" className="text-sm font-light uppercase tracking-wider text-[#D7E2EA]/70">{shown} von {items.length} Fotos</p>
          <button type="button" onClick={more} className="press rounded-full border-2 border-[#D7E2EA]/60 px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10">Mehr Fotos anzeigen</button>
        </div>
      )}
      <div className="mt-16 flex flex-col items-center gap-6 border-t border-[#D7E2EA]/15 pt-14 text-center">
        <p className="max-w-[460px] font-medium leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>Gefällt dir, was du siehst? Erzähl mir von deinem Event.</p>
        <ContactButton />
        <a href="/projekte" onClick={goTo} className="inline-block py-3 text-sm font-light uppercase tracking-wider opacity-70 transition-opacity hover:opacity-100">← Alle Projekte</a>
      </div>
      {open !== null && <Lightbox images={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </main>
  )
}
