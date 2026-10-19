"""
AI4Bharat INCLUDE Model Architectures
Implements:
1. Bidirectional LSTM (ACM Multimedia 2020 paper architecture)
2. Spatial-Temporal 1D-CNN (Fast low-latency inference on edge/CPU)
3. Self-Attention Temporal Transformer (Native PyTorch implementation)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Optional

class INCLUDELSTM(nn.Module):
    """
    Official AI4Bharat INCLUDE Bi-LSTM Network.
    Processes sequence of 134-dimensional MediaPipe landmark frames.
    """
    def __init__(
        self,
        input_size: int = 134,
        hidden_size: int = 256,
        num_layers: int = 2,
        bidirectional: bool = True,
        dropout: float = 0.2,
        n_classes: int = 50,
    ):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.bidirectional = bidirectional
        self.n_classes = n_classes

        self.norm = nn.LayerNorm(input_size)
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=bidirectional,
            dropout=dropout if num_layers > 1 else 0.0,
        )

        in_features = hidden_size * 2 if bidirectional else hidden_size
        self.l1 = nn.Linear(in_features=in_features, out_features=n_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        x: Tensor of shape (batch_size, sequence_length, 134)
        returns logits: Tensor of shape (batch_size, n_classes)
        """
        x = self.norm(x)
        lstm_out, _ = self.lstm(x)
        # Max-pool over temporal dimension (matching AI4Bharat implementation)
        pooled = torch.max(lstm_out, dim=1).values
        pooled = F.dropout(pooled, p=0.3, training=self.training)
        logits = self.l1(pooled)
        return logits


class INCLUDEFastCNN(nn.Module):
    """
    Lightweight 1D-CNN for ultra-fast real-time browser camera inference (sub-15ms).
    """
    def __init__(self, input_size: int = 134, n_classes: int = 50):
        super().__init__()
        self.conv1 = nn.Conv1d(input_size, 128, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(128)
        self.conv2 = nn.Conv1d(128, 256, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(256)
        self.conv3 = nn.Conv1d(256, 256, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm1d(256)
        self.pool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Linear(256, n_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x is (batch, seq_len, 134) -> transpose to (batch, 134, seq_len)
        x = x.transpose(1, 2)
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = F.relu(self.bn3(self.conv3(x)))
        x = self.pool(x).squeeze(-1)
        return self.fc(x)


class INCLUDETransformer(nn.Module):
    """
    Transformer Encoder for temporal sign sequence modeling.
    Uses native PyTorch nn.TransformerEncoderLayer without external HuggingFace dependency.
    """
    def __init__(
        self,
        input_size: int = 134,
        d_model: int = 256,
        nhead: int = 4,
        num_layers: int = 3,
        n_classes: int = 50,
        max_len: int = 128,
    ):
        super().__init__()
        self.linear_in = nn.Linear(input_size, d_model)
        self.pos_embedding = nn.Parameter(torch.randn(1, max_len, d_model) * 0.02)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=nhead, dim_feedforward=512, dropout=0.1, batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.fc = nn.Linear(d_model, n_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        seq_len = x.size(1)
        h = self.linear_in(x) + self.pos_embedding[:, :seq_len, :]
        h = self.transformer(h)
        pooled = torch.mean(h, dim=1)
        return self.fc(pooled)
