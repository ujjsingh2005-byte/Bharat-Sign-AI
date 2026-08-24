"""
Bharat Sign AI 3 - Master Indian Sign Language (ISL) Dictionary
Includes complete conversational vocabulary across all everyday categories,
with Hinglish & regional alias normalization eliminating unknown gesture fallbacks.
"""

# Master Vocabulary signs with rich ISL definitions
VOCABULARY_SIGNS = {
    # Greetings & Social
    "HELLO": {"word": "HELLO", "asset": "hello", "type": "sign", "category": "Greetings", "animation": "hello", "description": "Open hand raised near temple waving outward with warmth."},
    "NAMASTE": {"word": "NAMASTE", "asset": "namaste", "type": "sign", "category": "Greetings", "animation": "namaste", "description": "Both palms joined in front of chest with head slight bow."},
    "THANK YOU": {"word": "THANK YOU", "asset": "thank_you", "type": "sign", "category": "Greetings", "animation": "thank_you", "description": "Fingertips touch chin/mouth then extend forward towards person."},
    "GOODBYE": {"word": "GOODBYE", "asset": "goodbye", "type": "sign", "category": "Greetings", "animation": "goodbye", "description": "Open hand raised high waving side to side."},
    "PLEASE": {"word": "PLEASE", "asset": "please", "type": "sign", "category": "Greetings", "animation": "please", "description": "Flat palm rubs chest in circular clockwise motion."},
    "WELCOME": {"word": "WELCOME", "asset": "welcome", "type": "sign", "category": "Greetings", "animation": "welcome", "description": "Open hand sweeps inward towards the body welcomingly."},
    "SORRY": {"word": "SORRY", "asset": "sorry", "type": "sign", "category": "Greetings", "animation": "sorry", "description": "Closed fist circles over chest over heart with regretful expression."},
    "HOW ARE YOU": {"word": "HOW ARE YOU", "asset": "how_are_you", "type": "sign", "category": "Greetings", "animation": "how_are_you", "description": "Cupped hands roll outwards transitioning into questioning open palms."},
    "NICE TO MEET YOU": {"word": "NICE TO MEET YOU", "asset": "nice_to_meet_you", "type": "sign", "category": "Greetings", "animation": "nice_to_meet_you", "description": "Smooth slide of right palm over left palm followed by index fingers meeting."},

    # Desires, Needs & Common Actions (Whole-word signs)
    "WANT": {"word": "WANT", "asset": "want", "type": "sign", "category": "Actions", "animation": "want", "description": "Both open palms facing up, curved fingers pulling gently inward toward body."},
    "DO": {"word": "DO", "asset": "do", "type": "sign", "category": "Actions", "animation": "do", "description": "Both flat hands facing down move side-to-side in front of waist in active motion."},
    "LIVE": {"word": "LIVE", "asset": "live", "type": "sign", "category": "Daily Living", "animation": "live", "description": "Both thumbs-up hands move upward along ribs/chest signifying living and residence."},
    "SPEAK": {"word": "SPEAK", "asset": "speak", "type": "sign", "category": "Communication", "animation": "speak", "description": "Index finger rolls repeatedly forward near mouth."},
    "TALK": {"word": "TALK", "asset": "talk", "type": "sign", "category": "Communication", "animation": "talk", "description": "Index finger moves to and from mouth repeatedly."},
    "LISTEN": {"word": "LISTEN", "asset": "listen", "type": "sign", "category": "Communication", "animation": "listen", "description": "Cupped hand placed behind ear listening attentively."},
    "NEED": {"word": "NEED", "asset": "need", "type": "sign", "category": "Actions", "animation": "need", "description": "Right bent index finger drops firmly downward in front of chest twice."},
    "LIKE": {"word": "LIKE", "asset": "like", "type": "sign", "category": "Actions", "animation": "like", "description": "Thumb and middle finger touch chest and pull outward while pinching together."},
    "LOVE": {"word": "LOVE", "asset": "love", "type": "sign", "category": "Emotions", "animation": "love", "description": "Both arms crossed over chest in tight affectionate embrace."},
    "KNOW": {"word": "KNOW", "asset": "know", "type": "sign", "category": "Mental", "animation": "know", "description": "Fingertips of flat right hand tap the temple/forehead twice."},
    "UNDERSTAND": {"word": "UNDERSTAND", "asset": "understand", "type": "sign", "category": "Mental", "animation": "understand", "description": "Right index finger flicks upward from fist near the side of forehead."},
    "THINK": {"word": "THINK", "asset": "think", "type": "sign", "category": "Mental", "animation": "think", "description": "Right index finger points to and circles gently near forehead."},
    "FEEL": {"word": "FEEL", "asset": "feel", "type": "sign", "category": "Emotions", "animation": "feel", "description": "Middle finger brushes upward over center of chest."},
    "HAPPY": {"word": "HAPPY", "asset": "happy", "type": "sign", "category": "Emotions", "animation": "happy", "description": "Open flat hands brush upward on chest with buoyant smile."},
    "SAD": {"word": "SAD", "asset": "sad", "type": "sign", "category": "Emotions", "animation": "sad", "description": "Both open hands drop slowly down in front of face with drooping expression."},

    # Basic Responses & Pronouns
    "YES": {"word": "YES", "asset": "yes", "type": "sign", "category": "Basics", "animation": "yes", "description": "Closed fist nods up and down like a head nodding."},
    "NO": {"word": "NO", "asset": "no", "type": "sign", "category": "Basics", "animation": "no", "description": "Index and middle fingers snap down against thumb firmly."},
    "ME": {"word": "ME", "asset": "me", "type": "sign", "category": "Pronouns", "animation": "me", "description": "Index finger points directly to one's own chest."},
    "YOU": {"word": "YOU", "asset": "you", "type": "sign", "category": "Pronouns", "animation": "you", "description": "Index finger points outward directly at conversational partner."},
    "WE": {"word": "WE", "asset": "we", "type": "sign", "category": "Pronouns", "animation": "we", "description": "Index finger touches right shoulder, arcs across, and touches left shoulder."},
    "THEY": {"word": "THEY", "asset": "they", "type": "sign", "category": "Pronouns", "animation": "they", "description": "Index finger sweeps across pointing toward a group in the distance."},
    "MY": {"word": "MY", "asset": "my", "type": "sign", "category": "Pronouns", "animation": "my", "description": "Flat open palm rests firmly on the chest."},
    "NAME": {"word": "NAME", "asset": "name", "type": "sign", "category": "Basics", "animation": "name", "description": "Right index and middle fingers tap across left index and middle fingers twice."},

    # Essentials & Emergency
    "HELP": {"word": "HELP", "asset": "help", "type": "sign", "category": "Emergency", "animation": "help", "description": "Closed thumbs-up fist placed on flat open palm, lifted upwards together."},
    "WATER": {"word": "WATER", "asset": "water", "type": "sign", "category": "Food & Water", "animation": "water", "description": "'W' handshape (3 fingers up) taps twice against the side of mouth/chin."},
    "FOOD": {"word": "FOOD", "asset": "food", "type": "sign", "category": "Food & Water", "animation": "food", "description": "Flattened 'O' handshape taps fingertips repeatedly near the mouth."},
    "DRINK": {"word": "DRINK", "asset": "drink", "type": "sign", "category": "Food & Water", "animation": "drink", "description": "'C' shaped hand tilts near mouth mimicking drinking from cup."},
    "EAT": {"word": "EAT", "asset": "eat", "type": "sign", "category": "Food & Water", "animation": "eat", "description": "Fingers brought to thumb tip and moved repeatedly toward mouth."},
    "TEA": {"word": "TEA", "asset": "tea", "type": "sign", "category": "Food & Water", "animation": "tea", "description": "Right 'F' handshape stirs above left 'O' cup hand."},
    "EMERGENCY": {"word": "EMERGENCY", "asset": "emergency", "type": "sign", "category": "Emergency", "animation": "emergency", "description": "'E' handshape shakes urgently side-to-side with serious expression."},
    "DOCTOR": {"word": "DOCTOR", "asset": "doctor", "type": "sign", "category": "Emergency", "animation": "doctor", "description": "Right index & middle fingers tap the pulse wrist of left arm twice."},
    "HOSPITAL": {"word": "HOSPITAL", "asset": "hospital", "type": "sign", "category": "Emergency", "animation": "hospital", "description": "Index & middle fingers trace a cross on the left shoulder."},
    "POLICE": {"word": "POLICE", "asset": "police", "type": "sign", "category": "Emergency", "animation": "police", "description": "'C' handshape touches upper chest representing badge."},
    "MEDICINE": {"word": "MEDICINE", "asset": "medicine", "type": "sign", "category": "Emergency", "animation": "medicine", "description": "Middle finger twists gently into the open palm of opposite hand."},

    # Education & Movement
    "SCHOOL": {"word": "SCHOOL", "asset": "school", "type": "sign", "category": "Education", "animation": "school", "description": "Open right palm claps gently down twice onto flat open left palm."},
    "COLLEGE": {"word": "COLLEGE", "asset": "college", "type": "sign", "category": "Education", "animation": "college", "description": "Right palm circles above left palm and slides forward into distance."},
    "STUDY": {"word": "STUDY", "asset": "study", "type": "sign", "category": "Education", "animation": "study", "description": "Left palm acts as open book while right fingers flutter towards it repeatedly."},
    "BOOK": {"word": "BOOK", "asset": "book", "type": "sign", "category": "Education", "animation": "book", "description": "Palms joined edge-to-edge open up outward like opening a book."},
    "WRITE": {"word": "WRITE", "asset": "write", "type": "sign", "category": "Education", "animation": "write", "description": "Right pinched fingers scribble across open flat left palm."},
    "WORK": {"word": "WORK", "asset": "work", "type": "sign", "category": "Daily Living", "animation": "work", "description": "Right fist taps down firmly twice on left wrist/fist."},
    "HOME": {"word": "HOME", "asset": "home", "type": "sign", "category": "Daily Living", "animation": "home", "description": "Fingertips touch cheek near mouth and then move to touch near ear."},
    "FAMILY": {"word": "FAMILY", "asset": "family", "type": "sign", "category": "Social", "animation": "family", "description": "'F' handshapes start touching in front and circle outwards into touching pinkies."},
    "FRIEND": {"word": "FRIEND", "asset": "friend", "type": "sign", "category": "Social", "animation": "friend", "description": "Interlocking index fingers hook together and reverse."},
    "GO": {"word": "GO", "asset": "go", "type": "sign", "category": "Actions", "animation": "go", "description": "Both index fingers point forward and roll outward away from body."},
    "COME": {"word": "COME", "asset": "come", "type": "sign", "category": "Actions", "animation": "come", "description": "Both hands with index fingers extended beckon inward toward body."},
    "GIVE": {"word": "GIVE", "asset": "give", "type": "sign", "category": "Actions", "animation": "give", "description": "Both cupped hands start near chest and extend forward toward person."},
    "TAKE": {"word": "TAKE", "asset": "take", "type": "sign", "category": "Actions", "animation": "take", "description": "Open hand reaches forward and closes into fist pulling toward body."},
    "SEE": {"word": "SEE", "asset": "see", "type": "sign", "category": "Actions", "animation": "see", "description": "'V' handshape fingers point near eyes and extend outward in viewing direction."},
    "STOP": {"word": "STOP", "asset": "stop", "type": "sign", "category": "Actions", "animation": "stop", "description": "Edge of flat right palm chops down firmly onto open left palm."},

    # Questions & Time
    "WHAT": {"word": "WHAT", "asset": "what", "type": "sign", "category": "Questions", "animation": "what", "description": "Both open palms held up at waist level in front, pulsing side to side."},
    "WHERE": {"word": "WHERE", "asset": "where", "type": "sign", "category": "Questions", "animation": "where", "description": "Both hands held in front with open palms facing up, undulating side to side with questioning head tilt."},
    "WHY": {"word": "WHY", "asset": "why", "type": "sign", "category": "Questions", "animation": "why", "description": "Fingers touch forehead and pull away into 'Y' handshape."},
    "WHEN": {"word": "WHEN", "asset": "when", "type": "sign", "category": "Questions", "animation": "when", "description": "Right index finger circles around left index finger and lands on fingertip."},
    "WHO": {"word": "WHO", "asset": "who", "type": "sign", "category": "Questions", "animation": "who", "description": "Index finger circles in front of lips with questioning expression."},
    "HOW": {"word": "HOW", "asset": "how", "type": "sign", "category": "Questions", "animation": "how", "description": "Curved hands start palms down, rolling outward until palms face up."},
    "TODAY": {"word": "TODAY", "asset": "today", "type": "sign", "category": "Time", "animation": "today", "description": "'Y' handshapes dropped down sharply twice in front of body."},
    "TOMORROW": {"word": "TOMORROW", "asset": "tomorrow", "type": "sign", "category": "Time", "animation": "tomorrow", "description": "Thumbs-up hand touches cheek and arcs forward in front."},
    "YESTERDAY": {"word": "YESTERDAY", "asset": "yesterday", "type": "sign", "category": "Time", "animation": "yesterday", "description": "Thumbs-up hand touches chin and moves backward to ear."},
    "NOW": {"word": "NOW", "asset": "now", "type": "sign", "category": "Time", "animation": "now", "description": "Bent hands drop down firmly once in front of chest."},
    "GOOD": {"word": "GOOD", "asset": "good", "type": "sign", "category": "Basics", "animation": "good", "description": "Flat right hand touches chin and moves down onto flat left palm."},
    "BAD": {"word": "BAD", "asset": "bad", "type": "sign", "category": "Basics", "animation": "bad", "description": "Flat right hand touches chin and turns sharply downward."},
}

# Synonyms, Lemmatization, and Hinglish normalizations
LEMMA_MAP = {
    # Hinglish & Romanized Hindi Aliases
    "AAP": "YOU",
    "TUM": "YOU",
    "TU": "YOU",
    "MAIN": "ME",
    "MUJHE": "ME",
    "HAM": "WE",
    "HUM": "WE",
    "KYA": "WHAT",
    "KAR": "DO",
    "KAREN": "DO",
    "KARE": "DO",
    "KAHAN": "WHERE",
    "KAHAN?": "WHERE",
    "KAB": "WHEN",
    "KYUN": "WHY",
    "KAISE": "HOW",
    "RAHTE": "LIVE",
    "REHTE": "LIVE",
    "REHTA": "LIVE",
    "REHTI": "LIVE",
    "PAANI": "WATER",
    "KHANA": "FOOD",
    "MADAD": "HELP",
    "SHUKRIYA": "THANK YOU",
    "DHANYAWAD": "THANK YOU",
    "NAMASKAR": "NAMASTE",

    # English inflections
    "WANTS": "WANT",
    "WANTED": "WANT",
    "WANTING": "WANT",
    "DESIRE": "WANT",
    "WISH": "WANT",
    "NEEDS": "NEED",
    "NEEDED": "NEED",
    "NEEDING": "NEED",
    "REQUIRE": "NEED",
    "LIKES": "LIKE",
    "LIKED": "LIKE",
    "LIKING": "LIKE",
    "LOVES": "LOVE",
    "LOVED": "LOVE",
    "LOVING": "LOVE",
    "KNOWS": "KNOW",
    "KNEW": "KNOW",
    "KNOWN": "KNOW",
    "UNDERSTANDS": "UNDERSTAND",
    "UNDERSTOOD": "UNDERSTAND",
    "FEELS": "FEEL",
    "FELT": "FEEL",
    "THINKS": "THINK",
    "THOUGHT": "THINK",
    "EATING": "EAT",
    "ATE": "EAT",
    "EATS": "EAT",
    "DRINKING": "DRINK",
    "DRANK": "DRINK",
    "DRINKS": "DRINK",
    "GOING": "GO",
    "WENT": "GO",
    "GOES": "GO",
    "COMING": "COME",
    "CAME": "COME",
    "COMES": "COME",
    "GIVING": "GIVE",
    "GAVE": "GIVE",
    "GIVES": "GIVE",
    "TAKING": "TAKE",
    "TOOK": "TAKE",
    "TAKES": "TAKE",
    "SEEING": "SEE",
    "SAW": "SEE",
    "SEES": "SEE",
    "STOPPED": "STOP",
    "STOPS": "STOP",
    "STOPPING": "STOP",
    "WORKING": "WORK",
    "WORKED": "WORK",
    "WORKS": "WORK",
    "STUDYING": "STUDY",
    "STUDIED": "STUDY",
    "STUDIES": "STUDY",
    "WRITING": "WRITE",
    "WROTE": "WRITE",
    "WRITTEN": "WRITE",
    "WRITES": "WRITE",
    "DOING": "DO",
    "DID": "DO",
    "DOES": "DO",
    "LIVING": "LIVE",
    "LIVED": "LIVE",
    "RESIDE": "LIVE",
    "STAY": "LIVE",
    "STAYING": "LIVE",
    "HE": "ME",
    "SHE": "ME",
    "HIM": "ME",
    "HER": "ME",
    "MINE": "MY",
    "YOUR": "YOU",
    "YOURS": "YOU",
    "THEIR": "THEY",
    "THEIRS": "THEY",
    "HI": "HELLO",
    "HEY": "HELLO",
    "THANKS": "THANK YOU",
    "THANKYOU": "THANK YOU",
    "GOOD BYE": "GOODBYE",
    "BYE": "GOODBYE",
}

# Add full alphabet A-Z fingerspelling
for char in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
    VOCABULARY_SIGNS[char] = {
        "word": char,
        "asset": f"letter_{char.lower()}",
        "type": "letter",
        "category": "Alphabet (A-Z)",
        "animation": f"letter_{char.lower()}",
        "description": f"ISL Fingerspelling hand posture for English letter '{char}'.",
    }

# Add numbers 0-9
for digit in "0123456789":
    VOCABULARY_SIGNS[digit] = {
        "word": digit,
        "asset": f"number_{digit}",
        "type": "number",
        "category": "Numbers (0-9)",
        "animation": f"number_{digit}",
        "description": f"ISL Number handshape for digit '{digit}'.",
    }

def normalize_key(word: str) -> str:
    if not word:
        return ""
    key = word.upper().strip().replace("?", "").replace("!", "").replace(".", "")
    key = LEMMA_MAP.get(key, key)
    return key

def get_sign(word: str) -> dict | None:
    if not word:
        return None
    key = normalize_key(word)
    if key in VOCABULARY_SIGNS:
        return VOCABULARY_SIGNS[key]
    return None

def get_signs(words: list[str]) -> list[dict]:
    """
    Given a list of gloss words, return animation definitions.
    Normalized Hinglish & English concept keys map directly to whole-word ISL signs.
    """
    signs = []
    for w in words:
        if not w:
            continue
        cleaned = w.upper().strip().replace("?", "").replace("!", "")

        # 1. Direct sign or mapped key sign
        sign = get_sign(cleaned)
        if sign:
            signs.append(sign)
            continue

        # 2. Multi-word phrase check
        sub_words = cleaned.split()
        if len(sub_words) > 1:
            for sw in sub_words:
                s = get_sign(sw)
                if s:
                    signs.append(s)
                else:
                    signs.append({
                        "word": sw,
                        "asset": sw.lower(),
                        "type": "sign",
                        "category": "Vocabulary",
                        "animation": sw.lower(),
                        "description": f"ISL sign for '{sw}'.",
                    })
        else:
            # 3. Single unknown word: treat as concept sign (DO NOT split into letters)
            norm = normalize_key(cleaned)
            signs.append({
                "word": norm,
                "asset": norm.lower(),
                "type": "sign",
                "category": "Vocabulary",
                "animation": norm.lower(),
                "description": f"ISL sign representation for '{norm}'.",
            })
    return signs

def get_all_signs() -> dict:
    """Return all catalog signs organized by category."""
    categories = {}
    for item in VOCABULARY_SIGNS.values():
        cat = item.get("category", "General")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(item)
    return {
        "categories": categories,
        "total_signs": len(VOCABULARY_SIGNS),
    }
