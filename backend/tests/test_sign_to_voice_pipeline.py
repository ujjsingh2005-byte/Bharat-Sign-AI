"""
Automated Unit Tests for Bharat Sign AI 3 - Sign-to-Text & Sign-to-Voice Pipeline.
Pipeline:
Webcam Landmark Input -> Sign Recognition Engine -> Recognized Sign -> Text Translation -> Optional Spoken Voice Audio
"""

import pytest
from app.ai.sign_recognition_engine import sign_recognition_engine, LandmarkPoint
from app.ai.translator import translate_text
from app.ai.speech_synthesis import generate_voice_audio

def build_open_hand_landmarks():
    pts = [LandmarkPoint(0.50, 0.80, 0.0)] # Wrist
    pts.append(LandmarkPoint(0.53, 0.72, 0.0))
    pts.append(LandmarkPoint(0.56, 0.65, 0.0))
    pts.append(LandmarkPoint(0.59, 0.58, 0.0))
    pts.append(LandmarkPoint(0.63, 0.50, 0.0)) # Thumb tip

    # Index
    pts.append(LandmarkPoint(0.48, 0.60, 0.0))
    pts.append(LandmarkPoint(0.48, 0.50, 0.0))
    pts.append(LandmarkPoint(0.48, 0.40, 0.0))
    pts.append(LandmarkPoint(0.48, 0.20, 0.0))

    # Middle
    pts.append(LandmarkPoint(0.44, 0.60, 0.0))
    pts.append(LandmarkPoint(0.44, 0.50, 0.0))
    pts.append(LandmarkPoint(0.44, 0.40, 0.0))
    pts.append(LandmarkPoint(0.44, 0.18, 0.0))

    # Ring
    pts.append(LandmarkPoint(0.40, 0.60, 0.0))
    pts.append(LandmarkPoint(0.40, 0.50, 0.0))
    pts.append(LandmarkPoint(0.40, 0.40, 0.0))
    pts.append(LandmarkPoint(0.40, 0.22, 0.0))

    # Pinky
    pts.append(LandmarkPoint(0.36, 0.60, 0.0))
    pts.append(LandmarkPoint(0.36, 0.50, 0.0))
    pts.append(LandmarkPoint(0.36, 0.40, 0.0))
    pts.append(LandmarkPoint(0.36, 0.25, 0.0))

    return pts

def test_full_sign_to_voice_pipeline():
    # Step 1: Input Landmarks
    pts = build_open_hand_landmarks()

    # Step 2: Sign Recognition Model
    recognition_res = sign_recognition_engine.classify_landmarks(pts)
    assert recognition_res["detected"] is True
    recognized_sign = recognition_res["sign"] # "HELLO"

    # Step 3: Text Display & Regional Translation (e.g. Hindi)
    translation_res = translate_text(recognized_sign.lower(), source_language="en", target_language="hi")
    assert translation_res["success"] is True
    regional_text = translation_res["translated_text"] # "नमस्ते"

    # Step 4: Optional Speech Output Generation
    audio_url = generate_voice_audio(regional_text, language="hi")
    assert audio_url is not None
    assert audio_url.startswith("data:audio/mp3;base64,")
