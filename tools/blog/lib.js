// Gemeinsame Helfer fuer die Artikel-Pipeline.
// Alle strukturellen Bausteine (Kopfbereich, Header, Footer, Asset-Version, Schriften)
// werden aus einer bestehenden Artikelseite gelesen. Dadurch ueberlebt die Pipeline
// jedes Redesign, ohne dass hier etwas angepasst werden muss.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const SITE = path.join(ROOT, "site");
const TMP = path.join(ROOT, ".blogtmp");

// Referenzseiten in dieser Reihenfolge. Die erste vorhandene wird genommen.
const REF_CANDIDATES = [
  "casino-tischlimit", "online-roulette", "spielbank-vs-online-casino",
  "verantwortungsvolles-spielen", "ratgeber-limits-einrichten",
];

function pickRef() {
  for (const c of REF_CANDIDATES) {
    const p = path.join(SITE, c + ".html");
    if (fs.existsSync(p)) {
      const h = fs.readFileSync(p, "utf8");
      if (h.includes('<div class="article">') && h.includes('<nav class="crumbs">')) return { slug: c, html: h };
    }
  }
  // Notfall: irgendeine Artikelseite mit der erwarteten Struktur
  for (const f of fs.readdirSync(SITE).filter(x => x.endsWith(".html"))) {
    const h = fs.readFileSync(path.join(SITE, f), "utf8");
    if (h.includes('<div class="article">') && h.includes('<nav class="crumbs">')) {
      return { slug: f.replace(/\.html$/, ""), html: h };
    }
  }
  throw new Error("Keine Referenz-Artikelseite gefunden.");
}

// Zerlegt die Referenzseite in wiederverwendbare Bausteine.
function template() {
  const { slug, html: ref } = pickRef();

  const version = (ref.match(/style\.css\?v=(\d+)/) || [])[1];
  if (!version) throw new Error("Asset-Version in der Referenz nicht gefunden: " + slug);

  const fontPreloads = (ref.match(/^[ \t]*<link rel="preload" as="font"[^>]*>\r?$/gm) || [])
    .map(s => s.replace(/\r$/, "")).join("\n");

  const hStart = ref.indexOf('<header class="site-header">');
  const hEnd = ref.indexOf("</header>", hStart);
  if (hStart < 0 || hEnd < 0) throw new Error("Header in der Referenz nicht gefunden.");
  const header = ref.slice(ref.lastIndexOf("\n", hStart) + 1, hEnd + 9);

  const fStart = ref.indexOf('<footer class="site-footer">');
  if (fStart < 0) throw new Error("Footer in der Referenz nicht gefunden.");
  const tail = ref.slice(ref.lastIndexOf("\n", fStart) + 1);

  // Alles zwischen </header> und <div class="article"> ist die Artikel-Huelle.
  const mStart = ref.indexOf("</header>") + 9;
  const aStart = ref.indexOf('<div class="article">');
  if (aStart < 0) throw new Error("Artikelcontainer in der Referenz nicht gefunden.");
  const shellOpen = ref.slice(mStart, aStart + '<div class="article">'.length);

  // Die schliessenden Tags werden aus der Huelle selbst abgeleitet: jedes in
  // shellOpen geoeffnete main/div wird in umgekehrter Reihenfolge geschlossen,
  // mit der Einrueckung der zugehoerigen Oeffnungszeile.
  const offen = [];
  for (const line of shellOpen.split("\n")) {
    const mm = line.match(/^([ \t]*)<(main|div)\b/);
    if (mm && !line.includes("</" + mm[2] + ">")) offen.push(mm[1] + "</" + mm[2] + ">");
  }
  if (!offen.length) throw new Error("Artikel-Huelle konnte nicht ausgewertet werden.");
  const shellClose = offen.reverse().join("\n");

  // Das Beitragsbild wird ebenfalls aus der Referenz uebernommen, damit
  // Attribute wie loading oder fetchpriority nicht hier gepflegt werden muessen.
  const figureTpl = (ref.match(/<figure class="article-img">[\s\S]*?<\/figure>/) || [])[0]
    || '<figure class="article-img"><img src="" alt="" width="820" height="440" loading="eager" fetchpriority="high" decoding="async"></figure>';

  return { refSlug: slug, version, fontPreloads, header, tail, shellOpen, shellClose, figureTpl };
}

function attr(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function words(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/g, " ")
    .trim().split(/\s+/).filter(Boolean).length;
}

const MONATE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

function heute() {
  const d = new Date();
  const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  return { iso, label: MONATE[d.getMonth()] + " " + d.getFullYear() };
}

function listSlugs() {
  return new Set(fs.readdirSync(SITE).filter(f => f.endsWith(".html")).map(f => f.replace(/\.html$/, "")));
}

function listDrafts() {
  if (!fs.existsSync(TMP)) return [];
  return fs.readdirSync(TMP).filter(f => /^draft-.*\.json$/.test(f)).sort()
    .map(f => ({ file: path.join(TMP, f), data: JSON.parse(fs.readFileSync(path.join(TMP, f), "utf8")) }));
}

// Zeichen, die im Text nichts zu suchen haben: Gedankenstriche in allen Varianten.
const DASH_RX = /[–—‒―−]/g;

module.exports = { ROOT, SITE, TMP, template, attr, words, heute, listSlugs, listDrafts, DASH_RX, MONATE };
