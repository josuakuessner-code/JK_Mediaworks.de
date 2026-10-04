import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import Lightbox from '../components/Lightbox'
import { BTS_IMAGES } from '../data/assets'

const ALTS = [
  'Behind the Scenes: Studio-Aufbau in der Umkleidekabine mit weißem Hintergrund und Softboxen, Spieler im Trikot posiert',
  'Behind the Scenes: Portraitshooting in der Umkleide, Spieler hält zwei Bälle über den Schultern',
  'Behind the Scenes: Am Spielfeldrand sitzt ein Betreuer im Volleyball-Germany-Shirt mit Laptop, im Hintergrund die Halle',
  'Behind the Scenes: Betreuer im Volleyball-Germany-Shirt sitzt auf dem Hallenboden und schaut aufs Spiel',
  'Behind the Scenes: Mannschaft jubelt in der Halle, ein Kameramann filmt die Szene',
]
const items = BTS_IMAGES.map((src, i) => ({ src, alt: ALTS[i] ?? 'Behind the Scenes' }))

export default function BehindTheScenes() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="behind-the-scenes" aria-labelledby="bts-title" className="px-5 pb-24 sm:px-8 sm:pb-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <FadeIn y={40}>
          <h3 id="bts-title" className="hero-heading mb-3 text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 7vw, 90px)' }}>
            Behind the Scenes
          </h3>
          <p className="mx-auto mb-12 max-w-[520px] text-center font-light leading-relaxed text-[#D7E2EA]/80 sm:mb-16" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}>
            So sieht es hinter der Kamera aus: Licht, Aufbau und viel Hallenluft.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {items.map((it, i) => (
            <FadeIn key={it.src} y={30} delay={0.05 * i} className={i % 2 === 1 ? 'lg:mt-10' : ''}>
              <button type="button" onClick={() => setOpen(i)} aria-label={`Bild vergrößern: ${it.alt}`} className="block w-full cursor-zoom-in overflow-hidden rounded-2xl md:rounded-3xl">
                <img src={it.src} alt={it.alt} loading="lazy" draggable={false} className="aspect-[2/3] w-full bg-[#161616] object-cover transition-transform duration-500 hover:scale-[1.03]" />
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
      {open !== null && <Lightbox images={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  )
}
