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

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* LAYER 1: Deep / Slow / Large Shapes (#F0F0F0) - Subtly visible */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ transform: tx1 }}
            >
                <svg className="w-full h-full opacity-40" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                    <circle cx="200" cy="200" r="300" fill="#F5F5F5" />
                    <circle cx="1600" cy="800" r="400" fill="#F5F5F5" />
                </svg>
            </motion.div>

            {/* LAYER 2: Mid / Medium / Glows */}
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ transform: tx2 }}
            >
                <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[80px]" />
            </motion.div>
        </div>
    );
};

export const ModernGraphic = ({ mouseX, mouseY, isMobile }) => {
    const factor = 0.03;
    const tx = useTransform(mouseX, (x) => (x - window.innerWidth / 2) * factor);
    const ty = useTransform(mouseY, (y) => (y - window.innerHeight / 2) * factor);
    const rotate = useTransform(mouseX, (x) => (x - window.innerWidth / 2) * 0.03);

    return (
        <motion.div
            className="relative w-full h-full flex items-center justify-center will-change-transform"
            style={{ x: tx, y: ty }}
        >
            {/* Dynamic Ambient Glows */}
            <motion.div
                className="absolute w-[150%] h-[150%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 90]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
                {/* Floating Glass Panels */}
                <motion.div
                    animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {/* The Prism Layer */}
                    <motion.div
                        style={{ rotate }}
                        className="relative w-48 h-64 sm:w-56 sm:h-72 backdrop-blur-xl bg-white/10 border border-white/30 rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 flex items-center justify-center overflow-hidden transition-all"
                    >
                        {/* Shimmering effect */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-white/10" />

                        <div className="relative flex flex-col items-center gap-4">
                            <div className="w-12 h-[1px] bg-blue-500" />
                            <div className="text-[12px] font-bold tracking-[0.8em] text-blue-600 uppercase vertical-text mix-blend-overlay">Design • Code</div>
                            <div className="w-12 h-[1px] bg-blue-500" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Satellite Shape (Solid/Deep) */}
                <motion.div
                    animate={{
                        rotate: 360,
                        x: [20, -20, 20],
                        y: [-20, 20, -20]
                    }}
                    transition={{
                        rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                        default: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -top-4 -right-4 w-40 h-40 bg-[#0A0A0A] rounded-full z-10 flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
                    {/* Minimal Internal Grid */}
                    <div className="grid grid-cols-4 gap-2 opacity-20">
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-white rounded-full" />
                        ))}
                    </div>
                </motion.div>

                {/* Light Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0.8, 0.4],
                        x: [0, 30, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-10 bottom-20 w-12 h-12 rounded-full bg-blue-400 blur-xl z-30 mix-blend-screen"
                />

                {/* Ornaments */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 400 400">
                    <motion.circle
                        cx="200" cy="200" r="180"
                        fill="none" stroke="url(#blueGrad)" strokeWidth="0.5" strokeDasharray="5 5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    />
                    <defs>
                        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </motion.div>
    );
};
