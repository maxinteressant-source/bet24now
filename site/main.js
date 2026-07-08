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
    ".card, .feature, .mini-card, .news-card, .usp, figure.article-img, table.compare, .rating-box"
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
    { name: "CrocoSlots", bonus: "8.000 € + 400 FS", bonusLong: "Bis 8.000 € + 400 Freispiele", url: "https://crocoslotsmedia.com/aevhr6rrq", logo: "/img/crocoslots-logo.svg" },
    { name: "BitKingz", bonus: "5.000 € + 500 FS", bonusLong: "Bis 5.000 € + 500 Freispiele", url: "https://www.bitkingzmedia.com/amhlwjvna", logo: "/img/bitkingz-logo.png" }
  ];

  var css =
    ".promo-bar{background:linear-gradient(90deg,#1a1205,#2a1c05);border-bottom:1px solid rgba(255,201,60,.35);}" +
    ".promo-bar-inner{max-width:1140px;margin:0 auto;padding:9px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;}" +
    ".promo-bar-label{color:var(--gold,#ffc93c);font-weight:800;font-family:var(--font-head,sans-serif);font-size:14px;}" +
    ".promo-chip{display:inline-flex;align-items:center;gap:8px;background:rgba(255,201,60,.1);border:1px solid rgba(255,201,60,.4);color:#fff;padding:6px 8px 6px 13px;border-radius:999px;font-size:13px;font-weight:600;}" +
    ".promo-chip:hover{background:rgba(255,201,60,.18);text-decoration:none;}" +
    ".promo-chip b{color:var(--gold,#ffc93c);}" +
    ".promo-go{color:#1a1205;background:linear-gradient(135deg,#ffd75e,#f5a623);padding:3px 9px;border-radius:999px;font-weight:800;font-size:12px;}" +
    "@media(max-width:600px){.promo-bar-inner{gap:8px;padding:8px 12px;}.promo-bar-label{width:100%;text-align:center;}.promo-chip{font-size:12px;}}" +
    ".inline-offers{background:linear-gradient(180deg,var(--panel-2,#1b2035),var(--panel,#141829));border:1px solid rgba(255,201,60,.35);border-radius:14px;padding:22px 20px;margin:34px 0;box-shadow:0 6px 18px rgba(0,0,0,.3);}" +
    ".inline-offers-title{margin:0 0 16px;text-align:center;font-family:var(--font-head,sans-serif);color:#fff;font-size:20px;}" +
    ".inline-offers-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}" +
    ".inline-offer{background:var(--panel,#141829);border:1px solid var(--border,#2a3149);border-radius:12px;padding:18px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:11px;}" +
    ".inline-offer img{height:42px;width:auto;max-width:160px;object-fit:contain;}" +
    ".inline-offer-bonus{color:var(--green,#2fd08a);font-weight:700;font-size:15px;}" +
    ".inline-offer .btn{width:100%;background:linear-gradient(135deg,#ffd75e,#f5a623);color:#1a1205;font-weight:700;font-family:var(--font-head,sans-serif);padding:12px 16px;border-radius:10px;display:block;}" +
    ".inline-offers-note{margin-top:14px;text-align:center;font-size:12px;color:var(--muted,#98a1bd);}" +
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
