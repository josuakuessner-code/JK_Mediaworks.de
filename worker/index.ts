// Cloudflare Worker: liefert die Website (dist) aus und nimmt unter /api/anfrage die Anfrage samt PDF entgegen,
// um sie per Resend an dein Postfach zu schicken. Einrichtung: README.md, Abschnitt "Anfrageformular".
interface Env {
  ASSETS: { fetch: (r: Request) => Promise<Response> }
  RESEND_API_KEY: string
  MAIL_TO: string
  MAIL_FROM?: string
}

const clean = (s: unknown, max = 200) => String(s ?? '').replace(/[\r\n]+/g, ' ').slice(0, max)
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

async function handleAnfrage(request: Request, env: Env) {
  if (!env.RESEND_API_KEY || !env.MAIL_TO) return json({ ok: false, error: 'not-configured' }, 500)
  let d: Record<string, unknown>
  try {
    d = await request.json()
  } catch {
    return json({ ok: false, error: 'bad-json' }, 400)
  }
  if (d.website) return json({ ok: true }) // Honeypot: Bots still ignorieren
  const email = clean(d.email)
  const name = clean(d.name)
  const pdf = String(d.pdfBase64 ?? '')
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !pdf || pdf.length > 4_000_000) {
    return json({ ok: false, error: 'invalid' }, 400)
  }
  const lines = [
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${clean(d.phone)}`,
    `Firma: ${clean(d.firma)}`,
    `Adresse: ${clean(d.adresse)}`,
    `Anlass: ${clean(d.anlass)}`,
    `Datum: ${clean(d.datum)}`,
    `Ort: ${clean(d.ort)}`,
    '',
    String(d.nachricht ?? '').slice(0, 4000),
    '',
    'Die vollständige Anfrage liegt als PDF bei.',
  ]
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'JK-Mediaworks Website <onboarding@resend.dev>',
      to: [env.MAIL_TO],
      reply_to: email,
      subject: `Neue Anfrage: ${clean(d.anlass, 60)} von ${name}`,
      text: lines.join('\n'),
      attachments: [{ filename: clean(d.fileName, 80) || 'Anfrage.pdf', content: pdf }],
    }),
  })
  return res.ok ? json({ ok: true }) : json({ ok: false, error: 'mail-failed' }, 502)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/anfrage') {
      return request.method === 'POST' ? handleAnfrage(request, env) : json({ ok: false, error: 'method' }, 405)
    }
    return env.ASSETS.fetch(request)
  },
}
