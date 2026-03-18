import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { RevealText } from '../components/utils/TextAnimations';
import { BalanceGraphic } from '../components/visuals/Visuals';

export const IntroSection = React.forwardRef(({ mouseX, mouseY, isMobile }, ref) => {
    const localRef = useRef(null);
    const sectionInView = useInView(localRef, { once: true, margin: "-10%" });

    // Sync localRef with the forwarded ref
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === 'function') {
            ref(localRef.current);
        } else {
            ref.current = localRef.current;
        }
    }, [ref]);

    return (
        <div ref={localRef} className="w-full md:min-w-screen min-h-screen flex items-center justify-center px-6 md:px-20 shrink-0 relative bg-white md:bg-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-10 md:gap-32">
                <div className="relative z-10 order-2 md:order-1">
                    <RevealText active={sectionInView} delay={100}>
                        <span className="text-blue-500 font-bold tracking-widest text-xs md:text-sm uppercase mb-4 block">Philosophie</span>
                    </RevealText>
                    <h2 className="text-4xl md:text-7xl font-serif leading-tight mb-8">
                        <div className="block"><RevealText active={sectionInView} delay={300}>Créativité x</RevealText></div>
                        <div>
                            <RevealText active={sectionInView} delay={500}>
                                <span className="italic">Technologie</span>
                            </RevealText>
                        </div>
                    </h2>
                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md transition-colors"
                    >
                        Passionné par la technologie et le design, je combine créativité et expertise technique pour créer des expériences digitales exceptionnelles.
                    </motion.p>
                </div>
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full aspect-square order-1 md:order-2 flex items-center justify-center transition-transform"
                >
                    <BalanceGraphic mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
                </motion.div>
            </div>
        </div>
    );
});
IntroSection.displayName = 'IntroSection';
