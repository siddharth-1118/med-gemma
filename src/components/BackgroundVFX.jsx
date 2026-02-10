import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundVFX = ({ step, loading, darkMode }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate static random particles to avoid re-renders impacting performance too much
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 20 + 30, // 30-50s duration
            delay: Math.random() * 10,
        }));
        setParticles(newParticles);
    }, []);

    // Variant for the base gradient "Breathing" effect
    const gradientVariant = {
        animate: {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            transition: {
                duration: 25,
                ease: "easeInOut",
                repeat: Infinity,
            },
        },
    };

    // Orb Animation
    const orbVariant = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0],
            transition: {
                duration: 20,
                ease: "easeInOut",
                repeat: Infinity,
            },
        },
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Base Gradient Layer - Context Aware */}
            <motion.div
                className={`absolute inset-0 transition-colors duration-1000 ${darkMode
                        ? 'bg-gradient-to-br from-[#0B1220] via-[#121A2F] to-[#0B1220]'
                        : 'bg-gradient-to-br from-[#F4F7FB] via-[#EEF2FF] to-[#F4F7FB]'
                    }`}
                animate={
                    loading ? { filter: "brightness(0.8) contrast(1.1)" } :
                        step === 3 ? { filter: "hue-rotate(15deg)" } :
                            { filter: "none" }
                }
                transition={{ duration: 1 }}
            />

            {/* Subtle Grid Texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(${darkMode ? '#4F8CFF' : '#1F4FD8'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#4F8CFF' : '#1F4FD8'} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px'
                }}
            />

            {/* Radial Orbs (Intelligence Auras) */}
            <motion.div
                variants={orbVariant}
                animate="animate"
                className={`absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.04] mix-blend-screen
            ${step === 3 ? 'bg-[#FF9F1C]' : 'bg-[#1F4FD8]'}
        `}
            />
            <motion.div
                variants={orbVariant}
                animate="animate"
                transition={{ delay: 5 }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2EC4B6] blur-[100px] opacity-[0.04] mix-blend-screen"
            />

            {/* Floating Particles */}
            {!loading && particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${darkMode ? 'bg-white' : 'bg-[#1F4FD8]'}`}
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        opacity: 0.05,
                    }}
                    animate={{
                        y: [-20, -100],
                        x: [0, 10, -10, 0],
                        opacity: [0, 0.08, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Focus Mode Overlay */}
            <motion.div
                className="absolute inset-0 bg-black/10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 1 : 0 }}
                transition={{ duration: 0.8 }}
            />
        </div>
    );
};

export default BackgroundVFX;
