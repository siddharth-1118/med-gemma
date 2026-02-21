import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Database, Cloud } from 'lucide-react';

const SettingsView = ({ aiStatus }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 space-y-8 overflow-y-auto no-scrollbar pb-32 max-w-4xl mx-auto w-full">
    <header className="mb-8">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Settings & Preferences</h2>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Global System Configuration</p>
    </header>

    <div className="space-y-6">
      {[
        { group: 'Clinical Profile', items: [
          { icon: User, label: 'Doctor Identity', desc: 'Manage your clinical credentials and profile', status: 'Verified' },
          { icon: Bell, label: 'Notification Logic', desc: 'Configure priority level alerts and bypasses', status: 'High' },
        ]},
        { group: 'Neural Engine', items: [
          { icon: Settings, label: 'Model Parameters', desc: 'Adjust inference temperature and cleaning strictness', status: 'v1.5.2' },
          { icon: Cloud, label: 'Link Status', desc: 'Current AI backend synchronization state', status: aiStatus === 'online' ? 'Connected' : 'Syncing' },
        ]},
        { group: 'Data Management', items: [
          { icon: Database, label: 'Archive Vault', desc: 'Configure long-term clinical data storage', status: '88% Full' },
          { icon: Shield, label: 'Auto-Compliance', desc: 'Manage automated HIPAA/GDPR audit logs', status: 'Enabled' },
        ]},
      ].map((group, i) => (
        <section key={i} className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-widest pl-2">{group.group}</h3>
          <div className="space-y-3">
            {group.items.map((item, j) => (
              <div key={j} className="glass-card p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/5 text-slate-500 group-hover:text-primary transition-colors">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.status}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </motion.div>
);

export default SettingsView;
