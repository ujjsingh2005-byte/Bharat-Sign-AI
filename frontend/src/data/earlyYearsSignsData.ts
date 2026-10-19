/**
 * EARLY YEARS - EVERYDAY THINGS WE DO
 * 16 Action Verbs Structured Data
 * 
 * Sourced from the primary Early Years Foundation Stage (EYFS) visual reference
 * representing British Sign Language (BSL) / Makaton preschool signing curriculum,
 * with cross-references to Indian Sign Language (ISL) and American Sign Language (ASL).
 */

export interface MovementStep {
  stepNumber: number;
  title: string;
  description: string;
  visualCue: string;
}

export interface EarlyYearsSign {
  id: string;
  order: number;
  word: string;
  hindi: string;
  category: "Daily Activities" | "Movement" | "Social Actions" | "Communication and Expression" | "Other Actions";
  meaning: string;
  physicalVsLinguistic: string;
  image: string;
  posterThumb: string;
  signLanguage: string;
  handshape: string | null;
  startingPosition: string | null;
  movementSteps: MovementStep[];
  endingPosition: string | null;
  dominantHand: "dominant" | "both_symmetric" | "both_asymmetric";
  palmOrientation: string | null;
  fingerPositions: string | null;
  movementDirection: string | null;
  handsTogetherOrSeparate: string | null;
  facialExpression: string | null;
  exampleSentence: string;
  hindiSentence: string;
  commonMistakes: string[];
  referenceUrl: string | null;
  referenceSource: string;
  verificationStatus: "verified" | "needs_verification";
  interactiveAnimationType: string;
}

export const EARLY_YEARS_CATEGORIES = [
  "All",
  "Daily Activities",
  "Movement",
  "Social Actions",
  "Communication and Expression",
  "Other Actions",
] as const;

export type EarlyYearsCategory = (typeof EARLY_YEARS_CATEGORIES)[number];

export const EARLY_YEARS_SIGNS: EarlyYearsSign[] = [
  // 1. DRINK
  {
    id: "drink",
    order: 1,
    word: "Drink",
    hindi: "पीना",
    category: "Daily Activities",
    meaning: "The action of swallowing water, milk, or another refreshing beverage.",
    physicalVsLinguistic:
      "Physical drinking involves holding a real glass and pouring liquid into the mouth. The linguistic sign uses a symbolic 'C' or cylindrical handshape held in front of the mouth and tilted upward twice without liquid.",
    image: "/early_years_signs/drink.svg",
    posterThumb: "/early_years_signs/drink.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Curved 'C' / Cylindrical Grip handshape",
    startingPosition: "Dominant hand held near chin level, thumb and curled fingers forming an imaginary cup, palm facing left/inward.",
    endingPosition: "Hand tilted upward toward lower lip twice in a double drinking pulse.",
    dominantHand: "dominant",
    palmOrientation: "Palm facing inward toward the face, tilting upward.",
    fingerPositions: "All 4 fingers curled together; thumb opposed to fingers with a cup-width space.",
    movementDirection: "Upward and tilted toward the mouth in two gentle arc pulses.",
    handsTogetherOrSeparate: "Dominant hand only.",
    facialExpression: "Neutral, pleasant expression with mouth slightly pursed as if sipping.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Cup Grip Ready",
        description: "Form a curved 'C' handshape with your dominant hand, holding it 3 inches below your lower lip.",
        visualCue: "Curved thumb and fingers mimicking holding a lightweight tumbler.",
      },
      {
        stepNumber: 2,
        title: "Tilt to Lip",
        description: "Pivot your wrist upward, bringing the imaginary cup rim close to your bottom lip.",
        visualCue: "Wrist flexes backward smoothly so fingertips raise toward mouth.",
      },
      {
        stepNumber: 3,
        title: "Double Sip Return",
        description: "Lower slightly and repeat the tilt once more, concluding the sign near mouth height.",
        visualCue: "Two gentle rhythmic tilts; avoid touching the skin directly.",
      },
    ],
    exampleSentence: "I drink water when I feel thirsty.",
    hindiSentence: "जब मुझे प्यास लगती है तब मैं पानी पीता/पीती हूँ।",
    commonMistakes: [
      "Touching the lips aggressively with fingers instead of leaving a small air gap.",
      "Over-tilting the whole head backward instead of moving the wrist.",
      "Using two hands when BSL/Makaton uses the dominant hand only.",
    ],
    referenceUrl: "https://www.bslzone.co.uk/",
    referenceSource: "BSL SignBank & NDCS Early Years Signs Dictionary",
    verificationStatus: "verified",
    interactiveAnimationType: "cup_tilt_double",
  },

  // 2. EAT
  {
    id: "eat",
    order: 2,
    word: "Eat",
    hindi: "खाना",
    category: "Daily Activities",
    meaning: "The action of putting solid food into the mouth and swallowing it for nourishment.",
    physicalVsLinguistic:
      "Physical eating involves chewing real food or using utensils. The sign uses a bunched 'flat-O' handshape where all fingertips meet the thumb tip, tapping toward the mouth twice.",
    image: "/early_years_signs/eat.svg",
    posterThumb: "/early_years_signs/eat.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Flat-O / Bunched fingertips touching thumb",
    startingPosition: "Dominant bunched hand held 2 inches in front of mouth level, palm facing inward.",
    endingPosition: "Fingertips tap lightly near the lips twice before resting in front of the mouth.",
    dominantHand: "dominant",
    palmOrientation: "Palm facing directly toward the mouth/chin.",
    fingerPositions: "All four fingertips gathered neatly together, touching the thumb pad.",
    movementDirection: "Forward and backward in two short, delicate tapping pulses toward the lips.",
    handsTogetherOrSeparate: "Dominant hand only; non-dominant hand remains resting or cupped near waist.",
    facialExpression: "Content expression, slight mouthing of the word 'eat' or soft chewing mime.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Bunched Food Pinch",
        description: "Bring your dominant thumb and all four fingertips together in a bunched pinch shape.",
        visualCue: "Fingertips clustered closely, resembling holding a morsel of food.",
      },
      {
        stepNumber: 2,
        title: "First Mouth Tap",
        description: "Move the hand gently forward to lightly touch or hover right in front of your lips.",
        visualCue: "Wrist remains stable while forearm moves forward 1-2 inches.",
      },
      {
        stepNumber: 3,
        title: "Second Tap & Hold",
        description: "Pull back slightly and tap toward the mouth a second time, settling in front of the chin.",
        visualCue: "A clear double tap establishes the verb 'eat'.",
      },
    ],
    exampleSentence: "Let us eat our lunch together at the table.",
    hindiSentence: "आइए हम सब मिलकर मेज़ पर खाना खाते हैं।",
    commonMistakes: [
      "Sticking fingers inside the mouth or licking fingertips.",
      "Only tapping once (a single tap can mean 'food' as a noun in certain contexts).",
      "Spreading fingers wide open instead of keeping the bunched pinch.",
    ],
    referenceUrl: "https://www.ndcs.org.uk/",
    referenceSource: "National Deaf Children's Society (NDCS) Family Sign Language",
    verificationStatus: "verified",
    interactiveAnimationType: "pinch_mouth_double_tap",
  },

  // 3. CLIMB
  {
    id: "climb",
    order: 3,
    word: "Climb",
    hindi: "चढ़ना",
    category: "Movement",
    meaning: "Going upward or ascending by using hands and feet on a ladder, tree, or stairs.",
    physicalVsLinguistic:
      "Physical climbing requires full-body muscular leverage against a structure. In BSL sign language, curved gripping hands alternately reach upward and pull downward in front of the torso.",
    image: "/early_years_signs/climb.svg",
    posterThumb: "/early_years_signs/climb.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Curved claw / Grip handshape",
    startingPosition: "Both hands held in front of chest at eye/head height, hands in loose gripping claws.",
    endingPosition: "Hands finish alternating two cycles, ending with dominant hand held high.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing forward/away from the body.",
    fingerPositions: "Fingers curved at knuckles as if gripping imaginary ladder rungs.",
    movementDirection: "Alternating vertical reaching: one hand reaches up while other pulls down.",
    handsTogetherOrSeparate: "Both hands move alternately in a rhythmic hand-over-hand pattern.",
    facialExpression: "Eyes looking upward with a focused, determined expression.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Grip Upper Rung",
        description: "Reach your right hand up above head level with a curved grip, left hand at shoulder level.",
        visualCue: "Palms face away, fingers bent around imaginary rungs.",
      },
      {
        stepNumber: 2,
        title: "Alternate Left Hand High",
        description: "Pull your right hand down as your left hand reaches up above head level.",
        visualCue: "Smooth handover mimicking ascending ladder rungs.",
      },
      {
        stepNumber: 3,
        title: "Second Upward Climb",
        description: "Reach the right hand up once more to complete two full climbing cycles.",
        visualCue: "Maintain gaze looking upward to reinforce direction of climb.",
      },
    ],
    exampleSentence: "The children love to climb the playground frame.",
    hindiSentence: "बच्चे खेल के मैदान के झूले पर चढ़ना पसंद करते हैं।",
    commonMistakes: [
      "Moving both hands upward together simultaneously instead of alternating.",
      "Keeping palms facing inward toward the chest instead of facing forward.",
      "Looking down at the floor instead of gazing upward toward the climbing goal.",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank (UCL Deafness Cognition and Language Research Centre)",
    verificationStatus: "verified",
    interactiveAnimationType: "alternate_ladder_climb",
  },

  // 4. RUN
  {
    id: "run",
    order: 4,
    word: "Run",
    hindi: "दौड़ना",
    category: "Movement",
    meaning: "Moving quickly on foot with rapid strides faster than a walk.",
    physicalVsLinguistic:
      "Physical running propels the body through space using legs. The sign uses athletic bent elbows with closed fists pumping forward and backward rhythmically by the ribs.",
    image: "/early_years_signs/run.svg",
    posterThumb: "/early_years_signs/run.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Closed Fist ('S' handshape) or hooked index finger",
    startingPosition: "Elbows bent at 90-degree angles beside lower ribs, fists closed in front of waist.",
    endingPosition: "Hands complete 2-3 rapid forward-and-back pumping cycles beside the ribs.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing inward toward each other.",
    fingerPositions: "All fingers curled tightly into palms with thumbs braced across fingers.",
    movementDirection: "Horizontal alternating pump: right arm forward while left moves back.",
    handsTogetherOrSeparate: "Both hands pump rapidly in opposition (athletic running cadence).",
    facialExpression: "Determined gaze, mouth slightly parted with quick puffs of breath.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Athletic Runner Stance",
        description: "Tuck your elbows to your sides at 90 degrees with fists clenched and palms facing each other.",
        visualCue: "Upper body leans slightly forward with shoulders engaged.",
      },
      {
        stepNumber: 2,
        title: "Forward Pump",
        description: "Drive your right fist forward while your left fist pulls back toward your hip.",
        visualCue: "Quick, energetic movement imitating athletic arm swing.",
      },
      {
        stepNumber: 3,
        title: "Reverse & Repeat",
        description: "Drive your left fist forward while your right pulls back; repeat for 2-3 cycles.",
        visualCue: "Crisp, snappy rhythm gives the sign its energetic meaning.",
      },
    ],
    exampleSentence: "He can run very fast in the morning race.",
    hindiSentence: "वह सुबह की दौड़ में बहुत तेज़ दौड़ सकता है।",
    commonMistakes: [
      "Flailing the arms out wide like a windmill instead of keeping elbows close to ribs.",
      "Pumping both hands together at the same time instead of in alternating cadence.",
      "Signing too slowly; the speed of the arm pump conveys the concept of speed.",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank & British Deaf Association (BDA)",
    verificationStatus: "verified",
    interactiveAnimationType: "athletic_fist_pump",
  },

  // 5. FALL
  {
    id: "fall",
    order: 5,
    word: "Fall",
    hindi: "गिरना",
    category: "Movement",
    meaning: "Losing balance and tumbling downward to the ground by accident.",
    physicalVsLinguistic:
      "Physical falling is an involuntary body crash. In BSL, the classifier inverted 'V' handshape (representing two human legs) stands on a flat base palm and suddenly topples over onto its side.",
    image: "/early_years_signs/fall.svg",
    posterThumb: "/early_years_signs/fall.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Dominant inverted 'V' (two extended fingers); Non-dominant flat 'B' palm",
    startingPosition: "Non-dominant hand flat horizontally at waist height, palm facing up. Dominant inverted 'V' stands on it.",
    endingPosition: "Dominant 'V' fingers slip, tilt backward, and drop flat onto their back or side on the base palm.",
    dominantHand: "both_asymmetric",
    palmOrientation: "Base hand palm up; dominant hand palm facing signer, then tilting sideways/down.",
    fingerPositions: "Dominant index and middle fingers extended apart (legs); non-dominant all fingers flat together (ground).",
    movementDirection: "Sudden downward and sideways topple.",
    handsTogetherOrSeparate: "Dominant hand acts upon the passive non-dominant base hand.",
    facialExpression: "Surprised or shocked expression with wide eyes and open mouth.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Legs Standing on Ground",
        description: "Hold your non-dominant hand flat like the ground. Stand your dominant inverted 'V' fingers on it.",
        visualCue: "Fingertips touch the base palm lightly, representing a person standing upright.",
      },
      {
        stepNumber: 2,
        title: "Slip & Lose Balance",
        description: "Suddenly pivot your dominant wrist so the 'legs' slide and tilt backward.",
        visualCue: "A sharp break in posture depicting the moment of tripping.",
      },
      {
        stepNumber: 3,
        title: "Topple Flat",
        description: "Drop the dominant fingers flat onto the non-dominant palm with a slight final impact.",
        visualCue: "Fingers finish lying horizontal, representing a fallen person.",
      },
    ],
    exampleSentence: "Be careful on the wet floor so you do not fall.",
    hindiSentence: "गीले फर्श पर ध्यान से चलो ताकि तुम गिर न जाओ।",
    commonMistakes: [
      "Dropping the hands downward without using the classifier leg representation.",
      "Moving the base hand instead of keeping it steady as the ground reference.",
      "Keeping a dull or smiling face; facial expression must convey the accidental tumble.",
    ],
    referenceUrl: "https://www.bslzone.co.uk/",
    referenceSource: "BSL SignBank Classifier Verbs & SpreadTheSign BSL",
    verificationStatus: "verified",
    interactiveAnimationType: "classifier_v_topple",
  },

  // 6. GIVE
  {
    id: "give",
    order: 6,
    word: "Give",
    hindi: "देना",
    category: "Social Actions",
    meaning: "Handing over or transferring an object or kindness to another person.",
    physicalVsLinguistic:
      "Physical giving requires handing a tangible item. The linguistic sign uses open cupped hands moving in a smooth directional arc outward from the signer's body toward the recipient.",
    image: "/early_years_signs/give.svg",
    posterThumb: "/early_years_signs/give.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Flat or gently cupped open hand ('B' or open 'O')",
    startingPosition: "Both hands held in front of chest at solar plexus level, palms facing upward toward ceiling.",
    endingPosition: "Hands extended forward toward the person being addressed, palms remaining upward.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing upward, fingers pointing forward.",
    fingerPositions: "All fingers extended together with natural slight curve, thumb relaxed outward.",
    movementDirection: "Smooth horizontal forward arc extending outward toward the recipient.",
    handsTogetherOrSeparate: "Both hands move forward together in unison.",
    facialExpression: "Warm, open smile with welcoming eye contact directed toward the other person.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Hands Open at Chest",
        description: "Place both hands in front of your lower chest with palms facing straight up toward the ceiling.",
        visualCue: "Palms held flat like two trays holding a thoughtful gift.",
      },
      {
        stepNumber: 2,
        title: "Forward Offering Arc",
        description: "Glide both hands smoothly forward toward the person you are communicating with.",
        visualCue: "Arms extend halfway forward without locking the elbows.",
      },
      {
        stepNumber: 3,
        title: "Present & Hold",
        description: "Hold the open palms steady for a brief pause at the end of the gesture.",
        visualCue: "Clear directional delivery toward the recipient.",
      },
    ],
    exampleSentence: "Please give me the storybook to read.",
    hindiSentence: "कृपया मुझे पढ़ने के लिए कहानी की किताब दीजिए।",
    commonMistakes: [
      "Turning palms facing downward, which changes the meaning to 'drop' or 'place'.",
      "Moving hands too quickly or aggressively instead of with a generous, gentle glide.",
      "Forgetting that this is a directional verb that points toward whoever is receiving.",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank Directional Verbs & Makaton Foundation",
    verificationStatus: "verified",
    interactiveAnimationType: "palms_up_forward_present",
  },

  // 7. PUSH
  {
    id: "push",
    order: 7,
    word: "Push",
    hindi: "धकेलना",
    category: "Other Actions",
    meaning: "Applying physical force with the hands to move an object or obstacle away from oneself.",
    physicalVsLinguistic:
      "Physical pushing presses against real solid mass. The linguistic sign uses two flat vertical palms starting close to the chest and driving forward with visible muscular control.",
    image: "/early_years_signs/push.svg",
    posterThumb: "/early_years_signs/push.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Flat open hands ('B' handshape), fingers together, thumbs tucked",
    startingPosition: "Both hands positioned directly in front of shoulders, palms facing forward, fingers pointing up.",
    endingPosition: "Arms extended forward with palms remaining flat and vertical, finishing with a firm stop.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing directly forward away from the signer's chest.",
    fingerPositions: "Fingers straight and touching each other; thumb pressed gently beside index finger.",
    movementDirection: "Straight forward away from the body with muscular tension.",
    handsTogetherOrSeparate: "Both hands move forward simultaneously in parallel alignment.",
    facialExpression: "Slight tension in the jaw or cheeks, lips pressed together indicating physical effort.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Brace at Chest",
        description: "Bring both hands in front of your chest with flat vertical palms facing straight forward.",
        visualCue: "Elbows bent comfortably beside ribs, fingers pointing straight up.",
      },
      {
        stepNumber: 2,
        title: "Firm Forward Drive",
        description: "Press both hands straight forward as if moving a heavy cardboard box away from you.",
        visualCue: "Arms extend forward in parallel lines with steady speed.",
      },
      {
        stepNumber: 3,
        title: "Controlled Stop",
        description: "Stop cleanly with arms three-quarters extended, maintaining flat vertical palm planes.",
        visualCue: "Firm stop signals the end of the pushing exertion.",
      },
    ],
    exampleSentence: "We must push the heavy door open to enter.",
    hindiSentence: "अंदर जाने के लिए हमें भारी दरवाज़ा धकेलना होगा।",
    commonMistakes: [
      "Flicking the wrists forward loosely instead of keeping flat, firm palms.",
      "Spreading the fingers wide apart like a wave.",
      "Pushing to the side instead of directly in front along the line of action.",
    ],
    referenceUrl: "https://www.spreadthesign.com/",
    referenceSource: "SpreadTheSign International & BSL SignBank",
    verificationStatus: "verified",
    interactiveAnimationType: "flat_palms_forward_press",
  },

  // 8. CRY
  {
    id: "cry",
    order: 8,
    word: "Cry",
    hindi: "रोना",
    category: "Communication and Expression",
    meaning: "Shedding tears and expressing sadness, grief, or discomfort.",
    physicalVsLinguistic:
      "Physical crying produces biological tears. The sign iconically traces the paths of tears flowing down both cheeks using extended or slightly curled index fingers.",
    image: "/early_years_signs/cry.svg",
    posterThumb: "/early_years_signs/cry.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Extended index finger ('G' handshape or curved index)",
    startingPosition: "Index fingertips positioned just below the lower eyelashes of each eye, palms facing inward.",
    endingPosition: "Index fingers finish tracing down to jawline level with small downward strokes.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing inward toward the cheeks.",
    fingerPositions: "Index finger extended; remaining fingers curled into a loose fist.",
    movementDirection: "Downward along the cheekbones in repeated tear-tracking strokes.",
    handsTogetherOrSeparate: "Both hands trace down both cheeks simultaneously or in alternating tears.",
    facialExpression: "Sad, sympathetic expression with downturned lip corners and furrowed brows.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Touch Below Eyes",
        description: "Place your index fingertips gently 1 inch below your lower eyelids on each cheek.",
        visualCue: "Fingertips hovering close to cheekbones, thumbs and other fingers curled.",
      },
      {
        stepNumber: 2,
        title: "Trace Tears Down",
        description: "Glide both index fingers downward along your cheeks toward your mouth level.",
        visualCue: "Slow downward path tracing where tears stream down the face.",
      },
      {
        stepNumber: 3,
        title: "Repeat Downward Stroke",
        description: "Lift fingers slightly back to eye level and repeat the downward stroke once more.",
        visualCue: "Two gentle downward strokes reinforce the falling tears iconicity.",
      },
    ],
    exampleSentence: "The little baby started to cry when she dropped her toy.",
    hindiSentence: "जब खिलौना गिर गया तो नन्ही बच्ची रोने लगी।",
    commonMistakes: [
      "Poking the actual eyeball instead of staying safely below on the cheekbone.",
      "Rubbing the eyes vigorously like cleaning glasses instead of tracing downward tears.",
      "Smiling while signing 'cry', which creates conflicting non-manual grammatical signals.",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank & NDCS Early Years Sign Guide",
    verificationStatus: "verified",
    interactiveAnimationType: "tear_trace_cheeks_down",
  },

  // 9. SLEEP
  {
    id: "sleep",
    order: 9,
    word: "Sleep",
    hindi: "सोना",
    category: "Daily Activities",
    meaning: "Resting the mind and body in slumber, usually in bed with eyes closed.",
    physicalVsLinguistic:
      "Physical sleeping is an unconscious biological state. The sign is an iconic pillow gesture: resting the tilted head sideways onto one or both flat palms beside the cheek.",
    image: "/early_years_signs/sleep.svg",
    posterThumb: "/early_years_signs/sleep.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Flat open hand ('B' handshape) or two hands pressed together",
    startingPosition: "Hand(s) held open near dominant cheek, head upright and relaxed.",
    endingPosition: "Head tilted comfortably onto the flat hand pillow beside the cheek, held for 1 second.",
    dominantHand: "dominant",
    palmOrientation: "Palm facing the cheek, fingers pointing diagonally upward.",
    fingerPositions: "All fingers flat and aligned closely together.",
    movementDirection: "Head tilts laterally toward the shoulder to meet the cushioning hand.",
    handsTogetherOrSeparate: "Dominant hand rests beside cheek; or both hands pressed together like a pillow.",
    facialExpression: "Peaceful closed eyes, soft relaxed jaw, tranquil resting state.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Hand Cushion Ready",
        description: "Bring your dominant flat hand up beside your right cheek with palm facing your cheek.",
        visualCue: "Hand acts like a cozy cushion resting in mid-air.",
      },
      {
        stepNumber: 2,
        title: "Head Tilt to Pillow",
        description: "Gently tilt your head sideways until your cheek rests lightly against your fingers/palm.",
        visualCue: "Neck relaxes into a lateral tilt toward the right shoulder.",
      },
      {
        stepNumber: 3,
        title: "Eyes Close Softly",
        description: "Close both eyes gently for a brief moment, holding the sleeping posture.",
        visualCue: "Non-manual facial signal (closed eyes) completes the full linguistic sign.",
      },
    ],
    exampleSentence: "It is late night and time to sleep peacefully.",
    hindiSentence: "काफी रात हो चुकी है और अब चैन से सोने का समय है।",
    commonMistakes: [
      "Slapping the side of the head with the hand instead of a gentle resting contact.",
      "Keeping eyes wide open, which contradicts the linguistic non-manual marker for sleep.",
      "Tilting head forward instead of sideways toward the palm cushion.",
    ],
    referenceUrl: "https://www.bslzone.co.uk/",
    referenceSource: "BSL SignBank & Makaton Core Vocabulary",
    verificationStatus: "verified",
    interactiveAnimationType: "head_tilt_pillow_rest",
  },

  // 10. SIT DOWN
  {
    id: "sit-down",
    order: 10,
    word: "Sit Down",
    hindi: "बैठना",
    category: "Other Actions",
    meaning: "Lowering one's body onto a chair, bench, or the floor to take a seat.",
    physicalVsLinguistic:
      "Physical sitting requires bending the knees and dropping weight onto a seat. In Early Years classroom BSL/Makaton signing, both flat palms press downward in a calm settling motion to signal sitting down.",
    image: "/early_years_signs/sit-down.svg",
    posterThumb: "/early_years_signs/sit-down.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Flat open hands ('B' handshape), palms facing down",
    startingPosition: "Both hands held in front of torso at waist/belly height, palms parallel to floor.",
    endingPosition: "Hands press downward 6 inches toward mid-thigh height, coming to a gentle rest.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing down toward the floor, fingers pointing forward.",
    fingerPositions: "All fingers flat and extended straight forward.",
    movementDirection: "Smooth downward pressing motion in the vertical plane.",
    handsTogetherOrSeparate: "Both hands move downward simultaneously in unison.",
    facialExpression: "Attentive, calm expression with head nodding slightly downward with the motion.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Level Palms at Waist",
        description: "Hold both hands in front of your waist with flat palms facing straight down at the ground.",
        visualCue: "Forearms parallel to floor, fingers relaxed forward.",
      },
      {
        stepNumber: 2,
        title: "Downward Settling Motion",
        description: "Press both hands straight down 5-6 inches in a smooth, calming gesture.",
        visualCue: "Hands move together like smoothing an invisible cushion onto a chair.",
      },
      {
        stepNumber: 3,
        title: "Seat Level Hold",
        description: "Settle the hands at upper thigh level for a moment before relaxing.",
        visualCue: "A clear stopping level indicates taking one's seat.",
      },
    ],
    exampleSentence: "Please sit down quietly on the carpet for story time.",
    hindiSentence: "कृपया कहानी सुनने के लिए कालीन पर शांति से बैठ जाइए।",
    commonMistakes: [
      "Moving hands too quickly like a karate chop instead of a calming settling press.",
      "Flipping palms upward during the motion.",
      "Confusing with the classifier sign for sitting (bent 'V' over base finger) used in adult conversation.",
    ],
    referenceUrl: "https://www.ndcs.org.uk/",
    referenceSource: "NDCS Early Years Classroom Signs & BSL SignBank",
    verificationStatus: "verified",
    interactiveAnimationType: "palms_down_settle_press",
  },

  // 11. KICK
  {
    id: "kick",
    order: 11,
    word: "Kick",
    hindi: "लात मारना",
    category: "Movement",
    meaning: "Striking a ball or target forcefully with the foot or lower leg.",
    physicalVsLinguistic:
      "Physical kicking swings the anatomical leg through air. In linguistic signing, either a simulated foot flick is used or the dominant index finger/hand sharply flicks forward under a base palm to depict striking a ball.",
    image: "/early_years_signs/kick.svg",
    posterThumb: "/early_years_signs/kick.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Dominant pointing index finger / fist; Non-dominant horizontal base palm",
    startingPosition: "Dominant hand held beneath the non-dominant palm, wrist cocked back ready to flick.",
    endingPosition: "Dominant hand/finger snaps sharply forward and upward in a kicking arc.",
    dominantHand: "both_asymmetric",
    palmOrientation: "Base hand palm down; dominant hand palm facing inward/left.",
    fingerPositions: "Dominant index finger straight or closed fist; base hand fingers extended flat.",
    movementDirection: "Sharp forward and upward snap mimicking the trajectory of a kicking leg.",
    handsTogetherOrSeparate: "Dominant hand strikes forward from under the passive base palm.",
    facialExpression: "Excited, focused gaze directed toward an imaginary ball target.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Load the Leg",
        description: "Hold your non-dominant hand flat horizontally. Cock your dominant hand back below it.",
        visualCue: "Dominant hand represents the coiled leg ready to strike.",
      },
      {
        stepNumber: 2,
        title: "Strike Forward Arc",
        description: "Snap your dominant hand/finger sharply forward and upward past the base palm.",
        visualCue: "Crisp kicking flick, imitating the sudden impact against a ball.",
      },
      {
        stepNumber: 3,
        title: "Follow Through",
        description: "Allow the hand to finish pointing forward along the ball's flight line.",
        visualCue: "Momentum holds for a split second showing where the kick traveled.",
      },
    ],
    exampleSentence: "Kick the football into the goal post!",
    hindiSentence: "फुटबॉल को गोल पोस्ट की तरफ लात मारो!",
    commonMistakes: [
      "Swinging the whole body wildly instead of isolating the sign in neutral space.",
      "Performing the flick with no snap, which looks like a lazy point rather than a kick.",
      "Dropping the base hand before the kicking stroke is completed.",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank (Sports & Action Signs)",
    verificationStatus: "needs_verification",
    interactiveAnimationType: "foot_flick_strike_arc",
  },

  // 12. WAIT
  {
    id: "wait",
    order: 12,
    word: "Wait",
    hindi: "इंतज़ार करना",
    category: "Social Actions",
    meaning: "Staying in place patiently until a scheduled time, instruction, or event arrives.",
    physicalVsLinguistic:
      "Physical waiting is standing or sitting over elapsed minutes. The linguistic sign holds both open hands in front of the body with gentle wiggling fingers or a steady hold indicating patience and delay.",
    image: "/early_years_signs/wait.svg",
    posterThumb: "/early_years_signs/wait.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Open hands ('5' handshape), slightly relaxed fingers",
    startingPosition: "Both hands held forward in neutral space at mid-chest height, palms facing down or slightly toward chest.",
    endingPosition: "Hands maintain steady hold in place with gentle rhythmic finger wave, held for 2 seconds.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing down toward the floor or tilted slightly upward.",
    fingerPositions: "Fingers slightly spread apart, relaxing and wiggling gently in succession.",
    movementDirection: "Held stationary in space; fingers flutter gently or hold a calm pause.",
    handsTogetherOrSeparate: "Both hands held symmetrically side-by-side.",
    facialExpression: "Patient, expectant expression with slightly raised eyebrows indicating anticipation.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Present Open Hands",
        description: "Extend both hands forward at mid-chest height, palms facing downwards toward floor.",
        visualCue: "Fingers slightly spread, wrists relaxed and steady.",
      },
      {
        stepNumber: 2,
        title: "Patient Flutter Hold",
        description: "Gently ripple or hold your fingers steady in place without moving your forearms.",
        visualCue: "A quiet, patient stillness communicates the delay of waiting.",
      },
      {
        stepNumber: 3,
        title: "Hold for Cue",
        description: "Maintain the sign steadily for 1-2 seconds with an expectant eye gaze.",
        visualCue: "Pause reinforces that action is temporarily on hold.",
      },
    ],
    exampleSentence: "Please wait here until your turn comes.",
    hindiSentence: "कृपया अपनी बारी आने तक यहाँ इंतज़ार कीजिए।",
    commonMistakes: [
      "Waving hands vigorously like saying goodbye instead of a gentle stationary flutter.",
      "Fidgeting arms back and forth, which ruins the concept of calm patience.",
      "Confusing with the sign for 'stop' (which uses a sharp vertical blocking palm).",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank & Makaton Early Vocabulary",
    verificationStatus: "verified",
    interactiveAnimationType: "open_palms_patient_flutter",
  },

  // 13. WALK
  {
    id: "walk",
    order: 13,
    word: "Walk",
    hindi: "चलना",
    category: "Movement",
    meaning: "Traveling on foot at a moderate, steady pace by taking alternating steps.",
    physicalVsLinguistic:
      "Physical walking steps the whole human body across the room. In BSL and Indian Sign Language (ISL), the inverted 'V' handshape (index and middle fingers pointing down) takes alternating steps across neutral space.",
    image: "/early_years_signs/walk.svg",
    posterThumb: "/early_years_signs/walk.svg",
    signLanguage: "British Sign Language (BSL) / Indian Sign Language (ISL) / Makaton",
    handshape: "Inverted 'V' handshape (index and middle fingers pointing downward)",
    startingPosition: "Dominant hand held in front of torso at waist height, index and middle fingers pointed down like two legs.",
    endingPosition: "Fingers take 3-4 alternating walking strides forward across space.",
    dominantHand: "dominant",
    palmOrientation: "Palm facing inward toward the signer's torso, fingers pointing down.",
    fingerPositions: "Index and middle fingers extended apart; thumb holds ring and pinky fingers against palm.",
    movementDirection: "Forward across horizontal signing space in alternating leg strides.",
    handsTogetherOrSeparate: "Dominant hand acts as human legs walking; non-dominant hand rests or acts as ground.",
    facialExpression: "Neutral or cheerful expression, head nodding gently to the rhythm of the walking pace.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Inverted Legs Ready",
        description: "Point your dominant index and middle fingers downward like a miniature pair of walking legs.",
        visualCue: "Hold hand at waist level, thumb securing ring and pinky fingers.",
      },
      {
        stepNumber: 2,
        title: "Step 1: Index Forward",
        description: "Step your index finger forward while swinging the middle finger slightly backward.",
        visualCue: "Simulates the heel-to-toe stride of human locomotion.",
      },
      {
        stepNumber: 3,
        title: "Step 2: Middle Forward",
        description: "Swing your middle finger forward past the index finger; repeat for 2-3 alternating steps.",
        visualCue: "Smooth walking rhythm moving steadily across front space.",
      },
    ],
    exampleSentence: "We can walk together in the green park.",
    hindiSentence: "हम सब मिलकर हरे-भरे पार्क में चल सकते हैं।",
    commonMistakes: [
      "Pointing the 'V' fingers upward (which means 'two' or 'peace') instead of pointing them down.",
      "Moving both fingers forward at the same time (which turns into 'jump' or 'hop').",
      "Walking the hand too fast so it blurs into running.",
    ],
    referenceUrl: "https://islrtc.nic.in/",
    referenceSource: "ISLRTC (Indian Sign Language Research & Training Centre) & BSL SignBank",
    verificationStatus: "verified",
    interactiveAnimationType: "inverted_v_strides",
  },

  // 14. WASH
  {
    id: "wash",
    order: 14,
    word: "Wash",
    hindi: "धोना",
    category: "Daily Activities",
    meaning: "Cleaning hands, face, or items with soap and water to maintain hygiene.",
    physicalVsLinguistic:
      "Physical washing requires soap, tap water, and a basin. The linguistic sign iconically mimics rubbing the palms, backs, and fingers together in circular lathering strokes.",
    image: "/early_years_signs/wash.svg",
    posterThumb: "/early_years_signs/wash.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "Curved flat hands ('B' or loose cup handshape)",
    startingPosition: "Both hands meet in front of chest at mid-rib height, palms facing each other.",
    endingPosition: "Hands complete two circular lathering rubs, ending in front of the lower chest.",
    dominantHand: "both_symmetric",
    palmOrientation: "Palms facing each other, rubbing in opposite circular paths.",
    fingerPositions: "Fingers slightly curved, sliding across opposite palm and fingers.",
    movementDirection: "Circular rubbing motion around each other in the vertical plane.",
    handsTogetherOrSeparate: "Both hands interact continuously, rubbing against each other.",
    facialExpression: "Pleasant, caring smile, eyes looking down toward hands demonstrating clean hygiene.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Hands Meet in Center",
        description: "Bring both hands together in front of your chest with palms facing each other.",
        visualCue: "Hands positioned as if holding a slippery bar of soap.",
      },
      {
        stepNumber: 2,
        title: "First Circular Rub",
        description: "Rub your palms together in a circular lathering stroke, rotating right hand over left.",
        visualCue: "Hands slide smoothly over each other's palm surfaces.",
      },
      {
        stepNumber: 3,
        title: "Reverse Lather & Settle",
        description: "Continue the circular motion for a second full lather rotation, then relax.",
        visualCue: "Two distinct circular cycles clearly convey washing hands.",
      },
    ],
    exampleSentence: "Always wash your hands with soap before eating.",
    hindiSentence: "खाना खाने से पहले हमेशा अपने हाथ साबुन से धोएं।",
    commonMistakes: [
      "Clapping hands together loudly instead of sliding them in circular friction.",
      "Rubbing only the fingertips instead of the whole palm surface.",
      "Confusing with 'applause' in sign language (which is twisting open hands raised high).",
    ],
    referenceUrl: "https://www.ndcs.org.uk/",
    referenceSource: "NDCS Hygiene & Health Vocabulary & BSL SignBank",
    verificationStatus: "verified",
    interactiveAnimationType: "circular_palm_lather",
  },

  // 15. LOOK
  {
    id: "look",
    order: 15,
    word: "Look",
    hindi: "देखना",
    category: "Communication and Expression",
    meaning: "Directing the eyes toward a person, object, or scene to perceive and observe it.",
    physicalVsLinguistic:
      "Physical looking uses optical vision. The linguistic sign uses the 'V' handshape (index and middle fingers spread) extended from eye level straight forward toward whatever is being looked at.",
    image: "/early_years_signs/look.svg",
    posterThumb: "/early_years_signs/look.svg",
    signLanguage: "British Sign Language (BSL) / Makaton (EYFS Reference)",
    handshape: "'V' handshape (index and middle fingers spread like two eye beams)",
    startingPosition: "Dominant 'V' fingertips held 1-2 inches in front of dominant eye, pointing forward.",
    endingPosition: "Hand extends 5-6 inches forward along the visual sight line, held for a moment.",
    dominantHand: "dominant",
    palmOrientation: "Palm facing inward toward the face as fingers point forward.",
    fingerPositions: "Index and middle fingers extended apart in a 'V'; thumb holds other fingers closed.",
    movementDirection: "Straight forward along the line of sight toward the object being viewed.",
    handsTogetherOrSeparate: "Dominant hand only; non-dominant hand remains resting comfortably.",
    facialExpression: "Wide, alert, attentive eyes with head turned toward the target direction.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Aim from Eyes",
        description: "Form a 'V' handshape with your dominant hand and bring the tips close to your right eye.",
        visualCue: "Two fingers represent the two eyes directing their gaze forward.",
      },
      {
        stepNumber: 2,
        title: "Cast Gaze Forward",
        description: "Move the hand smoothly forward 5-6 inches in the exact direction you want someone to look.",
        visualCue: "Hand travels forward like a beam of light from the eyes.",
      },
      {
        stepNumber: 3,
        title: "Direct Eye Lock",
        description: "Lock your own eye gaze in the same direction the fingers are pointing.",
        visualCue: "Gaze alignment is an essential non-manual grammatical component of 'look'.",
      },
    ],
    exampleSentence: "Look at the colorful rainbow shining in the sky!",
    hindiSentence: "आसमान में चमकते हुए रंग-बिरंगे इंद्रधनुष को देखो!",
    commonMistakes: [
      "Pointing only one finger like 'there' instead of the two-fingered 'V' sign for sight.",
      "Looking away from the direction your fingers are pointing.",
      "Starting from the chest or neck instead of directly from eye level.",
    ],
    referenceUrl: "https://bslsignbank.ucl.ac.uk/",
    referenceSource: "BSL SignBank & SpreadTheSign International",
    verificationStatus: "verified",
    interactiveAnimationType: "v_hand_sight_beam",
  },

  // 16. JUMP
  {
    id: "jump",
    order: 16,
    word: "Jump",
    hindi: "कूदना",
    category: "Movement",
    meaning: "Pushing oneself off the ground into the air by using the leg muscles.",
    physicalVsLinguistic:
      "Physical jumping lifts the real human body off the floor. In BSL and ISL, the dominant inverted 'V' (legs classifier) crouches bent on the base palm, then springs high into the air.",
    image: "/early_years_signs/jump.svg",
    posterThumb: "/early_years_signs/jump.svg",
    signLanguage: "British Sign Language (BSL) / Indian Sign Language (ISL) / Makaton",
    handshape: "Dominant inverted 'V' handshape (legs); Non-dominant flat horizontal palm (ground)",
    startingPosition: "Non-dominant hand flat horizontally at waist level. Dominant bent 'V' rests on the palm.",
    endingPosition: "Dominant hand springs high into the air 6-8 inches above base palm, landing back down.",
    dominantHand: "both_asymmetric",
    palmOrientation: "Base hand palm facing up; dominant hand palm facing signer.",
    fingerPositions: "Dominant index and middle fingers bent at knuckles like crouching knees, then springing straight.",
    movementDirection: "Vertical upward leap into the air, followed by a light landing back on the base palm.",
    handsTogetherOrSeparate: "Dominant hand leaps off the stationary non-dominant base palm.",
    facialExpression: "Excited, buoyant expression with eyebrows raised high on the upward leap.",
    movementSteps: [
      {
        stepNumber: 1,
        title: "Crouch on Ground",
        description: "Hold your non-dominant hand flat like the floor. Place your dominant bent 'V' fingers crouching on it.",
        visualCue: "Bent knuckles look like knees bent, ready to jump.",
      },
      {
        stepNumber: 2,
        title: "Spring High into Air",
        description: "Spring your dominant hand straight up 6-8 inches above the palm, straightening fingers in air.",
        visualCue: "Fast, energetic upward bounce depicting being airborne.",
      },
      {
        stepNumber: 3,
        title: "Land Back on Base",
        description: "Bring the fingers down to land lightly back on the non-dominant palm with knees bending again.",
        visualCue: "A clean landing completes the full jump cycle.",
      },
    ],
    exampleSentence: "The children jump high with joy and laughter.",
    hindiSentence: "बच्चे खुशी और हंसी से ऊंची छलांग लगाकर कूदते हैं।",
    commonMistakes: [
      "Jumping the entire body rather than demonstrating the sign cleanly with hands.",
      "Keeping the base hand moving up and down; the base hand must remain steady like the earth.",
      "Not straightening fingers at the peak of the jump to show full extension.",
    ],
    referenceUrl: "https://islrtc.nic.in/",
    referenceSource: "ISLRTC & BSL SignBank Classifiers",
    verificationStatus: "verified",
    interactiveAnimationType: "classifier_v_spring_jump",
  },
];
