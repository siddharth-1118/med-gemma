
import React, { useState, useEffect } from 'react';
import { Activity, Clock, FileText, User, MessageSquare } from 'lucide-react';
import ChatPanel from './ChatPanel';

const DoctorDashboard = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock initial fetch or use real endpoint
    useEffect(() => {
        // In real app: fetch('/api/cases')
        const mockCases = [
            { id: 1, type: "Chest X-Ray", status: "Pending Review", time: "10m ago", ai_finding: "Right Upper Lobe Opacity" },
            { id: 2, type: "CT Brain", status: "Reviewed", time: "2h ago", ai_finding: "Normal Study" },
            { id: 3, type: "Ultrasound", status: "Pending Review", time: "1h ago", ai_finding: "Gallbladder Wall Thickening" }
        ];
        setTimeout(() => {
            setCases(mockCases);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="h-full bg-slate-50 p-6 overflow-hidden flex flex-col">
            <header className="mb-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
                    <p className="text-sm text-slate-500">Live Case Queue & Collaboration</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-slate-600">Online: Dr. Sarah</span>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 overflow-hidden">
                {/* Left: Case Grid (Scrollable) */}
                <div className="overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cases.map(c => (
                            <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${c.status === 'Pending Review' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {c.status}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock size={12} /> {c.time}
                                    </span>
                                </div>

                                <div className="w-full h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-300">
                                    <FileText size={24} />
                                </div>

                                <h3 className="font-semibold text-slate-700 mb-1">{c.type}</h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">AI Finding: {c.ai_finding}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                                    </div>
                                    <button className="text-xs font-bold text-blue-600 group-hover:underline">Review Case →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Chat Panel (Fixed) */}
                <div className="h-full">
                    <ChatPanel />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
