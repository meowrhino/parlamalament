// ============================================================
// main.js — punt d'entrada (carregat com a <script type="module">).
//   Carrega el comportament comú (nav) i el específic de cada pàgina,
//   segons l'atribut data-page del <body>.
//   Flux: index → acces → (captcha) → home.
// ============================================================
import { initChrome } from "./chrome.js";
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

// Pàgines de contingut sense comportament JS propi (no-op esperat).
const KNOWN_NOOP = new Set(["guide", "notfound"]);

initChrome(); // construeix la barra de Ministeris (+ sidebar) des d'una sola llista
initNav();    // activa els desplegables (ara que ja existeixen al DOM)

const page = document.body.dataset.page;
const initPage = PAGE_INIT[page];
if (initPage) initPage();
else if (!KNOWN_NOOP.has(page)) console.warn(`[Parlamalament] data-page desconegut: "${page}"`);
