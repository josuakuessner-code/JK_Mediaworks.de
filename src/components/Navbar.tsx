import { goTo } from '../lib/links'
const LINKS = [
  { label: 'Über mich', href: '#about' },
  { label: 'Leistungen', href: '#services' },
  { label: 'Projekte', href: '#projects' },
  { label: 'Kontakt', href: '/kontakt' },
]

export default function Navbar() {
  return (
    <nav aria-label="Hauptnavigation" className="flex w-full justify-between px-6 pt-6 md:px-10 md:pt-8">
      {LINKS.map((l) => (
        <a
          key={l.label}
          href={l.href}
          onClick={goTo}
          className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
        >
          {l.label}
        </a>
      ))}
    </nav>
  )
}
