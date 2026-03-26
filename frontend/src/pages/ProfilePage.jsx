import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Camera, Shield, GraduationCap, Key, LogOut, CheckCircle2, User as UserIcon } from 'lucide-react';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "Nitya Patel",
    education: "BSc IT",
    college: "RTMNU Institute",
    semester: "Semester IV",
    cgpa: "9.23",
    specialization: "AI & Machine Learning",
    email: user?.email || "patelnitya351@gmail.com"
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Failed to terminate session:", error);
    }
  };

  const handleSync = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Encrypting and syncing parameters...',
        success: 'Telemetry Synchronized Successfully.',
        error: 'Sync Failed. Retrying...',
      }
    );
  };

  // Responsive UI Classes
  const inputClass = "w-full p-4 bg-[#F9F8F6] border border-slate-100 rounded-2xl focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/10 outline-none transition-all text-sm font-bold text-[#111111] placeholder:text-slate-400";
  const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1";

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      /* Fluid padding: px-6 on mobile, px-12 on tablet, px-20 on desktop */
      className="pb-32 bg-[#F2F0E9] min-h-screen px-6 md:px-12 lg:px-20"
    >
      
      {/* 1. PROFESSIONAL HEADER */}
      <header className="py-10 md:py-20 max-w-7xl mx-auto">
        <motion.div variants={item} className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <Shield size={14} className="text-emerald-500" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Clearance: Verified</p>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tighter text-[#111111] leading-[0.9]">
            Identity <br/>
            <span className="font-black text-[#FF4500]">Parameters.</span>
          </h1>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. THE DIGITAL ID BADGE (Stacks on top for mobile) */}
        <motion.div variants={item} className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#111111] p-8 sm:p-10 md:p-12 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4500] rounded-full blur-[100px] opacity-20 pointer-events-none" />
            
            <div className="relative cursor-pointer mb-8 z-10" onClick={() => fileInputRef.current.click()}>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center font-black text-4xl border border-white/10 group-hover:border-[#FF4500]/50 transition-all duration-500 overflow-hidden shadow-2xl">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-300">{user?.initials || 'NP'}</span>
                )}
                <div className="absolute inset-0 bg-[#111111]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Camera size={24} className="text-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Update</span>
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="z-10 w-full flex flex-col items-center">
              <h2 className="text-2xl font-black tracking-tight mb-1">{formData.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">{formData.email}</p>
              
              <div className="w-full pt-8 border-t border-white/10 space-y-4 text-left">
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Node</span>
                   <span className="text-xs font-bold text-white">Nagpur</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Vector</span>
                   <span className="text-sm font-black text-[#FF4500]">{formData.cgpa} <span className="text-[10px] text-slate-400 ml-1">CGPA</span></span>
                 </div>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-3">
            <LogOut size={16} /> Terminate Session
          </button>
        </motion.div>

        {/* 3. CONFIGURATION MODULES */}
        <motion.div variants={item} className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Module A: Academic Signature */}
          <div className="bg-white p-8 sm:p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#111111]">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter text-[#111111]">Academic Signature</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Data</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Primary Identity</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="name" value={formData.name} onChange={handleChange} className={`${inputClass} pl-12`} />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Program</label>
                <input name="education" value={formData.education} onChange={handleChange} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Specialization</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass} />
              </div>
              
              <div className="md:col-span-2">
                <label className={labelClass}>Host Institution</label>
                <input name="college" value={formData.college} onChange={handleChange} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Semester</label>
                <input name="semester" value={formData.semester} onChange={handleChange} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>Verified CGPA</label>
                <div className="relative">
                  <input name="cgpa" value={formData.cgpa} onChange={handleChange} className={inputClass} />
                  <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Module B: Security Protocol */}
          <div className="bg-[#111111] p-8 sm:p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5">
                  <Key size={20} className="text-[#FF4500]" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter text-white">Security Protocol</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Access Management</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Key</label>
                  <input type="password" placeholder="••••••••" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#FF4500] outline-none text-sm font-bold text-white placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Key</label>
                  <input type="password" placeholder="••••••••" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#FF4500] outline-none text-sm font-bold text-white placeholder:text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          <motion.button 
  onClick={handleSync} // This triggers the toast.promise
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className="w-full bg-[#FF4500] text-white py-6 md:py-8 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#111111] transition-all flex items-center justify-center gap-4 group"
>
  Synchronize Parameters 
  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#111111] transition-colors shrink-0">
    <CheckCircle2 size={16} />
  </span>
</motion.button>
          
        </motion.div>
      </div>
    </motion.div>
  );
}
