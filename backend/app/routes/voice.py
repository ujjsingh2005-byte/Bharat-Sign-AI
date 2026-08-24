from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from app.ai.speech import transcribe_audio
from app.ai.translator import translate_text
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs

router = APIRouter(prefix="/voice", tags=["Voice AI"])

@router.post("/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    target_language: Optional[str] = Form("en"),
):
    try:
        result = transcribe_audio(audio)
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Speech recognition failed."))

        raw_text = result.get("text", "").strip()
        detected_language = result.get("language", "unknown")

        if not raw_text:
            return {
                "success": False,
                "message": "No speech was detected in the audio.",
                "text": "",
                "language": detected_language,
                "translated_text": "",
                "gloss": [],
                "gloss_text": "",
                "signs": [],
                "animation": None,
                "semantics": {},
            }

        # 1. Translate to English for ISL semantic normalization
        eng_trans_res = translate_text(text=raw_text, source_language=detected_language, target_language="en")
        translated_english = eng_trans_res.get("translated_text", raw_text)

        # 2. Convert to ISL Gloss & Semantic Representation
        gloss_result = text_to_gloss(translated_english)
        gloss = gloss_result["gloss"]
        semantics = gloss_result["semantics"]

        # 3. Map to Sign Animation Sequence (with fingerspelling fallback)
        signs = get_signs(gloss)
        primary_animation = signs[0]["animation"] if signs else None

        return {
            "success": True,
            "text": raw_text,
            "language": detected_language,
            "translated_text": translated_english,
            "gloss": gloss,
            "gloss_text": gloss_result["gloss_text"],
            "signs": signs,
            "animation": primary_animation,
            "semantics": semantics,
            "rule_applied": gloss_result.get("rule_applied"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
