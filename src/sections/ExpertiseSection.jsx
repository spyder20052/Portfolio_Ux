import React from 'react';
import { motion } from 'framer-motion';
import { RevealText } from '../components/utils/TextAnimations';

export const ExpertiseSection = React.forwardRef(({ isActive }, ref) => {
    const services = [
        { title: "Développement Web", desc: "Sites modernes et applications performantes (React, Vue.js, Node.js, API REST)." },
        { title: "Applications Mobiles", desc: "Développement natif et hybride iOS/Android (React Native, Flutter, PWA)." },
        { title: "UI/UX Design", desc: "Interfaces intuitives et expériences utilisateur (Design Systems, Prototypage, Accessibilité)." },
        { title: "Optimisation Performance", desc: "Vitesse et optimisation de chargement (Lazy Loading, Compression, CDN)." },
        { title: "Référencement SEO & Marketing", desc: "Visibilité et stratégies de conversion (SEO Technique, Content Marketing, Analytics)." },
        { title: "Gestion de Projets Digitaux", desc: "Pilotage stratégique et coordination (Agile, Planning, Suivi budget)." }
    ];

    const techSkills = [
        { name: "C", level: 95 },
        { name: "C++", level: 95 },
        { name: "Haskell", level: 80 },
        { name: "HTML", level: 70 },
        { name: "CSS", level: 70 },
        { name: "Python", level: 60 }
    ];

    const tools = [
        { name: "Canva", level: 95 },
        { name: "Figma", level: 90 },
        { name: "Photoshop", level: 70 },
        { name: "Illustrator", level: 50 }
    ];

    return (
        <div ref={ref} className="w-full md:min-w-screen min-h-screen flex items-center justify-center px-6 md:px-20 shrink-0 bg-white relative py-20">
            <div className="max-w-7xl w-full">
                <div className="mb-12">
                    <RevealText active={isActive} delay={100}>
                        <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-4 block">Expertise</span>
                    </RevealText>
                    <h2 className="text-5xl md:text-7xl font-serif">Mes Services.</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 mb-20">
                    {services.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group border-b border-gray-100 pb-6 transition-colors"
                        >
                            <span className="text-blue-500 font-bold mb-2 block opacity-30 group-hover:opacity-100 transition-opacity whitespace-nowrap">0{i + 1}</span>
                            <h3 className="text-xl font-serif mb-2">{service.title}</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h3 className="text-2xl font-serif mb-8 text-gray-400 italic">Langages</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {techSkills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{skill.name}</span>
                                        <span className="text-[10px] text-blue-500">{skill.level}%</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-gray-100 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? `${skill.level}%` : '0%' }}
                                            transition={{ duration: 1, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                                            className="h-full bg-blue-500"
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif mb-8 text-gray-400 italic">Outils</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {tools.map((tool, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                                    transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{tool.name}</span>
                                        <span className="text-[10px] text-blue-500">{tool.level}%</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-gray-100 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? `${tool.level}%` : '0%' }}
                                            transition={{ duration: 1, delay: 0.6 + i * 0.05, ease: "easeOut" }}
                                            className="h-full bg-blue-500"
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
ExpertiseSection.displayName = 'ExpertiseSection';
