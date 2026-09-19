// Baut aus jedem .blogtmp/draft-<slug>.json eine fertige Artikelseite in site/.
// Aufruf: node tools/blog/assemble.js
const fs = require("fs");
const path = require("path");
const L = require("./lib");

const T = L.template();
const D = L.heute();
console.log("Referenz: " + T.refSlug + ", Assets v" + T.version + ", Datum " + D.iso);

function build(d) {
  if (!d.slug) throw new Error("slug fehlt");
  if (!d.img) throw new Error("img fehlt (Basisname ohne Endung, z.B. blog-slots)");
  for (const ext of ["webp", "jpg"]) {
    if (!fs.existsSync(path.join(L.SITE, "img", d.img + "." + ext))) {
      throw new Error("Bild fehlt: img/" + d.img + "." + ext);
    }
  }
  const w = L.words(d.articleHtml);
  const minuten = Math.max(5, Math.round(w / 250));

  const article = {
    "@context": "https://schema.org", "@type": "Article",
    headline: d.articleHeadline || d.h1,
    datePublished: D.iso, dateModified: D.iso,
    author: { "@type": "Organization", name: "Bet24Now-Redaktion", url: "https://bet24now.com/" },
    publisher: { "@type": "Organization", name: "Bet24Now", logo: { "@type": "ImageObject", url: "https://bet24now.com/favicon.png" } },
    mainEntityOfPage: "https://bet24now.com/" + d.slug,
    image: "https://bet24now.com/img/" + d.img + ".jpg",
  };
  const faqpage = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: (d.faq || []).map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  const crumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bet24now.com/" },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: "https://bet24now.com/ratgeber" },
      { "@type": "ListItem", position: 3, name: d.breadcrumbLabel },
    ],
  };

  // Ein vom Autor mitgeliefertes figure entfernen, eigenes voranstellen.
  let body = String(d.articleHtml || "").trim().replace(/^\s*<figure[\s\S]*?<\/figure>\s*/i, "");
  const figure = T.figureTpl
    .replace(/src="[^"]*"/, 'src="/img/' + d.img + '.webp"')
    .replace(/alt="[^"]*"/, 'alt="' + L.attr(d.h1) + '"');
  body = "        " + figure + "\n        " + body;

  // Artikel-Huelle aus der Referenz uebernehmen und die variablen Teile ersetzen.
  const shell = T.shellOpen
    .replace(/(<nav class="crumbs">[\s\S]*?<span>)[\s\S]*?(<\/span><\/nav>)/, "$1" + L.attr(d.breadcrumbLabel) + "$2")
    .replace(/(<span class="badge">)[\s\S]*?(<\/span>)/, "$1" + L.attr(d.badge) + "$2")
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "<h1>" + d.h1 + "</h1>")
    .replace(/(<p class="meta">)[\s\S]*?(<\/p>)/, "$1Zuletzt aktualisiert: " + D.label + " · Lesezeit ca. " + minuten + " Min. · Bet24Now-Redaktion$2");

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${L.attr(d.seoTitle)}</title>
  <meta name="description" content="${L.attr(d.metaDescription)}">
  <link rel="canonical" href="https://bet24now.com/${d.slug}">
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Bet24Now">
  <meta property="og:locale" content="de_DE">
  <meta property="og:title" content="${L.attr(d.ogTitle || d.h1)}">
  <meta property="og:description" content="${L.attr(d.ogDescription || d.metaDescription)}">
  <meta property="og:url" content="https://bet24now.com/${d.slug}">
  <meta property="og:image" content="https://bet24now.com/img/${d.img}.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="627">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://bet24now.com/img/${d.img}.jpg">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="/style.css?v=${T.version}">
${T.fontPreloads}
  <script type="application/ld+json">
  ${JSON.stringify(article)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(faqpage)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(crumb)}
  </script>
</head>
<body>
${T.header}${shell}
${body}
${T.shellClose}

${T.tail}`;
}

const drafts = L.listDrafts();
if (!drafts.length) { console.error("Keine Entwuerfe in .blogtmp/ gefunden."); process.exit(1); }
let n = 0, fehler = 0;
for (const { file, data } of drafts) {
  try {
    fs.writeFileSync(path.join(L.SITE, data.slug + ".html"), build(data));
    console.log("  geschrieben: " + data.slug + ".html");
    n++;
  } catch (e) {
    console.log("  FEHLER bei " + path.basename(file) + ": " + e.message);
    fehler++;
  }
}
console.log("fertig: " + n + " Seite(n), " + fehler + " Fehler");
process.exit(fehler ? 1 : 0);
