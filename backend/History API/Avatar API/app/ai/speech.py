import os
import tempfile
import torch

# Fix for older CPUs
torch.backends.mkldnn.enabled = False
torch.set_num_threads(1)

import whisper

# Load Whisper model only once
model = whisper.load_model("tiny")


def transcribe_audio(upload_file):
    suffix = os.path.splitext(upload_file.filename)[1]

    if not suffix:
        suffix = ".wav"

    temp_path = None

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp.write(upload_file.file.read())
            temp_path = temp.name

        # Transcribe audio
        result = model.transcribe(
            temp_path,
            fp16=False,        # CPU only
            language=None      # Auto detect language
        )

        return {
            "success": True,
            "text": result["text"].strip(),
            "language": result.get("language", "unknown")
        }

    except Exception as e:
        print("\n========== WHISPER ERROR ==========")
        print(str(e))
        print("==================================\n")

        return {
            "success": False,
            "text": "Speech Recognition Failed",
            "error": str(e)
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)