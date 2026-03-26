import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; 
import FloatingNav from './components/FloatingNav';
import PageTransition from './components/PageTransition'; 
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard';
import ResumeLab from './pages/ResumeLab';
import NeuralFingerprint from './pages/NeuralFingerprint';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import HistoryPage from './pages/HistoryPage.jsx';

export default function App() {
  const location = useLocation();
  const hideNavPaths = ['/', '/auth'];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <div className="w-full min-h-screen font-sans selection:bg-[#FF4500] selection:text-white">
      <Toaster 
  position="top-center"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#111111', // Deep Carbon
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
      style: { borderBottom: '2px solid #10B981' } // Green accent
    },
    error: {
      iconTheme: { primary: '#EF4444', secondary: '#111111' },
      style: { borderBottom: '2px solid #EF4444' } // Red accent
    },
    loading: {
      iconTheme: { primary: '#FF4500', secondary: '#111111' },
      style: { borderBottom: '2px solid #FF4500' } // Neon Crimson accent
    }
  }}
/>

      <div className={shouldShowNav ? "w-full pb-32" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/resume-lab" element={<PageTransition><ResumeLab /></PageTransition>} />
            <Route path="/roadmap" element={<PageTransition><NeuralFingerprint /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
            <Route path="/history" element={<PageTransition><HistoryPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>

      {shouldShowNav && <FloatingNav />}
    </div>
  );
}   
