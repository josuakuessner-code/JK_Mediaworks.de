import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { SITE } from '../data/content'
import { openMail } from '../lib/links'

/** E-Mail-Adresse: Klick öffnet das Mailprogramm, Button daneben kopiert sie. */
export default function CopyEmail({ className = '' }: { className?: string }) {
  const [done, setDone] = useState(false)
  const t = useRef<number>()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
    } catch {
      const el = document.createElement('textarea')
      el.value = SITE.email
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      try {
        document.execCommand('copy')
      } catch {
        /* ignorieren */
      }
      el.remove()
    }
    setDone(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setDone(false), 1800)
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <a href={`mailto:${SITE.email}`} onClick={openMail} className="text-[#D7E2EA] underline decoration-[#D7E2EA]/30 underline-offset-4 transition-opacity duration-200 hover:opacity-70">
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={done ? 'E-Mail-Adresse kopiert' : 'E-Mail-Adresse kopieren'}
        className="press inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10"
      >
        {done ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      </button>
      <span role="status" className="sr-only">{done ? 'Kopiert' : ''}</span>
    </span>
  )
}
