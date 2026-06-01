// ============================================================
// home.js — landing 3: salutació personalitzada + carrusel.
// ============================================================
import { $, store, PROFILE_LABELS } from "./util.js";
import { initCarousel } from "./carousel.js";

/** Saluda amb el nom i el perfil desats a Accés / captcha. */
export function initHome() {
  const title = $("#greeting-title");
  if (title) {
    const name = store.get("pm_name") || "artista anònim";
    const profile = store.get("pm_profile") || "precari";
    title.textContent = `hola ${name}, ${PROFILE_LABELS[profile] ?? PROFILE_LABELS.precari}`;
  }
  initCarousel($("#carousel"));
}
