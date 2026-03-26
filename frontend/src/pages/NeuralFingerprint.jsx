import { useApp } from '../context/AppContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Zap, Target, Cpu, ShieldCheck, Activity, Globe, ArrowUpRight } from 'lucide-react';

export default function NeuralFingerprint() {
  const { analysisResults } = useApp();

  if (!analysisResults) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F2F0E9]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Cpu size={40} className="text-[#FF4500]" />
        </motion.div>
      </div>
    );
  }

  // Adding a 'Benchmark' column to your data for the Shadow Profile effect
  const data = analysisResults.fingerprint.map(item => ({
    ...item,
    Benchmark: item.subject === 'Target Fit' ? 95 : 80 // Simulation of industry standard
  }));

  const icons = [<Zap size={16}/>, <Target size={16}/>, <Activity size={16}/>, <Cpu size={16}/>, <Globe size={16}/>, <ShieldCheck size={16}/>];

  return (
    <div className="h-screen bg-[#F2F0E9] p-4 lg:p-8 flex flex-col overflow-hidden font-sans">
      
      {/* 1. COMPACT HEADER */}
      <header className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <p className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.4em] mb-1">
            System Scan // {analysisResults.role}
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-[#111111]">
            Neural <span className="font-black italic">Fingerprint.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right border-r border-slate-200 pr-6">
            <span className="text-4xl font-black block leading-none">{analysisResults.score}%</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alignment</p>
          </div>
          <button className="bg-[#111111] text-white p-4 rounded-2xl hover:bg-[#FF4500] transition-colors shadow-lg">
            <ArrowUpRight size={20} />
          </button>
        </div>
      </header>

      {/* 2. MAIN BENTO GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT: THE RADAR CORE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 shadow-sm border border-white flex flex-col relative"
        >
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Biometric Core</h3>
          </div>

          <div className="flex-1 min-h-0 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#111111', fontSize: 10, fontWeight: 900 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                
                {/* Benchmark Shadow Area */}
                <Radar name="Industry Standard" dataKey="Benchmark" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.2} />
                
                {/* User Data Area */}
                <Radar
                  name="Nitya Patel"
                  dataKey="A"
                  stroke="#FF4500"
                  strokeWidth={3}
                  fill="#FF4500"
                  fillOpacity={0.5}
                />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 900 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RIGHT: FEATURE WEIGHTS (Scrollable internally if needed) */}
        <div className="lg:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2 no-scrollbar">
          {data.map((item, i) => (
            <motion.div 
              key={item.subject}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center justify-between p-4 bg-white/60 hover:bg-[#111111] rounded-2xl border border-white transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white shadow-sm rounded-xl text-[#FF4500] group-hover:bg-[#FF4500] group-hover:text-white transition-colors">
                  {icons[i]}
                </div>
                <div>
                  <span className="font-bold text-xs tracking-tight text-[#111111] group-hover:text-white">{item.subject}</span>
                  <div className="w-24 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.A}%` }}
                      className="h-full bg-[#FF4500]"
                    />
                  </div>
                </div>
              </div>
              <span className="font-black text-xl tracking-tighter text-[#111111] group-hover:text-white">
                {Number(item.A).toFixed(1)}%
              </span>
            </motion.div>
          ))}
          
          <motion.button 
            whileHover={{ scale: 1.01 }}
            className="mt-auto py-5 bg-[#FF4500] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#FF4500]/10 shrink-0"
          >
            Download Neural Profile
          </motion.button>
        </div>
      </div>
    </div>
  );
}