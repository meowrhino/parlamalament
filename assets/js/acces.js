// ============================================================
// acces.js — landing 2: captura el nom i la tria de perfil.
//   · Sense nom → modal d'avís (visible) i no avança.
//   · "legitimat" passa pel captcha; la resta van directes a la home.
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

  const go = (profile) => {
    const name = (input?.value ?? "").trim();
    if (!name) { openModal(); return; }
    store.set("pm_name", name);
    store.set("pm_profile", profile);
    window.location.href = profile === "legitimat" ? "captcha.html" : "home.html";
  };

  $$("[data-profile]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      go(el.getAttribute("data-profile"));
    })
  );
}
