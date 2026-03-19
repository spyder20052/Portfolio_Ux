import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '../../data/projects';

export const ProjectCard = ({ project, onOpen, index, isScrolling }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { margin: "200%", once: true });
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    return (
        <div
            ref={cardRef}
            className={`h-[40vh] sm:h-[45vh] md:h-[75vh] w-full md:w-[550px] shrink-0 md:mx-10 relative group bg-gray-200 cursor-pointer my-6 md:my-0 ${index % 2 === 0 ? 'md:translate-y-[-5%]' : 'md:translate-y-[5%]'} ${isScrolling ? 'pointer-events-none' : ''}`}
            style={{ contain: 'layout style paint size' }}
            onClick={() => !isScrolling && onOpen(project)}
        >
            <div className="absolute inset-0 overflow-hidden bg-gray-100">
                {isInView && (
                    <img
                        onLoad={handleImageLoad}
                        src={project.img}
                        alt={project.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className={`w-full h-full object-cover transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${isScrolling ? '' : 'group-hover:scale-110'}`}
                    />
                )}
            </div>
            <div className={`absolute top-0 right-0 p-8 mix-blend-difference text-white opacity-0 ${isScrolling ? '' : 'group-hover:opacity-100'} transition-opacity hidden md:block`}>
                <ArrowRight size={40} />
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-20">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-2 block text-blue-400">{project.category}</span>
                <h3 className="text-2xl md:text-5xl font-serif">{project.title}</h3>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 md:opacity-0 ${isScrolling ? '' : 'md:group-hover:opacity-100'} transition-opacity duration-500`}></div>
        </div>
    );
};
export const ProjectDetail = ({ project, onClose, onOpenProject, isMobile }) => {
    if (!project) return null;

    const currentIndex = PROJECTS.findIndex(p => p.id === project.id);
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

    return (
        <div className="fixed inset-0 z-[150] bg-[#0A0A0A] text-white overflow-y-auto">
            {/* RETOUR BUTTON */}
            <button
                onClick={onClose}
                className={`fixed top-6 left-6 md:top-10 md:left-10 z-[250] px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white ${isMobile ? 'bg-black/50 backdrop-blur-md' : 'mix-blend-difference'} hover:text-blue-500 transition-colors border border-white/20 rounded-full`}
            >
                &lt; Retour
            </button>

            <div className="min-h-screen flex flex-col">
                {/* Immersive Header - Split screen feel */}
                <div className="relative h-screen w-full flex flex-col md:flex-row border-b border-white/10">
                    <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-[#111] flex items-center justify-center p-4">
                        <img src={project.img} loading="lazy" className="max-w-full max-h-full object-contain transition-all duration-1000 shadow-2xl" alt={project.title} />
                    </div>
                    <div className="w-full md:w-1/2 min-h-[50vh] md:h-full flex flex-col justify-center p-8 md:p-20 bg-black">
                        <span className="text-blue-500 font-bold tracking-[0.4em] uppercase mb-6 md:mb-8 block text-[10px] md:text-xs">{project.category}</span>
                        <h2 className="text-4xl md:text-[6rem] lg:text-[8rem] font-serif leading-tight md:leading-none tracking-tighter mb-8 md:mb-12">{project.title}</h2>
                        <div className="w-16 md:w-20 h-[1px] bg-blue-500 mb-8 md:mb-12"></div>
                        <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-lg leading-relaxed font-light">
                            {project.description}
                        </p>
                    </div>
                </div>

                <div className="bg-[#0A0A0A] py-20 px-4 md:px-12">
                    <div className="max-w-[1600px] mx-auto columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
                        {project.images.map((img, i) => (
                            <motion.div
                                key={`${project.id}-img-${i}`}
                                initial={!isMobile ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
                                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                                viewport={{ once: true, margin: "20%" }}
                                transition={{
                                    duration: 0.8,
                                    delay: isMobile ? 0 : (i % 3) * 0.1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className={`relative group break-inside-avoid-column flex flex-col items-center mb-12 ${!isMobile ? 'will-change-transform' : ''}`}
                                style={!isMobile ? { transform: 'translate3d(0,0,0)' } : {}}
                            >
                                <div className="relative w-full overflow-hidden bg-transparent transition-all duration-700">
                                    <img
                                        src={img}
                                        alt={`${project.title} - Vue ${i + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-auto object-contain shadow-2xl rounded-lg border border-white/5 transition-transform duration-700 md:group-hover:scale-[1.02]"
                                    />

                                    {/* Minimalist Overlay - only shows on hover */}
                                    <div className="absolute inset-0 bg-blue-600/0 md:group-hover:bg-blue-600/5 transition-colors duration-700 pointer-events-none rounded-lg"></div>

                                    {/* Tech Detail Label */}
                                    <div className="mt-4 opacity-40 md:group-hover:opacity-100 transition-all duration-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-[1px] bg-blue-500"></div>
                                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">Vue {i + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Next Project Navigation */}

                {/* Next Project Navigation */}
                <div
                    onClick={() => {
                        const modal = document.querySelector('.fixed.inset-0.z-\\[150\\]');
                        if (modal) modal.scrollTop = 0;
                        onOpenProject(nextProject);
                    }}
                    className="group relative h-[60vh] w-full cursor-pointer overflow-hidden"
                >
                    <img
                        src={nextProject.img}
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000"
                        alt="Next project background"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <span className="text-blue-500 font-bold tracking-[0.4em] uppercase mb-4 text-xs">Projet Suivant</span>
                        <h3 className="text-4xl md:text-[8rem] font-serif transition-transform duration-700 group-hover:scale-110">{nextProject.title}</h3>
                        <div className="mt-10 flex items-center gap-4 text-white/50 group-hover:text-blue-400 transition-colors">
                            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Découvrir</span>
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
