// ============================================================
// acces.js — landing 2: captura el nom i la tria de perfil.
//   · Sense nom → alerta i no avança.
//   · "legitimat" passa pel captcha; la resta van directes a la home.
// ============================================================
import { $, $$, store } from "./util.js";

const NAME_REQUIRED = "Has d’introduir un nom per identificar-te.";

export function initAcces() {
  const form = $("#acces-form");
  if (!form) return;

  const input = $("#nom");
  const errorBox = $("#nom-error");

  const setError = (msg) => {
    if (errorBox) errorBox.textContent = msg;
    input?.toggleAttribute("aria-invalid", Boolean(msg));
    if (msg) input?.focus();
  };

  input?.addEventListener("input", () => setError(""));

  const go = (profile) => {
    const name = (input?.value ?? "").trim();
    if (!name) return setError(NAME_REQUIRED);
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
