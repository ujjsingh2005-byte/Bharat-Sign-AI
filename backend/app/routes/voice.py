from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from app.ai.speech import transcribe_audio
from app.ai.translator import translate_text
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs
from app.ai.reliability_engine import reliability_engine
from app.ai.missing_vocab_engine import missing_vocab_engine

router = APIRouter(prefix="/voice", tags=["Voice AI"])

@router.post("/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    target_language: Optional[str] = Form("en"),
):
    try:
        # Step 1: Transcribe Audio via Whisper ASR Provider
        result = transcribe_audio(audio)
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Speech recognition failed."))

        raw_text = result.get("text", "").strip()
        detected_language = result.get("language", "unknown")
        raw_confidence = result.get("confidence", 0.88)

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
                "confidence": 0.0,
                "shouldAbstain": True,
            }

        # Step 2: Translate Regional Language to English for ISL normalization
        eng_trans_res = translate_text(text=raw_text, source_language=detected_language, target_language="en")
        translated_english = eng_trans_res.get("translated_text", raw_text)

        # Step 3: Extract Universal Semantics & ISL Time-Subject-Object-Verb Grammar Reordering
        gloss_result = text_to_gloss(translated_english)
        gloss = gloss_result["gloss"]
        semantics = gloss_result["semantics"]

        # Step 4: Missing Vocabulary & OOV Fingerspelling Recovery
        vocab_recovery = missing_vocab_engine.recover_missing_vocabulary(translated_english, gloss)
        cov_ratio = vocab_recovery["coverage_ratio"]

        # Step 5: Confidence Calibration & ECE Evaluation
        calibration_eval = reliability_engine.evaluate_sample(translated_english, raw_confidence, cov_ratio)

        # Step 6: Map to 3D Avatar Sign Sequence
        signs = get_signs(gloss)
        primary_animation = signs[0]["animation"] if signs else None

        return {
            "success": True,
            "text": raw_text,
            "language": detected_language,
            "source_language": detected_language,
            "translated_text": translated_english,
            "english_translation": translated_english,
            "gloss": gloss,
            "gloss_text": gloss_result["gloss_text"],
            "signs": signs,
            "animation": primary_animation,
            "semantics": semantics,
            "rule_applied": gloss_result.get("rule_applied", "ISL Grammar Reordering (SOV)"),
            "confidence": calibration_eval["calibratedConfidence"],
            "rawConfidence": raw_confidence,
            "reliabilityStatus": calibration_eval["reliabilityStatus"],
            "shouldAbstain": calibration_eval["shouldAbstain"],
            "abstentionPolicyMessage": calibration_eval["abstentionPolicyMessage"],
            "vocabularyCoverage": cov_ratio,
            "unsupportedTokens": vocab_recovery["unsupported_tokens"],
            "fallbackLog": vocab_recovery["fallback_log"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
