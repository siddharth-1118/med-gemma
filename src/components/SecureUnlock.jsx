import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Delete } from 'lucide-react';

const SecureUnlock = ({ onUnlock, onForgotPin }) => {
  const [pin, setPin] = useState('');
  const maxLength = 4;

  const handlePress = (num) => {
    if (pin.length < maxLength) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === maxLength) {
        // Simple mock check
        if (newPin === '1234') {
          setTimeout(onUnlock, 500);
        } else {
          // Failure shake could be added
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[2000] bg-background-dark flex flex-col font-display"
    >
      <header className="flex items-center justify-between p-6">
        <button onClick={() => setPin('')} className="p-2 rounded-full hover:bg-white/5 transition-colors text-white">
          <ChevronLeft size={24} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
        <div className="text-center mb-10">
          <div className="mb-4 flex justify-center">
            <div className="bg-primary/20 p-4 rounded-full border border-primary/30 shadow-glow-blue">
               <span className="material-symbols-outlined text-primary text-4xl">medical_services</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Enter PIN to Unlock</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">MedGemma Secure Access</p>
        </div>

        {/* PIN Slots */}
        <div className="flex gap-6 mb-8">
          {[...Array(maxLength)].map((_, i) => (
            <motion.div 
              key={i}
              initial={false}
              animate={{ 
                scale: pin.length > i ? 1.2 : 1,
                backgroundColor: pin.length > i ? '#4387f4' : 'transparent',
                borderColor: pin.length > i ? '#4387f4' : '#334155'
              }}
              className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length > i ? 'shadow-glow-blue' : ''}`}
            />
          ))}
        </div>

        <button 
          onClick={onForgotPin}
          className="text-primary font-black text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity mb-12"
        >
          Forgot PIN?
        </button>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[320px]">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button 
              key={num}
              onClick={() => handlePress(num.toString())}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/5 text-2xl font-bold text-white hover:bg-white/10 active:scale-90 transition-all"
            >
              {num}
            </button>
          ))}
          <div />
          <button 
            onClick={() => handlePress('0')}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/5 text-2xl font-bold text-white hover:bg-white/10 active:scale-90 transition-all"
          >
            0
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-transparent text-slate-500 hover:text-white active:scale-90 transition-all"
          >
            <Delete size={28} />
          </button>
        </div>
      </main>

      <footer className="p-8 pb-12 flex justify-center">
        <button className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-primary/10 border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all group">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">fingerprint</span>
          <span className="font-black text-[10px] tracking-widest text-primary uppercase">Use Biometrics</span>
        </button>
      </footer>

      <div className="h-2 w-32 bg-white/10 rounded-full mx-auto mb-2" />
    </motion.div>
  );
};

export default SecureUnlock;
