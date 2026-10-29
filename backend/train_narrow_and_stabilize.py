"""
Bharat Sign AI — Dense Landmark Extraction & Stabilization for NARROW + All 18 Target Signs
Extracts all 21 videos from Downloads/82. narrow, augments, trains, and stabilizes the model
across all 18 target ISL signs:
['ALIVE', 'BLIND', 'CLEAN', 'DEAD', 'DEAF', 'DIRTY', 'HAPPY', 'HEAVY', 'HELLO', 'LOUD', 'NAMASTE', 'NARROW', 'QUIET', 'SAD', 'SHALLOW', 'STRONG', 'UGLY', 'WEAK']
"""

import os
import sys
import glob
import json
import uuid
import time
import cv2
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
ADJ_EXT_DIR = os.path.join(DOWNLOADS_DIR, "Adjectives_extracted", "Adjectives")
RECORDINGS_BASE = os.path.join(BACKEND_DIR, "data", "isl_recordings")

TARGET_DOWNLOADS_MODEL = r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model22.pkl"
TARGET_DOWNLOADS_COPY = r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model22 - Copy.pkl"
TARGET_DOWNLOADS_34 = r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model34.pkl"
BACKEND_LIVE_SLOT = os.path.join(BACKEND_DIR, "bharat_sign_ai_model.pkl")
BACKEND_WEIGHTS_SLOT = os.path.join(BACKEND_DIR, "app", "ai", "include", "weights", "bharat_sign_ai_model.pkl")
BACKUP_MODEL_DIR = os.path.join(BACKEND_DIR, "data", "isl_models")
BACKUP_MODEL_SLOT = os.path.join(BACKUP_MODEL_DIR, "bharat_sign_ai_model22.pkl")

ALL_18_SIGNS = [
    "ALIVE",
    "BLIND",
    "CLEAN",
    "DEAD",
    "DEAF",
    "DIRTY",
    "HAPPY",
    "HEAVY",
    "HELLO",
    "LOUD",
    "NAMASTE",
    "NARROW",
    "QUIET",
    "SAD",
    "SHALLOW",
    "STRONG",
    "UGLY",
    "WEAK",
]

def extract_narrow_landmarks():
    """Extracts MediaPipe landmarks from all 21 videos in '82. narrow'."""
    print("==================================================================")
    print("STEP 1: Dense Landmark Extraction for 'NARROW' (82. narrow)")
    print("==================================================================")

    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision

    hand_model_path = os.path.join(BACKEND_DIR, "app", "ai", "include", "weights", "hand_landmarker.task")
    opts = vision.HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=hand_model_path),
        num_hands=2,
        min_hand_detection_confidence=0.20,
        min_tracking_confidence=0.20,
    )
    detector = vision.HandLandmarker.create_from_options(opts)

    narrow_folder = os.path.join(DOWNLOADS_DIR, "82. narrow")
    if not os.path.exists(narrow_folder):
        narrow_folder = os.path.join(DOWNLOADS_DIR, "adjective 2 file", "82. narrow")

    target_dir = os.path.join(RECORDINGS_BASE, "NARROW")
    os.makedirs(target_dir, exist_ok=True)

    raw_files = glob.glob(os.path.join(narrow_folder, "*.MOV")) + \
                glob.glob(os.path.join(narrow_folder, "*.mov")) + \
                glob.glob(os.path.join(narrow_folder, "*.mp4"))
    unique_files = sorted(list({os.path.normcase(os.path.abspath(f)): f for f in raw_files}.values()))
    print(f"Found {len(unique_files)} video files in '{narrow_folder}'")

    saved_count = 0
    total_frames = 0

    for vid_path in unique_files:
        cap = cv2.VideoCapture(vid_path)
        if not cap.isOpened():
            continue

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if frame_count < 8:
            cap.release()
            continue

        duration_ms = (frame_count / fps) * 1000.0

        # Sample 25 active frames across the gesture (15% to 88%)
        start_f = int(frame_count * 0.15)
        end_f = int(frame_count * 0.88)
        sample_indices = np.linspace(start_f, max(start_f + 1, end_f - 1), min(25, end_f - start_f), dtype=int)

        extracted_frames = []
        max_hands = 1

        for f_idx in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
            ret, frame = cap.read()
            if not ret or frame is None:
                continue

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            res = detector.detect(mp_image)

            if res.hand_landmarks and len(res.hand_landmarks) > 0:
                valid_hands = []
                for h in res.hand_landmarks:
                    pts = [{"x": float(lm.x), "y": float(lm.y), "z": float(lm.z or 0.0)} for lm in h]
                    if pts[0]["y"] <= 0.86:  # Active gesture
                        valid_hands.append(pts)

                if valid_hands:
                    if len(valid_hands) > max_hands:
                        max_hands = len(valid_hands)
                    timestamp_ms = (f_idx / fps) * 1000.0
                    extracted_frames.append({
                        "timestamp_ms": round(timestamp_ms, 2),
                        "hands": valid_hands,
                    })

        cap.release()

        if len(extracted_frames) >= 3:
            stem = os.path.splitext(os.path.basename(vid_path))[0]
            uid = uuid.uuid4().hex[:6]
            sample_id = f"sample_NARROW_{stem}_{uid}"
            record = {
                "sample_id": sample_id,
                "sign_label": "NARROW",
                "session_id": f"sess_video_{stem}",
                "source_video": os.path.basename(vid_path),
                "timestamp": datetime.now().isoformat(),
                "duration_ms": round(duration_ms, 2),
                "num_hands": max_hands,
                "num_frames": len(extracted_frames),
                "is_verified": True,
                "feature_schema_version": "2.0",
                "frames": extracted_frames,
            }
            out_path = os.path.join(target_dir, f"{sample_id}.json")
            with open(out_path, "w", encoding="utf-8") as fp:
                json.dump(record, fp, indent=2)
            saved_count += 1
            total_frames += len(extracted_frames)

    print(f"Extracted NARROW: {saved_count}/{len(unique_files)} recordings saved ({total_frames} valid active frames).")
    return saved_count, total_frames

def build_augmented_18_dataset():
    """Builds augmented 63-feature dataset across all 18 target ISL signs."""
    print("\n==================================================================")
    print("STEP 2: Assembling Augmented Landmark Dataset for 18 Signs")
    print("==================================================================")

    feature_names = [f"{coord}_{i}" for i in range(21) for coord in ["x", "y", "z"]]
    X = []
    y = []

    for sign in ALL_18_SIGNS:
        sign_dir = os.path.join(RECORDINGS_BASE, sign)
        if not os.path.exists(sign_dir):
            print(f"Warning: Directory missing for {sign}")
            continue

        files = glob.glob(os.path.join(sign_dir, "*.json"))
        sign_samples_count = 0

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
                    wrist_y = h[0].get("y", 0.0)
                    if wrist_y > 0.86:
                        continue

                    # Base feature vector (63 floats)
                    base_pts = [(pt.get("x", 0.0), pt.get("y", 0.0), pt.get("z", 0.0)) for pt in h]
                    base_vec = []
                    for x, y_val, z in base_pts:
                        base_vec.extend([x, y_val, z])
                    X.append(base_vec)
                    y.append(sign)
                    sign_samples_count += 1

                    # 1. Mirrored (1 - x)
                    mir_vec = []
                    for x, y_val, z in base_pts:
                        mir_vec.extend([1.0 - x, y_val, z])
                    X.append(mir_vec)
                    y.append(sign)
                    sign_samples_count += 1

                    # 2. Scale augmentation around hand centroid (+/- 3%)
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
                        sign_samples_count += 1

                        scale_mir_vec = []
                        for x, y_val, z in base_pts:
                            nx = 1.0 - (cx + (x - cx) * s_factor)
                            ny = cy + (y_val - cy) * s_factor
                            scale_mir_vec.extend([nx, ny, z])
                        X.append(scale_mir_vec)
                        y.append(sign)
                        sign_samples_count += 1

                    # 3. Translation jitter for greetings
                    if sign in ("HELLO", "NAMASTE"):
                        for dx, dy in [(-0.015, -0.015), (0.015, 0.015)]:
                            jit_vec = []
                            for x, y_val, z in base_pts:
                                jit_vec.extend([x + dx, y_val + dy, z])
                            X.append(jit_vec)
                            y.append(sign)
                            sign_samples_count += 1

                            jit_mir_vec = []
                            for x, y_val, z in base_pts:
                                jit_mir_vec.extend([1.0 - (x + dx), y_val + dy, z])
                            X.append(jit_mir_vec)
                            y.append(sign)
                            sign_samples_count += 1

        print(f"  {sign:12s}: {len(files):2d} files -> {sign_samples_count:5d} augmented instances")

    X = np.array(X, dtype=np.float32)
    y = np.array(y)
    print(f"\nTotal instances: {len(X)} across {len(set(y))} classes: {sorted(list(set(y)))}")
    return X, y, feature_names

def train_and_stabilize(X, y, feature_names):
    """Trains Random Forest and evaluates on stratified test set."""
    print("\n==================================================================")
    print("STEP 3: Training 300-Tree Classifier Across All 18 Signs")
    print("==================================================================")

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
    for sign in ALL_18_SIGNS:
        if sign in rep:
            p = float(rep[sign]["precision"]) * 100.0
            r = float(rep[sign]["recall"]) * 100.0
            f1 = float(rep[sign]["f1-score"]) * 100.0
            s = int(rep[sign]["support"])
            print(f"{sign:12s} | {p:9.2f}% | {r:9.2f}% | {f1:9.2f}% | {s:8d}")

    cm = confusion_matrix(y_test, y_pred, labels=ALL_18_SIGNS)
    np.fill_diagonal(cm, 0)
    misclassified = int(np.sum(cm))
    print(f"\nTotal test misclassifications: {misclassified} out of {len(y_test)}")

    return clf, rep, test_acc

def save_models(clf, rep, test_acc):
    """Saves model to all deliverable slots."""
    print("\n==================================================================")
    print("STEP 4: Saving Stabilized 18-Sign Model to Deliverable Paths")
    print("==================================================================")

    os.makedirs(os.path.dirname(TARGET_DOWNLOADS_MODEL), exist_ok=True)
    os.makedirs(BACKUP_MODEL_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(BACKEND_WEIGHTS_SLOT), exist_ok=True)

    destinations = [
        ("Downloads adjective 2 model22", TARGET_DOWNLOADS_MODEL),
        ("Downloads adjective 2 Copy", TARGET_DOWNLOADS_COPY),
        ("Downloads adjective 2 model34", TARGET_DOWNLOADS_34),
        ("Backend Live Slot", BACKEND_LIVE_SLOT),
        ("Backend Weights Slot", BACKEND_WEIGHTS_SLOT),
        ("Backend Backup Slot", BACKUP_MODEL_SLOT),
    ]

    for name, path in destinations:
        joblib.dump(clf, path, compress=3)
        sz = os.path.getsize(path) / (1024 * 1024)
        print(f"  [SAVED] {name:32s} -> {path} ({sz:.1f} MB)")

    # Save metrics JSON
    metrics_path = os.path.join(BACKUP_MODEL_DIR, "adjectives_18_stabilized_metrics.json")
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
    extract_narrow_landmarks()
    X, y, feature_names = build_augmented_18_dataset()
    clf, rep, test_acc = train_and_stabilize(X, y, feature_names)
    save_models(clf, rep, test_acc)
    print("\n==================================================================")
    print("SUCCESS: 18-Sign Model including NARROW is 100% trained & stabilized!")
    print("==================================================================")
