import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, User, ShieldCheck } from 'lucide-react';

const NotificationsDrawer = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background-dark/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-screen bg-[#0E1628] border-l border-white/5 p-8 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Notifications</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol Updates & Alerts</p>
            </div>
            <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {[
              { title: 'Inference Complete', desc: 'Case #P-4482 has been successfully de-noised.', time: '2m ago', icon: Activity, color: 'text-primary' },
              { title: 'New Specialist Sync', desc: 'Dr. Kovac is now available for consultation.', time: '15m ago', icon: User, color: 'text-accent-teal' },
              { title: 'System Security Scan', desc: 'Vault integrity verified. No anomalies detected.', time: '1h ago', icon: ShieldCheck, color: 'text-slate-400' },
            ].map((n, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${n.color} group-hover:scale-110 transition-transform`}>
                    <n.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">{n.title}</h4>
                      <span className="text-[9px] text-slate-600 font-black">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
            Mark All as Read
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default NotificationsDrawer;
