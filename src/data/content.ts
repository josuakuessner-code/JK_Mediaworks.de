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
  { name: 'Corporate', text: 'Firmenevents, Teamfotos und Businessportraits, die zu deiner Marke passen: professionell, unkompliziert und schnell einsatzbereit für Website, Presse und Social Media.' },
  { name: 'Portraits', text: 'Porträts und Businessfotos mit natürlichem Licht und entspannter Atmosphäre, für Website, Bewerbung oder Social Media.' },
  { name: 'Bildbearbeitung', text: 'Sorgfältige Auswahl, Retusche und ein einheitlicher Look, geliefert in hoher Auflösung und in den Formaten, die du brauchst.' },
]

// Reihenfolge bewusst gemischt (Sport, Hochzeit, Motorsport …), damit auf /projekte nie zwei gleiche Themen direkt aufeinander folgen.
// Struktur wie im Foto-Ordner: Kategorie > Job. Neue Jobs hier eintragen und Bilder in assets.ts zuordnen.
export const CATEGORIES = ['Sport', 'Motorsport', 'Hochzeiten', 'Media Days'] as const
export type Category = (typeof CATEGORIES)[number]

export const PROJECTS: { id: string; group: Category; category: string; name: string }[] = [
  { id: 'barock-volleys', group: 'Sport', category: 'Volleyball · Bundesliga', name: 'Barock Volleys MTV Ludwigsburg' },
  { id: 'hochzeit-toscana', group: 'Hochzeiten', category: 'Hochzeit · Toscana', name: 'Vicky & Tizian in der Toscana' },
  { id: 'volley-juniors-frankfurt', group: 'Sport', category: 'Volleyball · Nachwuchs', name: 'Volley Juniors Frankfurt' },
  { id: 'fk-performance-24h', group: 'Motorsport', category: 'Motorsport · Langstrecke', name: 'FK Performance · 24h Rennen Nürburgring' },
  { id: 'vc-wiesbaden', group: 'Sport', category: 'Volleyball', name: 'VC Wiesbaden' },
  { id: 'media-day-eintracht', group: 'Media Days', category: 'Media Day · Volleyball', name: 'Eintracht Wiesbaden' },
  { id: 'u18-em-quali', group: 'Sport', category: 'Volleyball · U18-Nationalmannschaft', name: 'Jugendnationalmannschaft · U18 EM Qualifikation' },
  { id: 'hochzeit-schweden', group: 'Hochzeiten', category: 'Hochzeit · Schweden', name: 'Robin & Judith in Schweden' },
  { id: 'u20-wevza', group: 'Sport', category: 'Volleyball · U20-Nationalmannschaft', name: 'Jugendnationalmannschaft · U20 WEVZA Turnier' },
  { id: 'nls-nuerburgring', group: 'Motorsport', category: 'Motorsport · Langstrecke', name: 'FK Performance · NLS Nürburgring' },
  { id: 'u18-4-nations-cup', group: 'Sport', category: 'Volleyball · U18-Nationalmannschaft', name: 'Jugendnationalmannschaft · 4 Nations Cup Brandenburg' },
  { id: 'hochzeit-alina-ben', group: 'Hochzeiten', category: 'Hochzeit · Rhein-Main', name: 'Alina & Ben im Rhein-Main-Gebiet' },
  { id: 'dvv-pokalfinale', group: 'Sport', category: 'Volleyball · Pokalfinale', name: 'DVV ZOI Pokalfinale 2026' },
  { id: 'media-day-jugend', group: 'Media Days', category: 'Media Day · Volleyball', name: 'Jugendnationalmannschaft' },
]

// Eigene Leistungsseiten (Pfad /<slug>): Texte für Suchmaschinen und Kunden. Projekte werden über ihre IDs aus PROJECTS verlinkt.
export const LEISTUNGSSEITEN = {
  sportfotografie: {
    slug: 'sportfotografie',
    label: 'Sportfotografie',
    title: 'Sportfotografie Wiesbaden | JK-Mediaworks',
    description: 'Sportfotograf in Wiesbaden: Spielfotos, Highlights und Media Days für Vereine, Verbände und Teams. Schnelle Lieferung nach Absprache. Jetzt unverbindlich anfragen.',
    h1: 'Sportfotografie in Wiesbaden',
    intro: 'Tempo, Emotion und die entscheidenden Sekunden: Ich halte Spiele, Turniere und Media Days so fest, dass Verein, Presse und Social Media sofort etwas damit anfangen können.',
    sections: [
      {
        heading: 'Für wen ich fotografiere',
        text: 'Für Vereine, Verbände und Teams aus Wiesbaden, Rhein-Main und darüber hinaus: vom Nachwuchsturnier über Bundesliga-Spiele bis zu Länderspielen. Mein Schwerpunkt liegt im Volleyball, ich fotografiere außerdem Motorsport und freue mich auf weitere Sportarten wie Handball, Fußball oder Tischtennis.',
      },
      {
        heading: 'Was du bekommst',
        text: 'Eine sorgfältige Auswahl der besten Momente, einheitlich bearbeitet in einem klaren Look und in hoher Auflösung. Auf Wunsch auch fertig zugeschnitten für Instagram, Website oder Pressemitteilung.',
      },
      {
        heading: 'Lieferung',
        text: 'Die Bildlieferung richtet sich nach deinem Bedarf: schon während des Events, am selben Abend oder zu dem Zeitpunkt, den ihr braucht. Sprich mich einfach vorher an.',
      },
    ],
    projects: ['barock-volleys', 'dvv-pokalfinale', 'u18-em-quali', 'vc-wiesbaden', 'fk-performance-24h', 'media-day-eintracht'],
    cta: 'Du planst ein Spiel, Turnier oder einen Media Day? Erzähl mir davon.',
  },
  hochzeitsfotografie: {
    slug: 'hochzeitsfotografie',
    label: 'Hochzeitsfotografie',
    title: 'Hochzeitsfotograf Wiesbaden | JK-Mediaworks',
    description: 'Hochzeitsfotograf aus Wiesbaden: natürliche, emotionale Hochzeitsreportagen in Rhein-Main, Deutschland und im Ausland. Jetzt unverbindlich anfragen.',
    h1: 'Hochzeitsfotografie in Wiesbaden und Rhein-Main',
    intro: 'Natürliche, emotionale Bilder, die deinen Tag so erzählen, wie er sich angefühlt hat: vom ersten Blick bis zum letzten Tanz.',
    sections: [
      {
        heading: 'Reportage statt Posing',
        text: 'Ich begleite euren Tag aufmerksam im Hintergrund und halte echte Momente fest: Blicke, Lachen, Tränen und alles dazwischen. Gestellte Bilder gibt es dort, wo ihr sie wollt, in entspannter Atmosphäre.',
      },
      {
        heading: 'Look und Bearbeitung',
        text: 'Meine Bilder bekommen einen besonderen Look mit dem Charme alter Filme. Jedes Foto wird sorgfältig ausgewählt und einheitlich bearbeitet, damit das Album als Ganzes wirkt.',
      },
      {
        heading: 'Wo ich fotografiere',
        text: 'In Wiesbaden, Mainz und im Rhein-Main-Gebiet, aber auch weiter weg: Meine Hochzeitsreportagen entstanden unter anderem in der Toscana und in Schweden.',
      },
      {
        heading: 'Preise und Ablauf',
        text: 'Jede Hochzeit ist anders. Deshalb gibt es ein individuelles Angebot nach Zeit und Aufwand. Schreib mir Datum, Ort und deine Wünsche, dann melde ich mich bei dir.',
      },
    ],
    projects: ['hochzeit-toscana', 'hochzeit-schweden', 'hochzeit-alina-ben'],
    cta: 'Ihr plant eure Hochzeit? Erzählt mir von eurem Tag.',
  },
} as const
export type LeistungSlug = keyof typeof LEISTUNGSSEITEN
