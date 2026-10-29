"""
Dense MediaPipe Landmark Extraction for:
83. big large -> LARGE
84. small little -> SMALL
85. slow -> SLOW
86. fast -> FAST
"""

import os
import sys
import glob
import json
import uuid
import cv2
import numpy as np
from datetime import datetime

BACKEND_DIR = os.path.abspath(os.path.dirname(__file__))
DOWNLOADS_DIR = r"C:\Users\UJJWAL SINGH\Downloads"
RECORDINGS_BASE = os.path.join(BACKEND_DIR, "data", "isl_recordings")

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

NEW_SOURCES = {
    "LARGE": os.path.join(DOWNLOADS_DIR, "83. big large"),
    "SMALL": os.path.join(DOWNLOADS_DIR, "84. small little"),
    "SLOW": os.path.join(DOWNLOADS_DIR, "85. slow"),
    "FAST": os.path.join(DOWNLOADS_DIR, "86. fast"),
}

def extract_all():
    for sign_label, folder in NEW_SOURCES.items():
        if not os.path.exists(folder):
            print(f"Directory not found: {folder}")
            continue

        target_dir = os.path.join(RECORDINGS_BASE, sign_label)
        os.makedirs(target_dir, exist_ok=True)

        raw_files = [os.path.join(folder, f) for f in os.listdir(folder) if f.lower().endswith(('.mov', '.mp4'))]
        unique_files = sorted(list({os.path.normcase(os.path.abspath(f)): f for f in raw_files}.values()))
        print(f"\nProcessing {sign_label}: {len(unique_files)} unique videos in '{folder}'...")

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
                        if pts[0]["y"] <= 0.86:
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
                sample_id = f"sample_{sign_label}_{stem}_{uid}"
                record = {
                    "sample_id": sample_id,
                    "sign_label": sign_label,
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

        print(f"  -> {sign_label}: Saved {saved_count}/{len(unique_files)} recordings ({total_frames} valid active frames).")

if __name__ == "__main__":
    extract_all()
