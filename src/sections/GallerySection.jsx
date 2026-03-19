import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { motion, useInView } from 'framer-motion';
import { RevealText, ScrambleText } from '../components/utils/TextAnimations';
import { ProjectCard } from '../components/portfolio/Portfolio';
import { PROJECTS } from '../data/projects';

export const GallerySection = React.forwardRef(({ onOpenProject, isScrolling }, ref) => {
    const localRef = useRef(null);
    const sectionInView = useInView(localRef, { once: true, margin: "-10%" });

    // Sync localRef with the forwarded ref
    useImperativeHandle(ref, () => localRef.current);

    return (
        <div ref={localRef} className="w-full md:w-auto min-h-screen flex flex-col md:flex-row items-center px-6 md:px-40 shrink-0 z-10 relative py-12 md:py-0">
            <div className="w-full md:w-auto md:mr-60 shrink-0 mb-16 md:mb-0 text-center md:text-left">
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
                    <ScrambleText active={sectionInView} delay={400}>Défilez pour explorer la galerie</ScrambleText>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4 md:gap-0">
                {PROJECTS.map((p, i) => (
                    <ProjectCard
                        key={p.id}
                        project={p}
                        onOpen={onOpenProject}
                        index={i}
                        isScrolling={isScrolling}
                    />
                ))}
            </div>
            <div className="w-8 md:w-80 shrink-0 h-1 hidden md:block"></div>
        </div>
    );
});
GallerySection.displayName = 'GallerySection';
