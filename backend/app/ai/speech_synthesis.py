import io
import base64
from typing import Optional
from gtts import gTTS

# Mapping ISO 639 codes to gTTS language tags
GTTS_LANG_MAP = {
    "en": "en",
    "hi": "hi",
    "bho": "hi",  # Bhojpuri uses Hindi phonetics for high-quality audio
    "mr": "mr",
    "bn": "bn",
    "gu": "gu",
    "pa": "pa",
    "ta": "ta",
    "te": "te",
    "ml": "ml",
    "kn": "kn",
    "or": "or",
    "as": "bn",  # Assamese fallback to Bengali phonetics
    "ur": "ur",
    "sa": "hi",  # Sanskrit fallback to Hindi phonetics
}

def generate_voice_audio(text: str, language: str = "hi") -> Optional[str]:
    """
    Generates high-quality native audio speech for text in 14 regional languages.
    Returns a base64 data URL string: 'data:audio/mp3;base64,...'
    """
    if not text or not text.strip():
        return None

    try:
        clean_lang = (language or "hi").lower().split("-")[0]
        gtts_lang = GTTS_LANG_MAP.get(clean_lang, "hi")

        tts = gTTS(text=text.strip(), lang=gtts_lang)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_bytes = fp.read()

        b64_str = base64.b64encode(audio_bytes).decode("utf-8")
        return f"data:audio/mp3;base64,{b64_str}"
    except Exception as e:
        print(f"Speech synthesis error: {e}")
        return None
