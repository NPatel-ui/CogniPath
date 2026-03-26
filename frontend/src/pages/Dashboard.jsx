import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, BrainCircuit, Activity, Target, FileText, Sparkles, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { hasData, user, analysisResults } = useApp();
  const navigate = useNavigate();
  const readinessScore = analysisResults?.score || 0; 
  const targetRole = analysisResults?.role || "Pending Target";

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen bg-[#F2F0E9] px-6 md:px-12 lg:px-20 pb-32">
      <header className="py-12 md:py-20 max-w-7xl mx-auto">
        <motion.div variants={item}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter text-[#111111] leading-[0.9]">
            Welcome back, <br/>
            <span className="font-black text-[#FF4500]">{user?.name || 'Architect'}.</span>
          </h1>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!hasData ? (
            <motion.div key="empty" variants={item} className="relative bg-[#111111] text-white p-8 md:p-16 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                <div className="max-w-2xl">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/10 backdrop-blur-md">
                    <BrainCircuit className="text-[#FF4500]" size={28} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">System Awaiting <br/>Profile Telemetry.</h2>
                  <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed mb-8">
                    The neural engine requires your baseline data. Upload your documentation to generate a market alignment vector.
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/resume-lab')} 
                  className="group w-full lg:w-auto px-10 py-6 bg-[#FF4500] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all"
                >
                  Initialize Scan <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Score Card */}
              <motion.div variants={item} className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.3em] mb-2">Market Alignment</p>
                      <h2 className="text-6xl md:text-[8rem] font-black text-[#111111] leading-none tracking-tighter">
                        {readinessScore}<span className="text-3xl md:text-4xl text-slate-300">%</span>
                      </h2>
                    </div>
                    <div className="p-3 md:p-4 bg-slate-50 rounded-2xl">
                      <Activity size={24} className="text-[#111111]" />
                    </div>
                 </div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${readinessScore}%` }} className="h-full bg-[#FF4500]" />
                 </div>
              </motion.div>

              {/* Action Sidebar */}
              <motion.div variants={item} className="lg:col-span-4 bg-[#111111] p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-white flex flex-col justify-between">
                <div>
                  <Target size={32} className="text-[#FF4500] mb-6" />
                  <h3 className="text-2xl font-black tracking-tighter mb-4">Strategic Action Required</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">Detected variance against <span className="text-white font-bold">{targetRole}</span> benchmark.</p>
                </div>
                <button onClick={() => navigate('/roadmap')} className="w-full py-5 bg-white text-[#111111] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF4500] hover:text-white transition-colors">
                  Optimization Path
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
