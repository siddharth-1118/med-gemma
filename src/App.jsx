import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Layout, Zap, Upload, Aperture } from 'lucide-react';
import ImageViewer from './components/ImageViewer';
import PatientNote from './components/PatientNote';
import AnalysisPanel from './components/AnalysisPanel';
import { DEMO_CASES } from './data/mockData';

function App() {
  const [activeCaseId, setActiveCaseId] = useState('case1');
  const [customImage, setCustomImage] = useState(null);
  const [customFile, setCustomFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const activeCase = DEMO_CASES[activeCaseId];
  const displayImage = customImage || activeCase.image;

  useEffect(() => {
    if (!customImage) {
      setAnalysis(null);
      setScanning(false);
    }
  }, [activeCaseId]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCustomFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
        setAnalysis(null);
        setActiveCaseId('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (scanning || analysis) return;
    setScanning(true);

    try {
      const formData = new FormData();
      if (customFile) {
        formData.append('image', customFile);
        formData.append('caseId', 'custom');
      } else {
        formData.append('caseId', activeCaseId);
      }

      const response = await fetch(`http://${window.location.hostname}:3000/api/analyze`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Analysis failed');
      const result = await response.json();
      setAnalysis(result);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />

      {/* Floating Header */}
      <header className="clinical-header">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white p-2 rounded-xl">
            <Aperture size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">MedGemma</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Spatial Intelligence</span>
          </div>
        </div>

        <nav className="flex bg-slate-100/50 p-1 rounded-full backdrop-blur-md">
          <button
            onClick={() => { setCustomImage(null); setActiveCaseId('case1'); }}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeCaseId === 'case1' ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pneumonia
          </button>
          <button
            onClick={() => { setCustomImage(null); setActiveCaseId('case2'); }}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeCaseId === 'case2' ? 'bg-white shadow text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Inconsistency
          </button>
        </nav>

        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current.click()} className="btn btn-ghost text-xs">
            <Upload size={16} /> Upload
          </button>
          <button
            onClick={handleAnalyze}
            disabled={scanning || !!analysis}
            className={`btn btn-primary ${scanning ? 'opacity-80' : ''}`}
          >
            {scanning ? (
              <><Zap size={16} className="animate-spin" /> Processing</>
            ) : analysis ? (
              <><Sparkles size={16} /> Analysis Done</>
            ) : (
              <><Play size={16} fill="white" /> Analyze</>
            )}
          </button>
        </div>
      </header>

      {/* Floating Application Window */}
      <main className="main-workspace">
        {/* Left: Image Canvas */}
        <div className="glass-panel overflow-hidden relative">
          <ImageViewer imageUrl={displayImage} scanning={scanning} />
          {/* Floating Tag */}
          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-xs font-bold text-slate-700">
            {customImage ? 'External Source' : activeCase.title}
          </div>
        </div>

        {/* Right: Intelligence Stack */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel flex-1 overflow-hidden p-1 bg-white/40">
            <PatientNote data={customImage ? { ...activeCase.patient, notes: "External image loaded." } : activeCase.patient} />
          </div>
          <div className="glass-panel flex-1 overflow-hidden bg-white/60 relative">
            {analysis ? (
              <AnalysisPanel analysis={analysis} loading={scanning} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Layout size={40} className="mb-4 text-slate-300" />
                <p className="font-medium">Ready for Spatial Analysis</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
