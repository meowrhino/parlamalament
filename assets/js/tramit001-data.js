// ============================================================
// tramit001-data.js — FONT ÚNICA del qüestionari d'autolegitimació (001).
//   Transcrit de "puntuacions.docx" i confirmat amb
//   "001_Matriu_Puntuacions_Completa.xlsx". Les puntuacions són INVISIBLES
//   per a l'usuari: cada opció suma punts a una o més categories.
// ============================================================

/** Categories (sigla → nom complet), ordenades de major a menor (desempat). */
export const CATEGORIES = {
  ALC: "Agent legitimador comunitari",
  APE: "Artista en procés d'emancipació",
  ADC: "Artista dependent de convocatòries",
  APL: "Artista pendent de legitimació",
  ARA: "Artista amb risc elevat d'autoexplotació",
  ASD: "Artista en situació de desafecció",
};

/** Prioritat de desempat (la primera guanya si hi ha empat de punts). */
export const ORDER = ["ALC", "APE", "ADC", "APL", "ARA", "ASD"];

/** Observacions satíriques per categoria (registre institucional-absurd). */
export const OBSERVACIONS = {
  ALC: "La persona avaluada exerceix funcions de legitimació sobre tercers sense haver " +
       "estat mai legitimada per ningú. Se li reconeix una notable autonomia simbòlica i " +
       "una perillosa tendència a organitzar-se amb els altres.",
  APE: "La persona avaluada mostra indicis sostinguts d'emancipació respecte dels " +
       "mecanismes institucionals de reconeixement. Es recomana vigilància: podria deixar " +
       "de necessitar-nos en qualsevol moment.",
  ADC: "La persona avaluada presenta una dependència estructural de convocatòries, " +
       "subvencions i seleccions. El seu reconeixement queda condicionat a l'existència " +
       "continuada de terminis oberts.",
  APL: "La persona avaluada roman a l'espera de ser legitimada per una instància externa. " +
       "El seu expedient queda obert indefinidament, com correspon a la seva condició.",
  ARA: "La persona avaluada opera amb un índex d'autoexplotació elevat. Es certifica el seu " +
       "compromís amb la pràctica i la seva disposició a finançar-la amb el propi malestar.",
  ASD: "La persona avaluada manifesta un desafecte avançat envers les institucions culturals. " +
       "Aquest Parlamalament comparteix el diagnòstic i el considera un símptoma de lucidesa.",
};

/** Peu fix del certificat. */
export const PEU =
  "Certificat vàlid fins que una altra institució opini el contrari o fins que la persona " +
  "interessada decideixi renovar-lo per si mateixa.";

/** Text automàtic del cos del certificat. */
export const COS_CERTIFICAT =
  "La persona avaluada ha superat satisfactòriament el procediment d'autolegitimació " +
  "artística i queda provisionalment reconeguda segons la categoria indicada.";

/** Missatges de l'animació de verificació (~10 s). */
export const ANIM_MESSAGES = [
  "Verificant indicadors de legitimació…",
  "Consultant registres simbòlics…",
  "Contrastant existència artística…",
  "Analitzant dependència institucional…",
  "Calculant índex de precarització…",
  "Detectant potencial emancipador…",
  "Aplicant criteris del Parlamalament…",
  "Emetent certificat provisional…",
];

// Dreceres per construir opcions amb menys soroll.
const SiNo = (yes, no) => [
  { label: "Sí", scores: yes },
  { label: "No", scores: no },
];
const opt = (label, scores) => ({ label, scores });

/**
 * Blocs del qüestionari. Cada pregunta:
 *   { id, text, type:"yesno"|"choice", options:[{label, scores:{CAT:punts}}] }
 * El bloc "annex" són preguntes obertes (type:"text") SENSE puntuació.
 */
export const BLOCKS = [
  {
    id: "A", title: "Coneixement administratiu",
    intro: "Comencem pel més evident: la teva relació amb la maquinària fiscal i associativa.",
    questions: [
      { id: "A1", text: "Tens alta d'autònom/a?", type: "yesno", options: SiNo({ APE: 1 }, { APL: 1 }) },
      { id: "A2", text: "Estàs inscrit/a al cens d'activitats econòmiques?", type: "yesno", options: SiNo({ APE: 1 }, { APL: 1 }) },
      { id: "A3", text: "Saps quin epígraf fiscal correspon a la teva pràctica artística?", type: "yesno", options: SiNo({ APE: 1 }, { APL: 1 }) },
      { id: "A4", text: "Has presentat alguna factura relacionada amb la teva pràctica durant l'últim any?", type: "yesno", options: SiNo({ APE: 1 }, { APL: 1 }) },
      { id: "A5", text: "Coneixes alguna associació professional del sector de les arts visuals?", type: "yesno", options: SiNo({ ALC: 1 }, { APL: 1 }) },
      { id: "A6", text: "Formes part d'alguna?", type: "yesno", options: SiNo({ ALC: 2 }, { APL: 1 }) },
    ],
  },
  {
    id: "B", title: "Coneixement dels recursos públics",
    intro: "Mesurem la teva familiaritat amb la cultura de la convocatòria.",
    questions: [
      { id: "B1", text: "Has sol·licitat alguna subvenció pública?", type: "yesno", options: SiNo({ ADC: 2 }, { APL: 1 }) },
      { id: "B2", text: "Has llegit alguna convocatòria pública completa?", type: "yesno", options: SiNo({ ADC: 1 }, { APL: 1 }) },
      { id: "B3", text: "Coneixes els ajuts de creació de la teva comunitat autònoma?", type: "yesno", options: SiNo({ ADC: 1 }, { APL: 1 }) },
      { id: "B4", text: "Has assistit a una sessió informativa sobre ajuts culturals?", type: "yesno", options: SiNo({ ADC: 1 }, { APL: 1 }) },
      { id: "B5", text: "Coneixes els drets culturals reconeguts per organismes públics?", type: "yesno", options: SiNo({ APE: 1 }, { APL: 1 }) },
    ],
  },
  {
    id: "C", title: "Diagnòstic de precarietat",
    intro: "Aquí no hi ha respostes correctes, només símptomes.",
    questions: [
      { id: "C1", text: "La teva pràctica artística genera ingressos regulars?", type: "yesno", options: SiNo({ APE: 2 }, { ARA: 2 }) },
      { id: "C2", text: "Has treballat gratuïtament per obtenir visibilitat?", type: "yesno", options: SiNo({ ARA: 2 }, { APE: 1 }) },
      { id: "C3", text: "Has acceptat participar en una exposició sense honoraris?", type: "yesno", options: SiNo({ ARA: 2 }, { APE: 1 }) },
      { id: "C4", text: "Has avançat diners propis per produir una obra?", type: "yesno", options: SiNo({ ARA: 1 }, { APE: 1 }) },
      { id: "C5", text: "Has abandonat un projecte per manca de recursos?", type: "yesno", options: SiNo({ ARA: 2 }, { APE: 1 }) },
      { id: "C6", text: "Has pensat deixar la pràctica artística per motius econòmics?", type: "yesno", options: SiNo({ ASD: 2 }, { APE: 1 }) },
    ],
  },
  {
    id: "D", title: "Diagnòstic de desafecte",
    intro: "Comprovem el teu grau de fe en les institucions.",
    questions: [
      { id: "D1", text: "Participes en alguna associació professional?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 2 }) },
      { id: "D2", text: "Has assistit a una assemblea sectorial en els últims dos anys?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 2 }) },
      { id: "D3", text: "Has participat en alguna consulta pública relacionada amb cultura?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 2 }) },
      { id: "D4", text: "Consideres que les institucions culturals representen els teus interessos?", type: "yesno", options: SiNo({ ADC: 1 }, { ASD: 2 }) },
      { id: "D5", text: "Creus que la teva opinió té algun impacte en les polítiques culturals?", type: "yesno", options: SiNo({ ADC: 1 }, { ASD: 2 }) },
      { id: "D6", text: "Saps qui representa institucionalment el sector de les arts visuals?", type: "yesno", options: SiNo({ APE: 1 }, { ASD: 2 }) },
    ],
  },
  {
    id: "E", title: "Emancipació col·lectiva",
    intro: "Ara la part perillosa: la teva relació amb els altres.",
    questions: [
      { id: "E1", text: "Formes part d'un col·lectiu artístic?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 1 }) },
      { id: "E2", text: "Has compartit recursos amb altres artistes?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 1 }) },
      { id: "E3", text: "Has recomanat una convocatòria a una altra persona?", type: "yesno", options: SiNo({ ALC: 1 }, { ASD: 1 }) },
      { id: "E4", text: "Has ajudat a produir una obra d'una altra persona?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 1 }) },
      { id: "E5", text: "Has participat en algun projecte comunitari?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 1 }) },
      { id: "E6", text: "Consideres que la cooperació és necessària per millorar les condicions del sector?", type: "yesno", options: SiNo({ ALC: 2 }, { ASD: 1 }) },
    ],
  },
  {
    id: "V", title: "Verificació de l'existència artística",
    intro: "Necessitem confirmar, administrativament, que existeixes com a artista.",
    questions: [
      { id: "V1", text: "Des de quan sospites que ets artista?", type: "choice", options: [
        opt("Abans de saber què era un artista", { ALC: 2 }),
        opt("Des que practico regularment", { APE: 2 }),
        opt("Des que altres m'ho van dir", { APL: 2 }),
        opt("Encara no n'estic segur/a", { ASD: 2 }),
      ] },
      { id: "V2", text: "Alguna institució t'ho ha confirmat?", type: "yesno", options: SiNo({ ADC: 1 }, { APE: 2 }) },
      { id: "V3", text: "Si cap institució t'ho ha confirmat, continues pensant que ho ets?", type: "yesno", options: SiNo({ APE: 3 }, { APL: 3 }) },
      { id: "V4", text: "Has produït alguna cosa que ningú t'ha demanat?", type: "yesno", options: SiNo({ APE: 2 }, { ADC: 2 }) },
      { id: "V5", text: "Alguna vegada has treballat gratis amb l'esperança de ser reconegut?", type: "yesno", options: SiNo({ ARA: 3 }, { APE: 1 }) },
      { id: "V6", text: "Quantes vegades t'han dit que la teva pràctica és «interessant»?", type: "choice", options: [
        opt("Moltes", { ADC: 2 }),
        opt("Algunes", { APE: 1 }),
        opt("Cap", { ASD: 1 }),
      ] },
    ],
  },
  {
    id: "L", title: "Diagnòstic de legitimació",
    intro: "On busques el teu reconeixement diu molt de tu.",
    questions: [
      { id: "L1", text: "Quina és la principal font de reconeixement de la teva pràctica?", type: "choice", options: [
        opt("Acadèmica", { ADC: 2 }),
        opt("Institucional", { ADC: 3 }),
        opt("Comercial", { APE: 1 }),
        opt("Comunitària", { ALC: 3 }),
        opt("Autoreconeixement", { APE: 3 }),
      ] },
      { id: "L2", text: "Quantes exposicions necessites per sentir-te legitimat?", type: "choice", options: [
        opt("Cap", { APE: 3 }),
        opt("Una o dues", { ADC: 1 }),
        opt("Tantes com sigui possible", { APL: 3 }),
      ] },
      { id: "L3", text: "Qui té més poder sobre la teva trajectòria?", type: "choice", options: [
        opt("Jo mateix/a", { APE: 3 }),
        opt("La comunitat", { ALC: 2 }),
        opt("Les institucions", { ADC: 3 }),
        opt("Els recursos econòmics", { ARA: 2 }),
        opt("No ho sé", { ASD: 2 }),
      ] },
      { id: "L4", text: "Esperes ser seleccionat o prefereixes crear les teves pròpies oportunitats?", type: "choice", options: [
        opt("Espero ser seleccionat", { ADC: 3 }),
        opt("Una mica de cada", { ADC: 1, APE: 1 }),
        opt("Creo les meves oportunitats", { APE: 3 }),
      ] },
    ],
  },
  {
    id: "P", title: "Diagnòstic de precarització",
    intro: "Posem números a la teva dedicació.",
    questions: [
      { id: "P1", text: "Quantes hores setmanals dediques a la pràctica artística?", type: "choice", options: [
        opt("Menys de 5", { ASD: 1 }),
        opt("Entre 5 i 20", { APE: 1 }),
        opt("Més de 20", { ARA: 2 }),
      ] },
      { id: "P2", text: "Quantes d'aquestes hores són remunerades?", type: "choice", options: [
        opt("Gairebé totes", { APE: 2 }),
        opt("Aproximadament la meitat", { ADC: 1 }),
        opt("Molt poques", { ARA: 3 }),
        opt("Cap", { ARA: 4 }),
      ] },
      { id: "P3", text: "Pots sostenir la teva pràctica sense ajudes externes?", type: "yesno", options: SiNo({ APE: 2 }, { ADC: 2 }) },
      { id: "P4", text: "Quina emoció defineix millor la teva relació amb el sector?", type: "choice", options: [
        opt("Esperança", { APE: 2 }),
        opt("Competició", { ADC: 2 }),
        opt("Cansament", { ARA: 2 }),
        opt("Desafecció", { ASD: 4 }),
        opt("Entusiasme", { ALC: 2 }),
      ] },
    ],
  },
  {
    id: "PC", title: "Participació col·lectiva",
    intro: "L'última comprovació abans de les preguntes-trampa.",
    questions: [
      { id: "PC1", text: "Has ajudat a legitimar la pràctica d'una altra persona?", type: "yesno", options: SiNo({ ALC: 4 }, {}) },
      { id: "PC2", text: "Consideres que la teva pràctica depèn d'altres persones?", type: "yesno", options: SiNo({ ALC: 2 }, { APE: 2 }) },
    ],
  },
  {
    id: "T", title: "Preguntes-trampa del Parlamalament",
    intro: "Respon amb sinceritat. O no. Ja ho sabrem igualment.",
    questions: [
      { id: "T1", text: "Consideres que una persona és artista només quan una institució la reconeix?", type: "yesno", options: SiNo({ APL: 2 }, { APE: 2 }) },
      { id: "T2", text: "Creus que una exposició legitima una pràctica?", type: "yesno", options: SiNo({ ADC: 2 }, { APE: 2 }) },
      { id: "T3", text: "Has necessitat mai una carta de recomanació per ser considerat artista?", type: "yesno", options: SiNo({ APL: 2 }, { APE: 1 }) },
      { id: "T4", text: "Consideres que la legitimitat artística es pot autodeclarar?", type: "yesno", options: SiNo({ ALC: 3 }, { APL: 2 }) },
      { id: "T5", text: "Estàs disposat/da a autolegitimar-te?", type: "yesno", options: SiNo({ ALC: 5 }, { ASD: 3 }) },
    ],
  },
  {
    id: "AN", title: "Annex d'emancipació", annex: true,
    intro: "Aquestes respostes no puntuen. Són per a tu, i per a qui les vulgui llegir.",
    questions: [
      { id: "AN1", text: "Quina informació necessites i encara no tens?", type: "text" },
      { id: "AN2", text: "Amb quines persones voldries connectar?", type: "text" },
      { id: "AN3", text: "Quin recurs pots oferir a altres persones?", type: "text" },
      { id: "AN4", text: "Quin obstacle t'impedeix desenvolupar la teva pràctica?", type: "text" },
      { id: "AN5", text: "Quina acció col·lectiva podria millorar la situació del teu context?", type: "text" },
    ],
  },
];

/** Suma les puntuacions de les respostes triades i retorna la categoria guanyadora. */
export function computeResult(answers) {
  const totals = Object.fromEntries(ORDER.map((k) => [k, 0]));
  for (const block of BLOCKS) {
    if (block.annex) continue;
    for (const q of block.questions) {
      const choice = answers[q.id];
      if (choice == null) continue;
      const scores = q.options[choice]?.scores || {};
      for (const [cat, pts] of Object.entries(scores)) totals[cat] += pts;
    }
  }
  // Categoria guanyadora: màxim de punts, desempat per ORDER.
  let winner = ORDER[0];
  for (const cat of ORDER) {
    if (totals[cat] > totals[winner]) winner = cat;
  }
  return { winner, totals };
}
