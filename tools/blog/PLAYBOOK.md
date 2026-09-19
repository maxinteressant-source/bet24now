# Playbook: fünf neue Artikel für Bet24Now

Dieses Dokument ist die vollständige Arbeitsanweisung. Wer es befolgt, braucht keinen weiteren Kontext.

**Projekt:** bet24now.com, deutschsprachiges Online-Casino-Vergleichsportal.
**Technik:** statische HTML-Seiten in `site/`, ausgeliefert über Caddy, Docker und Railway, davor Cloudflare. Kein Build, kein Framework. Eine Datei pro Seite. Der Deploy passiert automatisch beim Push auf `main`.
**Sprache:** Deutsch, Anrede durchgehend **du**, niemals die Höflichkeitsform.

---

## Ablauf in neun Schritten

### 1. Stand holen

```
git fetch origin && git pull --ff-only origin main
node tools/blog/inventory.js
```

An diesem Repository arbeiten mehrere Prozesse. **Immer erst ziehen, dann arbeiten**, und direkt vor dem Commit noch einmal ziehen.

`inventory.js` gibt alle vorhandenen Slugs und alle nutzbaren Bilder aus. Es dürfen ausschließlich Bilder verwendet werden, die dort gelistet sind, denn nur die existieren als `.webp` **und** `.jpg`.

### 2. Fünf Themen wählen

Anforderungen an jedes Thema:

- relevantes Suchvolumen im deutschen Markt und realistische Chance auf eine Platzierung
- passt zu einem Casino-Vergleichsportal
- bringt langfristig Besucher, kein Tagesthema
- **kollidiert mit keiner bestehenden Seite**

Kollisionsprüfung ist Pflicht, nicht optional:

```
node tools/blog/inventory.js "suchbegriff" "zweiter begriff" "dritter begriff"
node tools/blog/inventory.js --headings
```

Ein Thema ist verbrannt, wenn ein bestehender Artikel es bereits als eigene H2 behandelt oder wenn der Kernbegriff auf vielen Seiten ausführlich vorkommt. Eine beiläufige Erwähnung in zwei Sätzen ist dagegen kein Hindernis, sondern ein Argument: Dann existiert Nachfrage und noch keine eigene Seite.

Gute Streuung über eine Runde: zwei Themen aus dem Spielebereich, ein bis zwei aus Ratgeber oder Zahlungen, mindestens eines aus dem Spielerschutz. Themen, die bereits abgedeckt sind, werden verworfen, nicht umgeschrieben.

Für jedes Thema festlegen: `slug` (klein, Bindestriche, ohne Umlaute), `img` (aus der Bilderliste), `badge` (genau einer von **Spiele**, **Spielerschutz**, **Ratgeber**, **Zahlung**, **Vergleich**, **Hintergrund**), `breadcrumbLabel` (kurz, zwei bis drei Wörter).

### 3. Artikel schreiben

Pro Artikel **2.600 bis 4.000 Wörter** Fließtext. Magazinstil, kein Werbetext.

**Struktur, genau in dieser Reihenfolge:**

1. Einleitender Absatz, 120 bis 180 Wörter, konkret einsteigend, ohne Floskel
2. `<div class="disclosure">ℹ️ <strong>Worum es hier geht.</strong> …</div>`
3. `<h2 id="toc">Inhalt</h2>` plus `<ul class="toc">` mit einem `<li><a href="#anker">Titel</a></li>` je H2
4. acht bis zwölf inhaltliche `<h2 id="…">` mit sprechenden ids, darunter wo sinnvoll `<h3>`
5. mindestens eine Tabelle, immer als `<div class="table-scroll"><table class="specs">…</table></div>`
6. mindestens eine Checkliste mit `☐` und eine Liste mit `✅`
7. mindestens zwei weitere Kästen `<div class="disclosure">ℹ️ …</div>` oder `⚠️`
8. `<h2 id="zusammenfassung">Das Wichtigste in Kürze</h2>` mit Liste
9. `<h2 id="faq">Häufige Fragen</h2>` mit genau sechs `<h3>Frage</h3><p>Antwort</p>`
10. `<h2 id="fazit">Fazit</h2>`, zwei bis drei Absätze
11. Schlussblock, exakt so:

```html
<div class="resp" style="margin-top:26px;"><strong>18+ · Glücksspiel kann süchtig machen.</strong> EIN ZUM THEMA PASSENDER SATZ. Kostenlose und anonyme Beratung der BZgA: <a href="tel:08001372700">0800 1 37 27 00</a>. Beratungsstellen in der Nähe: <a href="https://www.buwei.de" target="_blank" rel="noopener">buwei.de</a>.</div>
```

Die Telefonnummer hat **elf** Ziffern. `tel:080013727700` mit zwölf Ziffern ist falsch und wählt eine fremde Nummer.

**Kein `<h1>` und kein `<figure>`** im Artikeltext, beides setzt der Assembler.

### 4. Harte Regeln

**Gedankenstriche sind verboten.** Weder `–` (U+2013) noch `—` (U+2014) noch `‒`, `―`, `−`. Stattdessen Komma, Doppelpunkt oder Punkt. Bindestriche in zusammengesetzten Wörtern bleiben selbstverständlich erlaubt. Das ist eine ausdrückliche Vorgabe des Betreibers und wird maschinell geprüft.

**Keine Höflichkeitsform.** Kein „Sie", „Ihnen", „Ihre", „Ihr" als Anrede. Das Pronomen „sie" in der dritten Person ist davon nicht betroffen.

**Keine erfundenen Fakten.** Das ist die wichtigste Regel überhaupt.

- keine Studien, Statistiken, Prozentzahlen, Geldbeträge oder Paragrafennummern, die nicht sicher stimmen
- keine Aussagen über namentlich genannte Casinos, Hersteller oder Spieltitel
- keine Pseudo-Quellen: „Studien zeigen", „in der Beratungsarbeit gilt", „Erfahrungsberichte belegen". Wenn etwas eine Alltagsbeobachtung ist, wird es auch so formuliert: „Viele beschreiben, dass …"
- keine unbelegten Allquantoren: statt „nahezu alle Anbieter" lieber „die meisten", „häufig", „üblicherweise"
- psychologische Aussagen ausschließlich mit Bezug auf die **Bundeszentrale für gesundheitliche Aufklärung (BZgA)**, allgemein gehalten, ohne erfundene Zitate

Gesicherte Rahmendaten für den deutschen Markt, die verwendet werden dürfen: Einsatz beim virtuellen Automatenspiel höchstens ein Euro pro Spiel, Mindestdauer fünf Sekunden pro Spiel, anbieterübergreifendes Einzahlungslimit von 1.000 Euro im Monat, bundesweite Sperrdatei OASIS, Aufsicht durch die GGL. Alles darüber hinaus nur, wenn es wirklich gesichert ist.

**Ehrlichkeit.** Zu jedem Thema gehören die Nachteile. Ein Text, der nur Vorteile nennt, ist unbrauchbar. Die Redaktion tritt neutral auf und verkauft nicht.

**Kein KI-Tonfall.** Die Konstruktion „nicht X, sondern Y" höchstens dreimal im ganzen Text. Schematische Satzanfänge („Entscheidend ist", „Wichtig ist", „Hilfreich ist") je höchstens einmal. Keine Meta-Sätze über den eigenen Text. „Genau" als Verstärker höchstens einmal. Satzlängen bewusst variieren, zwischen den fünf Artikeln einer Runde den Ton hörbar unterscheiden.

**Typografie.** Anführungszeichen öffnend `„`, schließend `"`. Keine geraden Zollzeichen im Fließtext.

### 5. Interne Links

12 bis 20 interne Links pro Artikel, im Fließtext, mit beschreibendem Ankertext (nicht ein einzelnes Wort). Jedes Ziel muss als Seite existieren, Prüfung über die Slug-Liste aus `inventory.js`. Externe Links nur `buwei.de` im Schlussblock.

### 6. Entwürfe ablegen

Pro Artikel eine Datei `.blogtmp/draft-<slug>.json`:

```json
{
  "slug": "…", "img": "…", "badge": "…", "breadcrumbLabel": "…",
  "seoTitle": "… | Bet24Now",
  "metaDescription": "…",
  "ogTitle": "…", "ogDescription": "…",
  "h1": "…", "articleHeadline": "…",
  "articleHtml": "…",
  "faq": [{"question": "…", "answer": "…"}]
}
```

`seoTitle` höchstens 60 Zeichen inklusive `| Bet24Now`. `metaDescription` 140 bis 172 Zeichen, mit dem Hauptkeyword und `18+` am Ende. Die sechs FAQ-Einträge müssen **wortgleich** mit den sechs `<h3>`-Fragen und Antworten im Abschnitt `id="faq"` übereinstimmen.

### 7. Gegenlesen lassen

Vor dem Zusammenbau jeden Entwurf von je einem eigenen Prüfer gegenlesen lassen, einmal auf Fakten und Recht, einmal auf Sprache und KI-Muster. Beide bekommen die Regeln aus Abschnitt 4 und den Auftrag, Fehler zu finden statt zu loben. Jeden Befund einarbeiten. Nur begründet abweichen, wenn ein Befund sachlich falsch ist.

Diese Runde hat sich bewährt: Bei fünf Artikeln kommen typischerweise 30 bis 45 echte Befunde pro Artikel zusammen, überwiegend erfundene Zahlen und Pseudo-Quellen.

### 8. Bauen, verdrahten, prüfen

```
node tools/blog/assemble.js
```

Dann `.blogtmp/plan.json` schreiben und ausführen:

```json
{
  "cards": [
    {"slug":"…","img":"…","cat":"Spiele","h":"Kartentitel",
     "p":"Ein Satz, der neugierig macht.","section":"Spiele und Regeln"}
  ],
  "inbound": [
    {"file":"bestehender-slug","h2":"Exakter H2-Text der Zielseite",
     "sentence":" Ein anschließender Satz mit <a href=\"/neuer-slug\">beschreibendem Ankertext</a>."}
  ]
}
```

```
node tools/blog/wire.js
node tools/blog/verify.js
```

`cat` der Karte entspricht dem Badge. `section` ist der Themenbereich in `ratgeber.html`, unter dem die Karte einsortiert wird. Die gültigen Bereiche gibt `inventory.js` aus, aktuell **Einstieg und Recht**, **Bonus und Umsatz**, **Ein- und Auszahlen**, **Spiele und Regeln**, **Spielerschutz und Hilfe**. Diese Liste kann sich ändern, deshalb immer frisch abfragen statt aus dem Kopf zu nehmen. Der `sentence` beginnt mit einem Leerzeichen und wird an den **letzten Absatz vor** der genannten H2 angehängt, muss dort also inhaltlich anschließen.

**Pro neuem Artikel zwei Eingangslinks** aus thematisch passenden Bestandsseiten. Das ist kein Beiwerk: Die Ratgeber-Übersicht wächst, ältere Karten rutschen nach unten, und ohne Links aus dem Bestand bleiben neue Seiten für Suchmaschinen kaum erreichbar.

`verify.js` muss grün sein. **Bei rotem Ergebnis wird nicht veröffentlicht**, sondern der Fehler behoben.

### 9. Veröffentlichen

```
git fetch origin && git pull --ff-only origin main
git add -A site/
git commit -m "…"
git push origin main
```

Commit-Nachricht auf Deutsch, ohne Umlaute in der Betreffzeile, mit den fünf Slugs im Text. Am Ende:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

Danach die fünf URLs auf Status 200 prüfen, der Deploy braucht ein bis zwei Minuten:

```
for s in slug1 slug2 slug3 slug4 slug5; do curl -s -o /dev/null -w "$s %{http_code}\n" https://bet24now.com/$s; done
```

`.blogtmp/` ist nicht Teil des Repositories und wird nicht committet.

---

## Was schiefgehen kann

| Symptom | Ursache und Abhilfe |
|---|---|
| `verify.js` meldet `keineDashes` | Gedankenstrich im Text, ersetzen durch Komma oder Doppelpunkt |
| `verify.js` meldet `kaputte Links` | interner Link auf eine Seite, die es nicht gibt, gegen die Slug-Liste prüfen |
| `verify.js` meldet `verdrahtet` | Karte fehlt in `ratgeber.html`, `plan.json` prüfen und `wire.js` erneut laufen lassen |
| `assemble.js` meldet `Bild fehlt` | nur Bilder aus der Liste von `inventory.js` verwenden |
| Push abgelehnt | ein paralleler Prozess hat committet, `git pull --ff-only` und erneut pushen |

## Was ehrlich gesagt gehört

Die Seite hat trotz vieler hundert Artikel nur eine einstellige Zahl indexierter Seiten. Der begrenzende Faktor ist die Autorität der Domain, also Verlinkungen von außen, nicht die Menge an Inhalt. Wer diese Runde ausführt, sollte das im Abschlussbericht wiederholen, statt den Eindruck zu erwecken, fünf weitere Artikel lösten das Problem.
