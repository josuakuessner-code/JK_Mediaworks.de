import { jsPDF } from 'jspdf'
import { SITE } from '../data/content'

export type Anfrage = {
  name: string
  email: string
  phone: string
  firma: string
  adresse: string
  anlass: string
  datum: string
  zeit: string
  ort: string
  personen: string
  express: boolean
  formate: string[]
  formatEigen: string
  budget: string
  nachricht: string
}

const de = (iso: string) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '')

/** Baut die Anfrage als PDF (läuft komplett im Browser, nichts wird vorher an Dritte gesendet). */
export function buildAnfragePdf(a: Anfrage) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const M = 20
  const now = new Date()
  const ref = `A-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`

  doc.setFillColor(12, 12, 12)
  doc.rect(0, 0, W, 42, 'F')
  doc.setTextColor(215, 226, 234)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text(SITE.brand.toUpperCase(), M, 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Anfrage / Angebotsanfrage Fotografie', M, 28)
  doc.text(`Referenz ${ref}  |  ${now.toLocaleDateString('de-DE')}`, M, 34)

  let y = 58
  const ensure = (h: number) => {
    if (y + h > 280) {
      doc.addPage()
      y = 24
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
  row('Datum', de(a.datum))
  row('Uhrzeit / Dauer', a.zeit)
  row('Ort', a.ort)
  row('Personen / Gäste', a.personen)
  y += 4
  section('Wünsche')
  row('Lieferung', a.express ? 'Schnelle Lieferung (Express) gewünscht' : '')
  row('Bildformate', [...a.formate, a.formatEigen].filter((x) => x.trim()).join(', '))
  row('Budget', a.budget)
  row('Nachricht', a.nachricht)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(`Automatisch erstellt über die Website von ${SITE.brand}. Unverbindliche Anfrage, kein Vertrag.`, M, 288)

  return {
    blob: doc.output('blob') as Blob,
    base64: (doc.output('datauristring') as string).split(',')[1],
    fileName: `Anfrage-${SITE.brand}-${ref}.pdf`,
    ref,
  }
}
