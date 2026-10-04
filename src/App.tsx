import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import BehindTheScenes from './sections/BehindTheScenes'
import ServicesSection from './sections/ServicesSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'
import LegalPage from './sections/LegalPage'
import ContactPage from './sections/ContactPage'
import ProjectPage from './sections/ProjectPage'
import { PROJECTS } from './data/content'

const PAGES = ['kontakt', 'impressum', 'datenschutz'] as const
type Page = 'home' | 'projekt' | (typeof PAGES)[number]

const segments = () => window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().split('/')
const route = (): Page => {
  const [seg] = segments()
  if (seg === 'projekt') return 'projekt'
  return (PAGES as readonly string[]).includes(seg) ? (seg as Page) : 'home'
}
const projectId = () => segments()[1] ?? ''

const TITLES: Record<Page, string> = {
  home: 'JK-Mediaworks | Fotograf Wiesbaden: Sport, Konzerte, Hochzeiten',
  projekt: 'Projekt | JK-Mediaworks',
  kontakt: 'Anfrage | JK-Mediaworks',
  impressum: 'Impressum | JK-Mediaworks',
  datenschutz: 'Datenschutz | JK-Mediaworks',
}

// Alte Links (#/kontakt) einmalig auf echte Pfade umschreiben.
const legacy = window.location.hash.match(/^#\/(kontakt|impressum|datenschutz)$/)
if (legacy) window.history.replaceState(null, '', `/${legacy[1]}`)

export default function App() {
  const [page, setPage] = useState(route())
  useEffect(() => {
    const on = () => {
      setPage(route())
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])

  const pid = page === 'projekt' ? projectId() : ''
  useEffect(() => {
    const proj = PROJECTS.find((p) => p.id === pid)
    document.title = proj ? `${proj.name} | JK-Mediaworks` : TITLES[page]
  }, [page, pid])

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: '#0C0C0C', overflowX: 'clip' }}>
        {page === 'home' ? (
          <>
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <BehindTheScenes />
            <ServicesSection />
            <ProjectsSection />
            <ContactSection />
          </>
        ) : page === 'projekt' ? (
          <ProjectPage key={pid} id={pid} />
        ) : page === 'kontakt' ? (
          <ContactPage />
        ) : (
          <LegalPage page={page} />
        )}
      </div>
    </MotionConfig>
  )
}
