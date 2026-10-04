import { goTo } from '../lib/links'
import CopyEmail from '../components/CopyEmail'
import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'
import { SITE } from '../data/content'

export default function ContactSection() {
  return (
    <>
      <section id="contact" className="flex flex-col items-center gap-10 px-5 pb-24 pt-20 sm:px-8 sm:pb-32 md:px-10 md:pt-32">
        <FadeIn y={40}>
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Kontakt
          </h2>
        </FadeIn>
        <FadeIn y={20} delay={0.1}>
          <p className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
            Steht ein Spiel, ein Konzert oder eine Hochzeit an? Schreib mir kurz Datum, Ort und was du dir vorstellst. Preise gestalte ich individuell, sie richten sich nach Zeit und Aufwand. Die Bilder liefere ich nach Absprache: schon während des Events, am selben Abend oder zum gewünschten Zeitpunkt.
          </p>
        </FadeIn>
        <FadeIn y={20} delay={0.2}>
          <ContactButton />
        </FadeIn>
        <CopyEmail className="text-sm font-light tracking-wide" />
      </section>
      <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#D7E2EA]/15 px-6 py-8 text-sm font-light text-[#D7E2EA]/70 sm:flex-row md:px-10">
        <span>© {new Date().getFullYear()} {SITE.brand}</span>
        <nav aria-label="Rechtliches" className="flex gap-6">
          <a href="https://www.instagram.com/jk_mediaworks.de/" target="_blank" rel="noopener noreferrer" className="uppercase tracking-wider transition-opacity duration-200 hover:opacity-70">Instagram</a>
          <a href="/impressum" onClick={goTo} className="uppercase tracking-wider transition-opacity duration-200 hover:opacity-70">Impressum</a>
          <a href="/datenschutz" onClick={goTo} className="uppercase tracking-wider transition-opacity duration-200 hover:opacity-70">Datenschutz</a>
        </nav>
      </footer>
    </>
  )
}
