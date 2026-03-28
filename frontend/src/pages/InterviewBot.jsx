import { motion } from 'framer-motion';
import { Bot, Hammer } from 'lucide-react';

export default function InterviewBot() {
  const container = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <div className="min-h-screen bg-[#F2F0E9] px-6 flex items-center justify-center pb-32">
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="w-full max-w-2xl bg-[#111111] rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-white/5 text-center relative overflow-hidden group"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF4500] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Pulsing Icon Container */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#FF4500] rounded-2xl blur-xl opacity-20 animate-pulse" />
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md relative z-10">
              <Bot size={40} className="text-[#FF4500]" />
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
            <Hammer size={14} className="text-slate-400" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Under Construction</p>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            Neural Interviewer <br/>
            <span className="text-slate-500 font-light italic">Coming Soon.</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mt-4">
            The AI Mock Interview module is currently being calibrated. Soon, you will be able to run real-time, voice-activated technical interviews based on your specific target architecture.
          </p>
          
          <div className="mt-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-ping" />
            <span className="text-[9px] font-black text-[#FF4500] uppercase tracking-[0.2em]">Training Model Parameters</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}