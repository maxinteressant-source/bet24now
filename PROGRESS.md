# Projekt-Fortschritt – Bet24Now (Stand: Juli 2026)

Diese Datei fasst zusammen, wo wir stehen. Beim Weiterarbeiten mit Claude Code
einfach diese Datei öffnen und Claude sagen: „Lies PROGRESS.md, wir machen da weiter."

## Was das Projekt ist
Statische Casino-Affiliate-Website (SEO-Content) für die Marke **Bet24Now**.
Zielsprache: Deutsch. Betreiber (Impressum): FMD Media, Hafendamm 31a, 24943 Flensburg.
Affiliate-Angebot aktuell: Hit N Spin (Link: https://hitnspinpromo.com/l/6a456019e1864d8a690a87f2).

## Technischer Stand (FERTIG ✅)
- **Code:** statische HTML/CSS-Seite im Ordner `site/` (kein Build-Prozess).
  Seiten: index (Startseite/Toplist), review-hit-n-spin, ratgeber-umsatzbedingungen,
  impressum, datenschutz, plus robots.txt + sitemap.xml.
- **GitHub-Repo:** https://github.com/maxinteressant-source/bet24now  (Konto: maxinteressant-source)
- **Deployment:** Railway, Projekt „gentle-gentleness", Service „bet24now"
  (verbunden mit GitHub-Konto **axcodez**). Läuft per Caddy (Dockerfile), Port 8080.
- **Live-URL:** https://bet24now-production.up.railway.app  ← Seite ist online!
- Jeder `git push` auf main deployt Railway automatisch neu.

## Custom Domain bet24now.com (IN ARBEIT ⏳)
Domain gekauft bei **United Domains**. Anbindung über **Cloudflare** (Konto: Maxim@feldhinkel.com).

Bereits erledigt:
- In Railway Custom Domain `bet24now.com` (Port 8080) hinzugefügt.
- In Cloudflare Site `bet24now.com` angelegt (Free-Plan) und DNS-Records gesetzt:
  - CNAME  `@`  →  `7lqrsr4d.up.railway.app`  (Proxy: **DNS only / graue Wolke**)
  - TXT    `_railway-verify`  →  `railway-verify=63411cd793f552db9fdc044acb1ce3d00a930ef860190798e18c6729361b40b9`
- Cloudflare-Nameserver erhalten: **brad.ns.cloudflare.com** und **kay.ns.cloudflare.com**

### NÄCHSTE SCHRITTE (hier weitermachen):
1. **Bei United Domains** die Nameserver von bet24now.com ersetzen durch:
   - `brad.ns.cloudflare.com`
   - `kay.ns.cloudflare.com`
   (alle anderen Nameserver löschen; sicherstellen, dass DNSSEC AUS ist; speichern)
2. **In Cloudflare** auf „I updated my nameservers" klicken. Auf Aktivierungs-Mail warten (Minuten bis Stunden).
3. **In Railway** prüfen, bis `bet24now.com` als verifiziert/grün angezeigt wird → Seite ist dann unter bet24now.com live (SSL kommt automatisch).
4. **Optional danach:** in Cloudflare den CNAME auf „Proxied" (orange Wolke) umstellen für CDN/Speed;
   SSL/TLS-Modus auf „Full" setzen.

## Offene inhaltliche To-dos (später)
- Rechtliche Prüfung: Ist Hit N Spin für den beworbenen Markt lizenziert? (Wichtig fürs legale Bewerben.)
- Mehr SEO-Content: weitere Reviews + Ratgeber-Artikel.
- E-Mail-Marketing-Template liegt separat unter Downloads/casino-email-template.html (fertig).
