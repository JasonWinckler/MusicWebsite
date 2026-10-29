# Neues Logo und Bordeaux-Gold-Gestaltung

Stand: 29. Oktober 2026. Branch: `feat/logo-and-burgundy-brand`.
Basis ist der aktuelle Hauptbranch einschließlich des Logo-Uploads `9a74252`.

## Umsetzung

Das Original liegt unter [`uploads/logo.png`](../uploads/logo.png) und bleibt
unverändert. Die Navigation zeigt einen CSS-Ausschnitt mit dem echten
JS-Monogramm neben dem lesbaren Künstlernamen. Fußzeilen und Affiliate-Profil
zeigen die vollständige Wortmarke im Originalverhältnis 2:1. Das Porträt steht
unterhalb des Affiliate-Logos, damit es keine Schrift überdeckt.

Hintergründe, Karten, Navigation, Formular, Fußzeilen und Hover-Zustände greifen
die Farben des Logos auf: tiefes Bordeaux (`#240007`), warmes Gold (`#efd18a`)
und Elfenbein (`#fff5df`). Die Browser-Themenfarbe ist ebenfalls Bordeaux.
Die Bilder und Plattformfarben der Partner bleiben erhalten.

Die bestehende responsive Anordnung, Animationen, Texte, Berufsbezeichnung,
Anfragefunktionen und Affiliate-Ziele bleiben bestehen. Der Einstieg enthält
weiterhin genau einen Live-Button. Die Rechtstexte wurden nicht geändert;
auf diesen Seiten wurden nur Logo, Stylesheet und Themenfarbe angepasst.

Der 404-Rückweg hatte durch eine allgemeine Textlink-Regel Gold auf Gold.
Buttons sind nun von dieser Regel ausgenommen, sodass ihre Beschriftung ihren
vorgesehenen dunklen Kontrast behält.

## Ansichten

Alle unten verlinkten Homepage- und Affiliate-Bilder wurden für diese Fassung
neu aufgenommen: Desktop 1440×1100, Handy 412×839 CSS-Pixel. Für Ganzseitenbilder
werden auch verzögert geladene Logos vorab dekodiert. Kontakt-Detailbilder
lassen nur im Bildausschnitt die feststehende Navigation und den Sprunglink weg.

| Ansicht | Deutsch | Englisch |
| --- | --- | --- |
| Hauptseite, Desktop | [Bild](review/de-desktop-full.png) | [Bild](review/en-desktop-full.png) |
| Hauptseite, Handy | [Bild](review/de-phone-full.png) | [Bild](review/en-phone-full.png) |
| Einstieg | [Desktop](review/de-desktop-opening.png) · [Handy](review/de-phone-opening.png) | — |
| Kontakt | [Desktop](review/de-desktop-contact.png) · [Handy](review/de-phone-contact.png) | — |
| Affiliates, Desktop | [Bild](review/de-affiliates-desktop-full.png) | [Bild](review/en-affiliates-desktop-full.png) |
| Affiliates, Handy | [Bild](review/de-affiliates-phone-full.png) | [Bild](review/en-affiliates-phone-full.png) |

## Prüfung

- Produktionsbuild, Syntax und `git diff --check` erfolgreich.
- 29 vorhandene Desktop-/Handy-Browserfälle bestanden; ein planmäßiger Skip
  für das Mobilmenü im Desktoplayout. Nach den letzten Korrekturen bestanden
  acht gezielte Fälle für Affiliate-Darstellung, fehlende Seiten, Metadaten und
  Screenshots; die beiden Screenshot-Serien wurden danach für vollständig
  geladene Footer-Logos erneut aufgenommen.
- 14 axe-core-Prüfungen: sieben Routen bei 390 und 1440 Pixeln, einschließlich
  echter 404-Seite. Keine automatisch erkannten WCAG-2-A/AA-/2.1-AA-Verstöße,
  Browserfehler oder horizontalen Überläufe. Nachweise:
  [accessibility.json](review/accessibility.json).
- Weitere Layoutmessungen bei 320 und 768 Pixeln: Logos geladen, vollständige
  Wortmarken im Verhältnis 2:1, weiterhin ein Live-Button. Sichtprüfung zusätzlich
  bei 390 und 1440 Pixeln. [logo-layout.json](review/logo-layout.json).
- Beide Hero-Überschriften bleiben bei acht Bildschirmbreiten zwischen 320 und
  1440 Pixeln in ihren vorgesehenen Zeilen. [hero-layout.json](review/hero-layout.json).
- Der erste Affiliate-Partner ist bei 320×844 und 390×844 im ersten Bildschirm
  vollständig sichtbar. Der korrigierte 404-Button hat 12,29:1 Textkontrast.
- Der ausgelieferte Logo-Asset und `uploads/logo.png` sind bytegleich:
  SHA-256 `75c04da923d22a73f6199538834b61cef7c9f311e2ff5d9c2708bcae984b823c`.

Automatische Kontrastprüfungen können geschichtete Verläufe nicht vollständig
bewerten; diese Ansichten wurden zusätzlich visuell geprüft. Die bisherigen
manuellen Prüfpunkte zu Videountertiteln bleiben bestehen. Der ursprüngliche
PNG-Asset hat rund 1,57 MB und wird als gemeinsamer, gecachter Vite-Asset genutzt.
Es gibt keine neue Geschwindigkeitsmessung; `review/performance.json` bleibt
ein älterer Messstand. FormSubmit-Anfragen wurden in Browsertests blockiert.

Vorbereitet als Review-Entwurf. Keine Zusammenführung nach `main` und keine
manuell ausgelöste Produktionsveröffentlichung.
