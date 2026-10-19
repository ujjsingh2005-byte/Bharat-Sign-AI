from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.sign_dictionary import get_signs


router = APIRouter(
    prefix="/signs",
    tags=["Sign Mapping"]
)


class SignMappingRequest(BaseModel):
    gloss: list[str]


@router.post("/map")
def map_signs(request: SignMappingRequest):
    signs = get_signs(request.gloss)

    return {
        "success": True,
        "gloss": request.gloss,
        "signs": signs
    }