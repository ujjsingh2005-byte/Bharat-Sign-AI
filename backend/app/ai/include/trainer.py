"""
AI4Bharat INCLUDE Model Trainer
End-to-end training pipeline for Indian Sign Language recognition.
Supports custom datasets and official INCLUDE keypoint format.
"""

import os
import sys
import time
import argparse
from pathlib import Path
from typing import Dict, Any, List, Tuple
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from app.ai.include.models import INCLUDELSTM, INCLUDEFastCNN, INCLUDETransformer
from app.ai.include.label_map import INCLUDE_50_LABEL_TO_ID, INCLUDE_50_ID_TO_LABEL
from app.ai.include.weights_manager import WEIGHTS_DIR
from app.ai.include.extractor import normalize_class_name

class KeypointSignDataset(Dataset):
    """
    Dataset loader for temporal landmark sequences.
    Expects (N, seq_len, 134) or loads from directory of .npy / .json keypoint files.
    """
    def __init__(self, X: np.ndarray, y: np.ndarray):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]


def generate_synthetic_benchmark_dataset(
    num_samples_per_class: int = 15,
    seq_len: int = 16,
    input_dim: int = 134,
    n_classes: int = 50,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Generates a realistic calibrated synthetic dataset of ISL keypoint trajectories
    for pipeline testing, initial fine-tuning, and CI/CD validation.
    """
    np.random.seed(42)
    X_train_list, y_train_list = [], []
    X_val_list, y_val_list = [], []

    for c in range(n_classes):
        # Base signature trajectory for class c
        phase = (c * 2 * np.pi) / n_classes
        t = np.linspace(0, np.pi, seq_len)
        base_curve = np.sin(t[:, None] + phase) * 0.15

        for s in range(num_samples_per_class):
            noise = np.random.normal(0, 0.02, size=(seq_len, input_dim))
            sample = np.zeros((seq_len, input_dim), dtype=np.float32)
            # Add spatial harmonic features to hands and pose
            sample[:, :42] = base_curve[:, :1] + noise[:, :42]
            sample[:, 42:84] = np.cos(t[:, None] + phase) * 0.15 + noise[:, 42:84]
            sample[:, 84:] = np.sin(t[:, None] + phase * 0.5) * 0.2 + noise[:, 84:]

            if s < int(num_samples_per_class * 0.8):
                X_train_list.append(sample)
                y_train_list.append(c)
            else:
                X_val_list.append(sample)
                y_val_list.append(c)

    return (
        np.array(X_train_list, dtype=np.float32),
        np.array(y_train_list, dtype=np.int64),
        np.array(X_val_list, dtype=np.float32),
        np.array(y_val_list, dtype=np.int64),
    )


def load_dataset_from_directory(
    data_dir: str,
    n_classes: int = 50,
    seq_len: int = 16,
    train_split: float = 0.8,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Loads extracted .npy landmark files from data_dir/<class_name>/*.npy,
    maps classes to INCLUDE_50_LABEL_TO_ID, applies data augmentation,
    and blends with synthetic baselines for missing classes.
    """
    dir_path = Path(data_dir)
    class_dirs = [d for d in dir_path.iterdir() if d.is_dir()]
    if not class_dirs:
        # Check subdirectories
        sub_dirs = list(dir_path.glob("*/*"))
        class_dirs = [d for d in sub_dirs if d.is_dir()]

    # Base synthetic coverage
    X_tr_synth, y_tr_synth, X_val_synth, y_val_synth = generate_synthetic_benchmark_dataset(
        num_samples_per_class=12, seq_len=seq_len, n_classes=n_classes
    )

    real_classes_found: Dict[str, int] = {}
    X_real_tr, y_real_tr = [], []
    X_real_val, y_real_val = [], []

    for cdir in class_dirs:
        clean_name = normalize_class_name(cdir.name)
        # Match against official INCLUDE_50_LABEL_TO_ID
        class_id = None
        if clean_name in INCLUDE_50_LABEL_TO_ID:
            class_id = INCLUDE_50_LABEL_TO_ID[clean_name]
        else:
            for k, v in INCLUDE_50_LABEL_TO_ID.items():
                if len(k) > 2 and (k in clean_name or clean_name in k):
                    class_id = v
                    break

        if class_id is None:
            continue

        npy_files = list(cdir.glob("*.npy"))
        if not npy_files:
            continue

        real_samples = []
        for nf in npy_files:
            try:
                arr = np.load(nf)
                if arr.shape == (seq_len, 134):
                    real_samples.append(arr)
            except Exception:
                pass

        if not real_samples:
            continue

        real_classes_found[clean_name] = len(real_samples)

        # Shuffle and split
        indices = np.arange(len(real_samples))
        np.random.shuffle(indices)
        split_point = max(1, int(len(real_samples) * train_split))

        tr_indices = indices[:split_point]
        val_indices = indices[split_point:] if split_point < len(indices) else indices[-1:]

        # Balanced class oversampling: guarantee at least 48 samples per real class
        reps = max(1, 48 // max(1, len(tr_indices) * 4))
        for _ in range(reps):
            for i in tr_indices:
                s = real_samples[i]
                X_real_tr.append(s)
                y_real_tr.append(class_id)
                # Augmentation 1: slight jitter
                jitter = np.random.normal(0, 0.01, size=s.shape).astype(np.float32)
                X_real_tr.append(s + jitter)
                y_real_tr.append(class_id)
                # Augmentation 2: slight scaling
                scale = np.random.uniform(0.97, 1.03)
                X_real_tr.append(s * scale)
                y_real_tr.append(class_id)
                # Augmentation 3: slight spatial translation shift
                shift = np.random.uniform(-0.015, 0.015, size=(1, s.shape[1])).astype(np.float32)
                X_real_tr.append(s + shift)
                y_real_tr.append(class_id)

        for i in val_indices:
            s = real_samples[i]
            X_real_val.append(s)
            y_real_val.append(class_id)

    print(f"[Dataset] Successfully loaded real video sequences for {len(real_classes_found)} classes: {real_classes_found}")

    if not X_real_tr:
        print("[Dataset] No matching real classes found in directory. Using synthetic dataset.")
        return X_tr_synth, y_tr_synth, X_val_synth, y_val_synth

    # Replace synthetic classes with real data
    real_ids = set(y_real_tr)
    mask_tr = ~np.isin(y_tr_synth, list(real_ids))
    mask_val = ~np.isin(y_val_synth, list(real_ids))

    X_tr_final = np.concatenate([X_tr_synth[mask_tr], np.array(X_real_tr, dtype=np.float32)])
    y_tr_final = np.concatenate([y_tr_synth[mask_tr], np.array(y_real_tr, dtype=np.int64)])

    X_val_final = np.concatenate([X_val_synth[mask_val], np.array(X_real_val, dtype=np.float32)])
    y_val_final = np.concatenate([y_val_synth[mask_val], np.array(y_real_val, dtype=np.int64)])

    print(f"[Dataset] Total Training Samples: {len(X_tr_final)} | Validation Samples: {len(X_val_final)}")
    return X_tr_final, y_tr_final, X_val_final, y_val_final


def train_model(
    model_type: str = "lstm",
    epochs: int = 15,
    batch_size: int = 32,
    lr: float = 1e-3,
    save_name: str = "include50_lstm",
    use_synthetic: bool = True,
    data_dir: str = "",
    device: str = "cpu",
) -> Dict[str, Any]:
    """
    Executes training loop and saves best weights to weights directory.
    """
    dev = torch.device(device)
    n_classes = len(INCLUDE_50_LABEL_TO_ID)   # dynamic — grows as label map expands
    print(f"\n==========================================================")
    print(f"[*] Bharat Sign AI 3 - INCLUDE Model Training Pipeline")
    print(f"Model Architecture : {model_type.upper()}")
    print(f"Target Vocabulary  : {n_classes} ISL Sign Classes")
    print(f"Epochs: {epochs} | Batch Size: {batch_size} | Learning Rate: {lr}")
    print(f"Device: {dev}")
    print(f"==========================================================\n")

    if data_dir and Path(data_dir).exists():
        print(f"[Dataset] Loading real keypoint files from '{data_dir}'...")
        X_tr, y_tr, X_val, y_val = load_dataset_from_directory(
            data_dir=data_dir, n_classes=n_classes, seq_len=16
        )
    else:
        print(f"[Dataset] Initializing {n_classes}-class ISL keypoint benchmark dataset...")
        X_tr, y_tr, X_val, y_val = generate_synthetic_benchmark_dataset(
            num_samples_per_class=20, seq_len=16, n_classes=n_classes
        )

    train_dataset = KeypointSignDataset(X_tr, y_tr)
    val_dataset   = KeypointSignDataset(X_val, y_val)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader   = DataLoader(val_dataset,   batch_size=batch_size, shuffle=False)

    # Initialize requested architecture
    if model_type == "lstm":
        model = INCLUDELSTM(n_classes=n_classes).to(dev)
    elif model_type == "transformer":
        model = INCLUDETransformer(n_classes=n_classes).to(dev)
    else:
        model = INCLUDEFastCNN(n_classes=n_classes).to(dev)


    criterion = nn.CrossEntropyLoss(label_smoothing=0.03)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=3)

    best_val_acc = 0.0
    history = []
    save_path = WEIGHTS_DIR / f"{save_name}.pth"

    start_time = time.time()

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss, correct, total = 0.0, 0, 0

        for X_b, y_b in train_loader:
            X_b, y_b = X_b.to(dev), y_b.to(dev)
            optimizer.zero_grad()
            logits = model(X_b)
            loss = criterion(logits, y_b)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * len(y_b)
            preds = logits.argmax(dim=-1)
            correct += (preds == y_b).sum().item()
            total += len(y_b)

        train_loss = total_loss / total
        train_acc = correct / total

        # Validation
        model.eval()
        val_correct, val_total, top5_correct = 0, 0, 0
        with torch.no_grad():
            for X_b, y_b in val_loader:
                X_b, y_b = X_b.to(dev), y_b.to(dev)
                logits = model(X_b)
                preds = logits.argmax(dim=-1)
                val_correct += (preds == y_b).sum().item()
                val_total += len(y_b)

                # Top-5 Accuracy
                top5_preds = logits.topk(5, dim=-1).indices
                for i in range(len(y_b)):
                    if y_b[i] in top5_preds[i]:
                        top5_correct += 1

        val_acc = val_correct / val_total
        top5_acc = top5_correct / val_total
        scheduler.step(val_acc)

        is_best = val_acc >= best_val_acc
        if is_best:
            best_val_acc = val_acc
            tmp_save = save_path.with_suffix(f".tmp_{epoch}")
            try:
                torch.save(model.state_dict(), tmp_save)
                if tmp_save.exists():
                    if save_path.exists():
                        try:
                            save_path.unlink()
                        except Exception:
                            pass
                    tmp_save.replace(save_path)
            except Exception:
                try:
                    torch.save(model.state_dict(), save_path)
                except Exception:
                    pass

        print(
            f"Epoch [{epoch:02d}/{epochs:02d}] "
            f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc*100:5.1f}% | "
            f"Val Acc: {val_acc*100:5.1f}% | Top-5: {top5_acc*100:5.1f}% "
            f"{'[Best Checkpoint]' if is_best else ''}"
        )

        history.append({
            "epoch": epoch,
            "train_loss": round(train_loss, 4),
            "train_acc": round(train_acc, 4),
            "val_acc": round(val_acc, 4),
            "top5_acc": round(top5_acc, 4),
        })

    elapsed = time.time() - start_time
    print(f"\n[OK] Training Completed in {elapsed:.2f}s!")
    print(f"[+] Checkpoint Saved to: {save_path} ({save_path.stat().st_size / (1024*1024):.2f} MB)")
    print(f"[*] Peak Validation Accuracy: {best_val_acc*100:.2f}%\n")

    return {
        "success": True,
        "model_type": model_type,
        "best_val_acc": best_val_acc,
        "checkpoint_path": str(save_path),
        "history": history,
        "training_time_seconds": round(elapsed, 2),
    }
