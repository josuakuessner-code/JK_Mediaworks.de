import { goTo, openMail } from '../lib/links'
import { useEffect } from 'react'
import { SITE } from '../data/content'

function Impressum() {
  return (
    <>
      <h1 className="hero-heading mb-8 font-black uppercase leading-none" style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}>Impressum</h1>
      <p className="mb-6 text-sm text-[#D7E2EA]/60">Angaben gemäß § 5 DDG.</p>
      <h2>Anbieter</h2>
      <p>Josua Küßner<br />JK-Mediaworks<br />Freesienweg 27<br />65201 Wiesbaden</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href={`mailto:${SITE.email}`} onClick={openMail}>{SITE.email}</a><br />Telefon: <a href="tel:+4917642487640">+49 176 42487640</a></p>
      <h2>Umsatzsteuer</h2>
      <p>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</p>
    </>
  )
}

function Datenschutz() {
  return (
    <>
      <h1 className="hero-heading mb-8 font-black uppercase leading-none" style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}>Datenschutz</h1>
      <p className="mb-6 text-sm text-[#D7E2EA]/60">Entwurf zur Orientierung, keine Rechtsberatung. Bitte vor Livegang mit einem Generator (z. B. eRecht24, Datenschutz-Generator.de) abgleichen. Die Erklärung muss exakt zur eingesetzten Technik passen.</p>
      <h2>Verantwortlicher</h2>
      <p>Josua Küßner, Freesienweg 27, 65201 Wiesbaden, E-Mail: <a href={`mailto:${SITE.email}`} onClick={openMail}>{SITE.email}</a></p>
      <h2>Hosting und Server-Logfiles</h2>
      <p>Beim Aufruf der Seite verarbeitet der Hoster technisch notwendig deine IP-Adresse, Datum/Uhrzeit, aufgerufene Datei und Browserangaben (Art. 6 Abs. 1 lit. f DSGVO, Interesse am sicheren Betrieb). Hoster: Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Die Speicherdauer der Server-Logs richtet sich nach den Angaben des Hosters. Mit dem Hoster besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO, Cloudflare Data Processing Addendum); eine Datenübermittlung in die USA stützt sich auf die EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework.</p>
      <h2>Schriftarten</h2>
      <p>Die Schrift „Kanit“ wird lokal von diesem Server ausgeliefert. Es wird keine Verbindung zu Google oder anderen Schriftanbietern aufgebaut.</p>
      <h2>Kontaktaufnahme per E-Mail</h2>
      <p>Wenn du mir schreibst, verarbeite ich deine Angaben zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden gelöscht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
      <h2>Anfrageformular</h2>
      <p>Wenn du das Formular nutzt, werden deine Angaben (Name, E-Mail, ggf. Telefon, Firma, Adresse, Anlass, Termin, Ort, Wünsche, Nachricht) im Browser zu einem PDF zusammengefügt und an mich übermittelt, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b DSGVO). Der Versand erfolgt über den Dienst Resend (Resend, Inc., San Francisco, USA, mit Auftragsverarbeitungsvertrag) und die Serverfunktion bei Cloudflare (siehe Hosting). Die Daten werden gelöscht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen. Die Angabe von Telefon, Datum, Budget und Nachricht ist freiwillig.</p>
      <h2>Spamschutz (Cloudflare Turnstile)</h2>
      <p>Das Anfrageformular ist mit Cloudflare Turnstile gegen automatisierten Missbrauch geschützt. Dabei lädt dein Browser ein Skript von Cloudflare, Inc. (USA) und es werden technische Angaben wie IP-Adresse und Browsermerkmale zur Prüfung übermittelt (Art. 6 Abs. 1 lit. f DSGVO, Interesse am Schutz vor Spam). Turnstile setzt dafür keine Werbe-Cookies.</p>
      <h2>Bestätigungs-E-Mail</h2>
      <p>Nach dem Absenden erhältst du an die angegebene Adresse eine kurze Bestätigung. Sie wird über Resend versendet (siehe Anfrageformular).</p>
      <h2>Cookies, Tracking</h2>
      <p>Diese Seite setzt keine Cookies und verwendet keine Analyse- oder Marketing-Dienste.</p>
      <h2>Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Du kannst dich bei der Aufsichtsbehörde beschweren, in Hessen beim Hessischen Beauftragten für Datenschutz und Informationsfreiheit (HBDI).</p>
    </>
  )
}

export default function LegalPage({ page }: { page: 'impressum' | 'datenschutz' }) {
  useEffect(() => {
    window.scrollTo(0, 0)
    const prev = document.title
    document.title = `${page === 'impressum' ? 'Impressum' : 'Datenschutz'} – ${SITE.brand}`
    return () => {
      document.title = prev
    }
  }, [page])

  return (
    <main lang="de" className="mx-auto min-h-screen max-w-3xl px-6 py-12 text-[#D7E2EA] md:py-20 [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:uppercase [&_p]:font-light [&_p]:leading-relaxed">
      <a href="/" onClick={goTo} className="mb-10 inline-block text-sm font-medium uppercase tracking-wider no-underline transition-opacity duration-200 hover:opacity-70">← Zurück</a>
      {page === 'impressum' ? <Impressum /> : <Datenschutz />}
    </main>
  )
}
