import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Fingerprint, User, History } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function FloatingNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { icon: <FlaskConical size={20} />, path: '/resume-lab' },
    { icon: <Fingerprint size={20} />, path: '/roadmap' },
    { icon: <User size={20} />, path: '/profile' },
    { icon: <History size={20} />, path: '/history' } 
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    /* 1. CONTAINER: Use bottom-6 for mobile to avoid gesture bars, bottom-10 for desktop */
    <div className="fixed bottom-6 md:bottom-10 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        /* 2. RESPONSIVE SPACING: 
           - gap-5 on mobile, gap-10 on desktop
           - px-6 on mobile, px-10 on desktop
           - py-4 on mobile, py-5 on desktop
        */
        className="flex items-center gap-5 md:gap-10 px-6 md:px-10 py-4 md:py-5 bg-[#111111]/90 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto border border-white/10 max-w-full sm:w-max"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative group transition-transform active:scale-90 flex items-center justify-center"
            >
              <div className={`transition-all duration-300 ${
                isActive ? 'text-[#FF4500] scale-110' : 'text-white/30 hover:text-white'
              }`}>
                {item.icon}
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF4500] rounded-full"
                />
              )}
            </button>
          );
        })}

        {/* Vertical Divider - Hidden on very small screens to save space */}
        <div className="hidden xs:block w-px h-6 bg-white/10" />

        {/* LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          className="relative group transition-transform active:scale-90 text-white/30 hover:text-rose-500 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

      </motion.nav>
    </div>
  );
}
