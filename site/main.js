// Bet24Now – kleine UI-Interaktionen (ohne Abhängigkeiten)
(function () {
  "use strict";

  // Back-to-Top-Button
  var toTop = document.getElementById("toTop");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 500) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  // Mobile-Navigation (Hamburger-Menü)
  var navToggle = document.querySelector(".nav-toggle");
  var siteHeader = document.querySelector(".site-header");
  if (navToggle && siteHeader) {
    navToggle.addEventListener("click", function () {
      var open = siteHeader.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    // Menü nach Klick auf einen Link schließen
    siteHeader.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        siteHeader.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    // Schließen bei Klick außerhalb
    document.addEventListener("click", function (e) {
      if (siteHeader.classList.contains("nav-open") && !siteHeader.contains(e.target)) {
        siteHeader.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Sanftes Einblenden beim Scrollen (Scroll-Reveal)
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(
    ".card, .ccard, .feature, .mini-card, .news-card, .usp, figure.article-img, table.compare, .rating-box"
  );
  targets.forEach(function (el) { el.classList.add("reveal"); });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("revealed"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(function (el) { io.observe(el); });
})();

// Alters-Verifizierung (18+) – eigenständig, inkl. eigenem Styling
(function () {
  "use strict";
  try { if (localStorage.getItem("bet24now_age_ok") === "1") return; } catch (e) {}

  var css =
    "html.age-locked{overflow:hidden;}" +
    ".age-gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;" +
    "background:rgba(6,8,15,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}" +
    ".age-gate-box{background:linear-gradient(180deg,var(--panel-2,#1b2035),var(--panel,#141829));border:1px solid var(--border,#2a3149);" +
    "border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.6);max-width:440px;width:100%;padding:34px 28px;text-align:center;}" +
    ".age-gate-logo{font-family:var(--font-head,sans-serif);font-weight:800;font-size:22px;color:#fff;margin-bottom:18px;letter-spacing:-.01em;}" +
    ".age-gate-logo span{background:linear-gradient(135deg,#ffd75e,#f5a623);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}" +
    ".age-gate-badge{display:inline-flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:50%;" +
    "background:linear-gradient(135deg,#ffd75e,#f5a623);color:#1a1205;font-family:var(--font-head,sans-serif);font-weight:800;font-size:19px;" +
    "margin-bottom:14px;box-shadow:0 6px 16px rgba(245,166,35,.4);}" +
    ".age-gate-box h2{font-family:var(--font-head,sans-serif);color:#fff;font-size:23px;margin:0 0 10px;}" +
    ".age-gate-box p{color:var(--muted,#98a1bd);margin:0 0 22px;font-size:15px;line-height:1.6;}" +
    ".age-gate-actions{display:flex;flex-direction:column;gap:12px;}" +
    ".age-gate-actions button{width:100%;font-family:var(--font-head,sans-serif);font-weight:700;font-size:17px;padding:15px 22px;border-radius:12px;cursor:pointer;border:1px solid transparent;}" +
    ".age-gate-yes{background:linear-gradient(135deg,#ffd75e,#f5a623);color:#1a1205;box-shadow:0 4px 14px rgba(245,166,35,.3);}" +
    ".age-gate-no{background:transparent;color:#eef1fa;border-color:#38416090;}" +
    ".age-gate-note{margin:22px 0 0!important;font-size:12px!important;color:var(--muted,#98a1bd);}" +
    ".age-gate-note a{color:var(--gold,#ffc93c);}" +
    "@media(max-width:440px){.age-gate-box{padding:28px 20px;}.age-gate-box h2{font-size:20px;}}";
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var ov = document.createElement("div");
  ov.className = "age-gate";
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  ov.setAttribute("aria-label", "Altersbestätigung");
  ov.innerHTML =
    '<div class="age-gate-box">' +
      '<div class="age-gate-logo">Bet<span>24</span>Now</div>' +
      '<div class="age-gate-badge">18+</div>' +
      '<h2>Nur für Erwachsene</h2>' +
      '<p>Diese Seite enthält Werbung für Glücksspiel. Bitte bestätige, dass du mindestens 18 Jahre alt bist.</p>' +
      '<div class="age-gate-actions">' +
        '<button type="button" class="age-gate-yes" data-age="yes">Ich bin 18 Jahre oder älter</button>' +
        '<button type="button" class="age-gate-no" data-age="no">Ich bin unter 18</button>' +
      '</div>' +
      '<p class="age-gate-note">Glücksspiel kann süchtig machen. Kostenlose Hilfe unter <a href="https://www.buwei.de" target="_blank" rel="noopener">buwei.de</a></p>' +
    '</div>';

  document.documentElement.classList.add("age-locked");
  document.body.appendChild(ov);

  ov.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-age]") : null;
    if (!btn) return;
    if (btn.getAttribute("data-age") === "yes") {
      try { localStorage.setItem("bet24now_age_ok", "1"); } catch (e2) {}
      document.documentElement.classList.remove("age-locked");
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    } else {
      window.location.href = "https://www.bzga.de/";
    }
  });
})();

// Werbeplatzierung: Top-Banner (alle Seiten) + Angebots-Box (Artikelseiten)
(function () {
  "use strict";
  if (document.querySelector(".promo-bar")) return;

  var CASINOS = [
    { name: "CrocoSlots", bonus: "8.000 € + 400 FS", bonusLong: "Bis 8.000 € + 400 Freispiele", url: "https://crocoslotsmedia.com/aevhr6rrq", logo: "/img/crocoslots-logo.svg?v=1" },
    { name: "BitKingz", bonus: "5.000 € + 500 FS", bonusLong: "Bis 5.000 € + 500 Freispiele", url: "https://www.bitkingzmedia.com/amhlwjvna", logo: "/img/bitkingz-logo.svg?v=1" }
  ];

  var css =
    ".promo-bar{background:rgba(10,12,20,.88);border-bottom:1px solid rgba(255,255,255,.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}" +
    ".promo-bar-inner{max-width:1180px;margin:0 auto;padding:9px 24px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;}" +
    ".promo-bar-label{color:#9ba3b4;font-weight:600;font-family:var(--font-head,sans-serif);font-size:13px;letter-spacing:.01em;}" +
    ".promo-chip{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#f2f4fa;padding:6px 8px 6px 14px;border-radius:999px;font-size:13px;font-weight:500;}" +
    ".promo-chip:hover{background:rgba(255,255,255,.07);border-color:rgba(53,224,161,.4);text-decoration:none;}" +
    ".promo-chip b{color:#fff;font-weight:650;}" +
    ".promo-go{color:#052117;background:linear-gradient(135deg,#43e9ac,#12b884);padding:4px 11px;border-radius:999px;font-weight:700;font-size:12px;}" +
    "@media(max-width:600px){.promo-bar-inner{gap:8px;padding:8px 14px;}.promo-bar-label{width:100%;text-align:center;}.promo-chip{font-size:12px;}}" +
    ".inline-offers{background:rgba(255,255,255,.026);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:26px 24px;margin:36px 0;box-shadow:0 18px 40px -22px rgba(0,0,0,.7);}" +
    ".inline-offers-title{margin:0 0 18px;text-align:center;font-family:var(--font-head,sans-serif);color:#fff;font-size:20px;letter-spacing:-.02em;}" +
    ".inline-offers-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}" +
    ".inline-offer{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:15px;padding:20px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;}" +
    ".inline-offer img{height:42px;width:auto;max-width:160px;object-fit:contain;}" +
    ".inline-offer-bonus{color:#35e0a1;font-weight:700;font-size:15px;}" +
    ".inline-offer .btn{width:100%;background:linear-gradient(135deg,#43e9ac,#12b884);color:#052117;font-weight:650;font-family:var(--font-head,sans-serif);padding:12px 16px;border-radius:12px;display:block;border:1px solid rgba(255,255,255,.14);}" +
    ".inline-offers-note{margin-top:16px;text-align:center;font-size:12px;color:#6b7285;}" +
    "@media(max-width:520px){.inline-offers-grid{grid-template-columns:1fr;}}";
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // 1) Top-Banner auf allen Seiten
  var bar = document.createElement("div");
  bar.className = "promo-bar";
  var chips = CASINOS.map(function (c) {
    return '<a class="promo-chip" href="' + c.url + '" target="_blank" rel="nofollow sponsored"><b>' + c.name + '</b> ' + c.bonus + ' <span class="promo-go">Sichern →</span></a>';
  }).join("");
  bar.innerHTML = '<div class="promo-bar-inner"><span class="promo-bar-label">🔥 Top-Casino-Boni 2026</span>' + chips + '</div>';
  document.body.insertBefore(bar, document.body.firstChild);

  // 2) Angebots-Box am Ende von Artikelseiten (mit .article)
  var article = document.querySelector(".article");
  if (article) {
    var offers = CASINOS.map(function (c) {
      return '<div class="inline-offer"><img src="' + c.logo + '" alt="' + c.name + '" loading="lazy"><div class="inline-offer-bonus">' + c.bonusLong + '</div><a class="btn" href="' + c.url + '" target="_blank" rel="nofollow sponsored">Bonus sichern →</a></div>';
    }).join("");
    var box = document.createElement("aside");
    box.className = "inline-offers";
    box.innerHTML = '<h3 class="inline-offers-title">Unsere Top-Casinos für 2026</h3><div class="inline-offers-grid">' + offers + '</div><div class="inline-offers-note">18+ · Glücksspiel kann süchtig machen · Hilfe unter buwei.de</div>';
    article.parentNode.insertBefore(box, article.nextSibling);
  }

  // Logo-Fallback: fehlt ein Casino-Logo (noch), wird der Name als Text gezeigt
  function logoFallback(img, name) {
    var fail = function () {
      if (img.getAttribute("data-fb")) return;
      img.setAttribute("data-fb", "1");
      var s = document.createElement("span");
      s.textContent = name;
      s.style.cssText = "font-family:var(--font-head,sans-serif);font-weight:800;font-size:22px;color:#fff;letter-spacing:-.01em;";
      if (img.parentNode) img.parentNode.replaceChild(s, img);
    };
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  }
  [].forEach.call(document.querySelectorAll("#top-casinos .casino-logo, .inline-offer img"), function (img) {
    logoFallback(img, img.getAttribute("alt") || "Casino");
  });
})();

// Cookie-Consent + Google Analytics (GA4) – GA startet erst nach Zustimmung
(function () {
  "use strict";
  var GA_ID = "G-Q2NP0XXZH2";
  var KEY = "bet24now_consent";

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === "granted") { loadGA(); return; }
  if (choice === "denied") { return; }

  var css =
    ".cookie-consent{position:fixed;left:0;right:0;bottom:0;z-index:9998;background:rgba(13,16,32,.98);border-top:1px solid var(--border,#2a3149);box-shadow:0 -8px 30px rgba(0,0,0,.45);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}" +
    ".cookie-consent-inner{max-width:1140px;margin:0 auto;padding:16px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:space-between;}" +
    ".cookie-consent-text{margin:0;color:var(--muted,#98a1bd);font-size:13.5px;line-height:1.55;flex:1;min-width:240px;}" +
    ".cookie-consent-text a{color:var(--gold,#ffc93c);}" +
    ".cookie-consent-actions{display:flex;gap:10px;flex-shrink:0;}" +
    ".cookie-btn{font-family:var(--font-head,sans-serif);font-weight:700;font-size:14px;padding:11px 22px;border-radius:10px;cursor:pointer;border:1px solid transparent;}" +
    ".cookie-accept{background:linear-gradient(135deg,#ffd75e,#f5a623);color:#1a1205;}" +
    ".cookie-decline{background:transparent;color:#eef1fa;border-color:#38416090;}" +
    "@media(max-width:600px){.cookie-consent-inner{flex-direction:column;align-items:stretch;gap:12px;}.cookie-consent-actions{justify-content:stretch;}.cookie-btn{flex:1;}}";
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var bar = document.createElement("div");
  bar.className = "cookie-consent";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-label", "Cookie-Einwilligung");
  bar.innerHTML =
    '<div class="cookie-consent-inner">' +
      '<p class="cookie-consent-text">Wir verwenden Cookies für anonyme Statistik (Google Analytics), um unsere Seite zu verbessern. Du entscheidest, ob wir das dürfen. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</p>' +
      '<div class="cookie-consent-actions">' +
        '<button type="button" class="cookie-btn cookie-decline" data-consent="deny">Ablehnen</button>' +
        '<button type="button" class="cookie-btn cookie-accept" data-consent="grant">Akzeptieren</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(bar);

  bar.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-consent]") : null;
    if (!b) return;
    var grant = b.getAttribute("data-consent") === "grant";
    try { localStorage.setItem(KEY, grant ? "granted" : "denied"); } catch (e2) {}
    if (bar.parentNode) bar.parentNode.removeChild(bar);
    if (grant) loadGA();
  });
})();

// Blog-Sidebar (Kategorien + neueste Beiträge) & Teilen-Leiste – nur auf Blog-Artikeln (/news-*)
(function () {
  "use strict";
  var article = document.querySelector(".article");
  var isBlogArticle = article && document.querySelector('.crumbs a[href="/news"]');
  if (!isBlogArticle) return;

  var wrap = document.querySelector("main.section > .wrap");
  if (!wrap) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var mo = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return parseInt(p[2], 10) + ". " + mo[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  // ---- Teilen-Leiste (unabhängig von den Daten, direkt unter dem Artikel) ----
  var ICON = {
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.5-1.5h1.6V4.6c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4.02v2.24H7.6V14h2.66v8h3.24z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.53 3H20.5l-6.48 7.4L21.5 21h-5.9l-4.62-6.04L5.7 21H2.72l6.93-7.92L2.5 3h6.04l4.18 5.52L17.53 3zm-1.04 16.2h1.64L7.6 4.72H5.85L16.49 19.2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.02 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35c1.46.8 3.1 1.22 4.86 1.22 5.5 0 9.96-4.46 9.96-9.96S17.52 2 12.02 2zm0 18.13c-1.55 0-3.07-.42-4.4-1.2l-.32-.19-3.06.8.82-2.98-.2-.33a8.13 8.13 0 0 1-1.25-4.35c0-4.5 3.66-8.16 8.17-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.51-3.66 8.17-8.16 8.17zm4.48-6.11c-.25-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.44-.06-.13-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.19 3.7.58.26 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1zm9 7.09 8-5.09H4l8 5.09zM4 8.24V18h16V8.24l-8 5.09-8-5.09z"/></svg>'
  };
  var canonical = document.querySelector('link[rel="canonical"]');
  var shareUrl = canonical ? canonical.href : window.location.href;
  var shareTitle = (document.title || "").replace(/\s*[|·]\s*Bet24Now\s*$/, "").trim();
  var eu = encodeURIComponent(shareUrl), et = encodeURIComponent(shareTitle);

  function shareBtn(net, label, href) {
    var t = net === "email" ? "" : ' target="_blank" rel="noopener"';
    return '<a class="share-btn share-' + net + '" href="' + href + '" aria-label="' + label + '" title="' + label + '"' + t + ">" + ICON[net] + "</a>";
  }
  var shareBar = document.createElement("div");
  shareBar.className = "share-bar";
  shareBar.innerHTML =
    '<span class="share-title">Teilen</span>' +
    '<div class="share-btns">' +
      shareBtn("facebook", "Auf Facebook teilen", "https://www.facebook.com/sharer/sharer.php?u=" + eu) +
      shareBtn("x", "Auf X teilen", "https://twitter.com/intent/tweet?url=" + eu + "&text=" + et) +
      shareBtn("whatsapp", "Per WhatsApp teilen", "https://api.whatsapp.com/send?text=" + et + "%20" + eu) +
      shareBtn("email", "Per E-Mail teilen", "mailto:?subject=" + et + "&body=" + eu) +
    "</div>";
  article.parentNode.insertBefore(shareBar, article.nextSibling);

  // ---- Zwei-Spalten-Layout + Sidebar aus blog-index.json (dynamisch) ----
  function restructure() {
    if (wrap.classList.contains("blog-wrap")) return wrap._aside;
    var col = document.createElement("div");
    col.className = "blog-main";
    while (wrap.firstChild) col.appendChild(wrap.firstChild);
    wrap.appendChild(col);
    var aside = document.createElement("aside");
    aside.className = "blog-sidebar";
    aside.setAttribute("aria-label", "Kategorien und neueste Beiträge");
    wrap.appendChild(aside);
    wrap.style.maxWidth = "";
    wrap.classList.add("blog-wrap");
    wrap._aside = aside;
    return aside;
  }

  fetch("/blog-index.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !data.posts) return;
      var here = window.location.pathname.replace(/\/$/, "");
      var aside = restructure();

      var cats = (data.categories || []).map(function (c) {
        return '<li><a href="/news?cat=' + encodeURIComponent(c.name) + '">' +
          '<span class="cat-name">' + esc(c.name) + "</span>" +
          '<span class="cat-badge">' + c.count + "</span></a></li>";
      }).join("");
      var catCard = '<div class="side-card"><h2 class="side-title">Kategorien</h2><ul class="cat-list">' + cats + "</ul></div>";

      var latest = data.posts.filter(function (p) {
        return p.url.replace(/\/$/, "") !== here;
      }).slice(0, 6).map(function (p) {
        return '<a class="side-post" href="' + p.url + '">' +
          '<img src="' + p.image + '" alt="" width="66" height="50" loading="lazy">' +
          '<div class="side-post-body">' +
            '<p class="side-post-title">' + esc(p.title) + "</p>" +
            '<span class="side-post-date">' + fmtDate(p.date) + "</span>" +
          "</div></a>";
      }).join("");
      var postCard = '<div class="side-card"><h2 class="side-title">Neueste Beiträge</h2><div class="side-posts">' + latest + "</div></div>";

      aside.innerHTML = catCard + postCard;
    })
    .catch(function () {});
})();

// Kategorie-Filter auf der /news-Übersicht (?cat=…)
(function () {
  "use strict";
  var grid = document.querySelector(".grid-news");
  if (!grid) return;
  var cat = new URLSearchParams(window.location.search).get("cat");
  if (!cat) return;
  var want = cat.trim().toLowerCase();
  var shown = 0;
  [].forEach.call(grid.querySelectorAll(".news-card"), function (card) {
    var el = card.querySelector(".news-cat");
    var c = el ? el.textContent.trim().toLowerCase() : "";
    if (c === want) { card.style.display = ""; shown++; }
    else { card.style.display = "none"; }
  });
  var note = document.createElement("div");
  note.className = "cat-filter-note";
  note.innerHTML = "Gefiltert nach Kategorie: <strong>" +
    cat.replace(/[<>&"]/g, "") + "</strong> (" + shown + " Beiträge) · <a href=\"/news\">Alle Beiträge anzeigen</a>";
  var lead = document.querySelector(".section-lead") || document.querySelector("h1");
  if (lead && lead.parentNode) lead.parentNode.insertBefore(note, lead.nextSibling);
})();
