// ============================================================
// tramit003.js — PLM-003 · Tràmit de Sol·licitud de Feina, Encàrrec o
//   Vinculació. Formulari de candidatura → enviament → justificant.
// ============================================================
import { $ } from "./util.js";
import { registerTramit } from "./tramit-common.js";

export function initTramit003() {
  const root = $(".tramit");
  if (!root) return;
  registerTramit(root, {
    prefix: "PLM-003",
    organisme: "Agència Estatal del Reconeixement Mutu",
    subject: "PLM-003 · Sol·licitud de vinculació",
    animMs: 7000,
    animMessages: [
      "Registrant candidatura…",
      "Verificant disponibilitat…",
      "Contrastant interessos…",
      "Analitzant potencial de col·laboració…",
      "Assignant número d'expedient…",
      "Generant justificant…",
      "Tràmit registrat.",
    ],
    justifMessage:
      "La sol·licitud ha estat incorporada al Registre Provisional de Vinculacions, " +
      "Col·laboracions i Expectatives Laborals del Parlamalament de l'Artista.",
    finalPhrase:
      "La presentació d'aquest tràmit no garanteix una feina, però deixa constància " +
      "administrativa del desig de treballar plegats.",
    filenameStem: "justificant-plm-003",
    backHref: "vincular.html",
    nextHref: "tramit-002.html",
    nextLabel: "Fes també el tràmit 002",
  });
}
