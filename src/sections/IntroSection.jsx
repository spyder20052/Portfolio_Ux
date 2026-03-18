import React from 'react';
import { motion } from 'framer-motion';
import { RevealText } from '../components/utils/TextAnimations';
import { BalanceGraphic } from '../components/visuals/Visuals';

export const IntroSection = React.forwardRef(({ mouseX, mouseY, isActive, isMobile }, ref) => (
    <div ref={ref} className="w-full md:min-w-screen min-h-screen flex items-center justify-center px-6 md:px-20 shrink-0 relative bg-white md:bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-10 md:gap-32">
            <div className="relative z-10 order-2 md:order-1">
                <RevealText active={isActive} delay={100}>
                    <span className="text-blue-500 font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">Philosophie</span>
                </RevealText>
                <h2 className="text-4xl md:text-7xl font-serif leading-tight mb-8">
                    <div className="block"><RevealText active={isActive} delay={300}>Créativité x</RevealText></div>
                    <div>
                        <RevealText active={isActive} delay={500}>
                            <span className="italic">Technologie</span>
                        </RevealText>
                    </div>
                </h2>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -30 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md transition-colors"
                >
                    Passionné par la technologie et le design, je combine créativité et expertise technique pour créer des expériences digitales exceptionnelles.
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full aspect-square order-1 md:order-2 flex items-center justify-center transition-transform"
            >
                <BalanceGraphic mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
            </motion.div>
        </div>
    </div>
));
IntroSection.displayName = 'IntroSection';
