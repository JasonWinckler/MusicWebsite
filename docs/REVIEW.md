# The Healing Shadow — Texte und Einstieg zur Prüfung

Stand: 29. Oktober 2026. Branch: `fix/brand-copy-and-hero-layout`.
Auf Basis des veröffentlichten Stands nach PR #68 vorbereitet.

## Änderungen

Der Einstieg trägt den Brand-Slogan **The Healing Shadow** in beiden Sprachen.
Die Überschrift lautet „Eine Stimme. Die berührt.“ bzw. „A voice. That stays.“.
Zwei explizite, kurze Textzeilen ersetzen die langen, automatisch getrennten
Sätze. Ihre Schriftgröße und Abstände passen sich der Bildschirmbreite an.
Bei vergrößerter Nutzerschrift dürfen die Zeilen weiter umbrechen.

Der zweite Live-Button auf dem Porträt ist entfernt. Neben „Auftritt anfragen“
bleibt genau ein „Live erleben“-Button; die Abschnittsnavigation führt ebenfalls
zum Mitschnitt. Das Porträt erhält passend zum tatsächlichen Layout kleinere
Bildquellen auf Handys.

Leistungsbeschreibungen, Über-mich-Text, Ablauf, FAQ und Kontakt sind in Deutsch
und Englisch kürzer und direkter formuliert. Der Slogan erscheint auch in den
Seiten- und Vorschau-Metadaten. Die Berufsbezeichnung bleibt exakt
**Sänger · Sprecher · Moderator** / **Singer · Speaker · Moderator**.
Galas, Firmenjubiläen, Restaurant-Veranstaltungen, Hochzeiten und weitere private
Anlässe bleiben ausdrücklich im Angebot.

Die Affiliate-Seiten und ihre vorhandenen Bilder, Buttons und Ziele bleiben
unverändert. Es gibt keine Änderungen an Formularlogik, Animationslogik,
Abhängigkeiten, Rechtsseiten, DNS oder E-Mail-Konfiguration.

## Aktuelle Ansichten

Die Homepage-Bilder wurden für diese Änderung neu aufgenommen. Desktop:
1440×1100 CSS-Pixel; Handy: 412×839 CSS-Pixel. Die Kontakt-Detailbilder blenden
nur für den Bildausschnitt die feststehende Navigation und den Sprunglink aus.
Die vollständigen Seiten und Einstiegsbilder zeigen die unveränderte Darstellung.

| Ansicht | Deutsch | Englisch |
| --- | --- | --- |
| Desktop vollständig | [Bild](review/de-desktop-full.png) | [Bild](review/en-desktop-full.png) |
| Handy vollständig | [Bild](review/de-phone-full.png) | [Bild](review/en-phone-full.png) |
| Einstieg | [Desktop](review/de-desktop-opening.png) · [Handy](review/de-phone-opening.png) | — |
| Kontakt | [Desktop](review/de-desktop-contact.png) · [Handy](review/de-phone-contact.png) | — |

Die bestehenden Affiliate-Bilder unter `review/*-affiliates-*` dokumentieren
den unveränderten LinkHub aus PR #68.

## Prüfung

- Produktionsbuild, JavaScript-Syntax und `git diff --check` erfolgreich.
- **27 vorhandene Browsertests bestanden, 1 planmäßig übersprungen**: Lesbarkeit,
  Metadaten, kein horizontaler Überlauf, DE/EN ohne JavaScript, Mobilmenü und Fokus,
  unveränderte Berufsbezeichnung, reduzierte Bewegung, Affiliate-Links und Bilder
  sowie aktuelle Desktop-/Handy-Screenshots. Der übersprungene Fall ist das
  Mobilmenü im Desktoplayout.
- Zusätzliche DOM-Messung beider Homepages bei **320, 360, 390, 600, 601, 768,
  1024 und 1440 Pixeln**: genau ein Live-Button im Hero, beide Überschrift-Phrasen
  jeweils in einer Zeile, kein horizontaler Überlauf und der Anfragebutton im
  ersten Bildschirm bei 900 Pixeln Höhe. Messwerte: [hero-layout.json](review/hero-layout.json).
- Prüfung mit 200 % Root-Schriftgröße in beiden Sprachen bei 320, 390, 768 und
  1440 Pixeln: natürliche Umbrüche halten den Hero-Text in seinen Spalten.

Die Auswahl prüft die geänderten Texte und die Darstellung. Formular- und
Videologik wurden nicht verändert; deren umfassendere Prüfungen stammen aus
PR #68. `review/accessibility.json` und `review/performance.json` sind frühere
Messungen und keine erneuten Audits dieser Textfassung. Externe FormSubmit-
Anfragen wurden blockiert; es wurden keine echten Anfragen oder Spenden gesendet.

Die Änderung ist zur Prüfung vorbereitet. Keine Zusammenführung nach `main`
und keine manuell ausgelöste Produktionsveröffentlichung.
