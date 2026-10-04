import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { Check, Download, Mail, MapPin } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import CopyEmail from '../components/CopyEmail'
import { SERVICES, SITE } from '../data/content'
import type { Anfrage } from '../lib/anfrage'
import { downloadBlob, goTo, openMail } from '../lib/links'
import { mailtoHref } from '../lib/mailtext'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '/api/anfrage'
const ANLAESSE = [...SERVICES.flatMap((s) => (s.name === 'Konzerte & Events' ? ['Konzerte', 'Events'] : [s.name])), 'Sonstiges']
const FORMATE = [
  '16:9 Querformat',
  '3:2 Querformat (Original)',
  '4:3 Querformat',
  '1:1 Quadrat',
  '4:5 Hochformat (Instagram)',
  '2:3 Hochformat',
  '9:16 Hochkant (Story / Reel)',
  'Unbeschnitten (Original)',
]

const field =
  'w-full rounded-2xl border border-[#D7E2EA]/20 bg-[#161616] px-5 py-3.5 text-base font-light text-[#D7E2EA] placeholder:text-[#D7E2EA]/35 transition-colors duration-200 focus:border-[#B600A8] focus:outline-none focus-visible:outline-none'
const labelCls = 'mb-2 block text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/70'

const Card = ({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) => (
  <FadeIn y={40} delay={delay}>
    <fieldset className="rounded-[32px] border-2 border-[#D7E2EA]/25 bg-[#0C0C0C] p-5 sm:rounded-[40px] sm:p-8">
      <legend className="hero-heading px-2 text-2xl font-black uppercase sm:text-3xl">{title}</legend>
      <div className="mt-2 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  </FadeIn>
)

const Field = ({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) => (
  <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
    <span className={labelCls}>{label}</span>
    {children}
  </label>
)

const Chip = ({ active, onClick, children, type }: { active: boolean; onClick: () => void; children: ReactNode; type: 'radio' | 'checkbox' }) => (
  <button
    type="button"
    role={type}
    aria-checked={active}
    onClick={onClick}
    className={`press rounded-full border-2 px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${
      active ? 'border-transparent text-white' : 'border-[#D7E2EA]/40 text-[#D7E2EA] hover:bg-[#D7E2EA]/10'
    }`}
    style={active ? { background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' } : undefined}
  >
    {children}
  </button>
)

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactPage() {
  const [anlass, setAnlass] = useState('')
  const [formate, setFormate] = useState<string[]>([])
  const [express, setExpress] = useState(false)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [pdf, setPdf] = useState<{ blob: Blob; fileName: string } | null>(null)
  const [mehrtaegig, setMehrtaegig] = useState(false)
  const [datumVon, setDatumVon] = useState('')
  const [errorInfo, setErrorInfo] = useState('')
  const [sentData, setSentData] = useState<Anfrage | null>(null)
  const [anlassMissing, setAnlassMissing] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = `Anfrage – ${SITE.brand}`
    return () => {
      document.title = prev
    }
  }, [])

  // Liest die aktuell ausgewählten/eingetragenen Werte, um daraus einen passenden Mailtext zu bauen.
  const current = (): Partial<Anfrage> => {
    const form = document.getElementById('anfrage-form') as HTMLFormElement | null
    const f = form ? new FormData(form) : null
    const v = (k: string) => String(f?.get(k) ?? '').trim()
    return {
      name: v('name'), email: v('email'), phone: v('phone'), firma: v('firma'), adresse: v('adresse'), anlass, titel: v('titel'),
      datum: v('datum'), datumBis: mehrtaegig ? v('datumBis') : '', zeit: v('zeit'), ort: v('ort'), personen: v('personen'), express, formate, formatEigen: v('formatEigen'),
      budget: v('budget'), nachricht: v('nachricht'),
    }
  }
  const fillMailto = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = mailtoHref(sentData ?? current())
    openMail(e)
  }

  const toggle = (w: string) => setFormate((l) => (l.includes(w) ? l.filter((x) => x !== w) : [...l, w]))

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!anlass) {
      setAnlassMissing(true)
      document.getElementById('anlass-group')?.scrollIntoView({ block: 'center' })
      return
    }
    if (!consent) return
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    const data: Anfrage = {
      name: v('name'), email: v('email'), phone: v('phone'), titel: v('titel'), firma: v('firma'), adresse: v('adresse'), anlass,
      datum: v('datum'), datumBis: mehrtaegig ? v('datumBis') : '', zeit: v('zeit'), ort: v('ort'), personen: v('personen'),
      express, formate, formatEigen: v('formatEigen'), budget: v('budget'), nachricht: v('nachricht'),
    }
    setSentData(data)
    setStatus('sending')
    try {
      const { buildAnfragePdf } = await import('../lib/anfrage') // PDF-Bibliothek erst beim Absenden laden
      const out = buildAnfragePdf(data)
      setPdf({ blob: out.blob, fileName: out.fileName })
      try {
        const res = await fetch(ENDPOINT, {
          signal: AbortSignal.timeout(25000), // nie endlos „Wird gesendet …“
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...data, website: v('website'), pdfBase64: out.base64, fileName: out.fileName }),
        })
        if (!res.ok) {
          const info = await res.json().catch(() => null)
          throw new Error(`${res.status}${info?.detail ? ` ${info.detail}` : info?.error ? ` ${info.error}` : ''}`)
        }
        setStatus('sent')
      } catch (err) {
        setErrorInfo(err instanceof Error ? err.message : '')
        downloadBlob(out.blob, out.fileName)
        setStatus('error')
      }
    } catch (err) {
      setErrorInfo(err instanceof Error ? `PDF: ${err.message}` : 'PDF konnte nicht erstellt werden')
      // PDF-Baustein nicht ladbar (z. B. veraltete Seite nach einem Update): Mail-Fallback statt endlosem Laden
      setStatus('error')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const done = status === 'sent' || status === 'error'

  return (
    <main lang="de" className="relative mx-auto min-h-screen max-w-6xl px-5 py-10 text-[#D7E2EA] sm:px-8 md:py-16">
      <a href="#" onClick={goTo} className="press mb-10 inline-block text-sm font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70">← Zurück</a>

      <FadeIn y={40}>
        <h1 className="hero-heading mb-6 text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 13vw, 170px)' }}>
          Anfrage
        </h1>
      </FadeIn>
      <FadeIn y={20} delay={0.1}>
        <p className="mx-auto mb-14 max-w-[600px] text-center font-medium leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
          Erzähl mir kurz, was du vorhast. Aus deinen Angaben entsteht eine PDF-Anfrage, die direkt bei mir im Postfach landet. Ich melde mich mit einem Angebot.
        </p>
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <FadeIn x={-60} y={0} duration={0.9} className="lg:sticky lg:top-10 lg:self-start">
          <aside className="rounded-[32px] border-2 border-[#D7E2EA]/25 p-6 sm:rounded-[40px] sm:p-8">
            <h2 className="hero-heading mb-6 text-2xl font-black uppercase sm:text-3xl">Direkt schreiben</h2>
            <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/70"><Mail size={16} aria-hidden /> E-Mail</p>
            <CopyEmail className="mb-8 flex-wrap break-all text-lg font-light" />
            <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/70"><MapPin size={16} aria-hidden /> Standort</p>
            <p className="mb-8 text-lg font-light">Wiesbaden und Rhein-Main-Gebiet, für passende Anlässe auch darüber hinaus.</p>
            <a href={`mailto:${SITE.email}`} onClick={fillMailto} className="press inline-block rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-[#D7E2EA]/10">
              Mail öffnen
            </a>
          </aside>
        </FadeIn>

        <div>
          {done ? (
            <FadeIn y={30}>
              <div role="status" className="rounded-[32px] border-2 border-[#D7E2EA]/25 p-8 text-center sm:rounded-[40px] sm:p-12">
                <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}>
                  <Check size={30} aria-hidden />
                </span>
                {status === 'sent' ? (
                  <>
                    <h2 className="hero-heading mb-3 text-3xl font-black uppercase sm:text-4xl">Anfrage gesendet</h2>
                    <p className="mx-auto mb-8 max-w-[440px] font-light leading-relaxed">Danke! Deine Anfrage ist als PDF bei mir angekommen. Ich melde mich bei dir.</p>
                  </>
                ) : (
                  <>
                    <h2 className="hero-heading mb-3 text-3xl font-black uppercase sm:text-4xl">PDF erstellt</h2>
                    <p className="mx-auto mb-8 max-w-[480px] font-light leading-relaxed">
                      Das automatische Senden hat gerade nicht geklappt. Falls ein PDF erstellt wurde, ist es heruntergeladen. Schick es bitte per Mail an <strong className="font-medium">{SITE.email}</strong>. Der Mailtext ist schon vorbereitet, das PDF hängst du einfach an.
                    </p>
                  </>
                )}
                {status === 'error' && errorInfo && <p className="mx-auto mb-6 max-w-[480px] break-words text-xs font-light text-[#D7E2EA]/50">Technische Info: {errorInfo}</p>}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {pdf && (
                    <button type="button" onClick={() => downloadBlob(pdf.blob, pdf.fileName)} className="press inline-flex items-center gap-3 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-[#D7E2EA]/10">
                      <Download size={18} aria-hidden /> PDF herunterladen
                    </button>
                  )}
                  {status === 'error' && (
                    <a href={mailtoHref(sentData ?? {})} onClick={fillMailto} className="press inline-block rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200 hover:bg-[#D7E2EA]/10">
                      Mail öffnen
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ) : (
            <form id="anfrage-form" onSubmit={submit} className="flex flex-col gap-6" noValidate={false} aria-busy={status === 'sending'}>
              <Card title="Kontakt">
                <Field label="Name *"><input name="name" required autoComplete="name" className={field} placeholder="Vor- und Nachname" /></Field>
                <Field label="E-Mail *"><input name="email" type="email" required autoComplete="email" className={field} placeholder="du@beispiel.de" /></Field>
                <Field label="Telefon (optional)"><input name="phone" type="tel" autoComplete="tel" className={field} placeholder="Für Rückfragen" /></Field>
                <Field label="Firma (optional)"><input name="firma" autoComplete="organization" className={field} placeholder="Verein, Unternehmen …" /></Field>
                <Field label="Adresse (optional)" full><input name="adresse" autoComplete="street-address" className={field} placeholder="Straße, PLZ, Ort (z. B. für das Angebot)" /></Field>
              </Card>

              <FadeIn y={40}>
                <fieldset id="anlass-group" className="rounded-[32px] border-2 border-[#D7E2EA]/25 p-5 sm:rounded-[40px] sm:p-8">
                  <legend className="hero-heading px-2 text-2xl font-black uppercase sm:text-3xl">Worum geht es? *</legend>
                  <div role="radiogroup" aria-label="Anlass" className="mt-3 flex flex-wrap gap-3">
                    {ANLAESSE.map((a) => (
                      <Chip key={a} type="radio" active={anlass === a} onClick={() => { setAnlass(a); setAnlassMissing(false) }}>{a}</Chip>
                    ))}
                  </div>
                  <label className="mt-6 block">
                    <span className={labelCls}>Titel oder kurze Beschreibung (optional)</span>
                    <input name="titel" maxLength={160} className={field} placeholder="z. B. Sommerfest TSV Musterstadt oder Abiball 2027" />
                  </label>
                  {anlassMissing && <p role="alert" className="mt-4 text-sm text-[#BE4C00]">Bitte wähle einen Anlass aus.</p>}
                </fieldset>
              </FadeIn>

              <Card title="Termin & Ort">
                <Field label={mehrtaegig ? 'Von' : 'Datum'}><input name="datum" type="date" value={datumVon} onChange={(e) => setDatumVon(e.target.value)} className={`${field} [color-scheme:dark]`} /></Field>
                {mehrtaegig ? (
                  <Field label="Bis"><input name="datumBis" type="date" min={datumVon || undefined} required className={`${field} [color-scheme:dark]`} /></Field>
                ) : (
                  <Field label="Uhrzeit / Dauer"><input name="zeit" className={field} placeholder="z. B. 14 bis 20 Uhr" /></Field>
                )}
                <div className="sm:col-span-2">
                  <Chip type="checkbox" active={mehrtaegig} onClick={() => setMehrtaegig((v) => !v)}>Mehrtägiger Termin</Chip>
                </div>
                {mehrtaegig && <Field label="Uhrzeit / Dauer pro Tag" full><input name="zeit" className={field} placeholder="z. B. täglich 10 bis 18 Uhr" /></Field>}
                <Field label="Ort *"><input name="ort" required className={field} placeholder="Stadt oder Location" /></Field>
                <Field label="Personen / Gäste"><input name="personen" className={field} placeholder="ca. Anzahl" /></Field>
              </Card>

              <FadeIn y={40}>
                <fieldset className="rounded-[32px] border-2 border-[#D7E2EA]/25 p-5 sm:rounded-[40px] sm:p-8">
                  <legend className="hero-heading px-2 text-2xl font-black uppercase sm:text-3xl">Wünsche</legend>
                  <div className="mt-3">
                    <Chip type="checkbox" active={express} onClick={() => setExpress((v) => !v)}>Schnelle Lieferung (Express)</Chip>
                  </div>
                  <p className={`${labelCls} mt-8`}>Gewünschtes Bildformat (Mehrfachauswahl)</p>
                  <div role="group" aria-label="Bildformat" className="flex flex-wrap gap-3">
                    {FORMATE.map((w) => (
                      <Chip key={w} type="checkbox" active={formate.includes(w)} onClick={() => toggle(w)}>{w}</Chip>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-5">
                    <Field label="Anderes Format (optional)"><input name="formatEigen" className={field} placeholder="z. B. 5:7 oder 1080 × 1350 px" /></Field>
                    <Field label="Budgetvorstellung (optional)"><input name="budget" className={field} placeholder="z. B. Rahmen oder Festpreis" /></Field>
                    <Field label="Nachricht"><textarea name="nachricht" rows={5} className={`${field} resize-y`} placeholder="Was ist dir wichtig? Besondere Wünsche, Ablauf, Verwendung der Bilder …" /></Field>
                  </div>
                </fieldset>
              </FadeIn>

              {/* Honeypot gegen Spam-Bots, für Menschen unsichtbar */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>

              <FadeIn y={30}>
                <label className="mb-6 flex cursor-pointer items-start gap-4 text-sm font-light leading-relaxed">
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#B600A8]" />
                  <span>
                    Ich habe die <a href="#/datenschutz" onClick={goTo} className="underline underline-offset-4">Datenschutzerklärung</a> gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. *
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'sending' || !consent}
                  aria-disabled={!consent}
                  className="press inline-block rounded-full px-10 py-4 text-base font-medium uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                    boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                    outline: '2px solid white',
                    outlineOffset: '-3px',
                  }}
                >
                  {status === 'sending' ? 'Wird gesendet …' : 'Anfrage senden'}
                </button>
                {!consent && <p className="mt-3 text-sm font-light text-[#D7E2EA]/60">Bitte bestätige zuerst die Datenschutzerklärung, dann kannst du die Anfrage senden.</p>}
              </FadeIn>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
