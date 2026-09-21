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

  // Das Einblenden jeder Karte beim Scrollen ist mit Design v3 entfallen:
  // Bewegung gibt es nur noch einmal, beim Austeilen der Karten auf der Startseite.
})();

// Alters-Verifizierung (18+) – eigenständig, inkl. eigenem Styling
(function () {
  "use strict";
  try { if (localStorage.getItem("bet24now_age_ok") === "1") return; } catch (e) {}

  var css =
    "html.age-locked{overflow:hidden;}" +
    ".age-gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;" +
    "background:rgba(10,12,15,.93);-webkit-backdrop-filter:blur(12px) saturate(.75);backdrop-filter:blur(12px) saturate(.75);" +
    "animation:age-auf 220ms cubic-bezier(.23,1,.32,1) both;}" +
    "@keyframes age-auf{from{opacity:0}to{opacity:1}}" +
    "@keyframes age-herein{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}" +
    ".age-gate-box{position:relative;overflow:hidden;background:var(--nacht-2,#101319);color:var(--kreide,#F3F5F7);" +
    "border:1px solid var(--linie-2,rgba(255,255,255,.14));border-radius:var(--r-gross,4px);" +
    "box-shadow:0 1px 0 rgba(255,255,255,.07) inset,0 40px 80px -30px #000;" +
    "max-width:440px;width:100%;padding:34px 30px 28px;text-align:left;" +
    "animation:age-herein 420ms cubic-bezier(.23,1,.32,1) both;}" +
    // Ein Lichtstrich auf der Oberkante. Auf schwarzem Grund traegt Licht,
    // nicht Schatten: der Kasten loest sich ab, ohne einen dicken Rahmen.
    ".age-gate-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;" +
    "background:linear-gradient(90deg,transparent,var(--jade,#2BE8A5),transparent);opacity:.6;}" +
    ".age-gate-logo{font-family:var(--font-display,Georgia,serif);font-weight:800;font-size:19px;letter-spacing:-.02em;color:var(--kreide,#F3F5F7);margin-bottom:24px;}" +
    ".age-gate-logo span{color:var(--jade,#2BE8A5);}" +
    // Kein Kreis mehr, sondern dieselbe Kapsel wie die Marker im Text.
    ".age-gate-badge{display:inline-flex;align-items:center;width:auto;height:auto;padding:5px 13px 4px;margin-bottom:18px;" +
    "border:1px solid var(--jade,#2BE8A5);border-radius:999px;background:transparent;box-shadow:none;" +
    "font-family:var(--font-mono,ui-monospace,monospace);font-weight:500;font-size:11.5px;letter-spacing:.14em;color:var(--jade,#2BE8A5);}" +
    ".age-gate-box h2{font-family:var(--font-display,Georgia,serif);color:var(--kreide,#F3F5F7);font-size:clamp(25px,6vw,31px);line-height:1.1;letter-spacing:-.025em;margin:0 0 12px;}" +
    ".age-gate-box p{color:var(--kreide-2,#A7B1BC);margin:0 0 26px;font-size:16px;line-height:1.62;}" +
    ".age-gate-actions{display:flex;flex-direction:column;gap:10px;}" +
    ".age-gate-actions button{width:100%;font-family:var(--font-text,sans-serif);font-weight:600;font-size:16px;padding:14px 22px;" +
    "border-radius:999px;cursor:pointer;border:1px solid transparent;" +
    "transition:background 180ms ease,color 180ms ease,border-color 180ms ease,transform 130ms cubic-bezier(.23,1,.32,1);}" +
    ".age-gate-actions button:active{transform:scale(.97);}" +
    ".age-gate-actions button:focus-visible{outline:2px solid var(--jade,#2BE8A5);outline-offset:3px;}" +
    ".age-gate-yes{background:var(--jade,#2BE8A5);color:var(--nacht,#0A0C0F);}" +
    ".age-gate-no{background:transparent;color:var(--kreide-2,#A7B1BC);border-color:var(--linie-2,rgba(255,255,255,.14));}" +
    "@media(hover:hover) and (pointer:fine){" +
    ".age-gate-yes:hover{background:var(--jade-2,#7CF3C8);}" +
    ".age-gate-no:hover{color:var(--kreide,#F3F5F7);border-color:rgba(255,255,255,.26);}}" +
    ".age-gate-note{margin:24px 0 0!important;padding-top:18px;border-top:1px solid rgba(255,255,255,.075);" +
    "font-size:13.5px!important;line-height:1.55;color:var(--kreide-3,#6C7783);}" +
    ".age-gate-note a{color:var(--kreide-2,#A7B1BC);}" +
    "@media(prefers-reduced-motion:reduce){.age-gate,.age-gate-box{animation:none;}}" +
    "@media(max-width:440px){.age-gate-box{padding:28px 20px 24px;}}";
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

  if (document.querySelector(".age-gate")) return;
  document.documentElement.classList.add("age-locked");
  document.body.appendChild(ov);
  var ageYes = ov.querySelector(".age-gate-yes"); if (ageYes) ageYes.focus();

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
  // Werbefreier Bereich: Seiten mit data-werbefrei am html-Element bekommen
  // weder das Top-Banner noch die Angebotsbox. Das betrifft den gesamten
  // Spielerschutz-Bereich, damit er ohne Werbung zitierbar bleibt.
  if (document.documentElement.hasAttribute("data-werbefrei")) return;

  var CASINOS = [
    { name: "ShinyWilds", bonus: "1.000 € + 250 FS", bonusLong: "Bis 1.000 € + 250 Freispiele", note: "30x Umsatz", url: "https://partners.shinywildpartners.com/v2/text/28/9/852a697f-7a50-11f1-8d87-cad21936ea85/1", logo: "/img/shinywilds-logo.png?v=1", featured: true },
    { name: "CrocoSlots", bonus: "8.000 € + 400 FS", bonusLong: "Bis 8.000 € + 400 Freispiele", url: "https://crocoslotsmedia.com/aevhr6rrq", logo: "/img/crocoslots-logo.svg?v=1" },
    { name: "BitKingz", bonus: "5.000 € + 500 FS", bonusLong: "Bis 5.000 € + 500 Freispiele", url: "https://www.bitkingzmedia.com/amhlwjvna", logo: "/img/bitkingz-logo.svg?v=1" }
  ];

  var css =
    // Die Leiste sitzt ueber dem Kopf und ist dessen Sockel: reines Schwarz,
    // eine Haarlinie als Abschluss, sonst nichts.
    ".promo-bar{background:var(--nacht,#0A0C0F);border-bottom:1px solid rgba(255,255,255,.075);height:44px;}" +
    // Nie umbrechen: bei mittleren Breiten (Tablet, kleines Notebook) ergaben
    // zwei Zeilen 90px Hoehe, waehrend body nur 48px reserviert - die zweite
    // Zeile schob sich unter den Header. Stattdessen einzeilig und scrollbar.
    // "safe center" zentriert nur, solange nichts ueberlaeuft; sonst wuerde
    // der linke Rand unerreichbar abgeschnitten.
    ".promo-bar-inner{max-width:1340px;margin:0 auto;padding:6px 24px;display:flex;align-items:center;gap:8px;" +
    "flex-wrap:nowrap;overflow-x:auto;justify-content:center;justify-content:safe center;" +
    "scrollbar-width:none;-ms-overflow-style:none;}" +
    ".promo-bar-inner::-webkit-scrollbar{display:none;}" +
    ".promo-chip{flex:0 0 auto;}" +
    // flex:0 0 auto, sonst staucht der Flex-Container das Label bei knappem
    // Platz auf wenige Zeichen Breite und der Text bricht mehrzeilig um -
    // genau das machte die Leiste bei 1024px 83px statt 48px hoch.
    ".promo-bar-label{flex:0 0 auto;white-space:nowrap;color:var(--kreide-3,#6C7783);" +
    "font-family:var(--font-mono,ui-monospace,monospace);font-weight:500;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;}" +
    ".promo-chip{display:inline-flex;align-items:center;gap:9px;background:transparent;" +
    "border:1px solid rgba(255,255,255,.14);color:var(--kreide-2,#A7B1BC);padding:4px 5px 4px 12px;" +
    "border-radius:3px;font-size:13.5px;font-weight:500;" +
    "transition:border-color 180ms ease,color 180ms ease,background 180ms ease;}" +
    ".promo-chip b{color:var(--kreide,#F3F5F7);font-weight:600;}" +
    ".promo-chip.is-featured{border-color:rgba(43,232,165,.45);}" +
    "@media(hover:hover) and (pointer:fine){.promo-chip:hover{background:rgba(43,232,165,.08);border-color:rgba(43,232,165,.6);text-decoration:none;color:var(--kreide,#F3F5F7);}}" +
    ".promo-star{color:var(--jade,#2BE8A5);font-size:12px;margin-right:-3px;}" +
    ".promo-note{color:var(--kreide-3,#6C7783);font-family:var(--font-mono,ui-monospace,monospace);font-size:11px;letter-spacing:.04em;}" +
    ".promo-go{color:var(--nacht,#0A0C0F);background:var(--jade,#2BE8A5);padding:3px 11px;border-radius:999px;" +
    "font-family:var(--font-mono,ui-monospace,monospace);font-weight:500;font-size:11px;letter-spacing:.1em;}" +
    "@media(max-width:600px){.promo-bar-inner{gap:6px;padding:6px 12px;flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;scrollbar-width:none;-ms-overflow-style:none;}"+
    ".promo-bar-inner::-webkit-scrollbar{display:none;}.promo-bar-label{display:none;}.promo-chip{font-size:13px;flex:0 0 auto;}" +
    // Am rechten Rand ausblenden: das ist das einzige Zeichen dafuer, dass
    // die Leiste weitergeht. Eine Bildlaufleiste zeigt der Browser hier nicht.
    ".promo-bar-inner{-webkit-mask-image:linear-gradient(90deg,#000 0,#000 calc(100% - 26px),transparent 100%);" +
    "mask-image:linear-gradient(90deg,#000 0,#000 calc(100% - 26px),transparent 100%);}}" +
    // Angebotsbox unter dem Artikel: dasselbe Datenblatt wie die Karten auf
    // der Startseite, damit unter dem Text kein fremder Baustein auftaucht.
    ".inline-offers{background:var(--nacht-2,#101319);border:1px solid rgba(255,255,255,.075);border-radius:4px;padding:26px 22px 22px;margin:54px 0 8px;}" +
    ".inline-offers-title{display:flex;align-items:center;gap:12px;margin:0 0 20px;text-align:left;" +
    "font-family:var(--font-mono,ui-monospace,monospace);font-weight:500;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--kreide-3,#6C7783);}" +
    ".inline-offers-title::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.14);}" +
    ".inline-offers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}" +
    ".inline-offer{position:relative;background:var(--nacht-3,#161A21);border:1px solid rgba(255,255,255,.075);border-radius:3px;overflow:hidden;" +
    "text-align:left;display:flex;flex-direction:column;align-items:stretch;box-shadow:none;" +
    "transition:border-color 180ms ease,transform 180ms cubic-bezier(.23,1,.32,1);}" +
    "@media(hover:hover) and (pointer:fine){.inline-offer:hover{border-color:rgba(255,255,255,.26);transform:translateY(-2px);}}" +
    ".inline-offer.is-featured{border-color:rgba(43,232,165,.45);box-shadow:none;}" +
    ".inline-offer-plate{background:var(--nacht,#0A0C0F);border-bottom:1px solid rgba(255,255,255,.075);display:grid;place-items:center;height:74px;padding:12px;}" +
    ".inline-offer-tag{position:absolute;top:8px;right:8px;background:var(--nacht,#0A0C0F);border:1px solid var(--jade,#2BE8A5);color:var(--jade,#2BE8A5);" +
    "font-family:var(--font-mono,ui-monospace,monospace);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:500;" +
    "padding:3px 8px;border-radius:999px;white-space:nowrap;}" +
    ".inline-offer img{height:40px;width:auto;max-width:150px;object-fit:contain;filter:brightness(.92) contrast(1.06);}" +
    ".inline-offer img.is-square{height:50px;max-width:50px;}" +
    ".inline-offer-bonus{color:var(--kreide,#F3F5F7);font-family:var(--font-display,Georgia,serif);font-weight:700;letter-spacing:-.02em;font-size:19px;line-height:1.15;padding:16px 15px 0;}" +
    ".inline-offer-note{color:var(--kreide-3,#6C7783);font-family:var(--font-mono,ui-monospace,monospace);font-size:11px;letter-spacing:.04em;padding:7px 15px 0;}" +
    ".inline-offer .btn{margin:16px 15px;display:block;white-space:normal;}" +
    ".inline-offers-note{margin-top:18px;text-align:left;font-size:13px;line-height:1.5;color:var(--kreide-3,#6C7783);}" +
    "@media(max-width:760px){.inline-offers-grid{grid-template-columns:1fr;gap:12px;}}";
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // 1) Top-Banner auf allen Seiten
  var bar = document.createElement("div");
  bar.className = "promo-bar";
  var chips = CASINOS.map(function (c) {
    return '<a class="promo-chip' + (c.featured ? " is-featured" : "") + '" href="' + c.url + '" target="_blank" rel="nofollow sponsored noopener">' +
      (c.featured ? '<span class="promo-star" aria-hidden="true">★</span>' : "") +
      '<b>' + c.name + '</b> ' + c.bonus +
      (c.note ? ' <span class="promo-note">' + c.note + '</span>' : "") +
      ' <span class="promo-go">Zum Angebot</span></a>';
  }).join("");
  bar.innerHTML = '<div class="promo-bar-inner"><span class="promo-bar-label">Unsere Top 3</span>' + chips + '</div>';
  // Hinter den Sprunglink, nicht davor: sonst waere die Werbeleiste die erste
  // Station beim Tabben und der Sprunglink verloere seinen Zweck.
  var sprung = document.querySelector(".sprunglink");
  document.body.insertBefore(bar, sprung ? sprung.nextSibling : document.body.firstChild);

  // 2) Angebots-Box am Ende von Artikelseiten (mit .article)
  var article = document.querySelector(".article");
  if (article) {
    var offers = CASINOS.map(function (c) {
      return '<div class="inline-offer' + (c.featured ? " is-featured" : "") + '">' +
        (c.featured ? '<span class="inline-offer-tag">Testsieger</span>' : "") +
        '<div class="inline-offer-plate"><img class="' + (/\.png(\?|$)/.test(c.logo) ? "is-square" : "") + '" src="' + c.logo + '" alt="' + c.name + '" loading="lazy"></div>' +
        '<div class="inline-offer-bonus">' + c.bonusLong + '</div>' +
        (c.note ? '<div class="inline-offer-note">' + c.note + '</div>' : "") +
        '<a class="btn" href="' + c.url + '" target="_blank" rel="nofollow sponsored noopener">Bonus sichern</a></div>';
    }).join("");
    var box = document.createElement("aside");
    box.className = "inline-offers";
    box.innerHTML = '<h3 class="inline-offers-title">Unsere Top-Casinos 2026</h3><div class="inline-offers-grid">' + offers + '</div><div class="inline-offers-note">Nur ab 18. Glücksspiel kann süchtig machen, Hilfe gibt es unter buwei.de.</div>';
    article.parentNode.insertBefore(box, article.nextSibling);
  }

  // Logo-Fallback: fehlt ein Casino-Logo (noch), wird der Name als Text gezeigt
  function logoFallback(img, name) {
    var fail = function () {
      if (img.getAttribute("data-fb")) return;
      img.setAttribute("data-fb", "1");
      var s = document.createElement("span");
      s.textContent = name;
      s.style.cssText = "font-family:var(--font-display,sans-serif);font-weight:800;font-size:22px;color:var(--kreide,#F3F5F7);letter-spacing:-.02em;";
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
    "@keyframes cc-herauf{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:none}}" +
    ".cookie-consent{position:fixed;left:0;right:0;bottom:0;z-index:9998;" +
    "background:rgba(16,19,25,.93);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);" +
    "border-top:1px solid rgba(255,255,255,.14);box-shadow:0 -30px 60px -30px #000;" +
    "animation:cc-herauf 420ms cubic-bezier(.23,1,.32,1) both;}" +
    "@media(prefers-reduced-motion:reduce){.cookie-consent{animation:none;}}" +
    ".cookie-consent-inner{max-width:1340px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;justify-content:space-between;}" +
    ".cookie-consent-text{margin:0;color:var(--kreide-2,#A7B1BC);font-size:14.5px;line-height:1.55;flex:1;min-width:240px;}" +
    ".cookie-consent-text a{color:var(--jade,#2BE8A5);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}" +
    ".cookie-consent-actions{display:flex;gap:10px;flex-shrink:0;}" +
    // Beide Wahlmoeglichkeiten gleich gross und gleich gut erreichbar.
    ".cookie-btn{font-family:var(--font-text,sans-serif);font-weight:600;font-size:15px;padding:11px 24px;border-radius:999px;cursor:pointer;" +
    "border:1px solid transparent;transition:background 180ms ease,color 180ms ease,border-color 180ms ease,transform 130ms cubic-bezier(.23,1,.32,1);}" +
    ".cookie-btn:active{transform:scale(.97);}" +
    ".cookie-btn:focus-visible{outline:2px solid var(--jade,#2BE8A5);outline-offset:3px;}" +
    ".cookie-accept{background:var(--jade,#2BE8A5);color:var(--nacht,#0A0C0F);}" +
    ".cookie-decline{background:transparent;color:var(--kreide-2,#A7B1BC);border-color:rgba(255,255,255,.14);}" +
    "@media(hover:hover) and (pointer:fine){.cookie-accept:hover{background:var(--jade-2,#7CF3C8);}" +
    ".cookie-decline:hover{color:var(--kreide,#F3F5F7);border-color:rgba(255,255,255,.26);}}" +
    "@media(max-width:600px){.cookie-consent-inner{flex-direction:column;align-items:stretch;gap:12px;padding:16px;}.cookie-consent-actions{justify-content:stretch;}.cookie-btn{flex:1;}}";
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  var bar = document.createElement("div");
  bar.className = "cookie-consent";
  if (document.querySelector(".cookie-consent")) return;
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
  // Aktiv auf Blog-Artikeln (/news-*) und Ratgeber-Guides (/ratgeber-*),
  // erkennbar am Breadcrumb-Link zur jeweiligen Uebersicht. Die Uebersichts-
  // seiten selbst (/news, /ratgeber) haben dort nur einen <span> und sind ausgenommen.
  var isBlogArticle = article && (
    document.querySelector('.crumbs a[href="/news"]') ||
    document.querySelector('.crumbs a[href="/ratgeber"]')
  );
  if (!isBlogArticle) return;

  var wrap = document.querySelector("main.section > .wrap");
  if (!wrap) return;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function themaSlug(n) {
    return String(n).toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var mo = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    var mn = mo[parseInt(p[1], 10) - 1]; if (!mn) return iso; return parseInt(p[2], 10) + ". " + mn + " " + p[0];
  }

  // ---- Teilen-Leiste (unabhängig von den Daten, direkt unter dem Artikel) ----
  if (document.querySelector(".share-bar")) return;
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

  // Sofort umbauen, nicht erst nach dem Laden der Daten: sonst springt der
  // ganze Artikel sichtbar von einer mittigen Spalte in das Raster.
  var sideSlot = restructure();

  fetch("/blog-index.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !data.posts) return;
      var norm = function (u) { return String(u).replace(/\.html$/, "").replace(/\/$/, ""); };
      var here = norm(window.location.pathname);
      var aside = restructure();

      var cats = (data.categories || []).map(function (c) {
        return '<li><a href="/news#thema-' + themaSlug(c.name) + '">' +
          '<span class="cat-name">' + esc(c.name) + "</span>" +
          '<span class="cat-badge">' + c.count + "</span></a></li>";
      }).join("");
      var catCard = '<div class="side-card"><h2 class="side-title">Kategorien</h2><ul class="cat-list">' + cats + "</ul></div>";

      var latest = data.posts.filter(function (p) {
        return norm(p.url) !== here;
      }).slice(0, 6).map(function (p) {
        return '<a class="side-post" href="' + esc(p.url) + '">' +
          '<img src="' + esc(p.image) + '" alt="" width="66" height="50" loading="lazy">' +
          '<div class="side-post-body">' +
            '<p class="side-post-title">' + esc(p.title) + "</p>" +
            '<span class="side-post-date">' + fmtDate(p.date) + "</span>" +
          "</div></a>";
      }).join("");
      var postCard = '<div class="side-card"><h2 class="side-title">Neueste Beiträge</h2><div class="side-posts">' + latest + "</div></div>";

      // Anhaengen statt ersetzen: in der Leiste kann bereits das
      // mitlaufende Inhaltsverzeichnis stehen, das synchron aufgebaut wird,
      // waehrend diese Daten noch geladen werden. innerHTML haette es
      // stillschweigend geloescht.
      aside.insertAdjacentHTML("beforeend", catCard + postCard);
    })
    .catch(function () {});
})();

// Alte Kategorie-Links (/news?cat=…) auf den Abschnitt der Magazin-Seite lenken.
// Die Seite ist seit Design v3 nach Kategorien gegliedert, gefiltert wird nicht mehr.
(function () {
  "use strict";
  var cat = new URLSearchParams(window.location.search).get("cat");
  if (!cat) return;
  var slug = cat.trim().toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  var el = document.getElementById("thema-" + slug);
  if (el) el.scrollIntoView();
})();

// ============================================================
// Conversion-Tracking: Affiliate-Klicks und Lese-Engagement (GA4)
// Sendet erst, wenn gtag existiert, also nach erteilter Cookie-Einwilligung.
// ============================================================
(function () {
  "use strict";

  var AFFILIATE_HOSTS = [
    "partners.shinywildpartners.com",
    "crocoslotsmedia.com",
    "bitkingzmedia.com"
  ];

  function send(name, params) {
    if (typeof window.gtag !== "function") return;
    try { window.gtag("event", name, params); } catch (e) {}
  }

  function isAffiliate(a) {
    var rel = (a.getAttribute("rel") || "").toLowerCase();
    if (rel.indexOf("sponsored") > -1) return true;
    var host = "";
    try { host = new URL(a.href, location.href).hostname.replace(/^www\./, ""); } catch (e) { return false; }
    for (var i = 0; i < AFFILIATE_HOSTS.length; i++) {
      if (host === AFFILIATE_HOSTS[i] || host.indexOf("." + AFFILIATE_HOSTS[i]) > -1) return true;
    }
    return false;
  }

  // Aus welchem Seitenbereich kam der Klick? Das entscheidet, welche Platzierung sich lohnt.
  function placement(a) {
    if (a.closest(".promo-bar")) return "promobar";
    if (a.closest(".inline-offers")) return "angebotsbox";
    if (a.closest(".preview-card")) return "hero";
    if (a.closest(".ccard")) return "toplist";
    if (a.closest(".card")) return "reviews_liste";
    if (a.closest(".rating-box") || a.closest(".offer-box")) return "review_box";
    if (a.closest(".article")) return "artikel_text";
    return "sonstige";
  }

  // Casino-Name: bevorzugt aus dem Linktext oder dem Logo-Alt in der Umgebung
  function casinoName(a) {
    var host = "";
    try { host = new URL(a.href, location.href).hostname.replace(/^www\./, ""); } catch (e) {}
    if (host.indexOf("shinywild") > -1) return "ShinyWilds";
    if (host.indexOf("crocoslots") > -1) return "CrocoSlots";
    if (host.indexOf("bitkingz") > -1) return "BitKingz";
    var box = a.closest(".ccard, .card, .inline-offer, .preview-card, .promo-chip");
    var img = box && box.querySelector("img[alt]");
    if (img && img.alt) return img.alt.trim();
    var b = box && box.querySelector("b");
    if (b && b.textContent) return b.textContent.trim().slice(0, 40);
    return host || "unbekannt";
  }

  function onClick(e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;

    if (isAffiliate(a)) {
      send("affiliate_click", {
        casino: casinoName(a),
        placement: placement(a),
        link_url: a.href,
        page_path: location.pathname
      });
      return;
    }

    // Klick auf einen internen Review-Link zeigt Kaufabsicht, auch ohne Ausleitung
    var href = a.getAttribute("href") || "";
    if (href.indexOf("/review-") === 0) {
      send("review_click", {
        review: href.replace("/review-", ""),
        placement: placement(a),
        page_path: location.pathname
      });
    }
  }

  document.addEventListener("click", onClick, true);
  document.addEventListener("auxclick", function (e) { if (e.button === 1) onClick(e); }, true);

  // Lese-Engagement: meldet einmal pro Seite, dass der Artikel wirklich gelesen wurde.
  // 50 % Scrolltiefe UND mindestens 30 Sekunden auf der Seite.
  (function () {
    var article = document.querySelector(".article");
    if (!article) return;
    var deep = false, longEnough = false, fired = false;

    setTimeout(function () { longEnough = true; maybe(); }, 30000);

    function maybe() {
      if (fired || !deep || !longEnough) return;
      fired = true;
      send("artikel_gelesen", { page_path: location.pathname });
      window.removeEventListener("scroll", onScroll);
    }
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && (window.scrollY / h) >= 0.5) { deep = true; maybe(); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();
})();

// ============================================================
// Bewegung: Eintritt beim Scrollen, Leseband, Menue mit Escape
// Reine Ergaenzung. Faellt dieser Block aus, bleibt die Seite vollstaendig
// benutzbar, nur ohne Bewegung.
// ============================================================
(function () {
  "use strict";
  var wurzel = document.documentElement;
  var sanft = window.matchMedia("(prefers-reduced-motion: reduce)");

  // --- Eintritt beim Scrollen -------------------------------------------
  // Das macht CSS allein ueber scroll-getriebene Animationen (animation-timeline).
  // Fruehere Fassung hier: IntersectionObserver, der Flaechen auf opacity:0
  // setzte und beim Eintritt wieder aufdeckte. Das hat einen Konstruktionsfehler:
  // faellt das Skript aus, bleibt der Inhalt unsichtbar. Bei einer Seite, deren
  // Produkt der Text ist, ist das der teuerste denkbare Fehler.
  // Mit animation-timeline kehrt sich das um: kennt der Browser die Eigenschaft
  // nicht, laeuft einfach keine Animation und alles ist von Anfang an sichtbar.
  // Dazu laeuft es ausserhalb des Hauptthreads und kostet kein JavaScript.

  // --- Leseband ----------------------------------------------------------
  // Nur auf Seiten mit Fliesstext, und nur wenn es dort etwas zu scrollen gibt.
  var artikel = document.querySelector(".article");
  if (artikel && document.body.scrollHeight > window.innerHeight * 1.6 && !sanft.matches) {
    var band = document.createElement("div");
    band.className = "leseband";
    band.setAttribute("aria-hidden", "true");
    document.body.appendChild(band);

    var kannZeitachse = window.CSS && CSS.supports && CSS.supports("animation-timeline", "scroll()");
    if (kannZeitachse) {
      // Der Browser rechnet selbst, ausserhalb des Hauptthreads.
      wurzel.classList.add("hat-scrollzeitachse");
    } else {
      var laeuft = false;
      var rechnen = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? window.scrollY / max : 0;
        band.style.setProperty("--fortschritt", Math.min(1, Math.max(0, p)).toFixed(4));
        laeuft = false;
      };
      window.addEventListener("scroll", function () {
        if (laeuft) return;
        laeuft = true;
        requestAnimationFrame(rechnen);
      }, { passive: true });
      rechnen();
    }
  }

  // --- Menue mit Escape schliessen ---------------------------------------
  var kopf = document.querySelector(".site-header");
  var schalter = document.querySelector(".nav-toggle");
  if (kopf && schalter) {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !kopf.classList.contains("nav-open")) return;
      kopf.classList.remove("nav-open");
      schalter.setAttribute("aria-expanded", "false");
      schalter.setAttribute("aria-label", "Menü öffnen");
      schalter.focus();
    });
  }
})();

// ============================================================
// Mitlaufendes Inhaltsverzeichnis in der Seitenleiste
// Artikel hier sind 2.500 bis 4.000 Woerter lang. Ein Verzeichnis, das
// mitlaeuft und den aktuellen Abschnitt markiert, ist bei dieser Laenge der
// groesste Nutzengewinn der Vorlage.
// Die Positionen werden einmal vermessen und bei Groessenaenderung neu. Das
// vermeidet ein Neuberechnen des Layouts in jedem Scroll-Bild.
// ============================================================
(function () {
  "use strict";
  var artikel = document.querySelector(".blog-main .article, .article");
  var leiste = document.querySelector(".blog-sidebar");
  if (!artikel || !leiste) return;

  var titel = [].slice.call(artikel.querySelectorAll("h2[id]")).filter(function (h) {
    return h.id !== "toc" && h.textContent.trim().length > 1;
  });
  if (titel.length < 3) return;

  var karte = document.createElement("nav");
  karte.className = "side-card side-toc";
  karte.setAttribute("aria-label", "Inhalt dieses Beitrags");
  var html = '<p class="side-title">Inhalt</p><ol class="toc-liste">';
  titel.forEach(function (h) {
    var t = h.textContent.replace(/\s+/g, " ").trim();
    html += '<li><a href="#' + h.id + '">' + t.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    }) + "</a></li>";
  });
  karte.innerHTML = html + "</ol>";
  leiste.insertBefore(karte, leiste.firstChild);
  document.documentElement.classList.add("hat-seiten-toc");

  var links = [].slice.call(karte.querySelectorAll("a"));
  var aktiv = -1;
  // Die Positionen werden im Scroll-Bild frisch gelesen statt einmal
  // zwischengespeichert. Vorher wurden sie vor dem Laden der Bilder vermessen
  // und zeigten danach auf den falschen Abschnitt. Achtzehn Lesezugriffe pro
  // Bild sind guenstig, solange nichts dazwischen geschrieben wird.
  var setzen = function () {
    var grenze = 130;
    var i = 0;
    while (i < titel.length && titel[i].getBoundingClientRect().top <= grenze) i++;
    i = Math.max(0, i - 1);
    if (i === aktiv) return;
    if (links[aktiv]) links[aktiv].removeAttribute("aria-current");
    aktiv = i;
    if (links[aktiv]) links[aktiv].setAttribute("aria-current", "true");
  };
  var laeuft = false;
  var beiScroll = function () {
    if (laeuft) return;
    laeuft = true;
    requestAnimationFrame(function () { setzen(); laeuft = false; });
  };
  setzen();
  window.addEventListener("scroll", beiScroll, { passive: true });
  window.addEventListener("resize", beiScroll, { passive: true });
})();
