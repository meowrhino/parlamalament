// ============================================================
// chrome.js — construeix la navegació (barra de Ministeris + sidebar
//   "Funcions") a partir d'UNA sola llista de seccions, de manera que
//   s'edita en un únic lloc. Conforme creixi el TFG, només cal afegir
//   pàgines aquí (href) i deixaran d'anar a la pàgina "no trobat".
// ============================================================
import { escapeHtml as esc } from "./util.js";

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

// Capçalera i peu (chrome comú). Abans estaven copiats byte a byte a cada HTML;
// ara viuen aquí i s'injecten als punts de muntatge <header|footer data-chrome>.
// El <head>/OG segueix estàtic a cada pàgina (els robots de previsualització no
// executen JS). Vegeu README → "Blocs encara duplicats".
const HEADER_INNER = `
      <div class="container">
        <a class="brand-title" href="home.html"><span class="mark" role="img" aria-label="El Parlamalament"></span>El Parlamalament</a>
        <div class="header-meta">
          <a href="mailto:jordi.bretcha@gmail.com?subject=Suport%20Parlamalament">Suport</a>
        </div>
      </div>`;

const FOOTER_INNER = `
      <div class="container">
        <div class="footer-brand">
          <span class="mark" role="img" aria-label="El Parlamalament"></span>
          <span class="name">Parlamalament<br>de l'Artista</span>
        </div>
      </div>`;

// Omple els punts de muntatge del chrome comú. S'executa a TOTES les pàgines que
// el porten (acces, captcha, 404, home, guies, tràmits), abans del gate WITH_NAV.
function mountChrome() {
  const header = document.querySelector('header.site-header[data-chrome="header"]');
  if (header && !header.hasChildNodes()) header.innerHTML = HEADER_INNER;
  const footer = document.querySelector('footer.site-footer[data-chrome="footer"]');
  if (footer && !footer.hasChildNodes()) footer.innerHTML = FOOTER_INNER;
}

// Organismes executius (abans Ministeris). Cada organisme té els SEUS subapartats.
//   item: { label, href?, external?, soon? }
//   · soon:true     → encara sense pàgina (va a 404 amb estil atenuat)
//   · external:true → enllaç extern (s'obre en una pestanya nova)
const ORGANISMES = [
  { sigla: "IMC", nom: "Institut del Malestar Cultural", items: [
      { label: "Estadístiques i informes del context", href: "estadistiques.html" },
      { label: "Queixes i malestars (bústia PAAC)", href: "https://paac.cat/es/i/bustia-queixes/", external: true },
  ] },
  { sigla: "OM", nom: "Observatori de la meritocràcia", items: [
      { label: "Ranking de convocatòries", soon: true },
      { label: "Indicadors d'inclusió i exclusió cultural", soon: true },
      { label: "Comptadors de propostes denegades", soon: true },
  ] },
  { sigla: "CSLA", nom: "Consell Superior de Legitimitat Artística", items: [
      { label: "Tràmit 001 · Autolegitimació", href: "tramit-001.html" },
  ] },
  { sigla: "AERM", nom: "Agència Estatal del Reconeixement Mutu", items: [
      { label: "Tràmit 002 · Incorporació de propostes, recursos i col·laboracions", href: "tramit-002.html" },
      { label: "Tràmit 003 · Feina, encàrrec o vinculació", href: "tramit-003.html" },
  ] },
];

// fitxer de la pàgina actual (per marcar l'enllaç actiu)
const here = location.pathname.split("/").pop() || "index.html";
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

// Enllaç d'un subapartat d'organisme.
function itemLink(it) {
  const href = it.soon ? NOT_FOUND : it.href;
  const cls = it.soon ? ' class="soon"' : "";
  const ext = it.external ? ' target="_blank" rel="noopener"' : "";
  const cur = it.href && !it.external ? current(it.href) : "";
  return `<a href="${href}"${cls}${ext}${cur}>${esc(it.label)}</a>`;
}

export function initChrome() {
  const page = document.body.dataset.page;

  // Capçalera i peu comuns: a totes les pàgines que porten els punts de muntatge.
  mountChrome();

  // A home, pàgines de guia i pàgines de tràmit (perquè no siguin culs-de-sac).
  const WITH_NAV = new Set(["home", "guide", "tramit001", "tramit002", "tramit003"]);
  if (!WITH_NAV.has(page)) return;

  // --- Barra d'Organismes (desplegables), injectada després de la capçalera ---
  const header = document.querySelector(".site-header");
  if (header && !document.querySelector(".ministeri-nav")) {
    const nav = document.createElement("nav");
    nav.className = "ministeri-nav";
    nav.setAttribute("aria-label", "Òrgans executius");
    const organismes = ORGANISMES.map((o) => `
      <div class="ministeri">
        <button type="button" aria-haspopup="true">${esc(o.nom)} <span class="caret" aria-hidden="true"></span></button>
        <div class="ministeri-menu">
          ${o.items.map(itemLink).join("")}
        </div>
      </div>`).join("");
    // Desplegable "Guia" amb l'índex de continguts (perquè les pàgines de
    // contingut puguin navegar entre seccions sense la sidebar de la home).
    const guia = `
      <div class="ministeri">
        <button type="button">Guia <span class="caret" aria-hidden="true"></span></button>
        <div class="ministeri-menu">
          <a href="guia.html"${current("guia.html")}>Sumari de la guia</a>
          ${sectionLinks()}
        </div>
      </div>`;
    // Botó hamburguesa (només visible en mòbil via CSS): plega/desplega tota la
    // barra d'organismes en un sol desplegable.
    const toggle =
      `<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="organismes-bar">` +
      `<span>Organismes</span><span class="caret" aria-hidden="true"></span></button>`;
    nav.innerHTML = `${toggle}<div class="container" id="organismes-bar">${organismes}${guia}</div>`;
    header.insertAdjacentElement("afterend", nav);
  }

  // --- Sidebar "Funcions" (només si la pàgina la conté) ---
  const sideUl = document.querySelector('.sidebar[data-funcions] ul');
  if (sideUl) {
    const item = (href, label, soon = false) =>
      `<li><a href="${href}"${soon ? ' class="soon"' : ""}${current(href)}>${label}</a></li>`;
    sideUl.innerHTML =
      item("guia.html", "Guia (sumari)") +
      item("tramit-001.html", "Tràmit 001 · Autolegitimació") +
      SECTIONS.map((s) =>
        item(s.href || NOT_FOUND, `${s.n}. ${esc(s.title)}`, !s.href)
      ).join("");
  }
}
