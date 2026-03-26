import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; // <-- 2. Import the listener
import { ref, onValue } from "firebase/database"; // Add this to your imports
import { auth, database as db } from '../firebase'; // <-- 1. Import your Firebase instances

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- NEW: FIREBASE SECURITY STATE ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- This stops the bounce!
useEffect(() => {
  if (firebaseUser) {
    const safeEmail = firebaseUser.email.replace(/\./g, '_');
    const analysisRef = ref(db, `users/${safeEmail}/last_analysis`);

    // Listen for data changes in real-time
    const unsubscribe = onValue(analysisRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAnalysisResults(data);
        setHasData(true);
      }
    });

    return () => unsubscribe();
  }
}, [firebaseUser]);
  // --- YOUR EXISTING SYSTEM STATE ---
  const [hasData, setHasData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Keeping your profile data intact for the Dashboard UI
  const [user, setUser] = useState({
    name: "Nitya Patel",
    initials: "NP",
    email: "patelnitya351@gmail.com",
    age: "21",
    education: "BSc IT",
    specialization: "AI & Data Science",
    college: "RTMNU Institute",
    semester: "4th",
    cgpa: "9.23"
  });

  // --- NEW: FIREBASE LISTENER ---
  useEffect(() => {
    // This tells the app to wait until Google confirms your identity
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false); // Lower the shield, Firebase is ready!
    });
    
    return () => unsubscribe();
  }, []);

  const triggerUpload = async (role, description) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_role', role);
      formData.append('job_description', description);
      formData.append('user_email', firebaseUser?.email || user.email);

      try {
        const response = await fetch('http://localhost:8000/api/upload/resume', {
          method: 'POST', 
          body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        
        setAnalysisResults({ ...data, fileName: file.name, role: role });
        setHasData(true);
      } catch (error) {
        console.error("❌ Neural Sync Error:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };
    input.click();
  };

  return (
    <AppContext.Provider value={{ 
      triggerUpload, hasData, setHasData, analysisResults, 
      setAnalysisResults, isAnalyzing, setIsAnalyzing, 
      user, setUser, firebaseUser 
    }}>
      {/* THE MAGIC SHIELD: Show this while Firebase boots up */}
      {loading ? (
        <div className="h-screen w-screen bg-[#111111] text-[#FF4500] flex items-center justify-center font-black tracking-widest uppercase text-xl">
          Initializing Neural Link...
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};