# Erzeugt kleine Vorschaubilder (kurze Seite 600 px) für alle Karten-Fotos:
# src/assets/cards/<projekt>/NN.webp -> src/assets/thumbs/<projekt>/NN.webp
# Raster, Laufband und Karten laden die kleinen Bilder, die Vollbild-Ansicht das Original.
# Nach dem Hinzufügen neuer Fotos einmal ausführen: python3 scripts/make-thumbs.py (braucht Pillow)
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent / 'src' / 'assets'
made = 0
for src in sorted((root / 'cards').glob('*/*.webp')):
    dst = root / 'thumbs' / src.parent.name / src.name
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        continue
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    scale = 600 / min(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=76, method=6)
    made += 1
# Vorschaubilder ohne Original entfernen
for t in (root / 'thumbs').glob('*/*.webp'):
    if not (root / 'cards' / t.parent.name / t.name).exists():
        t.unlink()
print(f'{made} Vorschaubilder erzeugt')
