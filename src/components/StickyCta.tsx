import { useEffect, useState } from 'react'
import { goTo } from '../lib/links'

// Nur Handy: schwebender Anfrage-Knopf, sobald man am Seitenanfang vorbei ist und solange kein Kontaktbereich sichtbar ist.
export default function StickyCta() {
  const [pastTop, setPastTop] = useState(false)
  const [nearContact, setNearContact] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastTop(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = document.getElementById('contact')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNearContact(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const show = pastTop && !nearContact
  return (
    <a
      href="/kontakt"
      onClick={goTo}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full px-7 py-3 text-xs font-medium uppercase tracking-widest text-white transition-all duration-300 md:hidden ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0 6px 20px rgba(118, 33, 176, 0.45)',
        outline: '2px solid white',
        outlineOffset: '-3px',
        marginBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      Anfrage senden
    </a>
  )
}
