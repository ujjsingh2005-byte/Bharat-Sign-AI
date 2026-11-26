"""
Bharat Sign AI - Master 23-Sign Training, Calibration & Verification Pipeline
Integrates:
- Authentic MediaPipe landmarks for HELLO (21 takes, 525 frames)
- Authentic MediaPipe landmarks for NARROW (all 21 MOV takes from Downloads/82. narrow)
- Complete 23 signs: ALIVE, BEAUTIFUL, BLIND, CLEAN, DEAD, DEAF, DIRTY, FAST,
  HAPPY, HEAVY, HELLO, LARGE, LOUD, NAMASTE, NARROW, QUIET, SAD, SHALLOW, SLOW,
  SMALL, STRONG, UGLY, WEAK
- Trains 300-tree balanced RandomForestClassifier on ~37,512 augmented samples
- Evaluates test accuracy, per-class metrics, and tests user reference photo
- Deploys model weights across all backend, zip, and downloads directories
"""

import os
import sys
import glob
import json
import time
import shutil
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BACKEND_DIR, ".."))
RECORDINGS_BASE = os.path.join(BACKEND_DIR, "data", "isl_recordings")
DOWNLOADS_DIR = r"C:\Users\UJJWAL SINGH\Downloads"
ADJ_2_DIR = os.path.join(DOWNLOADS_DIR, "adjective 2 file")

ALL_23_SIGNS = [
    "ALIVE",
    "BEAUTIFUL",
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

TARGET_SAVE_PATHS = [
    # Primary backend paths
    os.path.join(BACKEND_DIR, "bharat_sign_ai_model.pkl"),
    os.path.join(BACKEND_DIR, "app", "ai", "include", "weights", "bharat_sign_ai_model.pkl"),
    os.path.join(BACKEND_DIR, "data", "isl_models", "bharat_sign_ai_model22.pkl"),
    # zip/backend paths
    os.path.join(ROOT_DIR, "zip", "backend", "bharat_sign_ai_model.pkl"),
    os.path.join(ROOT_DIR, "zip", "backend", "app", "ai", "include", "weights", "bharat_sign_ai_model.pkl"),
    os.path.join(ROOT_DIR, "zip", "backend", "data", "isl_models", "bharat_sign_ai_model22.pkl"),
    # Downloads adjective 2 file slots
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model39.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model37.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model36.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model (1)36.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model35.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model34.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model22.pkl"),
    os.path.join(ADJ_2_DIR, "bharat_sign_ai_model22 - Copy.pkl"),
]


def build_dataset():
    feature_names = [f"{coord}_{i}" for i in range(21) for coord in ["x", "y", "z"]]
    X = []
    y = []

    print("\n[STEP 1/5] Assembling augmented dataset across all 23 signs...")
    for sign in ALL_23_SIGNS:
        sign_dir = os.path.join(RECORDINGS_BASE, sign)
        if not os.path.exists(sign_dir):
            print(f"  [WARN] Missing directory for: {sign}")
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
                    # Reject idle/resting wrist position
                    wrist_y = h[0].get("y", 0.0)
                    if wrist_y > 0.86:
                        continue

                    base_pts = [(pt.get("x", 0.0), pt.get("y", 0.0), pt.get("z", 0.0)) for pt in h]
                    base_vec = []
                    for x, y_val, z in base_pts:
                        base_vec.extend([x, y_val, z])
                    X.append(base_vec)
                    y.append(sign)
                    count += 1

                    # 1. Mirrored (horizontal flip)
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
                        scale_factors = [0.92, 0.96, 1.04, 1.08]

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
                        for dx, dy in [(-0.02, -0.015), (0.02, 0.015), (-0.015, 0.02), (0.015, -0.02)]:
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

        print(f"  {sign:12s}: {len(files):2d} files -> {count:5d} augmented instances")

    X = np.array(X, dtype=np.float32)
    y = np.array(y)
    print(f"\n[DATASET SUMMARY] Total: {len(X)} instances across {len(set(y))} classes: {sorted(list(set(y)))}")
    return X, y, feature_names


def train_and_evaluate(X, y, feature_names):
    print("\n[STEP 2/5] Stratified Train/Test Split (85% Train / 15% Test)...")
    df_X = pd.DataFrame(X, columns=feature_names)
    X_train, X_test, y_train, y_test = train_test_split(
        df_X, y, test_size=0.15, random_state=42, stratify=y
    )
    print(f"  Train samples: {len(X_train)} | Test samples: {len(X_test)}")

    print("\n[STEP 3/5] Training Balanced RandomForestClassifier (300 estimators, max_depth=32)...")
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
    print(f"  Fitting completed in {fit_time:.2f} seconds.")

    clf.feature_names_in_ = np.array(feature_names, dtype=object)

    y_pred = clf.predict(X_test)
    test_acc = float(np.mean(y_pred == y_test) * 100.0)
    print(f"\n=== OVERALL TEST ACCURACY: {test_acc:.2f}% ===")

    rep = classification_report(y_test, y_pred, output_dict=True)
    print("\nPer-Class Classification Report:")
    print(f"{'Class':12s} | {'Precision':>10s} | {'Recall':>10s} | {'F1-Score':>10s} | {'Support':>8s}")
    print("-" * 62)
    for sign in ALL_23_SIGNS:
        if sign in rep:
            p = float(rep[sign]["precision"]) * 100.0
            r = float(rep[sign]["recall"]) * 100.0
            f1 = float(rep[sign]["f1-score"]) * 100.0
            s = int(rep[sign]["support"])
            print(f"{sign:12s} | {p:9.2f}% | {r:9.2f}% | {f1:9.2f}% | {s:8d}")

    cm = confusion_matrix(y_test, y_pred, labels=ALL_23_SIGNS)
    np.fill_diagonal(cm, 0)
    misclassified = int(np.sum(cm))
    print(f"\nTotal test misclassifications: {misclassified} out of {len(y_test)}")

    return clf, rep, test_acc


def test_user_reference_sample(clf, feature_names):
    print("\n[STEP 4/5] Testing Authentic User Reference Hand ('3. HELLO')...")
    # Load first authentic sample
    hello_sample_path = os.path.join(RECORDINGS_BASE, "HELLO", "sample_HELLO_MVI_HELLO_01_67a121.json")
    if not os.path.exists(hello_sample_path):
        print(f"  [WARN] {hello_sample_path} not found.")
        return

    with open(hello_sample_path, "r", encoding="utf-8") as f:
        rec = json.load(f)

    hands = rec["frames"][0]["hands"][0]
    vals = []
    for pt in hands:
        vals.extend([pt["x"], pt["y"], pt["z"]])

    df_sample = pd.DataFrame([vals], columns=feature_names)
    probs = clf.predict_proba(df_sample)[0]
    pred_idx = np.argmax(probs)
    pred_class = clf.classes_[pred_idx]
    pred_conf = probs[pred_idx]

    print(f"  Live Test Result:")
    print(f"    Predicted Sign: {pred_class}")
    print(f"    Confidence:     {pred_conf * 100.0:.2f}%")
    print(f"    Top 3 Probs:    {sorted([(c, round(p, 4)) for c, p in zip(clf.classes_, probs)], key=lambda x: -x[1])[:3]}")


def save_and_deploy(clf, rep, test_acc):
    print("\n[STEP 5/5] Deploying Model to all 14 target slots...")
    for path in TARGET_SAVE_PATHS:
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            joblib.dump(clf, path, compress=3)
            sz = os.path.getsize(path) / (1024 * 1024)
            print(f"  [SAVED] {os.path.basename(path):32s} -> {path} ({sz:.1f} MB)")
        except Exception as e:
            print(f"  [ERROR saving {path}]: {e}")

    # Save metrics JSON
    metrics_path = os.path.join(BACKEND_DIR, "data", "isl_models", "adjectives_23_master_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "model": "bharat_sign_ai_model.pkl",
            "classes": [str(c) for c in clf.classes_],
            "num_classes": len(clf.classes_),
            "accuracy": round(test_acc, 2),
            "report": rep,
            "timestamp": datetime.now().isoformat(),
        }, f, indent=2)
    print(f"  [SAVED] Metrics JSON -> {metrics_path}")


if __name__ == "__main__":
    t_start = time.time()
    X, y, feature_names = build_dataset()
    clf, rep, test_acc = train_and_evaluate(X, y, feature_names)
    test_user_reference_sample(clf, feature_names)
    save_and_deploy(clf, rep, test_acc)
    total_time = time.time() - t_start
    print(f"\n=======================================================")
    print(f"MASTER 23-SIGN PIPELINE COMPLETE in {total_time:.1f}s!")
    print(f"=======================================================")
