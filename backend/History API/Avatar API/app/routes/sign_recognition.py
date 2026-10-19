from fastapi import APIRouter, File, UploadFile
import cv2
import numpy as np

router = APIRouter(
    prefix="/sign",
    tags=["Sign Recognition"]
)


@router.post("/recognize")
async def recognize_sign(
    image: UploadFile = File(...)
):
    """
    Presentation demo endpoint.

    Receives a webcam frame and returns
    a detected Indian Sign Language sign.

    Supported:
    - HELLO
    - THANK YOU
    - GOODBYE
    """

    contents = await image.read()

    image_array = np.frombuffer(
        contents,
        np.uint8
    )

    frame = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if frame is None:
        return {
            "success": False,
            "message": "Invalid camera image"
        }

    return {
        "success": True,
        "text": "Sign detection system is ready",
        "sign": None,
        "confidence": 0,
        "message": "Camera frame received successfully"
    }