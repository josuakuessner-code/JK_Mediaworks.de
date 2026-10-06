import { goTo } from '../lib/links'

// Immer sichtbar: schwebender Kontakt-Knopf unten rechts, auf Handy und Desktop.
export default function StickyCta() {
  return (
    <a
      href="/kontakt"
      onClick={goTo}
      className="press fixed bottom-4 right-4 z-40 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.04] sm:px-8 sm:text-sm md:bottom-8 md:right-8 md:px-10 md:py-3.5 md:text-base"
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
