import { mixed } from '../lib/mix'
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
import p1a from '../assets/p1a.webp'
import p1b from '../assets/p1b.webp'
import p1c from '../assets/p1c.webp'
import p2a from '../assets/p2a.webp'
import p2b from '../assets/p2b.webp'
import p2c from '../assets/p2c.webp'
import p4a from '../assets/p4a.webp'
import p4b from '../assets/p4b.webp'
import p4c from '../assets/p4c.webp'
import wed1 from '../assets/wed1.webp'
import wed2 from '../assets/wed2.webp'
import wed3 from '../assets/wed3.webp'
import wed4 from '../assets/wed4.webp'
import md1 from '../assets/md1.webp'
import md2 from '../assets/md2.webp'
import md3 from '../assets/md3.webp'
import md4 from '../assets/md4.webp'
import md5 from '../assets/md5.webp'
import md6 from '../assets/md6.webp'
import bts1 from '../assets/bts1.webp'
import bts2 from '../assets/bts2.webp'
import bts3 from '../assets/bts3.webp'
import bts4 from '../assets/bts4.webp'
import bts5 from '../assets/bts5.webp'
import about1 from '../assets/about1.webp'
import about2 from '../assets/about2.webp'
import mj1 from '../assets/mj1.webp'
import mj2 from '../assets/mj2.webp'
import mj3 from '../assets/mj3.webp'
import mj4 from '../assets/mj4.webp'
import mo1 from '../assets/mo1.webp'
import mo2 from '../assets/mo2.webp'
import mo3 from '../assets/mo3.webp'
import mo4 from '../assets/mo4.webp'
import mo5 from '../assets/mo5.webp'
import mo6 from '../assets/mo6.webp'
import mo7 from '../assets/mo7.webp'
import mo8 from '../assets/mo8.webp'
import mo9 from '../assets/mo9.webp'
import about3 from '../assets/about3.webp'
import about4 from '../assets/about4.webp'

// Alle Bilder liegen lokal im Projekt (src/assets) und werden vom eigenen Server ausgeliefert, keine Fremd-Hotlinks.
export const HERO_PORTRAIT = portrait
export const MARQUEE_IMAGES: string[] = [mq01, mq02, mq03, mq04, mq05, mq06, mq07, mq08, mq09, mq10, mq11]
export const ABOUT_IMAGES = { moon: about1, object: about2, lego: about3, group: about4 }
// Karten mit handverlesener Reihenfolge (01.webp = Titelbild): src/assets/cards/<id>/NN.webp, wird nicht gemischt
const CARD_FILES = import.meta.glob('../assets/cards/*/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const CURATED: Record<string, string[]> = {}
for (const path of Object.keys(CARD_FILES).sort()) {
  const id = path.split('/')[3]
  ;(CURATED[id] ||= []).push(CARD_FILES[path])
}
// Schlüssel = id des Projekts in content.ts (Ordnerstruktur: Kategorie > Job)
const RAW_PROJECT_IMAGES: Record<string, string[]> = {
  'barock-volleys': [p1a, p1b, p1c],
  'u18-4-nations-cup': [p2a, p2b, p2c],
  'dvv-pokalfinale': [p4a, p4b, p4c],
  'hochzeit-schweden': [wed1, wed2, wed3, wed4],
  'media-day-eintracht': [md1, md2, md3, md4, md5, md6],
  'media-day-jugend': [mj1, mj2, mj3, mj4],
  'fk-performance-24h': [mo1, mo2, mo3, mo4, mo5, mo6, mo7, mo8, mo9],
}
const LANDSCAPE: string[] = [mo4]
// Gemischte Reihenfolge: die ersten 4 stehen auf der Startseite, die Galerie zeigt alle.
export const PROJECT_IMAGES: Record<string, string[]> = { ...CURATED, ...Object.fromEntries(
  Object.entries(RAW_PROJECT_IMAGES).map(([id, imgs]) => {
    const m = mixed(id, imgs)
    // Querformate nach hinten, damit die ersten 4 (Startseite) Hochformat bleiben
    return [id, [...m.filter((i) => !LANDSCAPE.includes(i)), ...m.filter((i) => LANDSCAPE.includes(i))]]
  }),
) }
export const BTS_IMAGES: string[] = [bts1, bts2, bts3, bts4, bts5]
