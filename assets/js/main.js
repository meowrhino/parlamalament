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
import { initTramit001 } from "./tramit001.js";
import { initTramit002 } from "./tramit002.js";
import { initTramit003 } from "./tramit003.js";

const PAGE_INIT = {
  index: initConsent,
  acces: initAcces,
  captcha: initCaptcha,
  home: initHome,
  tramit001: initTramit001,
  tramit002: initTramit002,
  tramit003: initTramit003,
};

// Pàgines de contingut sense comportament JS propi (no-op esperat).
const KNOWN_NOOP = new Set(["guide", "notfound"]);

initChrome(); // construeix la barra de Ministeris (+ sidebar) des d'una sola llista
initNav();    // activa els desplegables (ara que ja existeixen al DOM)

const page = document.body.dataset.page;
const initPage = PAGE_INIT[page];
if (initPage) initPage();
else if (!KNOWN_NOOP.has(page)) console.warn(`[Parlamalament] data-page desconegut: "${page}"`);
