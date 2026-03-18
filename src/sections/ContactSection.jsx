import React, { useState } from 'react';
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react';
import { RevealText, ScrambleText } from '../components/utils/TextAnimations';

export const ContactSection = React.forwardRef((props, ref) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    return (
        <div ref={ref} className="w-full md:min-w-screen min-h-[100dvh] flex flex-col items-center justify-center px-6 md:px-20 shrink-0 bg-[#0A0A0A] text-white relative overflow-hidden py-20">
            {/* Background visual accent - Removed heavy blur for mobile stability */}

            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
                <div className="flex flex-col justify-center">
                    <h2 className="text-5xl sm:text-6xl md:text-9xl font-serif mb-6 md:mb-12 leading-none">
                        <ScrambleText active={isActive} delay={200}>Contact.</ScrambleText>
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base md:text-2xl mb-8 md:mb-12 max-w-md leading-relaxed">
                        Un projet, une question ou simplement envie de discuter ? Mon studio est ouvert à de nouvelles aventures.
                    </p>

                    <div className="flex flex-col gap-4 md:gap-6">
                        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = 'mailto:kspynel@gmail.com'}>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                <Mail size={18} className="group-hover:text-blue-500 transition-colors" />
                            </div>
                            <span className="text-lg md:text-xl tracking-wide group-hover:text-blue-400 transition-colors">kspynel@gmail.com</span>
                        </div>
                        <div className="flex gap-4 mt-4 md:mt-8">
                            {[
                                { icon: <Github size={20} />, link: "https://github.com/spynelkouton" },
                                { icon: <Linkedin size={20} />, link: "https://linkedin.com/in/spynel-kouton" },
                                { icon: <span className="font-bold text-[10px]">WA</span>, link: "https://wa.me/22943202239" }
                            ].map((social, i) => (
                                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <form className="flex flex-col gap-4 md:gap-8 bg-white/5 p-6 md:p-10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                        <div className="flex flex-col gap-1 md:gap-2">
                            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-blue-500">Nom complet</label>
                            <input
                                type="text"
                                placeholder="Spynel Kouton"
                                className="bg-transparent border-b border-white/20 py-2 md:py-4 text-sm md:text-base focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1 md:gap-2">
                            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-blue-500">Email</label>
                            <input
                                type="email"
                                placeholder="spynel@example.com"
                                className="bg-transparent border-b border-white/20 py-2 md:py-4 text-sm md:text-base focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-2">
                        <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-blue-500">Message</label>
                        <textarea
                            placeholder="Dites-moi tout sur votre projet..."
                            rows="3"
                            className="bg-transparent border-b border-white/20 py-2 md:py-4 text-sm md:text-base focus:border-blue-500 outline-none transition-colors resize-none"
                        ></textarea>
                    </div>
                    <button type="submit" className="mt-2 md:mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 md:py-6 rounded-xl text-xs md:text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-4 group">
                        Envoyer le message <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </form>
            </div>

            <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex flex-col items-center gap-2 px-6">
                <div className="w-12 h-[1px] bg-blue-500/30 md:hidden"></div>
                <div className="text-[8px] md:text-[9px] opacity-30 uppercase tracking-[0.4em] md:tracking-[0.8em] text-center">
                    Design & Code by Spynel Kouton — All rights reserved © 2026
                </div>
            </div>
        </div>
    );
});
ContactSection.displayName = 'ContactSection';
