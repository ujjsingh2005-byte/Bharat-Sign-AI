from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.ai.translator import translate_text, SUPPORTED_LANGUAGES
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs

router = APIRouter(prefix="/translation", tags=["Translation & Universal Semantic Layer"])

class TranslationRequest(BaseModel):
    text: str
    source_language: Optional[str] = "auto"
    target_language: Optional[str] = "en"

class SemanticPipelineRequest(BaseModel):
    text: str
    source_language: Optional[str] = "auto"

@router.get("/languages")
def get_languages():
    return {
        "success": True,
        "languages": SUPPORTED_LANGUAGES,
    }

@router.post("/translate")
def translate(request: TranslationRequest):
    return translate_text(
        text=request.text,
        source_language=request.source_language,
        target_language=request.target_language,
    )

@router.post("/semantic-pipeline")
def semantic_pipeline(request: SemanticPipelineRequest):
    """
    Executes the Master Universal Semantic Pipeline:
    Any Regional Indian Language -> Universal Semantic Representation -> ISL Grammar Reordering -> 3D Avatar Sign Sequence
    """
    raw_text = request.text.strip()
    if not raw_text:
        return {
            "success": False,
            "message": "Please enter text to translate.",
            "original_text": "",
            "english_translation": "",
            "semantics": {},
            "gloss": [],
            "gloss_text": "",
            "signs": [],
        }

    # Step 1: Translate to English if in regional language
    src_lang = request.source_language or "auto"
    trans_res = translate_text(text=raw_text, source_language=src_lang, target_language="en")
    english_text = trans_res.get("translated_text", raw_text)

    # Step 2: Extract Universal Semantics & ISL Grammar
    gloss_res = text_to_gloss(english_text)
    gloss = gloss_res.get("gloss", [])
    semantics = gloss_res.get("semantics", {})

    # Step 3: Map to Sign Dictionary & Fingerspelling sequence
    signs = get_signs(gloss)

    return {
        "success": True,
        "original_text": raw_text,
        "source_language": src_lang,
        "english_translation": english_text,
        "semantics": semantics,
        "gloss": gloss,
        "gloss_text": gloss_res.get("gloss_text", ""),
        "signs": signs,
        "rule_applied": gloss_res.get("rule_applied", "ISL Grammar Reordering"),
    }
