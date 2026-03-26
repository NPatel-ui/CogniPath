import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; // ⬅️ 1. Import Toaster

// Components
import FloatingNav from './components/FloatingNav';
import PageTransition from './components/PageTransition'; 

// Pages
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard';
import ResumeLab from './pages/ResumeLab';
import NeuralFingerprint from './pages/NeuralFingerprint';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

export default function App() {
  const location = useLocation();
  const hideNavPaths = ['/', '/auth'];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="bg-[#F2F0E9] min-h-screen text-[#111111] font-sans selection:bg-[#FF4500] selection:text-white overflow-hidden">
      
      {/* ⬅️ 2. Add the Toaster with Tier-1 Enterprise Styling */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111111',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '1rem',
            padding: '16px 24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#111111' },
            style: { borderBottom: '2px solid #10B981' }
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#111111' },
            style: { borderBottom: '2px solid #EF4444' }
          },
          // Custom style for neural engine events
          loading: {
            iconTheme: { primary: '#FF4500', secondary: '#111111' },
            style: { borderBottom: '2px solid #FF4500' }
          }
        }}
      />

      <div className={shouldShowNav ? "max-w-7xl mx-auto px-6 pb-32" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/resume-lab" element={<PageTransition><ResumeLab /></PageTransition>} />
            <Route path="/roadmap" element={<PageTransition><NeuralFingerprint /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>

      {shouldShowNav && <FloatingNav />}
    </div>
  );
}