// ============================================================
// nav.js — desplegables de la barra de Ministeris (només a la home).
// ============================================================
import { $, $$ } from "./util.js";

/** Activa els menús desplegables dels Ministeris (només un obert alhora). */
export function initNav() {
  const ministeris = $$(".ministeri");
  if (!ministeris.length) return;

  const closeAll = (except) => {
    ministeris.forEach((m) => {
      if (m === except) return;
      m.classList.remove("open");
      $("button", m)?.setAttribute("aria-expanded", "false");
    });
  };

  ministeris.forEach((m) => {
    const btn = $("button", m);
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !m.classList.contains("open");
      closeAll(m);
      m.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Tancar en fer clic fora o amb Escape.
  document.addEventListener("click", () => closeAll(null));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
}
