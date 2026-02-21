import React from 'react';
import { motion } from 'framer-motion';
import { Activity, User, Upload, MessageSquare, ShieldCheck, Edit2, RefreshCw } from 'lucide-react';

const Sidebar = ({ view, setView, aiStatus, setStep, setFile, setPreview, setResult }) => (
  <nav className="hidden lg:flex w-72 bg-[#080E1A] border-r border-white/5 flex-col p-8 transition-all duration-500 z-50">
    <div className="flex items-center gap-3 mb-12">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-glow-blue border border-primary/30">
        <Activity size={24} />
      </div>
      <div>
        <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">MedGemma</h1>
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Clinical Protocol v1.5</span>
      </div>
    </div>

    <div className="space-y-1 flex-1">
      {[
        { id: 'dashboard', name: 'Dashboard', icon: Activity },
        { id: 'registry', name: 'Patients', icon: User },
        { id: 'diagnostics', name: 'Diagnostics', icon: Upload },
        { id: 'specialist', name: 'Collaboration', icon: MessageSquare },
        { id: 'trends', name: 'Analytics', icon: Activity },
        { id: 'security', name: 'Vault', icon: ShieldCheck },
        { id: 'settings', name: 'Settings', icon: Edit2 },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
            view === item.id 
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-inner' 
            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <item.icon size={18} className={view === item.id ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} />
            <span className="text-[10px] uppercase tracking-widest font-black">{item.name}</span>
          </div>
          {view === item.id && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-blue" />}
        </button>
      ))}
    </div>

    <div className="mt-auto space-y-6 pt-8 border-t border-white/5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Status</span>
          <div className={`w-2 h-2 rounded-full ${aiStatus === 'online' ? 'bg-accent-teal shadow-glow-teal' : 'bg-red-500 shadow-glow-red'} animate-pulse`} />
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: aiStatus === 'online' ? '100%' : '30%' }}
          />
        </div>
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          {aiStatus === 'online' ? 'Neural Link Established' : 'Synchronizing Data...'}
        </span>
      </div>

      <button
        onClick={() => { setView('diagnostics'); setStep(1); setFile(null); setPreview(null); setResult(null); }}
        className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 font-black rounded-2xl flex items-center justify-center gap-3 border border-white/5 transition-all group"
      >
        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
        <span className="text-[10px] uppercase tracking-widest">Emergency Reset</span>
      </button>
    </div>
  </nav>
);

export default Sidebar;
