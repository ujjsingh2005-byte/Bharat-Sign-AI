from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.gloss import text_to_gloss


router = APIRouter(
    prefix="/gloss",
    tags=["ISL Gloss"]
)


class GlossRequest(BaseModel):
    text: str


@router.post("/convert")
def convert_to_gloss(request: GlossRequest):
    return text_to_gloss(request.text)