// ============================================================
// captcha.js — el "captcha-meme" estil reCAPTCHA.
//   Trosseja una sola imatge (data-img) en cols×rows cel·les amb
//   background-position i, en verificar, marca el perfil com a legitimat.
//   Els botons de la barra (refrescar/àudio/info) són una broma.
// ============================================================
import { $, $$, store } from "./util.js";

export function initCaptcha() {
  const grid = $("#captcha-grid");
  if (!grid) return;

  const src = grid.dataset.img;
  if (!src) return; // sense imatge no hi ha quadrícula
  const clamp = (v, def) => Math.min(Math.max(Number(v) || def, 1), 6);
  const cols = clamp(grid.dataset.cols, 3);
  const rows = clamp(grid.dataset.rows, 4);
  const msg = $("#captcha-msg");
  const setMsg = (t) => { if (msg) msg.textContent = t; };

  // Posició de fons del tros number i (per pintar i, després, rebarallar).
  const posFor = (i) => {
    const col = i % cols, row = Math.floor(i / cols);
    return `${cols > 1 ? (col / (cols - 1)) * 100 : 0}% ` +
           `${rows > 1 ? (row / (rows - 1)) * 100 : 0}%`;
  };

  const cells = [];
  for (let i = 0; i < cols * rows; i++) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "captcha-cell";
    cell.setAttribute("aria-pressed", "false");
    cell.setAttribute("aria-label", `Quadre ${i + 1}`);
    cell.style.backgroundImage = `url('${src}')`;
    cell.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    cell.style.backgroundPosition = posFor(i);
    cell.innerHTML = '<span class="tick"><span>✓</span></span>';

    cell.addEventListener("click", () => {
      const on = cell.classList.toggle("selected");
      cell.setAttribute("aria-pressed", String(on));
      setMsg("");
    });
    grid.appendChild(cell);
    cells.push(cell);
  }

  const clearSelection = () => cells.forEach((c) => {
    c.classList.remove("selected");
    c.setAttribute("aria-pressed", "false");
  });

  // Broma: els controls de la barra fan alguna cosa visible però inofensiva.
  const actions = {
    refresh() {
      // rebaralla els trossos i neteja la selecció: sembla un repte nou
      const order = cells.map((_, i) => i).sort(() => Math.random() - 0.5);
      cells.forEach((c, i) => { c.style.backgroundPosition = posFor(order[i]); });
      clearSelection();
      setMsg("");
    },
    audio() { setMsg("El repte d'àudio no està disponible."); },
    info() { setMsg("Selecciona les persones que coneguis i prem Verifica."); },
  };
  $$(".rc-ic", grid.closest(".captcha")).forEach((btn) => {
    const fn = actions[btn.dataset.action];
    if (fn) btn.addEventListener("click", fn);
  });

  $("#captcha-verify")?.addEventListener("click", () => {
    if (!$$(".captcha-cell.selected", grid).length) {
      setMsg("Selecciona almenys una persona que coneguis.");
      return;
    }
    store.set("pm_profile", "legitimat");
    window.location.href = "home.html";
  });
}
