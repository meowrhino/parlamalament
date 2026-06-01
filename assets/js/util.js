// ============================================================
// util.js — helpers compartits: selecció del DOM i estat de sessió.
// ============================================================

/** querySelector curt. */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** querySelectorAll que retorna un array de debò. */
export const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/**
 * Estat que viatja entre pàgines via sessionStorage.
 * Embolcallat en try/catch perquè algun navegador en mode privat el bloqueja.
 */
export const store = {
  get(key) {
    try { return sessionStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { sessionStorage.setItem(key, value); } catch { /* ignorem */ }
  },
};

/** Etiqueta visible segons el perfil triat a Accés. */
export const PROFILE_LABELS = {
  precari: "artista precari",
  autonom: "autònom també precari",
  legitimat: "artista legitimat",
};
