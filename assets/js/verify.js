// ============================================================
// verify.js — animació burocràtica de "verificació" (tràmits 001/002/003).
// ============================================================
import { prefersReducedMotion } from "./util.js";

/**
 * Reprodueix una seqüència de missatges dins d'un overlay i resol quan acaba.
 * @param {HTMLElement} root  contenidor de l'animació (amb .anim-msg i .anim-bar opcionals)
 * @param {string[]} messages llista de missatges a mostrar en ordre
 * @param {number} totalMs    durada total aproximada (es reparteix entre els missatges)
 * @returns {Promise<void>}
 */
export function runVerification(root, messages, totalMs = 10000) {
  const msgEl = root.querySelector(".anim-msg");
  const barEl = root.querySelector(".anim-bar > span");
  // Amb moviment reduït mostrem només el primer i l'últim missatge, però amb
  // prou temps cadascun perquè la regió aria-live="polite" els pugui anunciar.
  let list = messages.slice();
  let step;
  if (prefersReducedMotion()) {
    if (list.length > 2) list = [list[0], list[list.length - 1]];
    step = 700; // ms per missatge (anunciables)
  } else {
    step = totalMs / list.length;
  }

  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      if (i >= list.length) { resolve(); return; }
      if (msgEl) msgEl.textContent = list[i];
      if (barEl) barEl.style.width = `${Math.round(((i + 1) / list.length) * 100)}%`;
      i += 1;
      setTimeout(tick, step);
    };
    tick();
  });
}
