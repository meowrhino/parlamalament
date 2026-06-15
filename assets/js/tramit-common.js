// ============================================================
// tramit-common.js — flux compartit de registre dels tràmits (002/003)
//   + helpers d'expedient/data. La resta de peces viuen en mòduls propis:
//   verify.js (animació), pdf.js (PDF), web3forms.js (enviament).
// ============================================================
import { escapeHtml as escH } from "./util.js";
import { runVerification } from "./verify.js";
import { makePdf } from "./pdf.js";
import { submitWeb3Forms, TEST_MODE } from "./web3forms.js";

/* ---------- Helpers d'expedient i data ---------- */

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
 * @param {string} [cfg.nextHref]    enllaç al tràmit següent
 * @param {string} [cfg.nextLabel]   etiqueta de l'enllaç al tràmit següent
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
