// Anfrage-PDF im Worker, ohne Bibliothek. Gleicher Aufbau und gleiche Farben wie src/lib/anfrage.ts (jsPDF im Browser),
// damit die Bestätigungsmail ein PDF bekommt, das der Server selbst aus den geprüften Angaben baut (kein fremdes PDF an fremde Adressen).
const K = 72 / 25.4 // mm -> pt
const W = 210
const H = 297
const M = 20

// Zeichen in WinAnsi (1 Byte) umsetzen; alles andere wird zu "?"
const WIN: Record<string, number> = { '€': 128, '‚': 130, '„': 132, '…': 133, '–': 150, '—': 151, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149 }
const enc = (s: string) =>
  [...s]
    .map((c) => (WIN[c] ? String.fromCharCode(WIN[c]) : c.codePointAt(0)! < 256 ? c : '?'))
    .join('')
    .replace(/[\\()]/g, (m) => '\\' + m)

// Ungefähre Breite in Helvetica (Anteil der Schriftgröße), reicht für sauberen Zeilenumbruch
const hw = (s: string) =>
  [...s].reduce((n, c) => n + (/[il.,:;'|!jtfI ]/.test(c) ? 0.28 : /[mwMW@]/.test(c) ? 0.85 : /[A-ZÄÖÜ]/.test(c) ? 0.68 : /[0-9]/.test(c) ? 0.56 : 0.52), 0)

function wrap(text: string, maxPt: number, size: number) {
  const out: string[] = []
  for (const para of text.split(/\r?\n/)) {
    let line = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word
      if (hw(next) * size > maxPt && line) {
        out.push(line)
        line = word
      } else line = next
      while (hw(line) * size > maxPt && line.length > 1) {
        let cut = line.length - 1
        while (cut > 1 && hw(line.slice(0, cut)) * size > maxPt) cut--
        out.push(line.slice(0, cut))
        line = line.slice(cut)
      }
    }
    out.push(line)
  }
  while (out.length > 1 && out[out.length - 1] === '') out.pop()
  return out
}

const berlin = (d: Date) =>
  Object.fromEntries(
    new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  )

export type PdfAnfrage = Record<
  'name' | 'email' | 'phone' | 'firma' | 'adresse' | 'anlass' | 'titel' | 'datum' | 'datumBis' | 'zeit' | 'ort' | 'personen' | 'formate' | 'budget' | 'nachricht',
  string
> & { express: boolean }

export function buildAnfragePdf(a: PdfAnfrage, brand: string, now = new Date()) {
  const t = berlin(now)
  const ref = `A-${t.year}${t.month}${t.day}-${t.hour}${t.minute}`
  const rgb = (r: number, g: number, b: number) => `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`
  const pages: string[][] = []
  let ops: string[] = []
  // Koordinaten in mm von oben wie bei jsPDF, hier in PDF-Punkte von unten umgerechnet
  const text = (x: number, y: number, font: 'F1' | 'F2', size: number, color: string, s: string) =>
    ops.push(`BT ${color} rg /${font} ${size} Tf ${(x * K).toFixed(2)} ${((H - y) * K).toFixed(2)} Td (${enc(s)}) Tj ET`)
  const newPage = () => {
    ops = []
    pages.push(ops)
  }

  newPage()
  ops.push(`${rgb(12, 12, 12)} rg 0 ${((H - 42) * K).toFixed(2)} ${(W * K).toFixed(2)} ${(42 * K).toFixed(2)} re f`)
  text(M, 20, 'F2', 22, rgb(215, 226, 234), brand.toUpperCase())
  text(M, 28, 'F1', 10, rgb(215, 226, 234), 'Anfrage / Angebotsanfrage Fotografie')
  text(M, 34, 'F1', 10, rgb(215, 226, 234), `Referenz ${ref}  |  ${t.day}.${t.month}.${t.year}`)

  let y = 58
  const ensure = (h: number) => {
    if (y + h > 280) {
      newPage()
      y = 24
    }
  }
  const section = (title: string) => {
    ensure(14)
    text(M, y, 'F2', 11, rgb(118, 33, 176), title.toUpperCase())
    ops.push(`${rgb(215, 226, 234)} RG 0.57 w ${(M * K).toFixed(2)} ${((H - y - 2) * K).toFixed(2)} m ${((W - M) * K).toFixed(2)} ${((H - y - 2) * K).toFixed(2)} l S`)
    y += 9
  }
  const row = (label: string, value: string) => {
    if (!value.trim()) return
    const lines = wrap(value, (W - M * 2 - 42) * K, 10)
    ensure(lines.length * 5.2 + 3)
    text(M, y, 'F2', 10, rgb(90, 90, 90), label)
    lines.forEach((l, i) => text(M + 42, y + i * 5.2, 'F1', 10, rgb(20, 20, 20), l))
    y += lines.length * 5.2 + 3
  }
  const de = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split('-').reverse().join('.') : iso)

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
  row('Bildformate', a.formate)
  row('Budget', a.budget)
  row('Nachricht', a.nachricht)

  ops = pages[pages.length - 1]
  text(M, 288, 'F1', 8, rgb(120, 120, 120), `Automatisch erstellt über die Website von ${brand}. Unverbindliche Anfrage, kein Vertrag.`)

  // PDF zusammensetzen (alle Zeichen < 256, also 1 Byte je Zeichen)
  const objs: (string | null)[] = []
  const add = (o: string | null) => (objs.push(o), objs.length)
  const catalog = add(null)
  const pagesId = add(null)
  const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
  const res = `<< /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >>`
  const kids = pages.map((p) => {
    const stream = p.join('\n')
    const c = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
    return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${(W * K).toFixed(2)} ${(H * K).toFixed(2)}] /Resources ${res} /Contents ${c} 0 R >>`)
  })
  objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(' ')}] /Count ${kids.length} >>`
  const info = add(`<< /Title (${enc(`Anfrage ${ref}`)}) /Author (${enc(brand)}) >>`)

  let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
  const offs = objs.map((o, i) => {
    const at = out.length
    out += `${i + 1} 0 obj\n${o}\nendobj\n`
    return at
  })
  const xref = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offs.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF`
  return { base64: btoa(out), fileName: `Anfrage-${brand}-${ref}.pdf`, ref }
}
