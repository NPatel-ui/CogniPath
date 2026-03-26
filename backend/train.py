"""
Raisoni Placement Predictor - Training Pipeline
=================================================
Full PyTorch training loop with BCELoss + Adam optimizer,
early stopping, learning rate scheduling, and model checkpointing.
"""

import os
import json
import time
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    accuracy_score, roc_auc_score, classification_report, confusion_matrix
)
from model import PlacementMLP, SkillGapAnalyzer

# Get the directory where train.py is located to build absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ─── Config ──────────────────────────────────────────────────────────────────

CONFIG = {
    "train_path":    os.path.join(BASE_DIR, "Student Placement Dataset", "train.csv"),
    "test_path":     os.path.join(BASE_DIR, "Student Placement Dataset", "test.csv"),
    "model_path":    os.path.join(BASE_DIR, "artifacts", "placement_model.pt"),
    "scaler_path":   os.path.join(BASE_DIR, "artifacts", "scaler.npy"),
    "output_json":   os.path.join(BASE_DIR, "artifacts", "dashboard_data.json"),
    "input_dim":     13,
    "hidden_sizes":  [128, 64, 32],
    "dropout":       0.3,
    "epochs":        80,
    "batch_size":    256,
    "lr":            1e-3,
    "weight_decay":  1e-4,
    "early_stop":    10,
    "seed":          42,
}

FEATURE_COLS = [
    'CGPA', 'Internships', 'Projects', 'Coding_Skills',
    'Communication_Skills', 'Aptitude_Test_Score', 'Soft_Skills_Rating',
    'Certifications', 'Backlogs', 'Gender_enc', 'Degree_enc', 'Branch_enc', 'Age'
]

torch.manual_seed(CONFIG["seed"])
np.random.seed(CONFIG["seed"])


# ─── Dataset ─────────────────────────────────────────────────────────────────

class PlacementDataset(Dataset):
    def __init__(self, X: np.ndarray, y: np.ndarray):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32).unsqueeze(1)

    def __len__(self): return len(self.X)
    def __getitem__(self, idx): return self.X[idx], self.y[idx]


# ─── Preprocessing ────────────────────────────────────────────────────────────

def load_and_preprocess(train_path: str, test_path: str):
    # Logic fix: Ensure train_path loads into train_df and test_path into test_df
    train_df = pd.read_csv(train_path)
    test_df  = pd.read_csv(test_path)

    for df in [train_df, test_df]:
        df['Gender_enc'] = LabelEncoder().fit_transform(df['Gender'])
        df['Degree_enc'] = LabelEncoder().fit_transform(df['Degree'])
        df['Branch_enc'] = LabelEncoder().fit_transform(df['Branch'])
        df['Label']      = (df['Placement_Status'] == 'Placed').astype(int)

    X_train = train_df[FEATURE_COLS].values.astype(np.float32)
    y_train = train_df['Label'].values.astype(np.float32)
    X_test  = test_df[FEATURE_COLS].values.astype(np.float32)
    y_test  = test_df['Label'].values.astype(np.float32)

    scaler  = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)

    # Use .pt path base to save scaler components
    np.save(CONFIG["scaler_path"].replace('.npy', '_mean.npy'), scaler.mean_)
    np.save(CONFIG["scaler_path"].replace('.npy', '_scale.npy'), scaler.scale_)

    return X_train, y_train, X_test, y_test, test_df, scaler


# ─── Training Loop ────────────────────────────────────────────────────────────

def train_epoch(model, loader, optimizer, criterion, device):
    model.train()
    total_loss, correct, total = 0.0, 0, 0
    for X_batch, y_batch in loader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)
        optimizer.zero_grad()
        preds  = model(X_batch)
        loss   = criterion(preds, y_batch)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        total_loss += loss.item() * len(X_batch)
        correct    += ((preds > 0.5) == y_batch).sum().item()
        total      += len(X_batch)
    return total_loss / total, correct / total


@torch.no_grad()
def eval_epoch(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0
    all_probs, all_labels = [], []
    for X_batch, y_batch in loader:
        X_batch, y_batch = X_batch.to(device), y_batch.to(device)
        preds  = model(X_batch)
        loss   = criterion(preds, y_batch)
        total_loss += loss.item() * len(X_batch)
        correct    += ((preds > 0.5) == y_batch).sum().item()
        total      += len(X_batch)
        all_probs.extend(preds.squeeze().cpu().numpy().tolist())
        all_labels.extend(y_batch.squeeze().cpu().numpy().tolist())
    
    # Avoid AUC error if only one class is present in batch
    try:
        auc = roc_auc_score(all_labels, all_probs)
    except ValueError:
        auc = 0.5
        
    return total_loss / total, correct / total, auc


def train(config: dict = CONFIG):
    os.makedirs(os.path.join(BASE_DIR, "artifacts"), exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f" Device: {device}")

    # Load data
    X_train, y_train, X_test, y_test, test_df, scaler = \
        load_and_preprocess(config["train_path"], config["test_path"])

    # Handle class imbalance with WeightedRandomSampler
    class_counts = np.bincount(y_train.astype(int))
    weights      = 1.0 / class_counts[y_train.astype(int)]
    sampler      = WeightedRandomSampler(weights, len(weights), replacement=True)

    train_ds = PlacementDataset(X_train, y_train)
    test_ds  = PlacementDataset(X_test,  y_test)

    train_loader = DataLoader(train_ds, batch_size=config["batch_size"], sampler=sampler)
    test_loader  = DataLoader(test_ds,  batch_size=512, shuffle=False)

    # Model, Loss, Optimizer, Scheduler
    model     = PlacementMLP(input_dim=config["input_dim"], dropout_rate=config["dropout"]).to(device)
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=config["lr"], weight_decay=config["weight_decay"])
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', patience=5, factor=0.5)

    best_auc, patience_ctr = 0.0, 0
    history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": [], "val_auc": []}

    print(f"\n{'Epoch':>6} {'Train Loss':>12} {'Val Loss':>10} {'Val Acc':>9} {'Val AUC':>9}")
    print("-" * 54) # Standard ASCII to avoid UnicodeEncodeError

    for epoch in range(1, config["epochs"] + 1):
        t_loss, t_acc                 = train_epoch(model, train_loader, optimizer, criterion, device)
        v_loss, v_acc, v_auc          = eval_epoch(model, test_loader, criterion, device)
        scheduler.step(v_auc)

        history["train_loss"].append(t_loss)
        history["val_loss"].append(v_loss)
        history["train_acc"].append(t_acc)
        history["val_acc"].append(v_acc)
        history["val_auc"].append(v_auc)

        if epoch % 5 == 0 or epoch == 1:
            print(f"{epoch:>6} {t_loss:>12.4f} {v_loss:>10.4f} {v_acc:>9.4f} {v_auc:>9.4f}")

        if v_auc > best_auc:
            best_auc    = v_auc
            patience_ctr = 0
            torch.save(model.state_dict(), config["model_path"])
        else:
            patience_ctr += 1
            if patience_ctr >= config["early_stop"]:
                print(f"\n[STOP] Early stopping at epoch {epoch}. Best AUC: {best_auc:.4f}")
                break

    # Load best model for evaluation
    model.load_state_dict(torch.load(config["model_path"], map_location=device))

    # Final evaluation
    model.eval()
    with torch.no_grad():
        X_tensor  = torch.tensor(X_test, dtype=torch.float32).to(device)
        test_probs = model(X_tensor).squeeze().cpu().numpy()

    test_preds = (test_probs > 0.5).astype(int)
    print(f"\n  Final Test Accuracy : {accuracy_score(y_test, test_preds):.4f}")
    print(f"  Final Test AUC      : {roc_auc_score(y_test, test_probs):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, test_preds, target_names=['Not Placed', 'Placed']))

    # Save training history
    history_path = os.path.join(BASE_DIR, "artifacts", "training_history.json")
    with open(history_path, "w") as f:
        json.dump(history, f, indent=2)

    print(f"\n  Model saved -> {config['model_path']}")
    return model, test_probs, test_df


if __name__ == "__main__":
    train()