import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Camera, User, KeyRound } from 'lucide-react';
// Firebase Imports
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendEmailVerification, 
  sendPasswordResetEmail 
} from "firebase/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Initialize Firebase Auth
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '', college: '', age: '', passingYear: '', 
    currentSemester: '', education: '', specialization: '', 
    email: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- GOOGLE SIGN-IN ---
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Logic: Google users bypass manual verification; redirect straight to dashboard
      console.log("Google Auth Success:", result.user);
      navigate('/dashboard');
    } catch (error) {
      alert("Neural Link Failed: " + error.message);
    }
  };

  // --- PASSWORD RESET ---
  const handleResetPassword = async () => {
    if (!formData.email) return alert("Enter email to receive reset vector.");
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Security Reset Link sent to your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          return alert("Security Keys do not match.");
        }
        
        // 1. Create User in Firebase Auth
        const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // 2. Send Verification Email
        await sendEmailVerification(userCred.user);
        
        // 3. Sync Profile to FastAPI Backend -> Realtime Database
        await fetch("http://localhost:8000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        alert("Identity Created. Check email for verification link.");
      } else {
        // Sign In logic
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const isCurrentStudent = parseInt(formData.passingYear) >= 2026;
  const inputClass = "w-full p-0 py-3 md:py-4 bg-transparent border-b-2 border-slate-200 focus:border-[#111111] outline-none transition-colors text-base md:text-lg font-bold text-[#111111] placeholder:text-slate-300 rounded-none";
  const labelClass = "block text-[9px] md:text-[10px] font-black text-[#FF4500] uppercase tracking-[0.2em] mb-1";

  return (
    <div className="min-h-screen bg-[#F2F0E9] flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Brand Header */}
      <div className="lg:hidden bg-[#FF4500] text-white p-6 pb-12 rounded-b-[2rem] shadow-sm relative overflow-hidden shrink-0">
        <div className="text-xl font-black tracking-tighter uppercase relative z-10 mb-4">CogniPath</div>
        <h1 className="text-4xl sm:text-5xl font-light leading-none tracking-tighter relative z-10">
          Architect <br/><span className="font-black">Your Future.</span>
        </h1>
        <div className="absolute -bottom-6 -right-6 text-[8rem] font-black opacity-10 leading-none pointer-events-none tracking-tighter">AI.</div>
      </div>

      {/* Desktop Brand Side */}
      <div className="hidden lg:flex w-[40%] bg-[#FF4500] p-20 flex-col justify-between relative overflow-hidden text-white shrink-0">
        <div className="text-2xl font-black tracking-tighter uppercase z-10">CogniPath</div>
        <div className="z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[5rem] font-light leading-[0.9] tracking-tighter mb-6">
            Architect <br/><span className="font-black">Your Future.</span>
          </motion.h1>
          <p className="text-xl font-medium max-w-sm opacity-90">Upload your academic data and let our neural engine map your trajectory to Tier-1 roles.</p>
        </div>
        <div className="absolute -bottom-20 -left-10 text-[20rem] font-black opacity-10 leading-none pointer-events-none tracking-tighter">AI.</div>
      </div>

      {/* Minimalist Form Area */}
      <div className="flex-1 flex items-start md:items-center justify-center p-6 sm:p-10 lg:p-16 relative -mt-6 lg:mt-0 z-20 overflow-y-auto">
        <div className="w-full max-w-xl bg-[#F2F0E9] lg:bg-transparent rounded-[2rem] lg:rounded-none p-6 sm:p-8 lg:p-0 shadow-xl lg:shadow-none border border-slate-200 lg:border-none">
          
          <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-8 mb-10 md:mb-12 border-b-2 border-slate-200">
            <button type="button" onClick={() => setIsSignUp(false)} className={`pb-3 md:pb-4 text-xs md:text-sm font-black uppercase tracking-widest transition-colors relative whitespace-nowrap ${!isSignUp ? 'text-[#111111]' : 'text-slate-400'}`}>
              Access System
              {!isSignUp && <motion.div layoutId="authTab" className="absolute -bottom-[2px] left-0 right-0 h-0.5 bg-[#FF4500]" />}
            </button>
            <button type="button" onClick={() => setIsSignUp(true)} className={`pb-3 md:pb-4 text-xs md:text-sm font-black uppercase tracking-widest transition-colors relative whitespace-nowrap ${isSignUp ? 'text-[#111111]' : 'text-slate-400'}`}>
              Initialize Profile
              {isSignUp && <motion.div layoutId="authTab" className="absolute -bottom-[2px] left-0 right-0 h-0.5 bg-[#FF4500]" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 md:mb-10 flex items-center gap-4 md:gap-6">
                  <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current.click()}>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:ring-4 ring-[#FF4500]/20">
                      {previewImage ? <img src={previewImage} className="w-full h-full object-cover" /> : <User size={28} className="text-slate-400 md:w-8 md:h-8" />}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={18} className="text-white md:w-5 md:h-5" /></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-[#111111] leading-none">Identity Vector</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">Upload your avatar to calibrate.</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6 md:space-y-8">
              {isSignUp && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Nitya Patel" className={inputClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>College / University</label>
                    <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="e.g. RTMNU Autonomous Institute" className={inputClass} required />
                  </div>
                  <div><label className={labelClass}>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 21" className={inputClass} required /></div>
                  <div><label className={labelClass}>Passing Year</label><input type="number" name="passingYear" value={formData.passingYear} onChange={handleChange} placeholder="e.g. 2027" className={inputClass} required /></div>
                  <AnimatePresence>
                    {isCurrentStudent && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:col-span-2 overflow-hidden">
                        <label className={labelClass}>Current Semester</label>
                        <input type="text" name="currentSemester" value={formData.currentSemester} onChange={handleChange} placeholder="e.g. 4th Semester" className={`${inputClass} border-[#FF4500]/30 focus:border-[#FF4500] bg-[#FF4500]/5 px-4 rounded-t-xl`} required />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div><label className={labelClass}>Education Program</label><input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. BSc IT" className={inputClass} required /></div>
                  <div><label className={labelClass}>Specialization</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Data Science" className={inputClass} required /></div>
                </motion.div>
              )}
              
              <div className={isSignUp ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8 pt-4 md:pt-6 border-t border-slate-200/50" : "space-y-6"}>
                <div className={isSignUp ? "md:col-span-2" : ""}>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="neural@rtmnu.edu" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Security Key</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputClass} required />
                </div>
                {isSignUp && (
                  <div><label className={labelClass}>Confirm Security Key</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputClass} required /></div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button type="submit" className="w-full bg-[#111111] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#FF4500] hover:-translate-y-1 transition-all duration-300">
                {isSignUp ? 'Synthesize Profile' : 'Authenticate'} <ArrowRight size={16} />
              </button>

              {!isSignUp && (
                <button type="button" onClick={handleResetPassword} className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#FF4500] transition-colors flex items-center justify-center gap-2">
                  <KeyRound size={12} /> Security Reset Needed?
                </button>
              )}

              {/* Google Sign-In Injected Here */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase bg-[#F2F0E9] px-4 text-slate-400 tracking-[0.3em]">OR</div>
              </div>

              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                className="w-full py-4 border-2 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-4 hover:border-[#111111] transition-all bg-white shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Connect via Google Vector
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}