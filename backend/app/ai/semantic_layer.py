import re

# Stop words to eliminate from natural language to create direct ISL gloss
# Note: Action verbs are preserved as main verbs in ISL sentence syntax
STOP_WORDS = {
    "is", "am", "are", "was", "were", "be", "been", "being",
    "the", "a", "an", "to", "of", "in", "on", "at", "by", "for", "with",
    "about", "against", "between", "into", "through", "during", "before",
    "after", "above", "below", "from", "up", "down", "out", "off",
    "over", "under", "again", "further", "then", "once", "here", "there",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "have", "has", "had", "having",
    "will", "shall", "would", "should", "can", "could", "may", "might", "must",
}

# Pronoun mappings to ISL standard forms
PRONOUN_MAP = {
    "i": "ME",
    "me": "ME",
    "my": "MY",
    "mine": "MY",
    "myself": "ME",
    "you": "YOU",
    "your": "YOUR",
    "yours": "YOUR",
    "yourself": "YOU",
    "he": "HE",
    "him": "HE",
    "his": "HIS",
    "she": "SHE",
    "her": "HER",
    "hers": "HER",
    "it": "IT",
    "its": "IT",
    "we": "WE",
    "us": "WE",
    "our": "OUR",
    "ours": "OUR",
    "they": "THEY",
    "them": "THEY",
    "their": "THEIR",
}

# Time indicators (which in ISL move to the beginning of the sentence)
TIME_WORDS = {
    "today": "TODAY",
    "tomorrow": "TOMORROW",
    "yesterday": "YESTERDAY",
    "now": "NOW",
    "morning": "MORNING",
    "night": "NIGHT",
    "evening": "EVENING",
    "afternoon": "AFTERNOON",
    "daily": "DAILY",
    "always": "ALWAYS",
    "never": "NEVER",
    "soon": "SOON",
    "later": "LATER",
}

# Question words (which in ISL move to the end of the sentence)
QUESTION_WORDS = {
    "what": "WHAT",
    "where": "WHERE",
    "when": "WHEN",
    "why": "WHY",
    "who": "WHO",
    "how": "HOW",
    "which": "WHICH",
}

# Key conversational phrases mapping to single compound ISL signs
PHRASE_MAPPINGS = {
    "how are you": "HOW ARE YOU",
    "how are u": "HOW ARE YOU",
    "thank you": "THANK YOU",
    "thanks": "THANK YOU",
    "thankyou": "THANK YOU",
    "good morning": "GOOD MORNING",
    "good night": "GOOD NIGHT",
    "good bye": "GOODBYE",
    "goodbye": "GOODBYE",
    "bye": "GOODBYE",
    "see you": "SEE YOU",
    "nice to meet you": "NICE TO MEET YOU",
    "welcome": "WELCOME",
    "you are welcome": "WELCOME",
    "excuse me": "EXCUSE ME",
    "sorry": "SORRY",
    "i am sorry": "SORRY",
    "please": "PLEASE",
    "help me": "HELP",
    "need help": "HELP",
    "i need water": "WATER",
    "give me water": "WATER",
}

# Universal Recognized ISL Action Verbs mapping
VERB_MAP = {
    "live": "LIVE", "living": "LIVE", "lived": "LIVE", "reside": "LIVE", "stay": "LIVE", "staying": "LIVE",
    "go": "GO", "going": "GO", "went": "GO", "goes": "GO",
    "come": "COME", "coming": "COME", "came": "COME", "comes": "COME",
    "eat": "EAT", "eating": "EAT", "ate": "EAT", "eats": "EAT",
    "drink": "DRINK", "drinking": "DRINK", "drank": "DRINK", "drinks": "DRINK",
    "want": "WANT", "wants": "WANT", "wanted": "WANT", "wanting": "WANT",
    "need": "NEED", "needs": "NEED", "needed": "NEED", "needing": "NEED",
    "like": "LIKE", "likes": "LIKE", "liked": "LIKE", "liking": "LIKE",
    "love": "LOVE", "loves": "LOVE", "loved": "LOVE", "loving": "LOVE",
    "do": "DO", "doing": "DO", "did": "DO", "does": "DO",
    "make": "MAKE", "making": "MAKE", "made": "MAKE", "makes": "MAKE",
    "speak": "SPEAK", "speaking": "SPEAK", "spoke": "SPEAK", "speaks": "SPEAK",
    "talk": "TALK", "talking": "TALK", "talked": "TALK", "talks": "TALK",
    "tell": "TELL", "telling": "TELL", "told": "TELL", "tells": "TELL",
    "say": "SAY", "saying": "SAY", "said": "SAY", "says": "SAY",
    "listen": "LISTEN", "listening": "LISTEN", "listened": "LISTEN", "listens": "LISTEN",
    "hear": "HEAR", "hearing": "HEAR", "heard": "HEAR", "hears": "HEAR",
    "see": "SEE", "seeing": "SEE", "saw": "SEE", "sees": "SEE",
    "look": "LOOK", "looking": "LOOK", "looked": "LOOK", "looks": "LOOK",
    "watch": "WATCH", "watching": "WATCH", "watched": "WATCH", "watches": "WATCH",
    "meet": "MEET", "meeting": "MEET", "met": "MEET", "meets": "MEET",
    "learn": "LEARN", "learning": "LEARN", "learned": "LEARN", "learns": "LEARN",
    "study": "STUDY", "studying": "STUDY", "studied": "STUDY", "studies": "STUDY",
    "teach": "TEACH", "teaching": "TEACH", "taught": "TEACH", "teaches": "TEACH",
    "help": "HELP", "helping": "HELP", "helped": "HELP", "helps": "HELP",
    "work": "WORK", "working": "WORK", "worked": "WORK", "works": "WORK",
    "play": "PLAY", "playing": "PLAY", "played": "PLAY", "plays": "PLAY",
    "sleep": "SLEEP", "sleeping": "SLEEP", "slept": "SLEEP", "sleeps": "SLEEP",
    "write": "WRITE", "writing": "WRITE", "wrote": "WRITE", "writes": "WRITE",
    "know": "KNOW", "knowing": "KNOW", "knew": "KNOW", "knows": "KNOW",
    "understand": "UNDERSTAND", "understanding": "UNDERSTAND", "understood": "UNDERSTAND", "understands": "UNDERSTAND",
    "buy": "BUY", "buying": "BUY", "bought": "BUY", "buys": "BUY",
    "sell": "SELL", "selling": "SELL", "sold": "SELL", "sells": "SELL",
    "pay": "PAY", "paying": "PAY", "paid": "PAY", "pays": "PAY",
    "walk": "WALK", "walking": "WALK", "walked": "WALK", "walks": "WALK",
    "run": "RUN", "running": "RUN", "ran": "RUN", "runs": "RUN",
    "sit": "SIT", "sitting": "SIT", "sat": "SIT", "sits": "SIT",
    "stand": "STAND", "standing": "STAND", "stood": "STAND", "stands": "STAND",
}

def analyze_semantics(english_text: str) -> dict:
    """
    Analyzes English sentence and produces Universal Semantic Representation & ISL Grammar.
    ISL Grammar follows Time + Subject + Object + Verb + Question/Negation order.
    """
    if not english_text:
        return {
            "raw": "",
            "time": None,
            "subject": None,
            "object": None,
            "verb": None,
            "question": None,
            "negation": False,
            "entities": [],
            "isl_gloss": [],
            "gloss_text": "",
        }

    raw = english_text.strip()
    clean = re.sub(r"[^\w\s]", "", raw).lower()
    clean_words = clean.split()

    # Check for exact standalone conversational phrase match
    if clean in PHRASE_MAPPINGS:
        sign = PHRASE_MAPPINGS[clean]
        return {
            "raw": raw,
            "time": None,
            "subject": None,
            "object": None,
            "verb": None,
            "question": "HOW" if "how" in clean else None,
            "negation": False,
            "entities": [sign],
            "isl_gloss": [sign],
            "gloss_text": sign,
            "grammar_rule": "Direct Conversational ISL Idiom",
        }

    time_tokens = []
    subject_tokens = []
    question_tokens = []
    verb_tokens = []
    object_tokens = []
    negation = False

    for w in clean_words:
        upper = w.upper()

        if w in ["not", "no", "never", "dont", "don't", "cant", "can't", "nahi"]:
            negation = True
            continue

        if w in TIME_WORDS:
            time_tokens.append(TIME_WORDS[w])
        elif w in QUESTION_WORDS:
            question_tokens.append(QUESTION_WORDS[w])
        elif w in PRONOUN_MAP:
            subject_tokens.append(PRONOUN_MAP[w])
        elif w in VERB_MAP:
            v_token = VERB_MAP[w]
            if v_token not in verb_tokens:
                verb_tokens.append(v_token)
        elif w in STOP_WORDS:
            continue
        else:
            object_tokens.append(upper)

    # Filter out auxiliary DO when another main action verb is present (e.g. "What do you want?" -> WANT, not DO)
    if "DO" in verb_tokens and len(verb_tokens) > 1:
        verb_tokens.remove("DO")

    # Construct standard ISL Sentence Order: Time -> Subject -> Object -> Verb -> Negation -> Question
    isl_gloss = []
    isl_gloss.extend(time_tokens)
    isl_gloss.extend(subject_tokens)
    isl_gloss.extend(object_tokens)
    isl_gloss.extend(verb_tokens)

    if negation:
        isl_gloss.append("NO")

    isl_gloss.extend(question_tokens)

    # Fallback to raw tokens if empty
    if not isl_gloss:
        isl_gloss = [w.upper() for w in clean_words if w not in STOP_WORDS]

    gloss_str = " ".join(isl_gloss)

    return {
        "raw": raw,
        "time": " ".join(time_tokens) if time_tokens else None,
        "subject": " ".join(subject_tokens) if subject_tokens else None,
        "object": " ".join(object_tokens) if object_tokens else None,
        "verb": " ".join(verb_tokens) if verb_tokens else None,
        "question": " ".join(question_tokens) if question_tokens else None,
        "negation": negation,
        "entities": isl_gloss,
        "isl_gloss": isl_gloss,
        "gloss_text": gloss_str,
        "grammar_rule": "ISL Standard: [TIME] + [SUBJECT] + [OBJECT] + [VERB] + [NEGATION/QUESTION]",
    }
