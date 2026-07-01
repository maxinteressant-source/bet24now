# Bet24Now

Statische Casino-Affiliate-Website (HTML/CSS, kein Build-Prozess).
Ausgeliefert per Caddy-Webserver – deploybar auf Railway, Cloudflare Pages, Netlify u. a.

## Struktur
```
bet24now/
├─ site/                     # die eigentliche Website (wird ausgeliefert)
│  ├─ index.html             # Startseite / Toplist
│  ├─ review-hit-n-spin.html # Casino-Review (mit Affiliate-Link)
│  ├─ ratgeber-umsatzbedingungen.html
│  ├─ impressum.html
│  ├─ datenschutz.html
│  ├─ style.css
│  ├─ robots.txt
│  └─ sitemap.xml
├─ Dockerfile                # Caddy servt /site
├─ Caddyfile
└─ .gitignore
```

## Lokal ansehen
Einfach `site/index.html` im Browser öffnen (Doppelklick). Kein Server nötig.

## Deployment auf Railway
1. Repo bei GitHub anlegen und Code pushen (siehe unten).
2. Railway → **New Project → Deploy from GitHub repo** → dieses Repo wählen.
3. Railway erkennt das `Dockerfile` automatisch und baut den Container.
4. Unter **Settings → Networking → Generate Domain** bekommst du eine Test-URL.
5. Eigene Domain: **Settings → Networking → Custom Domain** → `bet24now.com` eintragen und die angezeigten DNS-Einträge beim Domain-Anbieter setzen.

## Neue Artikel hinzufügen
1. Eine bestehende Seite (z. B. `review-hit-n-spin.html`) kopieren, umbenennen, Inhalt anpassen.
2. In `index.html` verlinken.
3. In `sitemap.xml` die neue URL ergänzen.
4. Änderungen committen und pushen – der Host deployt automatisch neu.
