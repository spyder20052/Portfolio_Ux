import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ScrambleText = ({ children, delay = 0, active }) => {
    const [display, setDisplay] = useState(children);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    const startScramble = () => {
        if (isComplete) return;

        let iteration = 0;
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
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
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsComplete(true);
                }

                iteration += 1;
            }, 30);
        }, delay);
    };

    useEffect(() => {
        if (active && !isComplete) {
            startScramble();
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [active, isComplete, children]);

    return (
        <motion.span>
            {display}
        </motion.span>
    );
};

export const RevealText = ({ children, delay = 0, active }) => {
    return (
        <div className="relative overflow-hidden inline-block align-bottom text-inherit">
            <motion.div
                initial={{ y: "110%" }}
                animate={active ? { y: 0 } : undefined}
                whileInView={!active ? { y: 0 } : undefined}
                viewport={{ once: true, amount: 0 }}
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
