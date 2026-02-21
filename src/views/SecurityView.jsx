import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Key, ShieldAlert } from 'lucide-react';

const SecurityView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8 overflow-y-auto no-scrollbar pb-32 max-w-4xl mx-auto w-full">
    <header className="mb-8">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Security Vault & Compliance</h2>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Data protection and access logs</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {[
         { icon: Lock, label: 'Encryption Level', value: 'AES-256-GCM', status: 'Optimal' },
         { icon: ShieldCheck, label: 'HIPAA Compliance', value: 'Verified', status: 'Active' },
       ].map((stat, i) => (
         <div key={i} className="glass-card p-6 rounded-[2rem] bg-white/[0.02] border-white/5 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow-blue border border-primary/20">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-lg font-black text-white tracking-tight">{stat.value}</h4>
              <span className="text-[9px] text-accent-teal font-black uppercase tracking-tighter">{stat.status}</span>
            </div>
         </div>
       ))}
    </div>

    <section className="space-y-4 pt-8">
      <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest pl-2">Real-time Access Logs</h3>
      <div className="glass-card bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Event Node</th>
                <th className="px-6 py-4">Clearance</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Status</th>
              </tr>
           </thead>
           <tbody className="text-[10px] font-bold text-slate-300">
              {[
                { node: 'Registry Entry #P-4482', level: 'Level 3', time: '12m ago', state: 'Authorized' },
                { node: 'Neural Engine Linkage', level: 'System', time: '1h ago', state: 'Encrypted' },
                { node: 'Vault Export Protocol', level: 'Level 5', time: '4h ago', state: 'Blocked' },
              ].map((log, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 text-white">{log.node}</td>
                  <td className="px-6 py-5 uppercase tracking-tighter">{log.level}</td>
                  <td className="px-6 py-5 text-slate-500">{log.time}</td>
                  <td className="px-6 py-5"><span className={`px-2 py-1 rounded-md bg-white/5 ${log.state === 'Blocked' ? 'text-red-400' : 'text-accent-teal'}`}>{log.state}</span></td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </section>
  </motion.div>
);

export default SecurityView;
