# El Parlamalament de l'Artista

Web paròdica i crítica del sector de les arts visuals, amb l'estètica institucional de la
Generalitat (gencat). Un projecte de **Jordi Bretcha** amb la col·laboració de **Manuel Latour**.

Lloc web **estàtic**, en HTML + CSS + JavaScript *vanilla* (sense frameworks ni pas de *build*).

🔗 **En línia:** https://meowrhino.github.io/parlamalament/

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
├── index.html          landing 1 · muro "Aquesta web utilitza l'antagonisme"
├── acces.html          landing 2 · Accés (captura el nom + tria de perfil)
├── captcha.html        captcha · meme estil reCAPTCHA ("persones que coneixes")
├── home.html           landing 3 · home "El Parlamalament"
│
├── assets/
│   ├── css/            un full per concepte; cada pàgina només carrega els que fa servir
│   │   ├── base.css        variables, reset, tipografia, fons (fondo.jpg)   → totes
│   │   ├── chrome.css      capçalera, nav de Ministeris, peu                → acces/captcha/home
│   │   ├── components.css  botons i enllaços reutilitzables                 → index/acces/home
│   │   ├── consent.css     landing 1                                        → index
│   │   ├── acces.css       landing 2                                        → acces
│   │   ├── captcha.css     captcha                                          → captcha
│   │   └── home.css        landing 3 (salutació, sidebar, carrusel, òrgans) → home
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
│       ├── fondo.jpg       textura de fons
│       └── captcha.png     foto de l'esdeveniment (captcha + carrusel)
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
  i autònom (no depèn de cap inclusió). És poc codi i fàcil d'editar.

## Veure-ho en local

El flux passa dades entre pàgines, així que cal servir-ho per HTTP (els mòduls ES i el
`sessionStorage` no funcionen bé obrint els `.html` amb doble clic):

```bash
cd parlamalament
python3 serve.py        # → http://127.0.0.1:4321
```

(Serveix qualsevol servidor estàtic: `python3 -m http.server`, `npx serve`, Live Server…)

## Desplegar

És estàtic: publicat amb **GitHub Pages** (branca `main`, arrel). També es pot pujar tal qual
a **Netlify** o **Vercel** sense configuració. Les rutes són relatives, així que funciona
igual sota un subdirectori (`/parlamalament/`).

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
- *"introduce tu nombre aquí"* es manté en castellà a propòsit (com al wireframe).
- A la branca **`amb-extres`** hi ha un *snapshot* amb elements decoratius que es van retirar
  (wordmark gegant, arcs, etc.) per si es volen recuperar.

---

*Un projecte de Jordi Bretcha amb la col·laboració de Manuel Latour.*
