import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Upload, ArrowRight, FileText, Target, Cpu, Activity, Database, Network, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeLab() {
  const { triggerUpload, hasData, isAnalyzing, analysisResults } = useApp();
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const navigate = useNavigate();

  const [loadingStep, setLoadingStep] = useState(0);

  // Terminal-style loading sequence
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isAnalyzing]);

  const loadingMessages = [
    "Establishing secure ingestion tunnel...",
    "Extracting semantic features and structural vectors...",
    "Querying target market architecture...",
    "Computing multidimensional alignment score..."
  ];

  const handleStart = () => {
    if (!role || !jd) return alert("Configuration Error: Target Role and JD are required for calibration.");
    triggerUpload(role, jd);
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-[#F2F0E9] pb-32">
      
      <AnimatePresence mode="wait">
        
        {/* =========================================
            PHASE 1: INGESTION CONFIGURATION
            ========================================= */}
        {!isAnalyzing && !hasData && (
          <motion.div key="ingest" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.98 }} className="pt-12 md:pt-20">
            <header className="mb-12">
              <motion.div variants={itemVariants} className="flex items-center gap-3 px-4 py-2 bg-white w-max rounded-full border border-slate-200 shadow-sm mb-6">
                <Database size={14} className="text-[#FF4500]" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Module // Resume Lab</p>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-light tracking-tighter text-[#111111] leading-[0.9]">
                Configure <br/><span className="font-black text-[#FF4500]">Telemetry.</span>
              </motion.h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Target Configuration */}
              <motion.div variants={itemVariants} className="col-span-1 lg:col-span-5 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#111111] mb-6 flex items-center gap-2">
                    <Target size={18} className="text-[#FF4500]" /> Target Architecture
                  </h3>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Designated Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Data Analyst" 
                    value={role} 
                    onChange={e=>setRole(e.target.value)} 
                    className="w-full p-0 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#111111] outline-none text-xl font-bold transition-colors placeholder:text-slate-300" 
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Job Description Parameters</label>
                  <textarea 
                    placeholder="Paste the target JD constraints here..." 
                    value={jd} 
                    onChange={e=>setJd(e.target.value)} 
                    className="w-full flex-1 min-h-[150px] p-5 bg-[#F9F8F6] rounded-2xl border border-slate-100 focus:border-[#FF4500] outline-none text-sm resize-none transition-all placeholder:text-slate-400" 
                  />
                </div>
              </motion.div>

              {/* Right Column: Drop Zone */}
              <motion.div variants={itemVariants} className="col-span-1 lg:col-span-7">
                <div 
                  onClick={handleStart} 
                  className="group relative w-full h-full min-h-[400px] bg-[#111111] rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden shadow-xl border border-white/5"
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-[#FF4500] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                      <Upload size={32} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter text-white mb-4">Mount Payload</h3>
                    <p className="text-sm font-medium text-white/60 max-w-sm mb-10 group-hover:text-white/90 transition-colors">
                      Drag and drop your PDF documentation here. The engine will parse and align your vectors automatically.
                    </p>
                    <button className="px-8 py-4 bg-white text-[#111111] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg group-hover:bg-[#111111] group-hover:text-white transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            PHASE 2: PROCESSING (TERMINAL UI)
            ========================================= */}
        {isAnalyzing && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} className="min-h-[70vh] flex flex-col items-center justify-center max-w-3xl mx-auto w-full pt-20">
            <div className="w-full bg-[#111111] rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
                <motion.div className="h-full bg-[#FF4500]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />
              </div>
              
              <div className="flex items-center gap-6 mb-12">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                  <Cpu size={40} className="text-[#FF4500]" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Neural Engine Active</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Processing Document</p>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs md:text-sm">
                {loadingMessages.map((msg, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: index <= loadingStep ? 1 : 0, x: index <= loadingStep ? 0 : -10 }}
                    className={`flex items-start gap-4 ${index === loadingStep ? 'text-[#FF4500]' : 'text-slate-500'}`}
                  >
                    <span>{index < loadingStep ? <CheckCircle2 size={16} className="text-emerald-500" /> : '>'}</span>
                    <span>{msg}</span>
                  </motion.div>
                ))}
                {loadingStep >= 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white pt-4 animate-pulse">
                    <span className="w-2 h-4 bg-[#FF4500] inline-block" /> Finalizing output...
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            PHASE 3: ENTERPRISE RESULTS
            ========================================= */}
        {hasData && !isAnalyzing && (
          <motion.div key="results" variants={containerVariants} initial="hidden" animate="show" className="pt-12 md:pt-20">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl font-light tracking-tighter text-[#111111]">
                  Analysis <span className="font-black italic">Complete.</span>
                </h1>
              </div>
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
                <FileText size={16} className="text-[#FF4500]" />
                <span className="text-xs font-bold text-[#111111]">{analysisResults?.fileName || 'resume_payload.pdf'}</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Massive Score Card */}
              <motion.div variants={itemVariants} className="col-span-1 lg:col-span-7 bg-[#111111] text-white p-12 rounded-[3rem] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-[#FF4500] rounded-full blur-[100px] opacity-20 pointer-events-none" />
                
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Calculated Alignment</p>
                  <h2 className="text-[8rem] md:text-[10rem] font-light leading-[0.8] tracking-tighter mb-4">
                    {analysisResults?.score || 0}<span className="text-5xl font-black text-[#FF4500]">%</span>
                  </h2>
                  <p className="text-xl font-bold text-white max-w-sm">
                    Target: <span className="text-slate-400 font-medium">{analysisResults?.role || role}</span>
                  </p>
                </div>
              </motion.div>

              {/* Data & Actions Panel */}
              <div className="col-span-1 lg:col-span-5 flex flex-col gap-8">
                
                <motion.div variants={itemVariants} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#111111] mb-8 flex items-center gap-3">
                    <Activity size={18} className="text-[#FF4500]" /> System Diagnostics
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <Network size={18} className="text-slate-400" />
                        <span className="text-xs font-bold text-[#111111]">Semantic Density</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">OPTIMAL</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <Database size={18} className="text-slate-400" />
                        <span className="text-xs font-bold text-[#111111]">Keyword Integrity</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">VERIFIED</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-rose-100">
                      <div className="flex items-center gap-4">
                        <AlertCircle size={18} className="text-rose-400" />
                        <span className="text-xs font-bold text-[#111111]">Architecture Gaps</span>
                      </div>
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">DETECTED</span>
                    </div>
                  </div>
                </motion.div>

                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/roadmap')} 
                  className="w-full py-8 bg-[#FF4500] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#111111] transition-all duration-300 flex items-center justify-center gap-4 group"
                >
                  Synthesize Hero Path
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}