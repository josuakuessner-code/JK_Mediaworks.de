import { useReducedMotion } from 'framer-motion'
import type { Anfrage } from '../lib/anfrage'
import { SITE } from '../data/content'

// Bestätigung nach dem Absenden: Quittung läuft aus dem Schlitz und bekommt einen Stempel.
const de = (iso: string) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '')

export default function Receipt({ data }: { data: Anfrage | null }) {
  const reduce = useReducedMotion()
  const now = new Date()
  const termin = data?.datum ? (data.datumBis ? `${de(data.datum)} – ${de(data.datumBis)}` : de(data.datum)) : 'offen'
  const rows: [string, string][] = [
    ['Anlass', data?.anlass || '–'],
    ['Termin', termin],
    ['Ort', data?.ort || '–'],
    ['Eingang', `${now.toLocaleDateString('de-DE')}, ${now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`],
  ]
  return (
    <div className="receipt mx-auto mb-8 w-full max-w-[300px]" aria-hidden="true">
      <div className="receipt-slot" />
      <div className="receipt-feed">
        <div className={`receipt-paper ${reduce ? 'is-still' : 'is-out'}`}>
          <p className="receipt-logo">{SITE.brand.toUpperCase()}</p>
          <p className="text-center">Anfrage eingegangen</p>
          <hr />
          {rows.map(([k, v]) => (
            <p key={k} className="flex justify-between gap-3">
              <span className="text-[#D7E2EA]/60">{k}</span>
              <span className="min-w-0 truncate text-right">{v}</span>
            </p>
          ))}
          <hr />
          <p className="text-center">Ich melde mich bei dir.</p>
          <span className="receipt-stamp">Gesendet</span>
        </div>
      </div>
    </div>
  )
}
