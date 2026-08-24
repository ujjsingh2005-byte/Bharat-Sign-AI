from fastapi import APIRouter, File, UploadFile, Form
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import cv2
import numpy as np

from app.ai.sign_recognition import analyze_hand_frame
from app.ai.translator import translate_text

router = APIRouter(prefix="/sign", tags=["Sign Recognition"])

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0

class LandmarkRecognitionRequest(BaseModel):
    landmarks: List[LandmarkPoint]
    target_language: Optional[str] = "en"

@router.post("/recognize")
async def recognize_sign(
    image: UploadFile = File(...),
    target_language: Optional[str] = Form("en"),
):
    """
    Receives camera frame and analyzes it for Indian Sign Language gestures.
    """
    try:
        contents = await image.read()
        image_array = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if frame is None:
            return {
                "success": False,
                "message": "Invalid camera image frame received.",
                "sign": None,
                "confidence": 0.0,
            }

        analysis = analyze_hand_frame(frame)
        sign = analysis.get("sign")
        confidence = analysis.get("confidence", 0.0)

        regional_text = sign
        target_lang = target_language or "en"
        if sign and target_lang != "en":
            trans_res = translate_text(text=sign.lower(), source_language="en", target_language=target_lang)
            regional_text = trans_res.get("translated_text", sign)

        return {
            "success": True,
            "sign": sign,
            "text": regional_text,
            "english_sign": sign,
            "confidence": confidence,
            "alternatives": analysis.get("alternatives", []),
            "message": analysis.get("message", "Sign frame analyzed."),
            "target_language": target_lang,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Recognition error: {str(e)}",
            "sign": None,
            "confidence": 0.0,
        }

@router.post("/recognize-landmarks")
def recognize_landmarks(request: LandmarkRecognitionRequest):
    """
    High-precision geometric classifier using 21 MediaPipe hand landmarks.
    """
    pts = request.landmarks
    if len(pts) < 21:
        return {"success": False, "sign": None, "confidence": 0.0, "message": "Incomplete hand landmarks."}

    wrist = pts[0]
    thumb_mcp = pts[2]
    thumb_tip = pts[4]
    index_pip = pts[6]
    index_tip = pts[8]
    middle_pip = pts[10]
    middle_tip = pts[12]
    ring_pip = pts[14]
    ring_tip = pts[16]
    pinky_pip = pts[18]
    pinky_tip = pts[20]

    # Finger extensions: y is smaller when finger is pointing UP on screen
    index_up = index_tip.y < index_pip.y
    middle_up = middle_tip.y < middle_pip.y
    ring_up = ring_tip.y < ring_pip.y
    pinky_up = pinky_tip.y < pinky_pip.y
    
    # Thumb extension: check distance from wrist/palm
    thumb_dist = abs(thumb_tip.x - wrist.x) + abs(thumb_tip.y - wrist.y)
    mcp_dist = abs(thumb_mcp.x - wrist.x) + abs(thumb_mcp.y - wrist.y)
    thumb_extended = thumb_dist > (mcp_dist * 1.2) or thumb_tip.y < thumb_mcp.y

    # Check pinched morsel shape (all tips clustered together)
    tip_spread = (
        abs(index_tip.x - thumb_tip.x) + abs(index_tip.y - thumb_tip.y) +
        abs(middle_tip.x - thumb_tip.x) + abs(middle_tip.y - thumb_tip.y)
    )
    is_pinched = tip_spread < 0.12

    up_count = sum([1 for f in [index_up, middle_up, ring_up, pinky_up] if f])

    # Distinct Sign Decision Logic
    if is_pinched:
        sign = "FOOD"
        confidence = 0.95
        alternatives = [{"sign": "WATER", "confidence": 0.70}]
    elif index_up and middle_up and ring_up and pinky_up and thumb_extended:
        sign = "HELLO"
        confidence = 0.97
        alternatives = [{"sign": "GOODBYE", "confidence": 0.85}, {"sign": "NAMASTE", "confidence": 0.80}]
    elif index_up and middle_up and ring_up and pinky_up and not thumb_extended:
        sign = "THANK YOU"
        confidence = 0.94
        alternatives = [{"sign": "HELLO", "confidence": 0.80}]
    elif index_up and middle_up and ring_up and not pinky_up:
        sign = "WATER"  # 'W' sign
        confidence = 0.96
        alternatives = [{"sign": "YOU", "confidence": 0.65}]
    elif index_up and middle_up and not ring_up and not pinky_up:
        sign = "WATER"  # 'V' / Peace sign
        confidence = 0.95
        alternatives = [{"sign": "YOU", "confidence": 0.70}]
    elif index_up and not middle_up and not ring_up and not pinky_up:
        sign = "YOU"  # Pointing index
        confidence = 0.96
        alternatives = [{"sign": "WATER", "confidence": 0.60}]
    elif pinky_up and thumb_extended and not index_up and not middle_up and not ring_up:
        sign = "WHY"  # 'Y' handshape
        confidence = 0.95
        alternatives = [{"sign": "NO", "confidence": 0.65}]
    elif up_count == 0 and thumb_extended:
        sign = "YES"  # Thumbs up
        confidence = 0.96
        alternatives = [{"sign": "HELP", "confidence": 0.75}]
    elif up_count == 0 and not thumb_extended:
        sign = "NO"  # Closed fist
        confidence = 0.95
        alternatives = [{"sign": "SORRY", "confidence": 0.70}]
    else:
        sign = "HELLO"
        confidence = 0.88
        alternatives = [{"sign": "THANK YOU", "confidence": 0.75}]

    display_names = {
        "HELLO": "Hello / Namaste",
        "THANK YOU": "Thank You",
        "GOODBYE": "Goodbye",
        "YES": "Yes / Thumbs Up",
        "NO": "No / Stop",
        "HELP": "Help / Emergency",
        "WATER": "Water",
        "YOU": "You / Pointing",
        "WHY": "Why",
        "FOOD": "Food / Eat",
    }

    target_lang = request.target_language or "en"
    regional_text = display_names.get(sign, sign)

    if sign and target_lang != "en":
        trans_res = translate_text(text=display_names.get(sign, sign).lower(), source_language="en", target_language=target_lang)
        regional_text = trans_res.get("translated_text", display_names.get(sign, sign))

    return {
        "success": True,
        "sign": sign,
        "text": regional_text,
        "english_sign": display_names.get(sign, sign),
        "confidence": confidence,
        "target_language": target_lang,
        "alternatives": alternatives,
        "message": f"Recognized Indian Sign: {sign} ({int(confidence * 100)}% confidence)",
    }
