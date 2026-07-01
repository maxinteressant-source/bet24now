# Statisches Hosting via Caddy – funktioniert auf Railway ohne weitere Konfiguration
FROM caddy:2-alpine

# Caddy-Konfiguration einspielen
COPY Caddyfile /etc/caddy/Caddyfile

# Website-Dateien in das Verzeichnis kopieren, das Caddy ausliefert
COPY site /srv
