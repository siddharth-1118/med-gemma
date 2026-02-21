import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';

// --- MODULAR COMPONENT IMPORTS ---
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import NotificationsDrawer from './components/NotificationsDrawer';
import EmergencyAlertModal from './components/EmergencyAlertModal';
import AddPatientWizard from './components/AddPatientWizard';

// --- MODULAR VIEW IMPORTS ---
import DashboardView from './views/DashboardView';
import RegistryView from './views/RegistryView';
import DiagnosticsView from './views/DiagnosticsView';
import SpecialistHubView from './views/SpecialistHubView';
import AnalyticsView from './views/AnalyticsView';
import AppointmentsView from './views/AppointmentsView';
import SettingsView from './views/SettingsView';
import SecurityView from './views/SecurityView';

// --- STITCH2 COMPONENT IMPORTS ---
import CinematicSplash from './components/CinematicSplash';
import SecureUnlock from './components/SecureUnlock';

function App() {  
  // --- FLOW STATE ---
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // --- GLOBAL STATE ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState('dashboard'); 
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState('analysis');
  const [contrast, setContrast] = useState(100);
  const [loadingSubStep, setLoadingSubStep] = useState(1);
  const [aiStatus, setAiStatus] = useState('checking'); 
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Male',
    chiefComplaint: '',
    clinicalNotes: ''
  });

  // --- CORE EFFECTS ---
  useEffect(() => {
    const checkAiHealth = async () => {
      const API_URL = import.meta.env.VITE_AI_SERVICE_URL || '';
      if (!API_URL || !API_URL.includes('ngrok')) {
        setAiStatus('offline');
        return;
      }
      try {
        const resp = await fetch(`${API_URL}/test`, { 
          headers: { 'ngrok-skip-browser-warning': 'true' },
          signal: AbortSignal.timeout(8000), 
          mode: 'cors'
        });
        if (resp.ok) {
           setAiStatus('online');
        } else {
           const data = await resp.json().catch(() => ({}));
           setAiStatus(data.status ? 'online' : 'offline');
        }
      } catch {
        setAiStatus('offline');
      }
    };
    checkAiHealth();
    const interval = setInterval(checkAiHealth, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // --- CORE LOGIC ---
  const processFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => { 
    e.preventDefault(); 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]); 
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const runAnalysis = async () => {
    if (!file) {
      const input = document.getElementById('fileUpload');
      if (input) input.click();
      return;
    }
    setLoading(true);
    setLoadingSubStep(1);
    setStep(2);
    try {
      setTimeout(() => setLoadingSubStep(2), 2000);
      setTimeout(() => setLoadingSubStep(3), 4500);
      const clinicalPrompt = `Patient: ${formData.age} ${formData.sex}. Notes: ${formData.clinicalNotes}.`;
      const data = new FormData();
      data.append('image', file);
      data.append('prompt', clinicalPrompt);
      data.append('caseId', 'custom');
      const API_URL = import.meta.env.VITE_AI_SERVICE_URL || '';
      const endpoint = API_URL.includes('ngrok') ? `${API_URL}/analyze` : `/analyze`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: data,
      });
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const resData = await response.json();
      setResult(resData);
      setStep(3);
    } catch (err) {
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cleanFindings = (text) => {
    if (!text || typeof text !== 'string') return text;
    let s = text.replace(/```json/g, '').replace(/```/g, '').replace(/<---[\s\S]*?--->/gi, '').replace(/<unused\d+>/gi, '').trim();
    const jsonMatch = s.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0].trim());
        if (parsed.image_findings) return cleanFindings(parsed.image_findings);
      } catch { 
        // Silent catch for invalid JSON
      }
    }
    return s.replace(/\{?\s*"image_type":\s*"[^"]*",?/gi, '')
           .replace(/"image_findings":\s*"/gi, '')
           .replace(/"attention_regions":\s*\[.*\]/gi, '')
           .replace(/"confidence":\s*"[^"]*",?/gi, '')
           .replace(/[{}"]/g, '')
           .substring(0, 500).trim();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 flex transition-colors duration-500 relative overflow-hidden">
      <AnimatePresence>
        {isSplashActive && (
          <CinematicSplash key="cinematic-splash" onComplete={() => {
            setIsSplashActive(false);
            setIsLocked(true);
          }} />
        )}
        
        {isLocked && !isSplashActive && (
          <SecureUnlock key="secure-unlock" onUnlock={() => setIsLocked(false)} />
        )}
      </AnimatePresence>

      {!isSplashActive && !isLocked && (
        <>
          <Sidebar 
            view={view} 
            setView={setView} 
            aiStatus={aiStatus} 
            setStep={setStep} 
            setFile={setFile} 
            setPreview={setPreview} 
            setResult={setResult} 
          />
          
          <div className="flex-1 flex flex-col relative overflow-hidden h-screen">
            <Header aiStatus={aiStatus} />
            
            {/* Desktop Utility Header */}
            <div className="hidden lg:flex absolute top-8 right-8 z-[50] items-center gap-6">
               <button 
                 onClick={() => setShowNotifications(true)}
                 className="relative p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all group backdrop-blur-md"
               >
                  <FileText size={20} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-glow-blue animate-pulse" />
               </button>
               <button 
                 onClick={() => setShowEmergencyAlert(true)}
                 className="px-6 py-3 bg-red-600/10 border border-red-500/30 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all backdrop-blur-md"
               >
                  System Alert
               </button>
            </div>
            
            <main className="flex-1 flex flex-col relative overflow-hidden">
              <AnimatePresence mode="wait">
                {view === 'dashboard' && <DashboardView key="dashboard" aiStatus={aiStatus} />}
                {view === 'registry' && <RegistryView key="registry" onSelectPatient={setSelectedPatient} selectedPatient={selectedPatient} onAddPatient={() => setShowAddPatient(true)} />}
                {view === 'diagnostics' && (
                  <DiagnosticsView 
                    key="diagnostics"
                    step={step}
                    setStep={setStep}
                    file={file}
                    setFile={setFile}
                    preview={preview}
                    setPreview={setPreview}
                    loading={loading}
                    runAnalysis={runAnalysis}
                    formData={formData}
                    setFormData={setFormData}
                    result={result}
                    zoom={zoom}
                    setZoom={setZoom}
                    contrast={contrast}
                    setContrast={setContrast}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    loadingSubStep={loadingSubStep}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleFileChange={handleFileChange}
                    cleanFindings={cleanFindings}
                  />
                )}
                {view === 'specialist' && <SpecialistHubView key="specialist" />}
                {view === 'trends' && <AnalyticsView key="trends" />}
                {view === 'appointments' && <AppointmentsView key="appointments" />}
                {view === 'settings' && <SettingsView key="settings" aiStatus={aiStatus} />}
                {view === 'security' && <SecurityView key="security" />}
              </AnimatePresence>
            </main>
            
            <div className="lg:hidden">
              <BottomNav 
                step={step} 
                runAnalysis={runAnalysis} 
                setStep={setStep} 
                setFile={setFile} 
                setPreview={setPreview} 
                setResult={setResult} 
                setView={setView} 
                setActiveTab={setActiveTab} 
              />
            </div>
          </div>
        </>
      )}

      <NotificationsDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <EmergencyAlertModal isOpen={showEmergencyAlert} onClose={() => setShowEmergencyAlert(false)} />
      <AddPatientWizard isOpen={showAddPatient} onClose={() => setShowAddPatient(false)} />
    </div>
  );
}

export default App;
