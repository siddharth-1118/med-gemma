import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, User, MessageSquare } from 'lucide-react';

const SpecialistHubView = () => {
  const [search, setSearch] = useState('');
  
  const specialists = [
    { name: 'Dr. Sarah Kovac', spec: 'Radiology Expert', status: 'Online', id: 'D-01' },
    { name: 'Dr. Marcus Chen', spec: 'Pulmonology', status: 'In Surgery', id: 'D-02' },
    { name: 'Dr. Elena Rossi', spec: 'Cardiology', status: 'Online', id: 'D-03' },
    { name: 'Dr. John Andersen', spec: 'Neurology', status: 'Offline', id: 'D-04' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8 h-full flex flex-col no-scrollbar">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Collaboration Hub</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Specialist Network</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">My Network</button>
           <button className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest shadow-glow-blue">Add Specialist</button>
        </div>
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, specialty, or clinic..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans" 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          <ChevronRight size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto no-scrollbar pb-32">
        {specialists.map((dr, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 rounded-[2rem] bg-white/[0.02] border-white/5 hover:border-primary/20 transition-all group cursor-pointer active:scale-95"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors mb-4 relative mx-auto">
              <User size={32} />
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-4 border-[#080E1A] ${dr.status === 'Online' ? 'bg-accent-teal shadow-glow-teal' : dr.status === 'In Surgery' ? 'bg-red-500' : 'bg-slate-700'}`} />
            </div>
            <div className="text-center space-y-1">
               <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{dr.name}</h4>
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{dr.spec}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
               <button className="flex-1 py-2 bg-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all">Profile</button>
               <button className="flex-1 py-2 bg-primary/10 rounded-xl text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">Message</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SpecialistHubView;
