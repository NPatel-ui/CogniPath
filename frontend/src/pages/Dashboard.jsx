import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, BrainCircuit, Activity, Target, FileText, Sparkles, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { hasData, user, analysisResults } = useApp();
  const navigate = useNavigate();
  const readinessScore = analysisResults?.score || 0; 
  const targetRole = analysisResults?.role || "Pending Target";

  // Staggered entry animations for a smooth "System Boot" feel
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 100 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="pb-32 bg-[#F2F0E9] min-h-screen">
      
      {/* 1. CLEAN PROFESSIONAL HEADER */}
      <header className="py-12 md:py-20 relative">
        <motion.div variants={item} className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-[#111111] leading-[0.9]">
            Welcome back, <br/>
            <span className="font-black text-[#FF4500]">{user?.name || 'Architect'}.</span>
          </h1>
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {!hasData ? (
          /* 2. PREMIUM EMPTY STATE: The "Awaiting Telemetry" Card */
          <motion.div 
            key="empty" 
            variants={item}
            className="relative bg-[#111111] text-white p-10 md:p-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
          >
            {/* Subtle Abstract Background */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-[#FF4500] rounded-full blur-[120px] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
              <div className="max-w-2xl">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md">
                  <BrainCircuit className="text-[#FF4500]" size={28} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">System Awaiting <br/>Profile Telemetry.</h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
                  The neural engine requires your baseline data. Upload your professional documentation to generate a multidimensional market alignment vector.
                </p>
                <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Network size={14} /> AES-256 Encrypted</span>
                  <span className="flex items-center gap-2"><Sparkles size={14} /> AI-Powered Analysis</span>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/resume-lab')} 
                className="group w-full lg:w-auto px-10 py-6 bg-[#FF4500] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl hover:bg-white hover:text-[#111111] transition-all duration-300"
              >
                Initialize Scan
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* 3. ENTERPRISE DASHBOARD: The Active Telemetry Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PRIMARY SCORE CARD */}
            <motion.div variants={item} className="col-span-1 lg:col-span-8 bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
               <div className="flex justify-between items-start mb-8">
                 <div>
                    <p className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.3em] mb-2">Market Alignment Score</p>
                    <h2 className="text-7xl md:text-[8rem] font-black text-[#111111] leading-none tracking-tighter">
                      {readinessScore}<span className="text-4xl text-slate-300">%</span>
                    </h2>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                   <Activity size={28} className="text-[#111111]" />
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">
                   <span>Baseline</span>
                   <span>Optimized</span>
                 </div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: `${readinessScore}%` }} 
                     transition={{ duration: 1.2, ease: "easeOut" }} 
                     className="h-full bg-[#FF4500]" 
                   />
                 </div>
               </div>
            </motion.div>

            {/* ACTIONABLE INSIGHT SIDEBAR */}
            <motion.div variants={item} className="col-span-1 lg:col-span-4 bg-[#111111] p-10 md:p-12 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl">
              <div>
                <Target size={32} className="text-[#FF4500] mb-6" />
                <h3 className="text-2xl font-black tracking-tighter mb-4">Strategic Action Required</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  The model has detected a variance in your current profile against the <span className="text-white font-bold">{targetRole}</span> benchmark. 
                </p>
              </div>
              <button onClick={() => navigate('/roadmap')} className="w-full py-5 bg-white text-[#111111] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF4500] hover:text-white transition-colors">
                View Optimization Path
              </button>
            </motion.div>

            {/* RECENT SCANS / DOCUMENTS PANEL */}
            <motion.div variants={item} className="col-span-12 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 mt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
                <h3 className="text-lg font-black tracking-tight text-[#111111]">Processed Documents</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Activity</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dynamic Document Card 1 */}
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#FF4500]">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#111111]">{analysisResults?.fileName || 'resume_v3_final.pdf'}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Target: {targetRole}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">Analyzed</span>
                </div>

                {/* Placeholder Document Card 2 */}
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#111111]">portfolio_export.pdf</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Target: Software Engineer</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">Archived</span>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}