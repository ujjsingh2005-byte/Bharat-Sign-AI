import sys
from pathlib import Path
sys.path.append(r"c:\Users\UJJWAL SINGH\OneDrive\Desktop\Bharat-Sign-AI-3-Sign-Working\zip\backend")

import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from app.ai.include.weights_manager import WEIGHTS_DIR
import numpy as np

hand_model = WEIGHTS_DIR / "hand_landmarker.task"
pose_model = WEIGHTS_DIR / "pose_landmarker.task"

h_opts = vision.HandLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=str(hand_model)),
    num_hands=2,
    min_hand_detection_confidence=0.25,
    min_tracking_confidence=0.25,
)
hand_detector = vision.HandLandmarker.create_from_options(h_opts)

pose_opts = vision.PoseLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=str(pose_model)),
    min_pose_detection_confidence=0.25,
    min_tracking_confidence=0.25,
)
pose_detector = vision.PoseLandmarker.create_from_options(pose_opts)

cap = cv2.VideoCapture(r"C:\Users\UJJWAL SINGH\Downloads\adjective 1file\MVI_9699.MOV")
frame_idx = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    frame_idx += 1
    if 12 <= frame_idx <= 35 and frame_idx % 2 == 0:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        h_res = hand_detector.detect(mp_img)
        p_res = pose_detector.detect(mp_img)
        
        nose_y = p_res.pose_landmarks[0][0].y if p_res.pose_landmarks else 0
        chin_y = nose_y + 0.10
        
        hands_str = []
        if h_res.hand_landmarks:
            for idx, hlms in enumerate(h_res.hand_landmarks):
                lbl = h_res.handedness[idx][0].category_name
                # wrist, thumb tip (4), index tip (8), mid tip (12), ring tip (16), pinky tip (20)
                w = hlms[0]
                t = hlms[4]
                i = hlms[8]
                m = hlms[12]
                p = hlms[20]
                
                # Finger extension check: distance from wrist to tip vs wrist to mcp
                i_ext = i.y < hlms[6].y
                m_ext = m.y < hlms[10].y
                r_ext = hlms[16].y < hlms[14].y
                p_ext = p.y < hlms[18].y
                t_ext = abs(t.x - w.x) > 0.05
                
                hands_str.append(f"{lbl}: W=({w.x:.2f},{w.y:.2f}) [idx_ext={i_ext}, mid_ext={m_ext}, ring_ext={r_ext}, pky_ext={p_ext}, thb_ext={t_ext}]")
        print(f"F{frame_idx:02d} (chin_y~{chin_y:.2f}): {' | '.join(hands_str)}")
cap.release()
