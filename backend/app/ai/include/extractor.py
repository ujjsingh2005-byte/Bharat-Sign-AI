"""
AI4Bharat INCLUDE Video Landmark Feature Extractor
Extracts 134-dimensional temporal keypoint trajectories from raw ISL video files (.MOV, .mp4).
Compatible with Zenodo INCLUDE dataset archives (e.g., Adjectives_1of8.zip).
"""

import os
import re
import sys
import time
import zipfile
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import cv2
import numpy as np

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from app.ai.include.label_map import (
    INCLUDE_50_LABEL_TO_ID,
    INCLUDE_50_METADATA,
)
from app.ai.include.weights_manager import WEIGHTS_DIR

# Paths to cached task models
HAND_MODEL_PATH = WEIGHTS_DIR / "hand_landmarker.task"
POSE_MODEL_PATH = WEIGHTS_DIR / "pose_landmarker.task"


def normalize_class_name(raw_name: str) -> str:
    """
    Normalizes dataset folder/class names into standardized keys.
    Examples:
      '1. loud' -> 'loud'
      '2. quiet' -> 'quiet'
      '3. happy' -> 'happy'
      '4. sad' -> 'sad'
      'adjective 1file' -> 'loud'
      'adjectives 1' -> 'loud'
      '1. big / large' -> 'biglarge'
      '39. store or shop' -> 'storeorshop'
      '44. train ticket' -> 'trainticket'
      '45. t-shirt' -> 'tshirt'
      '19. good morning' -> 'goodmorning'
      '49. you (plural)' -> 'youplural'
    """
    raw_lower = raw_name.strip().lower()

    # Special handling for adjective folder numbering from INCLUDE Adjectives archive
    adj_match = re.search(r"adjective[s]?[\s_\-]*([1-8])", raw_lower)
    if adj_match:
        adj_idx = adj_match.group(1)
        adj_map = {
            "1": "loud",
            "2": "quiet",
            "3": "happy",
            "4": "sad",
            "5": "beautiful",
            "6": "ugly",
            "7": "deaf",
            "8": "blind",
        }
        if adj_idx in adj_map:
            return adj_map[adj_idx]

    # 1. Strip leading digits and dots (e.g. '1. ', '02. ')
    cleaned = re.sub(r"^\d+[\.\s\-]+", "", raw_lower)
    # 2. Strip parentheses and contents if needed, or normalize
    cleaned = re.sub(r"\(plural\)", "plural", cleaned)
    cleaned = re.sub(r"[\(\)\[\]]", "", cleaned)
    # 3. Strip punctuation and spaces
    cleaned = cleaned.replace("/", "").replace("-", "").replace("_", "").replace(" ", "")
    return cleaned


class VideoLandmarkExtractor:
    """
    Extracts 134-D keypoint trajectories (42 hand1 + 42 hand2 + 50 pose) from video files.
    """

    def __init__(self, sequence_length: int = 16):
        self.sequence_length = sequence_length
        self._init_detectors()

    def _init_detectors(self):
        """Initializes MediaPipe Task detectors."""
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
                print(f"[VideoLandmarkExtractor] Note initializing hand detector: {e}")

        if POSE_MODEL_PATH.exists():
            try:
                p_opts = vision.PoseLandmarkerOptions(
                    base_options=python.BaseOptions(model_asset_path=str(POSE_MODEL_PATH)),
                    min_pose_detection_confidence=0.35,
                    min_tracking_confidence=0.35,
                )
                self.pose_detector = vision.PoseLandmarker.create_from_options(p_opts)
            except Exception as e:
                print(f"[VideoLandmarkExtractor] Note initializing pose detector: {e}")

    def extract_from_video_file(self, video_path: str) -> Optional[np.ndarray]:
        """
        Reads a video file from disk, uniformly samples `sequence_length` frames,
        and computes the (sequence_length, 134) feature array.
        """
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames <= 0:
            cap.release()
            return None

        # Uniformly sample exactly self.sequence_length frames
        target_indices = set(np.linspace(0, total_frames - 1, self.sequence_length, dtype=int))

        sampled_frames = []
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx in target_indices:
                sampled_frames.append(frame)
            frame_idx += 1

        cap.release()

        # If video was shorter than expected or some frames couldn't be read, pad or slice
        if not sampled_frames:
            return None

        while len(sampled_frames) < self.sequence_length:
            sampled_frames.append(sampled_frames[-1])

        sampled_frames = sampled_frames[: self.sequence_length]

        # Extract 134-D vector for each frame
        sequence_feats = []
        for frame in sampled_frames:
            feat = self._process_frame(frame)
            sequence_feats.append(feat)

        return np.array(sequence_feats, dtype=np.float32)

    def _process_frame(self, frame: np.ndarray) -> np.ndarray:
        """
        Extracts 134-D keypoint features from an RGB frame:
        - 42 floats Hand 1 (21 points x, y relative to wrist)
        - 42 floats Hand 2 (21 points x, y relative to wrist)
        - 50 floats Pose (25 upper body keypoints x, y)
        """
        feat = np.zeros(134, dtype=np.float32)

        # Downscale for high-speed inference without losing accuracy
        h, w = frame.shape[:2]
        target_w = 640
        target_h = int((h / w) * target_w)
        resized = cv2.resize(frame, (target_w, target_h))
        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)

        # 1. Hand Landmarks
        if self.hand_detector is not None:
            try:
                h_res = self.hand_detector.detect(mp_img)
                if h_res.hand_landmarks and len(h_res.hand_landmarks) > 0:
                    # Hand 1
                    h1 = h_res.hand_landmarks[0]
                    wx, wy = h1[0].x, h1[0].y
                    for i in range(min(21, len(h1))):
                        feat[i * 2] = float(h1[i].x - wx)
                        feat[i * 2 + 1] = float(h1[i].y - wy)

                if h_res.hand_landmarks and len(h_res.hand_landmarks) > 1:
                    # Hand 2
                    h2 = h_res.hand_landmarks[1]
                    w2x, w2y = h2[0].x, h2[0].y
                    for i in range(min(21, len(h2))):
                        feat[42 + i * 2] = float(h2[i].x - w2x)
                        feat[42 + i * 2 + 1] = float(h2[i].y - w2y)
            except Exception:
                pass

        # 2. Pose Landmarks
        if self.pose_detector is not None:
            try:
                p_res = self.pose_detector.detect(mp_img)
                if p_res.pose_landmarks and len(p_res.pose_landmarks) > 0:
                    p = p_res.pose_landmarks[0]
                    # Center relative to mid-shoulder (landmarks 11 and 12)
                    ref_x = (p[11].x + p[12].x) / 2.0 if len(p) > 12 else p[0].x
                    ref_y = (p[11].y + p[12].y) / 2.0 if len(p) > 12 else p[0].y
                    for i in range(min(25, len(p))):
                        feat[84 + i * 2] = float(p[i].x - ref_x)
                        feat[84 + i * 2 + 1] = float(p[i].y - ref_y)
            except Exception:
                pass

        return feat


def extract_from_zip(
    zip_path: str,
    output_dir: str,
    max_samples_per_class: Optional[int] = None,
    progress_callback: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Extracts landmark keypoints from all video files inside an INCLUDE zip archive.
    Saves (16, 134) .npy files to output_dir/{clean_class_name}/{video_basename}.npy.
    """
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    extractor = VideoLandmarkExtractor(sequence_length=16)

    with zipfile.ZipFile(zip_path, "r") as z:
        all_files = z.namelist()

        # Group videos by class directory
        # E.g. 'Adjectives/1. loud/MVI_5177.MOV' -> class '1. loud'
        class_videos: Dict[str, List[str]] = {}
        for f in all_files:
            parts = f.split("/")
            if len(parts) >= 3 and parts[-1].lower().endswith((".mov", ".mp4", ".avi")):
                raw_class = parts[-2]
                class_videos.setdefault(raw_class, []).append(f)

        summary: Dict[str, Any] = {
            "archive": Path(zip_path).name,
            "total_classes_found": len(class_videos),
            "classes": {},
            "total_extracted": 0,
        }

        print(f"\n=======================================================")
        print(f"[*] Extracting INCLUDE archive: {Path(zip_path).name}")
        print(f"Classes found ({len(class_videos)}): {list(class_videos.keys())}")
        print(f"Output directory: {out_path.resolve()}")
        print(f"=======================================================\n")

        for raw_class, video_list in class_videos.items():
            clean_class = normalize_class_name(raw_class)
            class_out_dir = out_path / clean_class
            class_out_dir.mkdir(parents=True, exist_ok=True)

            if max_samples_per_class:
                video_list = video_list[:max_samples_per_class]

            extracted_count = 0
            for vid_entry in video_list:
                vid_stem = Path(vid_entry).stem
                target_npy = class_out_dir / f"{vid_stem}.npy"

                if target_npy.exists():
                    extracted_count += 1
                    continue

                # Extract video data to a temporary file for OpenCV reading
                with tempfile.NamedTemporaryFile(suffix=".mov", delete=False) as tmp:
                    tmp.write(z.read(vid_entry))
                    tmp_file_path = tmp.name

                try:
                    feat_array = extractor.extract_from_video_file(tmp_file_path)
                    if feat_array is not None and feat_array.shape == (16, 134):
                        np.save(target_npy, feat_array)
                        extracted_count += 1
                finally:
                    if os.path.exists(tmp_file_path):
                        os.unlink(tmp_file_path)

            summary["classes"][clean_class] = {
                "raw_folder": raw_class,
                "clean_name": clean_class,
                "samples_extracted": extracted_count,
            }
            summary["total_extracted"] += extracted_count
            print(f"  [+] Class '{raw_class}' -> '{clean_class}': {extracted_count} .npy sequences saved.")

    return summary


KNOWN_VIDEO_STEM_MAP: Dict[str, str] = {
    # Zenodo INCLUDE Adjectives 1 of 8 full video ground-truth mapping (104 takes across 8 classes)
    "MVI_5177": "loud", "MVI_5178": "loud", "MVI_5179": "loud", "MVI_5257": "loud", "MVI_5258": "loud",
    "MVI_5259": "loud", "MVI_5335": "loud", "MVI_5336": "loud", "MVI_5337": "loud", "MVI_9289": "loud",
    "MVI_9290": "loud", "MVI_9291": "loud", "MVI_9368": "loud", "MVI_9369": "loud", "MVI_9370": "loud",
    "MVI_9448": "loud", "MVI_9449": "loud", "MVI_9450": "loud", "MVI_9534": "loud", "MVI_9535": "loud", "MVI_9536": "loud",
    "MVI_5180": "quiet", "MVI_5181": "quiet", "MVI_5182": "quiet", "MVI_5260": "quiet", "MVI_5261": "quiet",
    "MVI_5262": "quiet", "MVI_5338": "quiet", "MVI_5339": "quiet", "MVI_5340": "quiet", "MVI_9292": "quiet",
    "MVI_9293": "quiet", "MVI_9294": "quiet", "MVI_9371": "quiet", "MVI_9372": "quiet", "MVI_9373": "quiet",
    "MVI_9451": "quiet", "MVI_9452": "quiet", "MVI_9453": "quiet", "MVI_9537": "quiet", "MVI_9538": "quiet", "MVI_9539": "quiet",
    "MVI_5183": "happy", "MVI_5184": "happy", "MVI_5185": "happy", "MVI_5263": "happy", "MVI_5264": "happy",
    "MVI_5265": "happy", "MVI_5341": "happy", "MVI_5342": "happy", "MVI_5343": "happy", "MVI_9295": "happy",
    "MVI_9296": "happy", "MVI_9297": "happy", "MVI_9374": "happy", "MVI_9375": "happy", "MVI_9376": "happy",
    "MVI_9454": "happy", "MVI_9455": "happy", "MVI_9456": "happy", "MVI_9540": "happy", "MVI_9541": "happy", "MVI_9542": "happy",
    "MVI_9711": "happy", "MVI_9712": "happy", "MVI_9713": "happy", "MVI_9714": "happy",
    "MVI_9835": "happy", "MVI_9836": "happy", "MVI_9837": "happy", "MVI_9838": "happy",
    "MVI_9565": "sad", "MVI_9566": "sad", "MVI_9567": "sad", "MVI_9568": "sad", "MVI_9719": "sad", "MVI_9720": "sad", "MVI_9721": "sad", "MVI_9722": "sad",
    "MVI_9569": "beautiful", "MVI_9570": "beautiful", "MVI_9571": "beautiful", "MVI_9572": "beautiful", "MVI_9723": "beautiful", "MVI_9724": "beautiful", "MVI_9725": "beautiful", "MVI_9726": "beautiful",
    "MVI_9576": "ugly", "MVI_9577": "ugly", "MVI_9578": "ugly", "MVI_9579": "ugly", "MVI_9844": "ugly", "MVI_9845": "ugly", "MVI_9846": "ugly", "MVI_9847": "ugly",
    "MVI_9580": "deaf", "MVI_9581": "deaf", "MVI_9582": "deaf", "MVI_9583": "deaf", "MVI_9848": "deaf", "MVI_9849": "deaf", "MVI_9850": "deaf", "MVI_9851": "deaf",
    "MVI_9584": "blind", "MVI_9585": "blind", "MVI_9586": "blind", "MVI_9587": "blind", "MVI_9852": "blind", "MVI_9853": "blind", "MVI_9854": "blind", "MVI_9855": "blind",
    "MVI_9588": "nice", "MVI_9589": "nice", "MVI_9590": "nice", "MVI_9591": "nice",
    "MVI_9592": "mean", "MVI_9593": "mean", "MVI_9594": "mean", "MVI_9595": "mean",
    "MVI_9729": "mean", "MVI_9730": "mean", "MVI_9731": "mean", "MVI_9732": "mean",
    "MVI_9596": "rich", "MVI_9597": "rich", "MVI_9598": "rich", "MVI_9599": "rich",
    "MVI_9733": "rich", "MVI_9734": "rich", "MVI_9735": "rich", "MVI_9736": "rich",
    "MVI_9600": "poor", "MVI_9601": "poor", "MVI_9603": "poor", "MVI_9604": "poor",
    "MVI_9737": "poor", "MVI_9738": "poor", "MVI_9739": "poor", "MVI_9740": "poor",
    "MVI_9605": "thick", "MVI_9606": "thick", "MVI_9607": "thick", "MVI_9608": "thick",
    "MVI_9742": "thick", "MVI_9743": "thick", "MVI_9744": "thick", "MVI_9745": "thick",
    "MVI_9609": "thin", "MVI_9610": "thin", "MVI_9611": "thin", "MVI_9612": "thin",
    "MVI_9613": "expensive", "MVI_9614": "expensive", "MVI_9615": "expensive", "MVI_9616": "expensive",
    "MVI_9746": "expensive", "MVI_9747": "expensive", "MVI_9748": "expensive", "MVI_9749": "expensive",
    "MVI_9617": "cheap", "MVI_9618": "cheap", "MVI_9619": "cheap", "MVI_9620": "cheap",
    "MVI_9750": "cheap", "MVI_9751": "cheap", "MVI_9752": "cheap", "MVI_9754": "cheap",
    "MVI_9621": "flat", "MVI_9622": "flat", "MVI_9623": "flat", "MVI_9624": "flat",
    "MVI_9755": "flat", "MVI_9756": "flat", "MVI_9757": "flat", "MVI_9758": "flat",
    "MVI_9633": "curved", "MVI_9634": "curved", "MVI_9635": "curved", "MVI_9636": "curved",
    "MVI_9759": "curved", "MVI_9760": "curved", "MVI_9761": "curved", "MVI_9762": "curved",
    "MVI_9637": "male", "MVI_9638": "male", "MVI_9639": "male", "MVI_9640": "male",
    "MVI_9763": "male", "MVI_9764": "male", "MVI_9765": "male", "MVI_9766": "male",
    "MVI_9642": "female", "MVI_9643": "female", "MVI_9644": "female", "MVI_9645": "female",
    "MVI_9767": "female", "MVI_9768": "female", "MVI_9769": "female", "MVI_9770": "female",
    "MVI_9646": "tight", "MVI_9647": "tight", "MVI_9648": "tight", "MVI_9649": "tight",
    "MVI_9771": "tight", "MVI_9772": "tight", "MVI_9773": "tight", "MVI_9774": "tight",
    "MVI_9650": "loose", "MVI_9651": "loose", "MVI_9652": "loose", "MVI_9653": "loose",
    "MVI_9775": "loose", "MVI_9776": "loose", "MVI_9777": "loose", "MVI_9778": "loose",
    "MVI_9654": "high", "MVI_9655": "high", "MVI_9656": "high", "MVI_9657": "high",
    "MVI_9780": "high", "MVI_9781": "high", "MVI_9782": "high", "MVI_9783": "high",
    "MVI_5152": "old", "MVI_5153": "old", "MVI_5154": "old",
    "MVI_5232": "old", "MVI_5233": "old", "MVI_5234": "old",
    "MVI_5310": "old", "MVI_5311": "old", "MVI_5312": "old",
    "MVI_9262": "old", "MVI_9263": "old", "MVI_9264": "old",
    "MVI_9343": "old", "MVI_9344": "old", "MVI_9345": "old",
    "MVI_9424": "old", "MVI_9425": "old", "MVI_9426": "old",
    "MVI_9504": "young", "MVI_9505": "young", "MVI_9506": "young",
    "MVI_5155": "young", "MVI_5156": "young", "MVI_5157": "young",
    "MVI_5235": "young", "MVI_5236": "young", "MVI_5237": "young",
    "MVI_5313": "young", "MVI_5314": "young", "MVI_5315": "young",
    "MVI_9265": "young", "MVI_9266": "young", "MVI_9267": "young",
    "MVI_9346": "young", "MVI_9347": "young", "MVI_9348": "young",
    "MVI_9427": "young", "MVI_9428": "young", "MVI_9429": "young",
    "MVI_9507": "young", "MVI_9508": "young", "MVI_9509": "young",
    "MVI_9662": "soft", "MVI_9663": "soft", "MVI_9664": "soft", "MVI_9665": "soft",
    "MVI_9789": "soft", "MVI_9790": "soft", "MVI_9791": "soft", "MVI_9792": "soft",
    "MVI_5158": "good", "MVI_5159": "good", "MVI_5160": "good",
    "MVI_5238": "good", "MVI_5239": "good", "MVI_5240": "good",
    "MVI_5316": "good", "MVI_5317": "good", "MVI_5318": "good",
    "MVI_9268": "good", "MVI_9269": "good", "MVI_9270": "good",
    "MVI_9349": "good", "MVI_9350": "good", "MVI_9351": "good",
    "MVI_9430": "good", "MVI_9431": "good", "MVI_9432": "good",
    "MVI_9510": "good", "MVI_9511": "good", "MVI_9512": "good",
    "MVI_5161": "bad", "MVI_5162": "bad", "MVI_5163": "bad",
    "MVI_5241": "bad", "MVI_5242": "bad", "MVI_5243": "bad",
    "MVI_5319": "bad", "MVI_5320": "bad", "MVI_5321": "bad",
    "MVI_9271": "bad", "MVI_9272": "bad", "MVI_9273": "bad",
    "MVI_9352": "bad", "MVI_9353": "bad", "MVI_9354": "bad",
    "MVI_9433": "bad", "MVI_9434": "bad", "MVI_9435": "bad",
    "MVI_9513": "bad", "MVI_9514": "bad", "MVI_9516": "bad",
    "MVI_5164": "wet", "MVI_5165": "wet", "MVI_5166": "wet",
    "MVI_5244": "wet", "MVI_5245": "wet", "MVI_5246": "wet",
    "MVI_5322": "wet", "MVI_5323": "wet", "MVI_5324": "wet",
    "MVI_9274": "wet", "MVI_9275": "wet", "MVI_9276": "wet",
    "MVI_9355": "wet", "MVI_9356": "wet", "MVI_9357": "wet",
    "MVI_9436": "wet", "MVI_9437": "wet", "MVI_9438": "wet",
    "MVI_9517": "wet", "MVI_9518": "wet", "MVI_9520": "wet",
    "MVI_5120": "narrow", "MVI_5121": "narrow", "MVI_5122": "narrow",
    "MVI_5200": "narrow", "MVI_5201": "narrow", "MVI_5202": "narrow",
    "MVI_5280": "narrow", "MVI_5281": "narrow", "MVI_5282": "narrow",
    "MVI_9230": "narrow", "MVI_9231": "narrow", "MVI_9232": "narrow",
    "MVI_9313": "narrow", "MVI_9314": "narrow", "MVI_9315": "narrow",
    "MVI_9391": "narrow", "MVI_9392": "narrow", "MVI_9393": "narrow",
    "MVI_9471": "narrow", "MVI_9472": "narrow", "MVI_9474": "narrow",
    "MVI_5123": "biglarge", "MVI_5124": "biglarge", "MVI_5125": "biglarge",
    "MVI_5203": "biglarge", "MVI_5204": "biglarge", "MVI_5205": "biglarge",
    "MVI_5283": "biglarge", "MVI_5284": "biglarge", "MVI_5285": "biglarge",
    "MVI_9233": "biglarge", "MVI_9234": "biglarge", "MVI_9235": "biglarge",
    "MVI_9316": "biglarge", "MVI_9317": "biglarge", "MVI_9318": "biglarge",
    "MVI_9394": "biglarge", "MVI_9395": "biglarge", "MVI_9396": "biglarge",
    "MVI_9475": "biglarge", "MVI_9476": "biglarge", "MVI_9477": "biglarge",
    "MVI_5126": "smalllittle", "MVI_5127": "smalllittle", "MVI_5128": "smalllittle",
    "MVI_5206": "smalllittle", "MVI_5207": "smalllittle", "MVI_5208": "smalllittle",
    "MVI_5286": "smalllittle", "MVI_5287": "smalllittle", "MVI_5288": "smalllittle",
    "MVI_9236": "smalllittle", "MVI_9237": "smalllittle", "MVI_9238": "smalllittle",
    "MVI_9319": "smalllittle", "MVI_9320": "smalllittle", "MVI_9321": "smalllittle",
    "MVI_9397": "smalllittle", "MVI_9398": "smalllittle", "MVI_9400": "smalllittle",
    "MVI_9478": "smalllittle", "MVI_9479": "smalllittle", "MVI_9480": "smalllittle",
    "MVI_5130": "slow", "MVI_5131": "slow", "MVI_5132": "slow",
    "MVI_5210": "slow", "MVI_5211": "slow", "MVI_5212": "slow",
    "MVI_5289": "slow", "MVI_5290": "slow", "MVI_5291": "slow",
    "MVI_9240": "slow", "MVI_9242": "slow", "MVI_9243": "slow",
    "MVI_9322": "slow", "MVI_9323": "slow", "MVI_9324": "slow",
    "MVI_9402": "slow", "MVI_9403": "slow", "MVI_9404": "slow",
    "MVI_9481": "slow", "MVI_9482": "slow", "MVI_9483": "slow",
    "MVI_5133": "fast", "MVI_5134": "fast", "MVI_5135": "fast",
    "MVI_5213": "fast", "MVI_5214": "fast", "MVI_5215": "fast",
    "MVI_5292": "fast", "MVI_5293": "fast", "MVI_5294": "fast",
    "MVI_9244": "fast", "MVI_9245": "fast", "MVI_9246": "fast",
    "MVI_9325": "fast", "MVI_9326": "fast", "MVI_9327": "fast",
    "MVI_9405": "fast", "MVI_9406": "fast", "MVI_9407": "fast",
    "MVI_9484": "fast", "MVI_9485": "fast", "MVI_9486": "fast",
    "MVI_9679": "clean", "MVI_9680": "clean", "MVI_9681": "clean", "MVI_9682": "clean",
    "MVI_9806": "clean", "MVI_9807": "clean", "MVI_9808": "clean", "MVI_9809": "clean",
    "MVI_9684": "dirty", "MVI_9685": "dirty", "MVI_9686": "dirty", "MVI_9687": "dirty",
    "MVI_9810": "dirty", "MVI_9811": "dirty", "MVI_9812": "dirty", "MVI_9813": "dirty",
    "MVI_9690": "strong", "MVI_9691": "strong", "MVI_9692": "strong", "MVI_9693": "strong",
    "MVI_9814": "strong", "MVI_9815": "strong", "MVI_9816": "strong", "MVI_9817": "strong",
    "MVI_9694": "weak", "MVI_9695": "weak", "MVI_9696": "weak", "MVI_9697": "weak",
    "MVI_9818": "weak", "MVI_9819": "weak", "MVI_9820": "weak", "MVI_9821": "weak",
    "MVI_9699": "dead", "MVI_9700": "dead", "MVI_9701": "dead", "MVI_9702": "dead",
    "MVI_9823": "dead", "MVI_9824": "dead", "MVI_9825": "dead", "MVI_9826": "dead",
}

# Load complete INCLUDE Zenodo/HuggingFace ground-truth mapping if available
_full_map_file = WEIGHTS_DIR / "include_full_stem_map.json"
if not _full_map_file.exists():
    _full_map_file = Path("include_full_stem_map.json")
if _full_map_file.exists():
    try:
        import json
        with open(_full_map_file, "r", encoding="utf-8") as _f:
            _d = json.load(_f)
            for _s, _l in _d.get("stems", {}).items():
                if _s not in KNOWN_VIDEO_STEM_MAP:
                    KNOWN_VIDEO_STEM_MAP[_s] = _l
    except Exception:
        pass



def extract_from_directory(
    directory_path: str,
    output_dir: str,
    max_samples_per_class: Optional[int] = None,
    force_reextract: bool = False,
) -> Dict[str, Any]:
    """
    Extracts landmark keypoints from an unzipped INCLUDE directory or single class video folder.
    E.g. directory_path containing '1. loud/', '2. quiet/', 'adjective 1file/', etc.
    """
    in_path = Path(directory_path)
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    extractor = VideoLandmarkExtractor(sequence_length=16)

    # Find all subdirectories that contain video files directly
    class_dirs = []
    if any(in_path.glob("*.MOV")) or any(in_path.glob("*.mov")) or any(in_path.glob("*.mp4")):
        class_dirs = [in_path]
    else:
        for d in sorted(in_path.rglob("*")):
            if d.is_dir():
                has_videos = any(d.glob("*.MOV")) or any(d.glob("*.mov")) or any(d.glob("*.mp4")) or any(d.glob("*.avi"))
                if has_videos and d not in class_dirs:
                    class_dirs.append(d)

    summary: Dict[str, Any] = {
        "source_directory": str(in_path),
        "total_classes_found": len(class_dirs),
        "classes": {},
        "total_extracted": 0,
    }

    for cdir in class_dirs:
        raw_class = cdir.name
        clean_class = normalize_class_name(raw_class)

        # Collect unique video files
        seen_names = set()
        unique_videos = []
        for vid in sorted(cdir.iterdir()):
            if vid.is_file() and vid.suffix.lower() in (".mov", ".mp4", ".avi"):
                if vid.name.lower() not in seen_names:
                    seen_names.add(vid.name.lower())
                    unique_videos.append(vid)

        if max_samples_per_class:
            unique_videos = unique_videos[:max_samples_per_class]

        # Ground-truth: Check video stem mapping first to ensure accurate class detection
        stem_match = None
        for vid in unique_videos:
            if vid.stem in KNOWN_VIDEO_STEM_MAP:
                stem_match = KNOWN_VIDEO_STEM_MAP[vid.stem]
                break

        if stem_match:
            clean_class = stem_match
        elif clean_class not in INCLUDE_50_LABEL_TO_ID:
            clean_class = normalize_class_name(raw_class)

        class_out_dir = out_path / clean_class
        class_out_dir.mkdir(parents=True, exist_ok=True)

        extracted_count = 0
        saved_files = []
        for vid in unique_videos:
            target_npy = class_out_dir / f"{vid.stem}.npy"
            if not force_reextract and target_npy.exists():
                extracted_count += 1
                saved_files.append(str(target_npy))
                continue

            feat_array = extractor.extract_from_video_file(str(vid))

            if feat_array is not None and feat_array.shape == (16, 134):
                np.save(target_npy, feat_array)
                extracted_count += 1
                saved_files.append(str(target_npy))

        summary["classes"][clean_class] = {
            "raw_folder": raw_class,
            "clean_name": clean_class,
            "samples_extracted": extracted_count,
            "saved_files": saved_files,
        }
        summary["total_extracted"] += extracted_count
        print(f"  [+] Class '{raw_class}' -> '{clean_class}': {extracted_count} .npy sequences saved.")

    return summary
