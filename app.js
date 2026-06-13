import './redesign.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Observer } from 'gsap/Observer';
import { projects } from './projects.js';
import { IMG_DIMS } from './imgdims.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Physics2DPlugin, Flip, MorphSVGPlugin, TextPlugin, Draggable, InertiaPlugin, Observer);

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;

function boot() {
  document.documentElement.classList.remove('is-loading');
  gsap.to('body', { opacity: 1, duration: 0.4, ease: 'power2.out' });

  if (!REDUCE) initLenis();
  initCursor();
  initMagnetic();
  initMicro();
  initHero();
  initNavScroll();
  initSectionBackgrounds();
  initManifesto();
  initWorkBento();
  initReveals();
  initSplitReveals();
  initCounters();
  initClickParticles();
  initFooterWave();
  initDecor();
  initFeatureMedia();
  initMoodshot();
  initShowcase();
  initProjets();
  initContact();
  initAbout();
  initMenu();
  initPageTransition();

  // Recalcule les positions des pins une fois polices + images chargées
  // (évite les éléments pinnés décalés / qui débordent en bas)
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
  const heroImg = document.querySelector('.hero__portrait img');
  if (heroImg && !heroImg.complete) heroImg.addEventListener('load', () => ScrollTrigger.refresh());
}

// Lance l'init (déféré pour laisser le module finir de s'évaluer, sinon TDZ sur les `let` plus bas)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else Promise.resolve().then(boot);

/* ---------- Smooth scroll ---------- */
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

/* ---------- Curseur minimal (dot + anneau magnétique) ---------- */
function initCursor() {
  if (!FINE || REDUCE) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  document.documentElement.classList.add('cursor-on'); // masque le natif seulement maintenant
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  gsap.set([dot, ring], { opacity: 1 });
  window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    gsap.set(dot, { x: mx, y: my });
    gsap.set(ring, { x: rx, y: ry });
  });
  document.querySelectorAll('a, button, .cursor-target').forEach((el) => {
    el.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
  });
}

/* ---------- Micro-interactions élastiques (doc18) : entrée elastic, sortie rapide ---------- */
function initMicro() {
  if (REDUCE) return;
  document.querySelectorAll('.btn').forEach((btn) => {
    const tl = gsap.timeline({ paused: true })
      .to(btn, { scale: 1.05, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    btn.addEventListener('pointerenter', () => tl.timeScale(1).play());
    btn.addEventListener('pointerleave', () => tl.timeScale(2.6).reverse());
  });
  // Liens de nav : petit rebond élastique au survol
  document.querySelectorAll('.nav__link:not(.nav__cta)').forEach((link) => {
    link.addEventListener('pointerenter', () => gsap.to(link, { y: -2, duration: 0.45, ease: 'elastic.out(1,0.5)' }));
    link.addEventListener('pointerleave', () => gsap.to(link, { y: 0, duration: 0.3, ease: 'power2.out' }));
  });
}

/* ---------- Boutons / portrait magnétiques ---------- */
function initMagnetic() {
  if (!FINE || REDUCE) return;
  document.querySelectorAll('.btn, [data-magnetic]').forEach((el) => {
    const strength = el.hasAttribute('data-magnetic') ? 0.12 : 0.3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  });
}

/* ---------- Manifeste : texte horizontal pinné + chars qui se dispersent (doc6) ---------- */
function initManifesto() {
  const wrap = document.querySelector('.manifesto');
  const text = document.querySelector('.manifesto__text');
  if (!wrap || !text || REDUCE) return;
  const mm = gsap.matchMedia();
  // Tous écrans (mobile inclus) : scroll horizontal pinné + chars qui se dispersent
  mm.add('(min-width: 1px)', () => {
    const split = SplitText.create(text, { type: 'chars,words' });
    let entered = false;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const scrollTween = gsap.to(text, {
      xPercent: -100, ease: 'none',
      scrollTrigger: {
        trigger: wrap, pin: true, end: mobile ? '+=1200' : '+=1800', scrub: true, invalidateOnRefresh: true,
        // L'entrée ne se joue QU'UNE FOIS, au moment où la section se cale (pin), donc après qu'on y soit
        onEnter: () => {
          if (entered) return; entered = true;
          gsap.from(text, { yPercent: 90, autoAlpha: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' });
        },
      },
    });
    split.chars.forEach((char) => {
      gsap.from(char, {
        yPercent: 'random(-180, 180)', rotation: 'random(-18, 18)', ease: 'back.out(1.2)',
        scrollTrigger: { trigger: char, containerAnimation: scrollTween, start: 'left 100%', end: 'left 35%', scrub: 1 },
      });
    });
    return () => split.revert();
  });
}

/* ---------- HERO : intro punchy + vie permanente au repos + pulse au scroll ---------- */
function initHero() {
  if (!document.querySelector('.hero')) return;
  const portraitBox = document.querySelector('.hero__portrait');
  const stageLayers = ['0', '1', '2', '3'].map((s) => document.querySelector(`.hero__layer[data-stage="${s}"]`));
  const roles = gsap.utils.toArray('.hero__role');
  const lightTargets = '.hero__title, .hero__role, .hero .lead, .hero .btn--ghost, .hero__mark';
  const setRole = (i) => roles.forEach((r, idx) => r.classList.toggle('is-active', idx === i));
  setRole(0);

  // Thèmes par univers (fond + lueur + couleurs + POLICE/style), dans l'ordre de révélation
  const THEMES = [
    { bg: '#0a0a0b', glow: 'rgba(200,241,53,0.24)', fg: '#f4f4f2', accent: '#c8f135', font: "var(--font-display)", size: 'clamp(2.4rem,6.5vw,5.6rem)', weight: 600, tracking: '-0.03em' }, // Vraie photo (marque)
    { bg: '#0c1d12', glow: 'rgba(120,200,100,0.32)', fg: '#eaf6e8', accent: '#7ed957', font: "'Pixelify Sans', sans-serif", size: 'clamp(2.4rem,6.6vw,5.6rem)', weight: 700, tracking: '0.01em' }, // Minecraft
    { bg: '#efe6d2', glow: 'rgba(255,205,70,0.45)', fg: '#1a1408', accent: '#ff5a3c', font: "'Gloria Hallelujah', cursive", size: 'clamp(1.9rem,4.8vw,4rem)', weight: 400, tracking: '0' }, // Crayon (clair)
    { bg: '#141420', glow: 'rgba(180,120,255,0.34)', fg: '#ece8ff', accent: '#b478ff', font: "'Press Start 2P', monospace", size: 'clamp(1rem,2.6vw,2.3rem)', weight: 400, tracking: '0' }, // Pixel
  ];
  const applyFont = (t) => gsap.set('.hero__title', { fontFamily: t.font, fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking });
  const setTheme = (t) => {
    gsap.set('.hero__bg', { backgroundColor: t.bg });
    gsap.set('.hero__glow', { color: t.glow });
    gsap.set([...document.querySelectorAll(lightTargets)], { color: t.fg });
    gsap.set('.hero__title em', { color: t.accent });
    applyFont(t);
  };

  if (REDUCE) { gsap.set(stageLayers.slice(0, 3), { clipPath: 'circle(0% at 50% 50%)' }); setTheme(THEMES[3]); return; }

  // === INTRO : nom kinétique. Au repos, profil1 (One Piece) visible ===
  const split = new SplitText('.hero__title .splitline', { type: 'chars' });
  gsap.set('.hero__title .row', { overflow: 'hidden' });
  gsap.set(stageLayers, { clipPath: 'circle(150% at 50% 50%)' });
  setTheme(THEMES[0]);

  const intro = gsap.timeline({ delay: 0.15 });
  intro
    .from(split.chars, { yPercent: 120, rotation: () => gsap.utils.random(-10, 10), duration: 1, ease: 'back.out(1.5)', stagger: 0.035 })
    .from('.hero__role-list, .hero__meta', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.4)
    .from('.hero__portrait', { opacity: 0, scale: 1.05, duration: 1.1, ease: 'power3.out' }, 0.25)
    .from('.hero__mark', { opacity: 0, scale: 0.6, duration: 0.8, ease: 'back.out(2)' }, 0.9)
    .set('.hero__title .row', { overflow: 'visible' }); // libère pour les polices à jambages

  // === VIE AU REPOS (idle) ===
  gsap.to('.hero__glow', { xPercent: 16, yPercent: -12, scale: 1.18, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.hero__layer', { keyframes: { y: [0, -12, 0, 9, 0], ease: 'none', easeEach: 'sine.inOut' }, duration: 9, repeat: -1, ease: 'none' });
  const markSpin = gsap.to('.hero__mark svg:first-child', { rotation: 360, duration: 16, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
  let roleIdx = 0;
  const cycleRoles = () => { roleIdx = (roleIdx + 1) % roles.length; setRole(roleIdx); };
  let roleTimer = setInterval(cycleRoles, 2200);

  // === Parallax souris ===
  if (FINE) {
    const pEls = gsap.utils.toArray('[data-parallax]');
    const qx = pEls.map((el) => gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }));
    const qy = pEls.map((el) => gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }));
    document.querySelector('.hero').addEventListener('pointermove', (e) => {
      const cx = e.clientX / innerWidth - 0.5;
      const cy = e.clientY / innerHeight - 0.5;
      pEls.forEach((el, i) => { const d = parseFloat(el.dataset.parallax); qx[i](cx * 40 * d); qy[i](cy * 40 * d); });
    });
  }

  // === HOVER : spotlight qui révèle aléatoirement un AUTRE univers (jamais celui déjà affiché) ===
  let currentImg = 0; // index de l'image actuellement visible (maj au scroll)
  if (FINE) {
    const peek = document.querySelector('.hero__peek');
    const pool = ['/profil.webp', '/profil2.webp', '/profil3.webp', '/profil4.webp'];
    let active = false;
    portraitBox.addEventListener('pointerenter', () => {
      let idx; do { idx = Math.floor(Math.random() * pool.length); } while (idx === currentImg);
      peek.style.backgroundImage = `url(${pool[idx]})`;
      active = true;
    });
    portraitBox.addEventListener('pointermove', (e) => {
      if (!active) return;
      const r = portraitBox.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      gsap.to(peek, { clipPath: `circle(22% at ${x}% ${y}%)`, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    });
    portraitBox.addEventListener('pointerleave', () => {
      active = false;
      gsap.to(peek, { clipPath: 'circle(0% at 50% 50%)', duration: 0.4, ease: 'power2.in', overwrite: 'auto' });
    });
  }

  // === SCROLL : voyage d'univers (révélation + thème + police assortis) ===
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: '+=150%', pin: true, anticipatePin: 1,
      invalidateOnRefresh: true, scrub: 0.4,
      onToggle: (self) => { if (self.isActive && roleTimer) { clearInterval(roleTimer); roleTimer = null; } },
      onUpdate: (self) => {
        if (!roleTimer) setRole(Math.min(roles.length - 1, Math.floor(self.progress * roles.length * 0.999)));
        markSpin.timeScale(1 + Math.abs(self.getVelocity() / 300));
        const pr = self.progress;
        currentImg = pr < 0.2 ? 0 : pr < 0.5 ? 1 : pr < 0.8 ? 2 : 3;
      },
    },
  });
  const reveal = (layer, t, at, d = 0.17) => {
    tl.to(layer, { clipPath: 'circle(0% at 50% 50%)', ease: 'power2.inOut', duration: d }, at)
      .to('.hero__bg', { backgroundColor: t.bg, ease: 'power1.inOut', duration: d }, at)
      .to('.hero__glow', { color: t.glow, ease: 'power1.inOut', duration: d }, at)
      .to(lightTargets, { color: t.fg, ease: 'power1.inOut', duration: d }, at)
      .to('.hero__title em', { color: t.accent, ease: 'power1.inOut', duration: d }, at)
      // changement de POLICE/style synchronisé au milieu de la révélation
      .set('.hero__title', { fontFamily: t.font, fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking }, at + d * 0.5);
  };
  reveal(stageLayers[0], THEMES[1], 0.12); // vraie photo → Minecraft
  reveal(stageLayers[1], THEMES[2], 0.42); // → Crayon
  reveal(stageLayers[2], THEMES[3], 0.72); // → Pixel (univers final)
  // Sortie : le texte du hero s'efface (pas de rideau, pour laisser admirer l'entrée du manifeste)
  tl.to('.hero__intro, .hero__mark', { opacity: 0, ease: 'power2.in', duration: 0.12 }, 0.92);
}

/* ---------- Fonds qui alternent par section (crossfade animé) ---------- */
function initSectionBackgrounds() {
  const bg = document.getElementById('bg');
  const glow = document.getElementById('bg-glow');
  if (!bg) return;
  const secs = gsap.utils.toArray('[data-bg]');
  let current = null;
  const setTheme = (sec) => {
    if (!sec || sec === current) return;
    current = sec;
    gsap.to(bg, { backgroundColor: sec.dataset.bg, duration: 1, ease: 'power2.out', overwrite: 'auto' });
    if (glow && sec.dataset.glow) gsap.to(glow, { color: sec.dataset.glow, duration: 1, ease: 'power2.out', overwrite: 'auto' });
  };
  // Déterministe : la section qui occupe le centre du viewport impose sa couleur
  const pick = () => {
    const mid = innerHeight / 2;
    let active = secs[0];
    for (const s of secs) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { active = s; break; }
    }
    setTheme(active);
  };
  setTheme(secs[0]);
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: pick, onRefresh: pick });
  // dérive douce de la lueur (vie permanente)
  if (!REDUCE) gsap.to(glow, { xPercent: 12, yPercent: -10, scale: 1.15, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // badge circulaire de "À propos" qui tourne (illustre le vide)
  const badge = document.querySelector('.about__badge');
  if (badge && !REDUCE) gsap.to(badge, { rotation: 360, duration: 28, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
}

/* ---------- Page /projets : showcase sites web (cadre navigateur qui défile) ---------- */
function collectImages(p) {
  const imgs = [];
  (p.gallery || []).forEach((s) => (s.images || []).forEach((src) => imgs.push(src)));
  if (p.heroImage) imgs.unshift(p.heroImage);
  return [...new Set(imgs)];
}
function initShowcase() {
  const track = document.getElementById('showcase-track');
  if (!track) return;
  // Config : on peut surcharger titre / images / url par projet
  const SC = {
    crispy: { title: 'Crispy', cat: 'Site Web · Food', year: '2024', client: 'Crispy', role: 'Design & Développement',
      url: 'spynelkouton.me/crispy', desc: "Site de commande pour une enseigne de restauration rapide premium. Interface gourmande, claire et fluide.",
      imgs: ['/visuals/showcase/crispy-full.webp'] },
    'visual-concept-1': { title: 'Vintage', cat: 'Site Web · E-commerce', year: '2026', client: 'Vintage Bénin', role: 'Web Design & Direction Artistique',
      url: 'spynelkouton.me/vintage', desc: "Maquette du site Vintage Bénin : achat-vente de pièces uniques de seconde main. Une direction rétro, colorée et vivante.",
      imgs: ['/visuals/showcase/vintage.webp'] },
  };
  const order = ['crispy', 'arbitra', 'scan360', 'nextgen', 'astro', 'visual-concept-1'];
  const items = order.map((id) => {
    const p = projects.find((x) => x.id === id) || {};
    const o = SC[id] || {};
    return {
      id, title: o.title || p.title, cat: o.cat || `${p.category} · ${p.year}`,
      client: o.client || p.client, role: o.role || p.role, desc: o.desc || p.description,
      url: o.url || `spynelkouton.me/${id}`, imgs: o.imgs || collectImages(p),
    };
  });
  track.innerHTML = items.map((p, i) => `
    <article class="showcase__item">
      <div class="showcase__meta">
        <span class="showcase__num">0${i + 1} / 0${items.length}</span>
        <h3 class="showcase__title">${p.title}</h3>
        <span class="showcase__cat">${p.cat}</span>
        <p class="showcase__desc">${p.desc}</p>
        <div class="showcase__info">
          <div><span class="mono">Client</span><b>${p.client}</b></div>
          <div><span class="mono">Rôle</span><b>${p.role}</b></div>
        </div>
        <a class="btn btn--ghost cursor-target" href="/contact.html">Me contacter <span class="btn__arrow">↗</span></a>
      </div>
      <figure class="browser" data-tilt>
        <div class="browser__bar">
          <span class="browser__dot"></span><span class="browser__dot"></span><span class="browser__dot"></span>
          <span class="browser__url">${p.url}</span>
        </div>
        <div class="browser__screen">
          <div class="browser__page">${p.imgs.map((s) => { const d = IMG_DIMS[s]; const dim = d ? ` width="${d[0]}" height="${d[1]}"` : ''; return `<img src="${s}"${dim} alt="" loading="lazy" decoding="async" />`; }).join('')}</div>
        </div>
      </figure>
    </article>`).join('');

  gsap.matchMedia().add('(min-width: 1px)', () => {
    const triggers = [];
    gsap.utils.toArray('.showcase__item').forEach((item) => {
      const page = item.querySelector('.browser__page');
      const screen = item.querySelector('.browser__screen');
      const tw = gsap.fromTo(page, { y: 0 }, {
        y: () => -(page.scrollHeight - screen.clientHeight), ease: 'none',
        scrollTrigger: { trigger: item, start: 'top top', end: '+=150%', pin: true, scrub: 0.5, invalidateOnRefresh: true },
      });
      triggers.push(tw.scrollTrigger);
    });
    return () => triggers.forEach((t) => t && t.kill());
  });
}

/* ---------- Page /projets : galerie filtrable (Flip) + reveals ---------- */
function groupOf(cat) {
  const c = (cat || '').toLowerCase();
  if (c.includes('web')) return 'web';
  if (c.includes('ui') || c.includes('dashboard') || c.includes('product')) return 'uiux';
  if (c.includes('brand') || c.includes('logo') || c.includes('identity')) return 'branding';
  return 'visuel';
}
function initProjets() {
  const strip = document.getElementById('hgal-strip');
  const section = document.getElementById('hgal');
  const viewport = document.getElementById('hgal-viewport');
  if (!strip || !section || !viewport) return;

  const list = projects.filter((p) => p.id !== 'visual-concept-2');
  const n = list.length;
  const curEl = document.getElementById('hgal-cur');
  const totEl = document.getElementById('hgal-tot');
  const fill = document.getElementById('hgal-fill');
  const dotsWrap = document.getElementById('hgal-dots');
  if (totEl) totEl.textContent = String(n).padStart(2, '0');
  const cntEl = document.getElementById('projets-count');
  if (cntEl) cntEl.textContent = n;

  // ---- Visuels dédiés par projet (dossiers BDE / Halloween / Vintage) ----
  const seq = (dir, count) => Array.from({ length: count }, (_, k) => `/visuals/projets/${dir}/${String(k + 1).padStart(2, '0')}.webp`);
  const SHOTS = {
    'visual-concept-3': seq('bde', 13),     // BDE Epitech
    'exp-lab-1': seq('halloween', 20),      // BDE Halloween
    'visual-concept-1': seq('vintage', 7),  // Vintage
    'shooting-ia': seq('shooting', 11),     // Génération de shooting pour visuel de marque
  };
  const HEROV = { crispy: '/visuals/showcase/crispy2.webp' };
  const shotsFor = (p) => SHOTS[p.id] || collectImages(p);
  const heroFor = (p) => (SHOTS[p.id] && SHOTS[p.id][0]) || HEROV[p.id] || p.heroImage;

  // ---- Lightbox (mobile : tous les visuels du projet) ----
  const lb = document.getElementById('lightbox');
  const lbMedia = document.getElementById('lb-media');
  const lbMeta = document.getElementById('lb-meta');
  const openLB = (p) => {
    if (!lb) return;
    lbMeta.innerHTML = `
      <span class="mono accent">${p.category} · ${p.year}</span>
      <h2>${p.title}</h2>
      <p class="lead">${p.description}</p>
      <div class="lb-info"><div><span class="mono">Client</span><b>${p.client}</b></div><div><span class="mono">Rôle</span><b>${p.role}</b></div></div>
      ${(p.results || []).length ? `<div class="lb-results">${p.results.map((r) => `<div><b>${r.value}</b><span>${r.label}</span></div>`).join('')}</div>` : ''}`;
    lbMedia.innerHTML = shotsFor(p).map((s) => `<img class="lb-img" src="${s}" alt="${p.title}" loading="lazy" />`).join('');
    lb.scrollTop = 0; lb.classList.add('is-open'); document.documentElement.style.overflow = 'hidden';
  };
  const closeLB = () => { if (!lb) return; lb.classList.remove('is-open'); document.documentElement.style.overflow = ''; };
  document.getElementById('lb-close') && document.getElementById('lb-close').addEventListener('click', closeLB);
  lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });

  let current = -1;
  const setCurrent = (i, dots, extra) => {
    i = gsap.utils.clamp(0, n - 1, i);
    if (i === current) return;
    current = i;
    if (curEl) curEl.textContent = String(i + 1).padStart(2, '0');
    dots.forEach((d, di) => d.classList.toggle('is-active', di === i));
    extra && extra(i);
  };

  // Le mobile et le desktop ont un DOM différent : on recharge si on franchit la rupture
  const mqM = window.matchMedia('(max-width: 820px)');
  try { mqM.addEventListener('change', () => window.location.reload()); } catch (e) { /* vieux navigateurs */ }

  // ================= MOBILE : cartes plein écran + scroll-snap natif + lightbox =================
  if (mqM.matches) {
    strip.classList.add('hgal__strip--native');
    strip.innerHTML = list.map((p, i) => `
      <article class="hpanel cursor-target" data-id="${p.id}" data-i="${i}" role="button" tabindex="0" aria-label="${p.title}">
        <div class="hpanel__media"><img src="${heroFor(p)}" alt="${p.title}" loading="${i < 3 ? 'eager' : 'lazy'}" /></div>
        <div class="hpanel__meta">
          <span class="hpanel__num">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span>
          <h3 class="hpanel__title">${p.title}</h3>
          <span class="hpanel__cat">${p.category} · ${p.year}</span>
          <span class="hpanel__see">Voir les visuels <i>↗</i></span>
        </div>
      </article>`).join('');
    const panels = gsap.utils.toArray('.hpanel');
    panels.forEach((pan) => {
      const p = projects.find((x) => x.id === pan.dataset.id);
      const go = () => p && openLB(p);
      pan.addEventListener('click', go);
      pan.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    if (dotsWrap) dotsWrap.innerHTML = list.map((p, i) => `<button class="hgal__dot" data-i="${i}" aria-label="Projet ${i + 1} : ${p.title}"></button>`).join('');
    const dots = dotsWrap ? gsap.utils.toArray('.hgal__dot') : [];
    const mark = (i) => panels.forEach((pan, pi) => pan.classList.toggle('is-current', pi === i));
    const onScroll = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      if (fill) fill.style.transform = `scaleX(${max > 0 ? strip.scrollLeft / max : 0})`;
      const center = strip.scrollLeft + strip.clientWidth / 2;
      let idx = 0, best = Infinity;
      panels.forEach((pan, pi) => { const c = pan.offsetLeft + pan.offsetWidth / 2; const d = Math.abs(c - center); if (d < best) { best = d; idx = pi; } });
      setCurrent(idx, dots, mark);
    };
    strip.addEventListener('scroll', onScroll, { passive: true });
    dots.forEach((d) => d.addEventListener('click', () => {
      const pan = panels[+d.dataset.i];
      strip.scrollTo({ left: pan.offsetLeft + pan.offsetWidth / 2 - strip.clientWidth / 2, behavior: 'smooth' });
    }));
    // Passer / revenir avant la galerie
    const goTo = (y) => (window.__lenis ? window.__lenis.scrollTo(y) : window.scrollTo(0, y));
    const before = document.getElementById('hgal-before');
    const after = document.getElementById('hgal-after');
    before && before.addEventListener('click', () => goTo(Math.max(0, section.offsetTop - 8)));
    after && after.addEventListener('click', () => goTo(section.offsetTop + section.offsetHeight + 8));
    onScroll();
    return;
  }

  // ================= DESKTOP : chapitres (infos + visuels collés) en ligne horizontale =================
  strip.innerHTML = list.map((p, i) => {
    const shots = shotsFor(p).map((src, j) => {
      const d = IMG_DIMS[src];
      const dim = d ? ` width="${d[0]}" height="${d[1]}"` : '';
      return `<div class="hp-shot"><img src="${src}"${dim} alt="${p.title} — visuel ${j + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" /></div>`;
    }).join('');
    return `
      <section class="hp" id="proj-${i}" data-i="${i}" aria-label="${p.title}">
        <div class="hp-info">
          <span class="hp-info__num">${String(i + 1).padStart(2, '0')} <i>/</i> ${String(n).padStart(2, '0')}</span>
          <h3 class="hp-info__title">${p.title}</h3>
          <span class="hp-info__cat">${p.category} · ${p.year}</span>
          <p class="hp-info__desc">${p.description}</p>
          <div class="hp-info__meta">
            <div><span class="mono">Client</span><b>${p.client}</b></div>
            <div><span class="mono">Rôle</span><b>${p.role}</b></div>
          </div>
        </div>
        <div class="hp-shots">${shots}</div>
      </section>`;
  }).join('');
  const chapters = gsap.utils.toArray('.hp');

  if (dotsWrap) dotsWrap.innerHTML = list.map((p, i) =>
    `<button class="hgal__dot" data-i="${i}" aria-label="${i + 1}. ${p.title}"><span class="hgal__dot-label">${p.title}</span></button>`).join('');
  const dots = dotsWrap ? gsap.utils.toArray('.hgal__dot') : [];

  if (REDUCE) { viewport.style.overflowX = 'auto'; return; } // sans animation : défilement horizontal natif

  let offs = [], maxX = 1;
  const calc = () => { maxX = Math.max(1, strip.scrollWidth - window.innerWidth); offs = chapters.map((c) => c.offsetLeft); };
  calc();
  const idxFromX = (x) => {
    const probe = x + window.innerWidth * 0.32;
    let idx = 0;
    for (let k = 0; k < offs.length; k++) { if (offs[k] <= probe) idx = k; else break; }
    return idx;
  };
  const tween = gsap.to(strip, {
    x: () => -(strip.scrollWidth - window.innerWidth), ease: 'none',
    scrollTrigger: {
      trigger: viewport, start: 'top top',
      end: () => `+=${Math.max(1, strip.scrollWidth - window.innerWidth)}`,
      pin: viewport, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
      onRefresh: calc,
      onUpdate: (self) => {
        if (fill) fill.style.transform = `scaleX(${self.progress})`;
        setCurrent(idxFromX(self.progress * maxX), dots);
      },
    },
  });
  const st = tween.scrollTrigger;
  dots.forEach((d) => d.addEventListener('click', () => {
    const target = gsap.utils.clamp(0, 1, (offs[+d.dataset.i] - window.innerWidth * 0.06) / maxX);
    const y = st.start + target * (st.end - st.start);
    window.__lenis ? window.__lenis.scrollTo(y) : window.scrollTo(0, y);
  }));
  setCurrent(0, dots);

  // Passer la galerie (→ après) ou revenir avant, en un clic
  const goTo = (y) => (window.__lenis ? window.__lenis.scrollTo(y) : window.scrollTo(0, y));
  const before = document.getElementById('hgal-before');
  const after = document.getElementById('hgal-after');
  before && before.addEventListener('click', () => goTo(Math.max(0, st.start - 4)));
  after && after.addEventListener('click', () => goTo(st.end + 4));

  // La largeur de chaque visuel est réservée via width/height (IMG_DIMS) → scrollWidth
  // correct dès le départ : pas de recalcul en plein scroll, donc pas de saut.
  // Un seul refresh après chargement des polices (le titre peut changer la hauteur).
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* ---------- Moodshot "la ville dort" : ambiance nocturne vivante en continu ---------- */
function initMoodshot() {
  const sec = document.querySelector('.moodshot');
  if (!sec || REDUCE) return;
  const img = sec.querySelector('.moodshot__img');
  // Flottement doux de la fenêtre
  if (img) gsap.to(img, { y: -14, duration: 5.2, ease: 'sine.inOut', repeat: -1, yoyo: true });

  // ---- Pluie en canvas : 3 plans de profondeur (perspective) + brises de vent ----
  const canvas = document.createElement('canvas');
  canvas.className = 'moodshot__rain';
  canvas.setAttribute('aria-hidden', 'true');
  sec.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  const resize = () => {
    const r = sec.getBoundingClientRect();
    W = r.width; H = Math.max(r.height, sec.offsetHeight, sec.scrollHeight);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
  window.addEventListener('load', resize);
  if (document.fonts) document.fonts.ready.then(resize);
  if (img) img.addEventListener('load', resize); // la fenêtre (lazy) agrandit la section en chargeant
  gsap.delayedCall(0.6, resize);

  const rnd = (a, b) => a + Math.random() * (b - a);
  const COUNT = Math.round(gsap.utils.clamp(120, 250, W / 6.5));
  const drops = [];
  for (let i = 0; i < COUNT; i++) {
    const depth = Math.random();           // 0 = loin (lent/pâle/fin), 1 = près (rapide/net/épais)
    const speed = 300 + depth * 250;       // écart faible → angles cohérents, un peu plus lent
    drops.push({ x: rnd(-0.2 * W, 1.2 * W), y: rnd(-H, H), depth, speed,
      len: speed * 0.05, thick: 0.5 + depth * 1.1, alpha: 0.07 + depth * 0.2 });
  }

  let wind = 0, gust = 0, t = 0, last = 0, raf = 0, running = false;
  const frame = (now) => {
    if (!running) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now; t += dt;
    gust += (0 - gust) * Math.min(1, dt / 1.6); // la rafale retombe en ~1.6 s
    // Brise douce + rafale : le MÊME vent pour toutes les gouttes → angle cohérent
    wind = 18 + Math.sin(t * 0.4) * 15 + Math.sin(t * 0.11) * 22 + gust;
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    for (const d of drops) {
      const vx = wind * (0.85 + d.depth * 0.3); // vent quasi uniforme + légère parallaxe de profondeur
      const vy = d.speed;
      d.x += vx * dt; d.y += vy * dt;
      if (d.y > H + d.len) { d.y = rnd(-0.4 * H, -10); d.x = rnd(-0.2 * W, 1.2 * W); }
      if (d.x > 1.25 * W) d.x = -0.2 * W; else if (d.x < -0.25 * W) d.x = 1.2 * W;
      const m = d.len / Math.hypot(vx, vy); // traînée orientée selon la vitesse (motion blur)
      ctx.strokeStyle = `rgba(190,206,228,${d.alpha})`;
      ctx.lineWidth = d.thick;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - vx * m, d.y - vy * m);
      ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!running) { running = true; last = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  // ---- Éclairs (qu'on ne voit pas) : la scène flashe, suivie d'une rafale (le « tonnerre ») ----
  const flash = document.createElement('div');
  flash.className = 'moodshot__flash';
  flash.setAttribute('aria-hidden', 'true');
  sec.appendChild(flash);
  const blast = () => { gust = rnd(150, 300) * (Math.random() < 0.5 ? -1 : 1); }; // rafale forte
  const lightning = () => {
    if (running) {
      const tl = gsap.timeline();
      tl.set(flash, { opacity: 0 })
        .to(flash, { opacity: rnd(0.45, 0.7), duration: 0.05, ease: 'none' })
        .to(flash, { opacity: 0.06, duration: 0.09 })
        .to(flash, { opacity: rnd(0.6, 0.95), duration: 0.05 }) // 2e coup, plus fort
        .to(flash, { opacity: 0, duration: 0.55, ease: 'power2.out' });
      gsap.delayedCall(rnd(0.15, 0.5), blast); // la bourrasque arrive juste après l'éclair
    }
    gsap.delayedCall(rnd(7, 18), lightning);
  };
  gsap.delayedCall(rnd(4, 9), lightning);

  // ---- Rafales aléatoires indépendantes (le vent qui « passe » fort) ----
  const scheduleGust = () => { if (running) blast(); gsap.delayedCall(rnd(5, 13), scheduleGust); };
  gsap.delayedCall(rnd(3, 7), scheduleGust);

  // Pause hors écran (perf)
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { resize(); start(); } else stop(); }), { threshold: 0 }).observe(sec);
}

/* ---------- Médias encadrés (GIFs) : reveal clip + parallaxe interne + tilt ---------- */
function initFeatureMedia() {
  if (REDUCE) return;
  gsap.utils.toArray('.feature__media').forEach((fr) => {
    gsap.from(fr, {
      clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: fr, start: 'top 82%' },
    });
    const inner = fr.querySelector('.feature__media-inner');
    if (inner) gsap.fromTo(inner, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: fr, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  // Tilt 3D au survol
  if (FINE) gsap.utils.toArray('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * 9, rotateX: -py * 9, duration: 0.5, ease: 'power3.out', transformPerspective: 900 });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' }));
  });
  // Reveal de la fenêtre
  const win = document.querySelector('.moodshot__img');
  if (win) gsap.from(win, {
    opacity: 0, scale: 1.06, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.moodshot', start: 'top 75%' },
  });
}

/* ---------- Footer : vague qui rebondit élastiquement à l'arrivée (doc2) ---------- */
/* ---------- Déco : illustration du footer + chien qui court le long de la navbar ---------- */
function initDecor() {
  // Illustration placée à côté du slogan du footer (statique, bien alignée)
  const footer = document.querySelector('.footer');
  const slogan = footer && footer.querySelector('.footer__slogan');
  if (slogan && !footer.querySelector('.footer__art')) {
    const art = document.createElement('img');
    art.className = 'footer__art'; art.src = '/footer.png'; art.alt = ''; art.loading = 'lazy';
    art.setAttribute('aria-hidden', 'true');
    const row = document.createElement('div');
    row.className = 'footer__hero';
    slogan.parentNode.insertBefore(row, slogan);
    row.appendChild(slogan);
    row.appendChild(art);
  }
  // Chien (court sur place dans le gif) qui traverse la ligne verte du footer → il « avance »
  const wave = document.querySelector('.footer__wave');
  if (wave && !wave.querySelector('.footer__pet')) {
    const pet = document.createElement('img');
    pet.className = 'footer__pet'; pet.src = '/pet.webp'; pet.alt = '';
    pet.setAttribute('aria-hidden', 'true');
    wave.appendChild(pet);
    if (!REDUCE) {
      const PETW = 74; // largeur approx (hauteur 54 × 4/3)
      const svg = wave.querySelector('svg');
      let started = false;
      const run = () => {
        if (started || !svg) return;
        started = true;
        const sr = svg.getBoundingClientRect(), wr = wave.getBoundingClientRect();
        const lineL = sr.left - wr.left;          // début exact de la ligne (relatif à la vague)
        const lineR = lineL + sr.width - PETW;    // fin exacte (le chien reste dessus)
        let facing = 1;
        gsap.set(pet, { x: lineL });
        // Va-et-vient, strictement sur la ligne ; il se retourne aux extrémités
        gsap.to(pet, {
          x: lineR, duration: 26, ease: 'none', repeat: -1, yoyo: true,
          onRepeat: () => { facing *= -1; gsap.set(pet, { scaleX: facing }); },
        });
      };
      // On démarre quand le footer est visible (mise en page prête → bornes correctes)
      new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) run(); }), { threshold: 0.1 }).observe(wave);
    }
  }
}

function initFooterWave() {
  const path = document.querySelector('#footer-wave-path');
  if (!path || REDUCE) return;
  const flat = 'M0 30 Q 360 30 720 30 T 1440 30';
  const wave = 'M0 30 Q 360 -18 720 30 T 1440 30';
  ScrollTrigger.create({
    trigger: '.footer', start: 'top bottom', toggleActions: 'play none none reverse',
    onEnter: (self) => {
      const variation = Math.min(0.6, Math.abs(self.getVelocity()) / 12000);
      gsap.fromTo(path, { morphSVG: wave },
        { duration: 1.6, morphSVG: flat, ease: `elastic.out(${1 + variation}, 0.4)`, overwrite: true });
    },
  });
}

/* ---------- Navbar : se cache au scroll bas, réapparaît au scroll haut ---------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  if (REDUCE) return;
  const show = gsap.from(nav, { yPercent: -120, paused: true, duration: 0.3, ease: 'power2.out' }).progress(1);
  ScrollTrigger.create({
    start: 'top top', end: 'max',
    onUpdate: (self) => { self.direction === -1 || self.scroll() < 80 ? show.play() : show.reverse(); },
  });
}

/* ---------- Reveals SplitText par lignes (titres de sections) ---------- */
function initSplitReveals() {
  if (REDUCE) { gsap.set('[data-split]', { opacity: 1 }); return; }
  document.fonts.ready.then(() => {
    gsap.utils.toArray('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'words,lines', mask: 'lines', autoSplit: true,
        onSplit: (inst) => gsap.from(inst.lines, {
          yPercent: 110, stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }),
      });
    });
  });
}

/* ---------- Particules de clic GLOBALES : éclatent partout où on clique ---------- */
function initClickParticles() {
  if (REDUCE) return;
  // Pas de simulation physique à chaque tap sur mobile/tactile (jank, menu qui rame)
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:0;top:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(container);
  const burst = (cx, cy) => {
    gsap.set(container, { x: cx, y: cy });
    const n = 14;
    for (let i = 0; i < n; i++) {
      const dot = document.createElement('div');
      const size = gsap.utils.random(4, 10);
      dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:var(--accent);`;
      container.appendChild(dot);
      gsap.set(dot, { xPercent: -50, yPercent: -50 });
      gsap.to(dot, {
        physics2D: { angle: gsap.utils.random(0, 360), velocity: gsap.utils.random(110, 320), gravity: 460 },
        duration: 0.9 + Math.random() * 0.7, onComplete: () => dot.remove(),
      });
      gsap.to(dot, { opacity: 0, duration: 0.3, delay: 0.55 });
    }
  };
  // Partout sur le site, au clic
  document.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return; // clic gauche uniquement
    burst(e.clientX, e.clientY);
  }, { passive: true });
}

/* ---------- Projets phares : bento qui s'ouvre en plein écran via Flip (doc1) ---------- */
let workFlipCtx;
function initWorkBento() {
  const gallery = document.getElementById('gallery-work');
  if (!gallery || REDUCE) return;
  const items = gallery.querySelectorAll('.gallery__item');
  // Desktop uniquement : l'expansion plein écran via Flip (chaotique en mobile)
  gsap.matchMedia().add('(min-width: 769px)', () => {
    const build = () => {
      workFlipCtx && workFlipCtx.revert();
      gallery.classList.remove('gallery--final');
      workFlipCtx = gsap.context(() => {
        gallery.classList.add('gallery--final');
        const state = Flip.getState(items);
        gallery.classList.remove('gallery--final');
        const flip = Flip.to(state, { simple: true, ease: 'expoScale(1, 5)' });
        gsap.timeline({
          scrollTrigger: { trigger: gallery, start: 'center center', end: '+=120%', scrub: true, pin: gallery.parentNode },
        }).add(flip);
        return () => gsap.set(items, { clearProps: 'all' });
      });
    };
    build();
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(build, 200); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); workFlipCtx && workFlipCtx.revert(); };
  });
}

/* ---------- Reveal générique au scroll ---------- */
function initReveals() {
  if (REDUCE) { gsap.set('.reveal-up', { opacity: 1, y: 0 }); return; }
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
  // Cartes projet
  gsap.utils.toArray('.work-card').forEach((card) => {
    gsap.from(card, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 82%' } });
  });
}

/* ---------- Compteurs ---------- */
function initCounters() {
  gsap.utils.toArray('.stat__num').forEach((el) => {
    const target = +el.dataset.target || 0;
    const prefix = el.dataset.prefix || '';
    if (REDUCE) { el.textContent = prefix + target; return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = prefix + Math.round(obj.v); },
    });
  });
}

/* ---------- Page /about : accordéon expertises (une ouverte à la fois) ---------- */
/* ---------- À propos : portrait avec le hover du hero (spotlight qui révèle un univers, sans voyage) ---------- */
function initAboutPortrait() {
  const box = document.querySelector('.about-portrait');
  if (!box || !FINE) return;
  const peek = box.querySelector('.about__peek');
  if (!peek) return;
  const pool = ['/profil2.webp', '/profil3.webp', '/profil4.webp']; // univers (Minecraft / Crayon / Pixel)
  let active = false, last = -1;
  box.addEventListener('pointerenter', () => {
    let idx; do { idx = Math.floor(Math.random() * pool.length); } while (idx === last && pool.length > 1);
    last = idx;
    peek.style.backgroundImage = `url(${pool[idx]})`;
    active = true;
  });
  box.addEventListener('pointermove', (e) => {
    if (!active) return;
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    gsap.to(peek, { clipPath: `circle(26% at ${x}% ${y}%)`, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  });
  box.addEventListener('pointerleave', () => {
    active = false;
    gsap.to(peek, { clipPath: 'circle(0% at 50% 50%)', duration: 0.4, ease: 'power2.in', overwrite: 'auto' });
  });
}

function initAbout() {
  initAboutPortrait();
  const items = gsap.utils.toArray('.exp__item');
  if (!items.length) return;
  items.forEach((item) => {
    item.querySelector('.exp__head').addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((i) => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
}

/* ---------- Page /contact : horloge Cotonou live + envoi AJAX + bouton Send→Sent (doc11) ---------- */
function initContact() {
  const hmEl = document.getElementById('cotonou-hm');
  if (hmEl) {
    const TZ = 'Africa/Lagos'; // Cotonou (GMT+1)
    const secEl = document.getElementById('cotonou-sec');
    const dateEl = document.getElementById('cotonou-date');
    const card = document.getElementById('clock');
    const hmFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
    const sFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, second: '2-digit' });
    const dFmt = new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' });
    const hFmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false });
    const tick = () => {
      const now = new Date();
      hmEl.textContent = hmFmt.format(now);
      if (secEl) secEl.textContent = sFmt.format(now).padStart(2, '0');
      if (dateEl) dateEl.textContent = dFmt.format(now);
      if (card) {
        const h = parseInt(hFmt.format(now), 10) % 24;
        const day = h >= 6 && h < 18;
        card.classList.toggle('is-day', day);
        card.classList.toggle('is-night', !day);
      }
    };
    tick(); setInterval(tick, 1000);
  }
  const form = document.getElementById('contact-form');
  if (!form) return;
  const btn = form.querySelector('.form__submit');
  const label = btn.querySelector('.btn__label') || btn;
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true; status.textContent = '';
    if (!REDUCE) gsap.to(label, { duration: 0.4, text: 'Envoi...', ease: 'none' });
    else label.textContent = 'Envoi...';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      gsap.to(label, { duration: 0.4, text: 'Envoyé ✓', ease: 'none' });
      btn.classList.add('is-sent');
      status.textContent = 'Merci, je te réponds très vite.';
      form.reset();
    } catch {
      gsap.to(label, { duration: 0.3, text: 'Réessayer', ease: 'none' });
      status.textContent = 'Oups, une erreur est survenue. Écris-moi directement à kspynel@gmail.com.';
      btn.disabled = false;
    }
  });
}

/* ---------- Transitions de page (doc12) : rideau MorphSVG + logotype ---------- */
function initPageTransition() {
  const overlay = document.getElementById('transition');
  const path = document.getElementById('transition-path');
  const logo = document.getElementById('transition-logo');
  if (!overlay || !path) return;
  const covered = 'M0 0 H100 V100 Q50 122 0 100 Z'; // couvre tout, bord bas convexe
  const open = 'M0 0 H100 V0 Q50 0 0 0 Z';           // retiré en haut

  // ENTER : le rideau (déjà couvert) se retire
  if (REDUCE) { overlay.style.visibility = 'hidden'; }
  else {
    gsap.set(path, { attr: { d: covered } });
    gsap.set(logo, { opacity: 1 });
    gsap.timeline()
      .to(logo, { opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(path, { duration: 0.8, ease: 'power4.inOut', morphSVG: open }, '-=0.1')
      .set(overlay, { visibility: 'hidden' });
  }

  // EXIT : au clic d'un lien interne, le rideau se referme puis navigue
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (a.target === '_blank' || a.hasAttribute('onclick')) return;
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (REDUCE) { window.location = href; return; }
      overlay.style.visibility = 'visible';
      gsap.timeline({ onComplete: () => { window.location = href; } })
        .set(path, { attr: { d: open } })
        .set(logo, { opacity: 0 })
        .to(path, { duration: 0.6, ease: 'power4.inOut', morphSVG: covered })
        .to(logo, { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.28');
    });
  });
}

/* ---------- Menu plein écran (doc19) : panneaux en cascade, burger→X, interruptible ---------- */
function initMenu() {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('menu');
  if (!burger || !menu) return;
  const panels = menu.querySelectorAll('.menu__panel');
  const links = menu.querySelectorAll('.menu__list a');
  const [t, m, bot] = burger.querySelectorAll('span');

  gsap.set(panels, { xPercent: 120 });
  gsap.set(links, { opacity: 0, x: -24 });

  const tl = gsap.timeline({
    paused: true,
    onReverseComplete: () => { menu.style.visibility = 'hidden'; menu.style.pointerEvents = 'none'; },
  })
    .set(menu, { visibility: 'visible', pointerEvents: 'auto' })
    .to(panels, { xPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0)
    .to(links, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, 0.22)
    .to(t, { rotate: 45, y: 7, duration: 0.3, ease: 'power2.inOut' }, 0)
    .to(m, { opacity: 0, duration: 0.15 }, 0)
    .to(bot, { rotate: -45, y: -7, duration: 0.3, ease: 'power2.inOut' }, 0);

  let open = false;
  const toggle = (force) => {
    open = force !== undefined ? force : !open;
    burger.setAttribute('aria-expanded', open);
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    open ? tl.timeScale(1).play() : tl.timeScale(1.7).reverse();
  };
  burger.addEventListener('click', () => toggle());
  links.forEach((a) => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) toggle(false); });
}

/* ---------- HMR : rechargement complet à chaque modif (cette page GSAP ne supporte pas le hot-patch partiel) ---------- */
if (import.meta.hot) {
  import.meta.hot.accept(() => window.location.reload());
}
