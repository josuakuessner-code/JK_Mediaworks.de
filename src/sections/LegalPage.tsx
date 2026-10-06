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
      <p className="mb-6 text-sm text-[#D7E2EA]/60">Zuletzt aktualisiert am 5. Oktober 2026</p>
      <h2>Verantwortlicher</h2>
      <p>Josua Küßner, JK-Mediaworks, Freesienweg 27, 65201 Wiesbaden, E-Mail: <a href={`mailto:${SITE.email}`} onClick={openMail}>{SITE.email}</a>, Telefon: <a href="tel:+4917642487640">+49 176 42487640</a></p>
      <h2>Überblick</h2>
      <p>Ich verarbeite personenbezogene Daten nur, soweit es für den Betrieb dieser Website und die Bearbeitung deiner Anfragen nötig ist. Diese Seite setzt keine Cookies, nutzt keine Werbedienste und bindet keine Inhalte von Drittanbietern wie Karten, Videos oder Schriftarten ein. Zur Reichweitenmessung kommt ausschließlich eine cookiefreie, anonyme Statistik von Cloudflare zum Einsatz (siehe unten).</p>
      <h2>Hosting und Server-Logfiles</h2>
      <p>Beim Aufruf der Seite verarbeitet der Hoster technisch notwendig deine IP-Adresse, Datum und Uhrzeit, die aufgerufene Datei und Browserangaben (Art. 6 Abs. 1 lit. f DSGVO, Interesse am sicheren und stabilen Betrieb). Hoster ist Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA. Die Speicherdauer der Server-Logs richtet sich nach den Angaben des Hosters. Mit dem Hoster besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO, Cloudflare Data Processing Addendum). Die Übermittlung in die USA stützt sich auf die EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework.</p>
      <h2>Schriftarten</h2>
      <p>Die Schrift „Kanit“ wird lokal von diesem Server ausgeliefert. Es wird keine Verbindung zu Google oder anderen Schriftanbietern aufgebaut.</p>
      <h2>Kontaktaufnahme per E-Mail, Telefon oder Instagram</h2>
      <p>Wenn du mir schreibst oder mich anrufst, verarbeite ich deine Angaben zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden gelöscht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen. Der Link zu Instagram ist ein normaler Link: Erst wenn du ihn anklickst, werden Daten an Instagram (Meta) übertragen, dann gelten dessen Datenschutzbestimmungen.</p>
      <h2>Anfrageformular</h2>
      <p>Wenn du das Formular nutzt, werden deine Angaben (Name, E-Mail, ggf. Telefon, Firma, Adresse, Anlass, Termin, Ort, Wünsche, Nachricht) im Browser zu einem PDF zusammengefügt und an mich übermittelt, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b DSGVO). Der Versand erfolgt über den Dienst Resend (Resend, Inc., San Francisco, USA, mit Auftragsverarbeitungsvertrag) und die Serverfunktion bei Cloudflare. Die Angabe von Telefon, Termin, Budget und Nachricht ist freiwillig. Die Daten werden gelöscht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
      <h2>Bestätigungs-E-Mail</h2>
      <p>Nach dem Absenden erhältst du an die angegebene Adresse eine kurze Bestätigung. Sie wird ebenfalls über Resend versendet.</p>
      <h2>Reichweitenmessung (Cloudflare Web Analytics)</h2>
      <p>Zur anonymen Reichweitenmessung nutzt diese Seite Cloudflare Web Analytics. Es werden keine Cookies gesetzt, keine Daten im Browser gespeichert und einzelne Besucher nicht über mehrere Seiten oder Geräte hinweg wiedererkannt. Erfasst werden nur aggregierte Angaben wie aufgerufene Seite, Herkunftsland, Browser, Gerätetyp und Ladezeiten. Deine IP-Adresse wird dafür nicht zur Profilbildung verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Interesse an einer stabilen und verständlich gestalteten Website). Anbieter: Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.</p>
      <h2>Spamschutz (Cloudflare Turnstile)</h2>
      <p>Das Anfrageformular ist mit Cloudflare Turnstile gegen automatisierten Missbrauch geschützt. Dabei lädt dein Browser ein Skript von Cloudflare, Inc. (USA), und es werden technische Angaben wie IP-Adresse und Browsermerkmale zur Prüfung übermittelt (Art. 6 Abs. 1 lit. f DSGVO, Interesse am Schutz vor Spam). Turnstile setzt dafür keine Werbe-Cookies.</p>
      <h2>Empfänger und Drittlandübermittlung</h2>
      <p>Empfänger deiner Daten sind nur die genannten Dienstleister (Cloudflare, Resend), soweit sie zur Erbringung ihrer Leistung nötig sind. Sie sitzen in den USA. Die Übermittlung stützt sich auf EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework. Eine darüber hinausgehende Weitergabe, ein Verkauf deiner Daten oder eine automatisierte Entscheidungsfindung findet nicht statt.</p>
      <h2>Datensicherheit</h2>
      <p>Die Website wird ausschließlich verschlüsselt per HTTPS ausgeliefert. Ich treffe angemessene technische und organisatorische Maßnahmen, um deine Daten vor Verlust und unbefugtem Zugriff zu schützen.</p>
      <h2>Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen. Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen. Schreib dafür einfach an die oben genannte E-Mail-Adresse. Du kannst dich außerdem bei einer Aufsichtsbehörde beschweren, in Hessen beim Hessischen Beauftragten für Datenschutz und Informationsfreiheit (HBDI), Postfach 3163, 65021 Wiesbaden.</p>
      <h2>Änderungen</h2>
      <p>Ich passe diese Erklärung an, wenn sich die Website oder die Rechtslage ändert. Es gilt die jeweils hier veröffentlichte Fassung.</p>
    </>
  )
}

export default function LegalPage({ page }: { page: 'impressum' | 'datenschutz' }) {
  useEffect(() => {
    window.scrollTo(0, 0)
    const prev = document.title
    document.title = `${page === 'impressum' ? 'Impressum' : 'Datenschutz'} | ${SITE.brand}`
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
