from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ai.speech import transcribe_audio
from app.ai.translator import translate_text
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs

router = APIRouter(prefix="/voice", tags=["Voice"])

@router.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    try:
        result = transcribe_audio(audio)
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Speech recognition failed."))
        text = result.get("text", "").strip()
        language = result.get("language", "unknown")
        if not text:
            return {"success": False, "message": "No speech detected.", "text": "", "language": language, "translated_text": "", "gloss": [], "gloss_text": "", "signs": [], "animation": None}
        translated = translate_text(text=text, source_language=language, target_language="en").get("translated_text", text)
        gloss_result = text_to_gloss(translated)
        gloss = gloss_result["gloss"]
        signs = get_signs(gloss)
        animation = signs[0]["animation"] if signs else None
        return {"success": True, "text": text, "language": language, "translated_text": translated, "gloss": gloss, "gloss_text": gloss_result["gloss_text"], "signs": signs, "animation": animation, "supported_signs": ["HELLO", "THANK YOU", "GOODBYE"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
