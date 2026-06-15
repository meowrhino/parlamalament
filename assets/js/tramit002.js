// ============================================================
// tramit002.js — PLM-002 · Tràmit d'Incorporació de Propostes, Recursos
//   i Col·laboracions. Formulari de registre → enviament → justificant.
// ============================================================
import { $ } from "./util.js";
import { registerTramit } from "./tramit-common.js";

export function initTramit002() {
  const root = $(".tramit");
  if (!root) return;
  registerTramit(root, {
    prefix: "PLM-002",
    organisme: "Agència Estatal del Reconeixement Mutu",
    subject: "PLM-002 · Nova proposta o col·laboració",
    animMs: 6000,
    animMessages: [
      "Registrant iniciativa…",
      "Verificant potencial de col·laboració…",
      "Contrastant disponibilitat de recursos…",
      "Assignant número d'expedient…",
      "Generant informe preliminar…",
      "Tràmit registrat.",
    ],
    justifMessage:
      "La proposta ha estat incorporada al Registre Provisional d'Iniciatives, Recursos i " +
      "Col·laboracions del Parlamalament de l'Artista.",
    finalPhrase:
      "La incorporació al registre no implica cap compromís de desenvolupament: garanteix, " +
      "només, que la proposta existeix administrativament.",
    filenameStem: "justificant-plm-002",
    backHref: "vincular.html",
    nextHref: "tramit-003.html",
    nextLabel: "Continua amb el tràmit 003",
  });
}
