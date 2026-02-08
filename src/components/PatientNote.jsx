import React from 'react';
import { User, FileText } from 'lucide-react';

const PatientNote = ({ data }) => {
    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={14} /> Patient Identity
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Age</div>
                        <div className="text-lg font-bold text-slate-800">{data.age}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="text-[10px] uppercase text-slate-400 font-bold">Sex</div>
                        <div className="text-lg font-bold text-slate-800">{data.sex}</div>
                    </div>
                </div>
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={14} /> Clinical Narrative
            </h3>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-1">
                <p className="text-sm font-medium text-slate-800 mb-4 bg-yellow-50 inline-block px-2 py-1 rounded text-yellow-800 border border-yellow-100">
                    Complaint: {data.chiefComplaint}
                </p>
                <div className="space-y-3">
                    {data.notes.split('. ').map((s, i) => (
                        <p key={i} className="text-sm text-slate-600 leading-relaxed">{s}.</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientNote;
