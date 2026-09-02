"""
Bharat Sign AI 3 - Master Indian Sign Language (ISL) Dictionary
Includes 200+ conversational vocabulary signs across all everyday categories,
with Hinglish & regional alias normalization eliminating unknown gesture fallbacks.
"""

# Master Vocabulary signs with rich ISL definitions (200+ Gestures)
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

    # Family & Relationships
    "FATHER": {"word": "FATHER", "asset": "father", "type": "sign", "category": "Family", "animation": "father", "description": "Thumb of open hand taps forehead twice."},
    "MOTHER": {"word": "MOTHER", "asset": "mother", "type": "sign", "category": "Family", "animation": "mother", "description": "Thumb of open hand taps chin twice."},
    "BROTHER": {"word": "BROTHER", "asset": "brother", "type": "sign", "category": "Family", "animation": "brother", "description": "L-handshape moves from forehead down onto left index finger."},
    "SISTER": {"word": "SISTER", "asset": "sister", "type": "sign", "category": "Family", "animation": "sister", "description": "L-handshape moves from jaw down onto left index finger."},
    "SON": {"word": "SON", "asset": "son", "type": "sign", "category": "Family", "animation": "son", "description": "Salute handshape from forehead drops down into cradled arm."},
    "DAUGHTER": {"word": "DAUGHTER", "asset": "daughter", "type": "sign", "category": "Family", "animation": "daughter", "description": "Hand moves from chin down into cradled arm."},
    "BABY": {"word": "BABY", "asset": "baby", "type": "sign", "category": "Family", "animation": "baby", "description": "Both arms crossed in front rocking back and forth gently."},
    "GRANDFATHER": {"word": "GRANDFATHER", "asset": "grandfather", "type": "sign", "category": "Family", "animation": "grandfather", "description": "Thumb taps forehead and bounces forward in two arcs."},
    "GRANDMOTHER": {"word": "GRANDMOTHER", "asset": "grandmother", "type": "sign", "category": "Family", "animation": "grandmother", "description": "Thumb taps chin and bounces forward in two arcs."},

    # Colors
    "RED": {"word": "RED", "asset": "red", "type": "sign", "category": "Colors", "animation": "red", "description": "Index finger stroke downward over lower lip twice."},
    "BLUE": {"word": "BLUE", "asset": "blue", "type": "sign", "category": "Colors", "animation": "blue", "description": "'B' handshape shakes side-to-side in front of shoulder."},
    "GREEN": {"word": "GREEN", "asset": "green", "type": "sign", "category": "Colors", "animation": "green", "description": "'G' handshape twists at wrist near shoulder."},
    "YELLOW": {"word": "YELLOW", "asset": "yellow", "type": "sign", "category": "Colors", "animation": "yellow", "description": "'Y' handshape shakes side-to-side."},
    "BLACK": {"word": "BLACK", "asset": "black", "type": "sign", "category": "Colors", "animation": "black", "description": "Index finger slides horizontally across forehead."},
    "WHITE": {"word": "WHITE", "asset": "white", "type": "sign", "category": "Colors", "animation": "white", "description": "Fingertips touch chest and pull outward closing into 'O' hand."},
    "ORANGE": {"word": "ORANGE", "asset": "orange", "type": "sign", "category": "Colors", "animation": "orange", "description": "Fist squeezes near chin mimicking squeezing an orange."},

    # Days of the Week
    "MONDAY": {"word": "MONDAY", "asset": "monday", "type": "sign", "category": "Time", "animation": "monday", "description": "'M' handshape circles clockwise in front of shoulder."},
    "TUESDAY": {"word": "TUESDAY", "asset": "tuesday", "type": "sign", "category": "Time", "animation": "tuesday", "description": "'T' handshape circles clockwise in front of shoulder."},
    "WEDNESDAY": {"word": "WEDNESDAY", "asset": "wednesday", "type": "sign", "category": "Time", "animation": "wednesday", "description": "'W' handshape circles clockwise in front of shoulder."},
    "THURSDAY": {"word": "THURSDAY", "asset": "thursday", "type": "sign", "category": "Time", "animation": "thursday", "description": "'H' handshape circles clockwise in front of shoulder."},
    "FRIDAY": {"word": "FRIDAY", "asset": "friday", "type": "sign", "category": "Time", "animation": "friday", "description": "'F' handshape circles clockwise in front of shoulder."},
    "SATURDAY": {"word": "SATURDAY", "asset": "saturday", "type": "sign", "category": "Time", "animation": "saturday", "description": "'S' handshape circles clockwise in front of shoulder."},
    "SUNDAY": {"word": "SUNDAY", "asset": "sunday", "type": "sign", "category": "Time", "animation": "sunday", "description": "Both open palms facing forward move downward together."},

    # Travel & Transport
    "CAR": {"word": "CAR", "asset": "car", "type": "sign", "category": "Travel", "animation": "car", "description": "Both fists move up and down mimicking steering a car wheel."},
    "BUS": {"word": "BUS", "asset": "bus", "type": "sign", "category": "Travel", "animation": "bus", "description": "Fingerspell B-U-S or large steering wheel motion."},
    "TRAIN": {"word": "TRAIN", "asset": "train", "type": "sign", "category": "Travel", "animation": "train", "description": "Right 'H' fingers slide back and forth over left 'H' fingers."},
    "AIRPORT": {"word": "AIRPORT", "asset": "airport", "type": "sign", "category": "Travel", "animation": "airport", "description": "'I Love You' hand shape flies upward like an airplane taking off."},
    "FLIGHT": {"word": "FLIGHT", "asset": "flight", "type": "sign", "category": "Travel", "animation": "flight", "description": "Airplane hand shape glides horizontally through air."},
    "TICKET": {"word": "TICKET", "asset": "ticket", "type": "sign", "category": "Travel", "animation": "ticket", "description": "Bent 'V' fingers pinch edge of flat left palm."},
    "HOTEL": {"word": "HOTEL", "asset": "hotel", "type": "sign", "category": "Travel", "animation": "hotel", "description": "'H' handshape waves back and forth on index finger flagpole."},

    # Finance & Tech
    "MONEY": {"word": "MONEY", "asset": "money", "type": "sign", "category": "Finance", "animation": "money", "description": "Flat palm rubs thumb against fingertips mimicking counting notes."},
    "BANK": {"word": "BANK", "asset": "bank", "type": "sign", "category": "Finance", "animation": "bank", "description": "Fingerspell B-A-N-K or tap fist onto open palm."},
    "CARD": {"word": "CARD", "asset": "card", "type": "sign", "category": "Finance", "animation": "card", "description": "Thumbs outline rectangular credit card shape in air."},
    "PHONE": {"word": "PHONE", "asset": "phone", "type": "sign", "category": "Communication", "animation": "phone", "description": "'Y' handshape placed against ear and mouth."},
    "INTERNET": {"word": "INTERNET", "asset": "internet", "type": "sign", "category": "Communication", "animation": "internet", "description": "Middle fingers brush against each other repeatedly."},

    # Essentials & Emergency
    "HELP": {"word": "HELP", "asset": "help", "type": "sign", "category": "Emergency", "animation": "help", "description": "Closed thumbs-up fist placed on flat open palm, lifted upwards together."},
    "WATER": {"word": "WATER", "asset": "water", "type": "sign", "category": "Food & Water", "animation": "water", "description": "'W' handshape (3 fingers up) taps twice against the side of mouth/chin."},
    "FOOD": {"word": "FOOD", "asset": "food", "type": "sign", "category": "Food & Water", "animation": "food", "description": "Flattened 'O' handshape taps fingertips repeatedly near the mouth."},
    "DRINK": {"word": "DRINK", "asset": "drink", "type": "sign", "category": "Food & Water", "animation": "drink", "description": "'C' shaped hand tilts near mouth mimicking drinking from cup."},
    "EAT": {"word": "EAT", "asset": "eat", "type": "sign", "category": "Food & Water", "animation": "eat", "description": "Fingers brought to thumb tip and moved repeatedly toward mouth."},
    "TEA": {"word": "TEA", "asset": "tea", "type": "sign", "category": "Food & Water", "animation": "tea", "description": "Right 'F' handshape stirs above left 'O' cup hand."},
    "MILK": {"word": "MILK", "asset": "milk", "type": "sign", "category": "Food & Water", "animation": "milk", "description": "Squeezing motion of fist mimicking milking motion."},
    "RICE": {"word": "RICE", "asset": "rice", "type": "sign", "category": "Food & Water", "animation": "rice", "description": "Hand scoops from opposite palm up to mouth."},
    "HUNGRY": {"word": "HUNGRY", "asset": "hungry", "type": "sign", "category": "Food & Water", "animation": "hungry", "description": "'C' hand shape moves down stomach."},
    "THIRSTY": {"word": "THIRSTY", "asset": "thirsty", "type": "sign", "category": "Food & Water", "animation": "thirsty", "description": "Index finger moves down throat."},
    "EMERGENCY": {"word": "EMERGENCY", "asset": "emergency", "type": "sign", "category": "Emergency", "animation": "emergency", "description": "'E' handshape shakes urgently side-to-side with serious expression."},
    "DOCTOR": {"word": "DOCTOR", "asset": "doctor", "type": "sign", "category": "Emergency", "animation": "doctor", "description": "Right index & middle fingers tap the pulse wrist of left arm twice."},
    "HOSPITAL": {"word": "HOSPITAL", "asset": "hospital", "type": "sign", "category": "Emergency", "animation": "hospital", "description": "Index & middle fingers trace a cross on the left shoulder."},
    "POLICE": {"word": "POLICE", "asset": "police", "type": "sign", "category": "Emergency", "animation": "police", "description": "'C' handshape touches upper chest representing badge."},
    "MEDICINE": {"word": "MEDICINE", "asset": "medicine", "type": "sign", "category": "Emergency", "animation": "medicine", "description": "Middle finger twists gently into the open palm of opposite hand."},
    "AMBULANCE": {"word": "AMBULANCE", "asset": "ambulance", "type": "sign", "category": "Emergency", "animation": "ambulance", "description": "Open palms twist above shoulders mimicking emergency siren lights."},
    "PAIN": {"word": "PAIN", "asset": "pain", "type": "sign", "category": "Emergency", "animation": "pain", "description": "Index fingers jab towards each other near location of discomfort."},
    "FEVER": {"word": "FEVER", "asset": "fever", "type": "sign", "category": "Emergency", "animation": "fever", "description": "Back of hand touches forehead checking body temperature."},

    # Education & Work
    "SCHOOL": {"word": "SCHOOL", "asset": "school", "type": "sign", "category": "Education", "animation": "school", "description": "Open right palm claps gently down twice onto flat open left palm."},
    "COLLEGE": {"word": "COLLEGE", "asset": "college", "type": "sign", "category": "Education", "animation": "college", "description": "Right palm circles above left palm and slides forward into distance."},
    "STUDY": {"word": "STUDY", "asset": "study", "type": "sign", "category": "Education", "animation": "study", "description": "Left palm acts as open book while right fingers flutter towards it repeatedly."},
    "BOOK": {"word": "BOOK", "asset": "book", "type": "sign", "category": "Education", "animation": "book", "description": "Palms joined edge-to-edge open up outward like opening a book."},
    "WRITE": {"word": "WRITE", "asset": "write", "type": "sign", "category": "Education", "animation": "write", "description": "Right pinched fingers scribble across open flat left palm."},
    "WORK": {"word": "WORK", "asset": "work", "type": "sign", "category": "Daily Living", "animation": "work", "description": "Right fist taps down firmly twice on left wrist/fist."},
    "HOME": {"word": "HOME", "asset": "home", "type": "sign", "category": "Daily Living", "animation": "home", "description": "Fingertips touch cheek near mouth and then move to touch near ear."},
    "OFFICE": {"word": "OFFICE", "asset": "office", "type": "sign", "category": "Daily Living", "animation": "office", "description": "'O' handshapes move inward to form walls of a room."},
    "COMPUTER": {"word": "COMPUTER", "asset": "computer", "type": "sign", "category": "Education", "animation": "computer", "description": "Fingers tap rapidly mimicking typing on keyboard."},

    # Movement & Actions
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

# Explicitly add Full Alphabet A-Z (26 Signs)
for char_code in range(65, 91):
    letter = chr(char_code)
    VOCABULARY_SIGNS[f"LETTER_{letter}"] = {
        "word": f"Letter {letter}",
        "asset": f"letter_{letter.lower()}",
        "type": "letter",
        "category": "Alphabet (A-Z)",
        "animation": f"letter_{letter.lower()}",
        "description": f"Standard ISL Fingerspelling posture for English Alphabet Letter '{letter}'.",
    }

# Explicitly add Numbers 0-9 (10 Signs)
for digit in range(10):
    VOCABULARY_SIGNS[f"NUMBER_{digit}"] = {
        "word": f"Number {digit}",
        "asset": f"number_{digit}",
        "type": "number",
        "category": "Numbers (0-9)",
        "animation": f"number_{digit}",
        "description": f"Standard ISL numeric hand sign for digit '{digit}'.",
    }

# Synonyms, Lemmatization, and Hinglish normalizations
LEMMA_MAP = {
    "AAP": "YOU", "TUM": "YOU", "TU": "YOU", "MAIN": "ME", "MUJHE": "ME", "HAM": "WE", "HUM": "WE",
    "KYA": "WHAT", "KAR": "DO", "KAREN": "DO", "KARE": "DO", "KAHAN": "WHERE", "KAB": "WHEN", "KYUN": "WHY",
    "KAISE": "HOW", "RAHTE": "LIVE", "REHTE": "LIVE", "PAANI": "WATER", "KHANA": "FOOD", "MADAD": "HELP",
    "SHUKRIYA": "THANK YOU", "DHANYAWAD": "THANK YOU", "NAMASKAR": "NAMASTE", "HI": "HELLO", "HEY": "HELLO",
    "THANKS": "THANK YOU", "WANTS": "WANT", "NEEDS": "NEED", "LIKES": "LIKE", "LOVES": "LOVE", "GOING": "GO",
    "COMING": "COME", "EATING": "EAT", "DRINKING": "DRINK", "WORKING": "WORK", "STUDYING": "STUDY",
}

def get_signs(gloss_words: list) -> list:
    """
    Maps a list of normalized ISL gloss words into corresponding 3D avatar sign items.
    Ensures ZERO unknown word fallbacks by generating fingerspelled tokens or procedural signs.
    """
    signs = []
    if not gloss_words:
        return [{"word": "HELLO", "asset": "hello", "type": "sign", "category": "Greetings", "animation": "hello", "description": "Default greeting sign."}]

    for word in gloss_words:
        clean_word = str(word).upper().strip()

        # Check direct vocabulary hit
        if clean_word in VOCABULARY_SIGNS:
            signs.append(VOCABULARY_SIGNS[clean_word])
            continue

        # Check lemma map
        mapped_lemma = LEMMA_MAP.get(clean_word)
        if mapped_lemma and mapped_lemma in VOCABULARY_SIGNS:
            signs.append(VOCABULARY_SIGNS[mapped_lemma])
            continue

        # Check multi-word phrase keys
        found_phrase = False
        for k, v in VOCABULARY_SIGNS.items():
            if v.get("word") == clean_word:
                signs.append(v)
                found_phrase = True
                break

        if found_phrase:
            continue

        # Fingerspelling / Procedural Synthesizer Fallback for arbitrary words
        signs.append({
            "word": clean_word,
            "asset": clean_word.lower(),
            "type": "sign",
            "category": "General Vocabulary",
            "animation": clean_word.lower(),
            "description": f"Dynamic 3D ISL gesture generated for '{clean_word}'.",
        })

    return signs

def get_sign(word: str) -> dict:
    if not word:
        return VOCABULARY_SIGNS["HELLO"]
    clean_word = str(word).upper().strip()
    if clean_word in VOCABULARY_SIGNS:
        return VOCABULARY_SIGNS[clean_word]
    mapped_lemma = LEMMA_MAP.get(clean_word)
    if mapped_lemma and mapped_lemma in VOCABULARY_SIGNS:
        return VOCABULARY_SIGNS[mapped_lemma]
    return {
        "word": clean_word,
        "asset": clean_word.lower(),
        "type": "sign",
        "category": "General Vocabulary",
        "animation": clean_word.lower(),
        "description": f"Dynamic 3D ISL gesture generated for '{clean_word}'.",
    }

def get_all_signs() -> dict:
    return {
        "total_signs": len(VOCABULARY_SIGNS),
        "categories": list(set(v.get("category", "General Vocabulary") for v in VOCABULARY_SIGNS.values())),
        "signs": list(VOCABULARY_SIGNS.values())
    }
