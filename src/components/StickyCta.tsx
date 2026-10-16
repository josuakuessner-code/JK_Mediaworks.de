import { useEffect, useState } from 'react'
import { goTo } from '../lib/links'

// Immer sichtbar: schwebender Kontakt-Knopf unten rechts, auf Handy und Desktop.
// Wenn ein Kontakt-Knopf der Seite selbst unten im Bild ankommt, blendet er sich aus, damit keine zwei Knöpfe übereinander liegen.
export default function StickyCta() {
  const [hidden, setHidden] = useState(true)
  useEffect(() => {
    // Prüft bei jedem Scroll, Resize und DOM-Wechsel frisch, ob ein Kontakt-Knopf der Seite im unteren Bildschirmrand liegt.
    // (Seiten werden nachgeladen und blenden ein, deshalb nicht nur einmal beim Start beobachten.)
    let raf = 0
    const check = () => {
      raf = 0
      const zoneTop = window.innerHeight * 0.82
      const overlap = [...document.querySelectorAll<HTMLElement>('a[href="/kontakt"]')].some((el) => {
        if (el.classList.contains('fixed')) return false
        const r = el.getBoundingClientRect()
        return r.height > 0 && r.bottom > zoneTop && r.top < window.innerHeight
      })
      setHidden(overlap)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mo.disconnect()
    }
  }, [])
  return (
    <a
      href="/kontakt"
      onClick={goTo}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`press fixed bottom-4 right-4 z-40 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white hover:scale-[1.04] motion-reduce:hover:scale-100 sm:px-8 sm:text-sm md:bottom-8 md:right-8 md:px-10 md:py-3.5 md:text-base ${hidden ? 'pointer-events-none translate-y-4 opacity-0 motion-reduce:translate-y-0' : 'opacity-100'}`}
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
