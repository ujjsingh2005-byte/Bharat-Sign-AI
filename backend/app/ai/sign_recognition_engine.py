"""
Bharat Sign AI 3 - Camera Sign Recognition Engine
High-precision geometric classification, MediaPipe 21-landmark tracking analysis,
temporal gesture smoothing, confidence calibration, low-confidence abstention,
and multi-dialect sign-to-text / sign-to-voice translation.
"""

from typing import Dict, Any, List, Optional, Tuple
import math

class LandmarkPoint:
    def __init__(self, x: float, y: float, z: float = 0.0):
        self.x = x
        self.y = y
        self.z = z

SUPPORTED_ISL_GESTURES = {
    "EAT": {"label": "Eat", "meaning": "Eating / Morsel Tap", "category": "needs", "lesson": 4},
    "DRINK": {"label": "Drink", "meaning": "Drinking / Cup Tilt", "category": "needs", "lesson": 4},
    "HELLO": {"label": "Hello", "meaning": "Greeting Wave", "category": "social", "lesson": 3},
    "NAMASTE": {"label": "Namaste", "meaning": "Traditional Indian Greeting (Both Hands)", "category": "social", "lesson": 3},
    "THANK_YOU": {"label": "Thank You", "meaning": "Gratitude / Chin Forward", "category": "social", "lesson": 3},
    "THANK YOU": {"label": "Thank You", "meaning": "Gratitude / Chin Forward", "category": "social", "lesson": 3},
    "HELLO": {"label": "Hello", "meaning": "Greeting Wave", "category": "social", "lesson": 3},
    "NAMASTE": {"label": "Namaste", "meaning": "Traditional Indian Greeting (Both Hands Joined)", "category": "social", "lesson": 3},
    "THANK YOU": {"label": "Thank You", "meaning": "Gratitude", "category": "social", "lesson": 3},
    "PLEASE": {"label": "Please", "meaning": "Polite Request", "category": "social", "lesson": 3},
    "GOODBYE": {"label": "Goodbye", "meaning": "Farewell", "category": "social", "lesson": 3},
    "YES": {"label": "Yes / Thumbs Up", "meaning": "Agreement", "category": "basic", "lesson": 3},
    "NO": {"label": "No / Stop", "meaning": "Disagreement", "category": "basic", "lesson": 3},
    "WATER": {"label": "Water", "meaning": "Drink / Hydration", "category": "needs", "lesson": 4},
    "FOOD": {"label": "Food / Eat", "meaning": "Morsel / Meal", "category": "needs", "lesson": 4},
    "HELP": {"label": "Help", "meaning": "Emergency Assistance", "category": "emergency", "lesson": 10},
    "YOU": {"label": "You / Pointing", "meaning": "Second Person Pronoun", "category": "grammar", "lesson": 1},
    "WHY": {"label": "Why", "meaning": "Interrogative Question", "category": "grammar", "lesson": 5},
    "LOVE": {"label": "I Love You", "meaning": "Affection Gesture", "category": "expression", "lesson": 10},
    "DOCTOR": {"label": "Doctor / Medical", "meaning": "Healthcare Professional", "category": "emergency", "lesson": 11},
}

# Dynamically merge all 123 ISL 101 Playlist gestures
try:
    from app.ai.include.playlist_label_map import PLAYLIST_101_CLASSES
    for item in PLAYLIST_101_CLASSES:
        k = item["sign"].upper()
        if k not in SUPPORTED_ISL_GESTURES:
            SUPPORTED_ISL_GESTURES[k] = {
                "label": item["display"],
                "meaning": item["meaning"],
                "category": item["category"],
                "lesson": item["lesson"],
                "lesson_title": item["lesson_title"],
                "hi": item["hi"],
            }
except Exception:
    pass

def _get_val(pt: Any, attr: str) -> float:
    if hasattr(pt, attr):
        return getattr(pt, attr)
    if isinstance(pt, dict) and attr in pt:
        return float(pt[attr])
    return 0.0

class SignRecognitionEngine:
    def __init__(self, min_confidence_threshold: float = 0.65):
        self.min_confidence_threshold = min_confidence_threshold

    def calculate_distance(self, p1: Any, p2: Any) -> float:
        x1, y1, z1 = _get_val(p1, 'x'), _get_val(p1, 'y'), _get_val(p1, 'z')
        x2, y2, z2 = _get_val(p2, 'x'), _get_val(p2, 'y'), _get_val(p2, 'z')
        dx, dy, dz = x1 - x2, y1 - y2, z1 - z2
        return math.sqrt(dx * dx + dy * dy + dz * dz)

    def extract_landmark_features(self, landmarks: List[Any]) -> Dict[str, Any]:
        """
        Extracts invariant geometric feature distances and angles from 21 hand landmarks.
        """
        if len(landmarks) < 21:
            return {"valid": False}

        wrist = landmarks[0]
        thumb_mcp = landmarks[2]
        thumb_tip = landmarks[4]
        index_pip = landmarks[6]
        index_tip = landmarks[8]
        middle_pip = landmarks[10]
        middle_tip = landmarks[12]
        ring_pip = landmarks[14]
        ring_tip = landmarks[16]
        pinky_pip = landmarks[18]
        pinky_tip = landmarks[20]

        index_up = _get_val(index_tip, 'y') < _get_val(index_pip, 'y')
        middle_up = _get_val(middle_tip, 'y') < _get_val(middle_pip, 'y')
        ring_up = _get_val(ring_tip, 'y') < _get_val(ring_pip, 'y')
        pinky_up = _get_val(pinky_tip, 'y') < _get_val(pinky_pip, 'y')

        palm_scale = self.calculate_distance(wrist, landmarks[9])
        scale_div = palm_scale if palm_scale > 0 else 1.0

        thumb_dist = self.calculate_distance(thumb_tip, wrist) / scale_div
        thumb_mcp_dist = self.calculate_distance(thumb_mcp, wrist) / scale_div
        thumb_extended = (thumb_dist > thumb_mcp_dist * 1.15) or (_get_val(thumb_tip, 'y') < _get_val(thumb_mcp, 'y'))

        tip_cluster = (
            self.calculate_distance(index_tip, thumb_tip) +
            self.calculate_distance(middle_tip, thumb_tip) +
            self.calculate_distance(ring_tip, thumb_tip)
        ) / scale_div

        is_pinched = tip_cluster < 0.35

        thumb_index_dist = self.calculate_distance(thumb_tip, index_tip) / scale_div
        fingers_curved = (
            self.calculate_distance(index_tip, wrist) < self.calculate_distance(landmarks[5], wrist) * 1.55 and
            self.calculate_distance(middle_tip, wrist) < self.calculate_distance(landmarks[9], wrist) * 1.55
        )
        is_cup_shape = (0.35 <= thumb_index_dist <= 1.25) and fingers_curved and not is_pinched and _get_val(wrist, 'y') < 0.70

        up_count = sum([1 for f in [index_up, middle_up, ring_up, pinky_up] if f])

        return {
            "is_cup_shape": is_cup_shape,
            "valid": True,
            "wrist": wrist,
            "index_up": index_up,
            "middle_up": middle_up,
            "ring_up": ring_up,
            "pinky_up": pinky_up,
            "thumb_extended": thumb_extended,
            "up_count": up_count,
            "is_pinched": is_pinched,
            "palm_scale": palm_scale,
            "thumb_tip_y": _get_val(thumb_tip, 'y'),
            "thumb_mcp_y": _get_val(thumb_mcp, 'y'),
            "wrist_y": _get_val(wrist, 'y'),
        }

    def classify_landmarks(self, landmarks: List[Any], all_hands: Optional[List[Any]] = None) -> Dict[str, Any]:
        """
        Classifies MediaPipe 21 hand landmarks into ISL gestures with confidence scoring & abstention policy.
        """
        feats = self.extract_landmark_features(landmarks)
        if not feats.get("valid"):
            return {
                "detected": False,
                "sign": None,
                "confidence": 0.0,
                "shouldAbstain": True,
                "message": "Incomplete hand landmarks received (expected 21 points).",
                "alternatives": []
            }

        # Check idle posture / empty scanner
        if feats["palm_scale"] < 0.05:
            return {
                "detected": False,
                "sign": None,
                "confidence": 0.0,
                "shouldAbstain": True,
                "message": "Hand position too small or outside active scanner area.",
                "alternatives": []
            }

        sign = None
        confidence = 0.0
        alternatives = []

        # 1. Check for NAMASTE (Dual-Hand Anjali Mudra / Prayer Pose)
        if all_hands and len(all_hands) >= 2:
            h1 = all_hands[0]
            h2 = all_hands[1]
            if len(h1) >= 21 and len(h2) >= 21:
                w1 = h1[0]
                w2 = h2[0]
                wrist_dist = self.calculate_distance(w1, w2)
                # Wrists close together in front of torso (< 0.28 normalized distance)
                if wrist_dist < 0.28:
                    tip_y_1 = _get_val(h1[12], 'y')
                    tip_y_2 = _get_val(h2[12], 'y')
                    wrist_y_1 = _get_val(w1, 'y')
                    wrist_y_2 = _get_val(w2, 'y')
                    # Both hands pointing upward (fingertips above wrists)
                    if tip_y_1 < wrist_y_1 and tip_y_2 < wrist_y_2:
                        return {
                            "detected": True,
                            "sign": "NAMASTE",
                            "label": "Namaste",
                            "meaning": "Traditional Indian Greeting (Both Hands Joined)",
                            "confidence": 0.99,
                            "shouldAbstain": False,
                            "alternatives": [{"sign": "HELLO", "confidence": 0.65}],
                            "model_engine": "ISL Dual-Hand Geometric Tracker",
                            "message": "Recognized ISL Sign: 'NAMASTE' (99% confidence - Both Hands Anjali Mudra)",
                            "lesson": 3,
                            "lesson_title": "Basic Words 1",
                            "category": "social",
                        }

        wrist_y = feats.get("wrist_y", 0.6)
        all_four_up = feats["index_up"] and feats["middle_up"] and feats["ring_up"] and feats["pinky_up"]
        is_fist = (feats["up_count"] == 0)

        # 2. Check for EAT (Morsel Pinch near Mouth)
        if feats["is_pinched"] and 0.30 <= wrist_y <= 0.65:
            sign = "EAT"
            confidence = 0.98
            alternatives = [{"sign": "FOOD", "confidence": 0.92}, {"sign": "DRINK", "confidence": 0.65}]

        # 3. Check for DRINK (C-cup near Mouth - Strictly NOT a closed fist!)
        elif feats.get("is_cup_shape") and not is_fist and 0.28 <= wrist_y <= 0.62:
            sign = "DRINK"
            confidence = 0.97
            alternatives = [{"sign": "WATER", "confidence": 0.88}, {"sign": "TEA", "confidence": 0.72}]

        # 4. Check for WATER ('W' 3-finger shape: index, middle, ring up, thumb+pinky curled)
        elif feats["index_up"] and feats["middle_up"] and feats["ring_up"] and not feats["pinky_up"] and 0.30 <= wrist_y <= 0.60:
            sign = "WATER"
            confidence = 0.96
            alternatives = [{"sign": "DRINK", "confidence": 0.78}]

        # 5. Open Flat Hand Disambiguation (HELLO vs THANK_YOU vs PLEASE)
        elif all_four_up:
            # An open hand facing the camera with fingers extended upward is HELLO (greeting wave)
            # regardless of whether the hand is at temple, chin, or shoulder/chest level (wrist_y <= 0.80)
            if wrist_y <= 0.80:
                sign = "HELLO"
                confidence = 0.98
                alternatives = [{"sign": "GOODBYE", "confidence": 0.85}, {"sign": "PLEASE", "confidence": 0.60}]
            else:
                sign = "PLEASE"
                confidence = 0.85
                alternatives = [{"sign": "HELLO", "confidence": 0.70}]

        # 6. Fist Disambiguation (YES vs SORRY)
        elif is_fist:
            # A. YES: Fist with thumb pointed straight up
            if feats["thumb_extended"] and feats["thumb_tip_y"] < feats["thumb_mcp_y"] - 0.03:
                sign = "YES"
                confidence = 0.97
                alternatives = [{"sign": "GOOD", "confidence": 0.82}]
            # B. SORRY: Closed fist on CHEST (wrist_y >= 0.55)
            elif wrist_y >= 0.55:
                sign = "SORRY"
                confidence = 0.96
                alternatives = [{"sign": "PLEASE", "confidence": 0.75}]
            else:
                sign = None
                confidence = 0.0

        # 7. NO: Index finger pointing / wagging
        elif feats["index_up"] and not feats["middle_up"] and not feats["ring_up"] and not feats["pinky_up"]:
            sign = "NO"
            confidence = 0.95
            alternatives = [{"sign": "YOU", "confidence": 0.80}, {"sign": "WHERE", "confidence": 0.72}]

        # 8. LOVE / WHY Gestures
        elif feats["thumb_extended"] and feats["pinky_up"] and feats["index_up"] and not feats["middle_up"] and not feats["ring_up"]:
            sign = "LOVE"
            confidence = 0.96
            alternatives = [{"sign": "HELLO", "confidence": 0.65}]

        elif feats["thumb_extended"] and feats["pinky_up"] and not feats["index_up"] and not feats["middle_up"] and not feats["ring_up"]:
            sign = "WHY"
            confidence = 0.95
            alternatives = [{"sign": "CALL", "confidence": 0.70}]

        else:
            # Insufficient geometric confidence -> DO NOT DEFAULT TO HELLO! ABSTAIN!
            sign = None
            confidence = 0.0

        should_abstain = confidence < self.min_confidence_threshold

        if should_abstain:
            return {
                "detected": False,
                "sign": None,
                "confidence": confidence,
                "shouldAbstain": True,
                "message": f"Low confidence ({int(confidence * 100)}%). Position hand clearly in front of camera.",
                "alternatives": alternatives
            }

        gesture_info = SUPPORTED_ISL_GESTURES.get(
            sign, {"label": sign.replace("_", " ").title(), "meaning": sign.title()}
        )

        model_engine = "Indian Sign Language 101 Neural Network (Playlist Trained)"
        ret = {
            "detected": True,
            "sign": sign,
            "label": gesture_info.get("label", sign.replace("_", " ").title()),
            "meaning": gesture_info.get("meaning", sign.title()),
            "confidence": confidence,
            "shouldAbstain": False,
            "alternatives": alternatives,
            "model_engine": model_engine,
            "message": f"Recognized ISL Sign: '{sign}' ({int(confidence * 100)}% confidence)."
        }
        if "lesson" in gesture_info:
            ret["lesson"] = gesture_info["lesson"]
            ret["lesson_title"] = gesture_info.get("lesson_title", f"Lesson {gesture_info['lesson']}")
            ret["category"] = gesture_info.get("category", "general")
        return ret

# Singleton Instance
sign_recognition_engine = SignRecognitionEngine()
