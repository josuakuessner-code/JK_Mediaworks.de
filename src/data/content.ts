/** Texte der Seite. Hier anpassen. Kundennamen nur mit Freigabe des Kunden verwenden. */
export const SITE = {
  brand: 'JK-Mediaworks',
  name: 'Josua',
  email: 'josua.kuessner@gmail.com',
  heroLine: 'Ein Fotograf, der starke und unvergessliche Momente festhält',
  aboutText:
    'Ich bin Josua, in Wiesbaden aufgewachsen und hier zu Hause. Nach dem Abitur lerne ich bei TV Skyline Mediengestalter Bild und Ton. Mit meinen Fotos und ihrer Bearbeitung will ich Emotionen wecken, am liebsten in besonderen Looks und mit dem Charme alter Filme. Früher habe ich selbst leistungsorientiert Volleyball gespielt, heute halte ich die Spiele mit der Kamera fest.',
}

export const SERVICES = [
  { name: 'Sportfotografie', text: 'Spielfotos und Highlights, die Tempo und Emotion einfangen: schnell geliefert und passend für Verein, Social Media und Presse.' },
  { name: 'Konzerte & Events', text: 'Live-Fotografie, die die Energie im Raum einfängt: von der Bühne bis zum Publikum, auch bei schwierigem Licht.' },
  { name: 'Hochzeiten', text: 'Natürliche, emotionale Hochzeitsreportagen, die deinen Tag so erzählen, wie er sich angefühlt hat, vom ersten Blick bis zum letzten Tanz.' },
  { name: 'Portraits', text: 'Porträts und Businessfotos mit natürlichem Licht und entspannter Atmosphäre, für Website, Bewerbung oder Social Media.' },
  { name: 'Bildbearbeitung', text: 'Sorgfältige Auswahl, Retusche und ein einheitlicher Look, geliefert in hoher Auflösung und in den Formaten, die du brauchst.' },
]

// Struktur wie im Foto-Ordner: Kategorie > Job. Neue Jobs hier eintragen und Bilder in assets.ts zuordnen.
export const CATEGORIES = ['Sport', 'Motorsport', 'Hochzeiten', 'Media Days'] as const
export type Category = (typeof CATEGORIES)[number]

export const PROJECTS: { id: string; group: Category; category: string; name: string }[] = [
  { id: 'barock-volleys', group: 'Sport', category: 'Volleyball · Bundesliga', name: 'Barock Volleys MTV Ludwigsburg' },
  { id: 'vc-wiesbaden', group: 'Sport', category: 'Volleyball', name: 'VC Wiesbaden' },
  { id: 'u18-em-quali', group: 'Sport', category: 'Volleyball · U18-Nationalmannschaft', name: 'Jugendnationalmannschaft · U18 EM Qualifikation' },
  { id: 'u20-wevza', group: 'Sport', category: 'Volleyball · U20-Nationalmannschaft', name: 'Jugendnationalmannschaft · U20 WEVZA Turnier' },
  { id: 'u18-4-nations-cup', group: 'Sport', category: 'Volleyball · U18-Nationalmannschaft', name: 'Jugendnationalmannschaft · 4 Nations Cup Brandenburg' },
  { id: 'dvv-pokalfinale', group: 'Sport', category: 'Volleyball · Pokalfinale', name: 'DVV ZOI Pokalfinale 2026' },
  { id: 'fk-performance-24h', group: 'Motorsport', category: 'Motorsport · Langstrecke', name: 'FK Performance · 24h Rennen Nürburgring' },
  { id: 'nls-nuerburgring', group: 'Motorsport', category: 'Motorsport · Langstrecke', name: 'FK Performance · NLS Nürburgring' },
  { id: 'hochzeit-schweden', group: 'Hochzeiten', category: 'Hochzeit · Schweden', name: 'Robin & Judith in Schweden' },
  { id: 'media-day-eintracht', group: 'Media Days', category: 'Media Day · Volleyball', name: 'Eintracht Wiesbaden' },
  { id: 'media-day-jugend', group: 'Media Days', category: 'Media Day · Volleyball', name: 'Jugendnationalmannschaft' },
]
