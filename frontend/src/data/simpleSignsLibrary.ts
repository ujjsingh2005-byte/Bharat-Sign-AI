export interface SignGestureItem {
  id: string;
  word: string;
  meaningHindi: string;
  signLanguage: "ISL";
  category: "Greetings" | "Questions" | "Basics" | "Phrases" | "Actions" | "Descriptors";
  type: "individual" | "phrase";
  handConfiguration: string;
  leftHandPose: string;
  rightHandPose: string;
  fingerPositions: string;
  palmOrientation: string;
  wristOrientation: string;
  armPosition: string;
  movementSequence: string;
  animationDuration: number;
  facialExpression: string;
  animationVerified: boolean;
  description: string;
  supported: boolean;
  animationKey: string;
  sequence?: Array<{
    word: string;
    animation: string;
    description: string;
  }>;
}

export const SIMPLE_SIGNS_LIBRARY: SignGestureItem[] = [
  // -------------------------------------------------------------
  // 1. HELLO
  // -------------------------------------------------------------
  {
    id: "hello",
    word: "Hello",
    meaningHindi: "नमस्ते / हैलो",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Thumb closed across palm, four fingers (index, middle, ring, pinky) open straight together; left hand resting down at side",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Touches right forehead mesh surface directly above eyebrow (photo match), then sweeps outward and downward towards Quadrant III (-X, -Y)",
    fingerPositions: "Thumb folded closed across palm; index, middle, ring, and pinky fully extended straight and held together in salute B-handshape",
    palmOrientation: "Right palm maintained strictly facing forward toward user/camera (palmNormal.z >= 0.918 to 0.999) throughout entire movement",
    wristOrientation: "Right wrist aligned upright with natural diagonal salute tilt during forehead mesh touch",
    armPosition: "Right arm brings hand to touch forehead mesh surface, then smoothly sweeps outward and downward into Quadrant III; left arm relaxed at side",
    movementSequence: "Touches forehead mesh surface with 4 fingers and closed thumb, then sweeps smoothly outward and downward towards Quadrant III (-X, -Y)",
    animationDuration: 2.4,
    facialExpression: "Warm, welcoming smile with direct eye contact",
    animationVerified: true,
    description: "Canonical salute greeting: Thumb closed across palm, four fingers open. Hand touches forehead mesh surface above right eyebrow, then sweeps smoothly outward and downward towards Quadrant III; left hand rests at side.",
    supported: true,
    animationKey: "hello",
  },

  // -------------------------------------------------------------
  // 1b. HI
  // -------------------------------------------------------------
  {
    id: "hi",
    word: "Hi",
    meaningHindi: "नमस्ते / हाय",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Single-hand waving greeting: Right hand elevated above shoulder with flat open palm facing front, waving continuously side-to-side like goodbye; left hand resting down at side",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Elevated above shoulder level with flat open palm facing front side, waving continuously from left to right and right to left (like goodbye, but with right hand only)",
    fingerPositions: "All five fingers extended straight and open in flat B-handshape facing front",
    palmOrientation: "Right palm maintained strictly facing forward toward user/camera while waving left to right",
    wristOrientation: "Right wrist upright and waving dynamically side-to-side",
    armPosition: "Right arm elevated above shoulder with forearm swaying and wrist waving; left arm relaxed down at side",
    movementSequence: "Right hand elevated above shoulder waves continuously side-to-side like goodbye, while left hand rests at side",
    animationDuration: 2.2,
    facialExpression: "Warm, welcoming smile with direct eye contact",
    animationVerified: true,
    description: "Single right hand elevated above shoulder with palm facing front side, waving continuously side-to-side like goodbye, while left hand rests at side (unlike Goodbye where both hands are up).",
    supported: true,
    animationKey: "hi",
  },

  // -------------------------------------------------------------
  // 1b. BYE / GOODBYE
  // -------------------------------------------------------------
  {
    id: "bye",
    word: "Bye",
    meaningHindi: "अलविदा / बाय",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Both hands raised above shoulders in open flat B-handshapes, waving side-to-side with palms facing forward",
    leftHandPose: "Raised symmetrically beside left shoulder, palm facing forward, waving side-to-side",
    rightHandPose: "Raised symmetrically beside right shoulder, palm facing forward, waving side-to-side",
    fingerPositions: "All fingers and thumbs extended straight upright together in open flat B-handshapes",
    palmOrientation: "Both palms maintained strictly facing forward toward camera/user (palmNormal.z >= 0.96)",
    wristOrientation: "Both wrists upright, waving smoothly side-to-side",
    armPosition: "Both upper arms elevated with elbows adjusted, forearms and hands raised symmetrically above shoulder level",
    movementSequence: "Both hands elevated above shoulders with palms facing front, waving continuously side-to-side from left to right and right to left",
    animationDuration: 2.2,
    facialExpression: "Friendly farewell smile with direct eye contact",
    animationVerified: true,
    description: "Both hands raised above shoulders with palms facing front side, waving continuously from left to right and right to left in cheerful farewell.",
    supported: true,
    animationKey: "bye",
  },

  // -------------------------------------------------------------
  // 2. HOW
  // -------------------------------------------------------------
  {
    id: "how",
    word: "How",
    meaningHindi: "कैसे",
    signLanguage: "ISL",
    category: "Questions",
    type: "individual",
    handConfiguration: "Both hands cupped / curved with thumbs pointing upright",
    leftHandPose: "Held in front of chest at mid-height, fingers curled, back of hand facing forward",
    rightHandPose: "Mirroring left hand in front of chest at mid-height",
    fingerPositions: "Thumbs extended upright, remaining four fingers curved inward",
    palmOrientation: "Starts facing body/inward, smoothly rolls outward until palms face up",
    wristOrientation: "Simultaneous outward supination of both wrists during movement",
    armPosition: "Elbows bent at 90°, forearms held horizontally in front of chest",
    movementSequence: "Both hands roll outward simultaneously, opening from backs-forward to palms-up posture",
    animationDuration: 2.2,
    facialExpression: "Inquisitive brow furrow with gentle forward head tilt",
    animationVerified: true,
    description: "Curved hands held at chest roll outward until palms face upward in questioning posture.",
    supported: true,
    animationKey: "how",
  },

  // -------------------------------------------------------------
  // 3. ARE
  // -------------------------------------------------------------
  {
    id: "are",
    word: "Are",
    meaningHindi: "हैं / हो",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Right hand index finger extended upright (1-handshape)",
    leftHandPose: "Resting in relaxed neutral standby at side",
    rightHandPose: "Raised near chin with index finger pointing straight up",
    fingerPositions: "Index finger fully straight, thumb holding middle, ring, and pinky closed",
    palmOrientation: "Palm facing inward toward chin",
    wristOrientation: "Upright neutral wrist aligned with vertical forearm",
    armPosition: "Upper arm lowered, forearm angled vertically toward chin",
    movementSequence: "Index finger pushes forward in a deliberate line from chin level toward conversational partner",
    animationDuration: 2.0,
    facialExpression: "Attentive, engaged facial expression",
    animationVerified: true,
    description: "Right index finger held upright near chin, moving straight forward toward partner.",
    supported: true,
    animationKey: "are",
  },

  // -------------------------------------------------------------
  // 4. YOU
  // -------------------------------------------------------------
  {
    id: "you",
    word: "You",
    meaningHindi: "आप / तुम",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Both hands with index fingers pointed directly forward towards user (1-handshape)",
    leftHandPose: "Raised forward at chest height with index finger pointing directly towards user",
    rightHandPose: "Raised forward at chest height with index finger pointing directly towards user",
    fingerPositions: "Both hands: index fingers straight pointing forward, remaining fingers curled into palms, thumbs tucked",
    palmOrientation: "Both palms facing inward/downward",
    wristOrientation: "Both wrists aligned straight with forearms",
    armPosition: "Both forearms extended forward symmetrically toward user",
    movementSequence: "Direct, confident bilateral pointing motion with both index fingers aimed directly at user",
    animationDuration: 2.2,
    facialExpression: "Direct eye contact and friendly attention",
    animationVerified: true,
    description: "Both hands raised forward with index fingers pointing directly towards the user.",
    supported: true,
    animationKey: "you",
  },

  // -------------------------------------------------------------
  // 5. WHAT
  // -------------------------------------------------------------
  {
    id: "what",
    word: "What",
    meaningHindi: "क्या",
    signLanguage: "ISL",
    category: "Questions",
    type: "individual",
    handConfiguration: "Left open horizontal palm at chest; Right index finger pointing",
    leftHandPose: "Held horizontally in front of chest, open palm facing upward/right",
    rightHandPose: "Positioned above left palm with index finger pointing across it",
    fingerPositions: "Left: 5 fingers flat and open; Right: index extended, others closed",
    palmOrientation: "Left palm facing up; Right palm facing downward/inward",
    wristOrientation: "Left wrist horizontal; Right wrist slightly flexed",
    armPosition: "Both forearms brought inward toward solar plexus",
    movementSequence: "Right index finger sweeps smoothly across the flat open left palm",
    animationDuration: 2.2,
    facialExpression: "Questioning head tilt and raised eyebrows",
    animationVerified: true,
    description: "Left open palm held flat at chest, right index finger sweeps across the palm in questioning motion.",
    supported: true,
    animationKey: "what",
  },

  // -------------------------------------------------------------
  // 6. IS
  // -------------------------------------------------------------
  {
    id: "is",
    word: "Is",
    meaningHindi: "है",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Right hand index finger extended (1-handshape)",
    leftHandPose: "Resting in neutral standby at side",
    rightHandPose: "Held near mouth/chin level",
    fingerPositions: "Index finger straight, thumb holding curled fingers",
    palmOrientation: "Palm facing inward toward face",
    wristOrientation: "Upright neutral",
    armPosition: "Forearm angled upward toward chin",
    movementSequence: "Index finger pushes forward from chin in affirmative statement",
    animationDuration: 2.0,
    facialExpression: "Neutral affirmative expression",
    animationVerified: true,
    description: "Right index finger moves forward from chin level in affirmative copula gesture.",
    supported: true,
    animationKey: "is",
  },

  // -------------------------------------------------------------
  // 7. YOUR
  // -------------------------------------------------------------
  {
    id: "your",
    word: "Your",
    meaningHindi: "आपका / तुम्हारा",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Open flat hand (B-handshape), palm facing directly forward",
    leftHandPose: "Resting in neutral standby at side",
    rightHandPose: "Raised in front of chest at mid-height, fingers pointing straight up",
    fingerPositions: "All 5 fingers extended flat, thumb alongside index finger",
    palmOrientation: "Palm facing directly toward conversational partner (possessive marker)",
    wristOrientation: "Dorsiflexed upright at 90° angle to forearm",
    armPosition: "Elbow tucked near ribs, forearm pushing forward",
    movementSequence: "Open flat palm pushes gently forward in a deliberate possessive stroke toward partner",
    animationDuration: 2.2,
    facialExpression: "Respectful, attentive expression",
    animationVerified: true,
    description: "Flat open hand with palm facing directly forward, pushed gently toward partner indicating possession.",
    supported: true,
    animationKey: "your",
  },

  // -------------------------------------------------------------
  // 8. NAME
  // -------------------------------------------------------------
  {
    id: "name",
    word: "Name",
    meaningHindi: "नाम",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Both hands in 'H' handshape (index and middle fingers extended straight together)",
    leftHandPose: "Held horizontally in front of chest, index & middle fingers pointing rightward",
    rightHandPose: "Held above left hand, index & middle fingers pointing forward/left",
    fingerPositions: "Both hands: index and middle fingers straight together, thumb holding ring & pinky closed",
    palmOrientation: "Left palm facing inward toward body; Right palm facing downward",
    wristOrientation: "Both wrists aligned horizontally in front of sternum",
    armPosition: "Both elbows bent inward, forearms centered in front of chest",
    movementSequence: "Right H-fingers tap down squarely twice onto the left H-fingers",
    animationDuration: 2.2,
    facialExpression: "Neutral or questioning depending on context",
    animationVerified: true,
    description: "Right index and middle fingers tap down twice across left index and middle fingers at chest level.",
    supported: true,
    animationKey: "name",
  },

  // -------------------------------------------------------------
  // 9. WHERE
  // -------------------------------------------------------------
  {
    id: "where",
    word: "Where",
    meaningHindi: "कहाँ",
    signLanguage: "ISL",
    category: "Questions",
    type: "individual",
    handConfiguration: "Right hand index finger pointing upright (1-handshape)",
    leftHandPose: "Resting in neutral standby at side",
    rightHandPose: "Raised in front of right shoulder at eye level",
    fingerPositions: "Index finger straight up, thumb holding remaining fingers in fist",
    palmOrientation: "Palm facing forward/inward",
    wristOrientation: "Upright with lateral side-to-side oscillation",
    armPosition: "Forearm vertical, elbow bent at ~90°",
    movementSequence: "Upright index finger waves side-to-side repeatedly in a questioning gesture",
    animationDuration: 2.2,
    facialExpression: "Inquisitive expression with subtle questioning head tilt",
    animationVerified: true,
    description: "Right hand raised with upright index finger waving side-to-side with a questioning expression.",
    supported: true,
    animationKey: "where",
  },

  // -------------------------------------------------------------
  // 10. DO
  // -------------------------------------------------------------
  {
    id: "do",
    word: "Do",
    meaningHindi: "करना / करो",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Both hands open, fingers slightly curved downward",
    leftHandPose: "In front of left waist/abdomen, palm down",
    rightHandPose: "In front of right waist/abdomen, palm down",
    fingerPositions: "Loose relaxed fingers pointing forward/downward",
    palmOrientation: "Both palms facing downward toward floor",
    wristOrientation: "Neutral with side-to-side oscillation",
    armPosition: "Both forearms lowered in front of abdomen",
    movementSequence: "Both hands swing horizontally side to side in parallel rhythm mimicking active task movement",
    animationDuration: 2.0,
    facialExpression: "Focused neutral expression",
    animationVerified: true,
    description: "Both flat hands facing downward move side-to-side in front of waist in active motion.",
    supported: true,
    animationKey: "do",
  },

  // -------------------------------------------------------------
  // 11. I
  // -------------------------------------------------------------
  {
    id: "i",
    word: "I",
    meaningHindi: "मैं",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Right hand index finger extended (1-handshape)",
    leftHandPose: "Resting in neutral standby at side",
    rightHandPose: "Pointing directly inward toward center of own chest",
    fingerPositions: "Index finger straight, thumb holding other fingers tucked",
    palmOrientation: "Palm facing inward toward sternum",
    wristOrientation: "Slightly flexed inward",
    armPosition: "Elbow tucked, forearm angled diagonally up to chest",
    movementSequence: "Index fingertip touches or points firmly to the center of the breastbone",
    animationDuration: 2.0,
    facialExpression: "Clear self-referential expression",
    animationVerified: true,
    description: "Index finger points directly to one's own chest.",
    supported: true,
    animationKey: "me",
  },

  // -------------------------------------------------------------
  // 12. AM
  // -------------------------------------------------------------
  {
    id: "am",
    word: "Am",
    meaningHindi: "हूँ",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Right hand index finger extended (1-handshape)",
    leftHandPose: "Resting in neutral standby at side",
    rightHandPose: "Near chin level",
    fingerPositions: "Index finger extended, others closed",
    palmOrientation: "Palm facing inward",
    wristOrientation: "Upright",
    armPosition: "Forearm raised toward face",
    movementSequence: "Index finger moves forward from lips/chin in positive assertion",
    animationDuration: 2.0,
    facialExpression: "Assuring nod",
    animationVerified: true,
    description: "Right index finger moves forward from chin/lips.",
    supported: true,
    animationKey: "am",
  },

  // -------------------------------------------------------------
  // 13. FINE
  // -------------------------------------------------------------
  {
    id: "fine",
    word: "Fine",
    meaningHindi: "ठीक / बढ़िया",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Open 5-hand with thumb touching center of chest",
    leftHandPose: "Resting in neutral standby at side",
    rightHandPose: "Thumb tip placed against center of chest (sternum)",
    fingerPositions: "All 5 fingers extended and spread naturally",
    palmOrientation: "Palm facing left (inward toward body)",
    wristOrientation: "Neutral vertical",
    armPosition: "Elbow bent, forearm angled across chest",
    movementSequence: "Thumb touches center of chest and gently pulses or lifts forward in a positive state gesture",
    animationDuration: 2.2,
    facialExpression: "Content, smiling, relaxed facial posture",
    animationVerified: true,
    description: "Open 5-hand with thumb touching center of chest indicating good health and well-being.",
    supported: true,
    animationKey: "fine",
  },

  // -------------------------------------------------------------
  // 14. NAMASTE
  // -------------------------------------------------------------
  {
    id: "namaste",
    word: "Namaste",
    meaningHindi: "नमस्ते / नमस्कार",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Anjali Mudra — Both open flat hands pressed flush palm-to-palm at center chest",
    leftHandPose: "In front of sternum, fingers pointing straight up, pressed to right palm",
    rightHandPose: "In front of sternum, fingers pointing straight up, pressed to left palm",
    fingerPositions: "All fingers and thumbs extended flat, flush together",
    palmOrientation: "Palms facing each other at midline (X = 0)",
    wristOrientation: "Wrists flexed upright so fingers point directly vertically",
    armPosition: "Elbows bent symmetrically, forearms angled inward toward chest",
    movementSequence: "Hands brought together flush at heart level accompanied by a respectful bow of the head and upper spine",
    animationDuration: 2.4,
    facialExpression: "Respectful, serene expression with gentle head bow",
    animationVerified: true,
    description: "Traditional Indian greeting: Both palms pressed flush together at chest with head slight bow.",
    supported: true,
    animationKey: "namaste",
  },

  // -------------------------------------------------------------
  // 15. PHRASE: HOW ARE YOU?
  // -------------------------------------------------------------
  {
    id: "phrase_how_are_you",
    word: "How are you?",
    meaningHindi: "आप कैसे हैं?",
    signLanguage: "ISL",
    category: "Phrases",
    type: "phrase",
    handConfiguration: "Multi-sign sequence: Pointing handshape → Open palm salute → Curved palms up",
    leftHandPose: "Coordinated sequence: Standby → Neutral → Rolling upward in front of chest",
    rightHandPose: "Coordinated sequence: Pointing forward → Temple salute → Rolling upward",
    fingerPositions: "Dynamic transition through verified ISL postures",
    palmOrientation: "Transitions: Forward → Temple outward → Palms facing up",
    wristOrientation: "Coordinated natural wrist transitions",
    armPosition: "Dynamic upper-torso sequence in front of chest",
    movementSequence: "1. YOU (Point forward) → 2. HELLO (Temple salute) → 3. HOW (Cupped hands rolling outward to palms up)",
    animationDuration: 6.0,
    facialExpression: "Warm greeting smile transitioning to an inquisitive questioning expression",
    animationVerified: true,
    description: "Complete conversational phrase: 'YOU' + 'HELLO' + 'HOW' (ISL conversational inquiry).",
    supported: true,
    animationKey: "how_are_you",
    sequence: [
      { word: "YOU", animation: "you", description: "Both hands index fingers pointing directly towards user" },
      { word: "HELLO", animation: "hello", description: "Temple salute moving outward warmly" },
      { word: "HOW", animation: "how", description: "Curved hands rolling outward to open palms up" },
    ],
  },

  // -------------------------------------------------------------
  // 16. PHRASE: WHAT IS YOUR NAME?
  // -------------------------------------------------------------
  {
    id: "phrase_what_is_your_name",
    word: "What is your name?",
    meaningHindi: "आपका नाम क्या है?",
    signLanguage: "ISL",
    category: "Phrases",
    type: "phrase",
    handConfiguration: "Multi-sign sequence: Open flat palm → Two H-hands tapping → Open left palm & right sweep",
    leftHandPose: "Neutral standby → H-hand held horizontally → Open palm flat at chest",
    rightHandPose: "Open palm push → H-hand tapping down → Index finger sweeping across left palm",
    fingerPositions: "Dynamic transition through verified ISL postures",
    palmOrientation: "Transitions: Forward → Downward → Inward/Upward",
    wristOrientation: "Coordinated natural wrist transitions",
    armPosition: "Central chest working space",
    movementSequence: "1. YOUR (Open flat palm pushed forward) → 2. NAME (Right H-hand tapping left H-hand) → 3. WHAT (Right index sweeping across open left palm)",
    animationDuration: 6.5,
    facialExpression: "Attentive inquiry with questioning head tilt and raised eyebrows on 'WHAT'",
    animationVerified: true,
    description: "Complete conversational phrase: 'YOUR' + 'NAME' + 'WHAT' (ISL wh-question syntax).",
    supported: true,
    animationKey: "name",
    sequence: [
      { word: "YOUR", animation: "your", description: "Flat open hand pushed gently toward partner" },
      { word: "NAME", animation: "name", description: "Right H-hand tapping down across left H-hand" },
      { word: "WHAT", animation: "what", description: "Right index sweeping across open left palm" },
    ],
  },

  // -------------------------------------------------------------
  // 17. PHRASE: WHERE DO YOU LIVE?
  // -------------------------------------------------------------
  {
    id: "phrase_where_do_you_live",
    word: "Where do you live?",
    meaningHindi: "आप कहाँ रहते हैं?",
    signLanguage: "ISL",
    category: "Phrases",
    type: "phrase",
    handConfiguration: "Multi-sign sequence: Index point → Dual L-handshape rise → Upright index wave",
    leftHandPose: "Neutral standby → L-hand moving upward along torso → Neutral standby",
    rightHandPose: "Point forward → L-hand moving upward along torso → Upright index waving",
    fingerPositions: "Dynamic transition through verified ISL postures",
    palmOrientation: "Forward → Inward toward torso → Forward waving side-to-side",
    wristOrientation: "Coordinated natural wrist transitions",
    armPosition: "Upper torso and chest workspace",
    movementSequence: "1. YOU (Point forward) → 2. LIVE (Both hands in L-shape moving upward along torso) → 3. WHERE (Right index finger waving side-to-side)",
    animationDuration: 6.5,
    facialExpression: "Friendly attention transitioning to inquisitive questioning look on 'WHERE'",
    animationVerified: true,
    description: "Complete conversational phrase: 'YOU' + 'LIVE' + 'WHERE' (ISL question syntax).",
    supported: true,
    animationKey: "where",
    sequence: [
      { word: "YOU", animation: "you", description: "Both hands index fingers pointing directly towards user" },
      { word: "LIVE", animation: "live", description: "Both hands in L-shape moving upward along torso" },
      { word: "WHERE", animation: "where", description: "Right hand upright index waving side-to-side" },
    ],
  },

  // -------------------------------------------------------------
  // 18. PHRASE: I AM FINE.
  // -------------------------------------------------------------
  {
    id: "phrase_i_am_fine",
    word: "I am fine.",
    meaningHindi: "मैं ठीक हूँ।",
    signLanguage: "ISL",
    category: "Phrases",
    type: "phrase",
    handConfiguration: "Multi-sign sequence: Index pointing to chest → Open 5-hand with thumb touching chest",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Index pointing directly to chest → Open 5-hand with thumb on center chest",
    fingerPositions: "Index extended → Open 5 fingers spread naturally",
    palmOrientation: "Inward facing sternum → Leftward facing sternum",
    wristOrientation: "Coordinated natural wrist transitions",
    armPosition: "Chest and sternum workspace",
    movementSequence: "1. I (Index pointing directly to own chest) → 2. FINE (Open 5-hand with thumb touching center chest)",
    animationDuration: 4.8,
    facialExpression: "Calm, satisfied, smiling expression",
    animationVerified: true,
    description: "Complete conversational phrase: 'I' + 'FINE' (ISL affirmative statement).",
    supported: true,
    animationKey: "fine",
    sequence: [
      { word: "I", animation: "me", description: "Index finger pointing directly to own chest" },
      { word: "FINE", animation: "fine", description: "Open 5-hand with thumb touching center chest" },
    ],
  },

  // -------------------------------------------------------------
  // 19. THANK YOU
  // -------------------------------------------------------------
  {
    id: "thank_you",
    word: "Thank You",
    meaningHindi: "धन्यवाद / शुक्रिया",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Flat open hand (B-handshape) with wrist turned 180° opposite and adjusted elbow, fingertips touching chin",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Fingertips start touching chin/lips with wrist turned 180° opposite and elbow adjusted, extending smoothly forward toward partner",
    fingerPositions: "All 5 fingers extended flat and together",
    palmOrientation: "Starts at chin with wrist turned 180° opposite, turns facing upward/forward as it extends toward user",
    wristOrientation: "Turned 180° opposite at chin, flexing smoothly forward toward user",
    armPosition: "Elbow adjusted to position, forearm angling up to chin with wrist turned 180° opposite and sweeping outward",
    movementSequence: "Fingertips touch chin/mouth then extend outward forward toward partner with slight nod",
    animationDuration: 2.2,
    facialExpression: "Warm, thankful smile with appreciative nod",
    animationVerified: true,
    description: "Fingertips touch chin/mouth with wrist turned 180° opposite and adjusted elbow, then move outward forward toward partner expressing gratitude.",
    supported: true,
    animationKey: "thank_you",
  },

  // -------------------------------------------------------------
  // 20. YES
  // -------------------------------------------------------------
  {
    id: "yes",
    word: "Yes",
    meaningHindi: "हाँ",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Single right hand in closed S-fist facing directly towards the user with elbow turned 45° from right to left; left hand relaxed at side",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Elevated with elbow turned 45° from right to left, fist facing directly towards the user in UP position, then nodding DOWN at wrist",
    fingerPositions: "All four fingers tightly curled into palm, and thumb closed and folded tightly across the index and middle fingers (calibrated to user photo)",
    palmOrientation: "Fist faces directly towards the user/camera",
    wristOrientation: "Starts in UP position (-0.35 rad), then nods firmly DOWN (+1.05 rad) towards the user from the wrist",
    armPosition: "Right arm with elbow turned 45° from right to left into midline, forearm upright holding fist facing user; left arm down relaxed at side",
    movementSequence: "Right hand in closed S-fist facing user starts in UP position, then flexes DOWN at the wrist in an affirmative nod, repeating while head nods synchronously; left hand rests at side",
    animationDuration: 1.4,
    facialExpression: "Affirmative head nod and warm confident smile",
    animationVerified: true,
    description: "Single right hand elevated with elbow turned 45° from right to left, closed S-fist facing directly towards the user (all fingers and thumb closed tightly). Starts in the UP position, and during YES gesture nods firmly DOWN from the wrist; left hand rests relaxed at side.",
    supported: true,
    animationKey: "yes",
  },

  // -------------------------------------------------------------
  // 21. NO
  // -------------------------------------------------------------
  {
    id: "no",
    word: "No",
    meaningHindi: "नहीं",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Index and middle fingers extended, thumb extended, ring and pinky curled",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Held at mid-chest height in front of body",
    fingerPositions: "Index and middle fingers snap down against thumb firmly",
    palmOrientation: "Palm facing forward/inward",
    wristOrientation: "Quick horizontal side-to-side rotation accompanied by finger snap",
    armPosition: "Forearm held horizontally in front of chest",
    movementSequence: "Index and middle fingers snap down quickly against thumb twice with head shake",
    animationDuration: 2.0,
    facialExpression: "Firm head shake side-to-side with negative furrowed brow",
    animationVerified: true,
    description: "Index and middle fingers snap down firmly against the thumb accompanied by a head shake.",
    supported: true,
    animationKey: "no",
  },

  // -------------------------------------------------------------
  // 22. HELP
  // -------------------------------------------------------------
  {
    id: "help",
    word: "Help",
    meaningHindi: "मदद",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Closed thumbs-up fist placed on flat open horizontal palm",
    leftHandPose: "Flat open horizontal palm held at chest level facing upward",
    rightHandPose: "Closed fist with thumb upright resting squarely on left palm",
    fingerPositions: "Left: all 5 fingers flat and open; Right: thumbs-up fist",
    palmOrientation: "Left palm up; Right fist facing left",
    wristOrientation: "Both wrists aligned horizontally in front of solar plexus",
    armPosition: "Both forearms held horizontally in front of chest",
    movementSequence: "Both hands lift upward together in a deliberate supportive motion",
    animationDuration: 2.2,
    facialExpression: "Urgent, attentive, or supportive expression",
    animationVerified: true,
    description: "Right thumbs-up fist rests on flat open left palm and both are lifted upward together.",
    supported: true,
    animationKey: "help",
  },

  // -------------------------------------------------------------
  // 23. I LOVE YOU
  // -------------------------------------------------------------
  {
    id: "i_love_you",
    word: "I Love You",
    meaningHindi: "मुझे तुमसे प्यार है",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "ILY handshape — Thumb, index finger, and pinky extended; middle and ring curled",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Raised in front of right shoulder at chest/neck height, pulsing forward",
    fingerPositions: "Thumb, index finger, and pinky fully straight; middle and ring fingers closed into palm",
    palmOrientation: "Palm facing directly forward toward conversational partner",
    wristOrientation: "Upright with gentle forward pulsing tilt",
    armPosition: "Elbow bent at ~90°, forearm upright",
    movementSequence: "Hand with ILY configuration pushes gently forward twice toward partner with affectionate smile",
    animationDuration: 2.2,
    facialExpression: "Warm affectionate smile with loving eye contact",
    animationVerified: true,
    description: "Thumb, index, and pinky extended together facing partner in universal ILY handshape.",
    supported: true,
    animationKey: "iloveyou",
  },

  // -------------------------------------------------------------
  // 24. PLEASE
  // -------------------------------------------------------------
  {
    id: "please",
    word: "Please",
    meaningHindi: "कृपया",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Open flat hand (B-handshape) placed over center chest",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Flat open palm placed against upper chest near sternum/heart",
    fingerPositions: "All 5 fingers straight and touching",
    palmOrientation: "Palm facing inward touching chest",
    wristOrientation: "Neutral circular oscillation",
    armPosition: "Elbow bent, forearm angled across chest",
    movementSequence: "Flat open palm rubs gently in a clockwise circular motion over heart area",
    animationDuration: 2.2,
    facialExpression: "Polite, pleading, gentle facial expression",
    animationVerified: true,
    description: "Flat open palm rubs gently in a circular clockwise motion over the heart.",
    supported: true,
    animationKey: "please",
  },

  // -------------------------------------------------------------
  // 25. SORRY
  // -------------------------------------------------------------
  {
    id: "sorry",
    word: "Sorry",
    meaningHindi: "माफ़ कीजिए",
    signLanguage: "ISL",
    category: "Greetings",
    type: "individual",
    handConfiguration: "Closed fist (A-handshape) placed over center chest",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Fist placed against center chest over sternum/heart",
    fingerPositions: "All fingers curled into fist with thumb resting alongside index finger",
    palmOrientation: "Palm/knuckles facing inward against chest",
    wristOrientation: "Circular rotation across chest",
    armPosition: "Elbow bent, forearm angled across chest",
    movementSequence: "Closed fist circles gently in a clockwise motion over heart with head slightly bowed",
    animationDuration: 2.2,
    facialExpression: "Apologetic, contrite facial expression with slight head tilt and remorseful eyes",
    animationVerified: true,
    description: "Closed fist circles over the chest in a circular motion with an apologetic expression.",
    supported: true,
    animationKey: "sorry",
  },

  // -------------------------------------------------------------
  // 26. STOP
  // -------------------------------------------------------------
  {
    id: "stop",
    word: "Stop",
    meaningHindi: "रुको",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Flat open hand chopping down onto flat open horizontal palm",
    leftHandPose: "Flat open palm held horizontally in front of chest facing upward",
    rightHandPose: "Flat open hand held upright chopping down edge-first onto left palm",
    fingerPositions: "Both hands: all 5 fingers straight and flush together",
    palmOrientation: "Left palm up; Right palm facing left (edge facing downward)",
    wristOrientation: "Left horizontal; Right rigid vertical chopping angle",
    armPosition: "Forearms centered in front of chest",
    movementSequence: "Right pinky-edge chops down firmly and decisively onto the open left palm once",
    animationDuration: 2.0,
    facialExpression: "Firm, commanding, serious expression",
    animationVerified: true,
    description: "Pinky-edge of flat open right hand chops down firmly onto the open flat left palm.",
    supported: true,
    animationKey: "stop",
  },

  // -------------------------------------------------------------
  // 27. PAIN
  // -------------------------------------------------------------
  {
    id: "pain",
    word: "Pain",
    meaningHindi: "दर्द / तकलीफ",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Both hands index fingers extended pointing toward each other (1-handshapes)",
    leftHandPose: "Held in front of chest, index pointing toward right index finger",
    rightHandPose: "Held in front of chest, index pointing toward left index finger",
    fingerPositions: "Both index fingers straight, thumbs holding remaining fingers curled",
    palmOrientation: "Left facing right/inward; Right facing left/inward",
    wristOrientation: "Opposing horizontal orientation with slight twisting motion",
    armPosition: "Both forearms held horizontally in front of chest/abdomen",
    movementSequence: "Both index fingertips jab toward each other repeatedly without touching, twisting at wrists",
    animationDuration: 2.2,
    facialExpression: "Pained facial grimace with furrowed eyebrows and squinted eyes",
    animationVerified: true,
    description: "Both index fingers point toward each other and jab inward repeatedly in uncomfortable motion.",
    supported: true,
    animationKey: "pain",
  },

  // -------------------------------------------------------------
  // 28. EAT
  // -------------------------------------------------------------
  {
    id: "eat",
    word: "Eat",
    meaningHindi: "खाना",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Thumb and four fingers (index, middle, ring, pinky) gathered together with fingertips meeting thumb pad in pinched morsel posture; left hand down relaxed",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "From the start in Quadrant III (-X, -Y), wrist is turned 180° opposite along the forearm, with pinched fingers/thumb and elbow directed toward the mouth, moving smoothly to touch the lips (matching user reference)",
    fingerPositions: "All four fingers curved with tips pinched against thumb pad forming a tapered morsel shape (matching user hand photo)",
    palmOrientation: "Hand held in Quadrant III with wrist turned 180° opposite along the forearm, then touches mouth surface directly (X = 0.000, Y = 1.513, Z = 0.135)",
    wristOrientation: "Turned 180° opposite along forearm from the start so pinched fingers point directly toward mouth throughout full movement",
    armPosition: "Elbow directed towards mouth from lower chest level, forearm moving hand from Quadrant III directly up to mouth",
    movementSequence: "From Quadrant III, hand with 180° opposite turned wrist, pinched fingers, and elbow directed to mouth moves up to touch mouth twice in smooth feeding cycle",
    animationDuration: 2.4,
    facialExpression: "Pleasant, engaged expression with subtle head nod on mouth contact",
    animationVerified: true,
    description: "From Quadrant III with wrist turned 180° opposite along the forearm, pinched fingers, thumb, and elbow directed toward the mouth, hand moves smoothly to touch the lips twice; left hand rests at side.",
    supported: true,
    animationKey: "eat",
  },

  // -------------------------------------------------------------
  // 29. DRINK
  // -------------------------------------------------------------
  {
    id: "drink",
    word: "Drink",
    meaningHindi: "पीना",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Hand in 'C' cup shape with four fingers curved and thumb open and extended forward horizontally (photo match); left hand relaxed at side",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Held in 'C' cup shape with 4 fingers bent and thumb open, moving from Quadrant III up to touch the lips and drink",
    fingerPositions: "Four fingers (index, middle, ring, pinky) bent together in smooth arch; thumb open and extended straight forward horizontally",
    palmOrientation: "Palm facing inward/left toward torso and mouth",
    wristOrientation: "Wrist turned 180° opposite (Y = 1.54 rad) with elbow adjusted along Quadrant III -> Mouth orientation",
    armPosition: "Right elbow and forearm move smoothly from Quadrant III up to mouth with situation-adjusted elbow and 180° opposite wrist; left arm relaxed at side",
    movementSequence: "From Quadrant III with situation-adjusted elbow and wrist turned 180° opposite, hand in 'C' cup shape moves smoothly towards the lips of the mouth to drink, then returns to Quadrant III",
    animationDuration: 2.4,
    facialExpression: "Neutral relaxed expression with slight head tilt back on sipping",
    animationVerified: true,
    description: "From Quadrant III with elbow adjusted to the situation and wrist turned 180° opposite (Y = 1.54 rad), hand in 'C' cup shape (open thumb, 4 bent fingers) moves smoothly towards the lips of the mouth to drink.",
    supported: true,
    animationKey: "drink",
  },

  // -------------------------------------------------------------
  // 30. MORE
  // -------------------------------------------------------------
  {
    id: "more",
    word: "More",
    meaningHindi: "और / ज्यादा",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "Both hands in flattened 'O' handshapes (all fingertips touching thumb tips)",
    leftHandPose: "In front of left chest, fingertips pointing rightward toward right hand",
    rightHandPose: "In front of right chest, fingertips pointing leftward toward left hand",
    fingerPositions: "Both hands: fingertips gathered together touching thumb tips",
    palmOrientation: "Left palm facing right; Right palm facing left",
    wristOrientation: "Wrists aligned horizontally across center chest",
    armPosition: "Both elbows bent inward, forearms centered in front of chest",
    movementSequence: "Fingertips of both hands tap together repeatedly in front of chest",
    animationDuration: 2.0,
    facialExpression: "Engaged, requesting or expectant expression",
    animationVerified: true,
    description: "Both hands form flattened 'O' shapes and tap fingertips together at center chest repeatedly.",
    supported: true,
    animationKey: "more",
  },

  // -------------------------------------------------------------
  // 31. BATHROOM
  // -------------------------------------------------------------
  {
    id: "bathroom",
    word: "Bathroom",
    meaningHindi: "शौचालय / बाथरूम",
    signLanguage: "ISL",
    category: "Basics",
    type: "individual",
    handConfiguration: "'T' handshape fist (thumb poking between index and middle fingers)",
    leftHandPose: "Resting in neutral standby alongside torso",
    rightHandPose: "Held in front of right shoulder at chest height",
    fingerPositions: "Fist formed with thumb tucked between index and middle fingers",
    palmOrientation: "Palm facing forward/left",
    wristOrientation: "Oscillating side-to-side in rapid gentle rotation",
    armPosition: "Elbow bent at 90°, forearm vertical",
    movementSequence: "'T' handshape shakes side-to-side repeatedly at shoulder height",
    animationDuration: 2.2,
    facialExpression: "Polite, discreet expression",
    animationVerified: true,
    description: "Hand in 'T' handshape shakes side-to-side at shoulder height indicating bathroom/toilet.",
    supported: true,
    animationKey: "bathroom",
  },

  // -------------------------------------------------------------
  // 32. WHEN
  // -------------------------------------------------------------
  {
    id: "when",
    word: "When",
    meaningHindi: "कब",
    signLanguage: "ISL",
    category: "Questions",
    type: "individual",
    handConfiguration: "Both index fingers extended upright (1-handshapes)",
    leftHandPose: "Held vertically stationary in front of chest, index finger pointing up",
    rightHandPose: "Circles clockwise around left index fingertip and lands touching tip",
    fingerPositions: "Both index fingers straight, remaining fingers curled into fists",
    palmOrientation: "Left facing right; Right facing left",
    wristOrientation: "Left stationary; Right articulating in smooth circular orbit",
    armPosition: "Both forearms held in front of chest",
    movementSequence: "Right index finger circles clockwise around stationary left index finger and lands on fingertip",
    animationDuration: 2.4,
    facialExpression: "Questioning brow furrow with head tilted slightly",
    animationVerified: true,
    description: "Right index finger circles around left index finger and lands touching its fingertip in questioning motion.",
    supported: true,
    animationKey: "when",
  },

  // -------------------------------------------------------------
  // 33. PHRASE: MY NAME IS...
  // -------------------------------------------------------------
  {
    id: "phrase_my_name_is",
    word: "My name is...",
    meaningHindi: "मेरा नाम ... है",
    signLanguage: "ISL",
    category: "Phrases",
    type: "phrase",
    handConfiguration: "Compound sequence: Flat open palm on chest → Two H-hands tapping",
    leftHandPose: "Neutral standby → Horizontal H-hand in front of chest",
    rightHandPose: "Flat open palm resting on chest → Right H-hand tapping down on left H-hand",
    fingerPositions: "All fingers flat on chest → Index & middle extended together in H-shape",
    palmOrientation: "Inward facing chest → Downward facing floor",
    wristOrientation: "Coordinated natural wrist transitions",
    armPosition: "Central chest workspace",
    movementSequence: "1. MY (Flat open palm on chest) → 2. NAME (Right H-fingers tap down across left H-fingers)",
    animationDuration: 5.0,
    facialExpression: "Friendly, confident introducing smile with clear eye contact",
    animationVerified: true,
    description: "Complete self-introduction phrase: 'MY' (palm on chest) + 'NAME' (H-hand tap).",
    supported: true,
    animationKey: "my_name_is",
    sequence: [
      { word: "MY", animation: "my", description: "Flat open palm resting firmly on center of chest" },
      { word: "NAME", animation: "name", description: "Right H-hand tapping down across left H-hand" },
    ],
  },

  // -------------------------------------------------------------
  // 34. CLIMB
  // -------------------------------------------------------------
  {
    id: "climb",
    word: "Climb",
    meaningHindi: "चढ़ना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both wrists turned 90 degrees (right hand from right to left, left hand from left to right) with both elbows bent 90° to each other, both hands continuously climbing stairs by alternating steps over each other with flat downward palms",
    leftHandPose: "Starts lower, steps up and over the right hand onto the upper step, then lowers as right hand steps over it, repeating continuously",
    rightHandPose: "Starts at base step, supports left hand's ascent, then steps up and over the left hand onto the upper step, repeating continuously",
    fingerPositions: "All fingers extended flat & straight together, palms facing downward",
    palmOrientation: "Both palms facing downward (prone), fingers directed medially across the body",
    wristOrientation: "Both wrists turned 90 degrees (right hand from right to left and left hand from left to right)",
    armPosition: "Both elbows bent 90 degrees to each other with forearms held horizontally across the front of the body, both hands moving continuously in alternating stairs-climbing steps",
    movementSequence: "Both hands continuously climb stairs alternating steps over each other: first left hand steps up and over right hand, then right hand steps up and over left hand, looping seamlessly",
    animationDuration: 2.4,
    facialExpression: "Attentive, engaged upward gaze with focused climbing expression",
    animationVerified: true,
    description: "Both hands continuously climb stairs alternating steps over each other: first the left hand moves up and over the right hand onto the higher step, then the right hand steps up and over the left hand onto the next step, repeating continuously with both elbows bent 90 degrees to each other, wrists turned 90 degrees (right from right to left, left from left to right), and flat downward palms.",
    supported: true,
    animationKey: "climb",
  },

  // -------------------------------------------------------------
  // 35. RUN
  // -------------------------------------------------------------
  {
    id: "run",
    word: "Run",
    meaningHindi: "भागना / दौड़ना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Modified L-handshape on both hands (all fingers closed except index finger and thumb)",
    leftHandPose: "Left elbow moved 90° from left to right across torso, left index finger touching right thumb from behind",
    rightHandPose: "Right index finger pointing directly forward towards the user, thumb extended upright/backward meeting left index",
    fingerPositions: "Both hands: index finger extended straight, thumb open/extended, middle/ring/pinky curled tightly into fist against palm",
    palmOrientation: "Left palm facing inward/rightward across torso; Right palm facing leftward with index aimed forward",
    wristOrientation: "Left wrist angled across torso; Right wrist pitched forward aligning index finger towards user",
    armPosition: "Left elbow turned 90° across chest from left to right; Right elbow flexed forward bringing hand into central midline",
    movementSequence: "Left index finger touches behind right thumb; both hands then execute coordinated forward-and-backward running propulsion pulses in running stride cadence",
    animationDuration: 2.6,
    facialExpression: "Energetic running focus with active forward head tilt and determined gaze",
    animationVerified: true,
    description: "Close all fingers except index finger and thumb of both hands (forming modified L-handshapes with middle, ring, pinky in closed fists). The left elbow moves 90 degrees from left to right across the body so the left index finger touches through the thumb of the right hand from the back. The right hand index finger points directly forward towards the user. Both hands perform rhythmic forward running strides in unison.",
    supported: true,
    animationKey: "run",
  },

  // -------------------------------------------------------------
  // 36. FALL
  // -------------------------------------------------------------
  {
    id: "fall",
    word: "Fall",
    meaningHindi: "गिरना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands in front of body with fingers slightly bent",
    leftHandPose: "Symmetric drop downward alongside right hand",
    rightHandPose: "Positioned in front of body, moving downward to represent falling",
    fingerPositions: "Fingers slightly bent in relaxed downward curve",
    palmOrientation: "Palms facing downward, wrists flexing down following motion",
    wristOrientation: "Wrists allow downward following movement",
    armPosition: "Elbows slightly bent, moving downward together",
    movementSequence: "Hands drop rapidly downward from chest to waist representing falling",
    animationDuration: 2.0,
    facialExpression: "Surprised or concerned expression following downward drop",
    animationVerified: true,
    description: "Position both hands in front of the body, with the fingers slightly bent. Move the hands downward to represent falling, keeping the elbows slightly bent and allowing the wrists to follow the downward movement.",
    supported: true,
    animationKey: "fall",
  },

  // -------------------------------------------------------------
  // 37. GIVE
  // -------------------------------------------------------------
  {
    id: "give",
    word: "Give",
    meaningHindi: "देना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both open hands with palms facing upward and fingers gently curved",
    leftHandPose: "Symmetric offering hand beside right hand",
    rightHandPose: "Palms facing upward, moving forward together offering to partner",
    fingerPositions: "All fingers extended in gentle open upward cup",
    palmOrientation: "Palms facing upward toward sky",
    wristOrientation: "Wrists kept aligned with hands",
    armPosition: "Elbows slightly bent, forearms extending forward together",
    movementSequence: "Both hands sweep smoothly forward from chest offering something to another person",
    animationDuration: 2.2,
    facialExpression: "Warm, generous, welcoming smile with polite forward nod",
    animationVerified: true,
    description: "Hold both hands in front of the body, with the palms facing upward and the fingers gently curved. Move the hands forward together as if offering something to another person. Keep the elbows slightly bent and the wrists aligned with the hands.",
    supported: true,
    animationKey: "give",
  },

  // -------------------------------------------------------------
  // 38. PUSH
  // -------------------------------------------------------------
  {
    id: "push",
    word: "Push",
    meaningHindi: "धक्का देना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands made into firm closed fists in front of chest",
    leftHandPose: "Symmetric fist thrusting forward alongside right fist",
    rightHandPose: "Fist in front of chest thrusting forward as if pushing object",
    fingerPositions: "All fingers tightly curled into fists, thumbs folded across fingers",
    palmOrientation: "Knuckles facing forward towards user",
    wristOrientation: "Wrists maintained firmly aligned with forearms",
    armPosition: "Elbows bent in front of chest, then moving both forearms forward",
    movementSequence: "Both forearms thrust forward powerfully as if pushing an object away",
    animationDuration: 2.0,
    facialExpression: "Determined, firm exertion expression with forward focus",
    animationVerified: true,
    description: "Make both hands into fists and position them in front of the chest. Keep the elbows bent, then move both forearms forward as if pushing an object away. Maintain the fist shape and keep the wrists aligned with the forearms.",
    supported: true,
    animationKey: "push",
  },

  // -------------------------------------------------------------
  // 39. CRY
  // -------------------------------------------------------------
  {
    id: "cry",
    word: "Cry",
    meaningHindi: "रोना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Index fingers extended, remaining fingers gently curled",
    leftHandPose: "Left index finger tracing tears down left cheek",
    rightHandPose: "Right index finger tracing tears down right cheek",
    fingerPositions: "Index fingers straight, middle, ring, pinky curled into palm",
    palmOrientation: "Palms facing inward toward cheeks",
    wristOrientation: "Wrists following the downward stroke along cheeks",
    armPosition: "Elbows slightly bent, hands raised toward eyes",
    movementSequence: "Index fingers move downward along cheeks repeatedly representing tears",
    animationDuration: 2.2,
    facialExpression: "Sorrowful, emotional expression with downturned mouth and soft brow",
    animationVerified: true,
    description: "Raise both hands toward the eyes, keeping the index fingers extended and the remaining fingers gently curled. Move the hands downward along the cheeks to represent tears, with the elbows slightly bent and the wrists following the movement.",
    supported: true,
    animationKey: "cry",
  },

  // -------------------------------------------------------------
  // 40. SLEEP
  // -------------------------------------------------------------
  {
    id: "sleep",
    word: "Sleep",
    meaningHindi: "सोना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands raised toward sides of face, fingers gently curved",
    leftHandPose: "Curved relaxed hand near left temple/cheek",
    rightHandPose: "Curved relaxed hand near right temple/cheek",
    fingerPositions: "Fingers softly curved in relaxed repose",
    palmOrientation: "Palms facing inward toward sides of face",
    wristOrientation: "Relaxed soft wrists",
    armPosition: "Elbows bent, bringing hands closer to face",
    movementSequence: "Hands brought near face/temples while head tilts gently resting to the side",
    animationDuration: 2.4,
    facialExpression: "Peaceful, serene expression with gentle head tilt as if resting asleep",
    animationVerified: true,
    description: "Raise both hands toward the sides of the face, with the fingers gently curved. Bring the hands closer to the face while keeping the elbows bent. Maintain relaxed wrists and position the hands near the eyes or temples, as illustrated.",
    supported: true,
    animationKey: "sleep",
  },

  // -------------------------------------------------------------
  // 41. SIT DOWN
  // -------------------------------------------------------------
  {
    id: "sit_down",
    word: "Sit Down",
    meaningHindi: "बैठना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands with fingers slightly bent, palms oriented toward each other",
    leftHandPose: "Symmetric hand moving downward across from right hand",
    rightHandPose: "Positioned in front of body, moving downward together",
    fingerPositions: "Fingers slightly bent in gentle downward arc",
    palmOrientation: "Palms oriented toward each other across body midline",
    wristOrientation: "Wrists kept aligned with forearms",
    armPosition: "Elbows relaxed, forearms descending together in front of body",
    movementSequence: "Both hands move downward together to indicate sitting down",
    animationDuration: 2.0,
    facialExpression: "Calm, settling expression with slight downward nod",
    animationVerified: true,
    description: "Position both hands in front of the body, with the fingers slightly bent and the palms oriented toward each other. Move the hands downward together to indicate sitting down, keeping the elbows relaxed and the wrists aligned with the forearms.",
    supported: true,
    animationKey: "sit_down",
  },

  // -------------------------------------------------------------
  // 42. KICK
  // -------------------------------------------------------------
  {
    id: "kick",
    word: "Kick",
    meaningHindi: "लात मारना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "One hand with index finger extended, remaining fingers curled",
    leftHandPose: "Resting relaxed at side",
    rightHandPose: "Held in front of body, index extended, moving forward in kicking motion",
    fingerPositions: "Index finger extended straight, remaining fingers curled into palm",
    palmOrientation: "Palm facing inward/downward",
    wristOrientation: "Wrist aligned firmly with forearm",
    armPosition: "Elbow slightly bent, hand in front of body snapping forward",
    movementSequence: "Hand snaps forward in a short, controlled motion representing kicking action",
    animationDuration: 1.8,
    facialExpression: "Sharp, energetic focus matching the forward kicking motion",
    animationVerified: true,
    description: "Hold one hand in front of the body, with the index finger extended and the remaining fingers curled. Move the hand forward in a short, controlled motion to represent the kicking action. Keep the elbow slightly bent and the wrist aligned with the forearm.",
    supported: true,
    animationKey: "kick",
  },

  // -------------------------------------------------------------
  // 43. WAIT
  // -------------------------------------------------------------
  {
    id: "wait",
    word: "Wait",
    meaningHindi: "इंतजार करना / रुकना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands with fingers curled and wrists bent slightly downward",
    leftHandPose: "Symmetric hand in front of body held relatively still",
    rightHandPose: "Fingers curled, wrist bent slightly downward in expectant wait posture",
    fingerPositions: "Fingers curled in relaxed downward cup",
    palmOrientation: "Palms facing inward/downward",
    wristOrientation: "Wrists bent slightly downward",
    armPosition: "Elbows bent comfortably in front of mid-abdomen",
    movementSequence: "Hands held relatively still maintaining the illustrated waiting position",
    animationDuration: 2.2,
    facialExpression: "Patient, expectant expression with calm attentive gaze",
    animationVerified: true,
    description: "Hold both hands in front of the body, with the fingers curled and the wrists bent slightly downward. Keep the elbows bent and the hands relatively still, maintaining the illustrated hand position to represent waiting.",
    supported: true,
    animationKey: "wait",
  },

  // -------------------------------------------------------------
  // 44. WALK
  // -------------------------------------------------------------
  {
    id: "walk",
    word: "Walk",
    meaningHindi: "चलना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands with fingers curled and index fingers pointing downward",
    leftHandPose: "Index pointing downward, stepping forward and backward alternately",
    rightHandPose: "Index pointing downward, stepping alternately with left hand",
    fingerPositions: "Index fingers extended pointing down like legs, other fingers curled",
    palmOrientation: "Palms facing inward toward body",
    wristOrientation: "Wrists kept stable pointing index fingers down",
    armPosition: "Elbows slightly bent in front of body",
    movementSequence: "Hands move alternately forward and backward to represent walking strides",
    animationDuration: 2.0,
    facialExpression: "Steady, pleasant walking rhythm with relaxed natural expression",
    animationVerified: true,
    description: "Position both hands in front of the body, with the fingers curled and the index fingers pointing downward. Move the hands alternately forward and backward to represent walking, keeping the elbows slightly bent and the wrists stable.",
    supported: true,
    animationKey: "walk",
  },

  // -------------------------------------------------------------
  // 45. WASH
  // -------------------------------------------------------------
  {
    id: "wash",
    word: "Wash",
    meaningHindi: "धोना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands brought together, fingers curved, palms facing each other",
    leftHandPose: "Left curved palm rubbing against right palm in circular motion",
    rightHandPose: "Right curved palm rubbing against left palm in circular lathering",
    fingerPositions: "Fingers curved around each other in washing lather",
    palmOrientation: "Palms facing each other in active contact",
    wristOrientation: "Wrists move naturally and flexibly with rubbing motion",
    armPosition: "Elbows bent in front of chest/solar plexus",
    movementSequence: "Hands move against each other in an active circular rubbing motion",
    animationDuration: 2.2,
    facialExpression: "Engaged, clean, attentive hygiene expression with downward gaze",
    animationVerified: true,
    description: "Bring both hands together in front of the body, with the fingers curved and the palms facing each other. Move the hands against each other in a rubbing motion, keeping the elbows bent and allowing the wrists to move naturally.",
    supported: true,
    animationKey: "wash",
  },

  // -------------------------------------------------------------
  // 46. LOOK
  // -------------------------------------------------------------
  {
    id: "look",
    word: "Look",
    meaningHindi: "देखना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "One hand near face, index and middle extended in 'V', others curled",
    leftHandPose: "Resting relaxed at side",
    rightHandPose: "Hand raised near face, directing outward from face to represent looking",
    fingerPositions: "Index and middle fingers extended straight in 'V', others curled",
    palmOrientation: "Palm facing inward toward face then outward toward target",
    wristOrientation: "Wrist kept aligned with forearm",
    armPosition: "Elbow bent, hand moving outward from eye level",
    movementSequence: "Hand raised near eyes then directed smoothly outward from face",
    animationDuration: 2.0,
    facialExpression: "Attentive, sharp, clear eye gaze looking forward along finger direction",
    animationVerified: true,
    description: "Raise one hand near the face, with the index and middle fingers extended and the other fingers curled. Direct the hand outward from the face to represent looking, keeping the elbow bent and the wrist aligned with the forearm.",
    supported: true,
    animationKey: "look",
  },

  // -------------------------------------------------------------
  // 47. JUMP
  // -------------------------------------------------------------
  {
    id: "jump",
    word: "Jump",
    meaningHindi: "कूदना / छलांग",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands in front of body, fingers curled, palms oriented inward",
    leftHandPose: "Symmetric upward spring beside right hand",
    rightHandPose: "Hands move upward together in spring arc to represent jumping",
    fingerPositions: "Fingers curled inward in spring crouch",
    palmOrientation: "Palms oriented inward toward body",
    wristOrientation: "Wrists follow the upward leaping movement",
    armPosition: "Elbows slightly bent, moving upward together in spring motion",
    movementSequence: "Both hands propel upward together in a joyful spring jumping arc",
    animationDuration: 2.0,
    facialExpression: "Bouncy, playful, joyful jumping expression with head bouncing upward",
    animationVerified: true,
    description: "Hold both hands in front of the body, with the fingers curled and the palms oriented inward. Move both hands upward together to represent jumping, keeping the elbows slightly bent and the wrists following the upward movement.",
    supported: true,
    animationKey: "jump",
  },

  // -------------------------------------------------------------
  // 48. QUIET / SHHH
  // -------------------------------------------------------------
  {
    id: "quiet",
    word: "Quiet",
    meaningHindi: "शांत / चुप",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Single right index finger extended vertically upright placed directly on mouth, wrist turned 45 degrees up, elbow turned 180 degrees towards mouth; all remaining fingers and thumb tightly closed into a firm fist; left hand relaxed at side",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Index finger extended vertically upright directly on center of lips with wrist turned 45 degrees up and elbow turned 180 degrees towards mouth",
    fingerPositions: "Index finger extended vertically straight upright onto mouth; thumb folded tightly across curled middle, ring, and pinky fingers in closed fist",
    palmOrientation: "Back of right hand facing forward / slightly outward towards camera",
    wristOrientation: "Turned 45 degrees upward towards mouth with forearm turned 180 degrees",
    armPosition: "Right arm with elbow turned 180 degrees towards mouth and wrist turned 45 degrees up bringing index finger directly on mouth; left arm relaxed down at side",
    movementSequence: "Right elbow turns 180 degrees towards mouth and wrist turns 45 degrees up placing index finger directly on mouth, all remaining fingers and thumb tightly closed into a firm fist; left arm rests at side",
    animationDuration: 2.2,
    facialExpression: "Calm, serene expression with lips closed in silence",
    animationVerified: true,
    description: "Single right index finger extended vertically upright placed directly on the mouth with the wrist turned 45 degrees up and elbow turned 180 degrees towards the mouth; all remaining fingers (middle, ring, pinky) and thumb tightly closed into a firm fist; left arm resting relaxed at side.",
    supported: true,
    animationKey: "quiet",
  },

  // -------------------------------------------------------------
  // 49. LOUD
  // -------------------------------------------------------------
  {
    id: "loud",
    word: "Loud",
    meaningHindi: "ज़ोर / शोर / चिल्लाना",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Both hands cupped around mouth sides forming a megaphone funnel (PRESET_CUPPED_SHOUT_MOUTH), then thrusting forward and opening wide with spread fingers (PRESET_OPEN_SPREAD_5)",
    leftHandPose: "Brought to left side of mouth cupping the lips (X ~0.09m, Y ~1.52m, Z ~0.17m), then thrusts forward and outward into shouting megaphone flare (X ~0.22m, Y ~1.54m, Z ~0.35m)",
    rightHandPose: "Brought to right side of mouth cupping the lips (X ~-0.09m, Y ~1.52m, Z ~0.17m), then thrusts forward and outward into shouting megaphone flare (X ~-0.22m, Y ~1.54m, Z ~0.35m)",
    fingerPositions: "Starts with four fingers straight and slightly cupped around mouth with thumb near jawline, then bursts open with all 5 fingers spread wide during shout",
    palmOrientation: "Palms start facing inward toward mouth corners forming a megaphone, then flare diagonally forward/outward as sound projects",
    wristOrientation: "Wrists aligned with forearm at mouth, then extend forward with acoustic sound tremor during peak shout",
    armPosition: "Both elbows flexed bringing hands to mouth sides, then both arms extend forward and flare outward in expanding shout cone",
    movementSequence: "Both hands come up to cup both sides of mouth like shouting loudly, then project forward and outward with vibrating spread fingers and an open-mouth shouting expression",
    animationDuration: 2.4,
    facialExpression: "Intense shout expression with open mouth, raised eyebrows, and physical exertion of projecting sound loudly",
    animationVerified: true,
    description: "Both hands are brought up to cup both sides of the mouth like a megaphone when calling out or shouting loudly, then thrust forward and flare outward with spread fingers as sound projects into the distance.",
    supported: true,
    animationKey: "loud",
  },

  // -------------------------------------------------------------
  // 50. HAPPY
  // -------------------------------------------------------------
  {
    id: "happy",
    word: "Happy",
    meaningHindi: "खुश / प्रसन्नता",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Both hands placed in front of lower chest with right elbow turned 90° right-to-left and left elbow turned 90° left-to-right, flat palms facing chest (PRESET_OPEN_FLAT_B)",
    leftHandPose: "Starts at waist, ascends to lower chest with left elbow turned 90° from left to right, flat palm facing chest; wrist turns slowly from DOWN to UP brushing upward to collarbone",
    rightHandPose: "Starts at waist, ascends to lower chest with right elbow turned 90° from right to left, flat palm facing chest; wrist turns slowly from DOWN to UP brushing upward to collarbone",
    fingerPositions: "All fingers extended straight and held flat together with thumb relaxed alongside (PRESET_OPEN_FLAT_B)",
    palmOrientation: "Both palms facing inward toward the chest throughout the motion",
    wristOrientation: "Wrists turned 180° on both hands, starting turned DOWN pointing downward, then turning slowly from DOWN to UP brushing upward along chest",
    armPosition: "Right elbow turned 90° from right to left across chest, left elbow turned 90° from left to right across chest, forearms positioned horizontally in front of lower chest",
    movementSequence: "Both hands positioned at lower chest with elbows turned 90° inward and wrists turned 180°; wrists then turn slowly from DOWN to UP in repeated uplifting brushing sweeps along chest with warm joyful radiant smile",
    animationDuration: 2.8,
    facialExpression: "Warm, cheerful, radiant smile on the face (mouthSmile morph target = 0.95) with head tilted slightly upward and joyful uplifted expression",
    animationVerified: true,
    description: "Both flat hands positioned in front of lower chest with right elbow turned 90° from right to left and left elbow turned 90° from left to right, wrists turned 180°; after that wrists turn slowly from DOWN to UP to brush upward along chest to collarbones with a joyful radiant smile on the face (Verified from AI4Bharat INCLUDE Dataset).",
    supported: true,
    animationKey: "happy",
  },

  // -------------------------------------------------------------
  // 51. SAD
  // -------------------------------------------------------------
  {
    id: "sad",
    word: "Sad",
    meaningHindi: "उदास / दुःखी",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Both hands with index fingers extended straight and all other fingers (middle, ring, pinky) and thumbs tightly closed into fists; placed at both eyes, moving simultaneously from UP to DOWN along both cheeks; head drooping sadly downward",
    leftHandPose: "Left index finger placed at left eye tear line (X ~0.035m, Y ~1.618m, Z ~0.139m), then moves slowly from UP to DOWN along left cheek to jaw level (Y ~1.501m) tracing a tear; thumb and other fingers tightly closed",
    rightHandPose: "Right index finger placed at right eye tear line (X ~-0.035m, Y ~1.618m, Z ~0.139m), then moves slowly from UP to DOWN along right cheek to jaw level (Y ~1.501m) tracing a tear; thumb and other fingers tightly closed",
    fingerPositions: "Both index fingers extended straight upright; thumbs folded tightly across curled middle, ring, and pinky fingers in firm fists (PRESET_SAD_TEAR_INDEX_EYE)",
    palmOrientation: "Both palms facing diagonally inward/backward toward face with index fingertips tracing both cheeks",
    wristOrientation: "Both wrists aligned with cheek tear-line angle, pitching from UP (+0.15) to DOWN (-0.15) as fingers trace downward",
    armPosition: "Both arms bring index fingers directly to eye corners, then move simultaneously from UP to DOWN tracing tear trajectory",
    movementSequence: "Both hands with index fingers extended and thumbs/remaining fingers tightly closed in fists touch the eye tear lines, then move slowly and simultaneously from UP to DOWN along both cheeks tracing falling tears; head droops sadly downward",
    animationDuration: 2.6,
    facialExpression: "Sorrowful, mournful expression with head drooping downward and mouth corners turned down (mouthSmile = 0.0)",
    animationVerified: true,
    description: "In SAD, except the index finger all the fingers are closed with the thumb also closed in a fist on BOTH hands. Both index fingers are placed at the eyes and move simultaneously from UP to DOWN along the cheeks tracing falling tears with a sorrowful expression.",
    supported: true,
    animationKey: "sad",
  },

  // -------------------------------------------------------------
  // 52. BEAUTIFUL
  // -------------------------------------------------------------
  {
    id: "beautiful",
    word: "Beautiful",
    meaningHindi: "सुंदर / ख़ूबसूरत",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Right elbow turns 180 degrees from 3rd quadrant towards the mouth and wrist rotates 180 degrees towards the mouth with all fingers closed except index finger and thumb (L-handshape), circles contour of face with index finger, then closes index & thumb and opens 3 fingers pointing toward user with wrist at 90° of elbow; left hand rests at side",
    leftHandPose: "Resting naturally down at side doing nothing (neutral rest pose)",
    rightHandPose: "Elbow turns 180 degrees from 3rd quadrant towards mouth with wrist rotating 180 degrees towards mouth, index finger traces round circle around face, then closes index & thumb and presents 3 open fingers forward toward user with wrist bent 90° relative to elbow",
    fingerPositions: "Starts with index & thumb extended and middle/ring/pinky in fist (PRESET_BEAUTIFUL_L_HAND); finishes with index & thumb closed and middle/ring/pinky open straight (PRESET_BEAUTIFUL_THREE_FINGERS)",
    palmOrientation: "Facing inward toward face while index traces circle, then facing forward/downward toward user during 3-finger presentation",
    wristOrientation: "Rotates 180 degrees towards mouth as elbow turns 180 degrees towards mouth, then bends 90 degrees relative to elbow directing 3 fingers straight toward user",
    armPosition: "Right elbow turns 180 degrees from 3rd quadrant towards mouth level, traces round circle around face, lowers slightly to chest/chin level holding wrist at 90° to elbow pointing forward, then returns smoothly to side",
    movementSequence: "Turn elbow 180 degrees from 3rd quadrant towards the mouth and rotate wrist 180 degrees towards the mouth with all fingers closed except index and thumb (L-handshape), round with index finger on circle of own face, close index and thumb and open other three fingers pointing towards user with wrist at 90 degrees of elbow with radiant smile; left hand rests at side",
    animationDuration: 3.2,
    facialExpression: "Warm, admiring, radiant smile on avatar face (mouthSmile = 0.92) with gentle appreciative gaze",
    animationVerified: true,
    description: "In beautiful, turn the elbow 180 degrees towards the mouth and wrist also 180 degrees towards the mouth with all fingers closed except index finger and thumb, round with index finger on the circle of their own face, then close index finger and thumb and open another three fingers pointing towards the user with wrist at 90 degrees of the elbow.",
    supported: true,
    animationKey: "beautiful",
  },

  // -------------------------------------------------------------
  // 53. UGLY
  // -------------------------------------------------------------
  {
    id: "ugly",
    word: "Ugly",
    meaningHindi: "कुरूप / भद्दा",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Right hand in claw handshape (PRESET_CLAW_HAND) in front of face sweeps horizontally from left to right and pulls away sharply; left hand rests at side",
    leftHandPose: "Resting naturally down at side doing nothing (neutral rest pose)",
    rightHandPose: "Rises in front of nose/face with curved claw fingers, sweeps across face and pulls away sharply into space",
    fingerPositions: "All five fingers curved at PIP and DIP joints in firm claw shape (PRESET_CLAW_HAND)",
    palmOrientation: "Right palm facing inward toward face, then twisting outward as hand pulls away",
    wristOrientation: "Right wrist turns outward as hand pulls away from face",
    armPosition: "Right arm elevates hand in front of face, sweeps laterally from left to right across sightline, then drops back to side",
    movementSequence: "Right claw hand rises in front of face, sweeps horizontally across from left to right as if pulling a distorting mask away, and snaps outward; avatar turns head away in distaste",
    animationDuration: 2.6,
    facialExpression: "Displeased expression with wrinkled brow and head turned aside in distaste (mouthSmile = 0.0)",
    animationVerified: true,
    description: "Right claw hand rises in front of the face, sweeps horizontally across from left to right and pulls away sharply, while the avatar turns head slightly aside with a distasteful facial expression; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset).",
    supported: true,
    animationKey: "ugly",
  },

  // -------------------------------------------------------------
  // 54. DEAF
  // -------------------------------------------------------------
  {
    id: "deaf",
    word: "Deaf",
    meaningHindi: "बधिर / बहरा",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Right hand with index finger extended straight (PRESET_POINTING_1) touches right ear, then moves in smooth arc to touch mouth/chin; left hand rests at side",
    leftHandPose: "Resting naturally down at side doing nothing (neutral rest pose)",
    rightHandPose: "Ascends to touch right ear lobe with index fingertip, then moves forward to touch corner of mouth/chin",
    fingerPositions: "Right index finger extended straight; thumb folded across curled middle, ring, pinky fingers (PRESET_POINTING_1)",
    palmOrientation: "Palm facing inward toward side of head, then rotating toward mouth",
    wristOrientation: "Right wrist aligned with ear-to-mouth trajectory",
    armPosition: "Right arm elevates index finger to ear, arcs forward to lips/chin, then returns smoothly down to rest",
    movementSequence: "Right index finger touches right ear, then sweeps in smooth forward arc to touch corner of mouth/chin, indicating cannot hear and cannot speak; left hand rests at side",
    animationDuration: 2.8,
    facialExpression: "Attentive, respectful, neutral facial expression with direct eye contact",
    animationVerified: true,
    description: "Right hand with index finger extended touches the right ear, then moves forward in a smooth arc to touch near the lips/chin, expressing Deaf in Indian Sign Language; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset).",
    supported: true,
    animationKey: "deaf",
  },

  // -------------------------------------------------------------
  // 55. BLIND
  // -------------------------------------------------------------
  {
    id: "blind",
    word: "Blind",
    meaningHindi: "दृष्टिहीन / अंधा",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Right hand in V-handshape (PRESET_TWO_FINGERS_LOOK) points index and middle fingers toward eyes, then sweeps horizontally across sightline; left hand rests at side",
    leftHandPose: "Resting naturally down at side doing nothing (neutral rest pose)",
    rightHandPose: "Ascends to eye level with index and middle fingers pointing toward eyes, sweeps horizontally across both eyes",
    fingerPositions: "Index and middle fingers extended straight apart in V-shape; thumb folds over curled ring and pinky fingers (PRESET_TWO_FINGERS_LOOK)",
    palmOrientation: "Palm facing inward toward eyes, moving horizontally across sightline",
    wristOrientation: "Right wrist aligned with eye-level sweep angle",
    armPosition: "Right arm brings V-hand up to eye level, sweeps across from right to left, then lowers back to waist",
    movementSequence: "Right V-handshape points toward eyes at eye level, then sweeps horizontally across sightline to convey Blind; avatar head bows slightly with respectful expression",
    animationDuration: 2.7,
    facialExpression: "Solemn, respectful expression with eyelids gently softening and slight downward head bow",
    animationVerified: true,
    description: "Right hand in V-handshape points index and middle fingers toward the eyes at eye level, then sweeps horizontally across the sightline to convey Blind in Indian Sign Language; left hand rests at side (Verified from AI4Bharat INCLUDE Dataset).",
    supported: true,
    animationKey: "blind",
  },

  // -------------------------------------------------------------
  // 56. ANGRY
  // -------------------------------------------------------------
  {
    id: "angry",
    word: "Angry",
    meaningHindi: "गुस्सा / क्रोध",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Both hands form claw handshapes with bent tense fingers rising from waist up to chest level",
    leftHandPose: "Claw hand rising up left side of torso with tense fingers",
    rightHandPose: "Claw hand rising up right side of torso with tense fingers",
    fingerPositions: "All fingers hooked in tense claw shape (PRESET_CLAW_HAND)",
    palmOrientation: "Palms facing inward toward upper torso and chest",
    wristOrientation: "Wrists flexed inward with firm tension",
    armPosition: "Both arms bent at elbows, pulling upward forcefully toward chest",
    movementSequence: "Both claw hands rise upward along chest with tense posture and furrowed brow expression",
    animationDuration: 2.6,
    facialExpression: "Intense furrowed-brow frown with focused gaze conveying anger",
    animationVerified: true,
    description: "Both hands in claw handshapes rise vigorously up the torso toward the upper chest while the avatar shows a strong furrowed-brow frown, indicating Anger in Indian Sign Language.",
    supported: true,
    animationKey: "angry",
  },

  // -------------------------------------------------------------
  // 57. GO
  // -------------------------------------------------------------
  {
    id: "go",
    word: "Go",
    meaningHindi: "जाओ / जाना",
    signLanguage: "ISL",
    category: "Actions",
    type: "individual",
    handConfiguration: "Both hands with index fingers extended point forward and arc smoothly away from body",
    leftHandPose: "Left index finger pointing forward and thrusting toward destination",
    rightHandPose: "Right index finger pointing forward and thrusting toward destination",
    fingerPositions: "Index fingers fully extended (PRESET_POINTING_1), other fingers curled into fist",
    palmOrientation: "Palms facing slightly inward and downward",
    wristOrientation: "Wrists flexing forward in directional pointing motion",
    armPosition: "Both arms start at mid-chest and push forward toward horizon",
    movementSequence: "Both index fingers point and thrust forward away from body in decisive directional arc",
    animationDuration: 2.4,
    facialExpression: "Attentive, forward-focused gaze indicating direction",
    animationVerified: true,
    description: "Both index fingers point and thrust forward away from the body in an outward directional arc, indicating Go in Indian Sign Language.",
    supported: true,
    animationKey: "go",
  },

  // -------------------------------------------------------------
  // 58. DEAD
  // -------------------------------------------------------------
  {
    id: "dead",
    word: "Dead",
    meaningHindi: "मृत / मरा हुआ",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Both flat hands start palm-up in front of waist and flip 180° over to palm-down",
    leftHandPose: "Left flat hand starts palm-up and rotates 180 degrees over to palm-down",
    rightHandPose: "Right flat hand starts palm-up and rotates 180 degrees over to palm-down",
    fingerPositions: "All fingers extended straight together in flat B-handshape (PRESET_OPEN_FLAT_B to PRESET_FLAT_PALM_DOWN)",
    palmOrientation: "Starts facing upward toward ceiling, finishes facing downward toward ground",
    wristOrientation: "Wrists rotate simultaneously in 180-degree turnover motion",
    armPosition: "Both forearms held horizontal at waist level, rotating outward and over",
    movementSequence: "Both flat open palms start facing upward and roll simultaneously 180 degrees over into palm-down position",
    animationDuration: 2.8,
    facialExpression: "Solemn, respectful facial expression",
    animationVerified: true,
    description: "Both open flat hands start facing upward and simultaneously flip 180 degrees downward, the canonical Indian Sign Language gesture for Dead (Trained on AI4Bharat INCLUDE Adjective 1file videos MVI_9699-9826).",
    supported: true,
    animationKey: "dead",
  },

  // -------------------------------------------------------------
  // 59. HIGH
  // -------------------------------------------------------------
  {
    id: "high",
    word: "High",
    meaningHindi: "ऊँचा / उच्च",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Right hand in open flat B-handshape moves straight upward from chest to above head",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Starts at upper chest level with flat palm facing downward, moves steadily straight upward above head level",
    fingerPositions: "All five fingers extended straight and held together in flat B-handshape (PRESET_OPEN_FLAT_B)",
    palmOrientation: "Palm facing downward toward floor, elevating smoothly upward",
    wristOrientation: "Right wrist aligned horizontal with palm facing down",
    armPosition: "Right arm elevates steadily upward from chest height to high above crown",
    movementSequence: "Right flat hand rises smoothly straight upward from chest height to well above the head to demonstrate high height",
    animationDuration: 2.2,
    facialExpression: "Attentive, upward-tilted gaze indicating elevated height",
    animationVerified: true,
    description: "Right flat hand held horizontally with palm facing downward moves steadily upward from chest level to high above the head, indicating High in Indian Sign Language (AI4Bharat INCLUDE Adjective).",
    supported: true,
    animationKey: "high",
  },

  // -------------------------------------------------------------
  // 60. LOW
  // -------------------------------------------------------------
  {
    id: "low",
    word: "Low",
    meaningHindi: "नीचा / कम",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Right hand in open flat B-handshape moves downward from chest toward waist",
    leftHandPose: "Resting down naturally at side doing nothing (neutral rest pose)",
    rightHandPose: "Starts at mid-chest level with flat palm facing downward, presses steadily downward toward waist level",
    fingerPositions: "All five fingers extended straight and held together in flat B-handshape (PRESET_OPEN_FLAT_B)",
    palmOrientation: "Palm facing downward toward floor",
    wristOrientation: "Right wrist aligned straight with downward-pressing forearm",
    armPosition: "Right arm lowers deliberately from chest level toward waist/hip level",
    movementSequence: "Right flat hand lowers deliberately from mid-chest height toward waist level with controlled deceleration",
    animationDuration: 2.0,
    facialExpression: "Slight downward head nod acknowledging low level",
    animationVerified: true,
    description: "Right flat hand held horizontally with palm facing downward moves steadily downward from chest level toward the waist, indicating Low in Indian Sign Language.",
    supported: true,
    animationKey: "low",
  },

  // -------------------------------------------------------------
  // 61. NARROW
  // -------------------------------------------------------------
  {
    id: "narrow",
    word: "Narrow",
    meaningHindi: "संकरा / पतला / संकीर्ण",
    signLanguage: "ISL",
    category: "Descriptors",
    type: "individual",
    handConfiguration: "Both open flat B-hands held vertically facing each other move inward until closely spaced",
    leftHandPose: "Left flat hand starts wide at left chest, moves inward toward center",
    rightHandPose: "Right flat hand starts wide at right chest, moves inward toward center",
    fingerPositions: "All fingers extended straight together with thumbs pointing upward in flat B-handshapes (PRESET_OPEN_FLAT_B)",
    palmOrientation: "Both palms vertical facing directly inward toward each other across chest width",
    wristOrientation: "Both wrists aligned straight with forearms in vertical plane",
    armPosition: "Both forearms held horizontal at chest level, moving inward toward each other symmetrically",
    movementSequence: "Both flat vertical palms held ~35cm apart move smoothly inward toward each other until palms are closely spaced (~6cm apart)",
    animationDuration: 2.4,
    facialExpression: "Focused, attentive expression with slightly squinted eyes indicating spatial narrowness",
    animationVerified: true,
    description: "Both open flat hands with vertical palms facing inward move symmetrically closer together until only a few centimeters apart, expressing Narrow in Indian Sign Language (AI4Bharat INCLUDE Adjective).",
    supported: true,
    animationKey: "narrow",
  },
];


