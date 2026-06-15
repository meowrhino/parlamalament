// ============================================================
// acces.js — landing 2: captura el nom i la tria de perfil.
//   · Sense nom → modal d'avís (visible) i no avança.
//   · "Soc artiste legitimat" passa pel captcha; la resta van directes a la home.
//   · Un element amb data-target força aquesta destinació (p. ex. el
//     tràmit de legitimació, que va directe a tramit-001.html).
// ============================================================
import { $, $$, store } from "./util.js";

export function initAcces() {
  const form = $("#acces-form");
  if (!form) return;

  const input = $("#nom");
  const modal = $("#name-modal");

  // --- Modal d'avís ---
  let lastFocus = null;
  const openModal = () => {
    if (!modal) { input?.focus(); return; }
    lastFocus = document.activeElement;
    modal.hidden = false;
    $("button[data-close]", modal)?.focus();
  };
  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    (lastFocus || input)?.focus();
  };
  modal?.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const go = (el) => {
    const name = (input?.value ?? "").trim();
    if (!name) { openModal(); return; }
    const profile = el.getAttribute("data-profile");
    store.set("pm_name", name);
    store.set("pm_profile", profile);
    const target = el.getAttribute("data-target")
      || (profile === "legitimat" ? "captcha.html" : "home.html");
    window.location.href = target;
  };

  $$("[data-profile]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      go(el);
    })
  );
}
