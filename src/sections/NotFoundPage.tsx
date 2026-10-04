import { goTo } from '../lib/links'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-5 py-16 text-[#D7E2EA] sm:px-8">
      <p className="text-sm font-medium uppercase tracking-widest text-[#D7E2EA]/70">Fehler 404</p>
      <h1 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem, 9vw, 110px)' }}>Seite nicht gefunden</h1>
      <p className="max-w-[460px] font-light leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
        Diese Seite gibt es nicht (mehr). Vielleicht hat sich ein Tippfehler eingeschlichen.
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="/" onClick={goTo} className="press inline-block rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10">Zur Startseite</a>
        <a href="/kontakt" onClick={goTo} className="press inline-block rounded-full border-2 border-[#D7E2EA]/60 px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-[#D7E2EA]/10">Anfrage senden</a>
      </div>
    </main>
  )
}
