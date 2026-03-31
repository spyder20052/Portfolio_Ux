# Portfolio Spynel KOUTON v4 - Documentation Officielle

Ce document regroupe les directives artistiques, techniques et le guide de maintenance du portfolio de Spynel KOUTON.

---

## 1. Identité & Vision DA
**Designer graphique & Développeur | Cotonou, Bénin**

### Chartes Graphiques
- **Palette :** `#FAFAF8` (Fond blanc chaud) / `#0D0D0D` (Noir profond).
- **Typographie :** 
    - **Playfair Display :** Pour les titres (Alternance Bold/Italic).
    - **Inter :** Pour le corps de texte et la navigation.
- **Tagline :** "Derrière chaque pixel se cache une histoire"

---

## 2. Directives Techniques Critiques

### Animations GSAP & Scroll
1. **Cursor Custom :** Cercle noir 20px avec `mix-blend-mode: difference`, s'agrandissant au hover.
2. **Page Transitions :** Overlay `#page-transition` avec animation `scaleY` (0→1→0) lors des changements de page.
3. **Hero Split-Text :** Titre découpé par lignes dans des conteneurs `overflow:hidden`, glissant depuis le bas.
4. **Scroll Reveals :** Déclenchement global via `gsap.fromTo` sur l'opacité et l'axe Y (40px) pour tous les blocs de contenu.
5. **Lenis Sync :** Ordre d'initialisation strict : Lenis → ScrollTrigger Update → Animations.

### Intégration Backend
- **Contact :** Formulaire connecté à **Formspree** (`kspynel@gmail.com`).
- **Réseaux :** WhatsApp, GitHub, LinkedIn officiels injectés.

---

## 3. Structure des Pages

### Accueil
- **Hero :** Titre en deux poids, sous-titre localisé, animation d'entrée synchronisée.
- **Featured :** Layout alterné gauche/droite avec numérotation géante en fond (opacity 0.06).
- **Marquee :** Bandeau défilant avec pause au survol.

### Works (20 Projets)
- Grille de 20 templates de projets variés (Branding, Web, UI/UX, Typography).
- Cartes interactives avec survol "Voir le projet →".

### About
- Biographie réelle et liste des 4 services prioritaires (Graphisme, Dev, UI/UX, DA).

### Contact
- Formulaire épuré ("baseline only") et colonne de liens directs (WhatsApp, Calendly).

---

## 4. Guide de Maintenance

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

### Déploiement
```bash
npm run build
```
Copier le contenu du dossier `dist/` sur votre serveur (Vercel, Netlify, FTP).

---
*Design with class. Built to last.*
© 2026 Tous droits réservés
