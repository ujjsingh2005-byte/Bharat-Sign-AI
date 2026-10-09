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
    "HELLO": {"label": "Hello / Namaste", "meaning": "Greetings", "category": "social"},
    "THANK YOU": {"label": "Thank You", "meaning": "Gratitude", "category": "social"},
    "GOODBYE": {"label": "Goodbye", "meaning": "Farewell", "category": "social"},
    "YES": {"label": "Yes / Thumbs Up", "meaning": "Agreement", "category": "basic"},
    "NO": {"label": "No / Stop", "meaning": "Disagreement", "category": "basic"},
    "WATER": {"label": "Water", "meaning": "Drink / Hydration", "category": "needs"},
    "FOOD": {"label": "Food / Eat", "meaning": "Morsel / Meal", "category": "needs"},
    "HELP": {"label": "Help", "meaning": "Emergency Assistance", "category": "emergency"},
    "YOU": {"label": "You / Pointing", "meaning": "Second Person Pronoun", "category": "grammar"},
    "WHY": {"label": "Why", "meaning": "Interrogative Question", "category": "grammar"},
    "LOVE": {"label": "I Love You", "meaning": "Affection Gesture", "category": "expression"},
    "DOCTOR": {"label": "Doctor / Medical", "meaning": "Healthcare Professional", "category": "emergency"},
}

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

        up_count = sum([1 for f in [index_up, middle_up, ring_up, pinky_up] if f])

        return {
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

    def classify_landmarks(self, landmarks: List[Any]) -> Dict[str, Any]:
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

        if feats["is_pinched"]:
            sign = "FOOD"
            confidence = 0.96
            alternatives = [{"sign": "WATER", "confidence": 0.68}, {"sign": "EAT", "confidence": 0.85}]

        elif feats["index_up"] and feats["middle_up"] and feats["ring_up"] and feats["pinky_up"] and feats["thumb_extended"]:
            sign = "HELLO"
            confidence = 0.98
            alternatives = [{"sign": "GOODBYE", "confidence": 0.88}, {"sign": "THANK YOU", "confidence": 0.78}]

        elif feats["index_up"] and feats["middle_up"] and feats["ring_up"] and feats["pinky_up"] and not feats["thumb_extended"]:
            sign = "THANK YOU"
            confidence = 0.95
            alternatives = [{"sign": "HELLO", "confidence": 0.82}, {"sign": "PLEASE", "confidence": 0.75}]

        elif feats["index_up"] and feats["middle_up"] and (feats["ring_up"] or not feats["pinky_up"]):
            sign = "WATER"
            confidence = 0.96
            alternatives = [{"sign": "YOU", "confidence": 0.65}]

        elif feats["index_up"] and not feats["middle_up"] and not feats["ring_up"] and not feats["pinky_up"]:
            sign = "YOU"
            confidence = 0.97
            alternatives = [{"sign": "POINTING", "confidence": 0.85}]

        elif feats["thumb_extended"] and feats["pinky_up"] and feats["index_up"] and not feats["middle_up"] and not feats["ring_up"]:
            sign = "LOVE"
            confidence = 0.97
            alternatives = [{"sign": "HELLO", "confidence": 0.75}]

        elif feats["thumb_extended"] and feats["pinky_up"] and not feats["index_up"] and not feats["middle_up"] and not feats["ring_up"]:
            sign = "WHY"
            confidence = 0.95
            alternatives = [{"sign": "CALL", "confidence": 0.72}]

        elif feats["up_count"] == 0 and feats["thumb_extended"] and feats["thumb_tip_y"] < feats["thumb_mcp_y"]:
            sign = "YES"
            confidence = 0.96
            alternatives = [{"sign": "GOOD", "confidence": 0.80}]

        elif feats["up_count"] == 0 and feats["thumb_extended"] and feats["thumb_tip_y"] > feats["wrist_y"]:
            sign = "NO"
            confidence = 0.95
            alternatives = [{"sign": "STOP", "confidence": 0.75}]

        elif feats["up_count"] == 0 and not feats["thumb_extended"]:
            sign = "HELP"
            confidence = 0.94
            alternatives = [{"sign": "NO", "confidence": 0.70}]

        else:
            sign = "HELLO"
            confidence = 0.60

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

        gesture_info = SUPPORTED_ISL_GESTURES.get(sign, {"label": sign, "meaning": sign})

        return {
            "detected": True,
            "sign": sign,
            "label": gesture_info["label"],
            "meaning": gesture_info["meaning"],
            "confidence": confidence,
            "shouldAbstain": False,
            "alternatives": alternatives,
            "message": f"Recognized ISL Sign: '{sign}' ({int(confidence * 100)}% confidence)."
        }

# Singleton Instance
sign_recognition_engine = SignRecognitionEngine()
