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
  initFeatureMedia();
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
  // Desktop : scroll horizontal pinné + chars qui se dispersent
  mm.add('(min-width: 769px)', () => {
    const split = SplitText.create(text, { type: 'chars,words' });
    let entered = false;
    const scrollTween = gsap.to(text, {
      xPercent: -100, ease: 'none',
      scrollTrigger: {
        trigger: wrap, pin: true, end: '+=1800', scrub: true, invalidateOnRefresh: true,
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
  // Mobile : phrase qui se révèle simplement (pas de pin, pas de vide)
  mm.add('(max-width: 768px)', () => {
    const split = SplitText.create(text, { type: 'lines', mask: 'lines' });
    gsap.from(split.lines, {
      yPercent: 110, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 75%' },
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
  const lightTargets = '.hero__title, .hero__role, .lead, .btn--ghost, .hero__mark';
  const setRole = (i) => roles.forEach((r, idx) => r.classList.toggle('is-active', idx === i));
  setRole(0);

  // Thèmes par univers (fond + lueur + couleurs + POLICE/style), dans l'ordre de révélation
  const THEMES = [
    { bg: '#0a0a0b', glow: 'rgba(200,241,53,0.24)', fg: '#f4f4f2', accent: '#c8f135', font: "var(--font-display)", size: 'clamp(2.4rem,6.5vw,5.6rem)', weight: 600, tracking: '-0.03em' }, // Vraie photo (marque)
    { bg: '#0c1d12', glow: 'rgba(120,200,100,0.32)', fg: '#eaf6e8', accent: '#7ed957', font: "'Pixelify Sans', sans-serif", size: 'clamp(2.4rem,6.6vw,5.6rem)', weight: 700, tracking: '0.01em' }, // Minecraft
    { bg: '#efe6d2', glow: 'rgba(255,205,70,0.45)', fg: '#1a1408', accent: '#ff5a3c', font: "'Gloria Hallelujah', cursive", size: 'clamp(1.9rem,4.8vw,4rem)', weight: 400, tracking: '0' }, // Crayon (clair)
    { bg: '#141420', glow: 'rgba(180,120,255,0.34)', fg: '#ece8ff', accent: '#b478ff', font: "'Press Start 2P', monospace", size: 'clamp(1rem,2.6vw,2.3rem)', weight: 400, tracking: '0' }, // Pixel
    { bg: '#1c1206', glow: 'rgba(214,150,70,0.32)', fg: '#f4ead6', accent: '#e8a23c', font: "'Pirata One', system-ui", size: 'clamp(3rem,8vw,7.5rem)', weight: 400, tracking: '0.01em' }, // One Piece
  ];
  const applyFont = (t) => gsap.set('.hero__title', { fontFamily: t.font, fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking });
  const setTheme = (t) => {
    gsap.set('.hero__bg', { backgroundColor: t.bg });
    gsap.set('.hero__glow', { backgroundColor: t.glow });
    gsap.set([...document.querySelectorAll(lightTargets)], { color: t.fg });
    gsap.set('.hero__title em', { color: t.accent });
    applyFont(t);
  };

  if (REDUCE) { gsap.set(stageLayers, { clipPath: 'circle(0% at 50% 50%)' }); setTheme(THEMES[4]); return; }

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
    const pool = ['/profil.webp', '/profil2.webp', '/profil3.webp', '/profil4.webp', '/profil1.webp'];
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
      trigger: '.hero', start: 'top top', end: '+=170%', pin: true, anticipatePin: 1,
      invalidateOnRefresh: true, scrub: 0.4,
      onToggle: (self) => { if (self.isActive && roleTimer) { clearInterval(roleTimer); roleTimer = null; } },
      onUpdate: (self) => {
        if (!roleTimer) setRole(Math.min(roles.length - 1, Math.floor(self.progress * roles.length * 0.999)));
        markSpin.timeScale(1 + Math.abs(self.getVelocity() / 300));
        const pr = self.progress;
        currentImg = pr < 0.23 ? 0 : pr < 0.44 ? 1 : pr < 0.65 ? 2 : pr < 0.86 ? 3 : 4;
      },
    },
  });
  const reveal = (layer, t, at, d = 0.17) => {
    tl.to(layer, { clipPath: 'circle(0% at 50% 50%)', ease: 'power2.inOut', duration: d }, at)
      .to('.hero__bg', { backgroundColor: t.bg, ease: 'power1.inOut', duration: d }, at)
      .to('.hero__glow', { backgroundColor: t.glow, ease: 'power1.inOut', duration: d }, at)
      .to(lightTargets, { color: t.fg, ease: 'power1.inOut', duration: d }, at)
      .to('.hero__title em', { color: t.accent, ease: 'power1.inOut', duration: d }, at)
      // changement de POLICE/style synchronisé au milieu de la révélation
      .set('.hero__title', { fontFamily: t.font, fontSize: t.size, fontWeight: t.weight, letterSpacing: t.tracking }, at + d * 0.5);
  };
  reveal(stageLayers[0], THEMES[1], 0.08); // vraie photo → Minecraft
  reveal(stageLayers[1], THEMES[2], 0.30); // → Crayon
  reveal(stageLayers[2], THEMES[3], 0.52); // → Pixel
  reveal(stageLayers[3], THEMES[4], 0.74); // → One Piece
  // Sortie : le texte du hero s'efface (pas de rideau, pour laisser admirer l'entrée du manifeste)
  tl.to('.hero__intro, .hero__mark', { opacity: 0, ease: 'power2.in', duration: 0.12 }, 0.9);
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
    if (glow && sec.dataset.glow) gsap.to(glow, { backgroundColor: sec.dataset.glow, duration: 1, ease: 'power2.out', overwrite: 'auto' });
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
      url: 'crispy.kspynel.com', desc: "Site de commande pour une enseigne de restauration rapide premium. Interface gourmande, claire et fluide.",
      imgs: ['/visuals/showcase/crispy-1.webp', '/visuals/showcase/crispy-2.webp', '/visuals/showcase/crispy-3.webp'] },
    'visual-concept-1': { title: 'Vintage', cat: 'Site Web · E-commerce', year: '2026', client: 'Vintage Bénin', role: 'Web Design & Direction Artistique',
      url: 'vintage.bj', desc: "Maquette du site Vintage Bénin : achat-vente de pièces uniques de seconde main. Une direction rétro, colorée et vivante.",
      imgs: ['/visuals/showcase/vintage.webp'] },
  };
  const order = ['crispy', 'arbitra', 'scan360', 'nextgen', 'astro', 'visual-concept-1'];
  const items = order.map((id) => {
    const p = projects.find((x) => x.id === id) || {};
    const o = SC[id] || {};
    return {
      id, title: o.title || p.title, cat: o.cat || `${p.category} · ${p.year}`,
      client: o.client || p.client, role: o.role || p.role, desc: o.desc || p.description,
      url: o.url || `${id}.kspynel.com`, imgs: o.imgs || collectImages(p),
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
          <div class="browser__page">${p.imgs.map((s) => `<img src="${s}" alt="" loading="lazy" />`).join('')}</div>
        </div>
      </figure>
    </article>`).join('');

  gsap.matchMedia().add('(min-width: 821px)', () => {
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
  const track = document.getElementById('projets-grid');
  const section = document.getElementById('pslider');
  if (!track || !section) return;

  // ---- Lightbox (détail projet, défile via data-lenis-prevent) ----
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
    lbMedia.innerHTML = collectImages(p).map((s) => `<img class="lb-img" src="${s}" alt="${p.title}" loading="lazy" />`).join('');
    lb.scrollTop = 0;
    lb.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  };
  const closeLB = () => {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  };
  document.getElementById('lb-close') && document.getElementById('lb-close').addEventListener('click', closeLB);
  lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLB(); });

  const btns = gsap.utils.toArray('.filter__btn');
  const curEl = document.getElementById('pslide-current');
  const totEl = document.getElementById('pslide-total');
  const outer = (s) => s.querySelector('.pslide__outer');
  const inner = (s) => s.querySelector('.pslide__inner');
  const bgOf = (s) => s.querySelector('.pslide__bg');

  let st = null, slideEls = [], current = -1, slideTl = null, sliderObs = null, animating = false;

  const renderSlides = (list) => {
    track.innerHTML = list.map((p, i) => `
      <div class="pslide" data-id="${p.id}">
        <div class="pslide__outer"><div class="pslide__inner">
          <div class="pslide__bg" style="background-image:url('${p.heroImage}')">
            <div class="pslide__content">
              <span class="pslide__num pslide__anim">${String(i + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}</span>
              <h2 class="pslide__title pslide__anim">${p.title}</h2>
              <span class="pslide__cat pslide__anim">${p.category} · ${p.year}</span>
              <p class="pslide__desc pslide__anim">${p.description}</p>
              <a class="btn btn--primary pslide__view pslide__anim cursor-target" role="button" tabindex="0" data-id="${p.id}">Voir le projet <span class="btn__arrow">↗</span></a>
            </div>
          </div></div>
        </div>
      </div>`).join('');
    slideEls = gsap.utils.toArray('.pslide');
    if (totEl) totEl.textContent = String(list.length).padStart(2, '0');
    track.querySelectorAll('.pslide__view').forEach((el) => {
      const p = projects.find((x) => x.id === el.dataset.id);
      el.addEventListener('click', (e) => { e.preventDefault(); openLB(p); });
    });
  };

  const goto = (index, dir, onDone) => {
    if (index === current || !slideEls[index]) { onDone && onDone(); return; }
    const dF = dir === -1 ? -1 : 1;
    slideTl && slideTl.kill();
    slideTl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.inOut' }, onComplete: () => onDone && onDone() });
    if (current >= 0 && slideEls[current]) {
      gsap.set(slideEls[current], { zIndex: 0 });
      slideTl.to(bgOf(slideEls[current]), { yPercent: -12 * dF }, 0).set(slideEls[current], { autoAlpha: 0 });
    }
    const s = slideEls[index];
    gsap.set(s, { autoAlpha: 1, zIndex: 1 });
    slideTl.fromTo([outer(s), inner(s)], { yPercent: (i) => (i ? -100 * dF : 100 * dF) }, { yPercent: 0 }, 0)
      .fromTo(bgOf(s), { yPercent: 12 * dF }, { yPercent: 0 }, 0)
      .fromTo(s.querySelectorAll('.pslide__anim'), { autoAlpha: 0, yPercent: 60 * dF }, { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: 'power2', stagger: 0.05 }, 0.2);
    current = index;
    if (curEl) curEl.textContent = String(index + 1).padStart(2, '0');
  };

  // Slider PINNÉ : la section se fige plein écran, on parcourt les projets au scroll, sortie naturelle vers le footer
  const setupSlider = () => {
    if (st) { st.kill(); st = null; }
    current = -1;
    if (REDUCE) { gsap.set(slideEls, { clearProps: 'all' }); return; } // CSS montre les slides empilées
    gsap.set(slideEls, { autoAlpha: 0 });
    gsap.set(slideEls.map(outer), { yPercent: 100 });
    gsap.set(slideEls.map(inner), { yPercent: -100 });
    goto(0, 1);
    if (slideEls.length < 2) return;
    const n = slideEls.length;
    const idxFrom = (prog) => Math.round(gsap.utils.clamp(0, 1, prog) * (n - 1));
    st = ScrollTrigger.create({
      trigger: section, start: 'top top', end: `+=${n * 110}%`, // ~1.1 écran par projet
      pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' },
      onUpdate: (self) => {
        const i = idxFrom(self.progress);
        if (i !== current) goto(i, i > current ? 1 : -1);
      },
    });
  };

  renderSlides(projects);
  setupSlider();

  // ---- Filtre : reconstruit le slider ----
  btns.forEach((btn) => btn.addEventListener('click', () => {
    btns.forEach((b) => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    const list = f === 'all' ? projects : projects.filter((p) => groupOf(p.category) === f);
    if (!list.length) return;
    renderSlides(list);
    setupSlider();
    ScrollTrigger.refresh();
    const top = section.offsetTop;
    window.__lenis ? window.__lenis.scrollTo(top) : window.scrollTo(0, top);
  }));

  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { setupSlider(); ScrollTrigger.refresh(); }, 250); });
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
    if (REDUCE) { el.textContent = target; return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v); },
    });
  });
}

/* ---------- Page /about : accordéon expertises (une ouverte à la fois) ---------- */
function initAbout() {
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
  const clock = document.getElementById('cotonou-time');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
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
