import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import Navbar from '../components/Navbar'
import ContactButton from '../components/ContactButton'
import { HERO_PORTRAIT } from '../data/assets'
import { SITE } from '../data/content'

export default function HeroSection() {
  return (
    <section className="relative flex h-svh min-h-[560px] flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn y={-20} delay={0}>
        <Navbar />
      </FadeIn>

      <FadeIn y={40} delay={0.15}>
        <div className="w-full overflow-hidden">
          <h1 className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[8.5vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[9.5vw] md:-mt-3 md:text-[10.5vw] lg:text-[11vw]">
            Hi, ich bin {SITE.name}
          </h1>
        </div>
      </FadeIn>

      <div className="absolute left-1/2 top-1/2 z-10 w-max -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:translate-y-0">
        <FadeIn y={30} delay={0.6}>
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
            <img
              src={HERO_PORTRAIT}
              alt="Porträt von Josua Küßner"
              className="block max-h-[62svh] w-[280px] rounded-[32px] object-cover object-[50%_28%] sm:w-[360px] md:w-[440px] md:rounded-[44px] lg:w-[520px]"
              fetchPriority="high" width={900} height={1350}
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn y={20} delay={0.35}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            {SITE.heroLine}
          </p>
        </FadeIn>
        <FadeIn y={20} delay={0.5}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
