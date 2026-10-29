"""
Service for loading and running inference with the Google Colab trained model (bharat_sign_ai_model.pkl).
Model Type: RandomForestClassifier (trained on 21 MediaPipe hand landmarks, 63 features: x_0..z_20).
Classes: ['Adjective', 'Hello', 'ThankYou']
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional

MODEL_FILENAME = "bharat_sign_ai_model.pkl"
POSSIBLE_PATHS = [
    r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model39.pkl",
    r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model37.pkl",
    r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model22.pkl",
    r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model36.pkl",
    r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model35.pkl",
    r"C:\Users\UJJWAL SINGH\Downloads\adjective 2 file\bharat_sign_ai_model34.pkl",
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), MODEL_FILENAME),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "isl_models", "bharat_sign_ai_model22.pkl"),
    os.path.join(os.path.dirname(__file__), "include", "weights", MODEL_FILENAME),
    os.path.join(os.getcwd(), MODEL_FILENAME),
]

class ColabModelService:
    def __init__(self):
        self.model = None
        self.model_path = None
        self.classes_ = []
        self.feature_names_in_ = []
        self.load_model()

    def load_model(self) -> bool:
        for path in POSSIBLE_PATHS:
            if os.path.exists(path):
                try:
                    self.model = joblib.load(path)
                    self.model_path = path
                    self.classes_ = list(getattr(self.model, "classes_", ["Adjective", "Hello", "ThankYou"]))
                    self.feature_names_in_ = list(getattr(self.model, "feature_names_in_", [
                        f"{coord}_{i}" for i in range(21) for coord in ["x", "y", "z"]
                    ]))
                    print(f"Colab Model successfully loaded from {path}. Classes: {self.classes_}")
                    return True
                except Exception as e:
                    print(f"Error loading model from {path}: {e}")
        print("Warning: bharat_sign_ai_model.pkl not found in expected paths.")
        return False

    def is_available(self) -> bool:
        return self.model is not None

    def get_info(self) -> Dict[str, Any]:
        return {
            "name": "Google Colab Trained Model (RandomForest)",
            "model_source": "colab",
            "available": self.is_available(),
            "model_path": self.model_path,
            "classes": self.classes_,
            "feature_count": len(self.feature_names_in_),
            "classes_count": len(self.classes_),
            "description": "Trained in Google Colab on 21 MediaPipe hand landmarks (63 spatial features) for Adjective, Hello, and ThankYou.",
        }

    def predict_from_landmarks(self, landmarks: List[Any]) -> Dict[str, Any]:
        """
        Accepts 21 landmark items (each with .x, .y, .z or dict keys 'x', 'y', 'z').
        Enforces strict confidence threshold (>= 0.65) and probability margin (>= 0.20)
        to STRICTLY REJECT unknown/unsupported gestures.
        """
        if not self.is_available():
            if not self.load_model():
                return {
                    "success": False,
                    "detected": False,
                    "sign": None,
                    "confidence": 0.0,
                    "shouldAbstain": True,
                    "message": "10-Sign model file is not loaded.",
                }

        if len(landmarks) < 21:
            return {
                "success": False,
                "detected": False,
                "sign": None,
                "confidence": 0.0,
                "shouldAbstain": True,
                "message": f"Expected 21 hand landmarks, received {len(landmarks)}.",
            }

        # Extract 63 coordinates safely
        feature_vals = []
        for i in range(21):
            pt = landmarks[i]
            x = getattr(pt, "x", 0.0) if hasattr(pt, "x") else (pt.get("x", 0.0) if isinstance(pt, dict) else 0.0)
            if x is None: x = 0.0
            y = getattr(pt, "y", 0.0) if hasattr(pt, "y") else (pt.get("y", 0.0) if isinstance(pt, dict) else 0.0)
            if y is None: y = 0.0
            z = getattr(pt, "z", 0.0) if hasattr(pt, "z") else (pt.get("z", 0.0) if isinstance(pt, dict) else 0.0)
            if z is None: z = 0.0
            feature_vals.extend([float(x), float(y), float(z)])

        try:
            # Build DataFrame matching exact feature_names_in_
            df = pd.DataFrame([feature_vals], columns=self.feature_names_in_)
            probs_raw = self.model.predict_proba(df)[0]
            pred_raw = self.model.classes_[np.argmax(probs_raw)]

            # Check horizontally mirrored (x' = 1 - x) to support both hands and mirrored webcams
            feature_vals_mir = list(feature_vals)
            for k in range(0, len(feature_vals_mir), 3):
                feature_vals_mir[k] = 1.0 - feature_vals_mir[k]
            df_mir = pd.DataFrame([feature_vals_mir], columns=self.feature_names_in_)
            probs_mir = self.model.predict_proba(df_mir)[0]
            pred_mir = self.model.classes_[np.argmax(probs_mir)]

            if np.max(probs_mir) > np.max(probs_raw):
                prediction = pred_mir
                probs = probs_mir
            else:
                prediction = pred_raw
                probs = probs_raw

            sorted_probs = sorted(probs, reverse=True)
            top_prob = float(sorted_probs[0])
            second_prob = float(sorted_probs[1]) if len(sorted_probs) > 1 else 0.0
            margin = top_prob - second_prob

            prob_map = {cls_name: float(prob) for cls_name, prob in zip(self.classes_, probs)}

            # STRICT OUT-OF-DISTRIBUTION (OOD) ABSTENTION:
            # 1. Idle/Resting hand check: Hand at bottom of screen / waist (wrist Y > 0.85)
            wrist_y = feature_vals[1]
            is_idle_or_resting = (wrist_y > 0.85)

            # 2. Strict Confidence Threshold (>= 0.65) and Margin (>= 0.20)
            # Unknown gestures only reach diffuse probabilities (0.15 - 0.35 with margin < 0.08)
            is_known_sign = (top_prob >= 0.48) and (margin >= 0.12) and (not is_idle_or_resting)



            if not is_known_sign:
                # STRICT REJECTION: Do NOT output ANY of the 10 target sign words!
                return {
                    "success": False,
                    "detected": False,
                    "sign": None,
                    "raw_label": None,
                    "display": "Unknown sign",
                    "hindi": "अनजाना संकेत",
                    "meaning": "Unsupported or unverified gesture",
                    "confidence": round(top_prob, 3),
                    "shouldAbstain": True,
                    "status": "Unknown sign",
                    "probabilities": prob_map,
                    "alternatives": [],
                    "model_engine": "ISL 10-Sign Expanded Model",
                    "message": "Unknown sign. Gesture does not match any of the 18 target ISL signs."
                }

            alternatives = [
                {"sign": cls_name, "confidence": round(float(prob), 3)}
                for cls_name, prob in sorted(prob_map.items(), key=lambda item: item[1], reverse=True)
                if prob > 0.10 and cls_name != prediction
            ]

            # Display labels and translation helper across all 17 ISL signs (Greetings + Adjectives)
            label_map = {
                "HELLO": {"display": "Hello (हैलो)", "hi": "हैलो", "meaning": "Single Hand Greeting Wave (एक हाथ से हैलो)"},
                "NAMASTE": {"display": "Namaste (नमस्ते)", "hi": "नमस्ते", "meaning": "Traditional Indian Greeting (Both Hands Joined)"},
                "NARROW": {"display": "Narrow (संकीर्ण / तंग)", "hi": "तंग", "meaning": "Small Width / Restricted Space"},
                "LARGE": {"display": "Large / Big (बड़ा / विशाल)", "hi": "बड़ा", "meaning": "Large Size / Big Volume"},
                "Large": {"display": "Large / Big (बड़ा / विशाल)", "hi": "बड़ा", "meaning": "Large Size / Big Volume"},
                "Narrow": {"display": "Narrow (संकीर्ण / तंग)", "hi": "तंग", "meaning": "Small Width / Restricted Space"},
                "SMALL": {"display": "Small / Little (छोटा / सूक्ष्म)", "hi": "छोटा", "meaning": "Small Size / Little"},
                "SLOW": {"display": "Slow (धीमा / धीरे)", "hi": "धीमा", "meaning": "Slow Motion / Deliberate"},
                "FAST": {"display": "Fast / Quick (तेज़ / शीघ्र)", "hi": "तेज़", "meaning": "Fast Speed / Quick"},
                "LOUD": {"display": "Loud (तेज़ / ज़ोरदार)", "hi": "तेज़", "meaning": "High Volume / Loud Noise"},
                "QUIET": {"display": "Quiet (शांत)", "hi": "शांत", "meaning": "Silence / Quietness"},
                "HAPPY": {"display": "Happy (खुश)", "hi": "खुश", "meaning": "Joy / Happiness"},
                "SAD": {"display": "Sad (उदास / दुखी)", "hi": "उदास", "meaning": "Sorrow / Sadness"},
                "UGLY": {"display": "Ugly (कुरूप / भद्दा)", "hi": "कुरूप", "meaning": "Unattractive / Ugly"},
                "DEAF": {"display": "Deaf (बधिर / बहरा)", "hi": "बधिर", "meaning": "Deaf / Hearing Impairment"},
                "BEAUTIFUL": {"display": "Beautiful (सुंदर / खूबसूरत)", "hi": "सुंदर", "meaning": "Beautiful / Attractive / Aesthetic"},
                "BLIND": {"display": "Blind (दृष्टिहीन / अंधा)", "hi": "दृष्टिहीन", "meaning": "Blind / Vision Impairment"},
                "SHALLOW": {"display": "Shallow (उथला / कम गहरा)", "hi": "उथला", "meaning": "Shallow Depth / Low Water Level"},
                "CLEAN": {"display": "Clean (साफ़ / स्वच्छ)", "hi": "साफ़", "meaning": "Clean / Pure / Neat"},
                "DIRTY": {"display": "Dirty (गंदा / मैला)", "hi": "गंदा", "meaning": "Dirty / Stained / Unclean"},
                "STRONG": {"display": "Strong (मजबूत / बलवान)", "hi": "मजबूत", "meaning": "Strong / Muscular / Powerful"},
                "WEAK": {"display": "Weak (कमज़ोर)", "hi": "कमज़ोर", "meaning": "Weak / Delicate / Fragile"},
                "DEAD": {"display": "Dead (मृत / मरा हुआ)", "hi": "मृत", "meaning": "Dead / Lifeless"},
                "ALIVE": {"display": "Alive (जीवित / ज़िंदा)", "hi": "जीवित", "meaning": "Alive / Living / Breathing"},
                "HEAVY": {"display": "Heavy (भारी / वज़नदार)", "hi": "भारी", "meaning": "Heavy Weight / Dense Burden"},
            }
            pred_key = str(prediction)
            meta = label_map.get(pred_key) or label_map.get(pred_key.upper()) or {"display": str(prediction), "hi": str(prediction), "meaning": ""}

            return {
                "success": True,
                "detected": True,
                "sign": str(prediction).upper(),
                "raw_label": str(prediction),
                "display": meta["display"],
                "hindi": meta["hi"],
                "meaning": meta["meaning"],
                "confidence": round(top_prob, 3),
                "shouldAbstain": False,
                "status": "Recognized",
                "probabilities": prob_map,
                "alternatives": alternatives,
                "model_engine": "ISL 10-Sign Expanded Model (RandomForest)",
                "message": f"Recognized '{prediction}' ({int(top_prob * 100)}% confidence)",
            }
        except Exception as e:
            return {
                "success": False,
                "detected": False,
                "sign": None,
                "confidence": 0.0,
                "shouldAbstain": True,
                "message": f"Inference error in Colab model: {str(e)}",
            }

colab_model_service = ColabModelService()
