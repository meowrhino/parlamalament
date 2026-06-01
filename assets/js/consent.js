// ============================================================
// consent.js — landing 1: el muro "Aquesta web utilitza l'antagonisme".
// ============================================================
import { $$ } from "./util.js";

/** Tots dos botons (acceptar / rebutjar) porten a Accés. */
export function initConsent() {
  $$("[data-go-acces]").forEach((btn) =>
    btn.addEventListener("click", () => {
      window.location.href = "acces.html";
    })
  );
}
