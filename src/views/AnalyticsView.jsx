import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Settings, Calendar } from 'lucide-react';

const AnalyticsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shadow-glow-blue border border-primary/20">
      <Activity size={32} />
    </div>
    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Vital Trends & Analytics</h2>
    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-sm">Level 2 Implementation: Symptom tracking and longitudinal health charts are currently under development.</p>
  </motion.div>
);

export default AnalyticsView;
