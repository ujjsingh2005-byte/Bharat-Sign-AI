import re
from deep_translator import MyMemoryTranslator, GoogleTranslator

# Supported Indian Languages mapping (ISO 639 codes and display names)
SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "native": "English"},
    "hi": {"name": "Hindi", "native": "हिन्दी"},
    "bho": {"name": "Bhojpuri", "native": "भोजपुरी"},
    "mr": {"name": "Marathi", "native": "मराठी"},
    "bn": {"name": "Bengali", "native": "বাংলা"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ"},
    "ta": {"name": "Tamil", "native": "தமிழ்"},
    "te": {"name": "Telugu", "native": "తెలుగు"},
    "ml": {"name": "Malayalam", "native": "മലയാളം"},
    "kn": {"name": "Kannada", "native": "<ctrl42>कನ್ನಡ"},
    "or": {"name": "Odia", "native": "ଓଡ଼ିଆ"},
    "as": {"name": "Assamese", "native": "অসমীয়া"},
    "ur": {"name": "Urdu", "native": "اردو"},
    "sa": {"name": "Sanskrit", "native": "संस्कृतम्"},
}

# Extensive phrase dictionary covering conversational expressions
PHRASE_DICTIONARY = {
    # Hinglish & Romanized Hindi
    "aapka swagat hai hamare ghar mein": "Welcome to our home",
    "aapka swagat hai": "Welcome",
    "swagat hai": "Welcome",
    "kya aap meri madad kar sakte hain": "Can you help me",
    "kya aap meri madad kar sakte ho": "Can you help me",
    "meri madad karo": "Help me",
    "aap kya kar rahe hain": "What are you doing",
    "aap kya kar rahe ho": "What are you doing",
    "tum kya kar rahe ho": "What are you doing",
    "kya kar rahe ho": "What are you doing",
    "kya kar rahe hain": "What are you doing",
    "kya ho raha hai": "What is happening",
    "aap kahan rehte hain": "Where do you live",
    "tum kahan rahte ho": "Where do you live",
    "kahan rehte ho": "Where do you live",
    "kahan rahte ho": "Where do you live",
    "aap kahan ja rahe hain": "Where are you going",
    "tum kahan ja rahe ho": "Where are you going",
    "kahan ja rahe ho": "Where are you going",
    "aapka naam kya hai": "What is your name",
    "tumhara naam kya hai": "What is your name",
    "tera naam kya hai": "What is your name",
    "mujhe paani chahiye": "I want water",
    "mujhe khana chahiye": "I want food",
    "madad chahiye": "I need help",
    "aap kaise hain": "How are you",
    "tum kaise ho": "How are you",
    "kaise ho": "How are you",
    "hum kal delhi ja rahe hain": "We are going to Delhi tomorrow",

    # Devanagari Hindi
    "हम कल दिल्ली जा रहे हैं": "We are going to Delhi tomorrow",
    "आप क्या कर रहे हैं": "What are you doing",
    "तुम क्या कर रहे हो": "What are you doing",
    "क्या कर रहे हो": "What are you doing",
    "तुम कहाँ रहते हो": "Where do you live",
    "आप कहाँ रहते हैं": "Where do you live",
    "कहाँ रहते हो": "Where do you live",
    "तुम क्या करते हो": "What do you do",
    "आप क्या करते हैं": "What do you do",
    "आप कहाँ जा रहे हैं": "Where are you going",
    "तुम कहाँ जा रहे हो": "Where are you going",
    "कहाँ जा रहे हो": "Where are you going",
    "मुझे पानी चाहिए": "I want water",
    "मुझको पानी चाहिए": "I want water",
    "पानी चाहिए": "Want water",
    "मुझे खाना चाहिए": "I want food",
    "आप कैसे हैं": "How are you",
    "नमस्ते": "Hello",
    "नमस्कार": "Hello",
    "धन्यवाद": "Thank you",
    "अलविदा": "Goodbye",
    "कृपया मेरी मदद करें": "Please help me",
    "मुझे मदद चाहिए": "I need help",
    "आपका नाम क्या है": "What is your name",
    "तुम्हारा नाम क्या है": "What is your name",
}

# Word-level vocabulary lexicon
WORD_LEXICON = {
    # Pronouns
    "aap": "YOU", "aapka": "YOUR", "tum": "YOU", "tumhara": "YOUR", "tu": "YOU",
    "main": "ME", "mera": "MY", "meri": "MY", "mujhe": "ME", "hum": "WE", "hamare": "OUR", "humara": "OUR",
    "मुझे": "I", "मुझको": "I", "मैं": "I", "हम": "I", "आप": "YOU", "तुम": "YOU",

    # Nouns & Objects
    "paani": "WATER", "khana": "FOOD", "ghar": "HOME", "naam": "NAME", "school": "SCHOOL", "college": "COLLEGE", "madad": "HELP", "swagat": "WELCOME",
    "पानी": "WATER", "खाना": "FOOD", "स्कूल": "SCHOOL", "कॉलेज": "COLLEGE", "अस्पताल": "HOSPITAL", "डॉक्टर": "DOCTOR", "घर": "HOME", "नाम": "NAME", "मदद": "HELP",

    # Verbs
    "kar": "DO", "kare": "DO", "karen": "DO", "sakte": "CAN", "sakti": "CAN",
    "rahe": "", "raha": "", "rahi": "", "hain": "", "ho": "", "hai": "", "tha": "", "thi": "", "mein": "",
    "rehte": "LIVE", "rehta": "LIVE", "rehti": "LIVE", "ja": "GO", "aao": "COME", "khaye": "EAT", "peeye": "DRINK",
    "रहते": "LIVE", "रहती": "LIVE", "रहना": "LIVE", "चाहिए": "WANT", "जाना": "GO", "जा": "GO",

    # Questions & Modifiers
    "kya": "WHAT", "kahan": "WHERE", "kab": "WHEN", "kyun": "WHY", "kaise": "HOW", "kaun": "WHO",
    "क्या": "WHAT", "कहाँ": "WHERE", "कब": "WHEN", "क्यों": "WHY", "कैसे": "HOW", "आज": "TODAY", "कल": "TOMORROW",
}

HINGLISH_KEYWORDS = {
    "kya", "kar", "rahe", "hain", "kahan", "aap", "aapka", "tum", "tumhara", "mujhe", "mera", "meri", "ho", "hai",
    "kaun", "kyun", "kaise", "rehte", "rehta", "rehti", "paani", "khana", "madad", "swagat", "ghar", "mein",
    "raha", "rahi", "gaya", "gayi", "gaye", "bhai", "namaste", "dhanyawad", "shukriya", "sakte", "sakti", "hamare", "humara", "chahiye"
}

def normalize_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()

def is_hinglish(text: str) -> bool:
    words = set(re.sub(r"[^\w\s]", "", text.lower()).split())
    return bool(words & HINGLISH_KEYWORDS)

def is_pure_latin_english(text: str) -> bool:
    has_latin = bool(re.search(r"[a-zA-Z]", text))
    has_indic = bool(re.search(r"[\u0900-\u0DFF]", text))
    return has_latin and not has_indic and not is_hinglish(text)

def translate_text(
    text: str,
    source_language: str = "auto",
    target_language: str = "en",
) -> dict:
    """
    Translates text across all Indian languages, Hinglish, and English.
    """
    if not text or not text.strip():
        return {
            "success": False,
            "message": "No text provided for translation.",
            "original_text": "",
            "translated_text": "",
            "source_language": source_language,
            "target_language": target_language,
        }

    raw = normalize_text(text)
    clean_no_punct = re.sub(r"[।?!.,]", "", raw).strip()
    clean_lower = clean_no_punct.lower()
    source_language = (source_language or "auto").lower().replace("-in", "").replace("-us", "").replace("-gb", "")
    target_language = (target_language or "en").lower().replace("-in", "").replace("-us", "").replace("-gb", "")

    # Tier 1: Offline phrase dictionary match
    for phrase, eng in PHRASE_DICTIONARY.items():
        if phrase == clean_lower or phrase in clean_lower or clean_lower in phrase:
            if target_language == "en":
                return {
                    "success": True,
                    "message": "Direct phrase dictionary match.",
                    "original_text": raw,
                    "translated_text": eng,
                    "source_language": source_language,
                    "target_language": target_language,
                }

    # Pure English preservation
    if target_language == "en" and is_pure_latin_english(raw):
        return {
            "success": True,
            "message": "English source text preserved.",
            "original_text": raw,
            "translated_text": raw,
            "source_language": "en",
            "target_language": "en",
        }

    # Tier 2: Hinglish / Hindi word lexicon mapping
    if target_language == "en" and is_hinglish(raw):
        words = clean_lower.split()
        matched_tokens = []
        all_mapped = True
        for w in words:
            if w in WORD_LEXICON:
                tok = WORD_LEXICON[w]
                if tok:
                    matched_tokens.append(tok)
            else:
                all_mapped = False
                break

        if all_mapped and len(matched_tokens) >= 1:
            return {
                "success": True,
                "message": "Hinglish lexicon mapped translation.",
                "original_text": raw,
                "translated_text": " ".join(matched_tokens).title(),
                "source_language": source_language,
                "target_language": target_language,
            }

    # Tier 3: GoogleTranslator (handles Hinglish when src='hi' and pure Indic languages)
    try:
        src = "hi" if is_hinglish(raw) or source_language == "bho" or source_language == "auto" else source_language
        tgt = "hi" if target_language == "bho" else target_language
        res = GoogleTranslator(source=src, target=tgt).translate(raw)
        if res and res.strip():
            return {
                "success": True,
                "message": "Translation successful via Google.",
                "original_text": raw,
                "translated_text": res.strip(),
                "source_language": source_language,
                "target_language": target_language,
            }
    except Exception:
        pass

    # Tier 4: MyMemoryTranslator API
    try:
        src_tag = f"{source_language}-IN" if source_language != "auto" and source_language != "en" else "hi-IN"
        tgt_tag = "en-GB" if target_language == "en" else f"{target_language}-IN"

        res = MyMemoryTranslator(source=src_tag, target=tgt_tag).translate(raw)
        if res and res.strip() and not res.startswith("MYMEMORY WARNING"):
            return {
                "success": True,
                "message": "Translation successful via MyMemory.",
                "original_text": raw,
                "translated_text": res.strip(),
                "source_language": source_language,
                "target_language": target_language,
            }
    except Exception:
        pass

    # Fallback
    return {
        "success": True,
        "message": "Fallback to source text.",
        "original_text": raw,
        "translated_text": raw,
        "source_language": source_language,
        "target_language": target_language,
    }
