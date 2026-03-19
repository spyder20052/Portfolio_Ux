import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { motion, useInView } from 'framer-motion';
import { RevealText, ScrambleText } from '../components/utils/TextAnimations';
import { ProjectCard } from '../components/portfolio/Portfolio';
import { PROJECTS } from '../data/projects';

const GallerySection = React.forwardRef(({ onOpenProject, isScrolling, isMobile }, ref) => {
    const localRef = useRef(null);
    const sectionInView = useInView(localRef, { once: true, margin: "-10%" });

    // Sync localRef with the forwarded ref
    useImperativeHandle(ref, () => localRef.current);

    return (
        <div
            ref={localRef}
            className={`w-full shrink-0 z-10 relative bg-[#FAFAFA] ${isMobile ? 'py-20 flex flex-col' : 'md:w-auto min-h-screen flex flex-row items-center px-6 md:px-40 py-12 md:py-0'}`}
            style={{ contentVisibility: 'auto' }}
        >
            <div className={`shrink-0 text-center md:text-left ${isMobile ? 'mb-12 px-6' : 'md:w-auto md:mr-60 mb-16 md:mb-0'}`}>
                <h2 className="text-5xl sm:text-6xl md:text-[10rem] font-serif leading-[0.85] relative inline-block">
                    <ScrambleText active={sectionInView} delay={0}>Œuvres</ScrambleText>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={sectionInView ? { width: '50%' } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="absolute -bottom-4 left-0 h-1 md:h-2 bg-blue-500"
                    ></motion.div>
                </h2>
                <div className="mt-8 md:mt-12 text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs">
                    <ScrambleText active={sectionInView} delay={400}>
                        {isMobile ? "Glissez horizontalement pour explorer" : "Défilez pour explorer la galerie"}
                    </ScrambleText>
                </div>

                {isMobile && (
                    <motion.div
                        animate={{ x: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="mt-6 flex justify-center gap-2 text-blue-500 opacity-60"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Swipe →</span>
                    </motion.div>
                )}
            </div>

            <div className={`
                flex flex-row items-center gap-4 md:gap-0
                ${isMobile ? 'overflow-x-auto w-full px-6 snap-x snap-mandatory no-scrollbar' : 'w-auto'}
            `}>
                {PROJECTS.map((p, i) => (
                    <div key={p.id} className={isMobile ? 'snap-center shrink-0 w-[85vw]' : ''}>
                        <ProjectCard
                            project={p}
                            onOpen={onOpenProject}
                            index={i}
                            isScrolling={isScrolling}
                            isMobile={isMobile}
                        />
                    </div>
                ))}
            </div>
            {!isMobile && <div className="w-8 md:w-80 shrink-0 h-1 hidden md:block"></div>}
        </div>
    );
});
GallerySection.displayName = 'GallerySection';
export default GallerySection;
