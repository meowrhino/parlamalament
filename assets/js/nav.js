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

  ministeris.forEach((m, i) => {
    const btn = $("button", m);
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    // Relaciona el botó amb el seu menú per a lectors de pantalla.
    const menu = $(".ministeri-menu", m);
    if (menu) {
      if (!menu.id) menu.id = `ministeri-menu-${i}`;
      btn.setAttribute("aria-controls", menu.id);
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !m.classList.contains("open");
      closeAll(m);
      m.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Hamburguesa (mòbil): plega/desplega tota la barra d'organismes.
  const nav = document.querySelector(".ministeri-nav");
  const toggle = nav?.querySelector(".nav-toggle");
  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) closeAll(null); // en plegar, tanca també els submenús
  });

  // Tancar en fer clic fora o amb Escape.
  document.addEventListener("click", () => closeAll(null));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    // Torna el focus al botó del Ministeri obert abans de tancar-lo.
    const openBtn = $(".ministeri.open button");
    closeAll(null);
    openBtn?.focus();
  });
}
