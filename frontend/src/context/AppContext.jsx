import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth'; 
import { doc, onSnapshot } from "firebase/firestore"; 
import { auth, db } from '../firebase'; 

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- AUTH & LOADING STATE ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ANALYSIS STATE ---
  const [hasData, setHasData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // --- MOCK USER PROFILE (For Dashboard UI) ---
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

  // --- 1. FIREBASE AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FIRESTORE REAL-TIME DATA LISTENER ---
  useEffect(() => {
    if (firebaseUser?.email) {
      // Listens to your specific user document for new AI results
      const userDocRef = doc(db, 'users', firebaseUser.email);

      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.last_analysis) {
            setAnalysisResults(data.last_analysis);
            setHasData(true);
          }
        }
      }, (error) => {
        console.error("Firestore Listener Error:", error);
      });

      return () => unsubscribe();
    }
  }, [firebaseUser]);

  // --- 3. UPLOAD LOGIC ---
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
        const response = await fetch('https://cognipath-backend.onrender.com/api/upload/resume', {
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
      {loading ? (
        <div className="h-screen w-screen bg-[#0a0a0a] text-[#FF4500] flex items-center justify-center font-black tracking-widest uppercase text-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FF4500] border-t-transparent rounded-full animate-spin"></div>
            Initializing Neural Link...
          </div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
};

// --- 4. THE EXPORT THAT WAS MISSING ---
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
