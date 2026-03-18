import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ScrambleText = ({ children, active, delay = 0 }) => {
    const [display, setDisplay] = useState(children);
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    useEffect(() => {
        if (!active) return;

        let interval;
        let timeout;
        let iteration = 0;

        timeout = setTimeout(() => {
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
                }

                iteration += 1 / 2;
            }, 10);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [active, children, delay]);

    return <span>{display}</span>;
};

export const RevealText = ({ children, delay = 0, active }) => {
    return (
        <div className="relative overflow-hidden inline-block align-bottom">
            <motion.div
                initial={{ y: "110%" }}
                animate={{ y: active ? 0 : "110%" }}
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
