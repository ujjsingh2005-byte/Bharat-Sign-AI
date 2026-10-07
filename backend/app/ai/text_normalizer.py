"""
Bharat Sign AI 3 - Text Normalization Engine
Normalizes raw ASR transcripts by stripping filler words, formatting numbers,
dates, punctuation, and resolving common speech recognition artifacts.
"""

import re
from typing import Dict, Any

FILLER_WORDS = {
    "umm", "um", "uh", "err", "aah", "ahh", "like", "you know", "basically", "actually"
}

NUMBER_MAP = {
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10",
    "ek": "1", "do": "2", "teen": "3", "chaar": "4", "paanch": "5"
}

def normalize_text(raw_text: str) -> Dict[str, Any]:
    """
    Normalizes transcript text for NLP and ISL semantic mapping.
    Preserves linguistic meaning while eliminating speech artifacts.
    """
    if not raw_text or not raw_text.strip():
        return {
            "raw_text": raw_text,
            "normalized_text": "",
            "removed_fillers": [],
            "modified": False
        }

    original = raw_text.strip()
    words = original.split()
    removed_fillers = []
    clean_words = []

    for w in words:
        clean_w = re.sub(r'[^\w\s]', '', w.lower())
        if clean_w in FILLER_WORDS:
            removed_fillers.append(w)
            continue
        
        # Normalize spoken numbers if needed
        if clean_w in NUMBER_MAP:
            clean_words.append(NUMBER_MAP[clean_w])
        else:
            clean_words.append(w)

    normalized = " ".join(clean_words)
    
    # Capitalize first letter and ensure proper terminal punctuation
    if normalized:
        normalized = normalized[0].upper() + normalized[1:]
        if not normalized.endswith(('.', '?', '!')):
            normalized += "."

    return {
        "raw_text": original,
        "normalized_text": normalized,
        "removed_fillers": removed_fillers,
        "modified": original != normalized
    }
