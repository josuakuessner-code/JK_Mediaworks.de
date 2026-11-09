import type { PointerEvent } from 'react'
import { goTo } from '../lib/links'
import { thumb } from '../data/assets'
import type { PROJECTS } from '../data/content'

type Project = (typeof PROJECTS)[number]

// Kippen nur mit Maus (nicht auf Touch) und nur ohne „Bewegung reduzieren“
const canTilt = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
function tilt(e: PointerEvent<HTMLAnchorElement>) {
  if (e.pointerType !== 'mouse' || !canTilt()) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(2)}deg`)
  el.dataset.tilt = ''
}
function untilt(e: PointerEvent<HTMLAnchorElement>) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
  delete el.dataset.tilt
}

/** Projekt als Event-Ticket: Foto oben, Perforation, Abriss mit Kategorie und „Ansehen“. */
export default function ProjectTicket({ project, src, label, eager = false, showName = false }: { project: Project; src: string; label: string; eager?: boolean; showName?: boolean }) {
  return (
    <a
      href={`/projekt/${project.id}`}
      onClick={goTo}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      aria-label={`Projekt ansehen: ${project.name}`}
      className="ticket press group relative flex aspect-[3/4.6] flex-col overflow-hidden rounded-3xl bg-[#161616] md:rounded-[32px]"
    >
      <span className="ticket-photo relative block overflow-hidden">
        <img src={thumb(src)} width={600} height={750} alt={`${project.category}: ${project.name}`} loading={eager ? 'eager' : 'lazy'} className="h-full w-full bg-[#161616] object-cover zoom group-hover:scale-[1.04]" />
        {showName && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0C0C0C]/90 to-transparent px-4 pb-3 pt-12 text-sm font-medium uppercase leading-tight text-[#D7E2EA] sm:text-base">
            <span className="line-clamp-2">{project.name}</span>
          </span>
        )}
      </span>
      <span className="ticket-perf absolute inset-x-4 border-t-2 border-dashed border-[#D7E2EA]/20" aria-hidden="true" />
      <span className="flex min-h-0 flex-1 items-center justify-between gap-2 px-4 text-[0.62rem] font-medium uppercase tracking-[0.14em] sm:text-[0.68rem]">
        <span className="min-w-0 truncate text-[#D7E2EA]/55">{label}</span>
        <span className="ticket-go shrink-0">Ansehen →</span>
      </span>
    </a>
  )
}
