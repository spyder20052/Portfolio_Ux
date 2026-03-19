import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Instagram, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';

// Data
import { PROJECTS } from './data/projects';

// Components
import { ParallaxBackground } from './components/visuals/Visuals';
import { ProjectDetail } from './components/portfolio/Portfolio';

// Sections
import { LandingSection } from './sections/LandingSection';
import { IntroSection } from './sections/IntroSection';
import { GallerySection } from './sections/GallerySection';
import { BioSection } from './sections/BioSection';
import { ExpertiseSection } from './sections/ExpertiseSection';
import { ContactSection } from './sections/ContactSection';

/**
 * MAIN APP
 */
export default function App() {
  const xMotionValue = useMotionValue(0);
  const xSpring = useSpring(xMotionValue, { stiffness: 120, damping: 30, mass: 1, restDelta: 0.1 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [totalWidth, setTotalWidth] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const scrollPosRef = useRef(0);
  const scrollingTimeoutRef = useRef(null);
  const scrollCooldownRef = useRef(false);
  const scrollDeltaRef = useRef(0);

  // Transform for progress - dynamic function to react to totalWidth changes
  const progressPercent = useTransform(xMotionValue, (val) => {
    return totalWidth > 0 ? (val / totalWidth) * 100 : 0;
  });

  const progressStyleWidth = useTransform(progressPercent, (v) => `${v}%`);
  const mainXTransform = useTransform(xSpring, (val) => -val);

  // Check mobile state
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Performance refs

  // Helper function for smooth scrolling to sections
  const scrollToSection = (index) => {
    if (index < 0 || index >= sectionRefs.current.length) return;

    const target = sectionRefs.current[index];
    if (!target) return;

    scrollCooldownRef.current = true;
    scrollDeltaRef.current = 0;

    let targetOffset = target.offsetLeft;
    if (index < currentActiveIndex && target.offsetWidth > window.innerWidth) {
      targetOffset = target.offsetLeft + target.offsetWidth - window.innerWidth;
    }

    setIsScrolling(true);
    setCurrentActiveIndex(index);

    // Use controlled animate instead of just spring for large programmatic jumps
    animate(xMotionValue, targetOffset, {
      duration: 1.2,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        scrollPosRef.current = targetOffset;
        scrollCooldownRef.current = false;
        setIsScrolling(false);
      }
    });

    if (scrollingTimeoutRef.current) clearTimeout(scrollingTimeoutRef.current);
  };

  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e) => {
      if (isMenuOpen || selectedProject || scrollCooldownRef.current) return;

      const delta = e.deltaY;
      const currentSection = sectionRefs.current[currentActiveIndex];
      const isLongSection = currentSection && currentSection.offsetWidth > window.innerWidth;

      if (isLongSection) {
        const sectionStart = currentSection.offsetLeft;
        const sectionEnd = sectionStart + currentSection.offsetWidth - window.innerWidth;

        // Internal scrolling for long sections
        const isNearStart = scrollPosRef.current <= sectionStart + 2;
        const isNearEnd = scrollPosRef.current >= sectionEnd - 2;

        if ((delta > 0 && !isNearEnd) || (delta < 0 && !isNearStart)) {
          e.preventDefault();
          scrollDeltaRef.current = 0;

          const newPos = Math.max(sectionStart, Math.min(scrollPosRef.current + delta * 1.8, sectionEnd));
          scrollPosRef.current = newPos;
          xMotionValue.set(newPos);
          return;
        }
      }

      // Snapping logic
      scrollDeltaRef.current += delta;

      if (Math.abs(scrollDeltaRef.current) > 100) {
        e.preventDefault();

        let nextIndex = currentActiveIndex;
        if (scrollDeltaRef.current > 0 && currentActiveIndex < sectionRefs.current.length - 1) {
          nextIndex++;
        } else if (scrollDeltaRef.current < 0 && currentActiveIndex > 0) {
          nextIndex--;
        }

        if (nextIndex !== currentActiveIndex) {
          scrollToSection(nextIndex);
        } else {
          scrollDeltaRef.current = 0;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isMenuOpen, isMobile, selectedProject, xMotionValue, currentActiveIndex, totalWidth]);

  // Intersection Observer removed - Sections handled internally via whileInView for better performance

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      if (isMobile) {
        setTotalWidth(document.documentElement.scrollHeight - window.innerHeight);
      } else {
        setTotalWidth(containerRef.current.scrollWidth - window.innerWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    // Also update after a long delay to catch image loads
    const t1 = setTimeout(updateWidth, 1000);
    const t2 = setTimeout(updateWidth, 3000);

    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        xMotionValue.set(scrollY);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile, xMotionValue]);


  const isDarkSection = [3, 5].includes(currentActiveIndex);
  const headerColorClass = isMenuOpen || (isMobile && isDarkSection) ? 'text-white' : (isMobile ? 'text-black' : 'mix-blend-difference text-white');
  const iconColor = isMenuOpen || (isMobile && isDarkSection) ? 'white' : (isMobile ? 'black' : 'white');

  return (
    <div className={`min-h-screen bg-[#FAFAFA] font-sans ${isMobile ? '' : 'fixed inset-0 overflow-hidden'}`}>

      {!isMobile && <ParallaxBackground xMotionValue={xMotionValue} mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />}


      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenProject={setSelectedProject}
          isMobile={isMobile}
        />
      )}

      {/* Header */}
      <div className={`fixed top-6 left-6 md:top-12 md:left-12 z-[100] ${headerColorClass}`}>
        <div className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase">Spynel K.</div>
      </div>

      <button
        className={`fixed top-4 right-4 md:top-10 md:right-10 z-[100] p-4 ${headerColorClass}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={30} color="white" /> : <Menu size={30} color={iconColor} />}
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] bg-[#0A0A0A] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Decorative Panel (Desktop) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-1/3 h-full bg-[#0F0F0F] border-r border-white/5 flex flex-col justify-between p-16"
              >
                <div className="text-white/20 text-xs font-bold tracking-[0.5em] uppercase">Spynel K. Portfolio</div>
                <div className="flex flex-col gap-8">
                  <div className="text-blue-500/40 text-8xl font-serif italic select-none leading-none">Explore.</div>
                  <p className="text-white/30 max-w-xs text-sm leading-relaxed font-light">
                    Chaque projet est une nouvelle aventure entre design minimaliste et performance technique.
                  </p>
                </div>
                <div className="flex gap-4">
                  {[
                    { icon: Mail, link: "mailto:kspynel@gmail.com" },
                    { icon: Github, link: "https://github.com/spynelkouton" },
                    { icon: Linkedin, link: "https://www.linkedin.com/in/spynel-kouton-756444273" },
                    { icon: Instagram, link: "https://instagram.com/spynelkouton" }
                  ].map((social, i) => (
                    <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-500 hover:border-blue-500 transition-all">
                      <social.icon size={16} />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main Navigation Panel */}
            <div className={`flex-1 flex flex-col justify-center relative ${isMobile ? 'px-8 py-20' : 'px-20'}`}>
              {!isMobile && (
                <div className="absolute top-16 right-16 text-white/10 text-9xl font-serif select-none pointer-events-none">MENU</div>
              )}

              <nav className="flex flex-col gap-4 md:gap-2">
                {['Accueil', 'Philosophie', 'Œuvres', 'Bio', 'Services', 'Contact'].map((item, i) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (isMobile) {
                        const target = sectionRefs.current[i];
                        if (target) {
                          const offsetTop = target.offsetTop;
                          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        }
                      } else {
                        scrollToSection(i);
                      }
                    }}
                    className="group flex items-baseline gap-4 text-5xl md:text-[6.5rem] font-serif text-white/30 hover:text-white transition-all duration-500 text-left w-fit"
                  >
                    <span className="text-blue-500 text-xs md:text-sm font-bold font-sans tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                    <span className="transition-transform duration-500 group-hover:italic group-hover:translate-x-4 uppercase md:lowercase tracking-tighter">{item}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Mobile Footer (Socials) */}
              {isMobile && (
                <div className="mt-auto flex flex-col gap-6 ">
                  <div className="h-[1px] w-12 bg-blue-500"></div>
                  <div className="flex gap-6">
                    {[
                      { icon: Mail, link: "mailto:kspynel@gmail.com" },
                      { icon: Github, link: "https://github.com/spynelkouton" },
                      { icon: Linkedin, link: "https://www.linkedin.com/in/spynel-kouton-756444273" },
                      { icon: Instagram, link: "https://instagram.com/spynelkouton" }
                    ].map((social, i) => (
                      <a key={i} href={social.link} target="_blank" rel="noopener noreferrer">
                        <social.icon size={20} className="text-white/40" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110] pointer-events-none opacity-30">
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: progressStyleWidth }}
        ></motion.div>
      </div>

      {/* Main Canvas */}
      <motion.div
        ref={containerRef}
        className={`flex ${isMobile ? 'flex-col w-full h-auto' : 'h-screen will-change-transform'}`}
        style={!isMobile ? {
          x: mainXTransform,
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d'
        } : {}}
      >
        <LandingSection ref={el => sectionRefs.current[0] = el} />
        <IntroSection ref={el => sectionRefs.current[1] = el} mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
        <GallerySection ref={el => sectionRefs.current[2] = el} onOpenProject={setSelectedProject} isScrolling={isScrolling} />
        <BioSection ref={el => sectionRefs.current[3] = el} />
        <ExpertiseSection ref={el => sectionRefs.current[4] = el} />
        <ContactSection ref={el => sectionRefs.current[5] = el} />
      </motion.div>


      {/* Section Indicator */}
      <div className="fixed left-12 bottom-12 z-10 pointer-events-none overflow-hidden h-20 w-40 hidden md:block">
        <div
          className="text-8xl font-serif opacity-[0.05] italic transition-transform duration-700"
          style={{ transform: `translateY(-${currentActiveIndex * 100}%)` }}
        >
          {['01', '02', '03', '04', '05', '06'].map(n => <div key={n} className="h-20">{n}</div>)}
        </div>
      </div>
    </div>
  );
}
