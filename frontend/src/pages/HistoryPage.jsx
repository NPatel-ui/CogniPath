import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileStack, Calendar, ArrowRight, Activity, FlaskConical } from 'lucide-react';
// import { db, auth } from '../firebase'; // We will use this when we wire up the database

export default function HistoryPage() {
  const navigate = useNavigate();
  // State to hold history logs (Empty for now until we wire up Firebase saving)
  const [historyLogs, setHistoryLogs] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] px-6 md:px-12 lg:px-20 pt-24 pb-32">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="max-w-6xl mx-auto"
      >
        
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-1 bg-[#FF4500] rounded-full" />
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">User Dashboard</p>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              Analysis <span className="text-[#FF4500]">History.</span>
            </motion.h1>
          </div>

          {/* Professional Stats Overview */}
          <motion.div variants={itemVariants} className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Scans</p>
              <p className="text-2xl font-black text-[#111111]">{historyLogs.length}</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
                </span>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">System Online</p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Content Area */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-200 shadow-sm">
              <Activity className="text-[#FF4500] animate-spin mb-4" size={32} />
              <p className="text-slate-500 font-medium">Retrieving records...</p>
            </div>
          ) : historyLogs.length > 0 ? (
            /* List of Scans (Will populate when we add database saving) */
            <div className="grid gap-4">
              {historyLogs.map((log, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-[#FF4500]/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-[#FF4500]/5 transition-colors">
                      <FileStack className="text-slate-400 group-hover:text-[#FF4500] transition-colors" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111111] text-lg">{log.role}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <Calendar size={14} />
                        <span>{log.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Match Score</p>
                      <p className="font-black text-xl text-[#111111]">{log.score}%</p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#FF4500] group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Professional Empty State */
            <div className="w-full bg-white rounded-[2.5rem] p-12 md:p-20 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                <FileStack size={40} className="text-slate-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#111111] mb-3">No Analysis Records Found</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                Your archive is currently empty. Once you run a resume scan through the Neural Engine, your customized roadmaps and match scores will be securely stored here.
              </p>
              <button 
                onClick={() => navigate('/resume-lab')}
                className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[#FF4500] transition-colors shadow-lg hover:shadow-orange-500/25"
              >
                <FlaskConical size={20} />
                <span>Go to Resume Lab</span>
              </button>
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
