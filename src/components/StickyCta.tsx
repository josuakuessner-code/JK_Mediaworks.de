import { useEffect, useState } from 'react'
import { goTo } from '../lib/links'

// Immer sichtbar: schwebender Kontakt-Knopf unten rechts, auf Handy und Desktop.
// Nur wenn der Kontakt-Knopf im Kontaktbereich selbst im Bild ist, blendet er sich aus, damit keine zwei Knöpfe übereinander liegen.
export default function StickyCta() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const target = document.querySelector('#contact a[href="/kontakt"]')
    if (!target) return
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: '0px 0px 80px 0px' })
    io.observe(target)
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
