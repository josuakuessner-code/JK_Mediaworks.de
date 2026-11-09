import FadeIn from '../components/FadeIn'
import { SERVICES } from '../data/content'
import { goTo } from '../lib/links'

const PAGE_LINKS: Record<string, string> = { Sportfotografie: '/sportfotografie', Hochzeiten: '/hochzeitsfotografie' }

export default function LeistungenSection() {
  return (
    <section id="services" className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn y={40}>
        <h2 className="mb-16 text-center font-black uppercase text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)', lineHeight: 1 }}>
          Leistungen
        </h2>
      </FadeIn>
      <ul className="mx-auto max-w-5xl">
        {SERVICES.map((s, i) => (
          <FadeIn as="li" key={s.name} delay={i * 0.1} className="list-none" style={{ borderTop: i === 0 ? undefined : '1px solid rgba(12, 12, 12, 0.15)' }}>
            <div className="flex items-start gap-4 py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
              <span className="font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-3 text-[#0C0C0C]">
                <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{s.name}</h3>
                <p className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]/75" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{s.text}</p>
                {PAGE_LINKS[s.name] && <a href={PAGE_LINKS[s.name]} onClick={goTo} className="press inline-block py-2 text-sm font-medium uppercase tracking-wider underline underline-offset-4">Mehr zu {s.name === 'Hochzeiten' ? 'Hochzeitsfotografie' : s.name} →</a>}
              </div>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  )
}
