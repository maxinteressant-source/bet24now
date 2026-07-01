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
