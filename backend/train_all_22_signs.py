"""
Bharat Sign AI — Complete 22-Sign Landmark Training & Stabilization
Includes all verified Greetings and all Adjectives:
ALIVE, BLIND, CLEAN, DEAD, DEAF, DIRTY, FAST, HAPPY, HEAVY, HELLO, LARGE, LOUD,
NAMASTE, NARROW, QUIET, SAD, SHALLOW, SLOW, SMALL, STRONG, UGLY, WEAK
"""

import os
import sys
import glob
import json
import time
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

DOWNLOADS_DIR = r"C:\Users\UJJWAL SINGH\Downloads"
RECORDINGS_BASE = os.path.join(BACKEND_DIR, "data", "isl_recordings")

ALL_22_SIGNS = [
    "ALIVE",
    "BLIND",
    "CLEAN",
    "DEAD",
    "DEAF",
    "DIRTY",
    "FAST",
    "HAPPY",
    "HEAVY",
    "HELLO",
    "LARGE",
    "LOUD",
    "NAMASTE",
    "NARROW",
    "QUIET",
    "SAD",
    "SHALLOW",
    "SLOW",
    "SMALL",
    "STRONG",
    "UGLY",
    "WEAK",
]

# Deliverable destination paths in adjective 2 file and backend slots
ADJ_2_DIR = os.path.join(DOWNLOADS_DIR, "adjective 2 file")
TARGET_PATHS = [
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model (1)36.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model36.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model35.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model34.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model22.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model22 - Copy.pkl"),
    os.path.join(BACKEND_DIR, "bharat_sign_ai_model.pkl"),
    os.path.join(BACKEND_DIR, "app", "ai", "include", "weights", "bharat_sign_ai_model.pkl"),
    os.path.join(BACKEND_DIR, "data", "isl_models", "bharat_sign_ai_model22.pkl"),
]

def build_dataset():
    feature_names = [f"{coord}_{i}" for i in range(21) for coord in ["x", "y", "z"]]
    X = []
    y = []

    print("\nAssembling augmented dataset across all 22 signs...")
    for sign in ALL_22_SIGNS:
        sign_dir = os.path.join(RECORDINGS_BASE, sign)
        if not os.path.exists(sign_dir):
            print(f"Warning: Directory missing for {sign}")
            continue

        files = glob.glob(os.path.join(sign_dir, "*.json"))
        count = 0

        for fpath in files:
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    rec = json.load(f)
            except Exception:
                continue

            frames = rec.get("frames", [])
            for fr in frames:
                hands = fr.get("hands", [])
                if not hands:
                    continue

                for h in hands:
                    if len(h) < 21:
                        continue
                    if h[0].get("y", 0.0) > 0.86:
                        continue

                    base_pts = [(pt.get("x", 0.0), pt.get("y", 0.0), pt.get("z", 0.0)) for pt in h]
                    base_vec = []
                    for x, y_val, z in base_pts:
                        base_vec.extend([x, y_val, z])
                    X.append(base_vec)
                    y.append(sign)
                    count += 1

                    # 1. Mirrored
                    mir_vec = []
                    for x, y_val, z in base_pts:
                        mir_vec.extend([1.0 - x, y_val, z])
                    X.append(mir_vec)
                    y.append(sign)
                    count += 1

                    # 2. Scale augmentation around hand centroid
                    xs = [p[0] for p in base_pts]
                    ys = [p[1] for p in base_pts]
                    cx = sum(xs) / 21.0
                    cy = sum(ys) / 21.0

                    scale_factors = [0.96, 1.04]
                    if sign in ("HELLO", "NAMASTE"):
                        scale_factors = [0.94, 0.97, 1.03, 1.06]

                    for s_factor in scale_factors:
                        scale_vec = []
                        for x, y_val, z in base_pts:
                            nx = cx + (x - cx) * s_factor
                            ny = cy + (y_val - cy) * s_factor
                            scale_vec.extend([nx, ny, z])
                        X.append(scale_vec)
                        y.append(sign)
                        count += 1

                        scale_mir_vec = []
                        for x, y_val, z in base_pts:
                            nx = 1.0 - (cx + (x - cx) * s_factor)
                            ny = cy + (y_val - cy) * s_factor
                            scale_mir_vec.extend([nx, ny, z])
                        X.append(scale_mir_vec)
                        y.append(sign)
                        count += 1

                    # 3. Translation jitter for greetings
                    if sign in ("HELLO", "NAMASTE"):
                        for dx, dy in [(-0.015, -0.015), (0.015, 0.015)]:
                            jit_vec = []
                            for x, y_val, z in base_pts:
                                jit_vec.extend([x + dx, y_val + dy, z])
                            X.append(jit_vec)
                            y.append(sign)
                            count += 1

                            jit_mir_vec = []
                            for x, y_val, z in base_pts:
                                jit_mir_vec.extend([1.0 - (x + dx), y_val + dy, z])
                            X.append(jit_mir_vec)
                            y.append(sign)
                            count += 1

        print(f"  {sign:12s}: {len(files):2d} files -> {count:5d} instances")

    X = np.array(X, dtype=np.float32)
    y = np.array(y)
    print(f"\nTotal instances: {len(X)} across {len(set(y))} classes: {sorted(list(set(y)))}")
    return X, y, feature_names

def train_and_evaluate(X, y, feature_names):
    df_X = pd.DataFrame(X, columns=feature_names)
    X_train, X_test, y_train, y_test = train_test_split(
        df_X, y, test_size=0.15, random_state=42, stratify=y
    )
    print(f"Train samples: {len(X_train)} | Test samples: {len(X_test)}")

    clf = RandomForestClassifier(
        n_estimators=300,
        max_depth=32,
        min_samples_split=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    t0 = time.time()
    clf.fit(X_train, y_train)
    fit_time = time.time() - t0
    print(f"Fitting completed in {fit_time:.2f} seconds.")

    clf.feature_names_in_ = np.array(feature_names, dtype=object)

    y_pred = clf.predict(X_test)
    test_acc = float(np.mean(y_pred == y_test) * 100.0)
    print(f"\n=== OVERALL TEST ACCURACY: {test_acc:.2f}% ===")

    rep = classification_report(y_test, y_pred, output_dict=True)
    print("\nPer-Class Classification Report:")
    print(f"{'Class':12s} | {'Precision':>10s} | {'Recall':>10s} | {'F1-Score':>10s} | {'Support':>8s}")
    print("-" * 62)
    for sign in ALL_22_SIGNS:
        if sign in rep:
            p = float(rep[sign]["precision"]) * 100.0
            r = float(rep[sign]["recall"]) * 100.0
            f1 = float(rep[sign]["f1-score"]) * 100.0
            s = int(rep[sign]["support"])
            print(f"{sign:12s} | {p:9.2f}% | {r:9.2f}% | {f1:9.2f}% | {s:8d}")

    cm = confusion_matrix(y_test, y_pred, labels=ALL_22_SIGNS)
    np.fill_diagonal(cm, 0)
    misclassified = int(np.sum(cm))
    print(f"\nTotal test misclassifications: {misclassified} out of {len(y_test)}")

    return clf, rep, test_acc

def save_all(clf, rep, test_acc):
    print("\nSaving 22-Sign Model to all target deliverable paths...")
    for path in TARGET_PATHS:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(clf, path, compress=3)
        sz = os.path.getsize(path) / (1024 * 1024)
        print(f"  [SAVED] {os.path.basename(path):32s} -> {path} ({sz:.1f} MB)")

    # Save metrics JSON
    metrics_path = os.path.join(BACKEND_DIR, "data", "isl_models", "adjectives_22_stabilized_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "model": "bharat_sign_ai_model22.pkl",
            "classes": [str(c) for c in clf.classes_],
            "num_classes": len(clf.classes_),
            "accuracy": round(test_acc, 2),
            "report": rep,
            "timestamp": datetime.now().isoformat(),
        }, f, indent=2)
    print(f"  [SAVED] Metrics JSON -> {metrics_path}")

if __name__ == "__main__":
    X, y, feature_names = build_dataset()
    clf, rep, test_acc = train_and_evaluate(X, y, feature_names)
    save_all(clf, rep, test_acc)
    print("\nSUCCESS: 22-Sign Model is 100% trained & stabilized!")
