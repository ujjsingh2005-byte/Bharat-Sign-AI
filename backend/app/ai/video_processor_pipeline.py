"""
Video Processor & Landmark Extraction Pipeline
Detects and tracks hands and body pose, extracts temporal 134-D features,
generates skeletal preview videos, and computes 3D avatar bone retargeting curves.
"""

import os
import cv2
import json
import time
import math
import numpy as np
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from app.database import get_db, VIDEOS_DIR, PREVIEWS_DIR, LANDMARKS_DIR
from app.ai.include.weights_manager import WEIGHTS_DIR

HAND_MODEL_PATH = WEIGHTS_DIR / "hand_landmarker.task"
POSE_MODEL_PATH = WEIGHTS_DIR / "pose_landmarker.task"


class VideoProcessorPipeline:
    """
    Production-grade pipeline for processing raw sign language videos:
    - Frame extraction and quality check
    - MediaPipe Holistic (Hand + Pose) landmark extraction
    - Skeletal preview video rendering with visual tracking indicators
    - 3D Avatar kinematic bone angle solver
    - Normalized feature extraction for PyTorch training
    """

    def __init__(self, sequence_length: int = 16):
        self.sequence_length = sequence_length
        self._init_models()

    def _init_models(self):
        self.hand_detector = None
        self.pose_detector = None

        if HAND_MODEL_PATH.exists():
            try:
                h_opts = vision.HandLandmarkerOptions(
                    base_options=python.BaseOptions(model_asset_path=str(HAND_MODEL_PATH)),
                    num_hands=2,
                    min_hand_detection_confidence=0.35,
                    min_tracking_confidence=0.35,
                )
                self.hand_detector = vision.HandLandmarker.create_from_options(h_opts)
            except Exception as e:
                print(f"[VideoProcessorPipeline] Warning: Hand detector init failed: {e}")

        if POSE_MODEL_PATH.exists():
            try:
                p_opts = vision.PoseLandmarkerOptions(
                    base_options=python.BaseOptions(model_asset_path=str(POSE_MODEL_PATH)),
                    min_pose_detection_confidence=0.35,
                    min_tracking_confidence=0.35,
                )
                self.pose_detector = vision.PoseLandmarker.create_from_options(p_opts)
            except Exception as e:
                print(f"[VideoProcessorPipeline] Warning: Pose detector init failed: {e}")

    def inspect_video_metadata(self, video_path: str) -> Dict[str, Any]:
        """Reads video duration, fps, resolution, frame count, and file size."""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {
                "valid": False,
                "error": "Could not open video file.",
            }

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
        duration = frame_count / fps if fps > 0 else 0.0
        cap.release()

        file_size = os.path.getsize(video_path) if os.path.exists(video_path) else 0

        return {
            "valid": True,
            "fps": round(fps, 2),
            "frame_count": frame_count,
            "width": width,
            "height": height,
            "duration": round(duration, 2),
            "file_size": file_size,
        }

    def process_video(
        self,
        video_id: str,
        video_path: str,
        output_preview_dir: Path = PREVIEWS_DIR,
        output_landmarks_dir: Path = LANDMARKS_DIR,
    ) -> Dict[str, Any]:
        """
        Runs full end-to-end processing on a video:
        1. Frame sampling & detection
        2. MediaPipe landmark extraction (Left/Right Hands + Pose)
        3. Preview video generation with annotated skeletons
        4. Calculation of 3D Avatar arm/wrist kinematic trajectory
        5. Saving .npy features and .json kinematics
        """
        meta = self.inspect_video_metadata(video_path)
        if not meta.get("valid"):
            return {
                "success": False,
                "error": meta.get("error", "Invalid video file"),
            }

        cap = cv2.VideoCapture(video_path)
        fps = meta["fps"]
        total_frames = meta["frame_count"]
        w = meta["width"]
        h = meta["height"]

        # Prepare output preview video writer
        preview_filename = f"{video_id}_preview.mp4"
        preview_filepath = output_preview_dir / preview_filename
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        preview_writer = cv2.VideoWriter(str(preview_filepath), fourcc, min(fps, 30.0), (w, h))

        frames_data: List[Dict[str, Any]] = []
        raw_feature_sequence: List[np.ndarray] = []

        hand1_count = 0
        hand2_count = 0
        pose_count = 0
        processed_frames = 0

        # Step-stride to sample up to ~150 frames max for speed while preserving temporal fluidity
        stride = max(1, total_frames // 120) if total_frames > 120 else 1

        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % stride != 0:
                frame_idx += 1
                continue

            processed_frames += 1
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            hand_res = None
            pose_res = None

            if self.hand_detector:
                try:
                    hand_res = self.hand_detector.detect(mp_image)
                except Exception:
                    pass

            if self.pose_detector:
                try:
                    pose_res = self.pose_detector.detect(mp_image)
                except Exception:
                    pass

            # Parse hands & pose
            left_hand = None
            right_hand = None

            if hand_res and hand_res.hand_landmarks and hand_res.handedness:
                for idx, hand_lms in enumerate(hand_res.hand_landmarks):
                    cat_name = hand_res.handedness[idx][0].category_name
                    # MediaPipe mirror convention: category_name 'Right' is signer's right hand
                    if cat_name == "Left":
                        left_hand = hand_lms
                    else:
                        right_hand = hand_lms

            if right_hand is not None:
                hand1_count += 1
            if left_hand is not None:
                hand2_count += 1

            pose_lms = None
            if pose_res and pose_res.pose_landmarks and len(pose_res.pose_landmarks) > 0:
                pose_lms = pose_res.pose_landmarks[0]
                pose_count += 1

            # Render overlay annotations onto preview frame
            preview_frame = frame.copy()
            self._draw_landmarks(preview_frame, right_hand, left_hand, pose_lms, w, h)
            preview_writer.write(preview_frame)

            # Build 134-D normalized vector for training
            feat_134 = self._build_134d_vector(right_hand, left_hand, pose_lms)
            raw_feature_sequence.append(feat_134)

            # Extract 3D Avatar kinematics for this frame
            frame_kinematics = self._solve_frame_kinematics(right_hand, left_hand, pose_lms, w, h)
            frames_data.append(frame_kinematics)

            frame_idx += 1

        cap.release()
        preview_writer.release()

        # Resample features to fixed sequence length (e.g., 16 timesteps) for neural model
        if len(raw_feature_sequence) == 0:
            return {"success": False, "error": "No frames could be extracted from video."}

        indices = np.linspace(0, len(raw_feature_sequence) - 1, self.sequence_length, dtype=int)
        resampled_features = np.array([raw_feature_sequence[i] for i in indices], dtype=np.float32)

        # Save extracted .npy file
        npy_filename = f"{video_id}.npy"
        npy_path = output_landmarks_dir / npy_filename
        np.save(str(npy_path), resampled_features)

        # Build full Avatar Retargeting Kinematics data
        kinematics_data = self._compile_avatar_kinematics(frames_data, meta["duration"])
        kinematics_filename = f"{video_id}_kinematics.json"
        kinematics_path = output_landmarks_dir / kinematics_filename
        with open(kinematics_path, "w", encoding="utf-8") as f:
            json.dump(kinematics_data, f, indent=2)

        h1_pct = round((hand1_count / processed_frames) * 100, 1) if processed_frames > 0 else 0.0
        h2_pct = round((hand2_count / processed_frames) * 100, 1) if processed_frames > 0 else 0.0
        pose_pct = round((pose_count / processed_frames) * 100, 1) if processed_frames > 0 else 0.0

        return {
            "success": True,
            "video_id": video_id,
            "preview_filepath": str(preview_filepath),
            "preview_filename": preview_filename,
            "landmarks_filepath": str(npy_path),
            "landmarks_filename": npy_filename,
            "kinematics_filepath": str(kinematics_path),
            "kinematics_filename": kinematics_filename,
            "total_frames": total_frames,
            "processed_frames": processed_frames,
            "duration": meta["duration"],
            "fps": meta["fps"],
            "width": w,
            "height": h,
            "hand1_detection_pct": h1_pct,
            "hand2_detection_pct": h2_pct,
            "pose_detection_pct": pose_pct,
            "kinematics_summary": {
                "durationSeconds": kinematics_data.get("durationSeconds", meta["duration"]),
                "involvesHands": kinematics_data.get("involvesHands", "both" if (h1_pct > 20 and h2_pct > 20) else "right"),
            }
        }

    def _draw_landmarks(self, img, right_hand, left_hand, pose, w, h):
        """Draws visual skeleton on preview video frame."""
        # Draw Pose upper body lines
        if pose:
            # 11: left shoulder, 12: right shoulder, 13: left elbow, 14: right elbow, 15: left wrist, 16: right wrist
            pts = [(int(pt.x * w), int(pt.y * h)) for pt in pose]
            connections = [(11, 12), (12, 14), (14, 16), (11, 13), (13, 15)]
            for p1, p2 in connections:
                if p1 < len(pts) and p2 < len(pts):
                    cv2.line(img, pts[p1], pts[p2], (0, 255, 255), 3)
            for idx in [11, 12, 13, 14, 15, 16]:
                if idx < len(pts):
                    cv2.circle(img, pts[idx], 5, (0, 165, 255), -1)

        # Draw Right Hand (Green)
        if right_hand:
            pts = [(int(pt.x * w), int(pt.y * h)) for pt in right_hand]
            hand_conns = [
                (0, 1), (1, 2), (2, 3), (3, 4), # Thumb
                (0, 5), (5, 6), (6, 7), (7, 8), # Index
                (0, 9), (9, 10), (10, 11), (11, 12), # Middle
                (0, 13), (13, 14), (14, 15), (15, 16), # Ring
                (0, 17), (17, 18), (18, 19), (19, 20), # Pinky
            ]
            for p1, p2 in hand_conns:
                cv2.line(img, pts[p1], pts[p2], (0, 255, 0), 2)
            for p in pts:
                cv2.circle(img, p, 3, (50, 205, 50), -1)

        # Draw Left Hand (Cyan)
        if left_hand:
            pts = [(int(pt.x * w), int(pt.y * h)) for pt in left_hand]
            hand_conns = [
                (0, 1), (1, 2), (2, 3), (3, 4),
                (0, 5), (5, 6), (6, 7), (7, 8),
                (0, 9), (9, 10), (10, 11), (11, 12),
                (0, 13), (13, 14), (14, 15), (15, 16),
                (0, 17), (17, 18), (18, 19), (19, 20),
            ]
            for p1, p2 in hand_conns:
                cv2.line(img, pts[p1], pts[p2], (255, 255, 0), 2)
            for p in pts:
                cv2.circle(img, p, 3, (255, 215, 0), -1)

        # HUD banner
        cv2.putText(
            img,
            "BHARAT SIGN AI - NEURAL LANDMARK TRACKER",
            (20, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )

    def _build_134d_vector(self, right_hand, left_hand, pose) -> np.ndarray:
        """Constructs standardized 134-D keypoint vector matching INCLUDE architecture."""
        feat = np.zeros(134, dtype=np.float32)

        # 1. Right Hand: 21 * 2 = 42
        if right_hand and len(right_hand) >= 21:
            wx, wy = right_hand[0].x, right_hand[0].y
            for i in range(21):
                feat[i * 2] = right_hand[i].x - wx
                feat[i * 2 + 1] = right_hand[i].y - wy

        # 2. Left Hand: 21 * 2 = 42
        if left_hand and len(left_hand) >= 21:
            wx, wy = left_hand[0].x, left_hand[0].y
            for i in range(21):
                feat[42 + i * 2] = left_hand[i].x - wx
                feat[42 + i * 2 + 1] = left_hand[i].y - wy

        # 3. Pose: 25 * 2 = 50
        if pose and len(pose) >= 25:
            ref_x = (pose[11].x + pose[12].x) / 2.0
            ref_y = (pose[11].y + pose[12].y) / 2.0
            for i in range(25):
                feat[84 + i * 2] = pose[i].x - ref_x
                feat[84 + i * 2 + 1] = pose[i].y - ref_y

        return feat

    def _solve_frame_kinematics(self, r_hand, l_hand, pose, w, h) -> Dict[str, Any]:
        """
        Solves 3D joint rotations (shoulder, elbow, wrist) from 2D/3D landmarks:
        - arm: [pitch, yaw, roll]
        - forearm: [elbow_pitch, forearm_yaw, forearm_roll]
        - wrist: [wrist_pitch, wrist_yaw, wrist_roll]
        - fingers: articulation flex angles
        """
        # Default neutral values
        r_arm = [-0.15, 0.0, -0.95]
        r_forearm = [-1.30, 0.0, 0.25]
        r_wrist = [0.05, -0.15, 0.0]

        l_arm = [-0.15, 0.0, 0.60]
        l_forearm = [-1.30, 0.0, -0.25]
        l_wrist = [-0.05, 0.15, 0.0]

        r_flex = 0.1
        l_flex = 0.1

        # Solve Right Arm from Pose (12=R.Shoulder, 14=R.Elbow, 16=R.Wrist)
        if pose and len(pose) > 16:
            rs = pose[12]
            re = pose[14]
            rw = pose[16]

            # Vector Shoulder -> Elbow
            se_x = re.x - rs.x
            se_y = re.y - rs.y
            se_len = math.sqrt(se_x**2 + se_y**2) + 1e-6

            # Vector Elbow -> Wrist
            ew_x = rw.x - re.x
            ew_y = rw.y - re.y
            ew_len = math.sqrt(ew_x**2 + ew_y**2) + 1e-6

            # Elbow angle
            dot_elbow = (se_x * ew_x + se_y * ew_y) / (se_len * ew_len)
            dot_elbow = max(-1.0, min(1.0, dot_elbow))
            elbow_bend_rad = math.acos(dot_elbow)

            # Map to 3D Avatar rig space
            r_arm[0] = float(np.clip(-0.8 + (1.0 - re.y) * 1.2, -1.8, 0.2))
            r_arm[2] = float(np.clip(-0.3 - (re.x - rs.x) * 2.5, -1.6, 0.1))
            r_forearm[0] = float(np.clip(-0.4 - elbow_bend_rad, -2.8, -0.2))

        # Solve Left Arm from Pose (11=L.Shoulder, 13=L.Elbow, 15=L.Wrist)
        if pose and len(pose) > 15:
            ls = pose[11]
            le = pose[13]
            lw = pose[15]

            se_x = le.x - ls.x
            se_y = le.y - ls.y
            se_len = math.sqrt(se_x**2 + se_y**2) + 1e-6

            ew_x = lw.x - le.x
            ew_y = lw.y - le.y
            ew_len = math.sqrt(ew_x**2 + ew_y**2) + 1e-6

            dot_elbow = (se_x * ew_x + se_y * ew_y) / (se_len * ew_len)
            dot_elbow = max(-1.0, min(1.0, dot_elbow))
            elbow_bend_rad = math.acos(dot_elbow)

            l_arm[0] = float(np.clip(-0.8 + (1.0 - le.y) * 1.2, -1.8, 0.2))
            l_arm[2] = float(np.clip(0.3 + (ls.x - le.x) * 2.5, -0.1, 1.6))
            l_forearm[0] = float(np.clip(-0.4 - elbow_bend_rad, -2.8, -0.2))

        # Solve Right Hand finger curl
        if r_hand and len(r_hand) >= 21:
            # Distance from wrist(0) to fingertip(12=middle tip) vs mcp(9=middle base)
            w0 = r_hand[0]
            mcp = r_hand[9]
            tip = r_hand[12]
            d_palm = math.sqrt((mcp.x - w0.x)**2 + (mcp.y - w0.y)**2) + 1e-6
            d_ext = math.sqrt((tip.x - w0.x)**2 + (tip.y - w0.y)**2)
            ratio = d_ext / (d_palm * 2.0)
            r_flex = float(np.clip(1.0 - ratio, 0.05, 0.95))

        # Solve Left Hand finger curl
        if l_hand and len(l_hand) >= 21:
            w0 = l_hand[0]
            mcp = l_hand[9]
            tip = l_hand[12]
            d_palm = math.sqrt((mcp.x - w0.x)**2 + (mcp.y - w0.y)**2) + 1e-6
            d_ext = math.sqrt((tip.x - w0.x)**2 + (tip.y - w0.y)**2)
            ratio = d_ext / (d_palm * 2.0)
            l_flex = float(np.clip(1.0 - ratio, 0.05, 0.95))

        return {
            "rightArm": {"arm": r_arm, "forearm": r_forearm, "wrist": r_wrist},
            "leftArm": {"arm": l_arm, "forearm": l_forearm, "wrist": l_wrist},
            "rightFlex": round(r_flex, 2),
            "leftFlex": round(l_flex, 2),
        }

    def _compile_avatar_kinematics(self, frames_data: List[Dict[str, Any]], duration: float) -> Dict[str, Any]:
        """Synthesizes smooth retargeting keyframes for 3D Avatar playback."""
        if not frames_data:
            return {}

        n = len(frames_data)
        # Sample start, peak/mid, and end poses
        start_idx = 0
        mid_idx = n // 2
        end_idx = n - 1

        start_pose = frames_data[start_idx]
        mid_pose = frames_data[mid_idx]
        end_pose = frames_data[end_idx]

        # Extract sequence curve of 16 normalized trajectory timesteps
        curve_samples = []
        indices = np.linspace(0, n - 1, 16, dtype=int)
        for idx in indices:
            curve_samples.append(frames_data[idx])

        return {
            "durationSeconds": round(duration, 2),
            "trajectorySamplesCount": 16,
            "trajectory": curve_samples,
            "startPose": {
                "timeFraction": 0.0,
                "rightArm": start_pose["rightArm"],
                "leftArm": start_pose["leftArm"],
                "rightFlex": start_pose["rightFlex"],
                "leftFlex": start_pose["leftFlex"],
            },
            "midPose": {
                "timeFraction": 0.5,
                "rightArm": mid_pose["rightArm"],
                "leftArm": mid_pose["leftArm"],
                "rightFlex": mid_pose["rightFlex"],
                "leftFlex": mid_pose["leftFlex"],
            },
            "endPose": {
                "timeFraction": 1.0,
                "rightArm": end_pose["rightArm"],
                "leftArm": end_pose["leftArm"],
                "rightFlex": end_pose["rightFlex"],
                "leftFlex": end_pose["leftFlex"],
            },
        }


# Singleton pipeline instance
video_pipeline = VideoProcessorPipeline(sequence_length=16)
