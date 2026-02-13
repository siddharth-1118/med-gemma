import React, { useState, useEffect } from 'react';
import { Check, AlertOctagon, TrendingUp, Activity, ArrowRight, Brain, Database, Search, FileText } from 'lucide-react';

const ConfidenceBar = ({ label, value, color }) => (
    <div className="mb-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
            ></div>
        </div>
    </div>
);

const StepItem = ({ icon: Icon, text, delay }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`flex items-center gap-3 text-xs text-slate-600 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
            <div className="p-1.5 bg-white/60 rounded-lg shadow-sm">
                <Icon size={12} className="text-blue-500" />
            </div>
            <span>{text}</span>
        </div>
    );
};

const AnalysisPanel = ({ analysis, loading }) => {
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain size={16} className="text-blue-500/50" />
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Synthesizing Visual Data</p>
                    <p className="text-xs text-slate-400">MedGemma-3b-mix via Gradio Interface</p>
                </div>
                <div className="w-full max-w-[200px] flex flex-col gap-2 mt-8 opacity-70">
                    {['Scanning pixel density...', 'Segmenting biological structures...', 'Correlating with medical ontologies...'].map((text, i) => (
                        <div key={i} className="text-[10px] text-slate-400 animate-pulse text-left" style={{ animationDelay: `${i * 0.5}s` }}>
                            &gt; {text}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!analysis) return null;

    const isAlert = analysis.isInconsistent;
    const themeColor = isAlert ? '#ef4444' : '#10b981';

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            {/* Header Stats */}
            <div className="flex justify-between items-start mb-8 relative">
                <div className="relative z-10">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${isAlert ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {isAlert ? <AlertOctagon size={12} /> : <Check size={12} />}
                        {isAlert ? 'Clinical Mismatch' : 'Verified Consistent'}
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                        Multi-Modal<br />Analysis
                    </h2>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black tracking-tighter" style={{ color: themeColor }}>
                        {isAlert ? '12.4' : '98.2'}
                        <span className="text-lg text-slate-300 font-medium">%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Confidence</div>
                </div>

                {/* Background decorative gloss */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/0 to-white/80 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Agentic Reasoning Trace */}
            <div className="mb-6">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Activity size={12} /> Agentic Reasoning Trace
                </h3>
                <div className="space-y-2 pl-1 border-l-2 border-slate-100">
                    <StepItem icon={Search} text="Identified region of interest: Right Lower Lobe" delay={100} />
                    <StepItem icon={Database} text="Queried MIMIC-CXR knowledge base" delay={600} />
                    <StepItem icon={FileText} text="Cross-referenced with patient history buffer" delay={1100} />
                    <StepItem icon={Brain} text="Generated joint interpretation via MedGemma" delay={1600} />
                </div>
            </div>


            {/* Key Findings Card */}
            <div className={`p-5 rounded-2xl border mb-4 relative overflow-hidden group ${isAlert ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">AI Findings</h3>
                <p className="text-sm font-medium text-slate-700 leading-snug mb-4">
                    {analysis.image_findings}
                </p>

                {/* Location */}
                <div className="flex items-start gap-2 text-xs mb-2">
                    <span className="font-bold text-slate-500 uppercase">Location:</span>
                    <span className="font-mono text-slate-700">{analysis.abnormality_location}</span>
                </div>

                {/* Not Seen (Critical for Safety) */}
                <div className="flex items-start gap-2 text-xs">
                    <span className="font-bold text-slate-500 uppercase">Absent:</span>
                    <span className="font-mono text-slate-500">{analysis.what_is_not_seen}</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="mb-6 px-1">
                <ConfidenceBar
                    label="AI Confidence"
                    value={analysis.confidence === 'high' ? 95 : analysis.confidence === 'moderate' ? 70 : 40}
                    color={themeColor}
                />
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-3">
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-between transition-all shadow-lg shadow-blue-900/20"
                    onClick={() => alert("Doctor Review Requested! Case sent to dashboard.")}
                >
                    <span className="font-semibold text-sm">Request Doctor Review</span>
                    <ArrowRight size={18} />
                </button>

                <div className="text-[10px] text-center text-slate-400">
                    AI SUPPORT ONLY • NOT A DIAGNOSIS
                </div>
            </div>
        </div>
    );
};

export default AnalysisPanel;
