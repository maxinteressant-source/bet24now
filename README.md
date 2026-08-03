# Bet24Now

Statische Casino-Affiliate-Website (HTML/CSS/JS, kein Build-Prozess).
Ausgeliefert per Caddy-Webserver – deployt automatisch via Railway bei jedem Push auf `main`.

## Struktur
```
bet24now/
├─ site/                        # die eigentliche Website (wird ausgeliefert)
│  ├─ index.html                # Startseite / Casino-Vergleich
│  ├─ news.html                 # Blog-Übersicht (Quelle für blog-index.json!)
│  ├─ ratgeber.html             # Ratgeber-Übersicht
│  ├─ news-*.html               # Blog-Artikel (~80 Stück)
│  ├─ ratgeber-*.html           # Ratgeber-Guides
│  ├─ review-*.html             # Casino-Reviews (CrocoSlots, BitKingz)
│  ├─ style.css                 # Design-System (Asset-Version ?v=… beachten)
│  ├─ main.js                   # Age-Gate, Promo, Consent, Blog-Sidebar, Share, Kategorie-Filter
│  ├─ blog-index.json           # GENERIERT: speist Sidebar/Kategorien (nicht von Hand editieren)
│  ├─ robots.txt · sitemap.xml · llms.txt
│  └─ img/ · fonts/
├─ tools/
│  └─ build-blog-index.ps1      # generiert site/blog-index.json aus news.html
├─ serve.ps1                    # lokaler Dev-Server (nötig – Doppelklick reicht NICHT mehr)
├─ Caddyfile · Dockerfile       # Produktions-Server (Railway)
└─ README.md
```

## Lokal ansehen
Die Seite braucht einen lokalen Server (die Sidebar lädt `/blog-index.json` per fetch, alle Links sind wurzelrelativ – unter `file://` funktioniert beides nicht):
```
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Dann http://localhost:8000 öffnen.

## Neue Artikel hinzufügen
1. Bestehende Artikel-Seite als Vorlage kopieren (News: z. B. `news-casino-lizenzen.html`, Ratgeber: `ratgeber-sichere-online-casinos.html`), umbenennen, Inhalt anpassen (Canonical, Title, JSON-LD, Autor!).
2. Karte in `news.html` (bzw. `ratgeber.html`) ganz oben im Grid ergänzen.
3. Eintrag in `sitemap.xml` ergänzen.
4. **Pflicht:** `powershell -ExecutionPolicy Bypass -File tools/build-blog-index.ps1` ausführen (aktualisiert Sidebar/Kategorien) und die geänderte `blog-index.json` mitcommitten.
5. Committen und auf `main` pushen – Railway deployt automatisch.

## Deployment
Railway baut den Container aus dem `Dockerfile` (Caddy servt `site/`) bei jedem Push auf `main` neu. Live: https://bet24now.com
