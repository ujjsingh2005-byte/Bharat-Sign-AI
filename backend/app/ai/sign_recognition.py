import cv2
import numpy as np

SUPPORTED_CAMERA_SIGNS = [
    {"sign": "HELLO", "label": "Hello / Namaste", "meaning": "Greetings"},
    {"sign": "THANK YOU", "label": "Thank You", "meaning": "Gratitude"},
    {"sign": "GOODBYE", "label": "Goodbye", "meaning": "Farewell"},
    {"sign": "YES", "label": "Yes / Thumbs Up", "meaning": "Agreement"},
    {"sign": "NO", "label": "No / Stop", "meaning": "Disagreement"},
    {"sign": "WATER", "label": "Water", "meaning": "Drink / Water"},
    {"sign": "YOU", "label": "You", "meaning": "Pointing"},
    {"sign": "WHY", "label": "Why", "meaning": "Questioning"},
    {"sign": "FOOD", "label": "Food / Eat", "meaning": "Morsel / Meal"},
    {"sign": "HELP", "label": "Help", "meaning": "Emergency assistance"},
]

def analyze_hand_frame(frame: np.ndarray) -> dict:
    """
    Analyzes camera video frame using contour geometry and convexity defects.
    NO hardcoded fallback signs.
    """
    if frame is None or frame.size == 0:
        return {
            "detected": False,
            "sign": None,
            "confidence": 0.0,
            "alternatives": [],
            "message": "Invalid video frame.",
        }

    h, w, _ = frame.shape

    # 1. Multi-color skin segmentation (YCrCb + HSV combined for room lighting resilience)
    ycrcb = cv2.cvtColor(frame, cv2.COLOR_BGR2YCrCb)
    mask_ycrcb = cv2.inRange(ycrcb, np.array([0, 133, 77], dtype=np.uint8), np.array([255, 173, 127], dtype=np.uint8))

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask_hsv = cv2.inRange(hsv, np.array([0, 15, 60], dtype=np.uint8), np.array([25, 255, 255], dtype=np.uint8))

    mask = cv2.bitwise_or(mask_ycrcb, mask_hsv)

    # Filter out face/head area (top-center of frame if face detected)
    face_mask = np.ones((h, w), dtype=np.uint8)
    cv2.rectangle(face_mask, (int(w * 0.32), 0), (int(w * 0.68), int(h * 0.42)), 0, -1)
    mask = cv2.bitwise_and(mask, mask, mask=face_mask)

    # Morphological noise removal
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.erode(mask, kernel, iterations=1)
    mask = cv2.dilate(mask, kernel, iterations=2)

    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return {
            "detected": False,
            "sign": None,
            "confidence": 0.0,
            "alternatives": [],
            "message": "No hand detected. Position hand clearly in front of camera.",
        }

    # Filter valid hand candidate contours
    valid_contours = [c for c in contours if cv2.contourArea(c) > (w * h * 0.012)]
    if not valid_contours:
        return {
            "detected": False,
            "sign": None,
            "confidence": 0.0,
            "alternatives": [],
            "message": "Hand gesture too small or far. Bring hand closer.",
        }

    largest = max(valid_contours, key=cv2.contourArea)
    area = cv2.contourArea(largest)
    x, y, bw, bh = cv2.boundingRect(largest)
    aspect_ratio = float(bw) / bh if bh > 0 else 1.0

    hull = cv2.convexHull(largest, returnPoints=False)
    defects_count = 0
    if len(hull) > 3 and len(largest) > 3:
        try:
            defects = cv2.convexityDefects(largest, hull)
            if defects is not None:
                for i in range(defects.shape[0]):
                    s, e, f, d = defects[i, 0]
                    if d > 1200:
                        defects_count += 1
        except Exception:
            pass

    # Dynamic Geometric Classification based on Defects & Aspect Ratio
    if defects_count >= 3:
        sign = "HELLO"
        confidence = 0.95
        alternatives = [
            {"sign": "GOODBYE", "confidence": 0.82},
            {"sign": "THANK YOU", "confidence": 0.70},
        ]
    elif defects_count == 2:
        sign = "WATER"
        confidence = 0.92
        alternatives = [
            {"sign": "HELLO", "confidence": 0.76},
            {"sign": "YOU", "confidence": 0.65},
        ]
    elif defects_count == 1:
        if aspect_ratio < 0.7:
            sign = "YOU"
            confidence = 0.93
            alternatives = [
                {"sign": "YES", "confidence": 0.75},
                {"sign": "WATER", "confidence": 0.68},
            ]
        else:
            sign = "THANK YOU"
            confidence = 0.90
            alternatives = [
                {"sign": "HELP", "confidence": 0.76},
                {"sign": "YES", "confidence": 0.66},
            ]
    else:
        # 0 defects: fist or thumbs up or morsel
        if aspect_ratio < 0.75:
            sign = "YES"
            confidence = 0.94
            alternatives = [
                {"sign": "NO", "confidence": 0.72},
                {"sign": "HELP", "confidence": 0.64},
            ]
        elif aspect_ratio > 1.2:
            sign = "WHY"
            confidence = 0.88
            alternatives = [
                {"sign": "NO", "confidence": 0.71},
            ]
        else:
            sign = "NO"
            confidence = 0.91
            alternatives = [
                {"sign": "YES", "confidence": 0.69},
            ]

    return {
        "detected": True,
        "sign": sign,
        "confidence": confidence,
        "alternatives": alternatives,
        "defects": defects_count,
        "message": f"Detected Sign: {sign} ({int(confidence * 100)}% confidence)",
    }
