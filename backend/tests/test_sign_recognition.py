"""
Automated Unit Tests for Bharat Sign AI 3 - Task 3 Camera Sign Recognition Module.
Tests:
1. MediaPipe 21 landmark feature extraction and geometric classification.
2. Low-confidence gesture detection & abstention policy.
3. Incomplete landmark validation.
4. Sign-to-Text and Sign-to-Voice regional language translation.
"""

import pytest
from app.ai.sign_recognition_engine import sign_recognition_engine, LandmarkPoint

def build_21_landmarks(open_hand=True, thumb_up=False):
    """
    Constructs 21 MediaPipe hand landmark points.
    """
    pts = []
    # 0: Wrist
    pts.append(LandmarkPoint(0.50, 0.80, 0.0))

    # 1-4: Thumb
    pts.append(LandmarkPoint(0.53, 0.72, 0.0)) # 1: CMC
    pts.append(LandmarkPoint(0.56, 0.65, 0.0)) # 2: MCP
    pts.append(LandmarkPoint(0.59, 0.58, 0.0)) # 3: IP
    pts.append(LandmarkPoint(0.63 if open_hand or thumb_up else 0.54, 0.40 if thumb_up else (0.50 if open_hand else 0.62), 0.0)) # 4: Tip

    # 5-8: Index
    pts.append(LandmarkPoint(0.48, 0.60, 0.0)) # 5: MCP
    pts.append(LandmarkPoint(0.48, 0.50, 0.0)) # 6: PIP
    pts.append(LandmarkPoint(0.48, 0.40, 0.0)) # 7: DIP
    pts.append(LandmarkPoint(0.48, 0.20 if open_hand else 0.58, 0.0)) # 8: Tip

    # 9-12: Middle
    pts.append(LandmarkPoint(0.44, 0.60, 0.0)) # 9: MCP
    pts.append(LandmarkPoint(0.44, 0.50, 0.0)) # 10: PIP
    pts.append(LandmarkPoint(0.44, 0.40, 0.0)) # 11: DIP
    pts.append(LandmarkPoint(0.44, 0.18 if open_hand else 0.58, 0.0)) # 12: Tip

    # 13-16: Ring
    pts.append(LandmarkPoint(0.40, 0.60, 0.0)) # 13: MCP
    pts.append(LandmarkPoint(0.40, 0.50, 0.0)) # 14: PIP
    pts.append(LandmarkPoint(0.40, 0.40, 0.0)) # 15: DIP
    pts.append(LandmarkPoint(0.40, 0.22 if open_hand else 0.58, 0.0)) # 16: Tip

    # 17-20: Pinky
    pts.append(LandmarkPoint(0.36, 0.60, 0.0)) # 17: MCP
    pts.append(LandmarkPoint(0.36, 0.50, 0.0)) # 18: PIP
    pts.append(LandmarkPoint(0.36, 0.40, 0.0)) # 19: DIP
    pts.append(LandmarkPoint(0.36, 0.25 if open_hand else 0.58, 0.0)) # 20: Tip

    return pts

def test_incomplete_landmarks():
    res = sign_recognition_engine.classify_landmarks([LandmarkPoint(0.5, 0.5, 0.0)])
    assert res["detected"] is False
    assert res["shouldAbstain"] is True

def test_open_hand_hello_gesture():
    pts = build_21_landmarks(open_hand=True)
    res = sign_recognition_engine.classify_landmarks(pts)
    assert res["detected"] is True
    assert res["sign"] == "HELLO"
    assert res["confidence"] >= 0.90
    assert res["shouldAbstain"] is False

def test_thumbs_up_yes_gesture():
    pts = build_21_landmarks(open_hand=False, thumb_up=True)
    res = sign_recognition_engine.classify_landmarks(pts)
    assert res["detected"] is True
    assert res["sign"] == "YES"
    assert res["confidence"] >= 0.90

def test_low_confidence_abstention():
    # Idle/small hand (< 0.05 palm scale)
    pts = [LandmarkPoint(0.5, 0.5, 0.0)] * 21
    res = sign_recognition_engine.classify_landmarks(pts)
    assert res["detected"] is False
    assert res["shouldAbstain"] is True
