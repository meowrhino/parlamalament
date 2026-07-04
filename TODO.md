# TODO · El Parlamalament de l'Artista

Pendents recollits el 15/06/2026. Es revisaran més endavant (l'essencial ja és en línia).

## Pendent d'en Jordi (operatiu)
- [ ] Restringir el domini permès a `parlamalament.com` al panell de **Web3Forms** (anti-abús de la clau pública). Els formularis 002/003 ja funcionen; això és protecció extra. *(Compte: el domini és el nou, `parlamalament.com` — no el vell `meowrhino.github.io`.)*

## Dubtes / decisions obertes
- [ ] **Punt 6 (captcha):** salut personalitzat també a la *pàgina del captcha*, o n'hi ha prou amb el de la home? (ara el salut és a la home, després del captcha).
- [ ] **Durada de l'animació del tràmit 001:** ara ~10 s (el brief conceptual deia 2-3 s). Escurçar-la?
- [ ] **Resum de puntuacions al final del 001:** el doc ho donava com a *opcional*; ara les puntuacions són invisibles. Mostrar-lo?
- [ ] **Nom del Tràmit 003:** confirmat "Feina, encàrrec o vinculació" — coherent a tot arreu (cap acció pendent, només revisar).

## Millores cosmètiques proposades
- [ ] **Idea 1 · Jerarquia de botons** (primari ple / secundari contorn) a home i a les cards de Vincular.
- [ ] **Idea 2 · Segell oficial** tipus tampó ("APROVAT"/"REGISTRAT") al certificat 001 i als justificants 002/003.
- [ ] **Idea 8 · Desplegables:** indicador/navegació més senzill amb `^` / `⌄` (no fletxes). *(A concretar amb en Manu: és l'indicador visual del menú o la navegació amb teclat?)*

## Pulits de codi opcionals (baix valor)
- [ ] `makeViews()`: DRY de la funció `show()` (duplicada a `tramit001.js` i `tramit-common.js`).
- [ ] Comentaris de secció (`/* ---- */`) a `tramit001.js` i `home.css`, per igualar la convenció de la resta.
- [ ] `<head>` idèntic byte a byte a les 22 pàgines (normalitzar comentaris/espais; només cosmètic).
- [ ] README: corregir la nota de l'isotip (és CSS via `.mark`, no SVG inline).

## Contingut pendent (dels briefs)
- [ ] **Institut del Malestar Cultural** → "Estadístiques i informes del context": afegir els **PDFs** ("afegir pdfs més endavant").
- [ ] **Observatori de la meritocràcia** → contingut real dels 3 subapartats "en preparació": Ranking de convocatòries · Indicadors d'inclusió i exclusió cultural · Comptadors de propostes denegades.

## Infraestructura
- [ ] **Consolidar en un sol repositori:** portar tot al repo `parlamalament` (sense el "2") i esborrar `parlamalament2`. Cal decidir la URL/domini final, actualitzar les `og:url` de les 22 pàgines, configurar GitHub Pages al repo destí i esborrar/renombrar els repos des de GitHub (l'eina actual no té permís per esborrar repos).
