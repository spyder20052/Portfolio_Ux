import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

// Data
import { PROJECTS } from './data/projects';

// Components
import { ParallaxBackground } from './components/visuals/Visuals';
import { CustomCursor } from './components/visuals/CustomCursor';
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
  const xSpring = useSpring(xMotionValue, { stiffness: 40, damping: 20, mass: 1 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [totalWidth, setTotalWidth] = useState(0);
  const [cursorType, setCursorType] = useState('default');
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

  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e) => {
      if (isMenuOpen || selectedProject || scrollCooldownRef.current) return;

      const delta = e.deltaY;

      // Determine if we are in a "long" section that needs internal scrolling
      const currentSection = sectionRefs.current[currentActiveIndex];
      const isLongSection = currentSection && currentSection.offsetWidth > window.innerWidth;

      if (isLongSection) {
        // Internal scrolling for long sections (like Gallery)
        const sectionStart = currentSection.offsetLeft;
        const sectionEnd = sectionStart + currentSection.offsetWidth - window.innerWidth;

        // If we are scrolling forward and haven't reached the end of the section
        if (delta > 0 && scrollPosRef.current < sectionEnd - 10) {
          e.preventDefault();
          scrollDeltaRef.current = 0;
          const newPos = Math.min(scrollPosRef.current + delta, sectionEnd);
          scrollPosRef.current = newPos;
          xMotionValue.set(newPos);
          return;
        }

        // If we are scrolling backward and haven't reached the start of the section
        if (delta < 0 && scrollPosRef.current > sectionStart + 10) {
          e.preventDefault();
          scrollDeltaRef.current = 0;
          const newPos = Math.max(scrollPosRef.current + delta, sectionStart);
          scrollPosRef.current = newPos;
          xMotionValue.set(newPos);
          return;
        }
      }

      // Snapping logic for normal sections or when at boundaries of long sections
      scrollDeltaRef.current += delta;

      if (Math.abs(scrollDeltaRef.current) > 50) {
        e.preventDefault();

        let nextIndex = currentActiveIndex;
        if (scrollDeltaRef.current > 0 && currentActiveIndex < sectionRefs.current.length - 1) {
          nextIndex++;
        } else if (scrollDeltaRef.current < 0 && currentActiveIndex > 0) {
          nextIndex--;
        }

        if (nextIndex !== currentActiveIndex) {
          const target = sectionRefs.current[nextIndex];
          if (target) {
            scrollCooldownRef.current = true;
            scrollDeltaRef.current = 0;

            // SPECIAL CASE: When moving BACKWARD into a LONG section
            // We should land at the END of that section
            let targetOffset = target.offsetLeft;
            if (nextIndex < currentActiveIndex && target.offsetWidth > window.innerWidth) {
              targetOffset = target.offsetLeft + target.offsetWidth - window.innerWidth;
            }

            scrollPosRef.current = targetOffset;
            xMotionValue.set(targetOffset);
            setCurrentActiveIndex(nextIndex);

            setTimeout(() => {
              scrollCooldownRef.current = false;
            }, 600);
          }
        } else {
          scrollDeltaRef.current = 0;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isMenuOpen, isMobile, selectedProject, xMotionValue, currentActiveIndex]);

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
    if (containerRef.current) {
      if (isMobile) {
        setTotalWidth(document.documentElement.scrollHeight - window.innerHeight);
      } else {
        setTotalWidth(containerRef.current.scrollWidth - window.innerWidth);
      }
    }
  }, [isMobile, currentActiveIndex]);

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


  return (
    <div className={`min-h-screen bg-[#FAFAFA] font-sans ${isMobile ? '' : 'fixed inset-0 overflow-hidden'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=Inter:wght@100;300;400;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        @media (min-width: 768px) {
          * { cursor: none !important; }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% -200%; }
        }
        .animate-shimmer {
          background: linear-gradient(to bottom, #1A1A1A 0%, #3B82F6 50%, #1A1A1A 100%);
          background-size: 100% 200%;
          animation: shimmer 2s linear infinite;
        }
      `}</style>

      {!isMobile && <ParallaxBackground xMotionValue={xMotionValue} mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />}

      {!isMobile && <CustomCursor mouseX={mouseX} mouseY={mouseY} cursorType={cursorType} />}

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
      <div className="fixed top-6 left-6 md:top-12 md:left-12 z-[100] mix-blend-difference text-white">
        <div className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase">Spynel K.</div>
      </div>

      <button
        className="fixed top-4 right-4 md:top-10 md:right-10 z-[100] p-4 text-black mix-blend-difference"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={30} color="white" /> : <Menu size={30} color="white" />}
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 95% 5%)' }}
            animate={{ clipPath: 'circle(150% at 95% 5%)' }}
            exit={{ clipPath: 'circle(0% at 95% 5%)' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[90] bg-[#0A0A0A] text-white flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6 md:gap-10">
              {['Accueil', 'Philosophie', 'Œuvres', 'Bio', 'Services', 'Contact'].map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    const target = sectionRefs.current[i];
                    if (!target) return;

                    if (isMobile) {
                      const offsetTop = target.offsetTop;
                      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    } else {
                      const offsetLeft = target.offsetLeft;
                      scrollPosRef.current = offsetLeft;
                      xMotionValue.set(offsetLeft);
                    }
                  }}
                  className="text-4xl md:text-7xl font-serif hover:text-blue-500 transition-colors hover:italic"
                >
                  {item}
                </motion.button>
              ))}
            </nav>
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
        <GallerySection ref={el => sectionRefs.current[2] = el} setCursorType={setCursorType} onOpenProject={setSelectedProject} isScrolling={isScrolling} />
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
