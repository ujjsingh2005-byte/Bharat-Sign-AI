import re

def text_to_gloss(text: str):
    normalized = re.sub(r"[^a-zA-Z\s]", " ", text.lower())
    normalized = " ".join(normalized.split())
    sign = None
    if "thank you" in normalized or "thanks" in normalized or "thankyou" in normalized:
        sign = "THANK YOU"
    elif "goodbye" in normalized or "good bye" in normalized or "bye" in normalized:
        sign = "GOODBYE"
    elif "hello" in normalized or "hi" in normalized or "namaste" in normalized:
        sign = "HELLO"
    gloss = [sign] if sign else []
    return {"gloss": gloss, "gloss_text": " ".join(gloss)}
