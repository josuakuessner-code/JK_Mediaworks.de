import { SITE } from '../data/content'
import type { Anfrage } from './anfrage'

const de = (iso: string) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '')

/** Erzeugt aus den (teilweise) ausgefüllten Formularangaben einen passenden Mailtext und den Betreff. */
export function buildMailText(a: Partial<Anfrage>) {
  const anlass = a.anlass || ''
  const subject = anlass ? `Anfrage ${anlass}${a.titel ? `: ${a.titel}` : ''}` : `Anfrage ${SITE.brand}`
  const parts: string[] = ['Hallo Josua,', '']
  const was = anlass ? `für ${anlass}${a.titel ? ` („${a.titel}“)` : ''}` : 'für ein Fotoprojekt'
  const wann = [a.datum ? (a.datumBis ? `vom ${de(a.datum)} bis ${de(a.datumBis)}` : `am ${de(a.datum)}`) : '', a.zeit ? `(${a.zeit})` : '', a.ort ? `in ${a.ort}` : ''].filter(Boolean).join(' ')
  parts.push(`ich interessiere mich ${was}${wann ? ` ${wann}` : ''} und würde gern ein Angebot von dir erhalten.`)
  if (a.personen) parts.push(`Es werden etwa ${a.personen} Personen erwartet.`)
  const formate = [...(a.formate ?? []), a.formatEigen ?? ''].filter((x) => x.trim())
  if (formate.length) parts.push(`Die Bilder hätte ich gern in folgenden Formaten: ${formate.join(', ')}.`)
  if (a.express) parts.push('Mir ist eine schnelle Lieferung wichtig.')
  if (a.budget) parts.push(`Mein Budgetrahmen: ${a.budget}.`)
  if (a.nachricht) parts.push('', a.nachricht)
  parts.push('', 'Viele Grüße', [a.name, a.firma].filter(Boolean).join(', '))
  if (a.adresse) parts.push(a.adresse)
  if (a.email || a.phone) parts.push([a.email, a.phone].filter(Boolean).join(' | '))
  return { subject, body: parts.join('\n').trim() }
}

export const mailtoHref = (a: Partial<Anfrage>) => {
  const { subject, body } = buildMailText(a)
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
