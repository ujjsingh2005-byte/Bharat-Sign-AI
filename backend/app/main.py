from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.signs import router as signs_router
from app.routes.voice import router as voice_router
from app.routes.translation import router as translation_router
from app.routes.gloss import router as gloss_router
from app.routes.sign_recognition import router as sign_recognition_router

app = FastAPI(
    title="Bharat Sign AI 3 - Universal Indian Language & Sign Language API",
    version="3.0.0",
    description="Multilingual Bidirectional Translation Platform bridging Indian Sign Language (ISL) and 14+ Indian Languages."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Subrouters
app.include_router(voice_router)
app.include_router(translation_router)
app.include_router(gloss_router)
app.include_router(signs_router)
app.include_router(sign_recognition_router)

@app.get("/")
def root():
    return {
        "platform": "Bharat Sign AI 3",
        "version": "3.0.0",
        "tagline": "Connecting Languages. Empowering Communication. Breaking Barriers.",
        "modes": [
            "Mode 1: Text → Indian Sign Language",
            "Mode 2: Voice / Audio → Indian Sign Language",
            "Mode 3: Regional Language → Universal Semantic Layer → ISL",
            "Mode 4: Camera / Video Sign Recognition → English",
            "Mode 5: Sign Recognition → Regional Indian Languages + Voice Output",
            "Mode 6: Live Two-Way Communication Studio"
        ],
        "supported_languages": [
            "English", "Hindi", "Bhojpuri", "Marathi", "Bengali",
            "Gujarati", "Punjabi", "Tamil", "Telugu", "Malayalam",
            "Kannada", "Odia", "Assamese", "Urdu", "Sanskrit"
        ],
        "status": "Operational 🚀"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
