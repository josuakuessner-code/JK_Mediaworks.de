import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MARQUEE_IMAGES } from '../data/assets'

const ROW1 = MARQUEE_IMAGES.slice(0, 6)
const ROW2 = MARQUEE_IMAGES.slice(6)
const TILE = 260
const GAP = 12

function Row({ images, rowRef }: { images: string[]; rowRef: React.RefObject<HTMLDivElement> }) {
  const tripled = [...images, ...images, ...images]
  const setWidth = images.length * (TILE + GAP)
  return (
    // the middle copy sits on screen; the outer copies keep both scroll directions filled
    <div ref={rowRef} className="flex gap-3" style={{ willChange: 'transform', marginLeft: -setWidth, width: 'max-content' }}>
      {tripled.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          draggable={false}
          className="h-[325px] w-[260px] shrink-0 rounded-2xl bg-[#161616] object-cover"
        />
      ))}
    </div>
  )
}

export default function MarqueeSection() {
  const section = useRef<HTMLElement>(null)
  const row1 = useRef<HTMLDivElement>(null)
  const row2 = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = section.current
      if (!el || !row1.current || !row2.current) return
      const top = el.getBoundingClientRect().top + window.scrollY
      const offset = (window.scrollY - top + window.innerHeight) * 0.3
      row1.current.style.transform = `translateX(${offset - 200}px)`
      row2.current.style.transform = `translateX(${-(offset - 200)}px)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    <section ref={section} aria-hidden="true" className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <Row images={ROW1} rowRef={row1} />
      <Row images={ROW2} rowRef={row2} />
    </section>
  )
}
