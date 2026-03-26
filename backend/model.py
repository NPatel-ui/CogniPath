"""
Raisoni Placement Predictor - PyTorch Neural Network
======================================================
Multi-Layer Perceptron (MLP) for student placement probability prediction.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np


class PlacementMLP(nn.Module):
    """
    Multi-Layer Perceptron for Placement Probability Prediction.

    Architecture:
        Input(13) -> FC(128) -> BN -> ReLU -> Dropout(0.3)
                  -> FC(64)  -> BN -> ReLU -> Dropout(0.2)
                  -> FC(32)  -> BN -> ReLU
                  -> FC(1)   -> Sigmoid
    """

    def __init__(self, input_dim: int = 13, dropout_rate: float = 0.3):
        super(PlacementMLP, self).__init__()

        self.network = nn.Sequential(
            # Block 1
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(dropout_rate),

            # Block 2
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(dropout_rate * 0.67),

            # Block 3
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),

            # Output
            nn.Linear(32, 1),
            nn.Sigmoid()
        )

        self._initialize_weights()

    def _initialize_weights(self):
        """He initialization for ReLU activations."""
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.kaiming_normal_(m.weight, nonlinearity='relu')
                nn.init.zeros_(m.bias)
            elif isinstance(m, nn.BatchNorm1d):
                nn.init.ones_(m.weight)
                nn.init.zeros_(m.bias)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

    def predict_proba(self, x: torch.Tensor) -> np.ndarray:
        """Returns placement probability as numpy array."""
        self.eval()
        with torch.no_grad():
            proba = self.forward(x).squeeze().numpy()
        return proba


class SkillGapAnalyzer:
    """
    Computes gradient-based feature importance (Integrated Gradients proxy)
    to identify which features are dragging down a student's placement score.
    """

    FEATURE_NAMES = [
        'CGPA', 'Internships', 'Projects', 'Coding Skills',
        'Communication Skills', 'Aptitude Score', 'Soft Skills',
        'Certifications', 'Backlogs', 'Gender', 'Degree', 'Branch', 'Age'
    ]

    SKILL_FEATURES = [
        'CGPA', 'Coding Skills', 'Communication Skills',
        'Aptitude Score', 'Soft Skills', 'Certifications', 'Internships'
    ]

    def __init__(self, model: PlacementMLP):
        self.model = model

    def compute_gradient_importance(self, x: torch.Tensor) -> dict:
        """
        Computes input gradients w.r.t. output probability.
        High |gradient| -> feature has large influence on prediction.
        """
        self.model.eval()
        x_input = x.clone().detach().requires_grad_(True)
        output = self.model(x_input)
        output.backward(torch.ones_like(output))
        gradients = x_input.grad.abs().numpy()
        mean_grads = gradients.mean(axis=0) if gradients.ndim > 1 else gradients
        normalized = mean_grads / (mean_grads.sum() + 1e-10)
        return dict(zip(self.FEATURE_NAMES, normalized.tolist()))

    def identify_skill_gaps(self, student_vector: np.ndarray,
                            probability: float,
                            threshold: float = 0.5) -> list[dict]:
        """
        For an at-risk student (prob < threshold), returns sorted list of
        skill gaps — features with low values AND high gradient importance.
        """
        x = torch.tensor(student_vector, dtype=torch.float32).unsqueeze(0)
        importance = self.compute_gradient_importance(x)

        gaps = []
        for i, (feat, imp) in enumerate(zip(self.FEATURE_NAMES, student_vector)):
            if feat not in self.SKILL_FEATURES:
                continue
            # Normalize feature value to [0,1] range (approximate)
            normalized_val = min(1.0, max(0.0, (feat == 'CGPA' and feat / 10.0) or feat / 10.0))
            gap_score = imp * (1.0 - normalized_val)
            gaps.append({
                "feature": feat,
                "importance": round(imp, 4),
                "student_value": round(float(student_vector[i]), 2),
                "gap_score": round(gap_score, 4)
            })

        return sorted(gaps, key=lambda x: -x['gap_score'])
