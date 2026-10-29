# Gestaltung und Affiliate-LinkHub zur Prüfung

Stand: 29. Oktober 2026. Branch: `feat/fluid-design-and-affiliate-linkhub`.
Auf Basis des aktuellen Hauptbranches nach PR #67 vorbereitet. Keine
Zusammenführung nach `main`, keine manuell ausgelöste Produktionsveröffentlichung
und keine Änderung an DNS, E-Mail oder der Umgebungskonfiguration.

## Gestaltung

Die Hauptseite hat einen durchgehenden burgunderfarbenen Hintergrund mit weichen
Lichtverläufen. Die harten Trennlinien zwischen den Abschnitten sind entfernt.
Eine schwebende Navigation, warme Goldakzente, weichere Bildrahmen und kleinere
zusammengehörige Inhaltsflächen verbinden die Abschnitte optisch.

Desktop zeigt Angebot und Porträt in zwei großzügigen Spalten. Auf dem Handy
steht das kompakte Porträt neben der Überschrift; die Anfrage-Buttons folgen
über die volle Breite. Leistungen und Ablauf wechseln in eine vertikale
Darstellung. Beide Layouts verwenden dieselben Inhalte und Sprach-URLs.

Dezente Einblendungen laufen einmalig beim Eintritt in den sichtbaren Bereich.
Buttons, Navigation und Links reagieren weich auf Interaktion. Ohne JavaScript
bleiben sämtliche Inhalte sichtbar. Die Einstellung „reduzierte Bewegung“
unterbindet Animationen und beendet bereits laufende Animationen. Fokussierte
Bedienelemente werden ebenfalls nicht weiterbewegt.

Die Ortswiederholungen in Einstieg, Porträtbeschriftung, Kontaktbereich,
Fußzeile und Metadaten sind entfernt. Der tatsächliche Ort des KÖPI-Mitschnitts
steht einmal in dessen Beschreibung; bestehende Rechtsangaben bleiben erhalten.
Die Berufsbezeichnung lautet weiterhin exakt **Sänger · Sprecher · Moderator**
bzw. **Singer · Speaker · Moderator**. Die B2B- und privaten Veranstaltungsangebote
einschließlich Galas, Firmenjubiläen, Restaurant-Events und Hochzeiten bleiben
klar beschrieben.

## Affiliate-Seite für Instagram-Besucher

Die Seite ist wieder ein kompakter LinkHub mit dem vorhandenen Banner,
Profilporträt und großen nativen Link-Buttons. Die ursprünglichen Corissia- und
Waterdrop-Bilder werden vollständig in jeweils passenden Rahmen dargestellt.
Instagram, Website und PayPal haben erkennbare Symbole und große Touchflächen.
Die bestehende Linkadresse `/affiliates/` bleibt nutzbar, ebenso die englische
Fassung `/en/affiliates/`.

Partnerziele und PayPal-Empfänger wurden nicht geändert. Affiliate-Links bleiben
als Werbung gekennzeichnet und sind keine Kundenreferenzen. Alle Links
funktionieren ohne JavaScript; es wurden keine Käufe, Spenden oder externen
Formularübermittlungen ausgelöst.

## Ansichten

Aufgenommen in Chromium bei 1440×1100 CSS-Pixeln auf Desktop und 412×839 in der
Pixel-7-Emulation. Dateien werden in CSS-Pixeln gespeichert, damit sie auf dem
Handy handhabbar bleiben. Kontakt-Detailaufnahmen lassen ausschließlich die
feststehende Navigation und den Sprunglink weg, damit diese den Ausschnitt nicht
überlagern; vollständige Seiten und Einstiege bleiben unverändert.

| Ansicht | Deutsch | Englisch |
| --- | --- | --- |
| Hauptseite, Desktop vollständig | [Bild](review/de-desktop-full.png) | [Bild](review/en-desktop-full.png) |
| Hauptseite, Handy vollständig | [Bild](review/de-phone-full.png) | [Bild](review/en-phone-full.png) |
| Hauptseite, Desktop-Einstieg | [Bild](review/de-desktop-opening.png) | — |
| Hauptseite, Handy-Einstieg | [Bild](review/de-phone-opening.png) | — |
| Kontakt, Desktop / Handy | [Desktop](review/de-desktop-contact.png) · [Handy](review/de-phone-contact.png) | — |
| LinkHub, Desktop vollständig | [Bild](review/de-affiliates-desktop-full.png) | [Bild](review/en-affiliates-desktop-full.png) |
| LinkHub, Handy vollständig | [Bild](review/de-affiliates-phone-full.png) | [Bild](review/en-affiliates-phone-full.png) |
| LinkHub, Desktop-Einstieg | [Bild](review/de-affiliates-desktop-opening.png) | [Bild](review/en-affiliates-desktop-opening.png) |
| LinkHub, Handy-Einstieg | [Bild](review/de-affiliates-phone-opening.png) | [Bild](review/en-affiliates-phone-opening.png) |

## Prüfung und Grenzen

Der Produktionsbuild ist erfolgreich. Alle **74 funktionalen Browserfälle**
bestanden; beide ausführbaren Screenshot-Fälle bestanden ebenfalls. Insgesamt
sind **76 ausführbare Fälle erfolgreich geprüft, 2 planmäßig übersprungen**
(Desktop benötigt kein Mobilmenü, zusätzliche Tablet-Screenshots sind nicht
Teil der Review-Bilder).

Der erste Handy-Screenshotlauf überschritt beim Erstellen der zusätzlichen
LinkHub-Bilder sein Zeitlimit. Die Artefaktaufnahme wurde auf CSS-Pixel und ein
passendes Zeitbudget umgestellt und gezielt erfolgreich wiederholt. Es wurden
keine Funktionsprüfungen dafür abgeschaltet. Der ursprüngliche vollständige
HTML-Bericht behält diesen diagnostizierten Aufnahmefehler; der anschließende
Screenshotlauf ist separat dokumentiert.

Geprüft wurden:

- DE/EN, sechs öffentliche Seiten, Metadaten und echte 404-Antworten;
- Formulareingaben, angenommene und abgelehnte Mock-Antworten, Netzwerkfehler
  und Wiederholung ohne echte FormSubmit-Übermittlung;
- Videowiedergabe, Bytebereiche und Fehleralternative;
- Tastaturbedienung, Menüzustände und Fokusrückgabe;
- LinkHub ohne JavaScript bei 320 und 390 Pixeln, vorhandene Bilder,
  unbeschnittene Bilddarstellung, echte Linkziele und mindestens 44 Pixel große
  Bedienelemente;
- Animationen bei normaler Bewegungseinstellung und sofortiger Abbruch beim
  Umschalten auf reduzierte Bewegung;
- sichtbare Inhalte bei ausgeschaltetem JavaScript sowie reduzierte
  Ortswiederholungen.

Hauptseite und LinkHub wurden zusätzlich visuell auf Handy und Desktop geprüft;
die Hauptseite bei 320, 390, 768 und 1440 Pixeln. Kein horizontaler Überlauf,
Anfrage-Button im ersten Bildschirm und vollständig sichtbare Partnerbilder.

axe-core 4.11.0 fand auf den vier neu gestalteten DE/EN-Seiten bei 390×844 Pixeln
keine automatisch erkannten Verstöße gegen die geprüften WCAG-2-A/AA- und
2.1-AA-Regeln. Manuelle Prüfpunkte zu Kontrast und Videountertiteln bleiben
ausgewiesen. Das ist keine vollständige Barrierefreiheitszertifizierung.
[Prüfdaten](review/accessibility.json)

Die Datei `review/performance.json` enthält historische Messungen des
ursprünglichen Umbaus und ist keine neue Leistungsbewertung dieses Designs.
E-Mail-Zustellung, Suchmaschinenindexierung und rechtliche Vollständigkeit
werden durch diese Gestaltungstests nicht bestätigt.

## Pflege

Texte, Berufsbezeichnung und Kontakt-/Mediendaten: `content/site.cjs`.
Hauptseitenlayout: `assets/css/home-refresh.css`. LinkHub-Inhalte und Links:
`scripts/secondary-pages.cjs`; Gestaltung: `assets/css/linkhub.css`.
Gemeinsame Bewegungen: `src/motion.js`. Die [Handy-Anleitung](OWNER-GUIDE.md)
beschreibt Änderungen ohne eigenen Computer.
