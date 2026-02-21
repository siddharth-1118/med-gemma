import React from 'react';
import { Activity } from 'lucide-react';

const BottomNav = ({ step, runAnalysis, setStep, setFile, setPreview, setResult, setView, setActiveTab }) => (
  <footer className="fixed bottom-0 left-0 right-0 z-50">
    <div className="px-6 py-4 glass-card border-t-0 rounded-none bg-background-dark/80 backdrop-blur-2xl">
      <button
        onClick={step === 1 ? runAnalysis : () => { setStep(1); setFile(null); setPreview(null); setResult(null); setView('diagnostics'); }}
        className="w-full py-4 bg-primary text-white font-bold rounded-full flex items-center justify-center gap-2 pulse-glow active:scale-95 transition-transform"
      >
        <Activity size={18} />
        <span className="uppercase tracking-widest text-[10px] font-black">{step === 1 ? 'Analyze Now' : 'New Intake'}</span>
      </button>
    </div>
    <nav className="flex justify-around items-center px-4 pb-6 pt-2 bg-slate-900 border-t border-slate-800">
      <button onClick={() => { setView('diagnostics'); setStep(1); }} className={`flex flex-col items-center gap-1 ${step === 1 ? 'text-primary' : 'text-slate-500'}`}>
        <span className="material-symbols-outlined fill-1">add_circle</span>
        <span className="text-[10px] font-medium">Intake</span>
      </button>
      <button onClick={() => { setView('diagnostics'); setStep(3); }} className={`flex flex-col items-center gap-1 ${step === 3 ? 'text-primary' : 'text-slate-500'}`}>
        <span className="material-symbols-outlined">group</span>
        <span className="text-[10px] font-medium">Results</span>
      </button>
      <button onClick={() => { setView('diagnostics'); setActiveTab('chat'); }} className="flex flex-col items-center gap-1 text-slate-500">
        <span className="material-symbols-outlined">psychology</span>
        <span className="text-[10px] font-medium">Consult</span>
      </button>
      <button onClick={() => setView('settings')} className="flex flex-col items-center gap-1 text-slate-500">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </nav>
  </footer>
);

export default BottomNav;
