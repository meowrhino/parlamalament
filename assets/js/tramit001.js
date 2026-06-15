// ============================================================
// tramit001.js — Certificat provisional d'autolegitimació artística.
//   Assistent per passos (un bloc = un pas) → animació de verificació →
//   càlcul (invisible) de la categoria → certificat + descàrrega PDF.
// ============================================================
import { $, store, escapeHtml as esc } from "./util.js";
import {
  BLOCKS, CATEGORIES, OBSERVACIONS, PEU, COS_CERTIFICAT, ANIM_MESSAGES, computeResult,
} from "./tramit001-data.js";
import { expedient, dataLlarga } from "./tramit-common.js";
import { runVerification } from "./verify.js";
import { makePdf } from "./pdf.js";

export function initTramit001() {
  const root = $(".tramit");
  if (!root) return;

  const views = {
    portada: $(".tramit-portada", root),
    form: $(".tramit-form", root),
    anim: $(".tramit-animacio", root),
    cert: $(".tramit-certificat", root),
  };
  const show = (name) => {
    for (const [k, el] of Object.entries(views)) if (el) el.hidden = k !== name;
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const answers = {};   // qid -> índex d'opció triada (preguntes puntuables)
  const annex = {};     // qid -> text (annex sense puntuació)
  let current = 0;

  // Prefill del nom amb el que es va introduir a Accés (si n'hi ha).
  const nomInput = $("#nom_titular", root);
  const prevNom = (store.get("pm_name") || "").trim();
  if (nomInput && prevNom && !nomInput.value) nomInput.value = prevNom;

  const host = $("[data-step-host]", root);
  const barSpan = $(".tramit-progress .bar > span", root);
  const stepLabel = $(".step-label", root);
  const errEl = $(".tramit-error", root);
  const btnPrev = $("[data-prev]", root);
  const btnNext = $("[data-next]", root);

  function renderStep() {
    const block = BLOCKS[current];
    errEl.textContent = "";
    const pct = Math.round(((current + 1) / BLOCKS.length) * 100);
    if (barSpan) barSpan.style.width = `${pct}%`;
    if (stepLabel) stepLabel.textContent = `Pas ${current + 1} de ${BLOCKS.length}`;
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.textContent =
      current === BLOCKS.length - 1 ? "Genera el certificat" : "Següent";

    const qHtml = block.questions.map((q) => {
      if (q.type === "text") {
        return `<div class="q q-text">
            <label for="${q.id}">${esc(q.text)}</label>
            <textarea id="${q.id}" name="${q.id}" rows="2" data-annex>${esc(annex[q.id] || "")}</textarea>
          </div>`;
      }
      const opts = q.options.map((o, i) => `
          <label class="opt${answers[q.id] === i ? " sel" : ""}">
            <input type="radio" name="${q.id}" value="${i}"${answers[q.id] === i ? " checked" : ""} data-q="${q.id}">
            <span>${esc(o.label)}</span>
          </label>`).join("");
      return `<fieldset class="q q-choice">
          <legend>${esc(q.text)}</legend>
          <div class="opts opts-${q.type}">${opts}</div>
        </fieldset>`;
    }).join("");

    host.innerHTML = `
      <div class="step-head">
        <span class="step-sigla">${esc(block.id)}</span>
        <h2 tabindex="-1">${esc(block.title)}</h2>
        ${block.intro ? `<p class="step-intro">${esc(block.intro)}</p>` : ""}
      </div>
      ${qHtml}`;

    // Mou el focus al títol del pas (accessibilitat en canviar de pas).
    host.querySelector(".step-head h2")?.focus();
  }

  // Recollida de respostes (delegació).
  host.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches('input[type="radio"][data-q]')) {
      answers[t.dataset.q] = Number(t.value);
      errEl.textContent = "";
      // marca visual de l'opció triada
      const fs = t.closest("fieldset");
      fs?.querySelectorAll(".opt").forEach((l) => l.classList.remove("sel"));
      t.closest(".opt")?.classList.add("sel");
    }
  });
  host.addEventListener("input", (e) => {
    if (e.target.matches("textarea[data-annex]")) annex[e.target.id] = e.target.value;
  });

  btnPrev?.addEventListener("click", () => {
    if (current > 0) { current -= 1; renderStep(); }
  });
  btnNext?.addEventListener("click", () => {
    const block = BLOCKS[current];
    if (!block.annex) {
      const missing = block.questions.find((q) => answers[q.id] == null);
      if (missing) {
        errEl.textContent = "Cal respondre totes les preguntes d'aquest apartat per continuar.";
        host.querySelector(`[name="${missing.id}"]`)?.focus();
        return;
      }
    }
    if (current < BLOCKS.length - 1) { current += 1; renderStep(); }
    else finish();
  });

  $("[data-start]", root)?.addEventListener("click", () => { show("form"); renderStep(); });

  async function finish() {
    show("anim");
    await runVerification(views.anim, ANIM_MESSAGES, 10000);
    const { winner } = computeResult(answers);
    renderCertificate(winner);
    show("cert");
    $(".cert-title", root)?.focus(); // mou el focus al resultat (accessibilitat)
  }

  function renderCertificate(winner) {
    const exp = expedient("PLM-001");
    const date = dataLlarga();
    const nom = (nomInput?.value || store.get("pm_name") || "").trim();
    const titular = nom || "Persona avaluada";
    const cat = CATEGORIES[winner];
    const obs = OBSERVACIONS[winner];

    const annexFilled = BLOCKS.find((b) => b.annex).questions
      .filter((q) => (annex[q.id] || "").trim())
      .map((q) => ({ q: q.text, a: annex[q.id].trim() }));
    const annexHtml = annexFilled.length
      ? `<div class="cert-annex"><h3>Annex d'emancipació</h3>${annexFilled
          .map((x) => `<p><strong>${esc(x.q)}</strong><br>${esc(x.a)}</p>`).join("")}</div>`
      : "";

    const certHost = $("[data-cert-host]", root);
    certHost.innerHTML = `
      <article class="cert">
        <div class="cert-band">Consell Superior de Legitimitat Artística</div>
        <h1 class="cert-title" tabindex="-1">Certificat provisional d'autolegitimació artística</h1>
        <p class="cert-result">RESULTAT: <strong>APROVAT</strong></p>
        <dl class="cert-meta">
          <div><dt>Núm. d'expedient</dt><dd>${esc(exp)}</dd></div>
          <div><dt>Data</dt><dd>${esc(date)}</dd></div>
          <div><dt>Titular</dt><dd>${esc(titular)}</dd></div>
          <div><dt>Classificació provisional</dt><dd>${esc(cat)}</dd></div>
          <div><dt>Estat</dt><dd>PROVISIONAL</dd></div>
        </dl>
        <p class="cert-body">${esc(COS_CERTIFICAT)}</p>
        <div class="cert-obs"><h3>Observacions</h3><p>${esc(obs)}</p></div>
        ${annexHtml}
        <p class="cert-foot">${esc(PEU)}</p>
        <div class="cert-actions">
          <button type="button" class="btn btn-red" data-pdf>Descarrega el certificat (PDF)</button>
          <a class="link-arrow" href="vincular.html">Ara vincula't amb el Parlamalament <span aria-hidden="true">→</span></a>
          <a class="link-arrow" href="home.html">Torna al Parlamalament <span aria-hidden="true">→</span></a>
        </div>
      </article>`;

    $("[data-pdf]", certHost)?.addEventListener("click", () => {
      makePdf({
        filename: `certificat-autolegitimacio-${exp}.pdf`,
        organisme: "Consell Superior de Legitimitat Artística",
        title: "Certificat provisional d'autolegitimació artística",
        result: "RESULTAT: APROVAT",
        meta: [
          ["Núm. d'expedient", exp],
          ["Data", date],
          ["Titular", titular],
          ["Classificació", cat],
          ["Estat", "PROVISIONAL"],
        ],
        blocks: [
          { text: COS_CERTIFICAT },
          { heading: "Observacions", text: obs },
          ...(annexFilled.length
            ? [{ heading: "Annex d'emancipació" },
               ...annexFilled.map((x) => ({ rows: [[x.q, x.a]] }))]
            : []),
        ],
        footer: PEU,
      });
    });
  }
}
