// Cloudflare Worker: liefert die Website (dist) aus und nimmt unter /api/anfrage die Anfrage samt PDF entgegen,
// um sie per Resend an dein Postfach zu schicken. Einrichtung: README.md, Abschnitt "Anfrageformular".
interface Env {
  ASSETS: { fetch: (r: Request) => Promise<Response> }
  RESEND_API_KEY: string
  MAIL_TO: string
  MAIL_FROM?: string
  TURNSTILE_SECRET?: string
}

const clean = (s: unknown, max = 200) => String(s ?? '').replace(/[\r\n]+/g, ' ').slice(0, max)
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(8000) })
    return ((await r.json()) as { success?: boolean }).success === true
  } catch {
    return false
  }
}

// Bestätigung an den Absender der Anfrage; nur mit eigener, bei Resend verifizierter Absenderadresse (MAIL_FROM).
async function sendConfirmation(env: Env, to: string, name: string, anlass: string) {
  if (!env.MAIL_FROM) return
  const text = [
    `Hallo ${name},`,
    '',
    `vielen Dank für deine Anfrage (${anlass}). Sie ist bei mir angekommen und ich melde mich so schnell wie möglich bei dir, in der Regel innerhalb von 1 bis 2 Tagen.`,
    '',
    'Preise gestalte ich individuell nach Zeit und Aufwand, du bekommst von mir ein passendes Angebot. Die Bilder liefere ich nach Absprache, zum Beispiel schon während des Events, am selben Abend oder zum gewünschten Zeitpunkt.',
    '',
    'Viele Grüße',
    'Josua Küßner',
    'JK-Mediaworks · Wiesbaden',
    'https://jkmediaworks.com',
  ].join('\n')
  await fetch('https://api.resend.com/emails', {
    signal: AbortSignal.timeout(10000),
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], reply_to: env.MAIL_TO, subject: 'Deine Anfrage bei JK-Mediaworks', text }),
  }).catch(() => undefined)
}

async function handleAnfrage(request: Request, env: Env) {
  if (!env.RESEND_API_KEY || !env.MAIL_TO) return json({ ok: false, error: 'not-configured' }, 500)
  let d: Record<string, unknown>
  try {
    d = await request.json()
  } catch {
    return json({ ok: false, error: 'bad-json' }, 400)
  }
  if (d.website) return json({ ok: true }) // Honeypot: Bots still ignorieren
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, String(d.turnstile ?? ''), request.headers.get('CF-Connecting-IP'))
    if (!ok) return json({ ok: false, error: 'captcha' }, 400)
  }
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
    `Titel: ${clean(d.titel, 160)}`,
    `Datum: ${clean(d.datum)}${d.datumBis ? ` bis ${clean(d.datumBis)}` : ''}`,
    `Ort: ${clean(d.ort)}`,
    '',
    String(d.nachricht ?? '').slice(0, 4000),
    '',
    'Die vollständige Anfrage liegt als PDF bei.',
  ]
  const res = await fetch('https://api.resend.com/emails', {
    signal: AbortSignal.timeout(15000),
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
  if (res.ok) {
    await sendConfirmation(env, email, name, clean(d.anlass, 60))
    return json({ ok: true })
  }
  const detail = await res.text().then((t) => clean(t, 300)).catch(() => '')
  return json({ ok: false, error: 'mail-failed', detail }, 502)
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
