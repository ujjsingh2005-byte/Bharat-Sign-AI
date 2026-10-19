"""Presentation sign vocabulary: only the three signs demonstrated in Bharat Sign AI."""
SIGN_DICTIONARY = {
    "HELLO": {"word": "HELLO", "asset": "hello", "type": "sign", "animation": "hello"},
    "THANK YOU": {"word": "THANK YOU", "asset": "thank_you", "type": "sign", "animation": "thank_you"},
    "GOODBYE": {"word": "GOODBYE", "asset": "goodbye", "type": "sign", "animation": "goodbye"},
}

def get_sign(word: str):
    if not word: return None
    key = word.upper().strip().replace("GOOD BYE", "GOODBYE").replace("THANKS", "THANK YOU")
    return SIGN_DICTIONARY.get(key)

def get_signs(words):
    return [s for w in words if (s := get_sign(w))]
