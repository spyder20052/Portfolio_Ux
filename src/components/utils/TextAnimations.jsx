import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ScrambleText = ({ children, delay = 0 }) => {
    const [display, setDisplay] = useState(children);
    const [isComplete, setIsComplete] = useState(false);
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    const startScramble = () => {
        if (isComplete) return;

        let interval;
        let iteration = 0;

        interval = setInterval(() => {
            setDisplay(
                children
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return children[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= children.length) {
                clearInterval(interval);
                setIsComplete(true);
            }

            iteration += 1;
        }, 30);

        return () => clearInterval(interval);
    };

    return (
        <motion.span
            onViewportEnter={startScramble}
            viewport={{ once: true, margin: "-5%" }}
        >
            {display}
        </motion.span>
    );
};

export const RevealText = ({ children, delay = 0 }) => {
    return (
        <div className="relative overflow-hidden inline-block align-bottom">
            <motion.div
                initial={{ y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{
                    duration: 0.6,
                    delay: delay / 1000,
                    ease: [0.25, 1, 0.5, 1]
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};
