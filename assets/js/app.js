/* ============================================================
   PARLAMALAMENT DE L'ARTISTA — comportament (vanilla JS)
   Flux:
     index.html  (landing 1) --acceptar/rebutjar--> acces.html
     acces.html  (landing 2) --precari/autònom-----> home.html
                              --legitimat-----------> captcha.html
     captcha.html            --verifica------------> home.html
     home.html   (landing 3) --fes el tràmit-------> captcha.html
   L'estat (nom + perfil) viatja per sessionStorage.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- estat compartit ---------- */
  var store = {
    get: function (k) {
      try { return sessionStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { sessionStorage.setItem(k, v); } catch (e) {}
    }
  };

  var PROFILE_LABELS = {
    precari: "artista precari",
    autonom: "autònom també precari",
    legitimat: "artista legitimat"
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ============================================================
     NAV DE MINISTERIS — desplegables
     ============================================================ */
  function initNav() {
    var ministeris = $all(".ministeri");
    if (!ministeris.length) return;

    function closeAll(except) {
      ministeris.forEach(function (m) {
        if (m !== except) {
          m.classList.remove("open");
          var b = $("button", m);
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    }

    ministeris.forEach(function (m) {
      var btn = $("button", m);
      if (!btn) return;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var isOpen = m.classList.contains("open");
        closeAll(m);
        m.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    document.addEventListener("click", function () { closeAll(null); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll(null);
    });
  }

  /* ============================================================
     LANDING 1 — muro de consentiment
     ============================================================ */
  function initConsent() {
    $all("[data-go-acces]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.location.href = "acces.html";
      });
    });
  }

  /* ============================================================
     LANDING 2 — Accés (captura el nom + tria de perfil)
     ============================================================ */
  function initAcces() {
    var form = $("#acces-form");
    if (!form) return;
    var input = $("#nom");
    var errorBox = $("#nom-error");

    function showError(msg) {
      if (errorBox) errorBox.textContent = msg;
      if (input) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
      }
    }
    function clearError() {
      if (errorBox) errorBox.textContent = "";
      if (input) input.removeAttribute("aria-invalid");
    }
    if (input) input.addEventListener("input", clearError);

    function go(profile) {
      var name = (input && input.value || "").trim();
      if (!name) {
        showError("Has d’introduir un nom per identificar-te.");
        return;
      }
      store.set("pm_name", name);
      store.set("pm_profile", profile);
      window.location.href = (profile === "legitimat") ? "captcha.html" : "home.html";
    }

    $all("[data-profile]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        go(btn.getAttribute("data-profile"));
      });
    });
  }

  /* ============================================================
     CAPTCHA — meme estil reCAPTCHA
     ============================================================ */
  function initCaptcha() {
    var grid = $("#captcha-grid");
    if (!grid) return;

    var src = grid.getAttribute("data-img");
    var cols = parseInt(grid.getAttribute("data-cols"), 10) || 3;
    var rows = parseInt(grid.getAttribute("data-rows"), 10) || 4;
    var total = cols * rows;
    var msg = $("#captcha-msg");

    for (var i = 0; i < total; i++) {
      var c = i % cols;
      var r = Math.floor(i / cols);
      var cell = document.createElement("button");
      cell.type = "button";
      cell.className = "captcha-cell";
      cell.setAttribute("aria-pressed", "false");
      cell.setAttribute("aria-label", "Quadre " + (i + 1));
      cell.style.backgroundImage = "url('" + src + "')";
      cell.style.backgroundSize = (cols * 100) + "% " + (rows * 100) + "%";
      cell.style.backgroundPosition =
        (cols > 1 ? (c / (cols - 1)) * 100 : 0) + "% " +
        (rows > 1 ? (r / (rows - 1)) * 100 : 0) + "%";

      var tick = document.createElement("span");
      tick.className = "tick";
      tick.innerHTML = "<span>✓</span>";
      cell.appendChild(tick);

      cell.addEventListener("click", function () {
        var on = this.classList.toggle("selected");
        this.setAttribute("aria-pressed", String(on));
        if (msg) msg.textContent = "";
      });
      grid.appendChild(cell);
    }

    var verify = $("#captcha-verify");
    if (verify) {
      verify.addEventListener("click", function () {
        var selected = $all(".captcha-cell.selected", grid).length;
        if (selected === 0) {
          if (msg) msg.textContent = "Selecciona almenys una persona que coneguis.";
          return;
        }
        store.set("pm_profile", "legitimat");
        window.location.href = "home.html";
      });
    }
  }

  /* ============================================================
     LANDING 3 — Home (saluda + carrusel)
     ============================================================ */
  function initHome() {
    var greet = $("#greeting-title");
    if (greet) {
      var name = store.get("pm_name") || "artista anònim";
      var profile = store.get("pm_profile") || "precari";
      greet.textContent = "hola " + name + ", " + (PROFILE_LABELS[profile] || PROFILE_LABELS.precari);
    }
    initCarousel($("#carousel"));
  }

  function initCarousel(root) {
    if (!root) return;
    var slides = $all(".slide", root);
    var dotsWrap = $(".carousel-dots", root);
    if (!slides.length) return;

    // Un sol slide: mostra'l, amaga els controls i no fa autoplay.
    if (slides.length <= 1) {
      slides[0].classList.add("active");
      [".carousel-btn.prev", ".carousel-btn.next", ".carousel-dots"].forEach(function (sel) {
        var el = $(sel, root);
        if (el) el.style.display = "none";
      });
      return;
    }

    var idx = 0;
    var timer = null;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // construir punts
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.setAttribute("aria-label", "Imatge " + (i + 1));
        d.addEventListener("click", function () { go(i); restart(); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("active", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function restart() {
      if (reduced) return;
      if (timer) clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    var nextBtn = $(".carousel-btn.next", root);
    var prevBtn = $(".carousel-btn.prev", root);
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    root.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    root.addEventListener("mouseleave", restart);

    go(0);
    restart();
  }

  /* ============================================================
     Arrencada segons la pàgina
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    var page = document.body.getAttribute("data-page");
    if (page === "index") initConsent();
    else if (page === "acces") initAcces();
    else if (page === "captcha") initCaptcha();
    else if (page === "home") initHome();
  });
})();
