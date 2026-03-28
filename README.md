# 🧠 CogniPath Neural Engine

CogniPath is an AI-powered placement prediction and career roadmap synthesizer. It leverages a custom PyTorch neural network to evaluate student profiles against target job descriptions, utilizing Google's Gemini AI to generate actionable, three-phase career roadmaps.

## ✨ Features

* **Neural Resume Analysis:** Upload a PDF resume to instantly extract features and calculate a placement probability score using a trained Multi-Layer Perceptron (MLP).
* **AI Roadmap Synthesis:** Generates a custom, 3-phase execution plan (Baseline, Optimization, Alignment) powered by Gemini 1.5 Flash.
* **Radar Chart Fingerprinting:** Visualizes candidate strengths across Academics, Projects, Experience, Tech Skills, Soft Skills, and Target Fit.
* **Secure Authentication:** End-to-end user authentication and session management powered by Firebase.
* **Terminal Archive (History):** Automatically saves all past neural scans and roadmaps to a real-time database for future reference.
* **Neural Interviewer (WIP):** An upcoming voice-activated mock interview module tailored to the user's target architecture.

## 🛠️ Tech Stack

**Frontend (Client Node)**
* **Framework:** React 18 + Vite
* **Routing:** React Router DOM v6
* **Styling:** Tailwind CSS + Framer Motion (for page transitions and animations)
* **Icons & UI:** Lucide React, React Hot Toast
* **Hosting:** Vercel

**Backend (Neural Core)**
* **Framework:** FastAPI (Python)
* **Machine Learning:** PyTorch (PlacementMLP) + NumPy + Pandas
* **Generative AI:** Google Generative AI (Gemini)
* **PDF Parsing:** PyMuPDF (`fitz`)
* **Database & Auth:** Firebase Admin SDK (Realtime Database)
* **Hosting:** Render

## 🚀 Local Development Setup

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* A Firebase Project with Realtime Database and Authentication enabled.
* A Google Gemini API Key.

### 1. Clone the Repository
```bash
git clone [https://github.com/NPatel-ui/cognipath.git](https://github.com/NPatel-ui/cognipath.git)
cd cognipath
