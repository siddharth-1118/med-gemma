import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const Header = ({ aiStatus }) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between glass-card border-b-0 rounded-none bg-background-dark/80 backdrop-blur-md lg:hidden"
  >
    <div className="flex items-center gap-2">
      <Activity className="text-primary" size={24} />
      <span className="font-bold text-lg tracking-tight text-white italic">MedGemma</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace #4482-A</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${aiStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline: {aiStatus === 'online' ? 'Online' : 'Checking'}</span>
        </div>
      </div>
    </div>
  </motion.header>
);

export default Header;
