import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

// Erscheint, sobald man ein gutes Stück nach unten gescrollt hat, und springt auf Wunsch zurück an den Seitenanfang.
// Sitzt unten links (der Kontakt-Knopf sitzt unten rechts).
export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setShow(window.scrollY > window.innerHeight * 1.2)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const up = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={up}
      aria-label="Zurück nach oben"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`glass press fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA] transition-[opacity,transform] duration-200 hover:bg-[#D7E2EA]/10 md:bottom-8 md:left-8 md:h-14 md:w-14 ${show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0 motion-reduce:translate-y-0'}`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)', marginLeft: 'env(safe-area-inset-left)' }}
    >
      <ArrowUp size={22} aria-hidden />
    </button>
  )
}
