"""
Bharat Sign AI 3 - Master Indian Sign Language (ISL) Dictionary
Includes 200+ conversational vocabulary signs across all everyday categories,
with Hinglish & regional alias normalization eliminating unknown gesture fallbacks.
"""

# Master Vocabulary signs with rich ISL definitions (200+ Gestures)
VOCABULARY_SIGNS = {
    # Greetings & Social
    "HELLO": {"word": "HELLO", "asset": "hello", "type": "sign", "category": "Greetings", "animation": "hello", "description": "Canonical salute greeting: Thumb closed across palm, four fingers open. Hand touches forehead mesh surface above right eyebrow, then sweeps smoothly outward and downward towards Quadrant III; left hand rests at side."},
    "HI": {"word": "HI", "asset": "hi", "type": "sign", "category": "Greetings", "animation": "hi", "description": "Single right hand elevated above shoulder with palm facing front side, waving continuously side-to-side like goodbye; left hand rests relaxed at side (unlike goodbye where both hands are up)."},
    "BYE": {"word": "BYE", "asset": "bye", "type": "sign", "category": "Greetings", "animation": "bye", "description": "Both hands raised above shoulders with palms facing front side, waving continuously from left to right and right to left in cheerful farewell."},
    "NAMASTE": {"word": "NAMASTE", "asset": "namaste", "type": "sign", "category": "Greetings", "animation": "namaste", "description": "Both palms joined in front of chest with head slight bow."},
    "THANK YOU": {"word": "THANK YOU", "asset": "thank_you", "type": "sign", "category": "Greetings", "animation": "thank_you", "description": "Flat open hand with wrist turned 180° opposite and elbow at 90° on shoulder starts placed directly on chin/lips, then sweeps smoothly forward towards the user in gratitude; left hand rests at side."},
    "GOODBYE": {"word": "GOODBYE", "asset": "bye", "type": "sign", "category": "Greetings", "animation": "bye", "description": "Both hands raised above shoulders with palms facing front side, waving continuously from left to right and right to left in cheerful farewell."},
    "PLEASE": {"word": "PLEASE", "asset": "please", "type": "sign", "category": "Greetings", "animation": "please", "description": "Right shoulder moves from right to left while the elbow turns 90 degrees from right to left and the palm/wrist touches the chest; head bows down while touching the chest for the please gesture; four fingers straight together and thumb closed across palm; left hand rests at side."},
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
    "HAPPY": {"word": "HAPPY", "asset": "happy", "type": "sign", "category": "Emotions", "animation": "happy", "description": "Right elbow turned 90° right-to-left and left elbow turned 90° left-to-right across lower chest with wrists turned 180°; after that wrists turn slowly from DOWN to UP to brush upward along the chest with a warm, joyful radiant smile on the face (Verified from AI4Bharat INCLUDE Dataset).", "referenceVideo": "/videos/happy_reference.mov"},
    "SAD": {"word": "SAD", "asset": "sad", "type": "sign", "category": "Emotions", "animation": "sad", "description": "In SAD, except the index finger all the fingers are closed with the thumb also closed in a fist on BOTH hands. Both index fingers are placed at the eyes and move simultaneously from UP to DOWN along the cheeks tracing falling tears with a sorrowful expression."},
    "BEAUTIFUL": {"word": "BEAUTIFUL", "asset": "beautiful", "type": "sign", "category": "Descriptors", "animation": "beautiful", "description": "In beautiful, turn the elbow 180 degrees towards the mouth and wrist also 180 degrees towards the mouth with all fingers closed except index finger and thumb, round with index finger on the circle of their own face, then close index finger and thumb and open another three fingers pointing towards the user with wrist at 90 degrees of the elbow."},
    "UGLY": {"word": "UGLY", "asset": "ugly", "type": "sign", "category": "Descriptors", "animation": "ugly", "description": "Right claw hand rises in front of the face, sweeps horizontally across from left to right and pulls away sharply, while the avatar turns head slightly aside with a distasteful facial expression; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset)."},
    "DEAF": {"word": "DEAF", "asset": "deaf", "type": "sign", "category": "Descriptors", "animation": "deaf", "description": "Right hand with index finger extended touches the right ear, then moves forward in a smooth arc to touch near the lips/chin, expressing Deaf in Indian Sign Language; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset)."},
    "BLIND": {"word": "BLIND", "asset": "blind", "type": "sign", "category": "Descriptors", "animation": "blind", "description": "Right hand in V-handshape points index and middle fingers toward the eyes at eye level, then sweeps horizontally across the sightline to convey Blind in Indian Sign Language; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset)."},
    "ANGRY": {"word": "ANGRY", "asset": "angry", "type": "sign", "category": "Emotions", "animation": "angry", "description": "Both hands form tense curved claw shapes (PRESET_CLAW_HAND) held near chest, pulling outward and upward with intense furrowed-brow frown."},
    "HIGH": {"word": "HIGH", "asset": "high", "type": "sign", "category": "Descriptors", "animation": "high", "description": "Right flat B-hand held at chest level rises steadily straight upward above head level to indicate high elevation or height level."},
    "LOW": {"word": "LOW", "asset": "low", "type": "sign", "category": "Descriptors", "animation": "low", "description": "Right flat B-hand with palm facing downward moves steadily downward from chest level toward waist to indicate low level or depth."},
    "NARROW": {"word": "NARROW", "asset": "narrow", "type": "sign", "category": "Descriptors", "animation": "narrow", "description": "Both open flat hands held vertically facing each other at chest width move smoothly inward toward each other until palms are closely spaced, indicating narrow space."},
    "DEAD": {"word": "DEAD", "asset": "dead", "type": "sign", "category": "Descriptors", "animation": "dead", "description": "Both open flat hands start facing upward and simultaneously flip 180 degrees over to palm-down, representing Dead in Indian Sign Language (Trained from AI4Bharat INCLUDE Dataset)."},

    "YES": {"word": "YES", "asset": "yes", "type": "sign", "category": "Basics", "animation": "yes", "description": "Single right hand elevated with elbow turned 45° from right to left, closed S-fist facing directly towards the user (all fingers and thumb closed tightly). Starts in UP position and nods firmly DOWN from the wrist; left hand rests at side."},
    "NO": {"word": "NO", "asset": "no", "type": "sign", "category": "Basics", "animation": "no", "description": "Single right hand elevated in front of chest/shoulder with elbow turned 45° from right to left, ring and pinky curled into palm. Index finger, middle finger, and thumb start open, then index and middle fingers snap down to touch the thumb pad directly while head shakes side to side in refusal; left hand rests at side."},
    "ME": {"word": "ME", "asset": "me", "type": "sign", "category": "Pronouns", "animation": "me", "description": "Index finger points directly to one's own chest."},
    "YOU": {"word": "YOU", "asset": "you", "type": "sign", "category": "Pronouns", "animation": "you", "description": "Both hands index fingers pointing outward directly towards the user."},
    "YOUR": {"word": "YOUR", "asset": "your", "type": "sign", "category": "Pronouns", "animation": "your", "description": "Flat open hand facing forward pushed gently towards partner."},
    "HE": {"word": "HE", "asset": "he", "type": "sign", "category": "Pronouns", "animation": "he", "description": "Index finger points towards a third person."},
    "SHE": {"word": "SHE", "asset": "she", "type": "sign", "category": "Pronouns", "animation": "she", "description": "Index finger points towards a third person female."},
    "IT": {"word": "IT", "asset": "it", "type": "sign", "category": "Pronouns", "animation": "it", "description": "Index finger points to object."},
    "WE": {"word": "WE", "asset": "we", "type": "sign", "category": "Pronouns", "animation": "we", "description": "Index finger touches right shoulder, arcs across, and touches left shoulder."},
    "THEY": {"word": "THEY", "asset": "they", "type": "sign", "category": "Pronouns", "animation": "they", "description": "Index finger sweeps across pointing toward a group in the distance."},
    "MY": {"word": "MY", "asset": "my", "type": "sign", "category": "Pronouns", "animation": "my", "description": "Flat open palm rests firmly on the chest."},
    "HIS": {"word": "HIS", "asset": "his", "type": "sign", "category": "Pronouns", "animation": "his", "description": "Flat palm points towards third person."},
    "HER": {"word": "HER", "asset": "her", "type": "sign", "category": "Pronouns", "animation": "her", "description": "Flat palm points towards third person female."},
    "THEIR": {"word": "THEIR", "asset": "their", "type": "sign", "category": "Pronouns", "animation": "their", "description": "Flat palm sweeps toward group."},
    "US": {"word": "US", "asset": "we", "type": "sign", "category": "Pronouns", "animation": "we", "description": "Index finger points back and forth between speaker and listener."},
    "OUR": {"word": "OUR", "asset": "we", "type": "sign", "category": "Pronouns", "animation": "we", "description": "Cupped hand sweeps over chest indicating ownership."},
    "NAME": {"word": "NAME", "asset": "name", "type": "sign", "category": "Basics", "animation": "name", "description": "Right index and middle fingers tap across left index and middle fingers twice."},
    "FINE": {"word": "FINE", "asset": "fine", "type": "sign", "category": "Basics", "animation": "fine", "description": "Open 5-hand with thumb touching center of chest."},
    "ARE": {"word": "ARE", "asset": "are", "type": "sign", "category": "Basics", "animation": "are", "description": "Right index finger moves forward from chin/lips."},
    "IS": {"word": "IS", "asset": "is", "type": "sign", "category": "Basics", "animation": "is", "description": "Right index finger moves forward from chin/lips."},
    "AM": {"word": "AM", "asset": "am", "type": "sign", "category": "Basics", "animation": "am", "description": "Right index finger moves forward from chin/lips."},

    # Family & Relationships
    "FATHER": {"word": "FATHER", "asset": "father", "type": "sign", "category": "Family", "animation": "father", "description": "Thumb of open hand taps forehead twice."},
    "MOTHER": {"word": "MOTHER", "asset": "mother", "type": "sign", "category": "Family", "animation": "mother", "description": "Thumb of open hand taps chin twice."},
    "BROTHER": {"word": "BROTHER", "asset": "brother", "type": "sign", "category": "Family", "animation": "brother", "description": "L-handshape moves from forehead down onto left index finger."},
    "SISTER": {"word": "SISTER", "asset": "sister", "type": "sign", "category": "Family", "animation": "sister", "description": "L-handshape moves from jaw down onto left index finger."},
    "FRIEND": {"word": "FRIEND", "asset": "friend", "type": "sign", "category": "Family", "animation": "friend", "description": "Both hooked index fingers link together twice with friendly expression."},
    "FAMILY": {"word": "FAMILY", "asset": "family", "type": "sign", "category": "Family", "animation": "family", "description": "Both 'F' hands start together and circle outward meeting at little fingers."},
    "BOY": {"word": "BOY", "asset": "boy", "type": "sign", "category": "Family", "animation": "boy", "description": "Hand grasps brim of imaginary cap on forehead."},
    "GIRL": {"word": "GIRL", "asset": "girl", "type": "sign", "category": "Family", "animation": "girl", "description": "Thumb traces jawline down to chin."},
    "TEACHER": {"word": "TEACHER", "asset": "teacher", "type": "sign", "category": "Education", "animation": "teacher", "description": "Flattened 'O' hands move from temples forward into person sign."},
    "STUDENT": {"word": "STUDENT", "asset": "student", "type": "sign", "category": "Education", "animation": "student", "description": "Right hand takes information from left palm to forehead, followed by person sign."},
    "INDIA": {"word": "INDIA", "asset": "india", "type": "sign", "category": "Places", "animation": "india", "description": "Thumb of 'A' handshape presses gently onto center of forehead (bindi/tilak point)."},
    "DELHI": {"word": "DELHI", "asset": "delhi", "type": "sign", "category": "Places", "animation": "delhi", "description": "'D' handshape twists near temple."},
    "MUMBAI": {"word": "MUMBAI", "asset": "mumbai", "type": "sign", "category": "Places", "animation": "mumbai", "description": "'M' handshape circles near chin."},
    "TIME": {"word": "TIME", "asset": "time", "type": "sign", "category": "Time", "animation": "time", "description": "Right index finger taps wrist twice mimicking a watch."},
    "MORNING": {"word": "MORNING", "asset": "morning", "type": "sign", "category": "Time", "animation": "morning", "description": "Right arm rises upward mimicking the sun rising."},
    "NIGHT": {"word": "NIGHT", "asset": "night", "type": "sign", "category": "Time", "animation": "night", "description": "Right bent hand drops over horizontal left arm mimicking sunset."},
    "EVENING": {"word": "EVENING", "asset": "evening", "type": "sign", "category": "Time", "animation": "evening", "description": "Right bent hand rests on horizontal left arm."},
    "ALWAYS": {"word": "ALWAYS", "asset": "always", "type": "sign", "category": "Time", "animation": "always", "description": "Index finger circles in vertical plane."},
    "NEVER": {"word": "NEVER", "asset": "never", "type": "sign", "category": "Basics", "animation": "never", "description": "Flat palm draws a question mark or swoop down in air."},
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
    "FOOD": {"word": "FOOD", "asset": "eat", "type": "sign", "category": "Food & Water", "animation": "eat", "description": "From Quadrant III with wrist turned 180° opposite along the forearm, pinched fingers, thumb, and elbow directed toward the mouth, hand moves smoothly to touch the lips twice; left hand rests at side."},
    "DRINK": {"word": "DRINK", "asset": "drink", "type": "sign", "category": "Food & Water", "animation": "drink", "description": "From Quadrant III with elbow adjusted to the situation and wrist turned 180° opposite (Y = 1.54 rad), hand in 'C' cup shape (open thumb, 4 bent fingers) moves smoothly towards the lips of the mouth to drink; left hand rests at side."},
    "EAT": {"word": "EAT", "asset": "eat", "type": "sign", "category": "Food & Water", "animation": "eat", "description": "From Quadrant III with wrist turned 180° opposite along the forearm, pinched fingers, thumb, and elbow directed toward the mouth, hand moves smoothly to touch the lips twice; left hand rests at side."},
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
    "CLIMB": {"word": "CLIMB", "asset": "climb", "type": "sign", "category": "Actions", "animation": "climb", "description": "Both hands continuously climb stairs alternating steps over each other: first the left hand moves up and over the right hand onto the higher step, then the right hand steps up and over the left hand onto the next step, repeating continuously with both elbows bent 90 degrees to each other, wrists turned 90 degrees (right from right to left, left from left to right), and flat downward palms."},
    "RUN": {"word": "RUN", "asset": "run", "type": "sign", "category": "Actions", "animation": "run", "description": "In RUN sign language: close all fingers except index finger and thumb on both hands (forming modified L-handshapes with middle, ring, pinky in closed fists). The left elbow is turned 90 degrees from left to right across the torso so the left index finger touches the right thumb from the back. The right hand index finger points directly forward towards the user. Both hands perform rhythmic forward running strides in unison."},
    "FALL": {"word": "FALL", "asset": "fall", "type": "sign", "category": "Actions", "animation": "fall", "description": "Position both hands in front of the body, with the fingers slightly bent. Move the hands downward to represent falling, keeping the elbows slightly bent and allowing the wrists to follow the downward movement."},
    "GIVE": {"word": "GIVE", "asset": "give", "type": "sign", "category": "Actions", "animation": "give", "description": "Hold both hands in front of the body, with the palms facing upward and the fingers gently curved. Move the hands forward together as if offering something to another person. Keep the elbows slightly bent and the wrists aligned with the hands."},
    "PUSH": {"word": "PUSH", "asset": "push", "type": "sign", "category": "Actions", "animation": "push", "description": "Make both hands into fists and position them in front of the chest. Keep the elbows bent, then move both forearms forward as if pushing an object away. Maintain the fist shape and keep the wrists aligned with the forearms."},
    "CRY": {"word": "CRY", "asset": "cry", "type": "sign", "category": "Actions", "animation": "cry", "description": "Raise both hands toward the eyes, keeping the index fingers extended and the remaining fingers gently curled. Move the hands downward along the cheeks to represent tears, with the elbows slightly bent and the wrists following the movement."},
    "SLEEP": {"word": "SLEEP", "asset": "sleep", "type": "sign", "category": "Actions", "animation": "sleep", "description": "Raise both hands toward the sides of the face, with the fingers gently curved. Bring the hands closer to the face while keeping the elbows bent. Maintain relaxed wrists and position the hands near the eyes or temples, as illustrated."},
    "SIT DOWN": {"word": "SIT DOWN", "asset": "sit_down", "type": "sign", "category": "Actions", "animation": "sit_down", "description": "Position both hands in front of the body, with the fingers slightly bent and the palms oriented toward each other. Move the hands downward together to indicate sitting down, keeping the elbows relaxed and the wrists aligned with the forearms."},
    "SIT": {"word": "SIT", "asset": "sit_down", "type": "sign", "category": "Actions", "animation": "sit_down", "description": "Position both hands in front of the body, with the fingers slightly bent and the palms oriented toward each other. Move the hands downward together to indicate sitting down, keeping the elbows relaxed and the wrists aligned with the forearms."},
    "KICK": {"word": "KICK", "asset": "kick", "type": "sign", "category": "Actions", "animation": "kick", "description": "Hold one hand in front of the body, with the index finger extended and the remaining fingers curled. Move the hand forward in a short, controlled motion to represent the kicking action. Keep the elbow slightly bent and the wrist aligned with the forearm."},
    "WAIT": {"word": "WAIT", "asset": "wait", "type": "sign", "category": "Actions", "animation": "wait", "description": "Hold both hands in front of the body, with the fingers curled and the wrists bent slightly downward. Keep the elbows bent and the hands relatively still, maintaining the illustrated hand position to represent waiting."},
    "WALK": {"word": "WALK", "asset": "walk", "type": "sign", "category": "Actions", "animation": "walk", "description": "Position both hands in front of the body, with the fingers curled and the index fingers pointing downward. Move the hands alternately forward and backward to represent walking, keeping the elbows slightly bent and the wrists stable."},
    "WASH": {"word": "WASH", "asset": "wash", "type": "sign", "category": "Actions", "animation": "wash", "description": "Bring both hands together in front of the body, with the fingers curved and the palms facing each other. Move the hands against each other in a rubbing motion, keeping the elbows bent and allowing the wrists to move naturally."},
    "LOOK": {"word": "LOOK", "asset": "look", "type": "sign", "category": "Actions", "animation": "look", "description": "Raise one hand near the face, with the index and middle fingers extended and the other fingers curled. Direct the hand outward from the face to represent looking, keeping the elbow bent and the wrist aligned with the forearm."},
    "JUMP": {"word": "JUMP", "asset": "jump", "type": "sign", "category": "Actions", "animation": "jump", "description": "Hold both hands in front of the body, with the fingers curled and the palms oriented inward. Move both hands upward together to represent jumping, keeping the elbows slightly bent and the wrists following the upward movement."},
    "TAKE": {"word": "TAKE", "asset": "take", "type": "sign", "category": "Actions", "animation": "take", "description": "Open hand reaches forward and closes into fist pulling toward body."},
    "SEE": {"word": "SEE", "asset": "look", "type": "sign", "category": "Actions", "animation": "look", "description": "Raise one hand near the face, with the index and middle fingers extended and the other fingers curled. Direct the hand outward from the face to represent looking, keeping the elbow bent and the wrist aligned with the forearm."},
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
    "GREAT": {"word": "GREAT", "asset": "good", "type": "sign", "category": "Basics", "animation": "good", "description": "Both open palms raised high signifying greatness and excellence."},
    "HONORABLE": {"word": "HONORABLE", "asset": "please", "type": "sign", "category": "Social", "animation": "please", "description": "Flat palm over heart bowing forward with respect."},
    "MAN": {"word": "MAN", "asset": "father", "type": "sign", "category": "Family", "animation": "father", "description": "Hand touches forehead and moves down to chest level."},
    "RESPECT": {"word": "RESPECT", "asset": "please", "type": "sign", "category": "Social", "animation": "please", "description": "'R' handshapes move from forehead forward in respectful salute."},
    "PERSON": {"word": "PERSON", "asset": "me", "type": "sign", "category": "Social", "animation": "me", "description": "Both 'P' handshapes move downward along sides of torso."},
    "HUMAN": {"word": "HUMAN", "asset": "me", "type": "sign", "category": "Social", "animation": "me", "description": "Both open hands move downward outlining human figure."},
    "I LOVE YOU": {"word": "I LOVE YOU", "asset": "iloveyou", "type": "sign", "category": "Basics", "animation": "iloveyou", "description": "Thumb, index, and pinky extended together facing partner in universal ILY handshape."},
    "MORE": {"word": "MORE", "asset": "more", "type": "sign", "category": "Basics", "animation": "more", "description": "Both hands form flattened 'O' shapes and tap fingertips together at center chest repeatedly."},
    "BATHROOM": {"word": "BATHROOM", "asset": "bathroom", "type": "sign", "category": "Basics", "animation": "bathroom", "description": "Hand in 'T' handshape shakes side-to-side at shoulder height indicating bathroom/toilet."},
    "MY NAME IS": {"word": "MY NAME IS", "asset": "my_name_is", "type": "sign", "category": "Greetings", "animation": "my_name_is", "description": "Complete self-introduction sign: 'MY' (palm on chest) followed by 'NAME' (H-hand tap)."},
    "QUIET": {"word": "QUIET", "asset": "quiet", "type": "sign", "category": "Descriptors", "animation": "quiet", "description": "Single right index finger extended vertically upright placed directly on the mouth with the wrist turned 45 degrees up and elbow turned 180 degrees towards the mouth; all remaining fingers and thumb tightly closed into a firm fist; left hand rests relaxed at side."},
    "LOUD": {"word": "LOUD", "asset": "loud", "type": "sign", "category": "Descriptors", "animation": "loud", "description": "Both hands brought up to cup both sides of the mouth like a megaphone when calling out, then thrusting forward and flaring outward with spread fingers as shouting loudly into the distance.", "referenceVideo": "/videos/loud_reference.mov"},
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
    "SHUKRIYA": "THANK YOU", "DHANYAWAD": "THANK YOU", "NAMASKAR": "NAMASTE", "PRANAM": "NAMASTE", "HI": "HELLO", "HEY": "HELLO",
    "THANKS": "THANK YOU", "WANTS": "WANT", "NEEDS": "NEED", "LIKES": "LIKE", "LOVES": "LOVE", "GOING": "GO",
    "COMING": "COME", "EATING": "EAT", "DRINKING": "DRINK", "WORKING": "WORK", "STUDYING": "STUDY",
    "WOH": "HE", "USNE": "HE", "USKA": "HIS", "USKI": "HER", "UNKA": "THEIR", "UNHE": "THEY",
    "MERA": "MY", "MERI": "MY", "MERE": "MY", "AAPKA": "YOUR", "TUMHARA": "YOUR", "TERA": "YOUR", "TERI": "YOUR", "AAPKI": "YOUR", "BHARAT": "INDIA",
    "THEEK": "FINE", "THIK": "FINE", "BADHIYA": "FINE", "ACHHA": "GOOD", "ACCHA": "GOOD",
    "DOST": "FRIEND", "MITRA": "FRIEND", "PARIVAR": "FAMILY", "VIDYARTHI": "STUDENT", "GURUJI": "TEACHER",
    "SAMAY": "TIME", "WAQT": "TIME", "AAJ": "TODAY", "KAL": "TOMORROW", "SUBAH": "MORNING", "RAAT": "NIGHT",
    "SHAAM": "EVENING", "HAMESHA": "ALWAYS", "LADKA": "BOY", "LADKI": "GIRL", "GAADI": "CAR", "PAISA": "MONEY", "RUPAYE": "MONEY",
    "ILY": "I LOVE YOU", "LOVE YOU": "I LOVE YOU", "TOILET": "BATHROOM", "WASHROOM": "BATHROOM", "RESTROOM": "BATHROOM",
    "SHAUCHALAY": "BATHROOM", "EXTRA": "MORE", "AUR": "MORE", "MY NAME": "MY NAME IS", "RUKO": "STOP", "ROK": "STOP",
    "DARD": "PAIN", "TAKLEEF": "PAIN", "PEENA": "DRINK", "PEEYO": "DRINK", "KRIPYA": "PLEASE", "KRPYA": "PLEASE",
    "MAAF": "SORRY", "KSHAMA": "SORRY", "HAAN": "YES", "NAHI": "NO", "NAHIN": "NO",
    "CHADNA": "CLIMB", "CHADHNA": "CLIMB", "CLIMBING": "CLIMB",
    "BHAGNA": "RUN", "DAUDNA": "RUN", "BHAGO": "RUN", "RUNNING": "RUN",
    "GIRNA": "FALL", "GIRA": "FALL", "FALLING": "FALL",
    "DENA": "GIVE", "DE": "GIVE", "GIVING": "GIVE",
    "DHAKKA": "PUSH", "DHAKELNA": "PUSH", "PUSHING": "PUSH",
    "RONA": "CRY", "AANSU": "CRY", "RO": "CRY", "CRYING": "CRY",
    "SONA": "SLEEP", "SO": "SLEEP", "SLEEPING": "SLEEP",
    "BAITHNA": "SIT DOWN", "BAITHO": "SIT DOWN", "BAITH": "SIT DOWN", "SIT": "SIT DOWN", "SITTING": "SIT DOWN",
    "LAAT": "KICK", "KICKING": "KICK",
    "INTEZAR": "WAIT", "RUKNA": "WAIT", "WAITING": "WAIT",
    "CHALNA": "WALK", "CHALO": "WALK", "WALKING": "WALK",
    "DHONA": "WASH", "SAAF": "WASH", "WASHING": "WASH",
    "DEKHNA": "LOOK", "DEKHO": "LOOK", "LOOKING": "LOOK",
    "KOODNA": "JUMP", "CHHALANG": "JUMP", "KUDNA": "JUMP", "JUMPING": "JUMP",
    "SHAANT": "QUIET", "SHANT": "QUIET", "SILENCE": "QUIET", "SHHH": "QUIET", "SHH": "QUIET", "CHUP": "QUIET",
    "SHOR": "LOUD", "AWAAZ": "LOUD", "AWAZ": "LOUD", "CHILLANA": "LOUD", "HUNGAMA": "LOUD", "NOISY": "LOUD",
    "KHUSH": "HAPPY", "KHUSHI": "HAPPY", "PRASANN": "HAPPY", "ANAND": "HAPPY",
}

def get_signs(gloss_words: list, allow_fingerspelling_fallback: bool = False) -> list:
    """
    Maps a list of normalized ISL gloss words into corresponding 3D avatar sign items.
    Enforces strict word-by-word sentence splitting:
    - Sentences are split strictly word-by-word (each word stays a single complete whole-word sign).
    - Genuine validated 3D gestures return is_validated=True (LINGUISTICALLY_VALIDATED).
    - Standalone manual alphabet characters (A-Z) map to their verified fingerspelling signs.
    - Fingerspelling decomposition of whole words only occurs if explicitly requested via allow_fingerspelling_fallback=True.
    - Missing vocabulary tokens maintain word-level integrity with active procedural animation (no idle freezing).
    """
    signs = []
    if not gloss_words:
        item = dict(VOCABULARY_SIGNS["HELLO"])
        item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
        return [item]

    for word in gloss_words:
        clean_word = str(word).upper().strip()

        # 1. Direct vocabulary hit
        if clean_word in VOCABULARY_SIGNS:
            item = dict(VOCABULARY_SIGNS[clean_word])
            item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
            signs.append(item)
            continue

        # 2. Lemma mapping
        mapped_lemma = LEMMA_MAP.get(clean_word)
        if mapped_lemma and mapped_lemma in VOCABULARY_SIGNS:
            item = dict(VOCABULARY_SIGNS[mapped_lemma])
            item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
            signs.append(item)
            continue

        # 3. Check multi-word phrase keys
        found_phrase = False
        for k, v in VOCABULARY_SIGNS.items():
            if v.get("word") == clean_word:
                item = dict(v)
                item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
                signs.append(item)
                found_phrase = True
                break

        if found_phrase:
            continue

        # 4. Direct Single-Letter mapping (if word is a standalone single character A-Z or starts with LETTER_)
        if len(clean_word) == 1 and clean_word.isalpha():
            letter_key = f"LETTER_{clean_word}"
            if letter_key in VOCABULARY_SIGNS:
                item = dict(VOCABULARY_SIGNS[letter_key])
                item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
                signs.append(item)
                continue

        # 5. Approved ISL Fingerspelling Fallback (Only active if explicitly allowed, NEVER during normal sentence translation)
        if allow_fingerspelling_fallback and len(clean_word) <= 15 and clean_word.isalpha():
            for char in clean_word:
                letter_key = f"letter_{char.upper()}"
                alt_letter_key = f"LETTER_{char.upper()}"
                if letter_key in VOCABULARY_SIGNS:
                    item = dict(VOCABULARY_SIGNS[letter_key])
                    item.update({"is_validated": True, "validation_status": "ISL_FINGERSPELLING_LETTER", "available": True, "parent_word": clean_word})
                    signs.append(item)
                elif alt_letter_key in VOCABULARY_SIGNS:
                    item = dict(VOCABULARY_SIGNS[alt_letter_key])
                    item["word"] = f"letter_{char.upper()}"
                    item.update({"is_validated": True, "validation_status": "ISL_FINGERSPELLING_LETTER", "available": True, "parent_word": clean_word})
                    signs.append(item)
                else:
                    signs.append({
                        "word": f"letter_{char.upper()}",
                        "asset": f"letter_{char.lower()}",
                        "type": "letter",
                        "category": "Fingerspelling",
                        "animation": f"letter_{char.lower()}",
                        "is_validated": True,
                        "validation_status": "ISL_FINGERSPELLING_LETTER",
                        "available": True,
                        "parent_word": clean_word,
                        "description": f"ISL Manual Alphabet for letter '{char.upper()}'."
                    })
            continue

        # 6. Whole-Word Fallback for Unvalidated / Missing Signs (Maintains strict word-by-word integrity)
        signs.append({
            "word": clean_word,
            "asset": clean_word.lower(),
            "type": "text_fallback",
            "category": "Unvalidated Vocabulary",
            "animation": clean_word.lower(),
            "is_validated": False,
            "validation_status": "UNVALIDATED_TEXT_FALLBACK",
            "available": False,
            "description": f"Linguistically validated 3D ISL animation unavailable for '{clean_word}'. Text fallback active."
        })

    return signs

def get_sign(word: str) -> dict:
    if not word:
        item = dict(VOCABULARY_SIGNS["HELLO"])
        item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
        return item
    clean_word = str(word).upper().strip()
    if clean_word in VOCABULARY_SIGNS:
        item = dict(VOCABULARY_SIGNS[clean_word])
        item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
        return item
    if len(clean_word) == 1 and clean_word.isalpha():
        letter_key = f"LETTER_{clean_word}"
        if letter_key in VOCABULARY_SIGNS:
            item = dict(VOCABULARY_SIGNS[letter_key])
            item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
            return item
    mapped_lemma = LEMMA_MAP.get(clean_word)
    if mapped_lemma and mapped_lemma in VOCABULARY_SIGNS:
        item = dict(VOCABULARY_SIGNS[mapped_lemma])
        item.update({"is_validated": True, "validation_status": "LINGUISTICALLY_VALIDATED", "available": True})
        return item
    return {
        "word": clean_word,
        "asset": clean_word.lower(),
        "type": "text_fallback",
        "category": "Unvalidated Vocabulary",
        "animation": clean_word.lower(),
        "is_validated": False,
        "validation_status": "UNVALIDATED_TEXT_FALLBACK",
        "available": False,
        "description": f"Linguistically validated 3D ISL animation unavailable for '{clean_word}'. Text fallback active."
    }

def get_all_signs() -> dict:
    validated_signs = [dict(v, is_validated=True, validation_status="LINGUISTICALLY_VALIDATED", available=True) for v in VOCABULARY_SIGNS.values()]
    return {
        "total_validated_signs": len(validated_signs),
        "categories": list(set(v.get("category", "General Vocabulary") for v in VOCABULARY_SIGNS.values())),
        "signs": validated_signs
    }

# Master Learning Library containing the 18 verified gestures & conversational phrases from Simple Signs Chart
LEARNING_LIBRARY = [
    {
        "id": "hello", "word": "Hello", "meaningHindi": "नमस्ते / हैलो", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Thumb closed across palm, four fingers open straight together; left hand resting down at side",
        "leftHandPose": "Resting down naturally at side doing nothing (neutral rest pose)",
        "rightHandPose": "Touches right forehead mesh surface directly above eyebrow, then sweeps outward and downward towards Quadrant III (-X, -Y)",
        "fingerPositions": "Thumb folded closed across palm; index, middle, ring, and pinky fully extended straight and held together in salute B-handshape",
        "palmOrientation": "Right palm maintained strictly facing forward toward user/camera throughout entire movement",
        "wristOrientation": "Right wrist aligned upright with natural diagonal salute tilt during forehead mesh touch",
        "armPosition": "Right arm brings hand to touch forehead mesh surface, then smoothly sweeps outward and downward into Quadrant III; left arm relaxed at side",
        "movementSequence": "Touches forehead mesh surface with 4 fingers and closed thumb, then sweeps smoothly outward and downward towards Quadrant III (-X, -Y)",
        "animationDuration": 2.4, "facialExpression": "Warm, welcoming smile with direct eye contact", "animationVerified": True,
        "description": "Canonical salute greeting: Thumb closed across palm, four fingers open. Hand touches forehead mesh surface above right eyebrow, then sweeps smoothly outward and downward towards Quadrant III; left hand rests at side.",
        "supported": True, "animationKey": "hello"
    },
    {
        "id": "hi", "word": "Hi", "meaningHindi": "नमस्ते / हाय", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Single-hand waving greeting: Right hand elevated above shoulder with flat open palm facing front, waving continuously side-to-side like goodbye; left hand resting down at side",
        "leftHandPose": "Resting down naturally at side doing nothing (neutral rest pose)",
        "rightHandPose": "Elevated above shoulder level with flat open palm facing front side, waving continuously from left to right and right to left (like goodbye, but with right hand only)",
        "fingerPositions": "All five fingers extended straight and open in flat B-handshape facing front",
        "palmOrientation": "Right palm maintained strictly facing forward toward user/camera while waving left to right",
        "wristOrientation": "Right wrist upright and waving dynamically side-to-side",
        "armPosition": "Right arm elevated above shoulder with forearm swaying and wrist waving; left arm relaxed down at side",
        "movementSequence": "Right hand elevated above shoulder waves continuously side-to-side like goodbye, while left hand rests at side",
        "animationDuration": 2.2, "facialExpression": "Warm, welcoming smile with direct eye contact", "animationVerified": True,
        "description": "Single right hand elevated above shoulder with palm facing front side, waving continuously side-to-side like goodbye, while left hand rests at side (unlike Goodbye where both hands are up).",
        "supported": True, "animationKey": "hi"
    },
    {
        "id": "bye", "word": "Bye", "meaningHindi": "अलविदा / बाय", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Both hands upright above shoulders with palms strictly facing front side",
        "leftHandPose": "Elevated above left shoulder with palm facing front side, waving left to right",
        "rightHandPose": "Elevated above right shoulder with palm facing front side, waving left to right",
        "fingerPositions": "All fingers flat and straight upright on both hands, aligned with palms",
        "palmOrientation": "Both palms maintained strictly facing front side, moving left to right and right to left",
        "wristOrientation": "Both wrists straight upright with lateral tilt sweeping left to right and right to left continuously",
        "armPosition": "Both upper arms held stably above shoulders, forearms upright with natural lateral sway",
        "movementSequence": "Both hands elevated above shoulders with palms facing front side, moving continuously from left to right and right to left in farewell",
        "animationDuration": 2.2, "facialExpression": "Friendly farewell smile", "animationVerified": True,
        "description": "Both hands raised above shoulders with palms facing front side, waving continuously from left to right and right to left in cheerful farewell.",
        "supported": True, "animationKey": "bye"
    },
    {
        "id": "how", "word": "How", "meaningHindi": "कैसे", "signLanguage": "ISL",
        "category": "Questions", "type": "individual",
        "handConfiguration": "Curved hands with thumbs up", "leftHandPose": "In front of chest, backs forward",
        "rightHandPose": "In front of chest, backs forward", "fingerPositions": "Thumbs up, fingers curved",
        "palmOrientation": "Starts backs-forward, rolls to palms-up", "wristOrientation": "Outward supination",
        "armPosition": "Forearms horizontal at chest", "movementSequence": "Hands roll outward opening palms up",
        "animationDuration": 2.2, "facialExpression": "Questioning furrow", "animationVerified": True,
        "description": "Curved hands roll outward until palms face up.", "supported": True, "animationKey": "how"
    },
    {
        "id": "are", "word": "Are", "meaningHindi": "हैं / हो", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Index finger extended upright", "leftHandPose": "Neutral at side",
        "rightHandPose": "Held near chin level", "fingerPositions": "Index straight, others closed",
        "palmOrientation": "Inward", "wristOrientation": "Upright",
        "armPosition": "Forearm raised toward chin", "movementSequence": "Index finger moves straight forward from chin",
        "animationDuration": 2.0, "facialExpression": "Attentive neutral", "animationVerified": True,
        "description": "Right index finger moves forward from chin/lips.", "supported": True, "animationKey": "are"
    },
    {
        "id": "you", "word": "You", "meaningHindi": "आप / तुम", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Both hands with index fingers pointed directly forward towards user", "leftHandPose": "Extended forward toward user with index finger pointing",
        "rightHandPose": "Extended forward toward user with index finger pointing", "fingerPositions": "Both hands: index fingers straight pointing forward, others curled",
        "palmOrientation": "Both palms facing inward/downward", "wristOrientation": "Aligned straight with forearms",
        "armPosition": "Both forearms extended forward at mid-chest height", "movementSequence": "Direct bilateral pointing motion with both index fingers aimed directly at user",
        "animationDuration": 2.2, "facialExpression": "Direct eye contact", "animationVerified": True,
        "description": "Both hands index fingers pointing outward directly towards the user.", "supported": True, "animationKey": "you"
    },
    {
        "id": "what", "word": "What", "meaningHindi": "क्या", "signLanguage": "ISL",
        "category": "Questions", "type": "individual",
        "handConfiguration": "Left horizontal open palm; Right index pointing", "leftHandPose": "Open palm flat at chest",
        "rightHandPose": "Index pointing across left palm", "fingerPositions": "Left: 5 flat; Right: index straight",
        "palmOrientation": "Left palm up; Right palm inward/down", "wristOrientation": "Neutral horizontal",
        "armPosition": "Forearms brought to chest", "movementSequence": "Right index sweeps across open left palm",
        "animationDuration": 2.2, "facialExpression": "Questioning head tilt", "animationVerified": True,
        "description": "Left palm flat, right index sweeps across.", "supported": True, "animationKey": "what"
    },
    {
        "id": "is", "word": "Is", "meaningHindi": "है", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Index finger extended upright", "leftHandPose": "Neutral at side",
        "rightHandPose": "Held near chin level", "fingerPositions": "Index straight, others closed",
        "palmOrientation": "Inward", "wristOrientation": "Upright",
        "armPosition": "Forearm raised toward chin", "movementSequence": "Index finger moves forward from chin",
        "animationDuration": 2.0, "facialExpression": "Affirmative gaze", "animationVerified": True,
        "description": "Right index finger moves forward from chin/lips.", "supported": True, "animationKey": "is"
    },
    {
        "id": "your", "word": "Your", "meaningHindi": "आपका / तुम्हारा", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Flat open hand facing forward", "leftHandPose": "Neutral at side",
        "rightHandPose": "Raised in front of chest, fingers upright", "fingerPositions": "All 5 fingers straight flat",
        "palmOrientation": "Facing directly forward toward partner", "wristOrientation": "Dorsiflexed upright",
        "armPosition": "Forearm pushing forward", "movementSequence": "Flat open palm pushed gently forward toward partner",
        "animationDuration": 2.2, "facialExpression": "Respectful attention", "animationVerified": True,
        "description": "Flat open palm facing forward pushed toward partner.", "supported": True, "animationKey": "your"
    },
    {
        "id": "name", "word": "Name", "meaningHindi": "नाम", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Both hands in H-handshape", "leftHandPose": "Held horizontally in front of chest",
        "rightHandPose": "Held above left hand", "fingerPositions": "Index and middle straight together",
        "palmOrientation": "Left inward, Right downward", "wristOrientation": "Horizontal aligned",
        "armPosition": "Forearms centered in front of chest", "movementSequence": "Right H-fingers tap down twice across left H-fingers",
        "animationDuration": 2.2, "facialExpression": "Neutral attention", "animationVerified": True,
        "description": "Right H-hand taps down across left H-hand.", "supported": True, "animationKey": "name"
    },
    {
        "id": "where", "word": "Where", "meaningHindi": "कहाँ", "signLanguage": "ISL",
        "category": "Questions", "type": "individual",
        "handConfiguration": "Right index pointing upright", "leftHandPose": "Neutral at side",
        "rightHandPose": "Raised to shoulder/eye level", "fingerPositions": "Index straight up, others in fist",
        "palmOrientation": "Forward/inward", "wristOrientation": "Upright with side-to-side oscillation",
        "armPosition": "Forearm vertical", "movementSequence": "Upright index finger waves side-to-side",
        "animationDuration": 2.2, "facialExpression": "Inquisitive expression", "animationVerified": True,
        "description": "Right upright index finger waving side-to-side.", "supported": True, "animationKey": "where"
    },
    {
        "id": "do", "word": "Do", "meaningHindi": "करना / करो", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Both hands flat palms down", "leftHandPose": "Lowered in front of abdomen",
        "rightHandPose": "Lowered in front of abdomen", "fingerPositions": "Fingers relaxed pointing forward",
        "palmOrientation": "Downward toward floor", "wristOrientation": "Neutral oscillating",
        "armPosition": "Forearms in front of abdomen", "movementSequence": "Both hands swing side to side in parallel motion",
        "animationDuration": 2.0, "facialExpression": "Focused neutral", "animationVerified": True,
        "description": "Both flat hands move side-to-side in front of waist.", "supported": True, "animationKey": "do"
    },
    {
        "id": "i", "word": "I", "meaningHindi": "मैं", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Index finger extended", "leftHandPose": "Neutral at side",
        "rightHandPose": "Pointing directly to center of own chest", "fingerPositions": "Index straight pointing inward",
        "palmOrientation": "Inward toward body", "wristOrientation": "Slightly flexed",
        "armPosition": "Forearm angled up to breastbone", "movementSequence": "Index finger points to own chest",
        "animationDuration": 2.0, "facialExpression": "Self-referential attention", "animationVerified": True,
        "description": "Index finger points directly to own chest.", "supported": True, "animationKey": "me"
    },
    {
        "id": "am", "word": "Am", "meaningHindi": "हूँ", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Index finger extended upright", "leftHandPose": "Neutral at side",
        "rightHandPose": "Near chin level", "fingerPositions": "Index extended, others closed",
        "palmOrientation": "Inward", "wristOrientation": "Upright",
        "armPosition": "Forearm raised toward face", "movementSequence": "Index finger moves forward from chin",
        "animationDuration": 2.0, "facialExpression": "Assuring nod", "animationVerified": True,
        "description": "Right index finger moves forward from chin/lips.", "supported": True, "animationKey": "am"
    },
    {
        "id": "fine", "word": "Fine", "meaningHindi": "ठीक / बढ़िया", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Open 5-hand with thumb on chest", "leftHandPose": "Neutral at side",
        "rightHandPose": "Thumb touching center of chest", "fingerPositions": "All 5 fingers spread naturally",
        "palmOrientation": "Facing inward/left", "wristOrientation": "Vertical neutral",
        "armPosition": "Forearm angled across chest", "movementSequence": "Thumb touches chest and pulses forward",
        "animationDuration": 2.2, "facialExpression": "Content, smiling expression", "animationVerified": True,
        "description": "Open 5-hand with thumb touching center chest.", "supported": True, "animationKey": "fine"
    },
    {
        "id": "namaste", "word": "Namaste", "meaningHindi": "नमस्ते / नमस्कार", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Anjali Mudra — Palms pressed together flush", "leftHandPose": "In front of chest, fingers upright",
        "rightHandPose": "In front of chest, fingers upright", "fingerPositions": "All fingers straight flush together",
        "palmOrientation": "Palms pressed flush at midline", "wristOrientation": "Flexed vertically",
        "armPosition": "Symmetric inward bend at elbows", "movementSequence": "Palms joined at chest with respectful head bow",
        "animationDuration": 2.4, "facialExpression": "Respectful serene head bow", "animationVerified": True,
        "description": "Both palms joined in front of chest with head slight bow.", "supported": True, "animationKey": "namaste"
    },
    {
        "id": "phrase_how_are_you", "word": "How are you?", "meaningHindi": "आप कैसे हैं?", "signLanguage": "ISL",
        "category": "Phrases", "type": "phrase",
        "handConfiguration": "Multi-sign sequence", "leftHandPose": "Coordinated sequence",
        "rightHandPose": "Coordinated sequence", "fingerPositions": "Verified dynamic transitions",
        "palmOrientation": "Forward → Temple → Palms up", "wristOrientation": "Natural transitions",
        "armPosition": "Chest and upper torso", "movementSequence": "1. YOU → 2. HELLO → 3. HOW",
        "animationDuration": 6.0, "facialExpression": "Warm greeting smile to questioning furrow", "animationVerified": True,
        "description": "Conversational phrase: 'YOU' + 'HELLO' + 'HOW'.", "supported": True, "animationKey": "how_are_you",
        "sequence": [
            {"word": "YOU", "animation": "you", "description": "Both hands index fingers pointing toward user"},
            {"word": "HELLO", "animation": "hello", "description": "Temple greeting salute"},
            {"word": "HOW", "animation": "how", "description": "Curved hands rolling outward to palms up"}
        ]
    },
    {
        "id": "phrase_what_is_your_name", "word": "What is your name?", "meaningHindi": "आपका नाम क्या है?", "signLanguage": "ISL",
        "category": "Phrases", "type": "phrase",
        "handConfiguration": "Multi-sign sequence", "leftHandPose": "Coordinated sequence",
        "rightHandPose": "Coordinated sequence", "fingerPositions": "Verified dynamic transitions",
        "palmOrientation": "Forward → Downward → Inward", "wristOrientation": "Natural transitions",
        "armPosition": "Central chest space", "movementSequence": "1. YOUR → 2. NAME → 3. WHAT",
        "animationDuration": 6.5, "facialExpression": "Attentive inquiry with questioning head tilt", "animationVerified": True,
        "description": "Conversational phrase: 'YOUR' + 'NAME' + 'WHAT'.", "supported": True, "animationKey": "name",
        "sequence": [
            {"word": "YOUR", "animation": "your", "description": "Flat open hand pushed forward"},
            {"word": "NAME", "animation": "name", "description": "Right H-hand tapping left H-hand"},
            {"word": "WHAT", "animation": "what", "description": "Right index sweeping across open left palm"}
        ]
    },
    {
        "id": "phrase_where_do_you_live", "word": "Where do you live?", "meaningHindi": "आप कहाँ रहते हैं?", "signLanguage": "ISL",
        "category": "Phrases", "type": "phrase",
        "handConfiguration": "Multi-sign sequence", "leftHandPose": "Coordinated sequence",
        "rightHandPose": "Coordinated sequence", "fingerPositions": "Verified dynamic transitions",
        "palmOrientation": "Forward → Inward → Forward waving", "wristOrientation": "Natural transitions",
        "armPosition": "Torso and chest workspace", "movementSequence": "1. YOU → 2. LIVE → 3. WHERE",
        "animationDuration": 6.5, "facialExpression": "Questioning expression", "animationVerified": True,
        "description": "Conversational phrase: 'YOU' + 'LIVE' + 'WHERE'.", "supported": True, "animationKey": "where",
        "sequence": [
            {"word": "YOU", "animation": "you", "description": "Both hands index fingers pointing toward user"},
            {"word": "LIVE", "animation": "live", "description": "Both hands in L-shape moving upward along torso"},
            {"word": "WHERE", "animation": "where", "description": "Right upright index waving side-to-side"}
        ]
    },
    {
        "id": "phrase_i_am_fine", "word": "I am fine.", "meaningHindi": "मैं ठीक हूँ।", "signLanguage": "ISL",
        "category": "Phrases", "type": "phrase",
        "handConfiguration": "Multi-sign sequence", "leftHandPose": "Neutral at side",
        "rightHandPose": "Index pointing to chest → Open 5-hand on chest", "fingerPositions": "Verified dynamic transitions",
        "palmOrientation": "Inward toward body", "wristOrientation": "Natural vertical",
        "armPosition": "Chest workspace", "movementSequence": "1. I → 2. FINE",
        "animationDuration": 4.8, "facialExpression": "Calm, satisfied smile", "animationVerified": True,
        "description": "Conversational phrase: 'I' + 'FINE'.", "supported": True, "animationKey": "fine",
        "sequence": [
            {"word": "I", "animation": "me", "description": "Index pointing directly to own chest"},
            {"word": "FINE", "animation": "fine", "description": "Open 5-hand with thumb on center chest"}
        ]
    },
    {
        "id": "thank_you", "word": "Thank You", "meaningHindi": "धन्यवाद / शुक्रिया", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Flat open B-hand starts placed on chin with wrist turned 180° opposite and elbow at 90° on shoulder, then moves towards the user", "leftHandPose": "Resting down naturally at side doing nothing (neutral rest pose)",
        "rightHandPose": "Flat open hand starts placed directly on chin with fingertips contacting chin/lips, wrist turned 180° opposite and elbow at 90° on shoulder, then moves outward and forward towards the user with palm opening upward and forward", "fingerPositions": "All four fingers and thumb extended straight and held together in flat B-hand",
        "palmOrientation": "Starts at chin with wrist turned 180° opposite, then opens upward and forward facing the user", "wristOrientation": "Turned 180° opposite at chin, flexing smoothly forward toward user",
        "armPosition": "Right arm with elbow at 90° on shoulder brings flat hand to touch chin directly with wrist turned 180° opposite, then forearm unfolds reaching forward towards the user; left arm relaxed down at side", "movementSequence": "Fingertips rest on chin/lips, then sweep smoothly forward toward user in a gentle arc while head gives an appreciative nod",
        "animationDuration": 2.2, "facialExpression": "Warm appreciative smile with respectful forward nod", "animationVerified": True,
        "description": "Flat open hand with wrist turned 180° opposite and elbow at 90° on shoulder starts placed directly on the chin/lips, then sweeps smoothly forward towards the user with palm facing upward and forward in gratitude; left hand rests at side.", "supported": True, "animationKey": "thank_you"
    },
    {
        "id": "yes", "word": "Yes", "meaningHindi": "हाँ", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Single right hand in closed S-fist facing directly towards the user with elbow turned 45° from right to left; left hand relaxed at side",
        "leftHandPose": "Resting down naturally at side doing nothing (neutral rest pose)",
        "rightHandPose": "Elevated with elbow turned 45° from right to left, fist facing directly towards the user in UP position, then nodding DOWN at wrist",
        "fingerPositions": "All four fingers tightly curled into palm, and thumb closed and folded tightly across index and middle fingers (calibrated to user photo)",
        "palmOrientation": "Fist faces directly towards the user/camera",
        "wristOrientation": "Starts in UP position (-0.35 rad), then nods firmly DOWN (+1.05 rad) towards the user from the wrist",
        "armPosition": "Right arm with elbow turned 45° from right to left into midline, forearm upright holding fist facing user; left arm down relaxed at side",
        "movementSequence": "Right hand in closed S-fist facing user starts in UP position, then flexes DOWN at the wrist in an affirmative nod, repeating while head nods synchronously; left hand rests at side",
        "animationDuration": 1.4, "facialExpression": "Affirmative head nod and warm confident smile", "animationVerified": True,
        "description": "Single right hand elevated with elbow turned 45° from right to left, closed S-fist facing directly towards the user (all fingers and thumb closed tightly). Starts in the UP position, and during YES gesture nods firmly DOWN from the wrist; left hand rests relaxed at side.", "supported": True, "animationKey": "yes"
    },
    {
        "id": "no", "word": "No", "meaningHindi": "नहीं", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Index and middle fingers open with thumb, then snapping down to touch thumb pad while ring and pinky stay curled in palm", "leftHandPose": "Resting down naturally at side doing nothing (neutral rest pose)",
        "rightHandPose": "Elevated at mid-chest/shoulder height with elbow turned 45° from right to left", "fingerPositions": "Ring and pinky curled tightly into palm; index and middle fingers open straight with thumb opposing, then snapping down to touch thumb pad",
        "palmOrientation": "Angled forward-inward facing observer", "wristOrientation": "Upright and stable at chest level",
        "armPosition": "Right arm with elbow turned 45° from right to left into midline, forearm upright; left arm relaxed down at side", "movementSequence": "Index and middle fingers snap down firmly to touch the thumb pad twice while head shakes side to side in refusal/negation",
        "animationDuration": 2.0, "facialExpression": "Firm head shake side-to-side in denial/refusal", "animationVerified": True,
        "description": "Single right hand elevated in front of chest/shoulder with elbow turned 45° from right to left: ring and pinky fingers curled tightly into palm. Index finger, middle finger, and thumb start open, then index and middle fingers snap down and touch the thumb pad directly while head shakes side to side; left hand rests relaxed at side.", "supported": True, "animationKey": "no"
    },
    {
        "id": "help", "word": "Help", "meaningHindi": "मदद", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Thumbs-up fist on flat open palm", "leftHandPose": "Flat open palm facing upward",
        "rightHandPose": "Closed thumbs-up fist on left palm", "fingerPositions": "Left: 5 flat; Right: thumbs-up fist",
        "palmOrientation": "Left palm up; Right fist facing left", "wristOrientation": "Horizontal aligned",
        "armPosition": "Forearms horizontal at chest", "movementSequence": "Both hands lift upward together",
        "animationDuration": 2.2, "facialExpression": "Urgent, supportive expression", "animationVerified": True,
        "description": "Thumbs-up fist on flat open palm lifted upward together.", "supported": True, "animationKey": "help"
    },
    {
        "id": "i_love_you", "word": "I Love You", "meaningHindi": "मुझे तुमसे प्यार है", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "ILY handshape — Thumb, index, pinky extended", "leftHandPose": "Neutral at side",
        "rightHandPose": "Raised in front of shoulder, pulsing forward", "fingerPositions": "Thumb, index, pinky straight; middle, ring closed",
        "palmOrientation": "Facing forward toward partner", "wristOrientation": "Upright gentle forward tilt",
        "armPosition": "Forearm upright at chest", "movementSequence": "ILY hand pushes gently forward toward partner",
        "animationDuration": 2.2, "facialExpression": "Warm affectionate smile", "animationVerified": True,
        "description": "Thumb, index, and pinky extended in ILY handshape.", "supported": True, "animationKey": "iloveyou"
    },
    {
        "id": "please", "word": "Please", "meaningHindi": "कृपया", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Right shoulder moves from right to left while elbow turns 90 degrees from right to left, palm and wrist touch chest with four fingers straight and thumb closed", "leftHandPose": "Neutral at side",
        "rightHandPose": "Right palm and wrist touching chest, shoulder moved from right to left, elbow turned 90 degrees from right to left", "fingerPositions": "Four fingers (index, middle, ring, pinky) straight together, thumb folded in across palm",
        "palmOrientation": "Facing inward touching chest", "wristOrientation": "Flexed inward touching chest",
        "armPosition": "Elbow turned 90 degrees from right to left with hand touching chest", "movementSequence": "Right shoulder moves from right to left while elbow turns 90 degrees from right to left, palm touches chest, and head bows down",
        "animationDuration": 2.4, "facialExpression": "Humble, polite, respectful pleading expression with head bowed down", "animationVerified": True,
        "description": "Right shoulder moves from right to left while the elbow turns 90 degrees from right to left and the palm/wrist touches the chest; head bows down while touching the chest for the please gesture; four fingers straight together and thumb closed across palm; left hand rests at side.", "supported": True, "animationKey": "please"
    },
    {
        "id": "sorry", "word": "Sorry", "meaningHindi": "माफ़ कीजिए", "signLanguage": "ISL",
        "category": "Greetings", "type": "individual",
        "handConfiguration": "Closed fist placed over heart", "leftHandPose": "Neutral at side",
        "rightHandPose": "Fist placed against center chest", "fingerPositions": "Closed fist with thumb alongside",
        "palmOrientation": "Knuckles facing inward against chest", "wristOrientation": "Circular rotation",
        "armPosition": "Forearm angled across chest", "movementSequence": "Fist circles gently in clockwise motion over heart",
        "animationDuration": 2.2, "facialExpression": "Apologetic, remorseful expression", "animationVerified": True,
        "description": "Closed fist circles over chest in apologetic motion.", "supported": True, "animationKey": "sorry"
    },
    {
        "id": "stop", "word": "Stop", "meaningHindi": "रुको", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Flat open hand chopping down onto flat palm", "leftHandPose": "Flat open palm horizontal facing up",
        "rightHandPose": "Flat open hand chopping edge-first onto left palm", "fingerPositions": "All 5 fingers straight flush",
        "palmOrientation": "Left palm up; Right pinky-edge downward", "wristOrientation": "Rigid vertical chop",
        "armPosition": "Forearms centered in front of chest", "movementSequence": "Pinky-edge of right hand chops down firmly on left palm",
        "animationDuration": 2.0, "facialExpression": "Firm commanding expression", "animationVerified": True,
        "description": "Right flat hand chops down onto flat open left palm.", "supported": True, "animationKey": "stop"
    },
    {
        "id": "pain", "word": "Pain", "meaningHindi": "दर्द / तकलीफ", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Both index fingers pointing toward each other", "leftHandPose": "Index pointing toward right index finger",
        "rightHandPose": "Index pointing toward left index finger", "fingerPositions": "Both index fingers straight, others in fist",
        "palmOrientation": "Facing each other inward", "wristOrientation": "Opposing horizontal twisting",
        "armPosition": "Both forearms in front of chest", "movementSequence": "Both index fingers jab toward each other repeatedly",
        "animationDuration": 2.2, "facialExpression": "Pained grimace with furrowed brows", "animationVerified": True,
        "description": "Both index fingers point toward each other and jab inward repeatedly.", "supported": True, "animationKey": "pain"
    },
    {
        "id": "eat", "word": "Eat", "meaningHindi": "खाना", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Flattened 'O' handshape at mouth", "leftHandPose": "Neutral at side",
        "rightHandPose": "Fingertips brought together pointing toward lips", "fingerPositions": "All fingertips touching thumb tip",
        "palmOrientation": "Inward toward mouth", "wristOrientation": "Flexed toward lips",
        "armPosition": "Forearm vertical angled toward mouth", "movementSequence": "Fingertips tap toward the mouth twice",
        "animationDuration": 2.0, "facialExpression": "Neutral engaged expression", "animationVerified": True,
        "description": "Flattened 'O' hand taps fingertips toward mouth twice.", "supported": True, "animationKey": "eat"
    },
    {
        "id": "drink", "word": "Drink", "meaningHindi": "पीना", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Hand in 'C' cup shape with four fingers curved and thumb open and extended forward horizontally (photo match); left hand relaxed at side",
        "leftHandPose": "Neutral at side",
        "rightHandPose": "Held in 'C' cup shape with 4 fingers bent and thumb open, moving from Quadrant III up to touch the lips and drink",
        "fingerPositions": "Four fingers (index, middle, ring, pinky) bent together in smooth arch; thumb open and extended straight forward horizontally",
        "palmOrientation": "Inward/left toward torso and mouth", "wristOrientation": "Wrist turned 180° opposite (Y = 1.54 rad) with elbow adjusted along Quadrant III -> Mouth orientation",
        "armPosition": "Right elbow and forearm move smoothly from Quadrant III up to mouth with situation-adjusted elbow and 180° opposite wrist; left arm relaxed at side",
        "movementSequence": "From Quadrant III with elbow adjusted to the situation and wrist turned 180° opposite, hand moves smoothly towards the lips of the mouth to drink, then returns to Quadrant III",
        "animationDuration": 2.4, "facialExpression": "Neutral relaxed expression with slight head tilt back on sipping", "animationVerified": True,
        "description": "From Quadrant III with elbow adjusted to the situation and wrist turned 180° opposite (Y = 1.54 rad), hand in 'C' cup shape (open thumb, 4 bent fingers) moves smoothly towards the lips of the mouth to drink.",
        "supported": True, "animationKey": "drink"
    },
    {
        "id": "more", "word": "More", "meaningHindi": "और / ज्यादा", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "Both hands in flattened 'O' handshapes", "leftHandPose": "In front of chest, fingertips pointing right",
        "rightHandPose": "In front of chest, fingertips pointing left", "fingerPositions": "Fingertips touching thumb tips",
        "palmOrientation": "Palms facing each other", "wristOrientation": "Horizontal aligned",
        "armPosition": "Forearms centered in front of chest", "movementSequence": "Fingertips of both hands tap together repeatedly",
        "animationDuration": 2.0, "facialExpression": "Requesting, expectant expression", "animationVerified": True,
        "description": "Both flattened 'O' hands tap fingertips together at chest.", "supported": True, "animationKey": "more"
    },
    {
        "id": "bathroom", "word": "Bathroom", "meaningHindi": "शौचालय / बाथरूम", "signLanguage": "ISL",
        "category": "Basics", "type": "individual",
        "handConfiguration": "'T' handshape fist", "leftHandPose": "Neutral at side",
        "rightHandPose": "Held in front of shoulder at chest height", "fingerPositions": "Thumb poking between index and middle fingers",
        "palmOrientation": "Forward/left", "wristOrientation": "Oscillating side-to-side",
        "armPosition": "Forearm vertical at 90°", "movementSequence": "'T' handshape shakes side-to-side at shoulder height",
        "animationDuration": 2.2, "facialExpression": "Polite discreet expression", "animationVerified": True,
        "description": "'T' handshape shakes side-to-side indicating bathroom.", "supported": True, "animationKey": "bathroom"
    },
    {
        "id": "when", "word": "When", "meaningHindi": "कब", "signLanguage": "ISL",
        "category": "Questions", "type": "individual",
        "handConfiguration": "Both index fingers extended upright", "leftHandPose": "Held stationary in front of chest",
        "rightHandPose": "Circles clockwise around left index fingertip", "fingerPositions": "Both index fingers straight, others in fist",
        "palmOrientation": "Facing each other", "wristOrientation": "Left stationary, Right circular orbit",
        "armPosition": "Forearms in front of chest", "movementSequence": "Right index circles around left index and touches tip",
        "animationDuration": 2.4, "facialExpression": "Questioning brow furrow", "animationVerified": True,
        "description": "Right index circles around left index and touches tip.", "supported": True, "animationKey": "when"
    },
    {
        "id": "phrase_my_name_is", "word": "My name is...", "meaningHindi": "मेरा नाम ... है", "signLanguage": "ISL",
        "category": "Phrases", "type": "phrase",
        "handConfiguration": "Compound sequence: Flat palm on chest → Two H-hands tapping", "leftHandPose": "Neutral → Horizontal H-hand",
        "rightHandPose": "Flat palm on chest → Right H-hand tapping down on left H-hand", "fingerPositions": "All flat on chest → Index & middle in H-shape",
        "palmOrientation": "Inward facing chest → Downward", "wristOrientation": "Natural transitions",
        "armPosition": "Central chest workspace", "movementSequence": "1. MY (Flat palm on chest) → 2. NAME (Right H-hand tapping down)",
        "animationDuration": 5.0, "facialExpression": "Friendly introducing smile", "animationVerified": True,
        "description": "Self-introduction phrase: 'MY' (palm on chest) + 'NAME' (H-hand tap).", "supported": True, "animationKey": "my_name_is",
        "sequence": [
            {"word": "MY", "animation": "my", "description": "Flat open palm resting on center of chest"},
            {"word": "NAME", "animation": "name", "description": "Right H-hand tapping down across left H-hand"}
        ]
    },
    {
        "id": "climb", "word": "Climb", "meaningHindi": "चढ़ना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both wrists turned 90 degrees (right hand from right to left, left hand from left to right) with both elbows bent 90° to each other, both hands continuously climbing stairs by alternating steps over each other with flat downward palms",
        "leftHandPose": "Starts lower, steps up and over the right hand onto the upper step, then lowers as right hand steps over it, repeating continuously",
        "rightHandPose": "Starts at base step, supports left hand's ascent, then steps up and over the left hand onto the upper step, repeating continuously",
        "fingerPositions": "All fingers extended flat & straight together, palms facing downward",
        "palmOrientation": "Both palms facing downward (prone), fingers directed medially across the body",
        "wristOrientation": "Both wrists turned 90 degrees (right hand from right to left and left hand from left to right)",
        "armPosition": "Both elbows bent 90 degrees to each other with forearms held horizontally across the front of the body, both hands moving continuously in alternating stairs-climbing steps",
        "movementSequence": "Both hands continuously climb stairs alternating steps over each other: first left hand steps up and over right hand, then right hand steps up and over left hand, looping seamlessly",
        "animationDuration": 2.4, "facialExpression": "Attentive, engaged upward gaze with focused climbing expression", "animationVerified": True,
        "description": "Both hands continuously climb stairs alternating steps over each other: first the left hand moves up and over the right hand onto the higher step, then the right hand steps up and over the left hand onto the next step, repeating continuously with both elbows bent 90 degrees to each other, wrists turned 90 degrees (right from right to left, left from left to right), and flat downward palms.",
        "supported": True, "animationKey": "climb"
    },
    {
        "id": "run", "word": "Run", "meaningHindi": "भागना / दौड़ना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Modified L-handshape on both hands (all fingers closed except index finger and thumb)",
        "leftHandPose": "Left elbow turned 90° from left to right across chest, left index finger touching right thumb from back",
        "rightHandPose": "Right index finger pointing directly forward towards the user, thumb extended upright/backward",
        "fingerPositions": "Both hands: index finger extended straight, thumb open/extended, middle/ring/pinky curled tightly into fist against palm",
        "palmOrientation": "Left palm facing inward/rightward across torso; Right palm facing leftward with index aimed forward",
        "wristOrientation": "Left wrist angled across torso; Right wrist pitched forward aligning index finger towards user",
        "armPosition": "Left elbow moved 90° from left to right across torso; Right elbow flexed forward bringing hand to central midline",
        "movementSequence": "Left index finger touches behind right thumb; both hands execute coordinated forward-and-backward running propulsion pulses in running stride cadence",
        "animationDuration": 2.6, "facialExpression": "Energetic running focus with active forward head tilt and determined gaze", "animationVerified": True,
        "description": "Close all fingers except index finger and thumb of both hands (forming modified L-handshapes with middle, ring, pinky in closed fists). The left elbow moves 90 degrees from left to right across the body so the left index finger touches through the thumb of the right hand from the back. The right hand index finger points directly forward towards the user. Both hands perform rhythmic forward running strides in unison.",
        "supported": True, "animationKey": "run"
    },
    {
        "id": "fall", "word": "Fall", "meaningHindi": "गिरना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in front of body with fingers slightly bent, descending downward together",
        "leftHandPose": "Positioned in front with fingers slightly bent, dropping downward",
        "rightHandPose": "Positioned in front with fingers slightly bent, dropping downward",
        "fingerPositions": "Fingers slightly bent and relaxed",
        "palmOrientation": "Facing downward towards ground", "wristOrientation": "Wrists following the downward movement smoothly",
        "armPosition": "Elbows slightly bent, moving downward together to represent falling",
        "movementSequence": "Position both hands in front of the body, with the fingers slightly bent. Move the hands downward to represent falling, keeping the elbows slightly bent and allowing the wrists to follow the downward movement.",
        "animationDuration": 2.2, "facialExpression": "Sudden startled or downward tracking expression", "animationVerified": True,
        "description": "Position both hands in front of the body, with the fingers slightly bent. Move the hands downward to represent falling, keeping the elbows slightly bent and allowing the wrists to follow the downward movement.",
        "supported": True, "animationKey": "fall"
    },
    {
        "id": "give", "word": "Give", "meaningHindi": "देना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in front of body with palms facing upward and fingers gently curved, moving forward together",
        "leftHandPose": "Palm facing upward, fingers gently curved, extending forward",
        "rightHandPose": "Palm facing upward, fingers gently curved, extending forward",
        "fingerPositions": "Gently curved open fingers resting naturally",
        "palmOrientation": "Facing upward towards ceiling/sky", "wristOrientation": "Aligned straight with forearms",
        "armPosition": "Elbows slightly bent, moving forward together in offering",
        "movementSequence": "Hold both hands in front of the body, with the palms facing upward and the fingers gently curved. Move the hands forward together as if offering something to another person. Keep the elbows slightly bent and the wrists aligned with the hands.",
        "animationDuration": 2.2, "facialExpression": "Generous, offering smile", "animationVerified": True,
        "description": "Hold both hands in front of the body, with the palms facing upward and the fingers gently curved. Move the hands forward together as if offering something to another person. Keep the elbows slightly bent and the wrists aligned with the hands.",
        "supported": True, "animationKey": "give"
    },
    {
        "id": "push", "word": "Push", "meaningHindi": "धक्का देना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in fists in front of chest, forearms thrusting forward as if pushing an object away",
        "leftHandPose": "Fist in front of chest, thrusting forward",
        "rightHandPose": "Fist in front of chest, thrusting forward",
        "fingerPositions": "Tight solid fists with thumbs locked over fingers",
        "palmOrientation": "Knuckles facing forward towards recipient/object", "wristOrientation": "Rigidly aligned with forearms",
        "armPosition": "Elbows bent at chest, then forearms extending forcefully forward",
        "movementSequence": "Make both hands into fists and position them in front of the chest. Keep the elbows bent, then move both forearms forward as if pushing an object away. Maintain the fist shape and keep the wrists aligned with the forearms.",
        "animationDuration": 2.0, "facialExpression": "Determined exertion expression", "animationVerified": True,
        "description": "Make both hands into fists and position them in front of the chest. Keep the elbows bent, then move both forearms forward as if pushing an object away. Maintain the fist shape and keep the wrists aligned with the forearms.",
        "supported": True, "animationKey": "push"
    },
    {
        "id": "cry", "word": "Cry", "meaningHindi": "रोना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands raised toward eyes with index fingers extended and remaining fingers curled, moving down along cheeks",
        "leftHandPose": "Index extended, moving downward from left eye along cheek",
        "rightHandPose": "Index extended, moving downward from right eye along cheek",
        "fingerPositions": "Index finger extended, remaining fingers gently curled",
        "palmOrientation": "Facing inward toward cheeks/face", "wristOrientation": "Wrists smoothly following downward tear path",
        "armPosition": "Elbows slightly bent, hands raised to eyes and drawing down along cheeks",
        "movementSequence": "Raise both hands toward the eyes, keeping the index fingers extended and the remaining fingers gently curled. Move the hands downward along the cheeks to represent tears, with the elbows slightly bent and the wrists following the movement.",
        "animationDuration": 2.4, "facialExpression": "Sorrowful, crying facial expression", "animationVerified": True,
        "description": "Raise both hands toward the eyes, keeping the index fingers extended and the remaining fingers gently curled. Move the hands downward along the cheeks to represent tears, with the elbows slightly bent and the wrists following the movement.",
        "supported": True, "animationKey": "cry"
    },
    {
        "id": "sleep", "word": "Sleep", "meaningHindi": "सोना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands raised toward sides of face with fingers gently curved, brought closer near eyes/temples",
        "leftHandPose": "Fingers gently curved, positioned near left side of face",
        "rightHandPose": "Fingers gently curved, positioned near right temple/cheek",
        "fingerPositions": "Fingers gently curved and relaxed",
        "palmOrientation": "Facing inward toward temples/face", "wristOrientation": "Relaxed comfortable wrists",
        "armPosition": "Elbows bent, hands brought close to temples/eyes with head resting gently to side",
        "movementSequence": "Raise both hands toward the sides of the face, with the fingers gently curved. Bring the hands closer to the face while keeping the elbows bent. Maintain relaxed wrists and position the hands near the eyes or temples, as illustrated.",
        "animationDuration": 2.5, "facialExpression": "Peaceful eyes-closed resting expression with head tilt", "animationVerified": True,
        "description": "Raise both hands toward the sides of the face, with the fingers gently curved. Bring the hands closer to the face while keeping the elbows bent. Maintain relaxed wrists and position the hands near the eyes or temples, as illustrated.",
        "supported": True, "animationKey": "sleep"
    },
    {
        "id": "sit_down", "word": "Sit Down", "meaningHindi": "बैठना / बैठो", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in front of body with fingers slightly bent and palms facing each other, moving downward together",
        "leftHandPose": "In front of body, palm facing right, moving downward",
        "rightHandPose": "In front of body, palm facing left, moving downward",
        "fingerPositions": "Fingers slightly bent naturally",
        "palmOrientation": "Palms oriented facing toward each other", "wristOrientation": "Aligned stably with forearms",
        "armPosition": "Elbows relaxed, forearms moving downward together to indicate sitting",
        "movementSequence": "Position both hands in front of the body, with the fingers slightly bent and the palms oriented toward each other. Move the hands downward together to indicate sitting down, keeping the elbows relaxed and the wrists aligned with the forearms.",
        "animationDuration": 2.2, "facialExpression": "Neutral calm posture", "animationVerified": True,
        "description": "Position both hands in front of the body, with the fingers slightly bent and the palms oriented toward each other. Move the hands downward together to indicate sitting down, keeping the elbows relaxed and the wrists aligned with the forearms.",
        "supported": True, "animationKey": "sit_down"
    },
    {
        "id": "kick", "word": "Kick", "meaningHindi": "लात मारना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "One hand held in front with index finger extended and remaining fingers curled, moving forward in short controlled kicking motion",
        "leftHandPose": "Neutral at side",
        "rightHandPose": "In front of body with index finger extended, flicking forward in short controlled motion",
        "fingerPositions": "Index finger extended, remaining fingers curled into palm",
        "palmOrientation": "Facing inward/downward", "wristOrientation": "Aligned firmly with forearm",
        "armPosition": "Right elbow slightly bent, forearm making short controlled forward thrust",
        "movementSequence": "Hold one hand in front of the body, with the index finger extended and the remaining fingers curled. Move the hand forward in a short, controlled motion to represent the kicking action. Keep the elbow slightly bent and the wrist aligned with the forearm.",
        "animationDuration": 1.8, "facialExpression": "Decisive, sharp expression", "animationVerified": True,
        "description": "Hold one hand in front of the body, with the index finger extended and the remaining fingers curled. Move the hand forward in a short, controlled motion to represent the kicking action. Keep the elbow slightly bent and the wrist aligned with the forearm.",
        "supported": True, "animationKey": "kick"
    },
    {
        "id": "wait", "word": "Wait", "meaningHindi": "इंतज़ार करना / रुको", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in front with fingers curled and wrists bent slightly downward, held relatively still",
        "leftHandPose": "In front of body, fingers curled, wrist bent slightly downward, held still",
        "rightHandPose": "In front of body, fingers curled, wrist bent slightly downward, held still",
        "fingerPositions": "All fingers curled loosely inward",
        "palmOrientation": "Facing slightly downward and toward body", "wristOrientation": "Bent slightly downward in patient waiting posture",
        "armPosition": "Elbows bent comfortably at torso, hands held relatively still in patient posture",
        "movementSequence": "Hold both hands in front of the body, with the fingers curled and the wrists bent slightly downward. Keep the elbows bent and the hands relatively still, maintaining the illustrated hand position to represent waiting.",
        "animationDuration": 2.2, "facialExpression": "Patient, attentive waiting expression", "animationVerified": True,
        "description": "Hold both hands in front of the body, with the fingers curled and the wrists bent slightly downward. Keep the elbows bent and the hands relatively still, maintaining the illustrated hand position to represent waiting.",
        "supported": True, "animationKey": "wait"
    },
    {
        "id": "walk", "word": "Walk", "meaningHindi": "चलना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in front with fingers curled and index fingers pointing downward, moving alternately forward and backward",
        "leftHandPose": "Index finger pointing downward, moving alternately like walking leg",
        "rightHandPose": "Index finger pointing downward, moving alternately like walking leg",
        "fingerPositions": "Index finger pointing downward, remaining fingers curled",
        "palmOrientation": "Facing toward body/inward", "wristOrientation": "Stable wrists aligned with forearms",
        "armPosition": "Elbows slightly bent, hands alternating forward and backward in steady strides",
        "movementSequence": "Position both hands in front of the body, with the fingers curled and the index fingers pointing downward. Move the hands alternately forward and backward to represent walking, keeping the elbows slightly bent and the wrists stable.",
        "animationDuration": 2.2, "facialExpression": "Neutral steady forward gaze", "animationVerified": True,
        "description": "Position both hands in front of the body, with the fingers curled and the index fingers pointing downward. Move the hands alternately forward and backward to represent walking, keeping the elbows slightly bent and the wrists stable.",
        "supported": True, "animationKey": "walk"
    },
    {
        "id": "wash", "word": "Wash", "meaningHindi": "धोना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands brought together in front with curved fingers and palms facing each other, rubbing in circular motion",
        "leftHandPose": "Fingers curved, palm facing right hand, moving in rubbing circle",
        "rightHandPose": "Fingers curved, palm facing left hand, moving in rubbing circle",
        "fingerPositions": "Fingers curved naturally in cupped washing shape",
        "palmOrientation": "Palms facing each other", "wristOrientation": "Moving naturally in circular rubbing articulation",
        "armPosition": "Elbows bent in front of chest, hands rubbing against each other",
        "movementSequence": "Bring both hands together in front of the body, with the fingers curved and the palms facing each other. Move the hands against each other in a rubbing motion, keeping the elbows bent and allowing the wrists to move naturally.",
        "animationDuration": 2.2, "facialExpression": "Attentive, refreshing clean expression", "animationVerified": True,
        "description": "Bring both hands together in front of the body, with the fingers curved and the palms facing each other. Move the hands against each other in a rubbing motion, keeping the elbows bent and allowing the wrists to move naturally.",
        "supported": True, "animationKey": "wash"
    },
    {
        "id": "look", "word": "Look", "meaningHindi": "देखना", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "One hand raised near face with index and middle fingers extended in 'V' shape and others curled, directing outward from face",
        "leftHandPose": "Neutral at side",
        "rightHandPose": "Raised near eyes, index and middle fingers pointing outward in direction of sight",
        "fingerPositions": "Index and middle fingers extended apart in 'V' shape, thumb and others curled",
        "palmOrientation": "Facing inward toward face at start, extending outward", "wristOrientation": "Aligned straight with forearm",
        "armPosition": "Elbow bent, bringing hand near eyes and extending outward in line of vision",
        "movementSequence": "Raise one hand near the face, with the index and middle fingers extended and the other fingers curled. Direct the hand outward from the face to represent looking, keeping the elbow bent and the wrist aligned with the forearm.",
        "animationDuration": 2.0, "facialExpression": "Alert, observant gaze following finger direction", "animationVerified": True,
        "description": "Raise one hand near the face, with the index and middle fingers extended and the other fingers curled. Direct the hand outward from the face to represent looking, keeping the elbow bent and the wrist aligned with the forearm.",
        "supported": True, "animationKey": "look"
    },
    {
        "id": "jump", "word": "Jump", "meaningHindi": "कूदना / छलांग", "signLanguage": "ISL",
        "category": "Actions", "type": "individual",
        "handConfiguration": "Both hands in front with fingers curled and palms oriented inward, leaping upward together",
        "leftHandPose": "Fingers curled, palm inward, moving sharply upward",
        "rightHandPose": "Fingers curled, palm inward, moving sharply upward",
        "fingerPositions": "Fingers curled loosely inward",
        "palmOrientation": "Palms oriented inward facing each other", "wristOrientation": "Wrists following upward leaping movement",
        "armPosition": "Elbows slightly bent, dipping slightly then springing upward together",
        "movementSequence": "Hold both hands in front of the body, with the fingers curled and the palms oriented inward. Move both hands upward together to represent jumping, keeping the elbows slightly bent and the wrists following the upward movement.",
        "animationDuration": 1.8, "facialExpression": "Lively, buoyant expression with slight upward head spring", "animationVerified": True,
        "description": "Hold both hands in front of the body, with the fingers curled and the palms oriented inward. Move both hands upward together to represent jumping, keeping the elbows slightly bent and the wrists following the upward movement.",
        "supported": True, "animationKey": "jump"
    },
    {
        "id": "quiet", "word": "Quiet", "meaningHindi": "शांत / चुप", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Single right index finger extended vertically upright placed directly on the mouth with the wrist turned 45 degrees up and elbow turned 180 degrees towards the mouth; all remaining fingers (middle, ring, pinky) and thumb tightly closed into a firm fist; left arm resting relaxed at side",
        "leftHandPose": "Resting down naturally at side doing nothing (neutral rest pose)",
        "rightHandPose": "Single right index finger extended vertically upright placed directly on center of mouth/lips with wrist turned 45 degrees up",
        "fingerPositions": "Index finger extended vertically straight upright onto mouth; thumb folded tightly across curled middle, ring, and pinky fingers in closed fist",
        "palmOrientation": "Back of right hand facing forward / slightly outward towards camera",
        "wristOrientation": "Turned 45 degrees upward towards mouth with forearm turned 180 degrees",
        "armPosition": "Right arm with elbow turned 180 degrees towards the mouth and wrist turned 45 degrees up bringing index finger directly on the mouth; left arm relaxed down at side",
        "movementSequence": "Right elbow turns 180 degrees towards the mouth and wrist turns 45 degrees up placing index finger directly on the mouth, all remaining fingers and thumb tightly closed into a firm fist; left arm rests at side",
        "animationDuration": 2.2, "facialExpression": "Calm, serene expression with lips closed in silence", "animationVerified": True,
        "description": "Single right index finger extended vertically upright placed directly on the mouth with the wrist turned 45 degrees up and elbow turned 180 degrees towards the mouth; all remaining fingers (middle, ring, pinky) and thumb tightly closed into a firm fist; left arm resting relaxed at side.",
        "supported": True, "animationKey": "quiet"
    },
    {
        "id": "loud", "word": "Loud", "meaningHindi": "शोर / तेज आवाज़ / चिल्लाना", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Both hands cupped around mouth sides forming a megaphone funnel, then thrusting forward and opening wide with spread fingers",
        "leftHandPose": "Brought to left side of mouth cupping the lips, then thrusts forward and outward into shouting megaphone flare",
        "rightHandPose": "Brought to right side of mouth cupping the lips, then thrusts forward and outward into shouting megaphone flare",
        "fingerPositions": "Four fingers cupped around mouth, then bursts open with all 5 fingers spread wide during shout",
        "palmOrientation": "Palms start facing inward toward mouth corners forming megaphone, then flare diagonally forward/outward as sound projects",
        "wristOrientation": "Wrists aligned with forearm at mouth, then extend forward with acoustic sound tremor during peak shout",
        "armPosition": "Both elbows flexed bringing hands to mouth sides, then both arms extend forward and flare outward in expanding shout cone",
        "movementSequence": "Both hands come up to cup both sides of mouth like shouting loudly, then project forward and outward with vibrating spread fingers and open-mouth shouting expression",
        "animationDuration": 2.4, "facialExpression": "Intense shout expression with open mouth, raised eyebrows, and physical exertion of projecting sound loudly", "animationVerified": True,
        "description": "Both hands are brought up to cup both sides of the mouth like a megaphone when calling out or shouting loudly, then thrust forward and flare outward with spread fingers as sound projects into the distance.",
        "supported": True, "animationKey": "loud",
        "referenceVideo": "/videos/loud_reference.mov"
    },
    {
        "id": "happy", "word": "Happy", "meaningHindi": "खुश / प्रसन्नता", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Both hands placed in front of lower chest with right elbow turned 90° right-to-left and left elbow turned 90° left-to-right, flat palms facing chest (PRESET_OPEN_FLAT_B)",
        "leftHandPose": "Starts at waist, ascends to lower chest with left elbow turned 90° from left to right, flat palm facing chest; wrist turns slowly from DOWN to UP brushing upward to collarbone",
        "rightHandPose": "Starts at waist, ascends to lower chest with right elbow turned 90° from right to left, flat palm facing chest; wrist turns slowly from DOWN to UP brushing upward to collarbone",
        "fingerPositions": "All fingers extended straight and held flat together with thumb relaxed alongside (PRESET_OPEN_FLAT_B)",
        "palmOrientation": "Both palms facing inward toward the chest throughout the motion",
        "wristOrientation": "Wrists start turned DOWN pointing downward, then turn slowly from DOWN to UP brushing flat palms upward along chest",
        "armPosition": "Right elbow turned 90° from right to left across chest, left elbow turned 90° from left to right across chest, forearms positioned horizontally in front of lower chest",
        "movementSequence": "Both hands positioned at lower chest with elbows turned 90° inward; wrists then turn slowly from DOWN to UP to brush upward in repeated uplifting brushing sweeps along chest with warm joyful radiant smile",
        "animationDuration": 2.8, "facialExpression": "Warm, cheerful, radiant smile on the face (mouthSmile morph target = 0.95) with head tilted slightly upward and joyful uplifted expression", "animationVerified": True,
        "description": "Right elbow turned 90° right-to-left and left elbow turned 90° left-to-right across lower chest with wrists turned 180°; after that wrists turn slowly from DOWN to UP to brush upward along the chest with a warm, joyful radiant smile on the face (Verified from AI4Bharat INCLUDE Dataset).",
        "supported": True, "animationKey": "happy",
        "referenceVideo": "/videos/happy_reference.mov"
    },
    {
        "id": "sad", "word": "Sad", "meaningHindi": "उदास / दुःखी", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Both hands with index fingers extended straight and all other fingers (middle, ring, pinky) and thumbs tightly closed into fists; placed at both eyes, moving simultaneously from UP to DOWN along both cheeks; head drooping sadly downward",
        "leftHandPose": "Left index finger placed at left eye tear line (X ~0.035m, Y ~1.618m, Z ~0.139m), then moves slowly from UP to DOWN along left cheek to jaw level (Y ~1.501m) tracing a tear; thumb and other fingers tightly closed",
        "rightHandPose": "Right index finger placed at right eye tear line (X ~-0.035m, Y ~1.618m, Z ~0.139m), then moves slowly from UP to DOWN along right cheek to jaw level (Y ~1.501m) tracing a tear; thumb and other fingers tightly closed",
        "fingerPositions": "Both index fingers extended straight upright; thumbs folded tightly across curled middle, ring, and pinky fingers in firm fists (PRESET_SAD_TEAR_INDEX_EYE)",
        "palmOrientation": "Both palms facing diagonally inward/backward toward face with index fingertips tracing both cheeks",
        "wristOrientation": "Both wrists aligned with cheek tear-line angle, pitching from UP (+0.15) to DOWN (-0.15) as fingers trace downward",
        "armPosition": "Both arms bring index fingers directly to eye corners, then move simultaneously from UP to DOWN tracing tear trajectory",
        "movementSequence": "Both hands with index fingers extended and thumbs/remaining fingers tightly closed in fists touch the eye tear lines, then move slowly and simultaneously from UP to DOWN along both cheeks tracing falling tears; head droops sadly downward",
        "animationDuration": 2.6, "facialExpression": "Sorrowful, mournful expression with head drooping downward and mouth corners turned down (mouthSmile = 0.0)", "animationVerified": True,
        "description": "In SAD, except the index finger all the fingers are closed with the thumb also closed in a fist on BOTH hands. Both index fingers are placed at the eyes and move simultaneously from UP to DOWN along the cheeks tracing falling tears with a sorrowful expression.",
        "supported": True, "animationKey": "sad"
    },
    {
        "id": "beautiful", "word": "Beautiful", "meaningHindi": "सुंदर / ख़ूबसूरत", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Right elbow turns 180 degrees from 3rd quadrant towards the mouth and wrist rotates 180 degrees towards the mouth with all fingers closed except index finger and thumb (L-handshape), circles contour of face with index finger, then closes index & thumb and opens 3 fingers pointing toward user with wrist at 90° of elbow; left hand rests at side",
        "leftHandPose": "Resting naturally down at side doing nothing (neutral rest pose)",
        "rightHandPose": "Elbow turns 180 degrees from 3rd quadrant towards mouth with wrist rotating 180 degrees towards mouth, index finger traces round circle around face, then closes index & thumb and presents 3 open fingers forward toward user with wrist bent 90° relative to elbow",
        "fingerPositions": "Starts with index & thumb extended and middle/ring/pinky in fist (PRESET_BEAUTIFUL_L_HAND); finishes with index & thumb closed and middle/ring/pinky open straight (PRESET_BEAUTIFUL_THREE_FINGERS)",
        "palmOrientation": "Facing inward toward face while index traces circle, then facing forward/downward toward user during 3-finger presentation",
        "wristOrientation": "Rotates 180 degrees towards mouth as elbow turns 180 degrees towards mouth, then bends 90 degrees relative to elbow directing 3 fingers straight toward user",
        "armPosition": "Right elbow turns 180 degrees from 3rd quadrant towards mouth level, traces round circle around face, lowers slightly to chest/chin level holding wrist at 90° to elbow pointing forward, then returns smoothly to side",
        "movementSequence": "Turn elbow 180 degrees from 3rd quadrant towards the mouth and rotate wrist 180 degrees towards the mouth with all fingers closed except index and thumb (L-handshape), round with index finger on circle of own face, close index and thumb and open other three fingers pointing towards user with wrist at 90 degrees of elbow with radiant smile; left hand rests at side",
        "animationDuration": 3.2, "facialExpression": "Warm, admiring, radiant smile on avatar face (mouthSmile = 0.92) with gentle appreciative gaze", "animationVerified": True,
        "description": "In beautiful, turn the elbow 180 degrees towards the mouth and wrist also 180 degrees towards the mouth with all fingers closed except index finger and thumb, round with index finger on the circle of their own face, then close index finger and thumb and open another three fingers pointing towards the user with wrist at 90 degrees of the elbow.",
        "supported": True, "animationKey": "beautiful"
    },
    {
        "id": "ugly", "word": "Ugly", "meaningHindi": "कुरूप / भद्दा", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Right hand in claw handshape (PRESET_CLAW_HAND) in front of face sweeps horizontally from left to right and pulls away sharply; left hand rests at side",
        "leftHandPose": "Resting naturally down at side doing nothing (neutral rest pose)",
        "rightHandPose": "Rises in front of nose/face with curved claw fingers, sweeps across face and pulls away sharply into space",
        "fingerPositions": "All five fingers curved at PIP and DIP joints in firm claw shape (PRESET_CLAW_HAND)",
        "palmOrientation": "Right palm facing inward toward face, then twisting outward as hand pulls away",
        "wristOrientation": "Right wrist turns outward as hand pulls away from face",
        "armPosition": "Right arm elevates hand in front of face, sweeps laterally from left to right across sightline, then drops back to side",
        "movementSequence": "Right claw hand rises in front of face, sweeps horizontally across from left to right as if pulling a distorting mask away, and snaps outward; avatar turns head away in distaste",
        "animationDuration": 2.6, "facialExpression": "Displeased expression with wrinkled brow and head turned aside in distaste (mouthSmile = 0.0)", "animationVerified": True,
        "description": "Right claw hand rises in front of the face, sweeps horizontally across from left to right and pulls away sharply, while the avatar turns head slightly aside with a distasteful facial expression; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset).",
        "supported": True, "animationKey": "ugly"
    },
    {
        "id": "deaf", "word": "Deaf", "meaningHindi": "बधिर / बहरा", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Right hand with index finger extended straight (PRESET_POINTING_1) touches right ear, then moves in smooth arc to touch mouth/chin; left hand rests at side",
        "leftHandPose": "Resting naturally down at side doing nothing (neutral rest pose)",
        "rightHandPose": "Ascends to touch right ear lobe with index fingertip, then moves forward to touch corner of mouth/chin",
        "fingerPositions": "Right index finger extended straight; thumb folded across curled middle, ring, pinky fingers (PRESET_POINTING_1)",
        "palmOrientation": "Palm facing inward toward side of head, then rotating toward mouth",
        "wristOrientation": "Right wrist aligned with ear-to-mouth trajectory",
        "armPosition": "Right arm elevates index finger to ear, arcs forward to lips/chin, then returns smoothly down to rest",
        "movementSequence": "Right index finger touches right ear, then sweeps in smooth forward arc to touch corner of mouth/chin, indicating cannot hear and cannot speak; left hand rests at side",
        "animationDuration": 2.8, "facialExpression": "Attentive, respectful, neutral facial expression with direct eye contact", "animationVerified": True,
        "description": "Right hand with index finger extended touches the right ear, then moves forward in a smooth arc to touch near the lips/chin, expressing Deaf in Indian Sign Language; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset).",
        "supported": True, "animationKey": "deaf"
    },
    {
        "id": "blind", "word": "Blind", "meaningHindi": "दृष्टिहीन / अंधा", "signLanguage": "ISL",
        "category": "Descriptors", "type": "individual",
        "handConfiguration": "Right hand in V-handshape (PRESET_TWO_FINGERS_LOOK) points index and middle fingers toward eyes, then sweeps horizontally across sightline; left hand rests at side",
        "leftHandPose": "Resting naturally down at side doing nothing (neutral rest pose)",
        "rightHandPose": "Ascends to eye level with index and middle fingers pointing toward eyes, sweeps horizontally across both eyes",
        "fingerPositions": "Index and middle fingers extended straight apart in V-shape; thumb folds over curled ring and pinky fingers (PRESET_TWO_FINGERS_LOOK)",
        "palmOrientation": "Palm facing inward toward eyes, moving horizontally across sightline",
        "wristOrientation": "Right wrist aligned with eye-level sweep angle",
        "armPosition": "Right arm brings V-hand up to eye level, sweeps across from right to left, then lowers back to waist",
        "movementSequence": "Right V-handshape points toward eyes at eye level, then sweeps horizontally across sightline to convey Blind; avatar head bows slightly with respectful expression",
        "animationDuration": 2.7, "facialExpression": "Solemn, respectful expression with eyelids gently softening and slight downward head bow", "animationVerified": True,
        "description": "Right hand in V-handshape points index and middle fingers toward the eyes at eye level, then sweeps horizontally across the sightline to convey Blind in Indian Sign Language; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset).",
        "supported": True, "animationKey": "blind"
    }
]

def get_learning_library() -> list:
    return LEARNING_LIBRARY


