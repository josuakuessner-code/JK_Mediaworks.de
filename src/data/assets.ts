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
import p3a from '../assets/p3a.webp'
import p3b from '../assets/p3b.webp'
import p3c from '../assets/p3c.webp'
import p3d from '../assets/p3d.webp'
import p4a from '../assets/p4a.webp'
import p4b from '../assets/p4b.webp'
import p4c from '../assets/p4c.webp'
import about1 from '../assets/about1.webp'
import about2 from '../assets/about2.webp'
import about3 from '../assets/about3.webp'
import about4 from '../assets/about4.webp'

// Alle Bilder liegen lokal im Projekt (src/assets) und werden vom eigenen Server ausgeliefert, keine Fremd-Hotlinks.
export const HERO_PORTRAIT = portrait
export const MARQUEE_IMAGES: string[] = [mq01, mq02, mq03, mq04, mq05, mq06, mq07, mq08, mq09, mq10, mq11]
export const ABOUT_IMAGES = { moon: about1, object: about2, lego: about3, group: about4 }
export const PROJECT_IMAGES: string[][] = [
  [p1a, p1b, p1c],
  [p2a, p2b, p2c],
  [p3b, p3a, p3c, p3d],
  [p4a, p4b, p4c],
]
