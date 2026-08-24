from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.signs import router as signs_router
from app.routes.voice import router as voice_router
from app.routes.translation import router as translation_router
from app.routes.gloss import router as gloss_router
from app.routes.sign_recognition import router as sign_recognition_router


app = FastAPI(
    title="Bharat-Sign AI API",
    version="1.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(voice_router)
app.include_router(translation_router)
app.include_router(gloss_router)
app.include_router(signs_router)
app.include_router(sign_recognition_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Bharat-Sign AI Backend 🚀",
        "features": [
            "Voice to ISL",
            "Translation",
            "ISL Gloss",
            "3D Avatar",
            "Camera Sign Recognition"
        ]
    }