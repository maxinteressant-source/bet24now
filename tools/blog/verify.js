// Mechanische Endkontrolle. Ohne gruenes Ergebnis wird nichts veroeffentlicht.
// Aufruf: node tools/blog/verify.js slug1 slug2 ...   (ohne Argumente: alle Entwuerfe aus .blogtmp)
const fs = require("fs");
const path = require("path");
const L = require("./lib");

let slugs = process.argv.slice(2);
if (!slugs.length) slugs = L.listDrafts().map(d => d.data.slug);
if (!slugs.length) { console.error("Keine Slugs und keine Entwuerfe gefunden."); process.exit(1); }

const pages = L.listSlugs();
const rg = fs.readFileSync(path.join(L.SITE, "ratgeber.html"), "utf8");
const sm = fs.readFileSync(path.join(L.SITE, "sitemap.xml"), "utf8");
const refVer = L.template().version;

let bad = 0;
for (const p of slugs) {
  const file = path.join(L.SITE, p + ".html");
  if (!fs.existsSync(file)) { console.log(p.padEnd(32) + " DATEI FEHLT"); bad++; continue; }
  const h = fs.readFileSync(file, "utf8");
  const a = (h.match(/<div class="article">([\s\S]*?)<\/main>/) || [])[1] || "";

  const w = L.words(a);
  const t = ((h.match(/<title>(.*?)<\/title>/) || [])[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  const d = ((h.match(/<meta name="description" content="(.*?)">/) || [])[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  const dash = (h.match(L.DASH_RX) || []).length;
  const undef = (h.match(/undefined/g) || []).length;
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let ldOk = true; for (const b of ld) { try { JSON.parse(b[1]); } catch (e) { ldOk = false; } }
  const h1 = (h.match(/<h1[^>]*>/g) || []).length;
  const divBal = (h.match(/<div/g) || []).length === (h.match(/<\/div>/g) || []).length;
  const links = [...new Set([...a.matchAll(/href="\/([a-z0-9\-]+)"/g)].map(m => m[1]))];
  const brk = links.filter(x => !pages.has(x));
  const anchors = [...new Set([...a.matchAll(/href="#([a-zA-Z0-9\-]+)"/g)].map(m => m[1]))];
  const ids = new Set([...a.matchAll(/id="([a-zA-Z0-9\-]+)"/g)].map(m => m[1]));
  const deadA = anchors.filter(x => !ids.has(x));
  const tbl = (h.match(/<table class="specs">/g) || []).length;
  const wrap = (h.match(/<div class="table-scroll">\s*<table class="specs">/g) || []).length;
  const imgName = (h.match(/og:image" content="https:\/\/bet24now\.com\/img\/([a-z0-9\-]+)\.jpg/) || [])[1];
  const imgOk = imgName && fs.existsSync(path.join(L.SITE, "img", imgName + ".webp")) && fs.existsSync(path.join(L.SITE, "img", imgName + ".jpg"));
  const verOk = h.includes("style.css?v=" + refVer);
  const wired = rg.includes('href="/' + p + '"');
  const inSm = sm.includes("/" + p + "<");
  const faqCount = (() => { for (const b of ld) { try { const j = JSON.parse(b[1]); if (j["@type"] === "FAQPage") return (j.mainEntity || []).length; } catch (e) {} } return 0; })();
  // Hoeflichkeitsanrede: "Sie" am Satzanfang ist drittes-Person-Pronomen und erlaubt.
  const txt = a.replace(/<[^>]*>/g, " ");
  const anrede = [...txt.matchAll(/[a-zäöüß,]\s+(Sie|Ihnen|Ihre[nmrs]?|Ihr)\b/g)].length;
  const telOk = !/tel:080013727700/.test(h);

  const checks = [
    ["Woerter>=2500", w >= 2500],
    ["Titel<=60", t.length <= 60],
    ["Desc140-175", d.length >= 140 && d.length <= 175],
    ["keineDashes", dash === 0],
    ["keinUndefined", undef === 0],
    ["JSON-LD ok", ldOk && ld.length === 3],
    ["1xH1", h1 === 1],
    ["div balanciert", divBal],
    ["keine kaputten Links", brk.length === 0],
    ["keine toten Anker", deadA.length === 0],
    ["Tabellen gewrappt", tbl === wrap],
    ["Bild vorhanden", !!imgOk],
    ["Assetversion", verOk],
    ["FAQ>=5", faqCount >= 5],
    ["verdrahtet", wired],
    ["in Sitemap", inSm],
    ["keine Sie-Anrede", anrede === 0],
    ["Telefonnummer", telOk],
  ];
  const fails = checks.filter(c => !c[1]).map(c => c[0]);
  if (fails.length) bad++;
  console.log(p.padEnd(32) + " W" + w + " T" + t.length + " D" + d.length + " dash" + dash +
    " LD" + ld.length + " faq" + faqCount + " img:" + (imgOk ? imgName : "FEHLT") +
    (fails.length ? "\n    FEHLER: " + fails.join(", ") +
      (brk.length ? " | kaputt: " + brk.join(",") : "") +
      (deadA.length ? " | tote Anker: " + deadA.join(",") : "") : "  ok"));
}
console.log(bad ? "\n>>> " + bad + " Seite(n) mit Problemen" : "\n>>> Alle " + slugs.length + " sauber");
process.exit(bad ? 1 : 0);
