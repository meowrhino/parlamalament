// ============================================================
// carousel.js — carrusel d'imatges senzill (autoplay + fletxes + punts).
//   Amb 0-1 imatges no fa res especial: amaga els controls i prou.
// ============================================================
import { $, $$ } from "./util.js";

const INTERVAL = 5500; // ms entre imatges

export function initCarousel(root) {
  if (!root) return;
  const slides = $$(".slide", root);
  if (!slides.length) return;

  // Una sola imatge: mostra-la i amaga els controls.
  if (slides.length === 1) {
    slides[0].classList.add("active");
    [".carousel-btn.prev", ".carousel-btn.next", ".carousel-dots"].forEach((sel) => {
      const el = $(sel, root);
      if (el) el.style.display = "none";
    });
    return;
  }

  const dotsWrap = $(".carousel-dots", root);
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Imatge ${i + 1}`);
    dot.addEventListener("click", () => { goTo(i); restart(); });
    dotsWrap?.appendChild(dot);
    return dot;
  });

  function goTo(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => {
      const on = i === index;
      d.classList.toggle("active", on);
      d.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  const restart = () => {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), INTERVAL);
  };

  $(".carousel-btn.next", root)?.addEventListener("click", () => { goTo(index + 1); restart(); });
  $(".carousel-btn.prev", root)?.addEventListener("click", () => { goTo(index - 1); restart(); });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  // Pausa també amb el teclat (focus dins del carrusel), no només amb el ratolí.
  root.addEventListener("focusin", () => clearInterval(timer));
  root.addEventListener("focusout", restart);

  goTo(0);
  restart();
}
