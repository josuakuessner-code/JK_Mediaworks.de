import portrait from '../assets/josua-portrait.webp'
import about1 from '../assets/about1.webp'
import about2 from '../assets/about2.webp'
import about3 from '../assets/about3.webp'
import about4 from '../assets/about4.webp'

// Alle Bilder liegen lokal im Projekt (src/assets) und werden vom eigenen Server ausgeliefert, keine Fremd-Hotlinks.
export const HERO_PORTRAIT = portrait
export const ABOUT_IMAGES = { moon: about1, object: about2, lego: about3, group: about4 }
// Alle Karten: src/assets/cards/<projekt-id>/NN.webp in handverlesener Reihenfolge (01–04 stehen auf der Startseite), nicht gemischt
const CARD_FILES = import.meta.glob('../assets/cards/*/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const CURATED: Record<string, string[]> = {}
for (const path of Object.keys(CARD_FILES).sort()) {
  const id = path.split('/')[3]
  ;(CURATED[id] ||= []).push(CARD_FILES[path])
}
export const PROJECT_IMAGES: Record<string, string[]> = CURATED
export const BTS_IMAGES: string[] = CURATED['behind-the-scenes'] ?? []

// Laufband: bei jedem Seitenaufruf 24 zufällige Fotos aus den Projekten, höchstens 3 je Projekt (mit Projekt-ID für den Link)
const MARQUEE_SOURCES = ['barock-volleys', 'dvv-pokalfinale', 'u18-4-nations-cup', 'u18-em-quali', 'u20-wevza', 'vc-wiesbaden', 'volley-juniors-frankfurt', 'fk-performance-24h', 'nls-nuerburgring', 'media-day-eintracht', 'media-day-jugend', 'hochzeit-schweden']
export type MarqueeImage = { src: string; id: string }
function pickMarquee(count: number, perProject: number): MarqueeImage[] {
  const rnd = () => Math.random() - 0.5
  const picked: MarqueeImage[] = []
  const pools = MARQUEE_SOURCES.map((id) => [...(CURATED[id] ?? [])].sort(rnd).slice(0, perProject).map((src) => ({ src, id }))).sort(rnd)
  for (let round = 0; round < perProject && picked.length < count; round++) {
    for (const pool of pools) if (pool[round] && picked.length < count) picked.push(pool[round])
  }
  return picked.sort(rnd)
}
export const MARQUEE_IMAGES: MarqueeImage[] = pickMarquee(24, 3)
