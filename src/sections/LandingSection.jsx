import React from 'react';
import { motion } from 'framer-motion';
import { RevealText, ScrambleText } from '../components/utils/TextAnimations';

export const LandingSection = React.forwardRef(({ isActive }, ref) => (
    <div ref={ref} className="w-full md:min-w-screen h-screen flex flex-col items-center justify-center relative px-6 md:px-20 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-white">
        <div className="relative text-center md:text-left scale-[0.9] md:scale-100">
            <h1 className="text-[4rem] sm:text-[5rem] md:text-[10rem] lg:text-[12rem] font-serif tracking-tighter leading-none mb-0">
                <RevealText active={isActive} delay={200}>Spynel KOUTON</RevealText>
            </h1>
            <div className="relative md:absolute md:-right-20 md:top-0 text-blue-500 font-bold text-xl md:rotate-12 mt-4 md:mt-0">©26</div>
        </div>
        <div className="mt-8 md:mt-4 overflow-hidden text-center scale-[0.9] md:scale-100">
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xs sm:text-sm md:text-xl font-light tracking-[0.2em] md:tracking-[0.4em] opacity-60 uppercase mb-6"
            >
                <ScrambleText active={isActive} delay={600}>Développeur & Graphic Designer</ScrambleText>
            </motion.p>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="max-w-xl text-gray-400 text-[10px] sm:text-xs md:text-sm tracking-widest leading-relaxed"
            >
                J'aide les entreprises et créateurs à transformer leurs idées en expériences digitales modernes, élégantes et performantes.
            </motion.p>
        </div>
    </div>
));
LandingSection.displayName = 'LandingSection';
