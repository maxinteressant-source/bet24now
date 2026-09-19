// Haengt die neuen Artikel in ratgeber.html und sitemap.xml ein und setzt
// kontextuelle Eingangslinks aus bestehenden Seiten.
// Plan liegt in .blogtmp/plan.json:
// {
//   "cards": [ {"slug","img","cat","h","p","section"} ],   // section = H2-Text in ratgeber.html
//   "inbound": [ {"file","h2","sentence"} ]                 // sentence enthaelt genau einen <a href="/slug">
// }
// Die verfuegbaren Bereiche zeigt: node tools/blog/inventory.js --sections
// Der Satz wird an den letzten Absatz VOR der genannten H2 angehaengt.
const fs = require("fs");
const path = require("path");
const L = require("./lib");

const planFile = path.join(L.TMP, "plan.json");
if (!fs.existsSync(planFile)) { console.error("plan.json fehlt in .blogtmp/"); process.exit(1); }
const plan = JSON.parse(fs.readFileSync(planFile, "utf8"));
let fehler = 0;

// --- Karten in ratgeber.html, jeweils in den passenden Themenbereich ---
const rgFile = path.join(L.SITE, "ratgeber.html");
let rg = fs.readFileSync(rgFile, "utf8");
const sections = [...rg.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1].trim());
for (const c of plan.cards || []) {
  if (rg.includes('href="/' + c.slug + '"')) { console.log("  schon verdrahtet: " + c.slug); continue; }
  if (!fs.existsSync(path.join(L.SITE, "img", c.img + ".webp"))) { console.log("  FEHLER Bild fehlt: " + c.img); fehler++; continue; }
  if (!c.section) { console.log("  FEHLER section fehlt fuer " + c.slug + ". Bereiche: " + sections.join(" | ")); fehler++; continue; }
  const hRx = new RegExp("<h2[^>]*>" + c.section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "</h2>");
  const hi = rg.search(hRx);
  if (hi < 0) { console.log("  FEHLER Bereich nicht gefunden: " + c.section + ". Vorhanden: " + sections.join(" | ")); fehler++; continue; }
  const gi = rg.indexOf('<div class="grid-cards grid-news">', hi);
  if (gi < 0) { console.log("  FEHLER kein Kartenraster unter " + c.section); fehler++; continue; }
  const insertAt = rg.indexOf("\n", gi) + 1;
  const indent = (rg.slice(insertAt).match(/^[ \t]*/) || [""])[0] || "        ";
  const card = indent + '<a class="news-card" href="/' + c.slug + '"><div class="news-img"><img src="/img/' + c.img +
    '.webp" alt="' + L.attr(c.h) + '" width="380" height="210" loading="lazy"></div><div class="news-body"><span class="news-cat">' +
    L.attr(c.cat) + '</span><h3>' + L.attr(c.h) + '</h3><p>' + L.attr(c.p) + '</p><div class="news-meta">Bet24Now-Redaktion</div></div></a>\n';
  rg = rg.slice(0, insertAt) + card + rg.slice(insertAt);
  fs.writeFileSync(rgFile, rg);
  console.log("  Karte in \"" + c.section + "\": " + c.slug);
}

// --- Sitemap ---
const smFile = path.join(L.SITE, "sitemap.xml");
let sm = fs.readFileSync(smFile, "utf8");
const iso = L.heute().iso;
let added = 0;
for (const c of plan.cards || []) {
  if (sm.includes("/" + c.slug + "<")) { console.log("  schon in Sitemap: " + c.slug); continue; }
  sm = sm.replace("</urlset>", "  <url><loc>https://bet24now.com/" + c.slug +
    "</loc><lastmod>" + iso + "</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>");
  added++;
}
if (added) { fs.writeFileSync(smFile, sm); console.log("sitemap.xml: " + added + " URLs ergaenzt"); }

// --- Eingangslinks ---
let ok = 0;
for (const ins of plan.inbound || []) {
  const p = path.join(L.SITE, ins.file + ".html");
  if (!fs.existsSync(p)) { console.log("  FEHLER Datei fehlt: " + ins.file); fehler++; continue; }
  if (L.DASH_RX.test(ins.sentence)) { L.DASH_RX.lastIndex = 0; console.log("  FEHLER Gedankenstrich im Satz fuer " + ins.file); fehler++; continue; }
  L.DASH_RX.lastIndex = 0;
  let h = fs.readFileSync(p, "utf8");
  const target = (ins.sentence.match(/href="\/([a-z0-9\-]+)"/) || [])[1];
  if (!target) { console.log("  FEHLER kein Link im Satz fuer " + ins.file); fehler++; continue; }
  if (h.includes('href="/' + target + '"')) { console.log("  schon verlinkt: " + ins.file + " -> " + target); continue; }
  const rx = new RegExp("<h2[^>]*>" + ins.h2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "</h2>");
  const hi = h.search(rx);
  if (hi < 0) { console.log("  FEHLER H2 nicht gefunden in " + ins.file + ": " + ins.h2); fehler++; continue; }
  const pi = h.lastIndexOf("</p>", hi);
  if (pi < 0) { console.log("  FEHLER kein Absatz vor der H2 in " + ins.file); fehler++; continue; }
  fs.writeFileSync(p, h.slice(0, pi) + ins.sentence + h.slice(pi));
  console.log("  " + ins.file + " -> /" + target);
  ok++;
}
console.log("Eingangslinks gesetzt: " + ok + ", Fehler: " + fehler);
process.exit(fehler ? 1 : 0);
