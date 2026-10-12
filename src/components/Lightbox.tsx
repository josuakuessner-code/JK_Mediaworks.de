import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type Props = { images: { src: string; alt: string }[]; index: number; onIndex: (i: number) => void; onClose: () => void }

// Federn ohne Überschwingen für alles, was nicht geworfen wird; mit etwas Schwung nach einem Wisch.
const SETTLE = { type: 'spring', bounce: 0, duration: 0.35 } as const
const FLICK = { type: 'spring', bounce: 0.15, duration: 0.4 } as const

const slide = {
  enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
}

// Vollbild-Ansicht: Pfeiltasten, Esc, Ziehen/Wischen (seitlich = blättern, nach unten = schließen) und Klick auf den Hintergrund.
export default function Lightbox({ images, index, onIndex, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const draggedAt = useRef(0)
  const [open, setOpen] = useState(true)
  const [dir, setDir] = useState(0)
  const dragY = useMotionValue(0)
  // Beim Herunterziehen wird der Hintergrund heller, damit klar ist: Loslassen schließt
  const backdrop = useTransform(dragY, [0, 300], [0.95, 0.4], { clamp: true })
  const backdropColor = useTransform(backdrop, (a) => `rgba(12, 12, 12, ${a})`)
  const n = images.length

  const go = (d: number) => {
    if (n < 2) return
    setDir(d)
    onIndex((index + d + n) % n)
  }
  const close = () => setOpen(false)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    const opener = document.activeElement as HTMLElement | null
    // Scrollbalken-Breite ausgleichen, damit die Seite beim Öffnen nicht seitlich springt
    const bar = window.innerWidth - document.documentElement.clientWidth
    if (bar > 0) document.body.style.paddingRight = `${bar}px`
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPad
      opener?.focus({ preventScroll: true }) // Tastaturfokus zurück auf das geöffnete Foto
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const onDragEnd = (_: unknown, info: PanInfo) => {
    draggedAt.current = performance.now()
    const { offset, velocity } = info
    // Entscheidung nach Richtung und Schwung, nicht nur nach Weg
    if (Math.abs(offset.y) > Math.abs(offset.x)) {
      if (offset.y > 120 || velocity.y > 600) close()
      return
    }
    if (offset.x < -80 || velocity.x < -500) go(1)
    else if (offset.x > 80 || velocity.x > 500) go(-1)
  }

  const btn = 'glass press absolute z-10 flex h-12 w-12 items-center justify-center rounded-full text-[#D7E2EA] hover:opacity-80'
  const img = images[index]

  return (
    <AnimatePresence onExitComplete={onClose}>
      {open && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4"
          style={{ backgroundColor: backdropColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          onClick={() => {
            if (performance.now() - draggedAt.current > 300) close()
          }}
        >
          <button ref={closeRef} type="button" aria-label="Schließen" onClick={(e) => { e.stopPropagation(); close() }} className={`${btn} right-4 top-4`}>
            <X size={22} />
          </button>
          {n > 1 && (
            <>
              <button type="button" aria-label="Vorheriges Bild" onClick={(e) => { e.stopPropagation(); go(-1) }} className={`${btn} left-3 top-[calc(50%-1.5rem)]`}>
                <ChevronLeft size={24} />
              </button>
              <button type="button" aria-label="Nächstes Bild" onClick={(e) => { e.stopPropagation(); go(1) }} className={`${btn} right-3 top-[calc(50%-1.5rem)]`}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <motion.div
            className="flex max-h-full max-w-full items-center justify-center"
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94 }}
            transition={SETTLE}
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.img
                key={img.src}
                src={img.src}
                alt={img.alt}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: FLICK, opacity: { duration: 0.18 } }}
                drag
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={{ left: n > 1 ? 0.9 : 0.2, right: n > 1 ? 0.9 : 0.2, top: 0.15, bottom: 0.9 }}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
                onDragEnd={onDragEnd}
                style={{ y: dragY, touchAction: 'none' }}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
                className="max-h-[90svh] max-w-full cursor-grab select-none rounded-2xl object-contain active:cursor-grabbing"
              />
            </AnimatePresence>
          </motion.div>
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-light tracking-wider text-[#D7E2EA]/70">{index + 1} / {n}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
