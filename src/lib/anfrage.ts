import { jsPDF } from 'jspdf'
import { SITE } from '../data/content'
import { PL_LOGO_B64 } from './pdf-logo'

export type Anfrage = {
  name: string
  email: string
  phone: string
  firma: string
  adresse: string
  anlass: string
  titel: string
  datum: string
  datumBis: string
  zeit: string
  ort: string
  personen: string
  express: boolean
  formate: string[]
  formatEigen: string
  budget: string
  nachricht: string
}

// Kopfkarte nach Zentrale-PDF-Design.md: abgerundete Karte mit Verlauf (als Canvas-Bild), JK-Logo, Titel als echter PDF-Text.
// Der Worker (worker/pdf.ts) baut für die Bestätigungsmail dasselbe Design nach.
const PL_HEAD_STOPS: [number, number[]][] = [[0, [32, 1, 38]], [0.12, [84, 1, 84]], [0.35, [172, 0, 159]], [0.5, [155, 14, 171]], [0.75, [108, 33, 180]], [1, [89, 34, 188]]]
function plHeadBg(wMm: number, hMm: number) {
  try {
    const K = 8, w = Math.round(wMm * K), h = Math.round(hMm * K), r = 5 * K, c = document.createElement('canvas')
    c.width = w
    c.height = h
    const g = c.getContext('2d')
    if (!g) return ''
    g.beginPath(); g.moveTo(r, 0); g.arcTo(w, 0, w, h, r); g.arcTo(w, h, 0, h, r); g.arcTo(0, h, 0, 0, r); g.arcTo(0, 0, w, 0, r); g.closePath()
    const gr = g.createLinearGradient(0, 0, w, h * 0.45)
    PL_HEAD_STOPS.forEach(([t, col]) => gr.addColorStop(t, `rgb(${col[0]},${col[1]},${col[2]})`))
    g.fillStyle = gr
    g.fill()
    return c.toDataURL('image/png')
  } catch {
    return ''
  }
}
function plHeader(doc: jsPDF, W: number, kicker: string, title: string, sub: string, x = 14) {
  const cw = W - 2 * x, ch = 24, y0 = 8, bg = plHeadBg(cw, ch)
  let ok = false
  if (bg) { try { doc.addImage(bg, 'PNG', x, y0, cw, ch); ok = true } catch { /* Ersatz unten */ } }
  if (!ok) { doc.setFillColor(108, 33, 180); doc.roundedRect(x, y0, cw, ch, 5, 5, 'F') }
  try { doc.addImage('data:image/png;base64,' + PL_LOGO_B64, 'PNG', x + 5, y0 + 5, 14, 14) } catch { /* ohne Logo weiter */ }
  const tx = x + 25, tw = cw - 25 - 6, lead = kicker ? kicker + '  ·  ' : ''
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(17)
  doc.text((doc.splitTextToSize(title || 'Ohne Titel', tw) as string[])[0], tx, y0 + (sub || lead ? 11 : 14.2))
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(245, 232, 250)
  const st = lead + sub
  if (st.trim()) doc.text((doc.splitTextToSize(st, tw) as string[])[0], tx, y0 + 17.5)
  doc.setTextColor(0, 0, 0)
}

const de = (iso: string) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '')

/** Baut die Anfrage als PDF (läuft komplett im Browser, nichts wird vorher an Dritte gesendet). */
export function buildAnfragePdf(a: Anfrage) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const M = 14
  const now = new Date()
  const ref = `A-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`

  plHeader(doc, W, 'Angebotsanfrage Fotografie', 'Anfrage', `Referenz ${ref}  ·  ${now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`, M)

  let y = 46
  const ensure = (h: number) => {
    if (y + h > 276) {
      doc.addPage()
      y = 20
    }
  }
  const section = (title: string) => {
    ensure(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(118, 33, 176)
    doc.text(title.toUpperCase(), M, y)
    doc.setDrawColor(215, 226, 234)
    doc.line(M, y + 2, W - M, y + 2)
    y += 9
  }
  const row = (label: string, value: string) => {
    if (!value.trim()) return
    const lines = doc.splitTextToSize(value, W - M * 2 - 42) as string[]
    ensure(lines.length * 5.2 + 3)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(90, 90, 90)
    doc.text(label, M, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(20, 20, 20)
    doc.text(lines, M + 42, y)
    y += lines.length * 5.2 + 3
  }

  section('Kontakt')
  row('Name', a.name)
  row('E-Mail', a.email)
  row('Telefon', a.phone)
  row('Firma', a.firma)
  row('Adresse', a.adresse)
  y += 4
  section('Anlass')
  row('Art', a.anlass)
  row('Titel / Beschreibung', a.titel)
  row(a.datumBis ? 'Von' : 'Datum', de(a.datum))
  row('Bis', de(a.datumBis))
  row('Uhrzeit / Dauer', a.zeit)
  row('Ort', a.ort)
  row('Personen / Gäste', a.personen)
  y += 4
  section('Wünsche')
  row('Lieferung', a.express ? 'Schnelle Lieferung (Express) gewünscht' : '')
  row('Bildformate', [...a.formate, a.formatEigen].filter((x) => x.trim()).join(', '))
  row('Budget', a.budget)
  row('Nachricht', a.nachricht)

  // Fußzeile auf jeder Seite, y=285, 8 pt grau
  const n = doc.getNumberOfPages()
  for (let i = 1; i <= n; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`Automatisch erstellt über die Website von ${SITE.brand}. Unverbindliche Anfrage, kein Vertrag.`, M, 285)
    if (n > 1) doc.text(`Seite ${i}/${n}`, W - M, 285, { align: 'right' })
  }

  return {
    blob: doc.output('blob') as Blob,
    base64: (doc.output('datauristring') as string).split(',')[1],
    fileName: `Anfrage-${SITE.brand}-${ref}.pdf`,
    ref,
  }
}
