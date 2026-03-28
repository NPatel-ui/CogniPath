import { useApp } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Zap, Target, Cpu, ShieldCheck, Activity, Globe, ArrowUpRight, AlertCircle } from 'lucide-react';

export default function NeuralFingerprint() {
  const { analysisResults } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Grab data from either the Router state or the Global Context
  const dataPayload = location.state?.analysisData || analysisResults;

  // 🛑 AUTOMATIC REDIRECT REMOVED 🛑
  // 2. If data is missing, show an error screen INSTEAD of forcing a redirect
  if (!dataPayload || !dataPayload.fingerprint) {
    return (
      <div className="min-h-screen bg-[#F2F0E9] flex flex-col items-center justify-center p-6 text-center pt-20 pb-32">
         <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-rose-100">
            <AlertCircle size={40} className="text-rose-500" />
         </div>
         <h1 className="text-3xl md:text-4xl font-black text-[#111111] mb-4 tracking-tight">Data Stream Lost.</h1>
         <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
            The neural engine output was dropped during transit. Please initialize a new scan.
         </p>
         <button 
            onClick={() => navigate('/resume-lab')} 
            className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold hover:bg-[#FF4500] transition-colors shadow-lg"
         >
            Return to Resume Lab
         </button>
      </div>
    );
  }

  // 3. Process the data for the radar chart
  const chartData = dataPayload.fingerprint.map(item => ({
    ...item, Benchmark: 85
  }));

  const icons = [<Zap size={16}/>, <Target size={16}/>, <Activity size={16}/>, <Cpu size={16}/>, <Globe size={16}/>, <ShieldCheck size={16}/>];

  return (
    <div className="min-h-screen bg-[#F2F0E9] p-6 md:p-12 lg:p-20 flex flex-col font-sans pt-24 pb-32">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
        <div>
          <p className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.4em] mb-2">System Scan // {dataPayload.role}</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-[#111111]">
            Neural <span className="font-black italic">Fingerprint.</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right border-r border-slate-200 pr-6">
            <span className="text-4xl md:text-5xl font-black block leading-none">{dataPayload.score}%</span>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Alignment Score</p>
          </div>
          <button className="bg-[#111111] text-white p-4 rounded-2xl shadow-lg hover:bg-[#FF4500] transition-colors">
            <ArrowUpRight size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Core */}
        <motion.div className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-white relative min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
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
          {chartData.map((item, i) => (
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
