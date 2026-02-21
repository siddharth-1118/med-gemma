import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const AppointmentsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-20 h-20 bg-accent-teal/10 rounded-full flex items-center justify-center text-accent-teal mb-4 shadow-glow-teal border border-accent-teal/20">
      <Calendar size={32} />
    </div>
    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Hospital Scheduler</h2>
    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-sm">Level 2 Implementation: Monthly calendar integration and appointment booking flows are in progress.</p>
  </motion.div>
);

export default AppointmentsView;
