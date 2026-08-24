import os
import tempfile
import torch

# Fix for CPU optimization
torch.backends.mkldnn.enabled = False
torch.set_num_threads(1)

whisper_model = None

def get_whisper_model():
    global whisper_model
    if whisper_model is None:
        try:
            import whisper
            whisper_model = whisper.load_model("tiny")
        except Exception as e:
            print(f"[Speech AI] Whisper model load error: {e}")
    return whisper_model

def transcribe_audio(upload_file) -> dict:
    """
    Transcribes audio file using Whisper with automatic language detection and hallucination suppression.
    """
    suffix = os.path.splitext(upload_file.filename)[1] if upload_file.filename else ".wav"
    if not suffix:
        suffix = ".wav"

    temp_path = None
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp.write(upload_file.file.read())
            temp_path = temp.name

        model = get_whisper_model()
        if model is None:
            return {
                "success": False,
                "text": "",
                "error": "Whisper speech recognition model could not be loaded."
            }

        # Transcribe audio with temperature 0 to eliminate hallucinations
        result = model.transcribe(
            temp_path,
            fp16=False,
            temperature=0,
            condition_on_previous_text=False,
            no_speech_threshold=0.6,
        )

        detected_text = (result.get("text") or "").strip()
        detected_lang = result.get("language", "en")

        return {
            "success": True,
            "text": detected_text,
            "language": detected_lang,
        }
    except Exception as e:
        print(f"\n[Speech AI] Whisper Transcription Error: {e}\n")
        return {
            "success": False,
            "text": "",
            "error": str(e)
        }
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
