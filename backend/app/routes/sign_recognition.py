from fastapi import APIRouter, File, UploadFile, Form
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import cv2
import numpy as np

from app.ai.sign_recognition import analyze_hand_frame
from app.ai.translator import translate_text
from app.ai.speech_synthesis import generate_voice_audio

router = APIRouter(prefix="/sign", tags=["Sign Recognition & Sign-to-Voice"])

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0

class LandmarkRecognitionRequest(BaseModel):
    landmarks: List[LandmarkPoint]
    target_language: Optional[str] = "en"
    sign_language: Optional[str] = "ISL"

class SignToVoiceRequest(BaseModel):
    sign: str
    target_language: Optional[str] = "hi"
    sign_language: Optional[str] = "ISL"

@router.post("/recognize")
async def recognize_sign(
    image: UploadFile = File(...),
    target_language: Optional[str] = Form("en"),
    sign_language: Optional[str] = Form("ISL"),
):
    """
    Receives camera frame and analyzes it for Sign Language gestures with Sign-to-Text & Sign-to-Voice.
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
        sign_lang = sign_language or "ISL"

        if sign and target_lang != "en":
            trans_res = translate_text(text=sign.lower(), source_language="en", target_language=target_lang)
            regional_text = trans_res.get("translated_text", sign)

        audio_data_url = generate_voice_audio(text=regional_text, language=target_lang) if regional_text else None

        return {
            "success": True,
            "sign": sign,
            "text": regional_text,
            "english_sign": sign,
            "confidence": confidence,
            "alternatives": analysis.get("alternatives", []),
            "message": analysis.get("message", "Sign frame analyzed."),
            "target_language": target_lang,
            "sign_language": sign_lang,
            "audio": audio_data_url,
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
    Translates Sign gesture to Text & Voice Speech across all 14 regional languages.
    """
    pts = request.landmarks
    if len(pts) < 21:
        return {
            "success": False,
            "sign": None,
            "confidence": 0.0,
            "shouldAbstain": True,
            "message": "Incomplete hand landmarks (expected 21 points)."
        }

    from app.ai.sign_recognition_engine import sign_recognition_engine
    result = sign_recognition_engine.classify_landmarks(pts)

    if not result.get("detected") or result.get("shouldAbstain"):
        return {
            "success": False,
            "sign": None,
            "text": "Place hand inside active scanner frame",
            "english_sign": None,
            "confidence": result.get("confidence", 0.0),
            "shouldAbstain": True,
            "target_language": request.target_language or "en",
            "sign_language": request.sign_language or "ISL",
            "audio": None,
            "alternatives": result.get("alternatives", []),
            "message": result.get("message", "Low confidence gesture or unaligned hand."),
        }

    sign = result["sign"]
    raw_name = result.get("label", sign)
    confidence = result["confidence"]
    target_lang = request.target_language or "en"
    sign_lang = request.sign_language or "ISL"

    regional_text = raw_name
    if sign and target_lang != "en":
        trans_res = translate_text(text=raw_name.lower(), source_language="en", target_language=target_lang)
        regional_text = trans_res.get("translated_text", raw_name)

    # Generate Spoken Audio in native regional language
    audio_data_url = generate_voice_audio(text=regional_text, language=target_lang) if regional_text else None

    return {
        "success": True,
        "sign": sign,
        "text": regional_text,
        "english_sign": raw_name,
        "confidence": confidence,
        "shouldAbstain": False,
        "target_language": target_lang,
        "sign_language": sign_lang,
        "audio": audio_data_url,
        "alternatives": result.get("alternatives", []),
        "message": f"Recognized {sign_lang} Sign: '{sign}' -> Spoken {target_lang.upper()} ({int(confidence * 100)}% confidence)",
    }

@router.post("/sign-to-speech")
def sign_to_speech(request: SignToVoiceRequest):
    """
    Directly converts a Sign Language gesture to Text & Spoken Audio Voice Speech in any of the 14 regional languages.
    """
    sign = request.sign or "HELLO"
    target_lang = request.target_language or "hi"
    sign_lang = request.sign_language or "ISL"

    regional_text = sign
    if target_lang != "en":
        trans_res = translate_text(text=sign.lower(), source_language="en", target_language=target_lang)
        regional_text = trans_res.get("translated_text", sign)

    audio_data_url = generate_voice_audio(text=regional_text, language=target_lang)

    return {
        "success": True,
        "sign": sign,
        "text": regional_text,
        "english_sign": sign,
        "target_language": target_lang,
        "sign_language": sign_lang,
        "audio": audio_data_url,
        "message": f"Sign '{sign}' translated to {target_lang.upper()} spoken voice speech.",
    }
