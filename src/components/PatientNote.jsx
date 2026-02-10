import React from 'react';
import { User, FileText, Calendar, Activity } from 'lucide-react';

const PatientNote = ({ data }) => {
    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border-2 border-slate-100">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Patient Record</h2>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: #8492-AX</div>
                    </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-100 flex items-center gap-1">
                    <Activity size={10} /> Stable
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/60 p-3 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-sm">
                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                        <Calendar size={10} /> Age
                    </div>
                    <div className="text-xl font-bold text-slate-800 tracking-tight">{data.age} <span className="text-xs text-slate-400 font-medium">yrs</span></div>
                </div>
                <div className="bg-white/60 p-3 rounded-2xl shadow-sm border border-slate-100 backdrop-blur-sm">
                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                        <User size={10} /> Sex
                    </div>
                    <div className="text-xl font-bold text-slate-800 tracking-tight">{data.sex}</div>
                </div>
            </div>

            {/* Clinical Narrative */}
            <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                    <FileText size={12} /> Clinical Narrative
                </h3>

                <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm relative overflow-hidden group">
                    {/* Decorative top bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50"></div>

                    <div className="mb-4">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-2 border border-blue-100">
                            Chief Complaint
                        </span>
                        <p className="text-sm font-medium text-slate-800 leading-snug">
                            {data.chiefComplaint}
                        </p>
                    </div>

                    <div className="space-y-3 relative">
                        {data.notes.split('. ').map((s, i) => (
                            s.trim() && (
                                <div key={i} className="flex gap-3">
                                    <span className="text-slate-300 font-mono text-[10px] mt-1 leading-none self-start">{(i + 1).toString().padStart(2, '0')}</span>
                                    <p className="text-sm text-slate-600 leading-relaxed font-normal">{s.trim()}.</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientNote;
