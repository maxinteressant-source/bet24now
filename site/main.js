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
