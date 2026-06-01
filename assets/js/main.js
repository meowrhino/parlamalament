// ============================================================
// main.js — punt d'entrada (carregat com a <script type="module">).
//   Carrega el comportament comú (nav) i el específic de cada pàgina,
//   segons l'atribut data-page del <body>.
//   Flux: index → acces → (captcha) → home.
// ============================================================
import { initNav } from "./nav.js";
import { initConsent } from "./consent.js";
import { initAcces } from "./acces.js";
import { initCaptcha } from "./captcha.js";
import { initHome } from "./home.js";

const PAGE_INIT = {
  index: initConsent,
  acces: initAcces,
  captcha: initCaptcha,
  home: initHome,
};

initNav(); // la barra de Ministeris (no-op si la pàgina no en té)
PAGE_INIT[document.body.dataset.page]?.();
