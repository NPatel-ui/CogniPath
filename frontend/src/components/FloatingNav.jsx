import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
// LogOut is removed from this list to prevent the crash
import { LayoutDashboard, FlaskConical, Fingerprint, User } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function FloatingNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={22} />, path: '/dashboard' },
    { icon: <FlaskConical size={22} />, path: '/resume-lab' },
    { icon: <Fingerprint size={22} />, path: '/roadmap' },
    { icon: <User size={22} />, path: '/profile' },
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
    <div className="fixed bottom-10 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-10 px-10 py-5 bg-[#111111] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto border border-white/5"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative group transition-transform active:scale-90"
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

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* LOGOUT BUTTON - Using raw SVG to bypass the Lucide React error */}
        <button 
          onClick={handleLogout}
          className="relative group transition-transform active:scale-90 text-white/30 hover:text-rose-500 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
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