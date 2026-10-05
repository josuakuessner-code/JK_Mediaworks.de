import portrait from '../assets/josua-portrait.webp'
import mq01 from '../assets/mq01.webp'
import mq02 from '../assets/mq02.webp'
import mq03 from '../assets/mq03.webp'
import mq04 from '../assets/mq04.webp'
import mq05 from '../assets/mq05.webp'
import mq06 from '../assets/mq06.webp'
import mq07 from '../assets/mq07.webp'
import mq08 from '../assets/mq08.webp'
import mq09 from '../assets/mq09.webp'
import mq10 from '../assets/mq10.webp'
import mq11 from '../assets/mq11.webp'
import about1 from '../assets/about1.webp'
import about2 from '../assets/about2.webp'
import about3 from '../assets/about3.webp'
import about4 from '../assets/about4.webp'

// Alle Bilder liegen lokal im Projekt (src/assets) und werden vom eigenen Server ausgeliefert, keine Fremd-Hotlinks.
export const HERO_PORTRAIT = portrait
export const MARQUEE_IMAGES: string[] = [mq01, mq02, mq03, mq04, mq05, mq06, mq07, mq08, mq09, mq10, mq11]
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
