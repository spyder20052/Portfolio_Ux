import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Loader = ({ onComplete }) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let startTime = performance.now();
        const duration = 1200; // 1.2 seconds for a snappier feel

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(Math.floor((elapsed / duration) * 100), 100);

            setCounter(progress);

            if (progress < 100) {
                requestAnimationFrame(update);
            } else {
                setTimeout(onComplete, 500);
            }
        };

        requestAnimationFrame(update);
    }, [onComplete]);

    const containerVariants = {
        exit: {
            y: "-100%",
            transition: {
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
            }
        }
    };

    const textVariants = {
        initial: { y: 100, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        exit: {
            y: -100,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            exit="exit"
            className="fixed inset-0 z-[2000] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="relative">
                <div className="flex overflow-hidden">
                    {"SPYNEL".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            custom={index}
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

                {/* Minimalist Progress Indicator */}
                <div className="absolute -bottom-8 left-0 w-full flex flex-col items-center gap-4">
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${counter}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase italic">
                        Loading {counter}%
                    </span>
                </div>
            </div>

            {/* Split Screen Decorative Elements on exit */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-[#0C0C0C] z-[-1]"
                exit={{ y: "-100%" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-[#0C0C0C] z-[-1]"
                exit={{ y: "100%" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            />
        </motion.div>
    );
};
