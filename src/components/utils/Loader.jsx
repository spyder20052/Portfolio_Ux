import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Images critiques à précharger pendant le Loader
const CRITICAL_IMAGES = [
    '/Ma_photo.webp',
    '/Projets/Arbitra/Accueil.webp',
    '/Projets/Crispy/crispy.webp'
];

function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // On ne bloque pas si une image échoue
        img.src = src;
    });
}

export const Loader = ({ onComplete }) => {
    const [counter, setCounter] = useState(0);
    const [assetsReady, setAssetsReady] = useState(false);
    const counterRef = useRef(0);
    const completedRef = useRef(false);

    // FIX: Retrait du splash screen HTML dès que React est monté
    useEffect(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('hide');
            // On le retire physiquement du DOM après la transition CSS (0.5s)
            const t = setTimeout(() => splash.remove(), 600);
            return () => clearTimeout(t);
        }
    }, []);

    // Préchargement réel des assets
    useEffect(() => {
        let cancelled = false;

        const loadAssets = async () => {
            try {
                await Promise.all(CRITICAL_IMAGES.map(preloadImage));
                if (document.fonts && document.fonts.ready) {
                    await document.fonts.ready;
                }
            } catch (e) {
                console.warn("Asset preloading failed, continuing...", e);
            } finally {
                if (!cancelled) setAssetsReady(true);
            }
        };

        loadAssets();
        return () => { cancelled = true; };
    }, []);

    // Animation du compteur synchronisée
    useEffect(() => {
        const startTime = performance.now();
        const MAX_DURATION = 4000; // Sécurité : on finit après 4s quoi qu'il arrive
        let rafId;

        const update = (now) => {
            if (completedRef.current) return;
            const elapsed = now - startTime;
            let newValue;

            if (assetsReady) {
                // Accélérer vers 100 une fois les assets prêts
                const remaining = 100 - counterRef.current;
                newValue = Math.min(counterRef.current + Math.max(remaining * 0.12, 1), 100);
            } else if (elapsed < MAX_DURATION) {
                // Avancer progressivement jusqu'à 85% en attendant les assets
                newValue = Math.min(Math.floor((elapsed / MAX_DURATION) * 85), 85);
            } else {
                // Timeout atteint
                newValue = 100;
            }

            counterRef.current = newValue;
            setCounter(Math.floor(newValue));

            if (newValue >= 100 && !completedRef.current) {
                completedRef.current = true;
                setTimeout(onComplete, 500);
                return;
            }

            rafId = requestAnimationFrame(update);
        };

        rafId = requestAnimationFrame(update);
        return () => { if (rafId) cancelAnimationFrame(rafId); };
    }, [assetsReady, onComplete]);

    const textVariants = {
        initial: { y: 100, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            y: -100,
            opacity: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.div
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[2000] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="relative">
                <div className="flex overflow-hidden">
                    {"SPYNEL".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.1 * index }}
                            className="text-4xl md:text-8xl font-serif text-white tracking-[0.2em] md:tracking-[0.5em]"
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>

                <div className="absolute -bottom-8 left-0 w-full flex flex-col items-center gap-4">
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-200 ease-out"
                            style={{ width: `${counter}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase italic">
                        {counter < 100 ? `Loading ${counter}%` : "Ready"}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
