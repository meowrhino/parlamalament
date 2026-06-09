# El Parlamalament de l'Artista

Web paròdica i crítica del sector de les arts visuals, amb l'estètica institucional de la
Generalitat (gencat). Un projecte de **Jordi Bretcha** amb la col·laboració de **Manuel Latour**.

Lloc web **estàtic**, en HTML + CSS + JavaScript *vanilla* (sense frameworks ni pas de *build*).

🔗 **En línia (v2):** https://meowrhino.github.io/parlamalament2/
(La v1 — l'edició anterior amb el domini propi `parlamalament.com` — es manté en un repositori a part.)

---

## El flux

```
index (landing 1)  ── acceptar / rebutjar ─────────────►  acces (landing 2)
                                                              │  (captura el NOM; sense nom → alerta)
                                                              ├─ Soc artiste precari ───────►  home
                                                              ├─ Soc autònom també precari ─►  home
                                                              └─ Soc artiste legitimat ─────►  captcha
captcha ── "Verifica" (selecciona ≥1 quadre) ──────────────────────────────────────────►  home
home (landing 3) ── "Fes el tràmit per legitimar-te" ──────────────────────────────────►  captcha
```

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
│   │   ├── chrome.css      capçalera, nav de Ministeris, peu                → acces/captcha/home
│   │   ├── components.css  botons i enllaços reutilitzables                 → index/acces/home
│   │   ├── consent.css     landing 1                                        → index
│   │   ├── acces.css       landing 2                                        → acces
│   │   ├── captcha.css     captcha                                          → captcha
│   │   ├── home.css        landing 3 (salutació, sidebar, carrusel, òrgans) → home
│   │   ├── guide.css       pàgines de guia (cinta, dades, banderins…)       → les guies
│   │   └── notfound.css    pàgina "no trobat"                               → 404
│   │
│   ├── js/             mòduls ES (carregats des de main.js amb type="module")
│   │   ├── util.js         helpers ($, $$), estat (sessionStorage), etiquetes de perfil
│   │   ├── chrome.js       LLISTA DE SECCIONS + construeix nav i sidebar (una sola font)
│   │   ├── nav.js          desplegables dels Ministeris
│   │   ├── consent.js      landing 1
│   │   ├── acces.js        landing 2 (validació del nom + navegació)
│   │   ├── captcha.js      construcció de la quadrícula + verificació
│   │   ├── carousel.js     carrusel d'imatges
│   │   ├── home.js         salutació + arrenca el carrusel
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

La **barra de Ministeris** (desplegables) i la **sidebar "Funcions"** es construeixen per JS
des d'**una sola llista** —l'array `SECTIONS` de `assets/js/chrome.js`— que reprodueix l'índex
del TFG. Així s'edita en un únic lloc i apareix igual a totes les pàgines (home + guies).

**Per afegir/activar una secció:** edita `SECTIONS` a `chrome.js`. Si una secció encara no té
pàgina, posa-li `href: null` i l'enllaç anirà a `404.html` ("no trobat"). Quan creïs la pàgina,
canvia el `null` per `"la-teva-pagina.html"` i ja queda enllaçada a tot arreu.

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

És estàtic: publicat amb **GitHub Pages** (branca `main`, arrel) sota el subdirectori
`https://meowrhino.github.io/parlamalament2/`. Les rutes internes són relatives, així que
funciona igual sota subdirectori o amb domini propi. També es pot pujar tal qual a **Netlify**
o **Vercel** sense configuració. (No hi ha `CNAME`: aquesta edició no usa domini propi.)

> Nota: les URL absolutes d'Open Graph (`og:url` / `og:image`) apunten a
> `meowrhino.github.io/parlamalament2`. Si es canvia de domini o de repositori, cal
> actualitzar-les als `<head>` de les pàgines.

## Com editar

| Vols canviar… | On |
|---|---|
| Textos | directament a cada `.html` |
| Colors i tipografia | variables a dalt de `assets/css/base.css` (`:root`) |
| El fons | substitueix `assets/img/fondo.jpg` |
| La imatge i mida del captcha | atributs `data-img` / `data-cols` / `data-rows` a `captcha.html` |
| Afegir fotos al carrusel | duplica un `<div class="slide"><img …></div>` a `home.html` (els controls s'activen sols amb ≥2 imatges) |

La tipografia és `Helvetica Neue, Helvetica, Arial…` — la corporativa de gencat (no
s'empaqueta cap fitxer de font per llicència; s'usa la del sistema).

## Notes

- El text del muro fa servir la variant **"antagonisme"** del PDF (pàg. 3). La variant
  *"ironia"* del wireframe és un canvi d'una línia a `index.html`.
- El **captcha** és una broma: amb seleccionar ≥1 quadre i prémer *Verifica* ja "legitima".
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
