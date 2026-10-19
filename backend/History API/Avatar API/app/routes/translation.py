from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.translator import translate_text


router = APIRouter(
    prefix="/translation",
    tags=["Translation"]
)


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "auto"
    target_language: str = "en"


@router.post("/translate")
def translate(request: TranslationRequest):
    return translate_text(
        text=request.text,
        source_language=request.source_language,
        target_language=request.target_language
    )