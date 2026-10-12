import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MARQUEE_IMAGES, thumb, type MarqueeImage } from '../data/assets'
import { PROJECTS } from '../data/content'
import { goTo } from '../lib/links'

const HALF = Math.ceil(MARQUEE_IMAGES.length / 2)
const ROW1 = MARQUEE_IMAGES.slice(0, HALF)
const ROW2 = MARQUEE_IMAGES.slice(HALF)
const TILE = 260
const GAP = 12

function Row({ images, rowRef }: { images: MarqueeImage[]; rowRef: React.RefObject<HTMLDivElement> }) {
  const tripled = [...images, ...images, ...images]
  const setWidth = images.length * (TILE + GAP)
  return (
    // the middle copy sits on screen; the outer copies keep both scroll directions filled
    <div ref={rowRef} className="flex gap-3" style={{ willChange: 'transform', marginLeft: -setWidth, width: 'max-content' }}>
      {tripled.map(({ src, id }, i) => {
        const name = PROJECTS.find((p) => p.id === id)?.name ?? 'Projekt'
        return (
          <a
            key={i}
            href={`/projekt/${id}`}
            onClick={goTo}
            draggable={false}
            aria-label={`Projekt ansehen: ${name}`}
            tabIndex={i >= images.length && i < images.length * 2 ? 0 : -1}
            className="press group relative block h-[325px] w-[260px] shrink-0 overflow-hidden rounded-2xl bg-[#161616]"
          >
            <img src={thumb(src)} alt="" loading="lazy" width={260} height={325} draggable={false} className="h-full w-full object-cover zoom group-hover:scale-[1.05]" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-[#0C0C0C]/90 via-[#0C0C0C]/40 to-transparent px-4 pb-4 pt-16 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              {name} →
            </span>
          </a>
        )
      })}
    </div>
  )
}

export default function MarqueeSection() {
  const section = useRef<HTMLElement>(null)
  const row1 = useRef<HTMLDivElement>(null)
  const row2 = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const user = useRef(0) // vom Besucher gezogener Versatz, zusätzlich zur Scroll-Bewegung

  useEffect(() => {
    const el = section.current
    if (!el) return
    const S1 = ROW1.length * (TILE + GAP)
    const S2 = ROW2.length * (TILE + GAP)
    const wrap = (v: number, s: number) => ((((v + s / 2) % s) + s) % s) - s / 2 // endlos: Bilder wiederholen sich im Takt s
    let raf = 0
    let top = 0 // Oberkante der Galerie im Dokument, zwischengespeichert statt pro Frame gemessen
    let visible = false
    const measure = () => { top = el.getBoundingClientRect().top + window.scrollY }
    const update = () => {
      raf = 0
      if (!row1.current || !row2.current) return
      const offset = reduce ? 0 : (window.scrollY - top + window.innerHeight) * 0.3 - 200
      row1.current.style.transform = `translateX(${wrap(offset + user.current, S1)}px)`
      row2.current.style.transform = `translateX(${wrap(-offset + user.current, S2)}px)`
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onScroll = () => { if (visible) request() }
    const onResize = () => { measure(); request() }
    // Nur rechnen, solange die Galerie im Bild ist
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { measure(); request() }
    })
    io.observe(el)

    // Ziehen (Maus/Touch), seitliches Trackpad-Scrollen und Auslaufen nach dem Loslassen
    let down = false, dragging = false, startX = 0, lastX = 0, moved = 0, glide = 0
    let samples: { x: number; t: number }[] = [] // Bewegungsverlauf der letzten ~100 ms für die Loslass-Geschwindigkeit
    const stopGlide = () => { if (glide) cancelAnimationFrame(glide); glide = 0 }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stopGlide()
      down = true; dragging = false; moved = 0; startX = lastX = e.clientX
      samples = [{ x: e.clientX, t: performance.now() }]
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - lastX
      moved = Math.abs(e.clientX - startX)
      if (!dragging && moved > 6) {
        dragging = true
        el.setPointerCapture(e.pointerId)
        el.style.cursor = 'grabbing'
        el.classList.add('dragging')
      }
      lastX = e.clientX
      const now = performance.now()
      samples.push({ x: e.clientX, t: now })
      while (samples.length > 2 && now - samples[0].t > 100) samples.shift()
      if (!dragging) return
      user.current += dx
      request()
    }
    const onUp = () => {
      if (!down) return
      down = false
      el.style.cursor = ''
      el.classList.remove('dragging')
      if (!dragging) return
      setTimeout(() => { dragging = false }, 0)
      // Geschwindigkeit in px/ms aus dem Verlauf; wer vor dem Loslassen kurz stillhält, lässt nicht auslaufen
      const now = performance.now()
      const last = samples[samples.length - 1]
      const first = samples[0]
      let v = now - last.t > 80 || last.t === first.t ? 0 : (last.x - first.x) / (last.t - first.t)
      if (Math.abs(v) < 0.05) return
      let prev = now
      const step = (t: number) => {
        const dt = Math.min(64, t - prev) // Bildrate egal: gleiche Bremswirkung bei 60 und 120 Hz
        prev = t
        user.current += v * dt
        v *= Math.pow(0.94, dt / 16.7)
        request()
        glide = Math.abs(v) > 0.02 ? requestAnimationFrame(step) : 0
      }
      glide = requestAnimationFrame(step)
    }
    const onClick = (e: MouseEvent) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0 }
    }
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      user.current -= e.deltaX
      request()
    }

    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('click', onClick, true)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      io.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('click', onClick, true)
      el.removeEventListener('wheel', onWheel)
      if (raf) cancelAnimationFrame(raf)
      stopGlide()
    }
  }, [reduce])

  return (
    <section
      ref={section}
      aria-label="Fotos aus meinen Projekten"
      className="flex cursor-grab select-none flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
      style={{ touchAction: 'pan-y' }}
    >
      <Row images={ROW1} rowRef={row1} />
      <Row images={ROW2} rowRef={row2} />
    </section>
  )
}
