import { goTo } from '../lib/links'

export default function LiveProjectButton({ href = '/kontakt', label = 'Zum Kontakt' }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      onClick={goTo}
      className="press inline-block rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      {label}
    </a>
  )
}
