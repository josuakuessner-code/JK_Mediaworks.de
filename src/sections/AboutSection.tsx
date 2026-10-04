import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import ContactButton from '../components/ContactButton'
import { ABOUT_IMAGES } from '../data/assets'
import { SITE } from '../data/content'

type Deco = { src: string; cls: string; wrap: string; delay: number; x: number }
const DECOS: Deco[] = [
  { src: ABOUT_IMAGES.moon, cls: 'w-[120px] sm:w-[160px] md:w-[210px]', wrap: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%]', delay: 0.1, x: -80 },
  { src: ABOUT_IMAGES.object, cls: 'w-[100px] sm:w-[140px] md:w-[180px]', wrap: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]', delay: 0.25, x: -80 },
  { src: ABOUT_IMAGES.lego, cls: 'w-[120px] sm:w-[160px] md:w-[210px]', wrap: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%]', delay: 0.15, x: 80 },
  { src: ABOUT_IMAGES.group, cls: 'w-[130px] sm:w-[170px] md:w-[220px]', wrap: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]', delay: 0.3, x: 80 },
]

export default function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center justify-center gap-16 px-5 py-20 sm:gap-20 sm:px-8 md:gap-24 md:px-10" style={{ overflowX: 'clip' }}>
      {DECOS.map((d) => (
        <div key={d.src} className={`pointer-events-none absolute hidden xl:block ${d.wrap}`}>
          <FadeIn x={d.x} y={0} delay={d.delay} duration={0.9}>
            <img src={d.src} alt="" loading="lazy" draggable={false} className={`${d.cls} aspect-[3/4] rounded-2xl object-cover`} />
          </FadeIn>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn y={40} delay={0}>
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            Über mich
          </h2>
        </FadeIn>
        <AnimatedText
          text={SITE.aboutText}
          className="max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />
      </div>

      {/* Handy: Fotos im Raster statt in den Ecken, damit nichts Text oder Button überdeckt */}
      <div className="relative z-10 grid w-full max-w-[340px] grid-cols-2 gap-3 sm:max-w-[420px] xl:hidden">
        {DECOS.map((d, i) => (
          <FadeIn key={d.src} y={30} delay={0.05 * i}>
            <img src={d.src} alt="" loading="lazy" draggable={false} className="aspect-[3/4] w-full rounded-2xl object-cover" />
          </FadeIn>
        ))}
      </div>

      <div className="relative z-10">
        <ContactButton />
      </div>
    </section>
  )
}
