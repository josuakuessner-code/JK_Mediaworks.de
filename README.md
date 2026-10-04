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

Der Button „Kontakt aufnehmen" öffnet eine Anfrage-Seite. Beim Absenden wird im Browser ein PDF erzeugt und an `/api/anfrage` geschickt. Das übernimmt ein Cloudflare Worker (`worker/index.ts`, Konfiguration in `wrangler.jsonc`), der die Website ausliefert und das PDF per [Resend](https://resend.com) als Mail-Anhang an dich sendet. Klappt der Versand nicht, bekommt die Person das PDF zum Download und die Anweisung, es per Mail zu schicken.

Einrichtung bei Cloudflare (Workers & Pages, „Create", „Connect to Git"):
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Path: `/`
- Danach unter dem Projekt: Settings, „Variables and secrets": `RESEND_API_KEY` (Secret) und `MAIL_TO` (deine Adresse). Optional `MAIL_FROM`, sobald bei Resend eine eigene Domain verifiziert ist. Ohne Domain verschickt Resend nur an die Adresse des eigenen Resend-Kontos, also mit derselben Adresse registrieren.
- Neu deployen, dann eine Test-Anfrage senden.

Im Datenschutz-Abschnitt „Anfrageformular" (`LegalPage.tsx`) die violetten Platzhalter ausfüllen und mit Resend und Cloudflare je einen Auftragsverarbeitungsvertrag abschließen.
