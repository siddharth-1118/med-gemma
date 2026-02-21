import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, User, X, Image as ImageIcon, MessageSquare, AlertCircle } from 'lucide-react';

const PatientTimeline = () => {
  const [level, setLevel] = useState(1);
  const events = [
    { date: 'Nov 24', title: 'Recent Chest X-Ray', type: 'diagnostic', detail: 'Level 1: Primary findings of pneumonia markers in right lobe.', level: 1 },
    { date: 'Oct 12', title: 'Symptom Flare-up', type: 'alert', detail: 'Level 2: Reported acute shortness of breath and high fever (39°C).', level: 2 },
    { date: 'Sep 05', title: 'Specialist Consult', type: 'consult', detail: 'Level 3: Dr. Marcus confirmed history of chronic asthma.', level: 3 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 p-4 glass-card bg-white/5 border-white/5 rounded-2xl">
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detail Depth:</span>
            {[1,2,3].map(l => (
              <button 
                key={l} 
                onClick={() => setLevel(l)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${level === l ? 'bg-primary text-white shadow-glow-blue' : 'bg-white/5 text-slate-500 hover:text-white'}`}
              >
                L{l}
              </button>
            ))}
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-accent-teal/10 text-accent-teal text-[9px] font-black uppercase tracking-widest rounded-lg border border-accent-teal/20">Share Case</button>
            <button className="px-4 py-2 bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 hover:text-white">Export PDF</button>
         </div>
      </div>

      <div className="relative pl-8 space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
        {events.filter(e => e.level <= level).map((e, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className={`absolute -left-8 top-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#080E1A] ${
              e.type === 'diagnostic' ? 'bg-primary text-white' : e.type === 'alert' ? 'bg-red-500 text-white' : 'bg-accent-teal text-white'
            }`}>
              {e.type === 'diagnostic' ? <ImageIcon size={12} /> : e.type === 'alert' ? <AlertCircle size={12} /> : <MessageSquare size={12} />}
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{e.date}</span>
                  <div className="h-px flex-1 bg-white/5" />
               </div>
               <div className="glass-card p-6 bg-white/[0.02] border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors">{e.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{e.detail}</p>
                  {level >= 2 && i === 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                       <div className="p-3 bg-white/5 rounded-xl text-center">
                          <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Density</p>
                          <p className="text-[10px] text-white font-bold">High</p>
                       </div>
                       <div className="p-3 bg-white/5 rounded-xl text-center">
                          <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Spread</p>
                          <p className="text-[10px] text-white font-bold">Global</p>
                       </div>
                       <div className="p-3 bg-white/5 rounded-xl text-center">
                          <p className="text-[8px] text-slate-600 font-black uppercase mb-1">ROI Conf.</p>
                          <p className="text-[10px] text-accent-teal font-bold">98%</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const RegistryView = ({ onSelectPatient, selectedPatient, onAddPatient }) => {
  const [search, setSearch] = useState('');
  const patients = [
    { id: 'P-4481', name: 'John Andersen', age: 42, last: 'Nov 12, 2025', diag: 'Normal' },
    { id: 'P-4482', name: 'Elena Rossi', age: 65, last: 'Nov 21, 2025', diag: 'Pneumonia' },
    { id: 'P-4483', name: 'Sarah Jenkins', age: 28, last: 'Oct 05, 2025', diag: 'Fracture' },
    { id: 'P-4484', name: 'Marcus Chen', age: 71, last: 'Oct 14, 2025', diag: 'Pending' },
  ];
  
  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.diag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8 h-full flex flex-col no-scrollbar">
      {selectedPatient ? (
        <div className="flex-1 flex flex-col space-y-8 overflow-hidden">
          <button onClick={() => onSelectPatient(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            <ChevronRight size={14} className="rotate-180" /> Back to Directory
          </button>
          <div className="flex-1 overflow-y-auto no-scrollbar">
             <PatientTimeline />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Patient Registry</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Central Records Management</p>
            </div>
            <button 
              onClick={onAddPatient}
              className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-glow-blue hover:scale-105 transition-all"
            >
              Add New Patient
            </button>
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or condition..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {search ? <X size={16} className="cursor-pointer" onClick={() => setSearch('')} /> : <ImageIcon size={16} />}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {filtered.length > 0 ? filtered.map((p, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelectPatient(p)} 
                className="glass-card p-6 rounded-2xl bg-white/[0.02] border-white/5 flex items-center justify-between hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{p.id} • {p.age} years</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-12 text-right">
                   <div className="hidden md:block">
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Last Analysis</p>
                      <p className="text-[10px] text-slate-300 font-bold">{p.last}</p>
                   </div>
                   <div>
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Diagnosis</p>
                      <p className={`text-[10px] font-black uppercase ${p.diag === 'Normal' ? 'text-accent-teal' : p.diag === 'Pending' ? 'text-amber-500' : 'text-red-400'}`}>{p.diag}</p>
                   </div>
                </div>
              </motion.div>
            )) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                 <X size={48} />
                 <p className="text-xs font-black uppercase tracking-widest">No matching records found</p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default RegistryView;
