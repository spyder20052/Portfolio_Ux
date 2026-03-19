import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Menu, X, Instagram, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';

// Data
import { PROJECTS } from './data/projects';

// Components
import { ParallaxBackground } from './components/visuals/Visuals';
import { ProjectDetail } from './components/portfolio/Portfolio';
import { Loader } from './components/utils/Loader';

// Sections (Direct Import for immediate visible sections)
import LandingSection from './sections/LandingSection';
import { IntroSection } from './sections/IntroSection';

// Lazy Loaded Sections (Heavy sections)
const GallerySection = lazy(() => import('./sections/GallerySection'));
const BioSection = lazy(() => import('./sections/BioSection'));
const ExpertiseSection = lazy(() => import('./sections/ExpertiseSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalWidth, setTotalWidth] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const totalWidthRef = useRef(0);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const scrollPosRef = useRef(0);
  const scrollDeltaRef = useRef(0);
  const scrollCooldownRef = useRef(false);
  const currentIndexRef = useRef(0);
  const rafRef = useRef(null);
  const isScrollingTimeoutRef = useRef(null);

  // ---------- Motion Values ----------
  const xMotionValue = useMotionValue(0);
  const xSpring = useSpring(xMotionValue, {
    stiffness: 240,
    damping: 38,
    mass: 0.7,
    restDelta: 0.1
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Synchronize index ref
  useEffect(() => {
    currentIndexRef.current = currentActiveIndex;
  }, [currentActiveIndex]);

  // ---------- Animation Hooks ----------
  const progressPercent = useTransform(xMotionValue, (val) => {
    const width = totalWidthRef.current;
    return width > 0 ? (val / width) * 100 : 0;
  });

  const progressStyleWidth = useTransform(progressPercent, (v) => `${v}%`);
  const mainXTransform = useTransform(xSpring, (val) => -val);

  // Helper: Mark scrolling state
  const markScrolling = useCallback(() => {
    setIsScrolling(true);
    if (isScrollingTimeoutRef.current) clearTimeout(isScrollingTimeoutRef.current);
    isScrollingTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
  }, []);

  // Helper: Smooth scroll to specific index
  const scrollToSection = useCallback((index) => {
    const section = sectionRefs.current[index];
    if (!section) return;

    scrollCooldownRef.current = true;
    scrollDeltaRef.current = 0;

    let targetOffset = section.offsetLeft;
    if (index < currentIndexRef.current && section.offsetWidth > window.innerWidth) {
      targetOffset = section.offsetLeft + section.offsetWidth - window.innerWidth;
    }

    setCurrentActiveIndex(index);
    markScrolling();

    animate(xMotionValue, targetOffset, {
      duration: 1.2,
      ease: [0.76, 0, 0.24, 1],
      onUpdate: (latest) => {
        scrollPosRef.current = latest;
      },
      onComplete: () => {
        scrollPosRef.current = targetOffset;
        xMotionValue.set(targetOffset);
        setTimeout(() => {
          scrollCooldownRef.current = false;
          setIsScrolling(false);
          scrollDeltaRef.current = 0;
        }, 100);
      }
    });
  }, [xMotionValue, markScrolling]);

  // Main interaction effect: Wheel handling (Desktop)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (isMenuOpen || selectedProject || scrollCooldownRef.current) return;
      e.preventDefault();

      const idx = currentIndexRef.current;
      const delta = (e.deltaY !== 0 ? e.deltaY : e.deltaX);
      const currentSection = sectionRefs.current[idx];
      if (!currentSection) return;

      const isLongSection = currentSection.offsetWidth > window.innerWidth;
      if (isLongSection) {
        const sectionStart = currentSection.offsetLeft;
        const sectionEnd = sectionStart + currentSection.offsetWidth - window.innerWidth;
        const isNearStart = scrollPosRef.current <= sectionStart + 5;
        const isNearEnd = scrollPosRef.current >= sectionEnd - 5;
        const forward = delta > 0;

        if ((forward && !isNearEnd) || (!forward && !isNearStart)) {
          scrollDeltaRef.current = 0;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const speed = 1.4;
            const newPos = Math.max(sectionStart, Math.min(scrollPosRef.current + delta * speed, sectionEnd));
            scrollPosRef.current = newPos;
            xMotionValue.set(newPos);
            markScrolling();
          });
          return;
        }
      }

      scrollDeltaRef.current += delta;
      if (Math.abs(scrollDeltaRef.current) > 130) {
        let nextIndex = idx;
        if (delta > 0 && idx < sectionRefs.current.length - 1) nextIndex++;
        else if (delta < 0 && idx > 0) nextIndex--;

        if (nextIndex !== idx) {
          scrollDeltaRef.current = 0;
          scrollToSection(nextIndex);
        } else {
          scrollDeltaRef.current = 0;
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMenuOpen, isMobile, selectedProject, xMotionValue, scrollToSection, markScrolling]);

  // Ambient mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Responsive: Check mobile state
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive: Update container width for scroll logic
  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      let newWidth = isMobile ? document.documentElement.scrollHeight - window.innerHeight : containerRef.current.scrollWidth - window.innerWidth;
      setTotalWidth(newWidth);
      totalWidthRef.current = newWidth;
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    const t = setTimeout(updateWidth, 1000);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(t);
    };
  }, [isMobile]);

  // Sync scroll for mobile (vertical to horizontal mapping)
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => xMotionValue.set(window.scrollY);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile, xMotionValue]);

  // Visual state helpers
  const isDarkSection = [3, 5].includes(currentActiveIndex);
  const headerColorClass = isMenuOpen || (isMobile && isDarkSection) ? 'text-white' : (isMobile ? 'text-black' : 'mix-blend-difference text-white');
  const iconColor = isMenuOpen || (isMobile && isDarkSection) ? 'white' : (isMobile ? 'black' : 'white');

  return (
    <div ref={containerRef} className={`${isMobile ? 'w-full' : 'h-screen w-screen overflow-hidden'} bg-[#0A0A0A] font-sans relative`}>
      {!isMobile && !isLoading && <ParallaxBackground xMotionValue={xMotionValue} mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />}
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex ${isMobile ? 'flex-col w-full h-auto' : 'h-screen will-change-transform'} bg-[#FAFAFA]`}
          style={!isMobile ? { x: mainXTransform } : {}}
        >
          <LandingSection ref={el => sectionRefs.current[0] = el} isMobile={isMobile} />
          <IntroSection ref={el => sectionRefs.current[1] = el} mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />

          <Suspense fallback={null}>
            <GallerySection ref={el => sectionRefs.current[2] = el} onOpenProject={setSelectedProject} isScrolling={isScrolling} isMobile={isMobile} />
            <BioSection ref={el => sectionRefs.current[3] = el} isScrolling={isScrolling} />
            <ExpertiseSection ref={el => sectionRefs.current[4] = el} />
            <ContactSection ref={el => sectionRefs.current[5] = el} />
          </Suspense>
        </motion.div>
      )}

      {/* Global Foreground Elements - Only active once loaded */}
      {!isLoading && (
        <>

          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onOpenProject={setSelectedProject}
              isMobile={isMobile}
            />
          )}

          {/* Brand Header */}
          <div className={`fixed top-6 left-6 md:top-12 md:left-12 z-[100] ${headerColorClass}`}>
            <div className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase">Spynel K.</div>
          </div>

          {/* Menu Toggle */}
          <button
            className={`fixed top-4 right-4 md:top-10 md:right-10 z-[100] p-4 ${headerColorClass}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={30} color="white" /> : <Menu size={30} color={iconColor} />}
          </button>

          {/* Fullscreen Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-0 z-[90] bg-[#0A0A0A] flex flex-col md:flex-row overflow-hidden"
              >
                {!isMobile && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-1/3 h-full bg-[#0F0F0F] border-r border-white/5 flex flex-col justify-between p-16"
                  >
                    <div className="text-white/20 text-xs font-bold tracking-[0.5em] uppercase">Portfolio © 2026</div>
                    <div className="flex flex-col gap-8">
                      <div className="text-blue-500/40 text-8xl font-serif italic select-none leading-none">Explore.</div>
                      <p className="text-white/30 max-w-xs text-sm leading-relaxed font-light">
                        Transformons vos idées en expériences digitales mémorables.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {[
                        { icon: Mail, link: "mailto:kspynel@gmail.com" },
                        { icon: Github, link: "https://github.com/spynelkouton" },
                        { icon: Linkedin, link: "https://www.linkedin.com/in/pynel-kouton-756444273" }
                      ].map((social, i) => (
                        <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-500 hover:border-blue-500 transition-all">
                          <social.icon size={16} />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className={`flex-1 flex flex-col justify-center relative ${isMobile ? 'px-8 py-20' : 'px-20'}`}>
                  <nav className="flex flex-col gap-4 md:gap-2">
                    {['Accueil', 'Philosophie', 'Œuvres', 'Bio', 'Services', 'Contact'].map((item, i) => (
                      <motion.button
                        key={item}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (isMobile) {
                            const target = sectionRefs.current[i];
                            if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                          } else scrollToSection(i);
                        }}
                        className="group flex items-baseline gap-4 text-5xl md:text-[6.5rem] font-serif text-white/30 hover:text-white transition-all text-left w-fit"
                      >
                        <span className="text-blue-500 text-xs md:text-sm font-bold font-sans opacity-0 group-hover:opacity-100 uppercase">0{i + 1}</span>
                        <span className="group-hover:translate-x-4 uppercase md:lowercase tracking-tighter">{item}</span>
                      </motion.button>
                    ))}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1 z-[110] pointer-events-none opacity-30">
            <motion.div className="h-full bg-blue-500" style={{ width: progressStyleWidth }} />
          </div>

          {/* Sidebar Section Counter (Desktop) */}
          <div className="fixed left-12 bottom-12 z-10 pointer-events-none overflow-hidden h-20 w-40 hidden md:block">
            <div
              className={`text-8xl font-serif opacity-[0.05] italic transition-transform duration-700`}
              style={{ transform: `translateY(-${currentActiveIndex * 100}%)` }}
            >
              {['01', '02', '03', '04', '05', '06'].map(n => <div key={n} className="h-20">{n}</div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
