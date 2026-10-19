from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.ai.sign_dictionary import get_sign, get_signs, get_all_signs, get_learning_library, VOCABULARY_SIGNS

router = APIRouter(prefix="/signs", tags=["Sign Dictionary & Mapping"])

class SignMappingRequest(BaseModel):
    gloss: List[str]

@router.get("/learning-library")
def learning_library():
    """
    Returns the master learning library containing all verified gestures and
    conversational phrases from the visual reference chart.
    """
    items = get_learning_library()
    return {
        "success": True,
        "total": len(items),
        "library": items
    }

@router.get("/all")
def all_signs():
    return {
        "success": True,
        **get_all_signs()
    }

@router.get("/lookup/{word}")
def lookup_sign(word: str):
    sign = get_sign(word)
    if sign:
        return {"success": True, "sign": sign}
    return {"success": False, "message": f"Sign '{word}' not found in base dictionary. Will use fingerspelling.", "sign": None}

@router.post("/map")
def map_signs(request: SignMappingRequest):
    signs = get_signs(request.gloss)
    return {
        "success": True,
        "gloss": request.gloss,
        "signs": signs,
        "count": len(signs),
    }
