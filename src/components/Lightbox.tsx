import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type Props = { images: { src: string; alt: string }[]; index: number; onIndex: (i: number) => void; onClose: () => void }

// Vollbild-Ansicht: Pfeiltasten, Esc, Wischen und Klick auf den Hintergrund.
export default function Lightbox({ images, index, onIndex, onClose }: Props) {
  const touchX = useRef<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const n = images.length
  const go = (d: number) => onIndex((index + d + n) % n)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const btn = 'absolute z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#0C0C0C]/70 text-[#D7E2EA] backdrop-blur transition-opacity hover:opacity-80'
  const img = images[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bildansicht"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0C0C0C]/95 p-4"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 50 && n > 1) go(dx < 0 ? 1 : -1)
      }}
    >
      <button ref={closeRef} type="button" aria-label="Schließen" onClick={onClose} className={`${btn} right-4 top-4`}>
        <X size={22} />
      </button>
      {n > 1 && (
        <>
          <button type="button" aria-label="Vorheriges Bild" onClick={(e) => { e.stopPropagation(); go(-1) }} className={`${btn} left-3 top-1/2 -translate-y-1/2`}>
            <ChevronLeft size={24} />
          </button>
          <button type="button" aria-label="Nächstes Bild" onClick={(e) => { e.stopPropagation(); go(1) }} className={`${btn} right-3 top-1/2 -translate-y-1/2`}>
            <ChevronRight size={24} />
          </button>
        </>
      )}
      <img src={img.src} alt={img.alt} onClick={(e) => e.stopPropagation()} draggable={false} className="max-h-[90svh] max-w-full rounded-2xl object-contain" />
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-light tracking-wider text-[#D7E2EA]/70">{index + 1} / {n}</span>
    </div>
  )
}
