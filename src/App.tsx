import { useEffect, useRef, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import BehindTheScenes from './sections/BehindTheScenes'
import ServicesSection from './sections/ServicesSection'
import ProjectsSection from './sections/ProjectsSection'
import ProjectsTeaser from './sections/ProjectsTeaser'
import ContactSection from './sections/ContactSection'
import LegalPage from './sections/LegalPage'
import ContactPage from './sections/ContactPage'
import ProjectPage from './sections/ProjectPage'
import NotFoundPage from './sections/NotFoundPage'
import StickyCta from './components/StickyCta'
import BackToTop from './components/BackToTop'
import { PROJECTS } from './data/content'
import { PROJECT_IMAGES } from './data/assets'

const PAGES = ['projekte', 'kontakt', 'impressum', 'datenschutz'] as const
type Page = 'home' | 'projekt' | 'notfound' | (typeof PAGES)[number]

const segments = () => window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().split('/')
const route = (): Page => {
  const [seg] = segments()
  if (seg === '') return 'home'
  if (seg === 'projekt') return segments().length === 2 && PROJECTS.some((p) => p.id === segments()[1]) ? 'projekt' : 'notfound'
  return (PAGES as readonly string[]).includes(seg) && segments().length === 1 ? (seg as Page) : 'notfound'
}
const projectId = () => segments()[1] ?? ''

const TITLES: Record<Page, string> = {
  home: 'JK-Mediaworks | Fotograf Wiesbaden: Sport, Konzerte, Hochzeiten',
  projekt: 'Projekt | JK-Mediaworks',
  projekte: 'Projekte | JK-Mediaworks: Fotograf Wiesbaden',
  notfound: 'Seite nicht gefunden | JK-Mediaworks',
  kontakt: 'Anfrage | JK-Mediaworks',
  impressum: 'Impressum | JK-Mediaworks',
  datenschutz: 'Datenschutz | JK-Mediaworks',
}

// Alte Links (#/kontakt) einmalig auf echte Pfade umschreiben.
const DESCRIPTIONS: Record<Page, string> = {
  home: 'JK-Mediaworks: Fotograf aus Wiesbaden für Sportfotografie, Konzerte, Events und Hochzeiten. Emotionale Bilder mit besonderem Look. Jetzt unverbindlich anfragen.',
  projekte: 'Alle Projekte von JK-Mediaworks: Volleyball, Motorsport, Hochzeiten und Media Days. Fotograf aus Wiesbaden.',
  projekt: 'Projekt von JK-Mediaworks, Fotograf aus Wiesbaden: alle Fotos in der Galerie.',
  kontakt: 'Unverbindliche Anfrage an JK-Mediaworks: Termin, Ort und Wünsche angeben und ein Angebot für deine Fotos erhalten.',
  impressum: 'Impressum und Anbieterkennzeichnung von JK-Mediaworks, Josua Küßner, Fotograf in Wiesbaden: Anschrift, E-Mail und Telefon.',
  datenschutz: 'Datenschutzerklärung von JK-Mediaworks: welche Daten bei Besuch der Website und bei einer Anfrage verarbeitet werden und welche Rechte du hast.',
  notfound: 'Diese Seite wurde nicht gefunden. Zur Startseite von JK-Mediaworks, Fotograf aus Wiesbaden, oder zu allen Projekten.',
}

const setMeta = (selector: string, attr: string, value: string) => document.head.querySelector(selector)?.setAttribute(attr, value)

const legacy = window.location.hash.match(/^#\/(kontakt|impressum|datenschutz)$/)
if (legacy) window.history.replaceState(null, '', `/${legacy[1]}`)

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

export default function App() {
  const [page, setPage] = useState(route())
  // Pfad mitführen: bei Zurück/Vor zwischen zwei Projekt-Adressen bleibt `page` gleich, der Pfad nicht
  const [path, setPath] = useState(window.location.pathname)
  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])
  useEffect(() => {
    // Scroll-Position im aktuellen Verlaufseintrag merken, damit „Zurück“ an dieselbe Stelle führt
    let t = 0
    const save = () => {
      clearTimeout(t)
      t = window.setTimeout(() => {
        try {
          window.history.replaceState({ ...(window.history.state ?? {}), scroll: window.scrollY }, '')
        } catch {
          /* z. B. eingebettete Vorschau */
        }
      }, 150)
    }
    const on = () => {
      clearTimeout(t)
      const y = (window.history.state as { scroll?: number } | null)?.scroll ?? 0
      setPage(route())
      setPath(window.location.pathname)
      // nach dem Rendern der neuen Seite an die gemerkte Stelle (neue Seiten: oben)
      requestAnimationFrame(() => window.scrollTo(0, y))
    }
    window.addEventListener('scroll', save, { passive: true })
    window.addEventListener('popstate', on)
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', save)
      window.removeEventListener('popstate', on)
    }
  }, [])

  const pid = page === 'projekt' ? projectId() : ''
  void path // löst bei Pfadwechsel innerhalb von 'projekt' ein neues Rendern aus
  useEffect(() => {
    const proj = PROJECTS.find((p) => p.id === pid)
    const title = proj ? `${proj.name} | JK-Mediaworks` : TITLES[page]
    const desc = proj ? `${proj.name}: ${proj.category}. Fotos von JK-Mediaworks, Fotograf aus Wiesbaden.` : DESCRIPTIONS[page]
    document.title = title
    setMeta('meta[name="description"]', 'content', desc)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    const url = `https://jkmediaworks.com${page === 'home' ? '/' : window.location.pathname}`
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:url"]', 'content', url)
    let robots = document.head.querySelector('meta[name="robots"]')
    if (page === 'notfound') {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex')
    } else robots?.remove()
  }, [page, pid])

  // Strukturierte Daten (schema.org ImageGallery) pro Projekt für Suchmaschinen; wird beim Verlassen wieder entfernt
  useEffect(() => {
    const proj = PROJECTS.find((p) => p.id === pid)
    if (page !== 'projekt' || !proj) return
    const url = `https://jkmediaworks.com/projekt/${proj.id}`
    const data = {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      '@id': `${url}#gallery`,
      name: proj.name,
      description: `${proj.name}: ${proj.category}. Fotos von JK-Mediaworks, Fotograf aus Wiesbaden.`,
      url,
      inLanguage: 'de',
      creator: { '@type': 'Person', name: 'Josua Küßner', url: 'https://jkmediaworks.com/' },
      publisher: { '@id': 'https://jkmediaworks.com/#business' },
      image: (PROJECT_IMAGES[proj.id] ?? []).slice(0, 12).map((src) => ({ '@type': 'ImageObject', contentUrl: new URL(src, window.location.origin).href, creator: { '@type': 'Person', name: 'Josua Küßner' } })),
    }
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'ld-project'
    el.textContent = JSON.stringify(data)
    document.head.appendChild(el)
    return () => el.remove()
  }, [page, pid])

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: '#0C0C0C', overflowX: 'clip' }}>
        {/* Kurzes Einblenden beim Seitenwechsel (nicht beim ersten Laden, damit das Startbild sofort steht) */}
        <motion.div
          key={page === 'projekt' ? `projekt-${pid}` : page}
          initial={firstRender.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
        {page === 'home' ? (
          <main>
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <BehindTheScenes />
            <ServicesSection />
            <ProjectsTeaser />
            <ContactSection />
          </main>
        ) : page === 'notfound' ? (
          <NotFoundPage />
        ) : page === 'projekt' ? (
          <ProjectPage key={pid} id={pid} />
        ) : page === 'projekte' ? (
          <ProjectsSection />
        ) : page === 'kontakt' ? (
          <ContactPage />
        ) : (
          <LegalPage page={page} />
        )}
        </motion.div>
        {(page === 'home' || page === 'projekt' || page === 'projekte') && <StickyCta />}
        {(page === 'home' || page === 'projekt' || page === 'projekte') && <BackToTop />}
      </div>
    </MotionConfig>
  )
}
