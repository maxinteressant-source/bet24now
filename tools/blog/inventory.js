// Bestandsaufnahme fuer die Themenwahl.
// node tools/blog/inventory.js               -> alle Slugs und Kennzahlen
// node tools/blog/inventory.js --headings    -> zusaetzlich alle H2 je Seite
// node tools/blog/inventory.js begriff ...   -> Kollisionspruefung fuer Suchbegriffe
const fs = require("fs");
const path = require("path");
const L = require("./lib");

const args = process.argv.slice(2);
const files = fs.readdirSync(L.SITE).filter(f => f.endsWith(".html"));
const terms = args.filter(a => !a.startsWith("--"));

if (!terms.length) {
  const slugs = files.map(f => f.replace(/\.html$/, "")).sort();
  console.log("Seiten gesamt: " + slugs.length + "\n");
  console.log("SLUGS:\n" + slugs.join(" ") + "\n");
  const imgs = fs.readdirSync(path.join(L.SITE, "img")).filter(f => f.endsWith(".webp"))
    .map(f => f.replace(/\.webp$/, ""))
    .filter(n => fs.existsSync(path.join(L.SITE, "img", n + ".jpg")));
  console.log("VERFUEGBARE BILDER (webp und jpg vorhanden):\n" + imgs.join(" ") + "\n");
  const rg = fs.readFileSync(path.join(L.SITE, "ratgeber.html"), "utf8");
  const sections = [...rg.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1].trim());
  console.log("THEMENBEREICHE in ratgeber.html (Feld \"section\" in plan.json):\n  " + sections.join("\n  ") + "\n");
  if (args.includes("--headings")) {
    console.log("UEBERSCHRIFTEN:");
    for (const f of files) {
      const h = fs.readFileSync(path.join(L.SITE, f), "utf8");
      const hs = (h.match(/<h2[^>]*>[^<]*<\/h2>/g) || []).map(x => x.replace(/<[^>]*>/g, "").trim());
      if (hs.length) console.log("  " + f.replace(/\.html$/, "") + ": " + hs.join(" | "));
    }
  }
  process.exit(0);
}

console.log("Kollisionspruefung\n");
for (const t of terms) {
  const hits = [];
  for (const f of files) {
    const h = fs.readFileSync(path.join(L.SITE, f), "utf8");
    const n = (h.toLowerCase().match(new RegExp(t.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    if (n) hits.push([f.replace(/\.html$/, ""), n]);
  }
  hits.sort((a, b) => b[1] - a[1]);
  console.log('"' + t + '": ' + hits.length + " Seite(n)" + (hits.length ? " -> " + hits.slice(0, 8).map(x => x[0] + "(" + x[1] + ")").join(", ") : ""));
}
