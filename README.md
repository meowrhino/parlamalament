# El Parlamalament de l'Artista

Web paròdica i crítica del sector de les arts visuals, amb l'estètica institucional de la
Generalitat (gencat). Un projecte de **Jordi Bretcha** amb la col·laboració de **Manuel Latour**.

Lloc web estàtic en **HTML + CSS + JavaScript vanilla** (sense frameworks ni pas de *build*).

---

## Estructura

```
parlamalament/
├── index.html         landing 1 · muro "Aquesta web utilitza la ironia"
├── acces.html         landing 2 · Accés (captura el nom + tria de perfil)
├── captcha.html       captcha · meme reCAPTCHA ("persones que coneixes")
├── home.html          landing 3 · home "El Parlamalament" (logueado)
├── assets/
│   ├── css/styles.css  tota l'estètica (variables, capçalera, nav, footer, components)
│   ├── js/app.js       comportament (estat, desplegables, carrusel, captcha, validació)
│   └── img/
│       ├── fondo.jpg   textura de fons (subtil)
│       └── captcha.png foto de l'esdeveniment (captcha + carrusel)
├── serve.py           servidor estàtic local (per provar el flux complet)
├── originals/         còpia dels materials originals (PDF, wireframes, imatges)
└── README.md
```

## El flux

```
index (landing 1)
   ├─ "acceptar"  ─┐
   └─ "rebutjar"  ─┴─►  acces (landing 2)   [captura el NOM; sense nom → alerta]
                              ├─ "Soc artiste precari"          ─►  home  (perfil: precari)
                              ├─ "Soc autònom també precari"    ─►  home  (perfil: autònom)
                              └─ "Soc artiste legitimat"        ─►  captcha
                                                                      └─ "Verifica" ─► home (perfil: legitimat)
home (landing 3)
   └─ "Fes el tràmit per legitimar-te" ─► captcha ─► home
```

El **nom** i el **perfil** viatgen entre pàgines amb `sessionStorage`, i la home saluda:
*"hola {nom}, artista {perfil}"*.

## Veure-ho en local

Com que el flux passa dades entre pàgines, cal servir-ho per HTTP (no obrir els `.html`
amb doble clic, perquè `file://` aïlla el `sessionStorage` entre pàgines).

```bash
cd parlamalament
python3 serve.py        # → http://127.0.0.1:4321
```

(Qualsevol servidor estàtic serveix: `python3 -m http.server`, `npx serve`, Live Server, etc.)

## Desplegar

Publicat amb **GitHub Pages** → **https://meowrhino.github.io/parlamalament/**

És estàtic, així que també pots pujar-ho a **Netlify** o **Vercel** sense cap configuració.

## Com editar

- **Textos:** directament a cada `.html`.
- **Colors / tipografia:** variables a dalt de `assets/css/styles.css` (`:root`).
  La tipografia és `Helvetica Neue, Helvetica, Arial…` — la corporativa de gencat
  (Helvetica Neue, amb Arial com a alternativa lliure). Per consistència entre equips
  pots afegir **Arimo** (clon lliure d'Arial).
- **Imatges del carrusel:** afegeix fotos a `assets/img/` i duplica un `<div class="slide img-slide">`
  a `home.html`. El punt focal de la imatge es controla amb `object-position` a `.slide.img-slide img`.
- **Captcha:** la imatge i la quadrícula es configuren a `captcha.html`
  (`data-img`, `data-cols`, `data-rows`).

## Decisions de disseny (per revisar)

- **Antagonisme:** el muro fa servir *"Aquesta web utilitza l'antagonisme (de manera crítica)"*,
  la variant del teu PDF (pàg. 3). La variant *"ironia"* del wireframe és un canvi d'una línia a `index.html`.
- **Carrusel:** de moment mostra **una sola foto**. Si hi afegeixes més imatges (un
  `<div class="slide img-slide">` per cadascuna a `home.html`), el carrusel s'activa sol amb fletxes i punts.
- **Fons de marca gegant** (lletres AMA…ART + arcs): potent a la landing 1; a la resta de
  pàgines passa a **marca d'aigua** per llegibilitat.
- **Captcha:** és una broma — amb seleccionar ≥1 quadre i prémer *Verifica* ja et "legitima".
- **"introduce tu nombre aquí"** es manté en castellà a propòsit (com al wireframe).
- He **omès "ESTRUCTURAS 3.000"** (no apareix als materials). Si és el nom del vostre
  espai/col·lectiu, digues-m'ho i el torno a posar.

---

*Un projecte de Jordi Bretcha amb la col·laboració de Manuel Latour.*
