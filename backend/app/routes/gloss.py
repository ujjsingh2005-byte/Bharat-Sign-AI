from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.gloss import text_to_gloss
from app.ai.sign_dictionary import get_signs

router = APIRouter(prefix="/gloss", tags=["ISL Gloss"])

class GlossRequest(BaseModel):
    text: str

@router.post("/convert")
def convert_to_gloss(request: GlossRequest):
    result = text_to_gloss(request.text)
    gloss = result.get("gloss", [])
    signs = get_signs(gloss)
    return {
        "success": True,
        "text": request.text,
        "gloss": gloss,
        "gloss_text": result.get("gloss_text", ""),
        "semantics": result.get("semantics", {}),
        "signs": signs,
        "rule_applied": result.get("rule_applied"),
    }
