# Raisoni Placement Predictor & Skill-Gap Suite

## Project Structure

```
raisoni-placement-predictor/
│
├── backend/
│   ├── model.py              # PyTorch MLP nn.Module + SkillGapAnalyzer
│   ├── train.py              # Full training loop (BCELoss + Adam)
│   ├── firebase_sync.py      # Sync predictions to Firebase
│   ├── data/
│   │   ├── train.csv         # 45,000 student records
│   │   └── test.csv          # 5,000 student records
│   └── artifacts/            # Saved model, scaler, dashboard JSON
│
├── frontend/
│   └── src/
│       └── PlacementDashboard.jsx   # React Dean's Dashboard
│
└── requirements.txt
```

---

## Model Performance

| Metric        | Value  |
|---------------|--------|
| Train AUC     | 93.74% |
| Test AUC      | **93.62%** |
| Test Accuracy | **87.24%** |
| Training Set  | 45,000 |
| Test Set      | 5,000  |

---

## Neural Network Architecture

```
Input(13) → FC(128) → BN → ReLU → Dropout(0.3)
          → FC(64)  → BN → ReLU → Dropout(0.2)
          → FC(32)  → BN → ReLU
          → FC(1)   → Sigmoid → Probability ∈ [0,1]
```

**Training config:**
- Loss: `BCELoss`
- Optimizer: `Adam(lr=1e-3, weight_decay=1e-4)`
- Scheduler: `ReduceLROnPlateau(mode='max', patience=5)`
- Batch size: 256 with `WeightedRandomSampler` (handles class imbalance)
- Early stopping: patience=10 on val AUC

---

## Top Feature Importances (Gradient Analysis)

| Feature              | Importance |
|----------------------|-----------|
| Backlogs             | 31.05%    |
| Communication Skills | 27.94%    |
| Certifications       | 15.80%    |
| CGPA                 | 6.67%     |
| Coding Skills        | 5.93%     |

---

## Setup

```bash
# Backend
pip install torch scikit-learn pandas numpy firebase-admin

# Train the model
python train.py

# Sync to Firebase
python firebase_sync.py \
  --data artifacts/dashboard_data.json \
  --cred serviceAccountKey.json \
  --db https://raisoni-placement.firebaseio.com

# Frontend (React)
cd frontend
npm install
npm start
```

---

## Firebase Realtime DB Structure

```
/placement_predictor/
  metadata/
    last_updated: "2024-01-15T10:30:00Z"
    model_accuracy: 87.24
    model_auc: 93.62
    total_students: 5000
    at_risk_count: 3194
  students/
    {student_id}/
      probability: 0.37
      at_risk: true
      cgpa: 7.32
      ...
  analytics/
    skill_gaps: [...]
    branch_stats: [...]
    feature_importance: [...]
```
