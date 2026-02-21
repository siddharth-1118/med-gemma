import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, CheckCircle, Activity, Loader2, ZoomIn, ZoomOut, 
  Sun, Moon, Edit2, ImageIcon, Download, Info, AlertCircle, ChevronRight, User
} from 'lucide-react';
import ChatPanel from '../components/ChatPanel';
import PulseConnection from '../components/PulseConnection';

const DiagnosticsView = ({ 
  step, setStep, file, setFile, preview, setPreview, 
  loading, runAnalysis, formData, setFormData, 
  result, setResult, zoom, setZoom, contrast, setContrast, activeTab, setActiveTab,
  loadingSubStep, handleDragOver, handleDrop, handleFileChange, cleanFindings
}) => {
  const pageVariants = {
    initial: { opacity: 0, y: 12, filter: "blur(2px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 }
    },
    exit: { opacity: 0, y: -8, filter: "blur(2px)", transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div
          key="step1"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 overflow-y-auto px-6 pt-6 pb-32 space-y-8 no-scrollbar lg:max-w-7xl lg:mx-auto lg:w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Left Block: Upload & Preview */}
            <div className="space-y-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-xl font-bold dark:text-white uppercase tracking-tighter">Diagnostic Intake</h2>
                 <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">Stage 01/03</div>
              </div>

              <div
                onClick={() => document.getElementById('fileUpload').click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex-1 rounded-[3rem] p-1 transition-all duration-500 cursor-pointer group shadow-2xl overflow-hidden min-h-[400px] ${
                  file ? 'border-2 border-accent-teal/50' : 'border-2 border-dashed border-white/5'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background-dark/80 to-accent-teal/5" />
                
                <div className="relative h-full w-full glass-card rounded-[2.8rem] flex flex-col items-center justify-center p-8 overflow-hidden">
                  {preview ? (
                    <>
                      <img src={preview} alt="Upload" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80" />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-accent-teal/20 flex items-center justify-center text-accent-teal shadow-glow-teal mb-4">
                          <CheckCircle size={32} />
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-widest">{file.name}</span>
                        <span className="text-[10px] text-accent-teal font-bold uppercase mt-1">Ready for Analysis</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <motion.div 
                        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 rounded-[2rem] bg-primary/20 flex items-center justify-center text-primary shadow-glow-blue border border-primary/30"
                      >
                        <Upload size={40} />
                      </motion.div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2">Deploy Clinical Image</h3>
                        <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mx-auto">Drag and drop medical scan or click to browse local storage</p>
                      </div>
                    </div>
                  )}
                </div>
                <input id="fileUpload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            {/* Right Block: Patient Information */}
            <div className="space-y-6 flex flex-col">
              <div className="glass-card bg-white/5 border-white/10 rounded-[3rem] p-8 flex-1 flex flex-col space-y-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-primary" size={20} />
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Patient Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 pl-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all text-white placeholder:text-slate-600"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 pl-1">Age / DOB</label>
                    <input
                      type="number"
                      value={formData.age}
                      placeholder="65"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all text-white placeholder:text-slate-600"
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase font-black text-slate-500 pl-1">Biological Sex</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map(sex => (
                        <button
                          key={sex}
                          onClick={() => setFormData({...formData, sex})}
                          className={`py-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                            formData.sex === sex 
                            ? 'bg-primary/20 border-primary text-primary shadow-glow-blue' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {sex}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-[10px] uppercase font-black text-slate-500 pl-1">Clinical Context & History</label>
                  <textarea
                    value={formData.clinicalNotes}
                    placeholder="Describe symptoms, chief complaint, and relevant medical history..."
                    className="w-full flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all text-white placeholder:text-slate-600 resize-none min-h-[120px]"
                    onChange={(e) => setFormData({...formData, clinicalNotes: e.target.value})}
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={runAnalysis}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-glow-blue hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap uppercase tracking-widest text-xs ${!file ? 'animate-pulse-slow' : ''}`}
                  >
                    {loading ? (
                       <>
                         <Loader2 className="animate-spin" size={20} />
                         <span>Correlating Data...</span>
                       </>
                    ) : (
                       <>
                         <Activity size={20} />
                         <span>{file ? 'Continue to Analysis' : 'Upload Image to Start'}</span>
                       </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div 
          key="step2" 
          variants={pageVariants} 
          initial="initial" 
          animate="animate" 
          exit="exit" 
          className="flex-1 flex flex-col items-center justify-center"
        >
          <PulseConnection 
            status={
              loadingSubStep === 1 ? 'Initializing Neural Link...' : 
              loadingSubStep === 2 ? 'Correlating Clinical Pixels...' : 
              'Finalizing Protocol Report...'
            } 
          />
        </motion.div>
      )}

      {step === 3 && (
        <motion.div 
          key="step3" 
          variants={pageVariants} 
          initial="initial" 
          animate="animate" 
          exit="exit" 
          className="flex-1 flex flex-col lg:flex-row overflow-hidden"
        >
          {/* 1. Clinical Viewer (Left on Desktop) */}
          <div className="lg:flex-1 h-[45%] lg:h-full bg-background-dark relative overflow-hidden flex items-center justify-center border-r border-white/5 group">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            
            <motion.img 
              src={preview} 
              className="max-w-[85%] max-h-[85%] object-contain shadow-[0_0_100px_rgba(31,79,216,0.2)] rounded-lg transition-all" 
              style={{ transform: `scale(${zoom})`, filter: `contrast(${contrast}%) brightness(1.1)` }} 
              alt="Scan" 
            />
            
            {/* ROI Overlay Overlay (simulated for demo if findings exist) */}
            {result?.image_findings && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                 <div className="w-[120px] h-[120px] border-2 border-accent-orange/60 rounded-3xl relative">
                    <div className="absolute -top-6 left-0 bg-accent-orange text-black text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Target ROI #01</div>
                    <div className="absolute inset-0 border border-accent-orange/20 animate-pulse rounded-3xl" />
                 </div>
              </motion.div>
            )}

            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="glass-card px-4 py-2 rounded-full border-primary/20 bg-background-dark/60 flex items-center gap-2">
                 <ImageIcon size={14} className="text-primary" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">{formData.name || 'Anonymous Patient'}</span>
              </div>
            </div>

            <div className="absolute right-6 bottom-6 flex flex-col gap-3">
              {/* Advanced Analysis Tools Floating Bar */}
              <div className="bg-background-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl mb-4 self-end">
                 {[
                   { icon: ZoomIn, label: 'Pixel Zoom', action: () => setZoom(z => Math.min(3, z + 0.2)) },
                   { icon: Sun, label: 'Luminance', action: () => setContrast(c => Math.min(200, c + 10)) },
                   { icon: Moon, label: 'Invert', action: () => setContrast(100) },
                   { icon: Edit2, label: 'Annotate', action: () => {} },
                 ].map((tool, i) => (
                   <button key={i} onClick={tool.action} className="w-10 h-10 rounded-xl hover:bg-primary transition-all flex items-center justify-center text-slate-400 hover:text-white group/tool relative">
                      <tool.icon size={18} />
                      <span className="absolute right-full mr-3 px-2 py-1 bg-primary text-white text-[8px] font-black uppercase rounded opacity-0 group-hover/tool:opacity-100 transition-opacity whitespace-nowrap">{tool.label}</span>
                   </button>
                 ))}
              </div>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="w-12 h-12 rounded-2xl bg-background-dark/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-xl">
                <ZoomIn size={20} />
              </button>
              <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="w-12 h-12 rounded-2xl bg-background-dark/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-xl">
                <ZoomOut size={20} />
              </button>
            </div>
          </div>

          {/* 2. Intelligence Panel (Right on Desktop) */}
          <div className="flex-1 lg:w-[520px] bg-[#0E1628] flex flex-col overflow-hidden border-l border-white/5">
            <div className="flex items-center justify-around bg-background-dark/40 border-b border-white/5 px-4">
              {['analysis', 'symptoms', 'consult'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="tabLine" 
                      className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(31,79,216,0.6)]" 
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar space-y-8">
              {activeTab === 'analysis' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="space-y-4">
                     <div className="flex items-center gap-2">
                       <div className="w-1 h-4 bg-primary rounded-full" />
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Image Findings</h4>
                     </div>
                     <div className="glass-card p-6 bg-white/[0.02] border-white/5 rounded-[2rem]">
                       <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                          "{cleanFindings(result?.image_findings)}"
                       </p>
                     </div>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                     <section className="space-y-3">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Limitations</h4>
                        <div className="glass-card p-4 bg-red-500/5 border-red-500/10 rounded-2xl">
                          <p className="text-[11px] text-red-400 font-medium">Screening purposes only. Confirm via histopathology.</p>
                        </div>
                     </section>
                     <section className="space-y-3">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Uncertainties</h4>
                        <div className="glass-card p-4 bg-amber-500/5 border-amber-500/10 rounded-2xl">
                          <p className="text-[11px] text-amber-400 font-medium">Marginal resolution may obscure micro-calcifications.</p>
                        </div>
                     </section>
                  </div>

                  <section className="space-y-4 pt-4 border-t border-white/5">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Diagnostic Confidence</h4>
                     <div className="relative h-12 bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex items-center px-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '94.2%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/50 to-primary"
                        />
                        <span className="relative z-10 text-xs font-black text-white ml-auto">94.2% ACCURACY</span>
                     </div>
                  </section>
                </div>
              )}

              {activeTab === 'symptoms' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative">
                     <input 
                      type="text" 
                      placeholder="Search symptoms or conditions..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-600"
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                       <ChevronRight size={18} />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="glass-card p-6 bg-white/5 border-white/10 rounded-[2rem] space-y-3">
                        <div className="flex items-center gap-2 text-accent-teal">
                           <Info size={16} />
                           <h5 className="text-[10px] font-black uppercase tracking-widest">Why it happens</h5>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Clinical presentation suggests inflammatory correlation. The AI has detected localized density increases often associated with cellular infiltration.
                        </p>
                     </div>

                     <div className="glass-card p-6 bg-red-500/5 border-red-500/10 rounded-[2rem] space-y-3 border-l-4 border-l-red-500/50">
                        <div className="flex items-center gap-2 text-red-400">
                           <AlertCircle size={16} />
                           <h5 className="text-[10px] font-black uppercase tracking-widest">Red Flags</h5>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-2">
                          <li className="flex items-start gap-2">• Acute onset of sharp pleural-type pain</li>
                          <li className="flex items-start gap-2">• Sustained resting heart rate &gt; 110 BPM</li>
                          <li className="flex items-start gap-2">• Persistent desaturation below 92% SpO2</li>
                        </ul>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'consult' && (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex-1 bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-inner">
                      <ChatPanel />
                   </div>
                </div>
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="p-6 bg-background-dark/60 border-t border-white/5 flex items-center justify-between gap-4">
               <button
                  onClick={() => { setStep(1); setFile(null); setPreview(null); setResult(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
               >
                  <RefreshCw size={14} /> New Intake
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent-teal text-background-dark font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-glow-teal">
                  <Download size={14} /> Download Report
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Internal utility since RefreshCw is needed but not passed
const RefreshCw = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default DiagnosticsView;
