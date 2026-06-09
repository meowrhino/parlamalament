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
│   │   └── guide.css       pàgines de guia (cinta, dades, banderins…)       → les guies
│   │
│   ├── js/             mòduls ES (carregats des de main.js amb type="module")
│   │   ├── util.js         helpers ($, $$), estat (sessionStorage), etiquetes de perfil
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

### Blocs duplicats — editar-los en bloc

Com que no hi ha pas de *build*, hi ha 4 trossos que estan copiats a diverses pàgines i que
**s'han d'editar a totes alhora** (la pàgina **`home.html`** és la referència canònica):

| Bloc | On apareix | Notes |
|---|---|---|
| `<head>` (meta + Open Graph/Twitter) | les 7 pàgines | canvia `og:title`/`og:url` per pàgina; la resta és idèntica |
| `<header>` + `<footer>` (chrome) | les 6 pàgines amb capçalera | idèntics byte a byte |
| Isotip inline (l'SVG de la "cara") | capçalera i peu de cada pàgina | usa `currentColor` (blanc al header, vermell al peu) |
| Menús de Ministeris + sidebar | dins de `home.html` | els 6 enllaços es repeteixen 4 + 1 cops |

> S'ha optat per mantenir-ho **estàtic i documentat** (i no injectar-ho per JS) perquè és un
> lloc petit i la simplicitat "edita i puja" compensa la repetició.

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
- Les **pàgines de guia** (estadístiques, drets i deures, sistema artístic) reaprofiten text
  i gràfica del TFG i fan servir el llenguatge del document (cinta marca-pàgines, dades grans,
  banderins). Van sobre **fons blanc net**: la foto de fons es desactiva a `guide.css` amb un
  bloc comentat, fàcil de revertir.
- *"introduce tu nombre aquí"* es manté en castellà a propòsit (com al wireframe).
- A la branca **`amb-extres`** hi ha un *snapshot* amb elements decoratius que es van retirar
  (wordmark gegant, arcs, etc.) per si es volen recuperar.

---

*Un projecte de Jordi Bretcha amb la col·laboració de Manuel Latour.*
