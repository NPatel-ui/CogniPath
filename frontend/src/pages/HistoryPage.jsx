import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Activity, FileText, TrendingUp, Clock, Loader2, ChevronRight, Database } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import PageTransition from '../components/PageTransition.jsx';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mouse Glow Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) { await fetchUserHistory(user.uid); } 
      else { setHistoryData([]); setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserHistory = async (userId) => {
    try {
      const historyRef = collection(db, 'history');
      const q = query(historyRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Recent'
      }));
      setHistoryData(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const getIcon = (type) => {
    const props = { size: 22 };
    switch (type) {
      case 'analysis': return <Activity {...props} className="text-blue-400" />;
      case 'document': return <FileText {...props} className="text-[#FF4500]" />;
      case 'prediction': return <TrendingUp {...props} className="text-emerald-400" />;
      default: return <Clock {...props} className="text-gray-400" />;
    }
  };

  return (
    <PageTransition>
      {/* CHANGES MADE: 
          1. Changed bg to #050505 and ensured min-h-screen 
          2. Removed narrow max-width on the main container
      */}
      <div className="relative min-h-screen bg-[#050505] text-white pt-10 pb-40 px-6 md:px-12 lg:px-20 overflow-x-hidden">
        
        {/* Cursor Glow Overlay */}
        <motion.div 
          className="pointer-events-none fixed inset-0 z-0 opacity-20"
          style={{
            background: `radial-gradient(800px circle at ${springX}px ${springY}px, rgba(255, 69, 0, 0.1), transparent 80%)`,
          }}
        />

        {/* Global Noise */}
        <div className="fixed inset-0 bg-noise pointer-events-none z-[1] opacity-[0.03]" />

        {/* Dynamic Header & Stats Section (Spans Full Width) */}
        <div className="relative z-10 w-full mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="h-[2px] w-12 bg-[#FF4500]" />
                <span className="text-[#FF4500] font-mono text-sm uppercase tracking-[0.4em] font-bold">Terminal Archive</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.9]">
  History
</h1>
            </motion.div>

            {/* Premium Stats Bento - Now more expansive */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-8 bg-[#111111]/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] min-w-[320px]"
            >
              <div className="flex-1">
                <p className="text-white/20 text-xs uppercase font-bold tracking-widest mb-2">Total Scans</p>
                <p className="text-4xl font-black italic leading-none">{historyData.length}</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="flex-1">
                <p className="text-white/20 text-xs uppercase font-bold tracking-widest mb-2">Network</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-4xl font-black text-emerald-500 italic leading-none uppercase">Live</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="animate-spin text-[#FF4500] mb-4" size={48} />
              <span className="text-white/20 font-mono text-sm tracking-widest uppercase">Decryption in progress...</span>
            </div>
          ) : historyData.length === 0 ? (
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full py-32 border border-white/5 rounded-[3rem] bg-[#0c0c0c]/50 backdrop-blur-sm text-center"
            >
              <Database className="mx-auto text-white/5 mb-8" size={100} />
              <h2 className="text-3xl font-bold mb-4">Neural Logs Empty</h2>
              <p className="text-white/30 max-w-md mx-auto text-lg">
                No active records found in the CogniPath database. Start a new session to begin logging.
              </p>
            </motion.div>

          ) : (
            <motion.div 
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 gap-4"
            >
              {historyData.map((item) => (
                <motion.div 
                  key={item.id}
                  variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.005, backgroundColor: 'rgba(255, 69, 0, 0.02)' }}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between p-7 bg-[#111111]/30 border border-white/5 rounded-[2rem] hover:border-[#FF4500]/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-8">
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:border-[#FF4500]/20 group-hover:bg-[#FF4500]/5 transition-all">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white/80 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-mono text-[#FF4500] uppercase tracking-tighter font-bold">{item.type}</span>
                        <div className="h-1 w-1 bg-white/20 rounded-full" />
                        <span className="text-xs font-mono text-white/30 uppercase">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10 mt-6 md:mt-0">
                    <div className="md:text-right">
                      <span className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.2em] block mb-1 opacity-60">Status: {item.status || 'Archived'}</span>
                      <span className="text-lg font-bold text-white/90">{item.score || 'View Intelligence'}</span>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FF4500] group-hover:text-black transition-all duration-500 transform group-hover:rotate-45">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default HistoryPage;