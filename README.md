# JK-Mediaworks – Landingpage

React + TypeScript + Tailwind + Framer Motion + Lucide, gebaut mit Vite.

## Starten
    npm install
    npm run dev      # lokale Entwicklung
    npm run build    # Produktionsbuild in dist/ (statisch, überall hostbar)

## Was du anpassen musst
- `src/data/assets.ts`: ALLE externen Bild-/GIF-URLs (Platzhalter von motionsites.ai, figma.site, higgs.ai). Durch eigene Dateien in `public/media/` ersetzen.
- `src/data/content.ts`: Name, Texte, Services, Projekttitel.
- `src/sections/LegalPage.tsx`: Impressum und Datenschutz. Violette [Platzhalter] ausfüllen.

## Bilder

Alle Fotos liegen lokal in `src/assets/` (keine Fremd-Hotlinks). Die Hochzeits-Karte (Projekt 03) zeigt noch den Platzhalter „Foto folgt“: `p3a/p3b/p3c.webp` ersetzen (Hochzeitspaare müssen der Veröffentlichung vorher zugestimmt haben). Vor dem Livegang die Platzhalter in `LegalPage.tsx` ausfüllen.

## Anfrageformular (Seite `#/kontakt`)

Der Button „Kontakt aufnehmen" öffnet eine Anfrage-Seite. Beim Absenden wird im Browser ein PDF erzeugt und an `/api/anfrage` geschickt (`functions/api/anfrage.ts`, Cloudflare Pages Function), die es per [Resend](https://resend.com) als Mail-Anhang an dich sendet. Klappt der Versand nicht, bekommt die Person das PDF zum Download und die Anleitung, es per Mail zu schicken.

Einrichtung bei Cloudflare Pages (einmalig):
1. Bei Resend ein kostenloses Konto anlegen und einen API-Key erstellen.
2. In Cloudflare unter Pages → dein Projekt → Settings → Variables and Secrets: `RESEND_API_KEY` (Secret) und `MAIL_TO` (deine Adresse) anlegen. Optional `MAIL_FROM`, sobald du bei Resend eine eigene Domain verifiziert hast. Ohne Domain verschickt Resend nur an die Adresse deines eigenen Resend-Kontos, also am besten mit derselben Adresse registrieren.
3. Neu deployen. Danach eine Test-Anfrage senden.

Im Datenschutz-Abschnitt „Anfrageformular" (`LegalPage.tsx`) die violetten Platzhalter (E-Mail-Dienst, Hoster) ausfüllen und mit Resend und Cloudflare je einen Auftragsverarbeitungsvertrag abschließen.
