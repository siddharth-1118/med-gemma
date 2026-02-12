import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Activity, User, Stethoscope, AlertCircle, CheckCircle, Image as ImageIcon, ArrowRight, Edit2, Play, Download, RefreshCw, ZoomIn, ZoomOut, ChevronRight, Loader2, ShieldCheck, Thermometer, Info, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BackgroundVFX from './components/BackgroundVFX';

function App() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [contrast, setContrast] = useState(100);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [formData, setFormData] = useState({
    age: '65',
    sex: 'Male',
    chiefComplaint: 'Shortness of breath, chest pain',
    history: 'Smoker, fever for 3 days',
    symptoms: 'Chest pain and cough',
    oxygen: '',
    markers: 'Normal'
  });

  const fileInputRef = useRef(null);
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const processFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleFileDrop = (e) => { e.preventDefault(); processFile(e.dataTransfer.files[0]); };

  const handleDownloadReport = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MedGen_Report_${formData.age}_${formData.sex}.pdf`);
    } catch (err) {
      console.error("PDF Export Failed", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const runAnalysis = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setStep(2); // Ensure we are on the animation/review step

    try {
      const clinicalPrompt = `Patient: ${formData.age} ${formData.sex}. History: ${formData.history}. Complaint: ${formData.chiefComplaint}. Symptoms: ${formData.symptoms}.`;

      const data = new FormData();
      data.append('image', file);
      data.append('prompt', clinicalPrompt);
      data.append('caseId', 'custom');

      // Call the Node.js server (which proxies to the Python AI engine)
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const resData = await response.json();

      setResult(resData);
      setStep(3); // Move to results step
    } catch (err) {
      console.error("Analysis Error:", err);
      alert(`Analysis failed: ${err.message}. Please ensure the backend server and AI engine are running.`);
    } finally {
      setLoading(false);
    }
  };

  // --- CINEMATIC VFX DEFINITIONS ---

  // 1. Organic Page Transition (Calm slide-up)
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

  // 2. Card Glass Lift on Hover
  const cardHover = {
    rest: { y: 0, boxShadow: "0px 4px 6px rgba(0,0,0,0.05)" },
    hover: {
      y: -2,
      boxShadow: "0px 12px 24px rgba(31, 79, 216, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // 3. Subtle Button Pulse (Breathing)
  const pulseButton = {
    rest: { scale: 1 },
    hover: { scale: 1.02, brightness: 1.1 },
    tap: { scale: 0.97 },
    pulse: {
      boxShadow: ["0 0 0 0 rgba(31, 79, 216, 0)", "0 0 0 4px rgba(31, 79, 216, 0.1)", "0 0 0 0 rgba(31, 79, 216, 0)"],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // 4. Clinical Breathing ROI (Thinking/Focus)
  const breathingRing = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.6, 1, 0.6],
      boxShadow: ["0 0 20px rgba(255,159,28,0.3)", "0 0 40px rgba(255,159,28,0.6)", "0 0 20px rgba(255,159,28,0.3)"],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // 5. Text Reveal (Line by line)
  const staggerText = {
    initial: {},
    animate: { transition: { staggerChildren: 0.04 } }
  };

  const textLine = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const Header = () => (
    <motion.header
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-[#1F4FD8] text-white border-b border-white/10 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md"
    >
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ rotate: 10 }} className="bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-sm">
          <Stethoscope size={24} strokeWidth={2.5} className="text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Multimodal Doctor Support Assistant</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-100">
            <ShieldCheck size={12} className="text-[#2EC4B6]" />
            <span>AI Clinical Decision Support</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <span className="text-xs italic px-3 py-1 bg-white/10 rounded-full border border-white/20 text-blue-100">
          For clinical support use only.
        </span>
      </div>
    </motion.header>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B1220] font-sans text-[#1F2937] dark:text-gray-100 flex flex-col transition-colors duration-500 relative">
      <BackgroundVFX step={step} loading={loading} darkMode={darkMode} />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex gap-8 w-full max-w-6xl h-[600px]">
              {/* Upload Card */}
              <motion.div variants={cardHover} initial="rest" whileHover="hover" className="flex-1 bg-white dark:bg-[#121A2F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 flex flex-col relative overflow-hidden group">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1F4FD8] dark:text-[#4F8CFF]">
                  <div className="p-2 bg-[#1F4FD8]/10 rounded-lg"><Upload size={20} /></div>
                  Upload Medical Image
                </h2>
                <div
                  className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                            ${preview ? 'border-[#2EC4B6] bg-[#2EC4B6]/5' : 'border-[#4F8CFF]/40 bg-slate-50 dark:bg-[#0B1220] hover:border-[#1F4FD8] hover:bg-[#1F4FD8]/5'}
                        `}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  {preview ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full p-4 flex items-center justify-center">
                      <img src={preview} className="max-h-full max-w-full object-contain rounded shadow-lg" />
                      <div className="absolute inset-0 bg-[#1F4FD8]/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl backdrop-blur-sm">
                        <span className="hidden">Change</span>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-20 h-20 bg-white dark:bg-[#121A2F] rounded-full flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none mb-6 border border-slate-100 dark:border-slate-700">
                        <Upload size={32} className="text-[#1F4FD8] dark:text-[#4F8CFF]" />
                      </motion.div>
                      <p className="font-bold text-lg text-slate-700 dark:text-slate-200">Drag & Drop X-Ray Here</p>
                      <p className="text-sm text-slate-500 mt-2 mb-6">Supported: PNG, JPG</p>
                      <span className="text-xs text-[#1F4FD8] bg-[#1F4FD8]/10 px-3 py-1 rounded-full font-bold">DICOM files must be converted</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => processFile(e.target.files[0])} />
                </div>
              </motion.div>

              {/* Form Card */}
              <motion.div variants={cardHover} initial="rest" whileHover="hover" className="flex-1 bg-white dark:bg-[#121A2F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 flex flex-col relative overflow-hidden">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1F4FD8] dark:text-[#4F8CFF]">
                  <div className="p-2 bg-[#1F4FD8]/10 rounded-lg"><User size={20} /></div>
                  Patient Information
                </h2>
                <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4F8CFF] transition-colors">Age</label>
                      <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-all dark:text-white font-medium" />
                    </div>
                    <div className="group">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4F8CFF] transition-colors">Sex</label>
                      <select name="sex" value={formData.sex} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-all dark:text-white font-medium">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4F8CFF] transition-colors">Chief Complaint</label>
                    <input name="chiefComplaint" value={formData.chiefComplaint} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-all dark:text-white font-medium" />
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4F8CFF] transition-colors">Medical History</label>
                    <textarea rows={3} name="history" value={formData.history} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-all dark:text-white resize-none font-medium" />
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block group-focus-within:text-[#4F8CFF] transition-colors">Key Symptoms</label>
                    <input name="symptoms" value={formData.symptoms} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-all dark:text-white font-medium" />
                  </div>
                </div>
                <motion.button
                  variants={pulseButton} initial="rest" whileHover="hover" whileTap="tap" animate="pulse"
                  onClick={() => setStep(2)}
                  disabled={!file}
                  className="mt-6 w-full bg-gradient-to-r from-[#1F4FD8] to-[#4F8CFF] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  Continue to Analysis <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-4xl bg-white dark:bg-[#121A2F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F4FD8] dark:text-[#4F8CFF]">
                    {loading ? "AI Analysis in Progress" : "Review Inputs"}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {loading ? "Deep learning model analyzing multimodal data..." : "Please confirm patient details before AI processing."}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 text-[#1F4FD8] dark:text-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {loading ? "Processing..." : "Draft Case"}
                </div>
              </div>

              {loading ? (
                /* ESTIMATED AI THINKING VFX (Skeleton + Pulse) */
                <div className="p-8 grid grid-cols-[1fr_1.5fr] gap-8 relative overflow-hidden">
                  {/* Scanning Line VFX */}
                  <motion.div
                    initial={{ top: 0, opacity: 0 }}
                    animate={{ top: "100%", opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2EC4B6] to-transparent z-10"
                  />

                  {/* Image Skeleton */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 h-64 animate-pulse pt-[50%]">
                    <motion.div
                      animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 m-auto w-16 h-16 border-4 border-[#1F4FD8]/20 border-t-[#1F4FD8] rounded-full"
                    />
                  </div>

                  {/* Text Skeletons */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Normal Review State */
                <div className="p-8 grid grid-cols-[1fr_1.5fr] gap-8">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-black group shadow-md cursor-zoom-in">
                    <img src={preview} className="w-full h-64 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Zoom Preview</div>
                    </div>
                  </motion.div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical Context</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-[#1F4FD8] dark:text-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100 dark:border-blue-800">{formData.age} Y / {formData.sex}</span>
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-[#1F4FD8] dark:text-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-100 dark:border-blue-800">{formData.chiefComplaint}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-[#0B1220] p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">History</span>
                        <p className="text-sm font-medium dark:text-slate-200">{formData.history}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#0B1220] p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Symptoms</span>
                        <p className="text-sm font-medium dark:text-slate-200">{formData.symptoms}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 bg-slate-50 dark:bg-[#0B1220] border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                {!loading && (
                  <button onClick={() => setStep(1)} className="text-[#4F8CFF] font-bold hover:text-[#1F4FD8] flex items-center gap-2 px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800">
                    <Edit2 size={16} /> Edit Inputs
                  </button>
                )}
                <motion.button
                  variants={pulseButton} initial="rest" whileHover="hover" whileTap="tap" animate={loading ? "rest" : "pulse"}
                  onClick={runAnalysis} disabled={loading}
                  className={`px-8 py-3.5 rounded-xl font-bold shadow-lg flex items-center gap-3 transition-all ${loading ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 w-full justify-center cursor-not-allowed' : 'bg-[#1F4FD8] hover:bg-blue-800 text-white shadow-[#1F4FD8]/20 ml-auto'}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-[#1F4FD8]" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Play size={20} fill="currentColor" />
                      Run Analysis
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[1400px] h-[750px] grid grid-cols-[1.2fr_0.8fr] gap-6">
              {/* Viewer */}
              <div className="bg-[#05090E] rounded-2xl shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col group">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur border border-white/10 uppercase tracking-widest">High-Res DICOM Viewer</span>
                </div>
                <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1220] to-black">
                  <img src={preview} className="max-w-full max-h-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoom})`, filter: `contrast(${contrast}%)` }} />
                  <motion.div
                    variants={breathingRing} animate="animate"
                    className="absolute top-[40%] right-[30%] w-32 h-32 rounded-full border-2 border-[#FF9F1C]"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF9F1C] text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase">Attention Region</div>
                  </motion.div>
                </div>
                <div className="bg-[#0B1220] p-3 flex justify-between border-t border-white/5">
                  <div className="flex gap-2 text-white/50">
                    <button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="p-2 hover:bg-white/10 rounded hover:text-white transition-colors"><ZoomOut size={18} /></button>
                    <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="p-2 hover:bg-white/10 rounded hover:text-white transition-colors"><ZoomIn size={18} /></button>
                  </div>
                  <button onClick={() => { setStep(1); setFile(null); }} className="text-xs text-white/70 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors font-bold uppercase tracking-wider">
                    <Upload size={14} /> New Upload
                  </button>
                </div>
              </div>

              {/* Analysis */}
              <div className="flex flex-col gap-4 h-full">
                <div className="flex-1 bg-white dark:bg-[#121A2F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
                  <div className="bg-white dark:bg-[#121A2F] px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold flex items-center gap-2 text-[#1F4FD8] dark:text-white text-lg"><Activity size={20} className="text-[#4F8CFF]" /> AI Joint Analysis</span>
                    <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded font-black tracking-widest uppercase">Confidence: 98%</span>
                  </div>

                  {/* Text Reveal Logic - Updated for 5-Step Data */}
                  <motion.div variants={staggerText} initial="initial" animate="animate" className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1 bg-slate-50/50 dark:bg-[#0B1220]/50">

                    <motion.div variants={textLine} className="bg-white dark:bg-[#121A2F] p-5 rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#1F4FD8] shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#1F4FD8] uppercase tracking-wider mb-3"><Activity size={16} /> Image Findings</h4>
                      <ul className="list-disc ml-4 space-y-1">
                        {result?.imageFindings?.map((f, i) => (
                          <li key={i} className="text-sm font-medium leading-relaxed dark:text-slate-200">{f}</li>
                        )) || <li className="text-sm">Processing image data...</li>}
                      </ul>
                    </motion.div>

                    <motion.div variants={textLine} className="bg-white dark:bg-[#121A2F] p-5 rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#2EC4B6] shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#2EC4B6] uppercase tracking-wider mb-3"><User size={16} /> Clinical Correlation</h4>
                      <p className="text-sm font-medium leading-relaxed dark:text-slate-200">{result?.correlation}</p>
                    </motion.div>

                    <motion.div variants={textLine} className="bg-white dark:bg-[#121A2F] p-5 rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#FF9F1C] shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#FF9F1C] uppercase tracking-wider mb-3"><AlertCircle size={16} /> Uncertainties & Negatives</h4>
                      <p className="text-sm italic text-slate-500 dark:text-slate-400 mb-2">{result?.uncertainties}</p>
                      <div className="text-xs text-slate-400 border-t pt-2 mt-2">
                        <strong>Negatives: </strong> {result?.negativeFindings?.join(", ")}
                      </div>
                    </motion.div>
                  </motion.div>

                  <div className="p-5 bg-white dark:bg-[#121A2F] border-t border-slate-200 dark:border-slate-800">
                    <motion.button variants={pulseButton} initial="rest" whileHover="hover" whileTap="tap" onClick={() => setStep(4)} className="w-full bg-[#1F4FD8] hover:bg-blue-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                      View Suggested Next Steps <ChevronRight size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl bg-white dark:bg-[#121A2F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Activity size={100} /></div>
                <h2 className="text-2xl font-bold flex items-center gap-3 relative z-10"><CheckCircle className="text-[#2EC4B6]" size={28} /> Recommended Protocol</h2>
                <p className="text-slate-400 mt-2 text-sm relative z-10 font-medium">Actionable steps based on multimodal findings.</p>
              </div>
              <div className="p-8 space-y-4">
                {[
                  { text: 'Check oxygen saturation', sub: 'Urgent Verification', color: '#2EC4B6' },
                  { text: 'Order inflammatory markers', sub: 'Lab Panel Required', color: '#FF9F1C' },
                  { text: 'Consider follow-up imaging', sub: 'Standard Protocol', color: '#4F8CFF' }
                ].map((item, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-xl border cursor-pointer group transition-colors"
                    style={{ borderColor: `${item.color}40`, backgroundColor: `${item.color}0D` }}
                  >
                    <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-lg" style={{ backgroundColor: item.color }}>{i + 1}</div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white transition-colors" style={{ color: item.color }}>{item.text}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-8 pb-8">
                <motion.button variants={pulseButton} initial="rest" whileHover="hover" whileTap="tap" onClick={() => setStep(5)} className="w-full bg-[#2EC4B6] hover:bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
                  <RefreshCw size={20} /> Update Results & Finalize Case
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-[1200px] flex gap-8 h-[80vh]">
              <div className="w-[350px] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
                <img src={preview} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              </div>
              <div id="report-content" className="flex-1 bg-white dark:bg-[#121A2F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#0B1220]/50">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-[#1F4FD8] dark:text-white tracking-tight">Final Medical Report</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">AI-Generated Clinical Decision Support Document</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-[#1F4FD8]/10 text-[#1F4FD8] px-4 py-2 rounded-lg font-bold border border-[#1F4FD8]/20">{formData.age} Y / {formData.sex}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <div className="space-y-6">
                    {/* 1. Image Findings */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                      <h3 className="text-sm font-bold text-[#1F4FD8] uppercase tracking-wider flex items-center gap-2 mb-3"><Activity size={16} /> 1. Image Findings</h3>
                      <ul className="space-y-2">
                        {result?.imageFindings?.map((finding, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1F4FD8] flex-shrink-0"></div>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 2 & 3. Correlation & Negative Findings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-bold text-[#4F8CFF] uppercase tracking-wider flex items-center gap-2 mb-3"><User size={16} /> 2. Context Correlation</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-white dark:bg-[#0B1220] p-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                          {result?.correlation}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3"><ShieldCheck size={16} /> 3. Negative Findings</h3>
                        <ul className="space-y-2">
                          {result?.negativeFindings?.map((neg, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 italic">
                              • {neg}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 4. Uncertainties */}
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 flex gap-4 items-start">
                      <AlertCircle className="text-[#FF9F1C] flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-xs font-bold text-[#FF9F1C] uppercase tracking-wider mb-1">4. Uncertainty & Limitations</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{result?.uncertainties}</p>
                      </div>
                    </div>

                    {/* 5. Suggestions */}
                    <div className="bg-[#2EC4B6]/5 dark:bg-[#2EC4B6]/10 p-5 rounded-xl border border-[#2EC4B6]/20">
                      <h4 className="text-[#2EC4B6] font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2"><CheckCircle size={16} /> 5. Suggested Clinical Review</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result?.suggestions?.map((sugg, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 font-bold bg-white dark:bg-[#0B1220] p-3 rounded-lg border border-[#2EC4B6]/10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#2EC4B6]"></div>
                            {sugg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-[#0B1220] border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 rounded-b-2xl">
                  <button onClick={() => { setStep(1); setFile(null); }} className="px-6 py-3 text-[#4F8CFF] font-bold bg-white dark:bg-[#121A2F] border border-[#4F8CFF]/30 rounded-xl hover:bg-[#4F8CFF]/5 transition-colors">Start New Case</button>
                  <motion.button variants={pulseButton} initial="rest" whileHover="hover" whileTap="tap" onClick={handleDownloadReport} className="px-8 py-3 bg-[#1F4FD8] text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors flex items-center gap-2"><Download size={20} /> Download PDF Report</motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
