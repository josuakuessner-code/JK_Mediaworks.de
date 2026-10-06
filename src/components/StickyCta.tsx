import { useEffect, useState } from 'react'
import { goTo } from '../lib/links'

// Immer sichtbar: schwebender Kontakt-Knopf unten rechts, auf Handy und Desktop.
// Wenn ein Kontakt-Knopf der Seite selbst unten im Bild ankommt, blendet er sich aus, damit keine zwei Knöpfe übereinander liegen.
export default function StickyCta() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>('a[href="/kontakt"]')].filter((el) => !el.classList.contains('fixed'))
    if (!targets.length) return
    const inZone = new Set<Element>()
    // Beobachtet nur den unteren Bildschirmrand: dort liegt der schwebende Knopf.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inZone.add(e.target)
          else inZone.delete(e.target)
        }
        setHidden(inZone.size > 0)
      },
      { rootMargin: '-82% 0px 0px 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])
  return (
    <a
      href="/kontakt"
      onClick={goTo}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`press fixed bottom-4 right-4 z-40 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.04] sm:px-8 sm:text-sm md:bottom-8 md:right-8 md:px-10 md:py-3.5 md:text-base ${hidden ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0 6px 20px rgba(118, 33, 176, 0.45)',
        outline: '2px solid white',
        outlineOffset: '-3px',
        marginBottom: 'env(safe-area-inset-bottom)',
        marginRight: 'env(safe-area-inset-right)',
      }}
    >
      Kontakt aufnehmen
    </a>
  )
}
