import { motion } from 'framer-motion';

export const CustomCursor = ({ mouseX, mouseY, cursorType }) => (
    <motion.div
        className="fixed pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference hidden md:flex"
        style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
        }}
    >
        <div
            className={`rounded-full flex items-center justify-center transition-all duration-300 ${cursorType === 'project' ? 'w-24 h-24 bg-white' :
                cursorType === 'nav' ? 'w-16 h-16 border border-white' :
                    'w-4 h-4 bg-white'
                }`}
        >
            {cursorType === 'project' && <span className="text-[10px] uppercase font-bold text-black tracking-widest animate-pulse">Découvrir</span>}
        </div>
    </motion.div>
);
