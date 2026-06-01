// ============================================================
// captcha.js — el "captcha-meme" estil reCAPTCHA.
//   Trosseja una sola imatge (data-img) en cols×rows cel·les amb
//   background-position i, en verificar, marca el perfil com a legitimat.
// ============================================================
import { $, $$, store } from "./util.js";

export function initCaptcha() {
  const grid = $("#captcha-grid");
  if (!grid) return;

  const src = grid.dataset.img;
  const cols = Number(grid.dataset.cols) || 3;
  const rows = Number(grid.dataset.rows) || 4;
  const msg = $("#captcha-msg");

  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "captcha-cell";
    cell.setAttribute("aria-pressed", "false");
    cell.setAttribute("aria-label", `Quadre ${i + 1}`);
    cell.style.backgroundImage = `url('${src}')`;
    cell.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    cell.style.backgroundPosition =
      `${cols > 1 ? (col / (cols - 1)) * 100 : 0}% ` +
      `${rows > 1 ? (row / (rows - 1)) * 100 : 0}%`;
    cell.innerHTML = '<span class="tick"><span>✓</span></span>';

    cell.addEventListener("click", () => {
      const on = cell.classList.toggle("selected");
      cell.setAttribute("aria-pressed", String(on));
      if (msg) msg.textContent = "";
    });
    grid.appendChild(cell);
  }

  $("#captcha-verify")?.addEventListener("click", () => {
    if (!$$(".captcha-cell.selected", grid).length) {
      if (msg) msg.textContent = "Selecciona almenys una persona que coneguis.";
      return;
    }
    store.set("pm_profile", "legitimat");
    window.location.href = "home.html";
  });
}
