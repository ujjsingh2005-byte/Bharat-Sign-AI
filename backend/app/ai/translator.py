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
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ"},
    "or": {"name": "Odia", "native": "ଓଡ଼ିଆ"},
    "as": {"name": "Assamese", "native": "অসমীয়া"},
    "ur": {"name": "Urdu", "native": "اردو"},
    "sa": {"name": "Sanskrit", "native": "संस्कृतम्"},
}

# Exhaustive phrase dictionary covering 200+ multi-domain regional expressions
PHRASE_DICTIONARY = {
    # -------------------------------------------------------------
    # HINGLISH & ROMANIZED HINDI (Conversational, Emergency & Travel)
    # -------------------------------------------------------------
    "aapka swagat hai hamare ghar mein": "Welcome to our home",
    "aapka swagat hai": "Welcome",
    "swagat hai": "Welcome",
    "aapse milkar khushi hui": "Nice to meet you",
    "shubh prabhat": "Good morning",
    "shubh ratri": "Good night",
    "kal phir milenge": "See you tomorrow",
    "aapka din shubh ho": "Have a great day",
    "aap kaise hain": "How are you",
    "tum kaise ho": "How are you",
    "kaise ho": "How are you",
    "aapka naam kya hai": "What is your name",
    "tumhara naam kya hai": "What is your name",
    "tera naam kya hai": "What is your name",
    "dhanyawad": "Thank you",
    "shukriya": "Thank you",
    "namaste": "Hello",

    # Healthcare & Emergency
    "kya aap meri madad kar sakte hain": "Can you help me",
    "kya aap meri madad kar sakte ho": "Can you help me",
    "meri madad karo": "Help me",
    "madad chahiye": "I need help",
    "mujhe sar dard hai": "I have head pain",
    "mujhe pet dard hai": "I have stomach pain",
    "mujhe bukhar hai": "I have fever",
    "doctor ko turant bulao": "Call doctor quickly",
    "ambulance ko phone karo": "Call ambulance",
    "police ko phone karo": "Call police",
    "mujhe dawa chahiye": "I need medicine",
    "hospital kahan hai": "Where is the hospital",
    "doctor kahan hai": "Where is the doctor",
    "tabiyat kharab hai": "I am feeling unwell",
    "kripya meri jaan bachao": "Please save me",

    # Actions, Questions & Everyday Conversations
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
    "aapka kaam kya hai": "What is your work",
    "mujhe computer par kaam karna hai": "I want to work on computer",
    "meeting kab shuru hogi": "When will meeting start",

    # Daily Needs, Food & Travel
    "mujhe paani chahiye": "I want water",
    "mujhe khana chahiye": "I want food",
    "mujhe bhook lagi hai": "I am hungry",
    "mujhe pyaas lagi hai": "I am thirsty",
    "railway station kahan hai": "Where is the railway station",
    "bus stop kahan hai": "Where is the bus stop",
    "airport kahan hai": "Where is the airport",
    "bazaar kahan hai": "Where is the market",
    "bank kahan hai": "Where is the bank",
    "atm kahan hai": "Where is the atm",
    "train kab aayegi": "What time will train arrive",
    "ticket kahan milega": "Where to get ticket",
    "iska daam kya hai": "How much does this cost",
    "main school ja raha hoon": "I am going to school",
    "main office ja raha hoon": "I am going to office",
    "hum kal delhi ja rahe hain": "We are going to Delhi tomorrow",

    # -------------------------------------------------------------
    # DEVANAGARI HINDI (Comprehensive Domain Coverage)
    # -------------------------------------------------------------
    # Emergency & Healthcare
    "अस्पताल कहाँ है": "Where is the hospital",
    "डॉक्टर कहाँ है": "Where is the doctor",
    "मुझे दवा चाहिए": "I need medicine",
    "मुझे मदद चाहिए": "I need help",
    "कृपया मेरी मदद करें": "Please help me",
    "मुझे सिर दर्द है": "I have head pain",
    "मुझे पेट दर्द है": "I have stomach pain",
    "मुझे बुखार है": "I have fever",
    "मेरी तबीयत खराब है": "I am feeling unwell",
    "डॉक्टर को बुलाओ": "Call the doctor",
    "एम्बुलेंस को फोन करो": "Call the ambulance",
    "पुलिस को बुलाओ": "Call the police",

    # Greetings & Social
    "नमस्ते": "Hello",
    "नमस्कार": "Hello",
    "धन्यवाद": "Thank you",
    "अलविदा": "Goodbye",
    "आप कैसे हैं": "How are you",
    "तुम कैसे हो": "How are you",
    "आपका नाम क्या है": "What is your name",
    "तुम्हारा नाम क्या है": "What is your name",
    "आपसे मिलकर खुशी हुई": "Nice to meet you",
    "शुभ प्रभात": "Good morning",
    "शुभ रात्रि": "Good night",
    "कल फिर मिलेंगे": "See you tomorrow",
    "आपका दिन शुभ हो": "Have a great day",

    # Travel, Directions, Daily Needs & School
    "हम कल दिल्ली जा रहे हैं": "We are going to Delhi tomorrow",
    "मैं कल स्कूल जा रहा हूँ": "I am going to school tomorrow",
    "मैं घर जा रहा हूँ": "I am going home",
    "मैं ऑफिस जा रहा हूँ": "I am going to office",
    "रेलवे स्टेशन कहाँ है": "Where is the railway station",
    "बस स्टॉप कहाँ है": "Where is the bus stop",
    "बाजार कहाँ है": "Where is the market",
    "बैंक कहाँ है": "Where is the bank",
    "एटीएम कहाँ है": "Where is the atm",
    "मुझे पानी चाहिए": "I want water",
    "मुझको पानी चाहिए": "I want water",
    "पानी चाहिए": "Want water",
    "मुझे खाना चाहिए": "I want food",
    "मुझे भूख लगी है": "I am hungry",
    "मुझे प्यास लगी है": "I am thirsty",
    "इसका दाम क्या है": "How much does this cost",
    "आप क्या कर रहे हैं": "What are you doing",
    "तुम क्या कर रहे हो": "What are you doing",
    "तुम कहाँ रहते हो": "Where do you live",
    "आप कहाँ रहते हैं": "Where do you live",
    "आप कहाँ जा रहे हैं": "Where are you going",
    "तुम कहाँ जा रहे हो": "Where are you going",

    # -------------------------------------------------------------
    # REGIONAL INDIAN LANGUAGES (Bhojpuri, Telugu, Tamil, Bengali, Marathi, etc.)
    # -------------------------------------------------------------
    # Bhojpuri
    "हम स्कूल जा तानी": "I am going to school",
    "हम स्कूल जात बानी": "I am going to school",
    "हमके पानी चाहीं": "I want water",
    "हमरा पानी चाहीं": "I want water",
    "का हाल बा": "How are you",
    "का समाचार बा": "How are you",
    "रउआ कइसन बानी": "How are you",
    "प्रणाम": "Hello",
    "हमरा खाना चाहीं": "I want food",
    "तोहार नाम का बा": "What is your name",
    "हमरा मदद चाहीं": "I need help",
    "ई का ह": "What is this",
    "कहाँ जात बानी": "Where are you going",
    "कहाँ रहत बानी": "Where do you live",
    "ठीक बा": "It is good",
    "डॉक्टर के बोलाइब": "Call the doctor",
    "हमरा बुखार बा": "I have fever",
    "हमरा बहुत भूख लागल बा": "I am very hungry",
    "तोहार घर कहाँ बा": "Where is your house",
    "हमरा के रास्ता बता दीं": "Show me the way",
    "हमरा रुपया चाहीं": "I need money",

    # Telugu
    "మీరు ఎక్కడ నివసిస్తున్నారు": "Where do you live",
    "నాకు నీళ్లు కావాలి": "I want water",
    "మీరు ఎలా ఉన్నారు": "How are you",
    "నాకు సహాయం కావాలి": "I need help",
    "మీ పేరు ఏమిటి": "What is your name",
    "నాకు అన్నం కావాలి": "I want food",
    "ఆసుపత్రి ఎక్కడ ఉంది": "Where is the hospital",
    "నాకు జ్వరం వచ్చింది": "I have fever",
    "నాకు చాలా ఆకలిగా ఉంది": "I am very hungry",
    "పోలీస్ స్టేషన్ ఎక్కడ ఉంది": "Where is the police station",
    "రైలు ఎప్పుడు వస్తుంది": "When will the train arrive",

    # Tamil
    "நீங்கள் எங்கே வசிக்கிறீர்கள்": "Where do you live",
    "எனக்கு தண்ணீர் வேண்டும்": "I want water",
    "நீங்கள் எப்படி இருக்கிறீர்கள்": "How are you",
    "எனக்கு உதவி தேவை": "I need help",
    "உங்கள் பெயர் என்ன": "What is your name",
    "எனக்கு உணவு வேண்டும்": "I want food",
    "மருத்துவமனை எங்கே உள்ளது": "Where is the hospital",
    "எனக்கு காய்ச்சல் உள்ளது": "I have fever",
    "எனக்கு மிகவும் பசிக்கிறது": "I am very hungry",
    "காவல் நிலையம் எங்கே உள்ளது": "Where is the police station",
    "ரயில் எப்போது வரும்": "When will the train arrive",

    # Bengali
    "তুমি কোথায় থাকো": "Where do you live",
    "আপনি কোথায় থাকেন": "Where do you live",
    "আমি জল চাই": "I want water",
    "আপনি কেমন আছেন": "How are you",
    "আমার সাহায্য দরকার": "I need help",
    "আপনার নাম কি": "What is your name",
    "আমি বাড়ি যাচ্ছি": "I am going home",
    "আমার খাবার চাই": "I want food",
    "হাসপাতাল কোথায়": "Where is the hospital",
    "আমার জ্বর হয়েছে": "I have fever",
    "আমার খুব খিদে পেয়েছে": "I am very hungry",
    "পুলিশ স্টেশন কোথায়": "Where is the police station",
    "ট্রেন কখন আসবে": "When will the train arrive",

    # Marathi
    "तुम्ही कुठे राहता": "Where do you live",
    "तू कुठे राहतोस": "Where do you live",
    "मला पाणी हवे आहे": "I want water",
    "तुम्ही कसे आहात": "How are you",
    "मला मदत हवी आहे": "I need help",
    "तुमचे नाव काय आहे": "What is your name",
    "मला जेवण हवे आहे": "I want food",
    "दवाखाना कुठे आहे": "Where is the hospital",
    "मला ताप आला आहे": "I have fever",
    "मला खूप भूक लागली आहे": "I am very hungry",
    "पोलीस स्टेशन कुठे आहे": "Where is the police station",
    "ट्रेन कधी येणार": "When will the train arrive",

    # Gujarati
    "મને પાણી જોઈએ છે": "I want water",
    "તમે કેમ છો": "How are you",
    "તમારું નામ શું છે": "What is your name",
    "મને મદદ જોઈએ છે": "I need help",
    "હોસ્પિટલ ક્યાં છે": "Where is the hospital",
    "મને ખૂબ ભૂખ લાગી છે": "I am very hungry",
    "પોલીસ સ્ટેશન ક્યાં છે": "Where is the police station",
    "ટ્રેન ક્યારે આવશે": "When will the train arrive",

    # Punjabi
    "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ": "I want water",
    "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ": "How are you",
    "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ": "What is your name",
    "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ": "I need help",
    "ਹਸਪਤਾਲ ਕਿੱਥੇ ਹੈ": "Where is the hospital",
    "ਮੈਨੂੰ ਬਹੁਤ ਭੁੱਖ ਲੱਗੀ ਹੈ": "I am very hungry",
    "ਪੁਲਿਸ ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ": "Where is the police station",
    "ਟ੍ਰੇਨ ਕਦੋਂ ਆਵੇਗੀ": "When will the train arrive",

    # Malayalam
    "നിങ്ങൾ എവിടെയാണ് താമസിക്കുന്നത്": "Where do you live",
    "എനിക്ക് വെള്ളം വേണം": "I want water",
    "സുഖമാണോ": "How are you",
    "എനിക്ക് സഹായം വേണം": "I need help",
    "നിങ്ങളുടെ പേരെന്താണ്": "What is your name",
    "എനിക്ക് വിശക്കുന്നു": "I am hungry",
    "പോലീസ് സ്റ്റേഷൻ എവിടെയാണ്": "Where is the police station",

    # Kannada
    "ನೀವು ಎಲ್ಲಿದ್ದೀರಿ": "Where do you live",
    "ನನಗೆ ನೀರು ಬೇಕು": "I want water",
    "ನೀವು ಹೇಗಿದ್ದೀರಿ": "How are you",
    "ನನಗೆ ಸಹಾಯ ಬೇಕು": "I need help",
    "ನಿಮ್ಮ ಹೆಸರೇನು": "What is your name",
    "ನನಗೆ ಹಸಿವಾಗಿದೆ": "I am hungry",
    "ಪೊಲೀಸ್ ಸ್ಟೇಷನ್ ಎಲ್ಲಿದೆ": "Where is the police station",

    # Odia
    "ମୋତେ ଭୋକ ଲାଗୁଛି": "I am hungry",
    "ମୋତେ ପାଣି ଦରକାର": "I want water",
    "ଆପଣ କେମିତି ଅଛନ୍ତି": "How are you",
    "ପୋଲିସ ଷ୍ଟେସନ କେଉଁଠି": "Where is the police station",

    # Assamese
    "মোৰ ভোক লাগিছে": "I am hungry",
    "মোৰ পানী লাগে": "I want water",
    "আপুনি কেমন আছে": "How are you",
    "আৰক্ষী থানা ক'ত আছে": "Where is the police station",
}

# Word-level vocabulary lexicon
WORD_LEXICON = {
    # Pronouns
    "aap": "YOU", "aapka": "YOUR", "tum": "YOU", "tumhara": "YOUR", "tu": "YOU", "tera": "YOUR",
    "main": "ME", "mera": "MY", "meri": "MY", "mujhe": "ME", "hum": "WE", "hamare": "OUR", "humara": "OUR",
    "मुझे": "I", "मुझको": "I", "मैं": "I", "हम": "I", "आप": "YOU", "तुम": "YOU", "तू": "YOU",

    # Nouns & Objects
    "paani": "WATER", "khana": "FOOD", "ghar": "HOME", "naam": "NAME", "school": "SCHOOL", "college": "COLLEGE",
    "madad": "HELP", "swagat": "WELCOME", "dawa": "MEDICINE", "hospital": "HOSPITAL", "doctor": "DOCTOR",
    "station": "STATION", "train": "TRAIN", "bus": "BUS", "ticket": "TICKET", "bazaar": "MARKET", "daam": "COST",
    "bank": "BANK", "atm": "ATM", "bukhar": "FEVER", "police": "POLICE", "ambulance": "AMBULANCE",
    "पानी": "WATER", "खाना": "FOOD", "स्कूल": "SCHOOL", "कॉलेज": "COLLEGE", "अस्पताल": "HOSPITAL", "डॉक्टर": "DOCTOR",
    "घर": "HOME", "नाम": "NAME", "मदद": "HELP", "दवा": "MEDICINE", "टिकट": "TICKET", "बाजार": "MARKET", "बुखार": "FEVER",

    # Verbs
    "kar": "DO", "kare": "DO", "karen": "DO", "sakte": "CAN", "sakti": "CAN", "karo": "DO",
    "rahe": "", "raha": "", "rahi": "", "hain": "", "ho": "", "hai": "", "tha": "", "thi": "", "mein": "", "par": "",
    "rehte": "LIVE", "rehta": "LIVE", "rehti": "LIVE", "ja": "GO", "aao": "COME", "khaye": "EAT", "peeye": "DRINK",
    "bulao": "CALL", "bachao": "SAVE", "padhni": "READ", "kharidna": "BUY",
    "रहते": "LIVE", "रहती": "LIVE", "रहना": "LIVE", "चाहिए": "WANT", "जाना": "GO", "जा": "GO", "पढ़ना": "READ",

    # Questions & Modifiers
    "kya": "WHAT", "kahan": "WHERE", "kab": "WHEN", "kyun": "WHY", "kaise": "HOW", "kaun": "WHO", "kitni": "HOW MUCH",
    "क्या": "WHAT", "कहाँ": "WHERE", "कब": "WHEN", "क्यों": "WHY", "कैसे": "HOW", "आज": "TODAY", "कल": "TOMORROW",
    "turant": "QUICKLY", "shubh": "GOOD", "prabhat": "MORNING", "ratri": "NIGHT",
}

HINGLISH_KEYWORDS = {
    "kya", "kar", "rahe", "hain", "kahan", "aap", "aapka", "tum", "tumhara", "mujhe", "mera", "meri", "ho", "hai",
    "kaun", "kyun", "kaise", "rehte", "rehta", "rehti", "paani", "khana", "madad", "swagat", "ghar", "mein",
    "raha", "rahi", "gaya", "gayi", "gaye", "bhai", "namaste", "dhanyawad", "shukriya", "sakte", "sakti", "hamare",
    "humara", "chahiye", "dawa", "hospital", "doctor", "station", "train", "bus", "ticket", "bazaar", "daam",
    "turant", "bhook", "pyaas", "tabiyat", "kripya", "bulao", "bachao", "aapse", "milkar", "khushi", "prabhat",
    "bukhar", "bank", "atm", "police", "ambulance", "ratri"
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
