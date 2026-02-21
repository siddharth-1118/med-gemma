import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const EmergencyAlertModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-[100] px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-red-950/40 backdrop-blur-md" />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }} 
          className="relative w-full max-w-lg bg-[#0E0B0B] border border-red-500/30 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(239,68,68,0.2)] text-center space-y-8"
        >
          <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto animate-pulse">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Emergency Warning</h2>
             <p className="text-xs text-red-400 font-black uppercase tracking-[0.3em]">Priority Clinical Alert #E-991</p>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">Critical anomaly detected in Registry P-4482. Immediate intervention required in Radiology Wing B.</p>
          <div className="flex gap-4 pt-4">
             <button onClick={onClose} className="flex-1 py-4 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Acknowledge</button>
             <button className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-glow-red hover:bg-red-500 transition-all">Escalate Protocol</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default EmergencyAlertModal;
