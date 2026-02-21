import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CinematicSplash = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-background-dark font-display"
    >
      {/* Ambient Background VFX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[80px] animate-pulse-slow"></div>
        
        {/* Neural Network / DNA Light Trails Simulation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-px h-64 bg-gradient-to-b from-[#4285F4] via-[#EA4335] to-[#FBBC05] rotate-45 blur-[2px]"></div>
          <div className="absolute top-1/3 right-1/4 w-px h-80 bg-gradient-to-b from-[#34A853] via-[#4285F4] to-[#EA4335] -rotate-[30deg] blur-[1px]"></div>
          <div className="absolute bottom-1/4 left-1/2 w-px h-96 bg-gradient-to-b from-[#FBBC05] via-[#34A853] to-[#4285F4] rotate-[15deg] blur-[3px]"></div>
          
          <div className="absolute top-20 left-40 w-1 h-1 bg-white rounded-full opacity-20"></div>
          <div className="absolute bottom-40 right-20 w-1.5 h-1.5 bg-primary rounded-full opacity-30"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full opacity-10"></div>
        </div>

        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Center Content: Logo & Branding */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <span className="material-symbols-outlined text-6xl text-primary leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}>
            fluid_med
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl font-extrabold tracking-tighter text-slate-100 shimmer-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          MedGemma
        </motion.h1>

        <motion.p 
          className="mt-2 text-sm font-medium tracking-[0.3em] uppercase text-slate-400 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Advanced Medical Intelligence
        </motion.p>
      </div>

      {/* Bottom UI: Loading & Status */}
      <div className="absolute bottom-16 z-10 w-full max-w-xs px-6 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-slate-400 text-[10px] font-black tracking-widest animate-pulse uppercase">
            {progress < 40 ? 'Initializing AI Medical Core...' : 
             progress < 80 ? 'Synchronizing Neural Link...' : 'Starting Pipeline...'}
          </p>

          <div className="relative h-1 w-full overflow-hidden rounded-full bg-slate-800/50 backdrop-blur-sm">
            <motion.div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/40 via-primary to-white shadow-[0_0_12px_rgba(71,134,235,0.8)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <span className="text-[10px] font-bold text-slate-500 tabular-nums uppercase">{progress}% Complete</span>
        </div>

        <div className="flex items-center gap-2 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#EA4335]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></div>
          <span className="ml-1 text-[10px] font-semibold text-slate-300 uppercase tracking-widest">Powered by Gemini Core</span>
        </div>
      </div>

      <div className="absolute bottom-2 w-32 h-1.5 rounded-full bg-white/10"></div>
    </motion.div>
  );
};

export default CinematicSplash;
