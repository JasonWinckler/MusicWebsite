# Website vom Smartphone pflegen

Die Website funktioniert mit dem vorhandenen Porträt und dem echten Mitschnitt aus dem KÖPI am Ring in Rheine. Ein Showreel, neue Fotos, ein Blog und ein kostenpflichtiger Dienst sind für diese Fassung nicht erforderlich.

## Änderungen prüfen, bevor sie live gehen

Der Umbau wird auf einem eigenen Branch zur Prüfung vorbereitet. Ein Pull Request und seine Screenshots sind eine Vorschau auf die Änderung; sie sind keine Veröffentlichung auf `jason-shadow.com`. Ein Merge nach `main` kann die vorhandene Cloudflare-Pages-Veröffentlichung auslösen. Prüfen Sie daher zuerst die Texte, die Handyansicht und das Formular. Diese Arbeit ändert keine DNS- oder E-Mail-Einstellungen.

Öffnen Sie [das Repository in GitHub](https://github.com/JasonWinckler/MusicWebsite) auf dem Smartphone. Für kleine Textänderungen können Sie die betreffende Datei öffnen und über das Stiftsymbol bearbeiten. Wählen Sie einen neuen Branch und erstellen Sie einen Pull Request, damit die Änderung vor der Veröffentlichung geprüft werden kann. Falls die mobile Ansicht eine Funktion nicht zeigt, nutzen Sie die Desktopansicht des Browsers oder geben Sie die Änderung an einen KI-Assistenten weiter. Sie müssen keine Programme installieren und keine Terminalbefehle ausführen.

## Die drei häufigsten Änderungen

### Einen Text ändern

Die öffentlichen Kontaktangaben, die Bild- und Videopfade und die komplette deutsche und englische Startseitenfassung stehen in [`content/site.cjs`](../content/site.cjs). Die Bereiche heißen zum Beispiel `hero`, `services`, `about`, `faq` und `contact`.

1. Suchen Sie den Text im Abschnitt `de` und ändern Sie nur den Inhalt zwischen den Anführungszeichen.
2. Aktualisieren Sie die entsprechende Stelle im Abschnitt `en`.
3. Lassen Sie die Änderung im Pull Request bauen und prüfen. Bearbeiten Sie weder `dist/` noch die daraus erzeugte fertige HTML-Ausgabe.

Der Brand-Slogan lautet in beiden Sprachen **The Healing Shadow**. Die Berufsbezeichnung bleibt **Sänger · Sprecher · Moderator** bzw. **Singer · Speaker · Moderator**. Beim Ändern der Einstiegsüberschrift müssen `hero.title` und die kurzen Zeilen in `hero.titleLines` denselben Text enthalten. Lassen Sie die Umbrüche auf Handy und Desktop prüfen.

Eine passende Nachricht an einen KI-Assistenten lautet:

> Ändere auf einem eigenen Branch den folgenden Text in `content/site.cjs`, auf Deutsch und Englisch: … . Bewahre die bestätigten Fakten. Baue die Website, prüfe beide Sprachfassungen ohne JavaScript sowie auf dem Handy und zeige mir den Pull Request. Nicht veröffentlichen.

Die E-Mail-Adresse steht zentral unter `site.email`; das FormSubmit-Ziel unter `site.formAction`. Ändern Sie diese beiden Werte nicht unabhängig voneinander. Eine Änderung des Empfängers oder Formularanbieters muss auch mit der Datenschutzerklärung und der FormSubmit-Aktivierung abgeglichen werden.

### Ein Bild ersetzen

Das Originalporträt bleibt unter [`uploads/profile.png`](../uploads/profile.png) erhalten. Die Website verwendet kleinere, optimierte Varianten unter `/media/`, damit Mobilgeräte nicht das große Original laden müssen.

Laden Sie das neue echte Porträt in einem Änderungsbranch hoch und bitten Sie den Assistenten:

> Verwende dieses Porträt anstelle des bisherigen Websiteporträts. Bewahre das Original. Erzeuge wieder passende kleine und große WebP-Varianten und ein Social-Share-Bild, entferne unnötige Metadaten und aktualisiere `site.media.portrait` samt Bildmaßen und zutreffendem Alt-Text in beiden Sprachen. Prüfe den Ausschnitt auf Handy und Desktop sowie die Teilen-Vorschau. Nicht veröffentlichen.

Ein neues Original allein ersetzt die optimierten Varianten noch nicht. Der technische Neuaufbau wird in der Cloud ausgeführt. Nutzen Sie Bilder, deren Veröffentlichung Sie erlauben dürfen; entfernen Sie private Angaben aus Bildtexten und Metadaten.

### Einen echten Auftritt hinzufügen

Der bisherige Mitschnitt liegt als Original unter [`uploads/portfolio/Auftrag1.mp4`](../uploads/portfolio/Auftrag1.mp4). Die Website nutzt die optimierte Fassung, auf die `site.media.performance` verweist.

Für einen weiteren Auftritt reichen zunächst die Datei, ein belegbarer Titel und ein kurzer Kontext: etwa der tatsächliche Veranstaltungsort. Ein Datum, Kundenname oder Zitat gehört nur dazu, wenn es stimmt und veröffentlicht werden darf. Ein leerer Platzhalter ist nicht erforderlich.

> Ergänze diesen echten Auftritt zur Website: [Datei und bestätigte Angaben]. Bewahre die Originaldatei, optimiere die Webfassung, erstelle ein echtes Standbild und pflege deutsche und englische Beschriftungen. Ergänze bei Bedarf `content/site.cjs` und die statische Seitengenerierung um einen zweiten einfachen Beitrag. Erzeuge kein künstliches Karussell und keine unbestätigten Referenzen. Prüfe Videowiedergabe, Ton, Ladeverhalten und Handyansicht. Nicht veröffentlichen.

Für den Austausch des vorhandenen Beispiels werden `site.media.performance` und die Texte unter `performance` angepasst. Ein weiterer Beitrag braucht eine kleine Erweiterung der Daten und Vorlage; er erscheint nicht automatisch nur durch Hochladen einer Datei.

## Google: Ihre Schritte nach einer bewussten Veröffentlichung

Die technischen Dateien machen die Website für Suchmaschinen zugänglich. Ob und wann Google sie indexiert und bei welchen Suchanfragen sie erscheint, entscheidet Google. Es gibt keine zugesagte Position, Frist oder Anzahl von Anfragen.

### Search Console

1. **Bestehenden Zugang prüfen.** Öffnen Sie [Google Search Console](https://search.google.com/search-console/) mit Ihrem eigenen Google-Konto. Wenn `jason-shadow.com` bereits bestätigt ist, verwenden Sie diese Property.
2. **Inhaberschaft bestätigen, falls nötig.** Eine Domain-Property umfasst Protokolle und Subdomains und benötigt einen DNS-Nachweis. Für eine URL-Präfix-Property wie `https://jason-shadow.com/` kommen unter anderem eine HTML-Datei oder ein HTML-Meta-Tag infrage. Wählen Sie die Methode, für die Sie bereits den nötigen Zugriff haben. Geben Sie ein erforderliches öffentliches Prüf-Tag oder eine Prüfdatei einem Assistenten zur gezielten Einbindung. Teilen Sie keine Passwörter. DNS-Änderungen sind ein gesonderter, von Ihnen freizugebender Schritt und wurden hier nicht vorgenommen.
3. **Sitemap einreichen.** Nach der Veröffentlichung die tatsächliche Datei `https://jason-shadow.com/sitemap.xml` im Browser kontrollieren und in der Property unter „Sitemaps“ einreichen.
4. **Beide Startseiten prüfen.** Die URL-Prüfung für `https://jason-shadow.com/` und `https://jason-shadow.com/en/` ausführen. Prüfen Sie Abrufbarkeit, von Google gewählte kanonische URL und Indexierungsstatus. Der Live-Test prüft den aktuellen Abruf; der Indexbericht zeigt Googles bereits gespeicherten Stand. Ein erfolgreicher Live-Test beweist keine Indexierung. Bei einem echten neuen Stand können Sie eine Indexierung anfordern; die Anforderung garantiert keine Aufnahme.
5. **Entwicklung beobachten.** Etwa monatlich Suchanfragen, Impressionen und Klicks ansehen. Notieren Sie daneben tatsächliche passende Anfragen, beispielsweise in einer privaten Handy-Notiz. Fragen Sie im persönlichen Gespräch bei Gelegenheit, wie Interessenten Sie gefunden haben. Dafür ist kein zusätzliches Website-Tracking erforderlich.

Öffentliche Vorschauadressen gehören nicht in die Sitemap. Suchmaschinen sollen die endgültigen Produktions-URLs sehen. Eine Vorschau mit `noindex` ist sinnvoll; dieses Signal darf nicht versehentlich auf der veröffentlichten Hauptseite bleiben.

### Google Unternehmensprofil

Prüfen Sie zuerst die [Teilnahmevoraussetzungen und Darstellungsregeln von Google](https://support.google.com/business/answer/3038177?hl=de). Eine Website oder eine Künstleridentität allein genügt nicht. Google nennt rein online tätige Marken und Künstler als nicht berechtigt. Maßgeblich ist unter anderem, ob Sie Kunden tatsächlich persönlich zu den angegebenen Geschäftszeiten bedienen. Ein Künstler, der bei Kunden vor Ort auftritt, muss seine tatsächliche Arbeitsweise und Googles Prüfung zugrunde legen. Diese Websitearbeit bestätigt keine Berechtigung.

Falls Sie berechtigt sind:

- Verwenden Sie den im Geschäftsverkehr tatsächlich verwendeten Namen und eine passende vorhandene Kategorie. Ergänzen Sie keine Orts- oder Leistungskeywords im Namen.
- Wenn Sie Kunden besuchen und an Ihrer Adresse keine Kunden empfangen, richten Sie das Profil entsprechend als Unternehmen mit Einzugsgebiet ein und blenden Sie die Adresse nach Googles Regeln aus. Erfinden Sie kein Büro und nutzen Sie keine virtuelle Adresse als Besuchsstandort.
- Geben Sie nur Orte als Einzugsgebiet an, die Sie tatsächlich bedienen. Die Website bestätigt bislang lediglich Ihren Standort Rheine.
- Pflegen Sie echte Kontaktdaten und zutreffende Geschäftsangaben. Unbestätigte Reisegebiete, durchgehende Öffnungszeiten und Leistungen gehören nicht ins Profil.
- Laden Sie echte Fotos hoch. Bitten Sie nur tatsächliche Kunden nach einem Auftrag um eine ehrliche Bewertung, ohne Belohnung und ohne Vorgabe einer positiven Bewertung.

Eine sachliche Beschreibung aus den bestätigten Angaben:

> Jason Shadow – Sänger · Sprecher · Moderator. Buchbar für B2B-Veranstaltungen wie Galas, Firmenjubiläen und Events in Restaurants sowie für private Feiern wie Hochzeiten. Live-Gesang, Eventmoderation und Sprecherproduktionen werden passend zum Anlass besprochen.

Dieses Profil wurde während der Websitearbeit weder erstellt noch veröffentlicht. Verwenden Sie in echten Profilen möglichst denselben Künstlernamen, dieselbe Website und dieselbe öffentliche Kontaktadresse. Bei tatsächlichen Veranstaltern oder Spielstätten können Sie nach einem passenden Auftritt um einen sachlichen Website-Link bitten. Es wurden keine Orte kontaktiert und keine Bewertungen angefragt.

## Das Anfrageformular vor dem Einsatz prüfen

Die technische Prüfung kann Formularvalidierung, Zieladresse sowie Fehler- und Erfolgszustände mit abgefangenen Testanfragen prüfen. Sie kann damit keine E-Mail-Zustellung bestätigen.

Nach Ihrer Freigabe der Website:

1. Senden Sie selbst eine klar als Test erkennbare Anfrage über die veröffentlichte Seite.
2. Prüfen Sie das Postfach `business@jason-shadow.com` und gegebenenfalls den Spamordner. Schließen Sie eine erforderliche FormSubmit-Aktivierung über den bestehenden Inhaberzugang ab.
3. Kontrollieren Sie, ob Name, Absenderadresse, Leistung und Nachricht ankommen und eine Antwort an die richtige Adresse möglich ist.
4. Prüfen Sie auch die englische Formularfassung. Die Bestätigung der Website bedeutet, dass der Formularservice die Anfrage angenommen hat; sie beweist keinen Postfacheingang und bestätigt keine Buchung.

Bis dahin bleibt die sichtbare E-Mail-Adresse ein direkter Kontaktweg. Es wurden keine echten Anfragen automatisiert versendet. Die Rechtstexte wurden nicht als anwaltlich geprüft oder zertifiziert bezeichnet.

## Spätere Handyaufnahmen – freiwillig

Die Website ist schon mit dem jetzigen Material nutzbar. Wenn Sie später ergänzen möchten:

- **Gesang:** eine kurze, echte Passage bei ruhigem Hintergrund aufnehmen. Telefon stabil aufstellen, Stimme vorab auf Übersteuerung prüfen und erst dann einen durchgehenden Take aufnehmen. Verwenden Sie Musik, deren Veröffentlichung rechtlich geklärt ist.
- **Moderation:** eine kurze selbst formulierte Begrüßung eines ausdrücklich als Beispiel bezeichneten Anlasses aufnehmen. Keine erfundene Referenzveranstaltung oder Publikumskulisse hinzufügen.
- **Sprecherprobe:** einen eigenen kurzen Text verwenden und Aufnahmebedingungen ehrlich halten. Gesprochenen Text für eine wortgetreue Textfassung oder Untertitel mitliefern.

Sie können die Dateien anschließend mit dem oben beschriebenen Auftrag über einen Assistenten ergänzen lassen. Eine weitere kostenpflichtige Produktion ist dafür keine Voraussetzung.

## Offizielle Hilfe zum Nachlesen

Die zentralen offiziellen Hilfen zu Sprachen, Canonicals, Sitemap, Inhaberschaft, URL-Prüfung und Unternehmensprofil wurden am 29. Oktober 2026 abgerufen. Die verlinkten Hilfen sind die maßgebliche Anlaufstelle für Konto- und Eigentümerschritte. Oberfläche, Verfügbarkeit und Regeln können sich ändern; prüfen Sie den jeweiligen Stand bei der Einrichtung.

- [Search Central: SEO-Grundlagen](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=de)
- [Search Console: Inhaberschaft bestätigen](https://support.google.com/webmasters/answer/9008080?hl=de)
- [Search Central: Sitemap erstellen und einreichen](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=de)
- [Search Central: Mehrsprachige Websites](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=de)
- [Search Console: URL-Prüfung](https://support.google.com/webmasters/answer/9012289?hl=de)
- [Google Unternehmensprofil: Teilnahmevoraussetzungen](https://support.google.com/business/answer/13763036?hl=de)
- [Google Unternehmensprofil: Richtlinien](https://support.google.com/business/answer/3038177?hl=de)
- [Google Unternehmensprofil: Einzugsgebiet verwalten](https://support.google.com/business/answer/9157481?hl=de)
