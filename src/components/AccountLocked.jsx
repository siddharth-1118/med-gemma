import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, History, LifeBuoy } from 'lucide-react';

const AccountLocked = ({ onSupport, onRecovery }) => {
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59); // 14:59

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeLeft);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[3000] bg-background-light dark:bg-background-dark flex flex-col font-display p-8"
    >
      <header className="flex items-center justify-between py-6">
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ShieldAlert size={24} className="text-slate-900 dark:text-white" />
        </button>
        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Security Alert</h2>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-10 max-w-sm mx-auto text-center">
        <div className="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 relative">
          <div className="absolute inset-0 bg-red-500/5 rounded-full animate-ping" />
          <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
            lock_reset
          </span>
        </div>

        <div className="space-y-4">
           <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Account Temporarily Locked</h1>
           <p className="text-sm text-slate-500 font-medium leading-relaxed">
             For your security, access has been restricted due to multiple failed PIN attempts. Please wait 15 minutes or contact your administrator to reset access.
           </p>
        </div>

        <div className="w-full glass-card p-10 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-xl">
           <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Try again in</p>
           <div className="flex justify-center items-center gap-6">
              <div className="text-center">
                 <p className="text-5xl font-black text-slate-900 dark:text-white">{mins.toString().padStart(2, '0')}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Min</p>
              </div>
              <p className="text-3xl font-black text-slate-300">:</p>
              <div className="text-center">
                 <p className="text-5xl font-black text-slate-900 dark:text-white">{secs.toString().padStart(2, '0')}</p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Sec</p>
              </div>
           </div>
        </div>

        <div className="w-full space-y-4">
           <button 
             onClick={onSupport}
             className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-glow-red hover:bg-red-500 transition-all flex items-center justify-center gap-3"
           >
              <LifeBuoy size={18} />
              Contact Support
           </button>
           <button 
             onClick={onRecovery}
             className="w-full py-5 bg-transparent text-primary rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-primary/5 transition-all"
           >
              Go to Recovery
           </button>
        </div>
      </main>

      <footer className="py-8 flex flex-col items-center gap-6">
         <div className="flex items-center gap-2 text-slate-400 opacity-60">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            <span className="text-[9px] font-black uppercase tracking-widest">MedGemma Secure System • Error Code: MG-403L</span>
         </div>
         
         <div className="w-full flex justify-around items-center pt-4 border-t border-slate-200 dark:border-white/5 opacity-40">
            <span className="material-symbols-outlined">home</span>
            <span className="material-symbols-outlined">history</span>
            <span className="material-symbols-outlined text-red-500 fill-1">shield</span>
            <span className="material-symbols-outlined">person</span>
         </div>
      </footer>
    </motion.div>
  );
};

export default AccountLocked;
