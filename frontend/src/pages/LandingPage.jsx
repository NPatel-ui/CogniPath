import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Network, Cpu } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F0E9] font-sans text-[#111111] selection:bg-[#FF4500] selection:text-white overflow-hidden flex flex-col">
      
      {/* Responsive Navigation */}
      <nav className="w-full p-4 md:p-8 flex justify-between items-center max-w-[1600px] mx-auto z-50 relative">
        <div className="text-xl md:text-2xl font-black tracking-tighter uppercase">
          Cogni<span className="text-[#FF4500]">Path</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => navigate('/auth')} className="hidden md:block text-xs font-black text-slate-400 hover:text-[#111111] uppercase tracking-[0.2em] transition-colors">
            System Documentation
          </button>
          <button onClick={() => navigate('/auth')} className="bg-[#111111] text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-[#FF4500] hover:-translate-y-1 transition-all duration-300">
            Access Engine
          </button>
        </div>
      </nav>

      {/* Responsive Editorial Hero Section */}
      <main className="flex-1 max-w-[1600px] mx-auto px-4 md:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 py-8 md:py-12 relative z-10">
        
        <div className="flex-1 w-full mt-4 md:mt-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-[9px] md:text-[10px] font-black text-[#FF4500] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <span className="w-6 md:w-8 h-0.5 bg-[#FF4500]"></span> Neural Architecture
            </p>
            {/* Scaling Typography: 5xl -> 7xl -> 10rem */}
            <h1 className="text-6xl sm:text-7xl lg:text-[10rem] font-light leading-[0.9] tracking-tighter text-[#111111] mb-8 md:mb-12">
              Career <br />
              <span className="font-black">Engineered.</span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
            <p className="text-base md:text-xl font-medium text-slate-500 max-w-md leading-relaxed mb-8 md:mb-12">
              The intelligence layer for your professional trajectory. Upload your academic vectors and let our models map your future to Tier-1 industry roles.
            </p>
            {/* Full width button on mobile, fit-content on desktop */}
            <button onClick={() => navigate('/auth')} className="w-full sm:w-fit bg-[#FF4500] text-white pl-6 md:pl-10 pr-2 md:pr-4 py-3 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:bg-[#111111] transition-colors flex items-center justify-between sm:justify-start gap-4 md:gap-6 group">
              Initialize Sequence
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-[#FF4500] rounded-full flex items-center justify-center group-hover:bg-[#FF4500] group-hover:text-white transition-colors shrink-0">
                <ArrowRight size={18} className="md:w-5 md:h-5" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* Abstract Kinetic Art - Hidden on small mobile, visible on tablet/desktop */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 w-full relative hidden md:flex justify-center lg:justify-end mt-12 lg:mt-0"
        >
          <div className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-[#111111] rounded-full relative overflow-hidden flex items-center justify-center group shrink-0">
            <div className="absolute inset-0 bg-[#FF4500] translate-y-[60%] group-hover:translate-y-[40%] transition-transform duration-700 ease-in-out rounded-t-[100%]"></div>
            <h2 className="relative z-10 text-[10rem] lg:text-[18rem] font-black text-[#F2F0E9] leading-none tracking-tighter mix-blend-difference selection:bg-transparent">
              AI.
            </h2>
            
            <div className="absolute top-10 lg:top-20 left-4 lg:left-10 bg-[#F2F0E9] text-[#111111] px-4 lg:px-6 py-2 lg:py-3 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
              <Database size={12} className="text-[#FF4500] lg:w-3.5 lg:h-3.5" /> 1M+ Vectors
            </div>
            <div className="absolute bottom-20 lg:bottom-32 right-4 lg:right-10 bg-[#FF4500] text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full text-[10px] lg:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
              <Network size={12} className="lg:w-3.5 lg:h-3.5" /> Live Sync
            </div>
          </div>
        </motion.div>
      </main>

      {/* Responsive Running Marquee */}
      <div className="w-full bg-[#111111] text-[#F2F0E9] py-3 md:py-4 border-t border-white/10 overflow-hidden flex whitespace-nowrap relative z-20 mt-12 md:mt-0">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex gap-8 md:gap-16 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] items-center"
        >
          {Array(10).fill("").map((_, i) => (
            <span key={i} className="flex items-center gap-8 md:gap-16">
              <span>Predictive Modeling</span>
              <Cpu size={12} className="text-[#FF4500] md:w-3.5 md:h-3.5" />
              <span>Vector Mapping</span>
              <Cpu size={12} className="text-[#FF4500] md:w-3.5 md:h-3.5" />
              <span>Neural Readiness</span>
              <Cpu size={12} className="text-[#FF4500] md:w-3.5 md:h-3.5" />
            </span>
          ))}
        </motion.div>
      </div>

    </div>
  );
}