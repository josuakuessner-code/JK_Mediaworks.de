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

const route = (): 'home' | 'impressum' | 'datenschutz' | 'kontakt' => {
  const h = window.location.hash
  return h === '#/kontakt' ? 'kontakt' : h === '#/impressum' ? 'impressum' : h === '#/datenschutz' ? 'datenschutz' : 'home'
}

export default function App() {
  const [page, setPage] = useState(route())
  useEffect(() => {
    const on = () => {
      setPage(route())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

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
