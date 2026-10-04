import type { MouseEvent } from 'react'

// Interne Sprünge ohne Seitennavigation: funktioniert auch in eingebetteten Frames (z. B. Vorschau),
// in denen ein normaler #-Link die Seite sonst leer laden würde.
export function goTo(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href') ?? ''
  if (!href.startsWith('#')) return
  e.preventDefault()
  if (href === '#' || href.startsWith('#/')) {
    window.location.hash = href === '#' ? '' : href
    window.scrollTo(0, 0)
    return
  }
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  document.getElementById(href.slice(1))?.scrollIntoView({ behavior })
}

// mailto: im eingebetteten Frame in neuem Fenster öffnen, sonst bliebe die Seite weiß.
export function openMail(e: MouseEvent<HTMLAnchorElement>) {
  if (window.self === window.top) return
  e.preventDefault()
  window.open(e.currentTarget.href, '_blank', 'noopener')
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
