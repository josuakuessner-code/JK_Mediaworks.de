import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'
import LegalPage from './sections/LegalPage'
import ContactPage from './sections/ContactPage'

const PAGES = ['kontakt', 'impressum', 'datenschutz'] as const
type Page = 'home' | (typeof PAGES)[number]

const route = (): Page => {
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  return (PAGES as readonly string[]).includes(seg) ? (seg as Page) : 'home'
}

const TITLES: Record<Page, string> = {
  home: 'JK-Mediaworks | Fotograf Wiesbaden: Sport, Konzerte, Hochzeiten',
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

  useEffect(() => {
    document.title = TITLES[page]
  }, [page])

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ background: '#0C0C0C', overflowX: 'clip' }}>
        {page === 'home' ? (
          <>
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <ServicesSection />
            <ProjectsSection />
            <ContactSection />
          </>
        ) : page === 'kontakt' ? (
          <ContactPage />
        ) : (
          <LegalPage page={page} />
        )}
      </div>
    </MotionConfig>
  )
}
