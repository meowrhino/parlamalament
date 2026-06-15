# El Parlamalament de l'Artista

Web paròdica i crítica del sector de les arts visuals, amb l'estètica institucional de la
Generalitat (gencat). Un projecte de **Jordi Bretcha** amb la col·laboració de **Manuel Latour**.

Lloc web **estàtic**, en HTML + CSS + JavaScript *vanilla* (sense frameworks ni pas de *build*).

🔗 **En línia:** https://parlamalament.com
(Edició única, amb domini propi. Les versions anteriors s'han consolidat en aquest repositori.)

---

## El flux

```
index (landing 1)  ── acceptar / rebutjar ─────────────►  acces (landing 2)
                                                              │  (captura el NOM; sense nom → alerta)
                                                              ├─ Soc artiste precari ───────►  home
                                                              ├─ Soc autònom també precari ─►  home
                                                              └─ Soc artiste legitimat ─────►  captcha
captcha ── "Verifica" (selecciona ≥1 quadre) ──────────────────────────────────────────►  tramit-001
home (landing 3) ── "Fes el tràmit per legitimar-te" ──────────────────────────────────►  tramit-001
acces ── "Vincular-te amb el Parlamalament" ───────────────────────────────────────────►  vincular (002 + 003)
```

### Els tràmits

Tres tràmits administratius ficticis amb la mateixa estètica institucional (seu electrònica).
Tots tres generen un **PDF** amb [jsPDF](https://github.com/parallax/jsPDF) (carregat per CDN).

| Tràmit | Què fa | Sortida |
|---|---|---|
| **001** · `tramit-001.html` | Qüestionari satíric (50 preguntes puntuables ocultes + 5 obertes) → animació de verificació → **certificat**. El resultat és sempre **APROVAT**; només varia la categoria (la de més punts entre 6). | Certificat PDF |
| **002** · `tramit-002.html` | Registre de propostes, recursos i col·laboracions (`PLM-002`). | Justificant PDF + email |
| **003** · `tramit-003.html` | Sol·licitud de feina, encàrrec o vinculació (`PLM-003`). | Justificant PDF + email |

- El **001** és autocontingut (no envia res): el càlcul de la categoria viu a `assets/js/tramit001-data.js`
  (la **matriu de puntuacions**, font única) i `assets/js/tramit001.js`.
- El **002/003** envien el formulari per email amb **Web3Forms** (servei sense backend) a
  `jordi.bretcha@gmail.com`. L'*access key* viu a `WEB3FORMS_ACCESS_KEY` dins
  `assets/js/tramit-common.js` (**ja configurada**). Si la constant torna a ser el placeholder
  `POSA-AQUI-LA-ACCESS-KEY`, els tràmits passen a **mode de prova** (no s'envia res, però el flux es prova).
  Els documents es comparteixen mitjançant un **enllaç** (camp `enllac_docs`): el pla gratuït de Web3Forms
  **no permet pujar fitxers**, així que la persona enganxa un enllaç (Drive, WeTransfer, web…) en comptes
  d'adjuntar un PDF.
- `vincular.html` és el **hub** que enllaça els tràmits 002 i 003.

#### Enviament dels formularis (Web3Forms) — ja actiu

La *access key* d'en Jordi ja està posada, així que els tràmits 002/003 **envien de debò** a
`jordi.bretcha@gmail.com`. Per regenerar-la o canviar de compte: a **https://web3forms.com** escriu
l'email de destinació, prem **"Create Access Key"**, copia la clau que arriba a aquell Gmail i
enganxa-la a `WEB3FORMS_ACCESS_KEY`.

> **Recomanat:** al panell de Web3Forms, restringeix els dominis permesos a `meowrhino.github.io`
> perquè ningú més pugui fer servir la clau pública. Els formularis porten un *honeypot* (`botcheck`)
> anti-spam.

El **nom** i el **perfil** viatgen entre pàgines amb `sessionStorage`; la home saluda
*"hola {nom}, artista {perfil}"*.

## Estructura

```
parlamalament/
├── index.html            landing 1 · muro "Aquesta web utilitza l'antagonisme"
├── acces.html            landing 2 · Accés (captura el nom + tria de perfil)
├── captcha.html          captcha · meme estil reCAPTCHA ("persones que coneixes")
├── home.html             landing 3 · home "El Parlamalament"
│
│   tràmits (seu electrònica, generen PDF amb jsPDF):
├── tramit-001.html       001 · certificat provisional d'autolegitimació artística
├── tramit-002.html       002 · incorporació de propostes, recursos i col·laboracions (PLM-002)
├── tramit-003.html       003 · sol·licitud de feina, encàrrec o vinculació (PLM-003)
├── vincular.html         hub "Vincular-te" → tràmits 002 i 003
│
│   pàgines de guia ("Per saber-ne més", data-page="guide", reaprofiten el TFG):
├── guia.html             índex/portada de la guia (sumari + dibuix de l'edifici)
├── estadistiques.html    estadístiques de precarietat del sector
├── drets-i-deures.html   drets i deures dels artistes + treball parlamalamentari (trofeus)
├── sistema-artistic.html marc legal + directori + hemicicle "Composició actual"
│   … i la resta de l'índex del TFM (seccions 6–15, text literal):
├── organs.html · funcions.html · funcio-emancipativa.html · funcio-creacio.html
├── funcio-aprovacio.html · sistema-treball.html · parlamalament-obert.html
├── historia.html · historia-context.html · altres-institucions.html
├── 404.html              pàgina "no trobat" (logo centrat) · la serveix GitHub Pages
│
├── assets/
│   ├── css/            un full per concepte; cada pàgina només carrega els que fa servir
│   │   ├── base.css        variables, reset, tipografia, fons (fondo.jpg)   → totes
│   │   ├── chrome.css      capçalera, nav d'Organismes, peu                 → acces/captcha/home/tràmits
│   │   ├── components.css  botons i enllaços reutilitzables                 → index/acces/home
│   │   ├── consent.css     landing 1                                        → index
│   │   ├── acces.css       landing 2                                        → acces
│   │   ├── captcha.css     captcha                                          → captcha
│   │   ├── home.css        landing 3 (salutació, sidebar, carrusel, òrgans) → home
│   │   ├── guide.css       pàgines de guia (cinta, dades, banderins…)       → les guies + vincular
│   │   ├── tramit.css      tràmits (assistent, formularis, animació, certificat) → tràmits 001/002/003
│   │   └── notfound.css    pàgina "no trobat"                               → 404
│   │
│   ├── js/             mòduls ES (carregats des de main.js amb type="module")
│   │   ├── util.js         helpers ($, $$), estat (sessionStorage), etiquetes de perfil
│   │   ├── chrome.js       LLISTA DE SECCIONS + ORGANISMES + construeix nav i sidebar (una sola font)
│   │   ├── nav.js          desplegables dels Organismes
│   │   ├── consent.js      landing 1
│   │   ├── acces.js        landing 2 (validació del nom + navegació)
│   │   ├── captcha.js      construcció de la quadrícula + verificació (→ tramit-001)
│   │   ├── carousel.js     carrusel d'imatges
│   │   ├── home.js         salutació + arrenca el carrusel
│   │   ├── tramit-common.js  utilitats dels tràmits (animació, expedient, PDF jsPDF, enviament Web3Forms)
│   │   ├── tramit001-data.js matriu de puntuacions del 001 (font única) + càlcul de la categoria
│   │   ├── tramit001.js    assistent + certificat del tràmit 001
│   │   ├── tramit002.js     config del tràmit 002 (PLM-002)
│   │   ├── tramit003.js     config del tràmit 003 (PLM-003)
│   │   └── main.js         punt d'entrada: dispatcha segons data-page del <body>
│   │
│   └── img/
│       ├── fondo.jpg          textura de fons (landing/app)
│       ├── captcha.jpg        foto de l'esdeveniment (captcha + carrusel)
│       ├── logo.svg           isotip (la "cara"); també incrustat inline als HTML
│       ├── favicon.svg        icona de pestanya
│       ├── apple-touch-icon.png / og.png   icones + previsualització social
│       ├── mapa-poblacio.png  infografia de població (estadístiques)
│       ├── oradors.png        pictograma del faristol (drets i deures)
│       ├── edifici-detall.png dibuix del Palau Nacional (sistema artístic)
│       ├── edifici.png        façana del Palau Nacional, portada (guia.html)
│       ├── hemicicle.png      hemicicle "Composició actual" (sistema artístic)
│       └── trofeu-a/bc/d.png  trofeus graduats dels grups d'artistes (drets i deures)
│
├── serve.py            servidor estàtic local per provar el flux complet
├── originals/          materials font (PDF, wireframes) — ignorats pel repo
└── README.md
```

### Per què aquesta arquitectura

- **CSS per concepte:** cada pàgina enllaça només els fulls que necessita (p. ex. la
  landing 1 no carrega el `chrome.css`). Les *media queries* viuen dins del full al qual
  pertanyen.
- **JS en mòduls ES:** `main.js` mira l'atribut `data-page` del `<body>` i crida només la
  inicialització d'aquella pàgina. Cada mòdul fa una cosa i s'entén per separat.
- **Capçalera/peu repetits a cada HTML** a propòsit: així cada pàgina és un document complet
  i autònom (no depèn de cap inclusió ni de JavaScript per pintar-se, cosa que manté intactes
  el SEO i les previsualitzacions en compartir).

### Navegació: una sola font (`chrome.js`)

La **barra d'Organismes** (desplegables) i la **sidebar "Funcions"** es construeixen per JS
des de `assets/js/chrome.js`. Hi ha dues llistes: `SECTIONS` (l'índex del TFG, que alimenta la
sidebar i el desplegable "Guia") i `ORGANISMES` (els quatre òrgans executius —abans Ministeris—
amb els seus subapartats propis). Així s'edita en un únic lloc i apareix igual a totes les
pàgines (home + guies).

**Els organismes** (Institut del Malestar Cultural, Observatori de la meritocràcia, Consell
Superior de Legitimitat Artística, Agència Estatal del Reconeixement Mutu) tenen cadascun el seu
menú de subapartats. Cada item pot ser `{ href }`, `{ soon:true }` (encara sense pàgina → va a
`404.html` atenuat) o `{ external:true }` (s'obre en una pestanya nova).

**Per afegir/activar una secció de la guia:** edita `SECTIONS` a `chrome.js`. Si una secció encara
no té pàgina, posa-li `href: null` i l'enllaç anirà a `404.html` ("no trobat"). Quan creïs la
pàgina, canvia el `null` per `"la-teva-pagina.html"` i ja queda enllaçada a tot arreu.

### Blocs encara duplicats (editar-los en bloc)

Sense pas de *build*, aquests trossos segueixen copiats a cada pàgina (la **`home.html`** és la
referència). El `<head>`/OG **ha de** quedar estàtic (els robots de previsualització no executen JS):

| Bloc | On apareix | Notes |
|---|---|---|
| `<head>` (meta + Open Graph/Twitter) | totes les pàgines | canvia `og:title`/`og:url` per pàgina; la resta és idèntica |
| `<header>` + `<footer>` (chrome) | totes les pàgines amb capçalera | idèntics byte a byte |
| Isotip inline (l'SVG de la "cara") | capçalera i peu de cada pàgina | usa `currentColor` (blanc al header, vermell al peu) |

## Veure-ho en local

El flux passa dades entre pàgines, així que cal servir-ho per HTTP (els mòduls ES i el
`sessionStorage` no funcionen bé obrint els `.html` amb doble clic):

```bash
cd parlamalament
python3 serve.py        # → http://127.0.0.1:4321
```

(Serveix qualsevol servidor estàtic: `python3 -m http.server`, `npx serve`, Live Server…)

## Desplegar

És estàtic: publicat amb **GitHub Pages** (branca `main`, arrel) amb el domini propi
**`parlamalament.com`** (fitxer `CNAME` a l'arrel). Les rutes internes són relatives, així que
funciona igual sota subdirectori o amb domini propi. També es pot pujar tal qual a **Netlify**
o **Vercel** sense configuració.

> Nota: les URL absolutes d'Open Graph (`og:url` / `og:image`) apunten a
> `https://parlamalament.com`. Si es canvia de domini o de repositori, cal
> actualitzar-les als `<head>` de les pàgines i el fitxer `CNAME`.

## Com editar

| Vols canviar… | On |
|---|---|
| Textos | directament a cada `.html` |
| Colors i tipografia | variables a dalt de `assets/css/base.css` (`:root`) |
| El fons | substitueix `assets/img/fondo.jpg` |
| La imatge i mida del captcha | atributs `data-img` / `data-cols` / `data-rows` a `captcha.html` |
| Afegir fotos al carrusel | duplica un `<div class="slide"><img …></div>` a `home.html` (els controls s'activen sols amb ≥2 imatges) |
| Les preguntes/puntuacions del tràmit 001 | `assets/js/tramit001-data.js` (matriu única) |
| Activar l'enviament dels tràmits 002/003 | posa la *access key* de Web3Forms a `WEB3FORMS_ACCESS_KEY` dins `assets/js/tramit-common.js` |
| Els organismes i els seus subapartats | array `ORGANISMES` a `assets/js/chrome.js` |

La tipografia és `Helvetica Neue, Helvetica, Arial…` — la corporativa de gencat (no
s'empaqueta cap fitxer de font per llicència; s'usa la del sistema).

## Notes

- El text del muro fa servir la variant **"antagonisme"** del PDF (pàg. 3). La variant
  *"ironia"* del wireframe és un canvi d'una línia a `index.html`.
- El **captcha** és una broma: amb seleccionar ≥1 quadre i prémer *Verifica* ja "legitima" i
  entra al **tràmit 001** (certificat d'autolegitimació).
- Les **pàgines de guia** (estadístiques, drets i deures, sistema artístic, guia) reaprofiten
  text i gràfica del TFG i el llenguatge del document (cinta marca-pàgines, dades grans,
  banderins). Mostren la **foto de fons com la home** i el contingut s'assenta sobre un
  **panell blanc** (paper) per llegibilitat.
- Les **seccions sense pàgina** (índex 6–15) van a `404.html` ("No hem trobat el que vols").
  GitHub Pages també serveix `404.html` per a qualsevol URL inexistent.
- *"introduce tu nombre aquí"* es manté en castellà a propòsit (com al wireframe).
- A la branca **`amb-extres`** hi ha un *snapshot* amb elements decoratius que es van retirar
  (wordmark gegant, arcs, etc.) per si es volen recuperar.

---

*Un projecte de Jordi Bretcha amb la col·laboració de Manuel Latour.*
