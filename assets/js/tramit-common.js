// ============================================================
// tramit-common.js — utilitats compartides pels tràmits (001/002/003).
//   · runVerification(): animació burocràtica de "verificació".
//   · expedient(): genera un número d'expedient PLM-XXX-AAAA-NNNNN.
//   · submitWeb3Forms(): envia el formulari a l'email (servei sense backend).
//   · makePdf(): genera el certificat/justificant en PDF amb jsPDF (CDN).
// ============================================================

/* ---------- Preferència de moviment reduït ---------- */
const reduceMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

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
  if (reduceMotion()) {
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

/** Número d'expedient fictici: PREFIX-AAAA-NNNNN (any actual + 5 dígits). */
export function expedient(prefix) {
  const year = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `${prefix}-${year}-${n}`;
}

/** Data llarga en català (p. ex. "14 de juny de 2026"). */
export function dataLlarga(d = new Date()) {
  const mesos = ["gener","febrer","març","abril","maig","juny","juliol",
                 "agost","setembre","octubre","novembre","desembre"];
  return `${d.getDate()} de ${mesos[d.getMonth()]} de ${d.getFullYear()}`;
}

/* ---------- Enviament del formulari (Web3Forms, sense backend) ----------
   La clau d'en Jordi ja està posada: els tràmits 002/003 ENVIEN de debò a
   jordi.bretcha@gmail.com. És una clau pública per disseny (Web3Forms no té
   backend); convé restringir el domini permès a meowrhino.github.io al panell.
   Si es torna a posar el placeholder "POSA-AQUI-LA-ACCESS-KEY", els tràmits
   passen a MODE DE PROVA (no s'envia res, però el flux es pot provar igual). */
export const WEB3FORMS_ACCESS_KEY = "36cdc278-30a2-4bdf-9b22-b751bd8866c6";
export const TEST_MODE = WEB3FORMS_ACCESS_KEY === "POSA-AQUI-LA-ACCESS-KEY";

/**
 * Envia un FormData a Web3Forms. En mode de prova simula èxit (no fa cap POST).
 * @param {FormData} formData
 * @returns {Promise<{success:boolean, test?:boolean}>}
 */
export async function submitWeb3Forms(formData) {
  if (TEST_MODE) {
    console.info("[tràmit] MODE DE PROVA: no s'envia res (falta WEB3FORMS_ACCESS_KEY).");
    return { success: true, test: true };
  }
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "No s'ha pogut registrar el tràmit. Torna-ho a provar.");
  }
  return data;
}

/* ---------- Generació de PDF (jsPDF, carregat per CDN) ----------
   Espera el global window.jspdf.jsPDF. Disposa un document A4 sobri amb
   capçalera de marca, caixa de metadades i blocs de contingut. */

/**
 * @typedef {Object} PdfBlock
 * @property {string} [heading]   títol del bloc (opcional)
 * @property {string} [text]      paràgraf llarg (es parteix en línies)
 * @property {[string,string][]} [rows]  parelles etiqueta/valor
 */

/**
 * @param {Object} spec
 * @param {string} spec.filename
 * @param {string} spec.organisme   text petit de capçalera (organisme emissor)
 * @param {string} spec.title       títol gran
 * @param {string} [spec.result]    línia destacada (p. ex. "RESULTAT: APROVAT")
 * @param {[string,string][]} spec.meta  metadades (Expedient, Data, Estat…)
 * @param {PdfBlock[]} [spec.blocks]
 * @param {string} [spec.footer]
 */
export function makePdf(spec) {
  const JsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!JsPDF) { alert("No s'ha pogut carregar el generador de PDF."); return; }

  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const PAGE_W = 210, PAGE_H = 297, M = 20;       // marges
  const RED = [219, 57, 42], INK = [20, 20, 20], SOFT = [90, 90, 90];
  let y = 0;

  const ensure = (need) => {
    if (y + need > PAGE_H - M) { doc.addPage(); y = M; }
  };
  const para = (text, size, color, lh, maxW = PAGE_W - M * 2) => {
    doc.setFontSize(size); doc.setTextColor(...color);
    doc.splitTextToSize(text, maxW).forEach((line) => {
      ensure(lh); doc.text(line, M, y); y += lh;
    });
  };

  // Capçalera de marca (banda vermella)
  doc.setFillColor(...RED); doc.rect(0, 0, PAGE_W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("El Parlamalament de l'Artista", M, 12);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(spec.organisme || "", M, 19);
  y = 40;

  // Títol
  doc.setFont("helvetica", "bold"); doc.setTextColor(...RED);
  para(spec.title, 18, RED, 9);
  y += 2;

  // Resultat destacat
  if (spec.result) {
    doc.setFont("helvetica", "bold");
    para(spec.result, 14, INK, 8);
    y += 2;
  }
  doc.setFont("helvetica", "normal");

  // Caixa de metadades
  if (spec.meta && spec.meta.length) {
    const boxTop = y;
    const rowH = 7, padX = 4;
    const boxH = rowH * spec.meta.length + 4;
    ensure(boxH);
    doc.setDrawColor(...RED); doc.setLineWidth(0.4);
    doc.rect(M, boxTop, PAGE_W - M * 2, boxH);
    let ry = boxTop + 6;
    spec.meta.forEach(([k, v]) => {
      doc.setFont("helvetica", "bold"); doc.setTextColor(...INK); doc.setFontSize(10);
      doc.text(`${k}:`, M + padX, ry);
      doc.setFont("helvetica", "normal"); doc.setTextColor(...SOFT);
      doc.text(String(v), M + padX + 42, ry);
      ry += rowH;
    });
    y = boxTop + boxH + 8;
  }

  // Blocs de contingut
  (spec.blocks || []).forEach((b) => {
    if (b.heading) {
      y += 2; ensure(8);
      doc.setFont("helvetica", "bold"); para(b.heading, 11, RED, 6.5);
      doc.setFont("helvetica", "normal");
    }
    if (b.text) para(b.text, 10, INK, 5.6);
    (b.rows || []).forEach(([k, v]) => {
      doc.setFont("helvetica", "bold"); para(k, 9.5, INK, 5.2);
      doc.setFont("helvetica", "normal"); para(v || "—", 9.5, SOFT, 5.2);
      y += 1.5;
    });
  });

  // Peu
  if (spec.footer) {
    y = Math.max(y, PAGE_H - M - 16);
    doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.2);
    doc.line(M, y, PAGE_W - M, y); y += 5;
    doc.setFont("helvetica", "italic");
    para(spec.footer, 8.5, SOFT, 4.6);
    doc.setFont("helvetica", "normal");
  }

  doc.save(spec.filename);
}

/* ---------- Flux compartit de registre (tràmits 002 i 003) ----------
   Formulari natiu → validació → enviament → animació → justificant + PDF. */

/**
 * @param {HTMLElement} root  contenidor .tramit
 * @param {Object} cfg
 * @param {string} cfg.prefix        p. ex. "PLM-002"
 * @param {string} cfg.organisme
 * @param {string} cfg.subject       assumpte de l'email
 * @param {string[]} cfg.animMessages
 * @param {number} cfg.animMs
 * @param {string} cfg.justifMessage missatge oficial del justificant
 * @param {string} [cfg.finalPhrase] frase final (cursiva)
 * @param {string} cfg.filenameStem  arrel del nom del PDF
 * @param {string} [cfg.backHref]    enllaç de tornada
 */
export function registerTramit(root, cfg) {
  const views = {
    form: root.querySelector(".tramit-form"),
    anim: root.querySelector(".tramit-animacio"),
    justif: root.querySelector(".tramit-justificant"),
  };
  const show = (name) => {
    for (const [k, el] of Object.entries(views)) if (el) el.hidden = k !== name;
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  const form = root.querySelector("form");
  const errEl = root.querySelector(".tramit-error");
  const submitBtn = form?.querySelector("[data-submit]");
  if (!form) return;

  // Marca visual dels checkboxes/labels seleccionats.
  form.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"], input[type="radio"]')) {
      e.target.closest(".check")?.classList.toggle("sel", e.target.checked);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.textContent = "";
    if (!form.reportValidity()) {
      errEl.textContent = "Revisa els camps marcats: n'hi ha d'obligatoris sense emplenar.";
      form.querySelector(":invalid")?.focus();
      return;
    }

    const fd = new FormData(form);
    fd.append("subject", cfg.subject);
    fd.append("from_name", `Parlamalament · ${cfg.prefix}`);

    if (submitBtn) submitBtn.disabled = true;
    show("anim"); // mostra l'spinner immediatament
    try {
      // L'enviament i l'animació van en PARAL·LEL: l'usuari veu l'spinner
      // mentre es fa la petició i no continuem fins que tots dos acaben.
      await Promise.all([
        submitWeb3Forms(fd),
        runVerification(views.anim, cfg.animMessages, cfg.animMs),
      ]);
    } catch (err) {
      show("form"); // l'enviament ha fallat: torna al formulari
      errEl.textContent = err.message;
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    renderJustificant(views.justif, cfg, fd);
    show("justif");
    views.justif?.querySelector(".justif-title")?.focus(); // anuncia el resultat
  });
}

function renderJustificant(section, cfg, fd) {
  if (!section) return;
  const host = section.querySelector("[data-justif-host]") || section;
  const exp = expedient(cfg.prefix);
  const date = dataLlarga();
  const nom = (fd.get("nom_cognoms") || "—").toString();
  const correu = (fd.get("correu") || "—").toString();
  const escH = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const testNote = TEST_MODE
    ? `<p class="tramit-disclaimer">Mode de prova: la sol·licitud encara no s'envia per correu (falta configurar la clau d'enviament). El justificant és vàlid per provar el flux.</p>`
    : "";
  const finalHtml = cfg.finalPhrase ? `<p class="justif-final">${escH(cfg.finalPhrase)}</p>` : "";

  host.innerHTML = `
    <article class="justif">
      <div class="justif-band">${escH(cfg.organisme)}</div>
      <h1 class="justif-title" tabindex="-1">Justificant de registre · ${escH(cfg.prefix)}</h1>
      <p class="justif-state">Estat: <strong>REGISTRAT</strong></p>
      <dl class="cert-meta">
        <div><dt>Núm. d'expedient</dt><dd>${escH(exp)}</dd></div>
        <div><dt>Data</dt><dd>${escH(date)}</dd></div>
        <div><dt>Titular</dt><dd>${escH(nom)}</dd></div>
        <div><dt>Correu</dt><dd>${escH(correu)}</dd></div>
      </dl>
      <p class="justif-msg">${escH(cfg.justifMessage)}</p>
      ${finalHtml}
      ${testNote}
      <div class="justif-actions">
        <button type="button" class="btn btn-red" data-pdf>Descarrega el justificant (PDF)</button>
        ${cfg.nextHref ? `<a class="link-arrow" href="${cfg.nextHref}">${escH(cfg.nextLabel || "Següent tràmit")} <span aria-hidden="true">→</span></a>` : ""}
        <a class="link-arrow" href="${cfg.backHref || "home.html"}">Torna al Parlamalament <span aria-hidden="true">→</span></a>
      </div>
    </article>`;

  host.querySelector("[data-pdf]")?.addEventListener("click", () => {
    makePdf({
      filename: `${cfg.filenameStem}-${exp}.pdf`,
      organisme: cfg.organisme,
      title: `Justificant de registre · ${cfg.prefix}`,
      result: "ESTAT: REGISTRAT",
      meta: [
        ["Núm. d'expedient", exp],
        ["Data", date],
        ["Titular", nom],
        ["Correu", correu],
      ],
      blocks: [
        { text: cfg.justifMessage },
        ...(cfg.finalPhrase ? [{ text: cfg.finalPhrase }] : []),
      ],
      footer: "Aquest justificant acredita el registre d'entrada del tràmit. No implica cap aprovació.",
    });
  });
}
