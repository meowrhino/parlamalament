// ============================================================
// chrome.js — construeix la navegació (barra de Ministeris + sidebar
//   "Funcions") a partir d'UNA sola llista de seccions, de manera que
//   s'edita en un únic lloc. Conforme creixi el TFG, només cal afegir
//   pàgines aquí (href) i deixaran d'anar a la pàgina "no trobat".
// ============================================================

// Índex de la guia (seccions del TFG). href:null = encara sense pàgina.
export const SECTIONS = [
  { n: 3,  title: "Què és el Parlamalament?",        href: "estadistiques.html" },
  { n: 4,  title: "Els artistes del Parlamalament",  href: "drets-i-deures.html" },
  { n: 5,  title: "Sistema artístic",                href: "sistema-artistic.html" },
  { n: 6,  title: "Òrgans del Parlamalament",        href: "organs.html" },
  { n: 7,  title: "Les funcions del Parlamalament",  href: "funcions.html" },
  { n: 8,  title: "La funció emancipativa",          href: "funcio-emancipativa.html" },
  { n: 9,  title: "La funció de creació, control i impuls de l'acció política i de govern", href: "funcio-creacio.html" },
  { n: 10, title: "La funció d'aprovació de legitimació i la funció no-electiva", href: "funcio-aprovacio.html" },
  { n: 11, title: "Sistema de treball i de decisió", href: "sistema-treball.html" },
  { n: 12, title: "El Parlamalament obert",          href: "parlamalament-obert.html" },
  { n: 13, title: "Història del Parlamalament",       href: "historia.html" },
  { n: 14, title: "Història del context",             href: "historia-context.html" },
  { n: 15, title: "Altres institucions vinculades",  href: "altres-institucions.html" },
];

const NOT_FOUND = "404.html";

const MINISTERIS = [
  { sigla: "MP",  nom: "Ministeri de Precarització" },
  { sigla: "MCI", nom: "Ministeri de Corrupció i Influència" },
  { sigla: "MCE", nom: "Ministeri de Cultura de l'Excel·lència" },
  { sigla: "MMD", nom: "Ministeri del Malestar i el Desafecte" },
];

// fitxer de la pàgina actual (per marcar l'enllaç actiu)
const here = location.pathname.split("/").pop() || "index.html";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const current = (href) => (href === here ? ' aria-current="page"' : "");

// Enllaços de secció (numerats). Les que no tenen pàgina van a "no trobat".
function sectionLinks() {
  return SECTIONS.map((s) => {
    const href = s.href || NOT_FOUND;
    const cls = "nav-sec" + (s.href ? "" : " soon");
    return `<a class="${cls}" href="${href}"${current(s.href || "")}>` +
           `<span class="nav-n">${s.n}</span> ${esc(s.title)}</a>`;
  }).join("");
}

export function initChrome() {
  const page = document.body.dataset.page;
  if (page !== "home" && page !== "guide") return; // nomes a home i pàgines de guia

  // --- Barra de Ministeris (desplegables), injectada després de la capçalera ---
  const header = document.querySelector(".site-header");
  if (header && !document.querySelector(".ministeri-nav")) {
    const nav = document.createElement("nav");
    nav.className = "ministeri-nav";
    nav.setAttribute("aria-label", "Òrgans executius");
    nav.innerHTML = `<div class="container">${MINISTERIS.map((m) => `
      <div class="ministeri">
        <button type="button">${esc(m.nom)} <span class="caret" aria-hidden="true"></span></button>
        <div class="ministeri-menu">
          <div class="menu-head">${m.sigla} · Òrgan executiu</div>
          <a href="captcha.html"${current("captcha.html")}>Tràmit de Legitimació</a>
          ${sectionLinks()}
        </div>
      </div>`).join("")}</div>`;
    header.insertAdjacentElement("afterend", nav);
  }

  // --- Sidebar "Funcions" (només si la pàgina la conté) ---
  const sideUl = document.querySelector('.sidebar[data-funcions] ul');
  if (sideUl) {
    const item = (href, label, soon = false) =>
      `<li><a href="${href}"${soon ? ' class="soon"' : ""}${current(href)}>${label}</a></li>`;
    sideUl.innerHTML =
      item("guia.html", "Guia (sumari)") +
      item("captcha.html", "Tràmit de Legitimació") +
      SECTIONS.map((s) =>
        item(s.href || NOT_FOUND, `${s.n}. ${esc(s.title)}`, !s.href)
      ).join("");
  }
}
