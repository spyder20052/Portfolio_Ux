import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RevealText } from '../components/utils/TextAnimations';

const BioSection = React.forwardRef((props, ref) => {
    const localRef = useRef(null);
    const sectionInView = useInView(localRef, { once: true, margin: "-10%" });

    // Sync localRef with the forwarded ref
    useImperativeHandle(ref, () => localRef.current);

    return (
        <div ref={localRef} className="w-full md:min-w-screen min-h-screen flex items-center justify-center px-6 md:px-20 py-20 md:py-0 shrink-0 bg-[#0A0A0A] text-white relative">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] max-h-[50vh] md:max-h-[70vh] shadow-2xl">
                    <img
                        src="/Ma_photo.webp"
                        alt="Spynel Kouton"
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 grayscale hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                <div>
                    <RevealText active={sectionInView} delay={100}>
                        <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-8 block">À propos de moi</span>
                    </RevealText>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed mb-12">
                        <RevealText active={sectionInView} delay={300}>Spynel KOUTON — Développeur & Graphic Designer.</RevealText>{" "}
                        <RevealText active={sectionInView} delay={400}><span className="text-gray-500">Avec plus de 3 ans d'expérience,</span></RevealText>{" "}
                        <RevealText active={sectionInView} delay={500}>j'ai réalisé plus de 50 projets variés et stimulants.</RevealText>{" "}
                        <RevealText active={sectionInView} delay={600}><span className="italic text-blue-400">Mon approche combine une solide expertise technique</span></RevealText>{" "}
                        <RevealText active={sectionInView} delay={700}>avec une sensibilité artistique aiguisée.</RevealText>
                    </h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-2 gap-8"
                    >
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Expérience</h4>
                            <p className="text-gray-400">3+ ans | 50+ Projets</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Localisation</h4>
                            <p className="text-gray-400">Bénin, Cotonou, Pk10</p>
                        </div>
                        <div className="md:col-span-2 mt-4">
                            <a
                                href="/Projets/Cv/Spynel_KOUTON_cv_designer.pdf"
                                download
                                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all group"
                            >
                                <span className="text-xs font-bold uppercase tracking-widest">Télécharger mon CV</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
});
BioSection.displayName = 'BioSection';
export default BioSection;
