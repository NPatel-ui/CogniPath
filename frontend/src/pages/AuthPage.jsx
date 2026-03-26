import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Camera, Fingerprint, Sparkles, ShieldCheck, Network } from 'lucide-react';
import { auth } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '', college: '', age: '', passingYear: '', 
    currentSemester: '', education: '', specialization: '', 
    email: '', password: '', confirmPassword: ''
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

  const isCurrentStudent = parseInt(formData.passingYear) >= 2026;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_BASE = "http://127.0.0.1:8000";

    // ⬅️ Trigger a loading toast that we can resolve later
    const loadingToast = toast.loading("Establishing secure connection...");

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast.dismiss(loadingToast);
          return toast.error("Security Keys do not match.");
        }
        
        const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(userCred.user);
        
        const response = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error("Neural Engine Sync Failed.");
        
        toast.success("Identity Created. Check email for verification.", { id: loadingToast });
        
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        // ... your fetch login code ...
        
        toast.success("Authentication Successful.", { id: loadingToast });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error(error.message, { id: loadingToast });
    }
  };

  // 3. Update the Google Sign In
  const handleGoogleSignIn = async () => {
    const loadingToast = toast.loading("Routing through Google Node...");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Google Node Connected.", { id: loadingToast });
      navigate('/dashboard');
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error(error.message, { id: loadingToast });
    }
  };

  // Inputs have a semi-transparent white background to look premium over the glass card on mobile
  const inputClass = "w-full p-3 lg:p-4 bg-white/80 lg:bg-white border border-slate-200 lg:border-slate-200/50 rounded-2xl focus:border-[#FF4500] focus:bg-white focus:ring-4 focus:ring-[#FF4500]/10 outline-none transition-all text-sm font-bold text-[#111111] placeholder:text-slate-400 shadow-sm";
  const labelClass = "block text-[9px] font-black text-[#111111] lg:text-slate-500 uppercase tracking-widest mb-1.5 ml-1";

  return (
    // 100dvh + overflow-hidden locks the screen completely so the browser itself cannot scroll
    <div className="h-[100dvh] w-full bg-[#F2F0E9] flex relative overflow-hidden font-sans selection:bg-[#111111] selection:text-white">
      
      {/* 1. BRAND PANEL (Absolute Background on Mobile, Left Panel on Desktop) */}
      <div className="absolute inset-0 lg:relative lg:w-[45%] bg-[#FF4500] p-8 sm:p-12 xl:p-24 flex flex-col justify-between overflow-hidden text-white shrink-0 z-0">
        
        {/* Background Effects */}
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-white rounded-full blur-[120px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 text-[10rem] lg:text-[15rem] font-black opacity-[0.03] pointer-events-none leading-none -mb-10 -mr-10">AI.</div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <Network size={18} className="text-white" />
          </div>
          <span className="text-xs lg:text-sm font-black tracking-[0.3em] uppercase">CogniPath</span>
        </div>

        {/* Hidden on mobile to save space for the glass form, visible on Desktop */}
        <div className="relative z-10 my-auto hidden lg:block">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-5xl xl:text-7xl font-light leading-[0.9] tracking-tighter mb-6">
              Architect <br/><span className="font-black text-white">Your Future.</span>
            </h1>
            <p className="text-lg font-medium text-white/80 max-w-md leading-relaxed mb-10">
              Synthesize your professional telemetry into actionable, Tier-1 market alignment vectors. 
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-black/10 w-max px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                <ShieldCheck size={16} className="text-emerald-300" />
                <span className="text-xs font-bold text-white">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-4 bg-black/10 w-max px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                <Sparkles size={16} className="text-amber-300" />
                <span className="text-xs font-bold text-white">Neural Pattern Recognition</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-[10px] font-bold text-white/50 uppercase tracking-widest hidden lg:block">
          System v2.0 // Secured Node
        </div>
      </div>

      {/* 2. DATA ENTRY TERMINAL */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full h-full p-4 sm:p-8 lg:p-20 overflow-hidden pointer-events-none">
        
        {/* The Internal Scrollable Glass Card (Pointer events restored here) */}
        <div className="w-full max-w-md max-h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pointer-events-auto bg-white/90 lg:bg-transparent backdrop-blur-2xl lg:backdrop-blur-none p-6 lg:p-0 rounded-[2.5rem] lg:rounded-none shadow-2xl lg:shadow-none border border-white/40 lg:border-none">
          
          <div className="text-center mb-6 lg:hidden">
             <h2 className="text-2xl font-black tracking-tighter text-[#111111]">Cognitive Engine.</h2>
          </div>

          {/* Premium Sliding Toggle */}
          <div className="bg-slate-200/50 lg:bg-white p-1.5 rounded-2xl flex relative mb-8 shadow-inner lg:shadow-sm lg:border border-slate-200 shrink-0">
            <div className="w-1/2 relative z-10">
              <button type="button" onClick={() => setIsSignUp(false)} className={`w-full py-2.5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-colors ${!isSignUp ? 'text-white' : 'text-slate-500 hover:text-[#111111]'}`}>
                Authenticate
              </button>
            </div>
            <div className="w-1/2 relative z-10">
              <button type="button" onClick={() => setIsSignUp(true)} className={`w-full py-2.5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-colors ${isSignUp ? 'text-white' : 'text-slate-500 hover:text-[#111111]'}`}>
                Initialize
              </button>
            </div>
            <motion.div 
              layout 
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#FF4500] rounded-xl shadow-md ${isSignUp ? 'left-[50%] ml-[3px]' : 'left-1.5'}`} 
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
               {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }} 
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col items-center justify-center mb-6">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center font-black text-2xl text-slate-300 group-hover:border-[#FF4500] transition-all overflow-hidden">
                        {previewImage ? <img src={previewImage} alt="Profile" className="w-full h-full object-cover" /> : <Camera size={24} />}
                      </div>
                      <div className="absolute bottom-0 right-0 p-2 bg-[#FF4500] text-white rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                        <Fingerprint size={12} />
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="col-span-2"><label className={labelClass}>Full Identity</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Nitya Patel" className={inputClass} required={isSignUp} /></div>
                    <div className="col-span-2"><label className={labelClass}>Host Institution</label><input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. RTMNU" className={inputClass} required={isSignUp} /></div>
                    <div><label className={labelClass}>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} required={isSignUp} /></div>
                    <div><label className={labelClass}>Graduation</label><input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} className={inputClass} required={isSignUp} /></div>
                    
                    {isCurrentStudent && (
                      <div className="col-span-2">
                        <label className={labelClass}>Current Semester</label>
                        <input type="text" name="currentSemester" value={formData.currentSemester} onChange={handleChange} placeholder="e.g. Semester IV" className={inputClass} />
                      </div>
                    )}
                    
                    <div><label className={labelClass}>Program</label><input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. BSc IT" className={inputClass} required={isSignUp} /></div>
                    <div><label className={labelClass}>Specialization</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. AI/ML" className={inputClass} required={isSignUp} /></div>
                  </div>
                </motion.div>
               )}
            </AnimatePresence>

            <motion.div layout className="space-y-4 lg:space-y-5 pt-2">
              <div>
                <label className={labelClass}>Access Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@domain.com" className={inputClass} required />
              </div>
              
              <div>
                <label className={labelClass}>Cryptographic Key</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputClass} required />
              </div>
              
              <AnimatePresence>
                {isSignUp && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="pt-4 lg:pt-5">
                      <label className={labelClass}>Verify Key</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputClass} required={isSignUp} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button 
              layout
              type="submit" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#111111] text-white py-4 lg:py-5 rounded-2xl font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#FF4500] transition-colors duration-300 flex items-center justify-center gap-4 group mt-6"
            >
              {isSignUp ? 'Synthesize Profile' : 'Authenticate Session'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>
          
          {/* GOOGLE SIGN-IN INTEGRATION */}
          <motion.div layout className="mt-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-slate-300/50 flex-1" />
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-400">Or Access Via</span>
              <div className="h-px bg-slate-300/50 flex-1" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white/80 lg:bg-white border-2 border-slate-200/50 lg:border-slate-100 text-[#111111] py-3.5 lg:py-4 rounded-2xl font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] shadow-sm hover:border-[#111111] transition-colors duration-300 flex items-center justify-center gap-4"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Node
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}