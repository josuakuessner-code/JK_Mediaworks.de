import { BRAND_GRADIENT } from '../lib/brand'
import { goTo } from '../lib/links'
export default function ContactButton() {
  return (
    <a
      href="/kontakt"
      onClick={goTo}
      className="press inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background: BRAND_GRADIENT,
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      Kontakt aufnehmen
    </a>
  )
}
