import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Core components
document.addEventListener('DOMContentLoaded', () => {
    // 0. Remove loading cloak
    document.documentElement.classList.remove('is-loading');
    gsap.to('body', { opacity: 1, duration: 0.4, ease: 'power2.out' });

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    initPageTransitions();
    initNavbar();
    initScrollReveal();
    initParallax();
    initMobileMenu();
    initCursor();
    initDynamicProjectPage();
    initProjectImageReveal();
    initProjectsScroll();
    initHomeUpgrades();
    initHeroTitleInteraction();
    initAboutStats();
    initNumbersParallax();
    initCVInteraction();
    initNumbersParallax();
    initCVInteraction();
    initServicesAccordion();
    initLightbox();
    initMetricCounters();
    initContactForm();

    // Intro Control Logic (Animation Disabled)
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    initHeroAnimation();
});

// Intro Doorway Animation (Refined for Immersion)
function initIntro() {
    return new Promise((resolve) => {
        const overlay = document.getElementById('intro-overlay');
        const portal = document.querySelector('.intro-portal');
        const logo = document.querySelector('.intro-logo');
        if (!overlay) {
            resolve();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                overlay.style.display = 'none';
                resolve();
            }
        });

        // 0. Reveal body (if hidden by CSS cloak)
        tl.to('body', { opacity: 1, duration: 0.1 });

        // 1. Initial State - Elegant Logo Reveal
        tl.to(logo, { opacity: 1, y: 0, scale: 0.9, duration: 1.2, ease: 'power4.out' });

        // 2. Light Burst from behind
        tl.to(portal, {
            scale: 1,
            opacity: 0.7,
            duration: 1.5,
            ease: 'expo.out'
        }, '-=0.8');

        // 3. Immersive Zoom "Into" the Universe
        tl.to(logo, {
            scale: 25,
            opacity: 0,
            duration: 1.4,
            ease: 'expo.inOut'
        }, '+=0.2');

        tl.to(portal, {
            scale: 80,
            opacity: 1,
            duration: 1.6,
            ease: 'expo.inOut'
        }, '-=1.4');

        // 4. Reveal content below
        tl.to(overlay, { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    });
}

/**
 * Hero Title Interaction
 */
function initHeroTitleInteraction() {
    const title = document.querySelector('.hero__title');
    if (!title) return;

    title.addEventListener('mouseenter', () => {
        gsap.to('.hero__title .highlight', {
            y: -8,
            duration: 0.4,
            ease: 'back.out(2)',
            stagger: 0.05
        });
    });

    title.addEventListener('mouseleave', () => {
        gsap.to('.hero__title .highlight', {
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    // ————————————————————————————————————————————————————————————————————————
    // ELITE INTERACTIVE DOT: MAGNETIC & ELASTIC PHYSICS
    // ————————————————————————————————————————————————————————————————————————
    const dot = document.querySelector('.highlight-dot');
    
    if (dot) {
        // Base floating animation (subtle breathing)
        const floatTl = gsap.timeline({ repeat: -1 });
        floatTl.to(dot, {
            y: "-=8",
            duration: 1.5,
            ease: "sine.inOut"
        }).to(dot, {
            y: "+=8",
            duration: 1.8,
            ease: "sine.inOut"
        });

        const magneticArea = 180; // Radius of interaction
        const snapThreshold = 35; // Dist to "snap" to cursor
        
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const dotRect = dot.parentNode.getBoundingClientRect(); // Target relative to the title
            const dotCenterX = dotRect.left + dotRect.width / 2;
            const dotCenterY = dotRect.top + dotRect.height / 2;
            
            const deltaX = clientX - dotCenterX;
            const deltaY = clientY - dotCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance < magneticArea) {
                dot.classList.add('is-active');
                
                // Calculate magnetic pull (more intense as it gets closer)
                const pullFactor = distance < snapThreshold ? 1 : (1 - distance / magneticArea) * 0.6;
                const targetX = deltaX * pullFactor;
                const targetY = deltaY * pullFactor;
                
                gsap.to(dot, {
                    x: targetX,
                    y: targetY,
                    scale: 1.8 + (1 - distance / magneticArea), // Grows as it gets closer
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                
                // Suspend base floating while interacting
                floatTl.pause();
            } else {
                dot.classList.remove('is-active');
                
                // Spring back to origin with elastic physics
                gsap.to(dot, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto",
                    onComplete: () => floatTl.resume()
                });
            }
        });
    }

    // Interactive Hero Magnetic/Parallax Effect for other words
    const heroTitle = document.querySelector('.hero__title');
    const heroWords = document.querySelectorAll('.hero__title > span span:not(.highlight-dot)');
    
    if (heroTitle) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (clientX - centerX) / 45;
            const moveY = (clientY - centerY) / 45;
            
            heroWords.forEach((word, index) => {
                const depth = (index + 1) * 0.4;
                gsap.to(word, {
                    x: moveX * depth,
                    y: moveY * depth,
                    duration: 0.9,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        });
    }
}

import { projects } from './projects.js';

// 8. Custom Cursor (Adaptive Logic)
function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // Disable custom cursor on mobile phones/tablets to avoid ghost taps
    // We check innerWidth and primary pointer type to avoid false positives on touchscreen laptops
    if (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches) {
        cursor.style.display = 'none';
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    const onMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursor.classList.contains('is-visible')) {
            cursor.classList.add('is-visible');
        }
        detectBackground(e.clientX, e.clientY);
    };

    const detectBackground = (x, y) => {
        const el = document.elementFromPoint(x, y);
        if (!el) return;

        let bgColor = window.getComputedStyle(el).backgroundColor;
        let parent = el;
        while ((bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') && parent.parentElement) {
            parent = parent.parentElement;
            bgColor = window.getComputedStyle(parent).backgroundColor;
        }

        const match = bgColor.match(/\d+/g);
        if (!match) return;
        const [r, g, b] = match.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        if (luminance < 0.5) cursor.classList.add('is-on-dark');
        else cursor.classList.remove('is-on-dark');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', () => cursor.classList.add('is-clicking'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-clicking'));

    gsap.ticker.add(() => {
        const isInteracting = cursor.classList.contains('is-hovering') || cursor.classList.contains('is-clicking') || cursor.classList.contains('is-project');
        
        // Toujours garder le centrage mathématique pour éviter tout saut
        const dt = 1.0 - Math.pow(1.0 - (isInteracting ? 1.0 : 0.4), gsap.ticker.deltaRatio());
        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;
        gsap.set(cursor, { x: cursorX, y: cursorY, xPercent: -50, yPercent: -50 });
    });

    const addHoverEvents = () => {
        const resetCursor = () => {
            cursor.classList.remove('is-hovering', 'is-project', 'is-ok', 'is-back', 'is-close');
        };

        document.querySelectorAll('a, button, [data-cursor], .menu-btn, .close-menu, .back-to-works').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const state = el.getAttribute('data-cursor');
                if (state === 'card') cursor.classList.add('is-project');
                else if (state === 'ok' || el.classList.contains('btn-rdv')) cursor.classList.add('is-ok');
                else if (state === 'back' || el.classList.contains('back-to-works')) cursor.classList.add('is-back');
                else if (state === 'close' || el.classList.contains('lightbox__close') || el.classList.contains('close-menu')) cursor.classList.add('is-close');
                else cursor.classList.add('is-hovering');
            });
            el.addEventListener('mouseleave', resetCursor);
        });

        document.querySelectorAll('.project-card, .work-card, .project-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-project'));
            el.addEventListener('mouseleave', resetCursor);
        });
    };

    addHoverEvents();
    // Refresh for dynamic content
    setInterval(addHoverEvents, 2000);
}

/**
 * Dynamic Project Rendering Logic (Only for project-detail.html)
 */
function initDynamicProjectPage() {
    const main = document.getElementById('dynamic-project-content');
    if (!main) return;

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = projects.find(p => p.id === projectId) || projects[0];

    document.title = `${project.title} | Case Study | kspynel.`;

    main.innerHTML = `
        <div class="project-hero">
            <div class="project-hero__bg" style="background-image: url('${project.heroImage}'); transform: scale(1.1);"></div>
            <div class="project-hero__content">
                <h1 class="project-hero__title serif">
                    ${project.title}
                </h1>
                <div class="project-hero__meta sans"><strong>${project.title}</strong> — ${project.category} / ${project.year}</div>
                <div class="scroll-indicator">
                    <span class="sans">DÉCOUVRIR LE PROJET</span>
                    <div class="scroll-indicator__line"></div>
                </div>
            </div>
        </div>

        <section class="project-meta-bar">
            <div class="containerWide">
                <div class="meta-grid">
                    <div class="meta-col">
                        <span class="meta-label">Rôle</span>
                        <div class="meta-value">${project.role}</div>
                    </div>
                    <div class="meta-col">
                        <span class="meta-label">Client</span>
                        <div class="meta-value">${project.client}</div>
                    </div>
                    <div class="meta-col">
                        <span class="meta-label">Année</span>
                        <div class="meta-value">${project.year}</div>
                    </div>
                    <div class="meta-col">
                        <span class="meta-label">Expertise</span>
                        <div class="meta-value">${project.category.split(' / ')[0]}</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="project-statement container">
            <h2 class="serif">"${project.description}"</h2>
        </section>

        <section class="project-context container">
            <div class="context-text reveal">
                <h3 class="sans text-upper" style="font-size: 12px; letter-spacing: 0.2em; color: #888; margin-bottom: 30px;">Le Challenge</h3>
                <p class="serif" style="font-size: 1.8rem; line-height: 1.4;">${project.challenge}</p>
            </div>
            <div class="context-image reveal">
                <img data-src="${project.gallery[0].images[0]}" alt="${project.title} Context" class="project-img lightbox-trigger" data-lightbox>
            </div>
        </section>

        <section class="project-gallery-modular">
            ${project.gallery.map((section, idx) => renderGallerySection(section, idx, project.title)).join('')}
        </section>

        <a href="${getNextProjectUrl(project.id)}" class="next-project">
            <div class="next-project__bg" style="background-image: url('${getNextProjectHero(project.id)}');"></div>
            <div class="next-project__content">
                <span class="next-project__label sans">Projet Suivant</span>
                <h2 class="next-project__title serif">${getNextProjectTitle(project.id)}</h2>
            </div>
        </a>
    `;

    // 2. Add the Intersection Observer for Modular Sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in-view');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-section').forEach(section => observer.observe(section));

    // Re-run animations for injected content
    setTimeout(() => {
        ScrollTrigger.refresh();
        initScrollReveal();
        initProjectPage(); // This handles Hero, Back Button, and Gallery Parallax
        initLightbox();
        initProjectImageReveal();
    }, 400); 
}

function renderGallerySection(section, index, projectTitle) {
    const type = section.type;
    const images = section.images;

    switch (type) {
        case 'full':
            return `
                <div class="gallery-section gallery-section--full">
                    <img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox>
                </div>
            `;
        case 'duo':
            return `
                <div class="containerWide gallery-section gallery-section--duo">
                    <div class="gallery-item"><img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                    <div class="gallery-item"><img data-src="${images[1]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                </div>
            `;
        case 'overlap-left':
            return `
                <div class="containerWide gallery-section gallery-section--overlap">
                    <div class="gallery-item img-main"><img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                    <div class="gallery-item img-overlay"><img data-src="${images[1] || images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                </div>
            `;
        case 'overlap-right':
            return `
                <div class="containerWide gallery-section gallery-section--overlap overlap-right">
                    <div class="gallery-item img-overlay"><img data-src="${images[1] || images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                    <div class="gallery-item img-main"><img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                </div>
            `;
        case 'split-forward':
            return `
                <div class="containerWide gallery-section gallery-section--split">
                    <div class="gallery-item"><img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                    <div class="gallery-item" style="height: 100%; display: flex; align-items: flex-end;">
                        <img data-src="${images[1] || images[0]}" alt="${projectTitle}" class="project-img" data-lightbox style="width: 100%; height: 50%; object-fit: cover;">
                    </div>
                </div>
            `;
        case 'split-reverse':
            return `
                <div class="containerWide gallery-section gallery-section--split reverse">
                    <div class="gallery-item" style="height: 100%; display: flex; align-items: flex-start;">
                        <img data-src="${images[1] || images[0]}" alt="${projectTitle}" class="project-img" data-lightbox style="width: 100%; height: 50%; object-fit: cover;">
                    </div>
                    <div class="gallery-item"><img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>
                </div>
            `;
        case 'centered':
            return `
                <div class="gallery-section gallery-section--centered">
                    <img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox>
                </div>
            `;
        case 'staggered':
            return `
                <div class="containerWide gallery-section gallery-section--staggered">
                    ${images.map(img => `<div class="gallery-item"><img data-src="${img}" alt="${projectTitle}" class="project-img" data-lightbox></div>`).join('')}
                </div>
            `;
        default:
            return `<div class="containerWide gallery-section"><img data-src="${images[0]}" alt="${projectTitle}" class="project-img" data-lightbox></div>`;
    }
}

function getNextProjectUrl(currentId) {
    const index = projects.findIndex(p => p.id === currentId);
    if (index === -1) return '/works.html';
    const nextProject = projects[(index + 1) % projects.length];

    if (nextProject.id === 'arbitra') return '/case-study.html';
    if (nextProject.id === 'snaki') return '/case-study-2.html';
    return `/project-detail.html?id=${nextProject.id}`;
}

function getNextProjectHero(currentId) {
    const index = projects.findIndex(p => p.id === currentId);
    if (index === -1) return projects[0].heroImage;
    return projects[(index + 1) % projects.length].heroImage;
}

function getNextProjectTitle(currentId) {
    const index = projects.findIndex(p => p.id === currentId);
    if (index === -1) return projects[0].title;
    return projects[(index + 1) % projects.length].title;
}

// 2. Page Transitions
function initPageTransitions() {
    const overlay = document.getElementById('page-transition');
    const navLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="index"], a[href^="works"], a[href^="about"], a[href^="contact"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#') || link.getAttribute('target') === '_blank') return;
            e.preventDefault();
            gsap.to(overlay, {
                scaleY: 1,
                duration: 0.35,
                ease: 'power2.inOut',
                onComplete: () => window.location.href = href
            });
        });
    });

    if (overlay) {
        gsap.set(overlay, { scaleY: 1, transformOrigin: 'bottom' });
        gsap.to(overlay, { scaleY: 0, duration: 0.45, ease: 'power2.inOut', delay: 0.1 });
    }
}

// 3. Navbar
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Initial state for project pages
        const isProjectPage = !!document.querySelector('.project-hero');
        if (isProjectPage) navbar.classList.add('on-dark');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }
}

// 4. Scroll Reveal
function initScrollReveal() {
    gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            }
        );
    });
}

// 5. Hero Animation
function initHeroAnimation() {
    const tl = gsap.timeline({ delay: 0.3 });
    const line1 = document.querySelector('.line-1');
    const line2 = document.querySelector('.line-2');
    const heroSub = document.querySelector('.hero__sub');
    const heroCta = document.querySelector('.hero__cta');

    if (line1) tl.from(line1, { yPercent: 110, duration: 0.9, ease: 'power4.out' });
    if (line2) tl.from(line2, { yPercent: 110, duration: 0.9, ease: 'power4.out' }, '-=0.7');
    if (heroSub) tl.from(heroSub, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
    if (heroCta) tl.from(heroCta, { opacity: 0, y: 15, duration: 0.5 }, '-=0.3');
}

// 6. Parallax
function initParallax() {
    gsap.utils.toArray('.project-item').forEach(item => {
        const num = item.querySelector('.project__num');
        if (num) {
            gsap.fromTo(num,
                { y: -30 },
                {
                    y: 30, ease: 'none',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }
    });
}

// 7. Burger Menu Overlay
function initMobileMenu() {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('nav-mobile-menu');

    if (burger && menu) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            burger.classList.toggle('open');
            menu.classList.toggle('open');
            document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('open');
                menu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
}

// 9. Project Page Experience (V4 Immersive)
function initProjectPage() {
    const hero = document.querySelector('.project-hero');
    if (!hero) return;

    // 1. Hero Entrance Animation
    const heroBg = hero.querySelector('.project-hero__bg');
    const heroTitle = hero.querySelector('.project-hero__title');

    if (heroBg && heroTitle) {
        // Force initial state directly to avoid CSS/JS race conditions
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        const heroTl = gsap.timeline({ delay: 0.3 });
        heroTl.to(heroBg, { scale: 1, duration: 2.5, ease: 'power2.out' });
        heroTl.to(heroTitle, { 
            y: 0, 
            opacity: 1,
            duration: 1.4, 
            ease: 'expo.out'
        }, '-=2.0');
    }

    // 2. Floating "Back to Works" Button (Directives 5)
    const backBtn = document.querySelector('.back-to-works');
    if (backBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backBtn.classList.add('is-visible');
            } else {
                backBtn.classList.remove('is-visible');
            }
        });
    }

    // 3. Gallery Parallax (Directives 3)
    gsap.utils.toArray('.gallery-item img').forEach(img => {
        gsap.fromTo(img,
            { yPercent: -8 },
            {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5
                }
            }
        );
    });

    // 4. Next Project Hover & Click (Directives 4)
    const nextProject = document.querySelector('.next-project');
    const overlay = document.getElementById('page-transition');
    if (nextProject && overlay) {
        nextProject.addEventListener('click', (e) => {
            e.preventDefault();
            const href = nextProject.getAttribute('href');
            gsap.to(overlay, {
                scaleY: 1,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => window.location.href = href
            });
        });
    }

    // 5. Numerical Counters (Narrative Step 7)
    gsap.utils.toArray('.metric-value').forEach(metric => {
        const endValue = parseInt(metric.getAttribute('data-value'));
        gsap.to(metric, {
            innerText: endValue,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: metric,
                start: 'top 90%'
            }
        });
    });
}

/**
 * 10. Performance - Intersection Observer for Lazy Reveal
 */
function initProjectImageReveal() {
    const projectImages = document.querySelectorAll('.project-img');
    if (!projectImages.length) return;

    const revealImg = (img) => {
        gsap.to(img, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    };

    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const realSrc = img.dataset.src;

                // Handle both data-src (lazy) and direct src (dynamic)
                if (realSrc && img.getAttribute('src') !== realSrc) {
                    img.src = realSrc;
                    if (img.complete) revealImg(img);
                    else img.onload = () => revealImg(img);
                } else if (img.getAttribute('src')) {
                    if (img.complete) revealImg(img);
                    else img.onload = () => revealImg(img);
                }

                imgObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1, rootMargin: '100px' });

    projectImages.forEach(img => {
        // Initial state for reveal
        if (gsap.getProperty(img, "opacity") !== 1) {
            gsap.set(img, { opacity: 0, y: 30 });
        }
        imgObserver.observe(img);
    });
}

/**
 * 11. Lightbox System
 */
function initLightbox() {
    if (!document.querySelector('.lightbox')) {
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
            <button class="lightbox__close">Close</button>
            <img class="lightbox__image" src="" alt="Large View">
            <div class="lightbox__caption sans"></div>
        `;
        document.body.appendChild(lb);
    }

    const lightbox = document.querySelector('.lightbox');
    const lbImg = lightbox.querySelector('.lightbox__image');
    const lbCap = lightbox.querySelector('.lightbox__caption');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    function openLightbox(src, alt) {
        lbImg.src = src;
        lbCap.textContent = alt || '';
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-lightbox]');
        if (trigger) {
            e.preventDefault();
            const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-active')) closeLightbox();
    });
}

/**
 * 12. Metric Counters
 */
function initMetricCounters() {
    gsap.utils.toArray('.metric-value').forEach(metric => {
        const targetValue = parseInt(metric.getAttribute('data-value'));
        if (isNaN(targetValue)) return;

        ScrollTrigger.create({
            trigger: metric,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(metric, {
                    innerText: targetValue,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out'
                });
            }
        });
    });
}

/**
 * 13. AJAX Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const btn = form.querySelector('#submit-btn');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        btn.disabled = true;
        const originalText = btn.innerText;
        btn.innerText = "Envoi en cours...";
        status.innerText = "";
        status.style.color = "var(--color-text)";

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerText = "Message envoyé avec succès ! Merci de votre confiance.";
                status.style.color = "#2ecc71";
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    status.innerText = data.errors.map(error => error.message).join(", ");
                } else {
                    status.innerText = "Oups ! Un problème est survenu. Veuillez réessayer.";
                }
                status.style.color = "#e74c3c";
            }
        } catch (error) {
            status.innerText = "Erreur : " + error.message;
            status.style.color = "#e74c3c";
        } finally {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
}

/**
 * 14. Projects Horizontal Scroll (Sticky + Track)
 */
function initProjectsScroll() {
    const section = document.querySelector('.projects-scroll');
    const track = document.querySelector('.projects-track');
    const counterEl = document.querySelector('.counter-current');
    const progressBar = document.querySelector('.projects-progress-bar');

    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        // Horizontal Scroll
        const getScrollAmount = () => {
            const trackWidth = track.scrollWidth;
            const wrapperWidth = track.parentElement.offsetWidth;
            return -(trackWidth - wrapperWidth + 100);
        };

        gsap.to(track, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${Math.abs(getScrollAmount()) + window.innerWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const cards = document.querySelectorAll('.project-card');
                    const progress = self.progress;

                    if (counterEl) {
                        const activeIndex = Math.min(Math.floor(progress * cards.length) + 1, cards.length);
                        counterEl.textContent = String(activeIndex).padStart(2, '0');
                    }
                    if (progressBar) {
                        progressBar.style.width = `${progress * 100}%`;
                    }
                }
            }
        });
    });

    mm.add("(max-width: 768px)", () => {
        // Vertical Reveal for cards
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 40,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                },
                delay: i * 0.08
            });
        });
    });
}

/**
 * 15. Scroll Hints & Home Upgrades
 */
function initHomeUpgrades() {
    // Hero Scroll Hint Animation
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
        gsap.to('.scroll-hint__line', {
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 1.2,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1
        });

        // Hide on first scroll
        window.addEventListener('scroll', () => {
            gsap.to(scrollHint, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
        }, { once: true });
    }

    // Works Horizontal Hint Visibility
    const worksHint = document.querySelector('.scroll-hint-horizontal');
    const worksScroll = document.querySelector('.projects-scroll');
    if (worksHint && worksScroll) {
        ScrollTrigger.create({
            trigger: worksScroll,
            start: 'top 20%',
            onUpdate: (self) => {
                if (self.progress > 0.02) {
                    gsap.to(worksHint, { opacity: 0, y: 10, duration: 0.4, pointerEvents: 'none' });
                } else {
                    gsap.to(worksHint, { opacity: 1, y: 0, duration: 0.4, pointerEvents: 'all' });
                }
            }
        });
    }
}

/**
 * 16. About Mini Stats Animation
 */
function initAboutStats() {
    const statsSection = document.querySelector('.about-mini__stats, .numbers-section');
    if (!statsSection) return;

    ScrollTrigger.create({
        trigger: statsSection,
        start: 'top 85%',
        onEnter: () => {
            document.querySelectorAll('.stat__number, .number-value, .number-parallax-value').forEach(el => {
                const targetValue = parseInt(el.dataset.target);
                if (isNaN(targetValue)) return;

                gsap.to({ val: 0 }, {
                    val: targetValue,
                    duration: 2.5,
                    ease: 'power3.out',
                    onUpdate: function () {
                        const current = Math.round(this.targets()[0].val);
                        const prefix = el.dataset.prefix || '';
                        const suffix = (el.dataset.suffix !== undefined) ? el.dataset.suffix : (targetValue === 100 ? '%' : (targetValue === 8 ? '' : '+'));

                        el.textContent = prefix + current + suffix;
                    }
                });
            });
        }
    });
}

/**
 * 17. Services Interactive Accordion
 */
function initServicesAccordion() {
    const items = document.querySelectorAll('.service-item');
    const bgNum = document.querySelector('.services-bg-num');

    if (!items.length) return;

    items.forEach(item => {
        item.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');

            // Reset all
            items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.service-item__toggle').textContent = '+';
            });

            if (!wasActive) {
                item.classList.add('active');
                item.querySelector('.service-item__toggle').textContent = '/';

                // Update Bg Num
                const num = item.dataset.index;
                if (bgNum) {
                    gsap.to(bgNum, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        onComplete: () => {
                            bgNum.textContent = num;
                            gsap.to(bgNum, { opacity: 1, y: 0, duration: 0.4 });
                        }
                    });
                }
            }
        });
    });
}

/**
 * 18. Parallax Numbers Logic
 */
function initNumbersParallax() {
    const items = document.querySelectorAll('.number-parallax-item');
    const bgShapes = document.querySelectorAll('.parallax-bg-shape');

    items.forEach(item => {
        const speed = parseFloat(item.dataset.speed) || 0.1;
        gsap.to(item, {
            y: () => -window.innerHeight * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    bgShapes.forEach(shape => {
        gsap.to(shape, {
            y: -150,
            rotation: 10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.numbers-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

/**
 * 19. Interactive CV 3D Tilt
 */
function initCVInteraction() {
    const card = document.getElementById('cv-card');
    if (!card) return;

    const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            skewX: rotateY / 2,
            duration: 0.8,
            ease: 'power3.out'
        });
    };

    const handleLeave = () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            skewX: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
        });
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
}

/**
 * 20. Bouncing Dot Hero Animation
 */
function initHeroBouncingDot() {
    const canvas = document.getElementById('dot-canvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Retourne le centre pixel d'un caractère dans un élément */
    function getCharCenter(el, charIndex) {
        const range = document.createRange();
        const textNode = el.firstChild;
        if (!textNode) return { x: 0, y: 0 };
        range.setStart(textNode, charIndex);
        range.setEnd(textNode, charIndex + 1);
        const rect = range.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        return {
            x: rect.left - heroRect.left + rect.width / 2,
            y: rect.top - heroRect.top + rect.height / 2
        };
    }

    function getFontSize() {
        const el = document.getElementById('hero-title');
        return el ? parseFloat(window.getComputedStyle(el).fontSize) : 80;
    }

    /* Position de départ : le point du "i" de Creative */
    function getIPos() {
        const el = document.getElementById('word-creative');
        if (!el) return { x: 0, y: 0 };
        const i = el.textContent.indexOf('i');
        if (i === -1) return { x: 0, y: 0 };
        const c = getCharCenter(el, i);
        return { x: c.x, y: c.y - getFontSize() * 0.42 };
    }

    /* Position d'arrivée : le point final "." */
    function getDotPos() {
        const el = document.getElementById('word-dot');
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        return {
            x: rect.left - heroRect.left + rect.width * 0.5,
            y: rect.top - heroRect.top + rect.height * 0.18
        };
    }

    /* Construit la liste de toutes les étapes du parcours */
    function buildWaypoints() {
        const fs = getFontSize();
        const topOffset = fs * 0.42; /* hauteur du point au-dessus de la ligne de base */

        const waypoints = [];

        const creativeEl = document.getElementById('word-creative');
        const desIgnEl = document.getElementById('word-desIgn');
        if (!creativeEl || !desIgnEl) return [];
        const creativeText = creativeEl.textContent;
        const desIgnText = desIgnEl.textContent;

        /* Toutes les lettres de "Creative" sauf le "i" lui-même */
        for (let i = 0; i < creativeText.length; i++) {
            if (i === creativeText.indexOf('i')) continue;
            const c = getCharCenter(creativeEl, i);
            waypoints.push({ x: c.x, y: c.y - topOffset });
        }

        /* Toutes les lettres de "DesIgn" */
        for (let i = 0; i < desIgnText.length; i++) {
            const c = getCharCenter(desIgnEl, i);
            waypoints.push({ x: c.x, y: c.y - topOffset });
        }

        /* Destination finale : le point du "." */
        waypoints.push({ ...getDotPos(), final: true });

        return waypoints;
    }

    /* Helpers */
    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
    function lerp(a, b, t) { return a + (b - a) * t; }

    const trail = [];
    const dot = { x: 0, y: 0, r: 0, opacity: 1 };
    let animating = false;

    function drawDot(x, y, r, opacity, squishX, squishY) {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Traînée */
        trail.forEach((t, i) => {
            ctx.save();
            ctx.globalAlpha = (i / trail.length) * 0.18 * opacity;
            ctx.beginPath();
            ctx.arc(t.x, t.y, r * 0.65, 0, Math.PI * 2);
            ctx.fillStyle = '#1a1a1a';
            ctx.fill();
            ctx.restore();
        });

        /* Point principal avec squish */
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(x, y);
        ctx.scale(squishX, squishY);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#0D0D0D';
        ctx.fill();
        ctx.restore();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            trail.length = 0;
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 200);
    });

    function animate() {
        const isMobile = window.matchMedia('(max-width: 480px)');
        if (isMobile.matches) return;
        if (animating) return;
        animating = true;

        const waypoints = buildWaypoints();
        const fs = getFontSize();
        const iPos = getIPos();

        dot.x = iPos.x;
        dot.y = iPos.y;
        dot.r = fs * 0.07;
        dot.opacity = 1;
        trail.length = 0;

        const tl = gsap.timeline({
            onComplete: () => {
                animating = false;
                setTimeout(animate, 1400); /* pause entre chaque boucle */
            }
        });

        let delay = 0.6; /* pause initiale avant le premier saut */

        let curX = dot.x, curY = dot.y;

        waypoints.forEach((wp) => {
            const isLast = !!wp.final;
            const dist = Math.hypot(wp.x - curX, wp.y - curY);
            const dur = Math.max(0.13, Math.min(0.22, dist / (fs * 6)));
            const peak = fs * (isLast ? 1.2 : 0.55);

            const fromX = curX, fromY = curY;
            const toX = wp.x, toY = wp.y;

            tl.to(dot, {
                duration: dur,
                ease: 'none',
                onUpdate: function () {
                    const p = this.progress();
                    const t = easeInOutQuart(p);

                    dot.x = lerp(fromX, toX, t);
                    dot.y = lerp(fromY, toY, t) - (-4 * peak * p * (p - 1));

                    /* Squish dynamique selon la vitesse verticale */
                    const velY = Math.abs((toY - fromY) - peak * (-8 * p + 4));
                    const speed = velY / (fs * 8);
                    const squishY = isLast && p > 0.85
                        ? lerp(1, 0.55, (p - 0.85) / 0.15)
                        : lerp(1, 1 - Math.min(speed, 1) * 0.25, Math.min(speed, 1));
                    const squishX = 1 / squishY;

                    trail.unshift({ x: dot.x, y: dot.y });
                    if (trail.length > 10) trail.pop();

                    drawDot(dot.x, dot.y, dot.r, 1, squishX, squishY);
                }
            }, delay);

            delay += dur;

            if (isLast) {
                /* Rebond élastique à l'atterrissage */
                tl.to({}, {
                    duration: 0.3,
                    ease: 'elastic.out(1, 0.4)',
                    onUpdate: function () {
                        const p = this.progress();
                        const scale = 1 + Math.sin(p * Math.PI) * 0.3;
                        trail.length = 0;
                        drawDot(dot.x, dot.y, dot.r * scale, 1, 1 / scale, scale * 0.7);
                    }
                }, delay);

                /* Pulse de repos */
                tl.to({}, {
                    duration: 0.5,
                    onUpdate: function () {
                        const pulse = 1 + Math.sin(this.progress() * Math.PI * 2) * 0.05;
                        drawDot(dot.x, dot.y, dot.r, 1, pulse, pulse);
                    }
                }, delay + 0.3);

                /* Disparition en fondu */
                tl.to(dot, {
                    duration: 0.35,
                    ease: 'power3.in',
                    onUpdate: function () {
                        dot.opacity = 1 - this.progress();
                        drawDot(dot.x, dot.y, dot.r * (1 + this.progress() * 0.4), dot.opacity, 1, 1);
                    }
                }, delay + 0.8);
            }

            curX = wp.x; curY = wp.y;
        });
    }

    setTimeout(animate, 1200);
}
