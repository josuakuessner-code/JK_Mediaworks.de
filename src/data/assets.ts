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

// Kleine Vorschaubilder (src/assets/thumbs, erzeugt mit scripts/make-thumbs.py) für Raster, Karten und Laufband.
// Fehlt ein Vorschaubild (neues Foto, Skript noch nicht gelaufen), wird das Original genommen.
const THUMB_FILES = import.meta.glob('../assets/thumbs/*/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const THUMB_BY_FULL = new Map<string, string>()
for (const path of Object.keys(CARD_FILES)) {
  const t = THUMB_FILES[path.replace('/cards/', '/thumbs/')]
  if (t) THUMB_BY_FULL.set(CARD_FILES[path], t)
}
export const thumb = (full: string) => THUMB_BY_FULL.get(full) ?? full
export const BTS_IMAGES: string[] = CURATED['behind-the-scenes'] ?? []

// Laufband: bei jedem Seitenaufruf 24 zufällige Fotos aus den Projekten, höchstens 3 je Projekt (mit Projekt-ID für den Link)
const MARQUEE_SOURCES = ['barock-volleys', 'dvv-pokalfinale', 'u18-4-nations-cup', 'u18-em-quali', 'u20-wevza', 'vc-wiesbaden', 'volley-juniors-frankfurt', 'fk-performance-24h', 'nls-nuerburgring', 'media-day-eintracht', 'media-day-jugend', 'hochzeit-schweden', 'hochzeit-toscana', 'hochzeit-alina-ben']
export type MarqueeImage = { src: string; id: string }
function pickMarquee(count: number, perProject: number): MarqueeImage[] {
  const rnd = () => Math.random() - 0.5
  const picked: MarqueeImage[] = []
  const pools = MARQUEE_SOURCES.map((id) => [...(CURATED[id] ?? [])].sort(rnd).slice(0, perProject).map((src) => ({ src, id }))).sort(rnd)
  for (let round = 0; round < perProject && picked.length < count; round++) {
    for (const pool of pools) if (pool[round] && picked.length < count) picked.push(pool[round])
  }
  return spreadByTopic(picked.sort(rnd))
}
// Themen (Sport, Hochzeit, Motorsport, Media Day) abwechselnd anordnen, damit nicht mehrere Volleyball-Bilder hintereinander stehen.
// Es kommt immer das häufigste Thema, das nicht gerade zuletzt dran war. Nur wenn ein Thema so überwiegt, dass Abwechseln nicht mehr aufgeht,
// darf es höchstens zweimal in Folge erscheinen (statt am Ende gehäuft übrig zu bleiben).
const topic = (id: string) => (id.startsWith('hochzeit') ? 'hochzeit' : id.startsWith('media-day') ? 'media' : id.startsWith('fk-') || id.startsWith('nls-') ? 'motorsport' : 'sport')
function spreadByTopic(items: MarqueeImage[]): MarqueeImage[] {
  const left = [...items]
  const out: MarqueeImage[] = []
  let run = 0
  while (left.length) {
    const last = out.length ? topic(out[out.length - 1].id) : ''
    const counts = new Map<string, number>()
    for (const it of left) counts.set(topic(it.id), (counts.get(topic(it.id)) ?? 0) + 1)
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || Math.random() - 0.5)
    const [top, topCount] = ranked[0]
    // Das häufigste Thema nochmal direkt hintereinander nur, wenn Abwechseln nicht mehr aufgeht und noch keine zwei in Folge stehen
    const mustRepeat = top === last && run < 2 && topCount > left.length - topCount + 1
    const best = mustRepeat ? top : (ranked.find(([t]) => t !== last) ?? ranked[0])[0]
    const pool = left.filter((it) => topic(it.id) === best)
    const pick = pool[Math.floor(Math.random() * pool.length)]
    left.splice(left.indexOf(pick), 1)
    run = best === last ? run + 1 : 1
    out.push(pick)
  }
  return out
}
export const MARQUEE_IMAGES: MarqueeImage[] = pickMarquee(24, 3)
