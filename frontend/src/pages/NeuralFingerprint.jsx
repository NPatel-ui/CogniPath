import { useApp } from '../context/AppContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
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

  const data = analysisResults.fingerprint.map(item => ({
    ...item, Benchmark: 85
  }));

  const icons = [<Zap size={16}/>, <Target size={16}/>, <Activity size={16}/>, <Cpu size={16}/>, <Globe size={16}/>, <ShieldCheck size={16}/>];

  return (
    <div className="min-h-screen bg-[#F2F0E9] p-6 md:p-12 lg:p-20 flex flex-col font-sans">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
        <div>
          <p className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.4em] mb-2">System Scan // {analysisResults.role}</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-[#111111]">
            Neural <span className="font-black italic">Fingerprint.</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right border-r border-slate-200 pr-6">
            <span className="text-4xl md:text-5xl font-black block leading-none">{analysisResults.score}%</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Alignment Score</p>
          </div>
          <button className="bg-[#111111] text-white p-4 rounded-2xl shadow-lg hover:bg-[#FF4500] transition-colors">
            <ArrowUpRight size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Core - Fixed height on mobile for better chart visibility */}
        <motion.div className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-white relative min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#111111', fontSize: 10, fontWeight: 900 }} />
              <Radar name="Industry" dataKey="Benchmark" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.2} />
              <Radar name="User" dataKey="A" stroke="#FF4500" strokeWidth={3} fill="#FF4500" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weights Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {data.map((item, i) => (
            <motion.div key={item.subject} className="flex items-center justify-between p-4 bg-white/60 hover:bg-[#111111] rounded-2xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white shadow-sm rounded-xl text-[#FF4500] group-hover:bg-[#FF4500] group-hover:text-white transition-colors">{icons[i]}</div>
                <div>
                  <span className="font-bold text-xs group-hover:text-white transition-colors">{item.subject}</span>
                  <div className="w-20 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div style={{ width: `${item.A}%` }} className="h-full bg-[#FF4500]" />
                  </div>
                </div>
              </div>
              <span className="font-black text-xl group-hover:text-white">{Number(item.A).toFixed(0)}%</span>
            </motion.div>
          ))}
          <button className="mt-4 py-5 bg-[#FF4500] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
            Download Profile
          </button>
        </div>
      </div>
    </div>
  );
}
