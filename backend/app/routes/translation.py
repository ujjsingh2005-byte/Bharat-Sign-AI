from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.ai.translator import translate_text, SUPPORTED_LANGUAGES
from app.ai.language_service import language_service

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
    """
    Returns supported languages along with ASR and translation capability metadata.
    """
    return {
        "success": True,
        "languages": SUPPORTED_LANGUAGES,
        "capabilities": language_service.get_supported_languages()
    }

@router.get("/capabilities")
def get_capabilities():
    """
    Returns explicit ASR vs Sign Translation capability matrix for all configured languages.
    """
    return {
        "success": True,
        "capabilities": language_service.get_supported_languages()
    }

@router.post("/translate")
def translate(request: TranslationRequest):
    is_valid, error = language_service.validate_language(request.source_language, required_capability="translation")
    if not is_valid:
        return error

    return translate_text(
        text=request.text,
        source_language=request.source_language,
        target_language=request.target_language,
    )

@router.post("/semantic-pipeline")
def semantic_pipeline(request: SemanticPipelineRequest):
    """
    Executes the Master Universal Semantic Pipeline via LanguageProcessingService:
    Regional Indian Language / Hinglish -> Universal Semantic Representation -> ISL Grammar Reordering -> 3D Avatar Sign Sequence.
    Preserves selected language and provides informative error on unsupported languages.
    """
    return language_service.process_semantic_pipeline(
        text=request.text,
        source_language=request.source_language or "auto"
    )

@router.get("/evaluate/{language_code}")
def evaluate_language(language_code: str):
    """
    Evaluates a single supported language individually against standard ISL test phrases.
    """
    return language_service.evaluate_language(language_code)

@router.get("/evaluate-all")
def evaluate_all_languages():
    """
    Evaluates all configured regional languages separately and returns evaluation report.
    """
    return language_service.evaluate_all_supported_languages()

