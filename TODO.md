# TODO · El Parlamalament de l'Artista

Pendents recollits el 15/06/2026. Es revisaran més endavant (l'essencial ja és en línia).

## Fet el 15/07/2026 (sessió amb en Manu)
- [x] Capçalera i peu centralitzats a `chrome.js` (abans copiats byte a byte a 22 HTML).
- [x] Tret el `.menu-head` (l'etiqueta "OM · Òrgan executiu") de tots els desplegables.
- [x] Tret "aprox / any" de la xifra 1540 (cens d'artistes) a `estadistiques.html`.
- [x] Nou desplegable "Documents d'interès" (Pla de Drets Culturals · Declaració Universal dels Drets Humans · Declaració de Friburg).
- [x] En mòbil la hamburguesa "Organismes" plega **només** els organismes; "Documents d'interès" i "Guia" queden sempre visibles.
- [x] Divisors de la nav entre elements (sense línies penjant en fer wrap).
- [x] Submenú de l'acordió mòbil a amplada completa (abans es quedava estret a mig ample).
- [x] Títol dels panells dels tràmits (legend) ara seu DINS del panell, no sobre la vora (no xoca en fer wrap a mòbil).

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
- [x] **Idea 8 · Desplegables:** indicador visual amb `^` / `⌄` (fet; la nav ja els fa servir). *(Si calia també navegació amb teclat, queda per concretar.)*

## Pulits de codi opcionals (baix valor)
- [ ] `makeViews()`: DRY de la funció `show()` (duplicada a `tramit001.js` i `tramit-common.js`).
- [ ] Comentaris de secció (`/* ---- */`) a `tramit001.js` i `home.css`, per igualar la convenció de la resta.
- [ ] `<head>` idèntic byte a byte a les 22 pàgines (normalitzar comentaris/espais; només cosmètic).
- [x] README: corregir la nota de l'isotip (és CSS via `.mark`, no SVG inline) — fet en centralitzar el chrome.

## Contingut pendent (dels briefs)
- [~] **Institut del Malestar Cultural** → "Estadístiques i informes del context": afegits els **enllaços** als 5 informes (CONCA / Dept. Cultura) a `estadistiques.html`. *Pendent:* adjuntar els **PDFs** físics si es volen allotjar al repo (ara són enllaços HDL als documents).
- [ ] **Observatori de la meritocràcia** → contingut real dels 3 subapartats "en preparació": Ranking de convocatòries · Indicadors d'inclusió i exclusió cultural · Comptadors de propostes denegades.

## Infraestructura
- [ ] **Consolidar en un sol repositori:** portar tot al repo `parlamalament` (sense el "2") i esborrar `parlamalament2`. Cal decidir la URL/domini final, actualitzar les `og:url` de les 22 pàgines, configurar GitHub Pages al repo destí i esborrar/renombrar els repos des de GitHub (l'eina actual no té permís per esborrar repos).
