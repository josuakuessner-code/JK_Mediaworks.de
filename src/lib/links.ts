import type { MouseEvent } from 'react'

// Interne Sprünge ohne Seitennavigation: funktioniert auch in eingebetteten Frames (z. B. Vorschau),
// in denen ein normaler #-Link die Seite sonst leer laden würde.
export function goTo(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href') ?? ''
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  if (href.startsWith('/')) {
    e.preventDefault()
    navigate(href)
    return
  }
  if (!href.startsWith('#')) return
  e.preventDefault()
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  document.getElementById(href.slice(1))?.scrollIntoView({ behavior })
}

// Seitenwechsel über echte Pfade (/kontakt, /impressum …) ohne Neuladen.
export function navigate(path: string) {
  try {
    window.history.pushState(null, '', path)
  } catch {
    window.location.assign(path)
    return
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

// mailto: im eingebetteten Frame in neuem Fenster öffnen, sonst bliebe die Seite weiß.
export function openMail(e: MouseEvent<HTMLAnchorElement>) {
  if (window.self === window.top) return
  e.preventDefault()
  window.open(e.currentTarget.href, '_blank', 'noopener')
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  // Im eingebetteten Frame (z. B. Vorschau) sind Downloads gesperrt: PDF stattdessen in neuem Tab öffnen.
  if (window.self !== window.top && window.open(url, '_blank', 'noopener')) {
    setTimeout(() => URL.revokeObjectURL(url), 60000)
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
