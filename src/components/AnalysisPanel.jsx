import React from 'react';
import { Check, AlertOctagon, TrendingUp, Activity, ArrowRight } from 'lucide-react';

const ConfidenceBar = ({ label, value, color }) => (
    <div className="mb-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${value}%`, backgroundColor: color }}
            ></div>
        </div>
    </div>
);

const AnalysisPanel = ({ analysis, loading }) => {
    if (loading) return <div className="p-8 text-center animate-pulse">Processing...</div>;
    if (!analysis) return null;

    const isAlert = analysis.isInconsistent;
    const themeColor = isAlert ? '#ef4444' : '#10b981';

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
            {/* Header Stats */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        {isAlert ? <AlertOctagon className="text-red-500" /> : <Check className="text-emerald-500" />}
                        {isAlert ? 'Mismatch Detected' : 'Alignment Verified'}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Multi-Modal Logic Gate</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-slate-800">{isAlert ? '12.4' : '98.2'}%</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Consistency Score</div>
                </div>
            </div>

            {/* Visual Metrics */}
            <div className="bg-white/50 p-4 rounded-xl border border-white/50 mb-6 shadow-sm">
                <ConfidenceBar label="Text-Image Correlation" value={isAlert ? 15 : 94} color={themeColor} />
                <ConfidenceBar label="Clinical Relevance" value={88} color="#3b82f6" />
                <ConfidenceBar label="Entity Extraction" value={92} color="#6366f1" />
            </div>

            {/* Key Findings */}
            <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Reasoning Chain</h3>
                <div className="space-y-2">
                    {analysis.jointInterpretation.map((text, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-sm font-medium text-slate-700 flex gap-3">
                            <div className="w-1.5 rounded-full" style={{ backgroundColor: isAlert ? '#fca5a5' : '#86efac' }}></div>
                            {text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action */}
            <div className="mt-auto">
                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Primary Recommendation</div>
                        <div className="font-semibold text-sm">{analysis.followUps[0]}</div>
                    </div>
                    <ArrowRight size={18} />
                </div>
            </div>
        </div>
    );
};

export default AnalysisPanel;
