# Design System — Portfolio Spynel KOUTON (2026)

> **Direction** : *dark-forward · lime acide · éditorial-kinétique.*
> Interface sombre, un seul accent dosé, typographie de magazine et mouvement omniprésent piloté au scroll.
> **Stack** : HTML natif + CSS natif (aucun framework CSS) + **GSAP** (+ plugins) + **Lenis** (smooth scroll), bundlé par **Vite**.
> Source de vérité : `redesign.css` (tokens + composants) et `app.js` (interactions/animations). Ce document reflète l'état réel du code.

---

## 1. Principes & « locks »

Le système s'appuie sur des règles strictes (« locks ») qui garantissent la cohérence :

| Lock | Règle |
|---|---|
| **Theme Lock** | Fond sombre permanent, **un seul accent** (lime `#c8f135`), jamais d'autre couleur d'UI. |
| **Color Consistency Lock** | L'accent ne sert qu'à : liens actifs, italiques de titre (`em`), méta, états, focus, sélection, CTA primaire. |
| **Shape Lock** | 3 rayons seulement : `10px` (inputs), `16px` (médias/cartes), `999px` (pills). |
| **Type Lock** | 3 familles : Display (titres), Sans (texte), Mono (méta/labels). Rien d'autre, sauf les **polices d'univers** du hero (voir §5). |
| **Motion Lock** | 2 courbes d'easing maison. Tout est `prefers-reduced-motion`-safe. |
| **Anti-slop** | Pas de dégradés gratuits, pas d'ombres molles partout, pas d'emoji décoratif. Densité éditoriale, espace négatif maîtrisé. |

**Intentions** : clarté avant tout, intention dans le détail, conçu pour durer (« Design with class. Built to last. »).

---

## 2. Stack technique & chargement

- **Build** : Vite (multi-pages : `index.html`, `projets.html`, `contact.html`, `about.html`).
- **Animation** : GSAP 3 + plugins **ScrollTrigger, SplitText, Flip, MorphSVGPlugin, TextPlugin, Physics2DPlugin, Draggable, InertiaPlugin, Observer**.
- **Smooth scroll** : Lenis (`duration: 1.2`, `easing: 1.001 - 2^(-10t)`, `smoothWheel: true`), branché sur `ScrollTrigger.update` et le ticker GSAP (`lagSmoothing(0)`). Exposé en `window.__lenis`.
- **Polices** : chargées en `<link>` (preconnect + parallèle, non bloquant) dans chaque `<head>`. Les polices d'univers sont chargées en `media="print" onload` (différé) et **uniquement** sur les pages qui en ont besoin (home + about).
- **Anti-FOUC** : `html.is-loading body { opacity: 0 }`, retiré au boot ; rideau de transition (`#transition`) initialement couvert.
- **Failsafe** : script inline (3,5 s) qui révèle le contenu même si le module JS tarde (mobile lent) ; + `pageshow(persisted)` pour le bfcache.
- **Reset** : `* { margin:0; padding:0; box-sizing:border-box }`, `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`.
- **Barre de scroll masquée** sur tout le site (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`), scroll fonctionnel.

---

## 3. Couleurs (tokens)

Tous définis dans `:root`.

### Surfaces (sombres)
| Token | Valeur | Usage |
|---|---|---|
| `--ink` | `#0a0a0b` | Fond principal du site. |
| `--ink-2` | `#111114` | Surface élevée (cartes, menus, browser, clock, avail, fill du rideau). |
| `--ink-3` | `#1a1a1f` | Bordures / barre du faux-navigateur. |

### Texte (clairs)
| Token | Valeur | Usage |
|---|---|---|
| `--paper` | `#f4f4f2` | Texte principal. |
| `--paper-dim` | `#9a9aa0` | Texte secondaire / descriptions. |
| `--paper-faint` | `#56565c` | Méta très discrète, numéros, dots inactifs. |

### Accent (unique)
| Token | Valeur | Usage |
|---|---|---|
| `--accent` | `#c8f135` | Lime acide — **seul accent**. Liens actifs, `em` de titres, méta, focus, CTA primaire, sélection. |
| `--accent-ink` | `#0a0a0b` | Texte/icône **sur** l'accent. |
| *(hover CTA)* | `#d6ff52` | Variante claire au survol du bouton primaire. |

### Lignes / séparateurs
| Token | Valeur |
|---|---|
| `--line` | `rgba(244,244,242,0.10)` — séparateurs discrets, bordures de cartes. |
| `--line-strong` | `rgba(244,244,242,0.20)` — bordures plus visibles, inputs, ghost button, dots. |

### Sélection & glows
- `::selection` → fond `--accent`, texte `--accent-ink`.
- **#bg-glow** (lueur de fond globale) : `color: rgba(200,241,53,0.13)` + `radial-gradient(circle, currentColor 0%, transparent 62%)`, 80vmax, centré. *(Piloté en `color` pour rester performant — pas de `filter: blur`.)*
- La couleur de `#bg` et de la lueur **change par section** via `data-bg` / `data-glow` (crossfade animé).

### Valeurs couleur ponctuelles (non-tokenisées)
- Hero swipe / manifeste fond violet : `#17092e`.
- Hero `__bg` initial : `#1c1206` (univers One Piece retiré ; le voyage finit sur Pixel).
- Nav burger / textes nav : `#fff` (sous `mix-blend-mode: difference`).
- Clock jour : dégradé `#241606 → #3a2410 → #18120a` ; nuit : `#0c1030 → #171041 → #0a0a1a`.
- Pluie (moodshot) : traînées `rgba(178,204,235, α)` ; flash éclair `rgba(216,230,255 → 180,200,244)` en `mix-blend: screen`.

---

## 4. Typographie

### Familles
| Token | Police | Rôle | Graisses |
|---|---|---|---|
| `--font-display` | **Clash Display** (Fontshare) | Titres, slogans, chiffres clés | 400, 500, 600, 700 |
| `--font-sans` | **Satoshi** (Fontshare), fallback `system-ui` | Corps de texte | 400, 500, 700 |
| `--font-mono` | **JetBrains Mono** (Google) | Méta, labels, numéros, heure, URLs | 400, 500 |

**Polices d'univers** (hero/about uniquement, différées) : `Pixelify Sans` (Minecraft), `Gloria Hallelujah` (Crayon), `Press Start 2P` (Pixel). Le hero substitue dynamiquement `font-family / font-size / font-weight / letter-spacing` du titre à chaque univers.

### Réglages globaux
- **Body** : Satoshi, `font-size: clamp(15px, 1.05vw, 17px)`, `line-height: 1.5`.
- **Display helper** : `font-weight: 600; line-height: 0.95; letter-spacing: -0.02em`.
- Les titres serrent toujours le tracking (négatif) ; le mono l'ouvre (positif, +uppercase).

### Échelle typographique (fluide, `clamp(min, vw, max)`)
| Élément | Famille | Taille | line-height | letter-spacing |
|---|---|---|---|---|
| Hero title | Display 600 | `clamp(2.4rem, 6.5vw, 5.6rem)` | 0.92 | -0.03em |
| Manifeste | Display 600 | `clamp(2.8rem, 11vw, 13rem)` | 1.05 | -0.02em |
| Page header title (projets/contact) | Display 600 | `clamp(3rem, 11vw, 9rem)` | 0.90 | -0.03em |
| Footer slogan | Display 600 | `clamp(2.2rem, 7vw, 6rem)` (4.4rem en `__hero`) | 0.92 | -0.02em |
| Section title | Display 600 | `clamp(2rem, 5vw, 4rem)` | 0.98 | -0.02em |
| Feature title | Display 600 | `clamp(1.8rem, 3.6vw, 3.1rem)` | 1.02 | -0.02em |
| Showcase / hp-info title | Display 600 | `clamp(2.4rem, 5vw, 4.4–4.8rem)` | 0.95 | -0.02/-0.03em |
| Work-card title | Display 600 | `clamp(2rem, 4.5vw, 3.6rem)` | 1.0 | -0.02em |
| About bio | Display 400 | `clamp(1.5rem, 3.2vw, 2.6rem)` | 1.2 | -0.01em |
| Stat number | Display 600 | `clamp(2.4rem, 5vw, 4rem)` | 1.0 | — (préfixe `+` lime via `::before`, `white-space:nowrap`) |
| Clock heure | Display 600 | `clamp(3rem, 7vw, 4.4rem)` | 0.90 | -0.03em, `tabular-nums` |
| Menu plein écran (liens) | Display 600 | `clamp(2.4rem, 11vw, 3.6rem)` | 1.08 | -0.02em |
| Lead | Satoshi | `clamp(1.05rem, 1.6vw, 1.35rem)` | 1.55 | — (max 52ch, couleur dim) |
| `.mono` / labels | Mono | `0.72rem` | — | 0.16em, uppercase, couleur dim |
| Rôles hero | Mono | `clamp(0.68rem, 0.9vw, 0.8rem)` | — | 0.16em, uppercase |

**Mesure de ligne** : `--lead` 52ch, descriptions 40–46ch, titres 16–22ch (max-width contrôlé). Chiffres alignés via `font-variant-numeric: tabular-nums` (heure, stats).

---

## 5. Hero — « voyage d'univers » (signature)

Au scroll, le portrait se révèle à travers plusieurs **univers graphiques**, chacun changeant **fond + lueur + couleurs de texte + accent + POLICE + taille du titre**, de façon synchronisée. Ordre : **vraie photo → Minecraft → Crayon → Pixel** (One Piece retiré).

- 4 couches `.hero__layer[data-stage]` empilées (clip-path `circle()` animé) + calque `.hero__peek` (spotlight au survol révélant un autre univers au hasard, **FINE only**).
- Pin ScrollTrigger `end: +=150%`, `scrub: 0.4` ; révélations à `0.12 / 0.42 / 0.72` ; sortie (fade du texte) à `0.92`.
- Thèmes (extrait) : Minecraft `#0c1d12` / vert `#7ed957` / Pixelify ; Crayon `#efe6d2` (clair !) / `#ff5a3c` / Gloria Hallelujah ; Pixel `#141420` / `#b478ff` / Press Start 2P.
- Vie au repos : portrait qui flotte, rôles qui défilent (2,2 s), repère de scroll qui tourne (accélère selon la vélocité), parallaxe souris (FINE).
- Portrait : `aspect-ratio 4/5`, `height clamp(420px, 70vh, 620px)`, ombre lime `0 50px 130px -50px rgba(200,241,53,0.30)`, grain SVG (fractalNoise) en `mix-blend: overlay`.
- **Même système (hover seul, sans voyage)** sur le portrait de la page À propos via `.about__peek`.

---

## 6. Espacement, layout & formes

### Tokens
| Token | Valeur | Rôle |
|---|---|---|
| `--pad-x` | `clamp(20px, 5vw, 80px)` | Gouttière horizontale (shell, nav, sections). |
| `--section-y` | `clamp(96px, 14vh, 200px)` | Rythme vertical des sections. |
| `--maxw` | `1500px` | Largeur max de contenu. |
| `--r-sm` | `10px` | Inputs. |
| `--r-md` | `16px` | Médias, cartes, menus. |
| `--r-pill` | `999px` | Boutons, badges, dots. |

### Conteneur
`.shell { width:100%; max-width: var(--maxw); margin-inline:auto; padding-inline: var(--pad-x) }` — utilisé partout pour centrer/limiter le contenu.

### Grilles clés
- Hero : `grid-template-columns: 1fr 0.78fr`, gap `clamp(24px, 5vw, 90px)`.
- Feature / CTA : `1fr 1fr` (CTA `1.05fr 0.95fr`).
- About : `1.15fr 0.85fr`.
- Contact : `1.3fr 0.7fr`.
- Footer grid : `1.4fr 1fr 1fr`.
- Showcase item : `0.82fr 1.18fr`, `min-height: 100dvh`.
- Valeurs (about) : 3 colonnes.
- Bento (home) : `repeat(3, 32.5vw) × repeat(4, 23vh)` avec 8 `grid-area` explicites (la 3ᵉ cellule = grande centrale).

---

## 7. Élévation, bordures, ombres

- **Bordures** : `1px solid var(--line)` (discret) ou `--line-strong` (visible). Séparateurs de section : `border-top: 1px solid var(--line)`.
- **Ombres** (toujours larges, basses, très diffuses, jamais grises molles) :
  - Hero portrait : `0 50px 130px -50px rgba(200,241,53,0.30)` (+ `0 0 0 1px var(--line)`).
  - Browser (showcase) : `0 50px 120px -50px rgba(0,0,0,0.8)`.
  - Feature media : `0 36px 90px -46px rgba(0,0,0,0.7)`.
  - Clock : `0 30px 70px -44px rgba(0,0,0,0.7)`.
  - Badge core (about) : `0 0 50px rgba(200,241,53,0.35)`.
- **Inset** subtil sur le portrait : `inset 0 0 120px 20px rgba(10,10,11,0.18)`.
- **Backdrop-filter blur** : filtre projets (8px), lightbox (12px), boutons passer (6px), pcard year (4px).

---

## 8. Mouvement (motion)

### Easings
| Token | Courbe | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Sorties douces, hovers, reveals (par défaut). |
| `--ease-io` | `cubic-bezier(0.65, 0, 0.35, 1)` | In-out symétrique. |

GSAP : `power2/3/4.inOut/out`, `back.out`, `elastic.out(1, 0.45)` (micro-bounce des boutons), `sine.inOut` (flottements/boucles), `expo`/`none` (scrubs).

### Durées repères
- Hovers : 0.25–0.4 s. Reveals : 0.9 s. Transition de page : 0.6–0.8 s.
- Boutons (micro) : entrée `elastic.out` 0.9 s, sortie `×2.6` plus rapide.
- Curseur : anneau suit en lerp `0.18`.
- Boucles continues : flottement fenêtre 5,2 s ; clock glow 16 s ; pluie/éclairs/rafales (voir §10).

### Reveals génériques
`.reveal-up { opacity:0; translateY(28px) }` → animé à `top 85%` (ScrollTrigger). Titres `[data-split]` : SplitText `words,lines` masqués, `yPercent:110` stagger 0.1.

---

## 9. Composants (catalogue)

### Navbar `.nav`
Fixe, hauteur **68px**, `z-index: 200`, `mix-blend-mode: difference` (lisible sur clair et sombre). Liens avec **underline animé** (`::after` width 0→100%). CTA = pill bordée. Burger (`≤900px`) → menu plein écran.

### Menu plein écran `.menu` (`≤900px`)
3 panneaux empilés (`will-change: transform`) qui entrent en cascade (GSAP) : **main** (fond `--paper`, liens géants en Display), **cta** (fond accent, RDV + lien CV souligné), **social** (fond `--ink-2`, mono). Burger→X interruptible ; scroll Lenis stoppé à l'ouverture.

### Boutons `.btn`
Pill, `padding: 15px 26px`, gap 10px, `font-weight: 500`. `:active` → `translateY(1px) scale(0.99)`. **Primary** : fond accent / texte ink, hover `#d6ff52`. **Ghost** : bordure `--line-strong`, hover bordure `--paper` + voile 4%. Flèche `.btn__arrow` qui glisse `translate(3px,-3px)` au hover. Magnétiques au pointeur (FINE).

### Manifeste `.manifesto`
Phrase géante `nowrap`, pinnée, qui défile **horizontalement** (`xPercent:-100`) ; chaque caractère (SplitText) se **disperse** (containerAnimation). Actif aussi sur mobile (police réduite, `end:+=1200`).

### Bento `.gallery--bento`
Grille 3×4 avec 8 `grid-area`. Animation **Flip** (GSAP) pour passer d'une compo compacte à plein écran. Cellule centrale (3ᵉ) mise en avant. Mobile : grille 2 colonnes, `aspect-ratio: 1`.

### Showcase « sites en action » `.browser`
Faux-navigateur (barre `--ink-3`, 3 dots, URL en `spynelkouton.me/<projet>`). L'image pleine-page **défile verticalement** dans l'écran (pin + pan ScrollTrigger), sur tous écrans. Écran `aspect-ratio 16/10` (16/12 mobile). Les images portent `width`/`height` (carte `IMG_DIMS`) → `scrollWidth` correct, **pas de saut**.

### Galerie horizontale projets `.hgal` (desktop)
Une seule ligne : pour chaque projet, un **bloc infos** (`.hp-info`, bordé à gauche) suivi de ses **visuels collés** (`.hp-shots`, hauteur 72vh). Pin + scrub horizontal. **HUD** : compteur `01 / 19`, **barre de progression** (`scaleX`), **points** cliquables (label au survol). Boutons **Passer ↓ / ↑** (sauter après / revenir avant). Largeurs réservées via `IMG_DIMS` (scroll fluide).

### Galerie projets `.hgal__strip--native` (mobile)
Cartes plein écran `.hpanel` (82vw, 64vh), **scroll-snap horizontal natif**, dégradé bas, méta + « Voir les visuels ». Tap → lightbox.

### Lightbox `.lightbox`
`z-index: 300`, fond `rgba(8,8,9,0.94)` + blur 12px. Tous les visuels du projet empilés + méta (catégorie, titre, client, rôle, résultats en chiffres accent). **Intégrée à l'historique** : la flèche retour la ferme (ne quitte pas la page). Fermeture ✕ / clic dehors / Échap.

### Formulaire contact `.field`
Inputs **soulignés** (border-bottom only), focus → bordure accent. Soumission AJAX (Formspree) avec animation du label **Envoi… → Envoyé** (TextPlugin).

### Horloge `.clock` (contact)
Heure live Cotonou (Africa/Lagos) + secondes en accent + date longue. **Fond animé jour/nuit** : dégradé chaud (jour) / froid (nuit), **lueur céleste** qui dérive (`clockGlow` 16 s), **étoiles** la nuit (`clockTwinkle`). Sans bordure, sans clignotement.

### Section « la ville dort » `.moodshot`
Fond **noir pur**, illustration fenêtre centrée (bords fondus) qui flotte. **Pluie en canvas** (3 plans de profondeur, vent uniforme, traînée motion-blur), **éclairs** plein écran (`.moodshot__flash`, `mix-blend: screen`) + **rafales/tonnerre** aléatoires. Pause hors-écran (IntersectionObserver), off en reduced-motion.

### Footer `.footer`
**Vague lime** (`.footer__wave`, MorphSVG plat→ondulé) servant aussi de **ligne où un chien lime** (webp animé) fait l'aller-retour (se retourne aux extrémités, reste strictement sur la ligne). **Slogan + illustration** `footer.png` côte à côte (`.footer__hero`, même ligne, statique). Grille 3 colonnes (identité / navigation / réseaux). Barre du bas mono.

### Curseur custom (FINE only)
Point accent (6px) + anneau (38px) qui suit en lerp ; au survol des cibles → anneau 64px, bordure accent, voile 6%. Curseur natif masqué **uniquement** une fois le custom confirmé (`html.cursor-on`). Désactivé en `pointer: coarse`.

### Transition de page `#transition`
Rideau **MorphSVG** (path couvert ↔ ouvert) + logo « kspynel. ». ENTER : se retire au chargement. EXIT : se referme au clic d'un lien interne puis navigue. `pageshow(persisted)` le rouvre au retour bfcache.

---

## 10. Pluie & tempête (moodshot, canvas — détails)

- **Gouttes** : `clamp(120, 250, W/6.5)` ; chaque goutte a une `depth` (0 loin → 1 près) qui module `speed (300–550)`, `len = speed×0.05`, `thick (0.5–1.6)`, `alpha (0.07–0.27)` → **perspective**.
- **Vent uniforme** : `vx = wind × (0.85 + depth×0.3)` (même angle pour toutes, légère parallaxe). Traînée orientée selon la vélocité (motion-blur réaliste).
- **Brise** : `wind = 18 + sin(t×0.4)×15 + sin(t×0.11)×22 + gust`.
- **Rafales (`gust`)** : déclenchées aléatoirement (toutes 5–13 s) **et** après chaque éclair ; valeur `±(150–300)` qui **retombe en ~1,6 s**.
- **Éclairs** : toutes 7–18 s, double flash (0.45→0.06→0.6–0.95→0), illumine **toute la surface** ; suivi d'une rafale (« tonnerre »).
- **Perf** : DPR plafonné à 2, `requestAnimationFrame` en pause hors-écran, recalcul de la hauteur au chargement de l'image (lazy).

---

## 11. Échelle de z-index

| z-index | Élément |
|---|---|
| 9999 | Curseur (dot + ring) |
| 9000 | Rideau de transition `#transition` |
| 300 | Lightbox |
| 210 | Burger |
| 200 | Navbar |
| 195 | Menu plein écran |
| 150 | *(ancienne ligne nav, déprécié)* |
| 120 | Filtre (sticky) |
| 7 / 5 | Galerie : boutons passer / HUD |
| 6 | Hero swipe |
| 4 / 3 / 2 | Moodshot : flash / pluie / inner+img ; footer pet ; about peek |
| 2 | Hero mark |
| 10 | Hero peek |
| 0 → -1 → -2 → -3 → -10 | Sky clock / hero grain / hero glow / hero bg / `#bg` |

---

## 12. Responsive (breakpoints)

| Breakpoint | Effets principaux |
|---|---|
| **≤ 900px** | Hero en 1 colonne (portrait ≤320px) ; **liens nav cachés → burger + menu** ; footer grid 2 colonnes. |
| **≤ 820px** | About / feature / cta / contact en 1 colonne ; showcase 1 colonne plein écran (desc cachée) ; galerie projets → cartes scroll-snap (HUD statique, points cachés) ; moodshot centré. |
| **≤ 768px** | Manifeste police réduite ; bento 2 colonnes carré. |
| **≤ 760px** | Work-card 1 colonne ; footer hero qui wrap ; valeurs 1 colonne. |
| **≤ 560px** | Footer grid 1 colonne + bas en colonne ; filtre `top: 0`. |

Unités fluides : tout passe par `clamp()` (taille, padding, gap) → pas de « marches » brutales entre breakpoints.

---

## 13. Accessibilité & reduced-motion

- `@media (prefers-reduced-motion: reduce)` : animations/transitions ≈ 0 ; reveals visibles ; manifeste **lisible** (wrap, sans pin) ; pluie/curseur off ; clip-path du portrait neutralisé.
- `pointer: coarse` → curseur custom masqué (tactile).
- `pointer: fine` requis pour : curseur, magnétisme, peek/spotlight, particules de clic.
- Cibles cliquables ≥ pills confortables ; focus visible via bordure accent (inputs).
- Contraste : texte clair sur fond très sombre ; accent lime réservé aux éléments non essentiels à la compréhension (jamais texte long en lime).
- `aria-hidden` sur le décoratif (grain, glow, pet, rain, art) ; `aria-label` sur burger/dots/jump.

---

## 14. Détails subtils (à ne pas perdre)

- **Grain** : bruit fractal SVG inline en `mix-blend: overlay`, opacity 0.5 (texture du hero).
- **Glows pilotés en `color`** (radial-gradient + `currentColor`) plutôt qu'en `filter: blur` → **gros gain perf mobile** (le blur plein écran faisait planter le menu).
- **`mix-blend-mode: difference`** sur la nav : le logo/liens restent lisibles au-dessus d'une image claire (ex. showcase) comme sombre.
- **Préfixe `+` des stats** via `::before` lime + `white-space: nowrap` (jamais de retour à la ligne, jamais de double `+`).
- **Underline animé** des liens nav et `cta__mail` (width/border qui pousse).
- **Accordéon expertises** : transition `grid-template-rows: 0fr → 1fr` (technique fluide sans hauteur fixe) ; toggle `+` qui tourne `rotate(135deg)`.
- **Rôles hero** : barre `::before` qui pousse à 28px sur l'actif + opacité 0.38→1.
- **Particules de clic** (Physics2D) globales **désactivées au tactile** (évitait le jank du menu).
- **Images de galerie** : `width`/`height` réels (carte `IMG_DIMS` générée) → ratio réservé avant chargement = **aucune déformation, aucun saut**, lazy-load conservé.
- **Heure** : `Intl.DateTimeFormat` timezone `Africa/Lagos`, secondes paddées, bascule jour (6h–18h) / nuit.
- **Lightbox & historique** : `history.pushState` à l'ouverture → la flèche retour ferme la fenêtre et garde la position de scroll.
- **bfcache** : `pageshow(persisted)` rouvre le rideau de transition figé au retour mobile.

---

## 15. Récapitulatif des tokens (copier-coller)

```css
:root {
  /* Couleurs */
  --ink:#0a0a0b; --ink-2:#111114; --ink-3:#1a1a1f;
  --paper:#f4f4f2; --paper-dim:#9a9aa0; --paper-faint:#56565c;
  --accent:#c8f135; --accent-ink:#0a0a0b;
  --line:rgba(244,244,242,0.10); --line-strong:rgba(244,244,242,0.20);
  /* Typo */
  --font-display:'Clash Display',sans-serif;
  --font-sans:'Satoshi',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  /* Formes */
  --r-sm:10px; --r-md:16px; --r-pill:999px;
  /* Espacement */
  --pad-x:clamp(20px,5vw,80px); --section-y:clamp(96px,14vh,200px); --maxw:1500px;
  /* Motion */
  --ease-out:cubic-bezier(0.16,1,0.3,1);
  --ease-io:cubic-bezier(0.65,0,0.35,1);
}
```

---

*Document généré à partir du code source (`redesign.css`, `app.js`, HTML). Toute évolution du design doit d'abord respecter les « locks » du §1.*
