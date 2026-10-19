import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands

vpath = r'C:\Users\UJJWAL SINGH\Downloads\adjective 1file\MVI_9699.MOV'
cap = cv2.VideoCapture(vpath)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5)
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)

print(f"Detailed Analysis of MVI_9699.MOV ({total} frames)...")

frame_idx = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res_pose = pose.process(rgb)
    res_hands = hands.process(rgb)
    
    h_info = []
    if res_hands.multi_hand_landmarks:
        for idx, handedness in enumerate(res_hands.multi_handedness):
            lbl = handedness.classification[0].label
            hlm = res_hands.multi_hand_landmarks[idx]
            wx, wy = hlm.landmark[0].x, hlm.landmark[0].y
            ix, iy = hlm.landmark[8].x, hlm.landmark[8].y
            mx, my = hlm.landmark[12].x, hlm.landmark[12].y
            tx, ty = hlm.landmark[4].x, hlm.landmark[4].y
            p0 = np.array([hlm.landmark[0].x, hlm.landmark[0].y, hlm.landmark[0].z])
            p5 = np.array([hlm.landmark[5].x, hlm.landmark[5].y, hlm.landmark[5].z])
            p17 = np.array([hlm.landmark[17].x, hlm.landmark[17].y, hlm.landmark[17].z])
            normal = np.cross(p5 - p0, p17 - p0)
            normal = normal / (np.linalg.norm(normal) + 1e-6)
            h_info.append(f"{lbl}: W=({wx:.2f}, {wy:.2f}), nZ={normal[2]:.2f}, nY={normal[1]:.2f}")
            
    p_info = ""
    if res_pose.pose_landmarks:
        lm = res_pose.pose_landmarks.landmark
        ls, rs = lm[11], lm[12]
        le, re = lm[13], lm[14]
        lw, rw = lm[15], lm[16]
        nose = lm[0]
        p_info = f"Nose=({nose.x:.2f},{nose.y:.2f}), RW=({rw.x:.2f},{rw.y:.2f}), LW=({lw.x:.2f},{lw.y:.2f})"
        
    if frame_idx % 2 == 0:
        delim = " | "
        print(f"F{frame_idx:02d}: {p_info} || {delim.join(h_info)}")
    frame_idx += 1

cap.release()
print("Analysis complete!")
