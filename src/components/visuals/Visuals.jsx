import { motion, useTransform } from 'framer-motion';
import { COLORS } from '../../constants';

export const ParallaxBackground = ({ xMotionValue, mouseX, mouseY, isMobile }) => {
    // Parallax factors
    const p1 = 0.05; // Deep layer
    const p2 = 0.15; // Mid layer
    const p3 = 0.02; // Mouse factor

    // Calculated mouse offsets using useTransform for zero-rerender reactivity
    // Protect against non-motion values or initial nulls
    const txMouse = useTransform([mouseX, mouseY], ([x, y]) => {
        try {
            const mx = (x - window.innerWidth / 2) * p3;
            const my = (y - window.innerHeight / 2) * p3;
            return `translate3d(${mx}px, ${my}px, 0)`;
        } catch (e) {
            return `translate3d(0, 0, 0)`;
        }
    });

    // Motion transforms for zero-rerender background shifts
    const tx1 = useTransform(xMotionValue, (val) => `translate3d(${-val * p1}px, 0, 0)`);
    const tx2 = useTransform(xMotionValue, (val) => `translate3d(${-val * p2}px, 0, 0)`);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* LAYER 1: Deep / Slow / Large Shapes (#F0F0F0) */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ transform: tx1 }}
            >
                <svg className="w-full h-full opacity-60" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                    <circle cx="200" cy="200" r="300" fill="#F0F0F0" />
                    <circle cx="1600" cy="800" r="400" fill="#F0F0F0" />
                    <circle cx="800" cy="-100" r="250" fill="#F0F0F0" />
                </svg>
            </motion.div>

            {/* LAYER 2: Mid / Medium / Flowing Lines (#EAEAEA) */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ transform: tx2 }}
            >
                <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                    <path
                        d="M0 300 Q 400 600 800 300 T 1600 300"
                        fill="none"
                        stroke="#EAEAEA"
                        strokeWidth="20"
                        className="opacity-50"
                    />
                    <path
                        d="M-200 800 Q 600 500 1200 900 T 2200 800"
                        fill="none"
                        stroke="#EAEAEA"
                        strokeWidth="30"
                        className="opacity-50"
                    />
                    <circle cx="1200" cy="200" r="50" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                    <circle cx="400" cy="900" r="30" fill="none" stroke="#EAEAEA" strokeWidth="2" />
                </svg>
            </motion.div>

            {/* LAYER 3: Interactive / Mouse Reactivity (Accent) */}
            {!isMobile && (
                <motion.div
                    className="absolute inset-0 will-change-transform"
                    style={{ transform: txMouse }}
                >
                    <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                        <circle cx="960" cy="540" r="200" fill={COLORS.accent} className="opacity-[0.03] blur-[20px]" />
                        <g className="opacity-10">
                            <circle cx="100" cy="100" r="4" fill={COLORS.accent} />
                            <circle cx="1800" cy="900" r="6" fill={COLORS.accent} />
                            <circle cx="500" cy="500" r="2" fill={COLORS.accent} />
                        </g>
                    </svg>
                </motion.div>
            )}
        </div>
    );
};

export const BalanceGraphic = ({ mouseX, mouseY, isMobile }) => {
    const factor = 0.015;
    const tx = useTransform(mouseX, (x) => (x - window.innerWidth / 2) * factor);
    const ty = useTransform(mouseY, (y) => (y - window.innerHeight / 2) * factor);
    const rotate = useTransform(mouseX, (x) => (x - window.innerWidth / 2) * 0.005);

    return (
        <motion.div
            className="relative w-full h-full flex items-center justify-center will-change-transform"
            style={{ x: tx, y: ty, rotate }}
        >
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-90">
                {/* Background Particles - The "Living" part - Disabled on mobile for stability */}
                {!isMobile && [...Array(6)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={100 + Math.random() * 200}
                        cy={100 + Math.random() * 200}
                        r={Math.random() * 3 + 1}
                        fill={i % 2 === 0 ? COLORS.accent : COLORS.text}
                        initial={{ opacity: 0.1 }}
                        animate={{
                            opacity: [0.1, 0.4, 0.1],
                            y: [0, -30, 0],
                            x: [0, (i - 3) * 10, 0]
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                    />
                ))}

                {/* The Line - Equilibrium */}
                <motion.line
                    x1="100" y1="300" x2="300" y2="100"
                    stroke={COLORS.text}
                    strokeWidth="1"
                    animate={{ strokeWidth: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* The Pixel (Square) */}
                <motion.rect
                    x="80" y="260" width="40" height="40"
                    stroke={COLORS.accent}
                    strokeWidth="2"
                    fill="none"
                    animate={!isMobile ? {
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    } : {}}
                    transition={!isMobile ? {
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    } : {}}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />

                {/* The Organic (Circle) */}
                <motion.circle
                    cx="320" cy="80" r="20"
                    fill={COLORS.text}
                    animate={{
                        y: [-10, 10, -10],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Connecting Flow */}
                <motion.path
                    d="M 120 280 Q 200 200 300 100"
                    fill="none"
                    stroke={COLORS.text}
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="opacity-40"
                />
            </svg>
        </motion.div>
    );
};
