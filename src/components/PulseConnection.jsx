import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PulseConnection = ({ status = "Verifying Clinical ID...", onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full py-12 px-8 bg-background-light dark:bg-background-dark transition-colors duration-500 overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        {/* Central Pulse VFX */}
        <div className="relative h-48 w-full max-w-sm flex items-center justify-center mb-8">
           <svg className="w-full h-full text-primary" viewBox="0 0 400 200">
             <path 
               d="M0,100 L120,100 L140,40 L165,160 L190,80 L210,120 L230,100 L400,100" 
               fill="none" 
               stroke="currentColor" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               strokeWidth="3"
               className="pulse-glow"
             />
             <motion.circle 
               r="4" 
               fill="currentColor"
               animate={{ cx: [230, 400] }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
             />
           </svg>

           {/* Central Morphing Logo */}
           <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 0.8, repeat: Infinity }}
               className="w-24 h-24 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/40 flex items-center justify-center shadow-2xl shadow-primary/20"
             >
                <div className="w-16 h-16 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
                    ecg_heart
                  </span>
                  <div className="absolute -inset-2 border-2 border-red-400 rounded-full opacity-20 animate-ping"></div>
                  <div className="absolute -inset-4 border-2 border-green-400 rounded-full opacity-10"></div>
                </div>
             </motion.div>
           </div>
        </div>

        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Med<span className="text-primary italic">Gemma</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-black text-[12px] uppercase tracking-[0.3em]">
            Multimodal Doctor Support
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-xs space-y-8 flex flex-col items-center">
         <div className="flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-[40px]">face</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{status}</p>
         </div>

         <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full shadow-glow-blue"
              animate={{ width: `${progress}%` }}
            />
         </div>

         <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Clinical Environment</span>
         </div>

         <div className="w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mt-4"></div>
      </div>
    </div>
  );
};

export default PulseConnection;
