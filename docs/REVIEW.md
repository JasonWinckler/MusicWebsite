# Ganzes Logo im Einstieg und JS-Favicon

Stand: 29. Oktober 2026. Branch: `feat/hero-logo-and-favicon`.
Basis ist der veröffentlichte Stand nach PR #70.

## Umsetzung

Das vollständige Original-Logo steht jetzt direkt über der Überschrift auf der
deutschen und englischen Homepage. Auf dem Desktop sitzt es in der linken
Spalte neben dem Porträt, auf dem Handy über beiden Spalten. Die Wortmarke bleibt
im Verhältnis 2:1 vollständig sichtbar. Angepasste Abstände, Schriftgrößen und
Porträthöhen lassen weiterhin Platz für Berufsbezeichnung, Angebot und Aktionen.

Der kleine separate Slogan-Text entfällt, da „The Healing Shadow“ bereits im
Logo steht. Der große Logoblock in der Homepage-Fußzeile ist durch den kompakten
Künstlernamen ersetzt. Die Überschrift bleibt als Text erhalten, ebenso die
exakte Berufsbezeichnung und ein einzelner Live-Button im Einstieg. Auf der
Affiliate-Seite stand das ganze Logo bereits oben; deren Darstellung bleibt.

Browser-Tab und Handy-Lesezeichen verwenden denselben JS-Ausschnitt wie die
Navigation. Der Ausschnitt wurde rechts geringfügig enger gefasst, damit kein
Fragment der benachbarten Wortmarke ins Icon gerät. Das Monogramm selbst bleibt
vollständig und unverändert. Die Dateien sind:

- `public/favicon.ico`: Größen 16, 32 und 48 Pixel;
- `public/favicon-32.png` und `public/favicon-48.png`;
- `public/apple-touch-icon.png`: 180 Pixel.

Alle sieben HTML-Seiten verlinken diese Icons. `scripts/render-icons.cjs`
erzeugt sie reproduzierbar aus dem bestehenden Navigationsausschnitt mit dem
bereits installierten Chromium. Der reguläre Build benötigt dafür keinen
Browser und keine neue Abhängigkeit. Die Originaldatei `uploads/logo.png`
ist unverändert.

## Ansichten

Neue Homepage-Aufnahmen: Desktop 1440×1100, Handy 412×839 CSS-Pixel.
Kontakt-Detailbilder lassen ausschließlich für den Bildausschnitt Navigation
und Sprunglink weg. Die bestehenden Affiliate-Bilder dokumentieren das
unveränderte Layout aus PR #70.

| Ansicht | Deutsch | Englisch |
| --- | --- | --- |
| Homepage, Desktop | [Bild](review/de-desktop-full.png) | [Bild](review/en-desktop-full.png) |
| Homepage, Handy | [Bild](review/de-phone-full.png) | [Bild](review/en-phone-full.png) |
| Einstieg | [Desktop](review/de-desktop-opening.png) · [Handy](review/de-phone-opening.png) | — |
| Kontakt | [Desktop](review/de-desktop-contact.png) · [Handy](review/de-phone-contact.png) | — |

## Prüfung

- Produktionsbuild, Syntax und `git diff --check` erfolgreich.
- 27 vorhandene Desktop-/Handy-Browserfälle bestanden; ein planmäßiger Skip
  für das Mobilmenü im Desktoplayout. Geprüft wurden Lesbarkeit, Metadaten,
  kein horizontaler Überlauf, Nutzung ohne JavaScript, Navigation und Fokus,
  Berufsbezeichnung, reduzierte Bewegung sowie Screenshots.
- 16 zusätzliche Layoutfälle: beide Homepages bei 320, 360, 390, 600, 601, 768,
  1024 und 1440 Pixeln. Das vollständige Logo steht über der Überschrift, bleibt
  im ersten Bildschirm und ist unbeschnitten. Der Anfragebutton bleibt bei
  844 Pixeln Höhe sichtbar; beide Überschrift-Phrasen bleiben jeweils einzeilig.
- Auf sieben Routen einschließlich echter 404-Seite sind alle vier Icon-Links
  vorhanden. Dateien antworten mit HTTP 200 und einem passenden Bild-MIME-Typ.
  PNG-Abmessungen und die drei Größen im ICO-Verzeichnis sind geprüft.
- Favicon und Monogramm wurden visuell auf vollständige Buchstaben und einen
  sauberen Ausschnitt geprüft. Das Original-Logo behält SHA-256
  `75c04da923d22a73f6199538834b61cef7c9f311e2ff5d9c2708bcae984b823c`.

Aktuelle Messdaten: [hero-favicon.json](review/hero-favicon.json).
Die älteren Dateien `accessibility.json`, `hero-layout.json`, `logo-layout.json`
und `performance.json` dokumentieren frühere Stände, keine erneuten Audits
oder Layoutmessungen dieser Fassung. Externe FormSubmit-Anfragen waren in den
Browsertests blockiert.

Vorbereitet als Entwurf. Keine Zusammenführung nach `main` und keine manuell
ausgelöste Produktionsveröffentlichung.
