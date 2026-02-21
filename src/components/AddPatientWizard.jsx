import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Stethoscope, CheckCircle } from 'lucide-react';

const AddPatientWizard = ({ isOpen, onClose }) => {
  const [wizardStep, setWizardStep] = useState(1);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[80] px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-2xl bg-[#080E1A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
         <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Patient Onboarding</h2>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4].map(s => <div key={s} className={`h-1 rounded-full transition-all ${wizardStep >= s ? 'bg-primary w-8' : 'bg-white/10 w-4'}`} />)}
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
         </div>

         <div className="p-10 flex-1 overflow-y-auto no-scrollbar">
            {wizardStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Base Identity</h3>
                  <p className="text-sm text-white font-bold">Step 1: Clinical Identification</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Full Legal Name</label>
                     <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary" placeholder="Enter name..." />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Medical ID</label>
                     <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary" placeholder="P-XXXX" />
                  </div>
                </div>
              </motion.div>
            )}
            {wizardStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center py-10">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6"><Stethoscope size={32} /></div>
                 <h3 className="text-white font-black uppercase tracking-widest">Clinical Context</h3>
                 <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-tighter italic">Implementation level: "add_patient__clinical_context"</p>
              </motion.div>
            )}
            {wizardStep === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 space-y-6">
                 <div className="w-24 h-24 bg-accent-teal/10 rounded-full flex items-center justify-center text-accent-teal mx-auto mb-6 shadow-glow-teal ring-4 ring-accent-teal/5"><CheckCircle size={48} /></div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Registration Success</h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Node Synchronized Root#A44</p>
              </motion.div>
            )}
         </div>

         <div className="p-10 border-t border-white/5 flex gap-4">
            {wizardStep > 1 && wizardStep < 4 && <button onClick={() => setWizardStep(s => s - 1)} className="flex-1 py-4 border border-white/10 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:text-white transition-all">Previous</button>}
            <button 
              onClick={() => { if(wizardStep === 4) onClose(); else setWizardStep(s => s + 1); }} 
              className="flex-1 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-glow-blue hover:scale-[1.02] active:scale-95 transition-all"
            >
              {wizardStep === 4 ? 'Close Wizard' : wizardStep === 3 ? 'Finalize Patient' : 'Continue Integration'}
            </button>
         </div>
      </motion.div>
    </div>
  );
};

export default AddPatientWizard;
