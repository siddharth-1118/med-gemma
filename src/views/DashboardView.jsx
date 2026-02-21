import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageSquare, User, AlertCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';

const DashboardView = ({ aiStatus }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8 overflow-y-auto no-scrollbar pb-32">
    <header className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Clinic Command</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Hospital Management & Diagnostic Hub</p>
      </div>
      <div className="flex gap-4">
        <div className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 bg-white/5 border-white/10">
          <div className={`w-2 h-2 rounded-full ${aiStatus === 'online' ? 'bg-accent-teal shadow-glow-teal' : 'bg-red-500 shadow-glow-red'} animate-pulse`} />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{aiStatus === 'online' ? 'AI Neural Active' : 'AI Offline'}</span>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Diagnostic Queue', value: '12', icon: Activity, color: 'text-primary' },
        { label: 'Active Consults', value: '04', icon: MessageSquare, color: 'text-accent-teal' },
        { label: 'Patient Registry', value: '148', icon: User, color: 'text-white' },
        { label: 'System Alerts', value: '00', icon: AlertCircle, color: 'text-slate-500' },
      ].map((stat, i) => (
        <div key={i} className="glass-card p-6 rounded-[2rem] bg-white/5 border-white/5 hover:border-primary/20 transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <ArrowRight size={14} className="text-slate-700 group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</h3>
          <p className="text-2xl font-black text-white">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Recent Diagnostic Events</h3>
          <button className="text-[10px] font-bold text-primary uppercase">View Registry</button>
        </div>
        <div className="space-y-4">
          {[
            { patient: 'Elena Rossi', type: 'Chest X-Ray', status: 'Completed', time: '12m ago' },
            { patient: 'Marcus Chen', type: 'Abdominal CT', status: 'Analyzing', time: 'Just now' },
            { patient: 'Sarah Jenkins', type: 'Bone Density', status: 'Pending', time: '1h ago' },
          ].map((event, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl bg-white/[0.02] border-white/5 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{event.patient}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{event.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${event.status === 'Analyzing' ? 'text-primary bg-primary/10 animate-pulse' : 'text-slate-400 bg-white/5'}`}>
                  {event.status}
                </span>
                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-white uppercase tracking-widest">Clinic Vitals</h3>
        <div className="glass-card p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border-white/5 space-y-8">
          {[
            { label: 'Processing Load', value: '42%', color: 'bg-primary' },
            { label: 'Engine Latency', value: '1.2s', color: 'bg-accent-teal' },
            { label: 'Storage Usage', value: '88%', color: 'bg-accent-orange' },
          ].map((vital, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>{vital.label}</span>
                <span className="text-white">{vital.value}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${vital.color} rounded-full`} style={{ width: vital.value.includes('%') ? vital.value : '70%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default DashboardView;
