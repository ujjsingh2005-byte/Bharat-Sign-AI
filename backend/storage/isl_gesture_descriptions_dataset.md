# BHARAT SIGN AI — EXACT ISL GESTURE DESCRIPTIONS & KINEMATICS DATASET
# Format: Ground-Truth Verified Descriptions, Video Mapping, and Rig Retargeting

---

## 1. SAD (उदासी / शोक)
**Reference Video**: `canonical_sad` / AI4Bharat INCLUDE Adjective 4
**Class ID**: 10
**Category**: Adjectives / Emotions
**Involves Hands**: Both Hands (Bilateral Synchronous)
**Timing**: Duration 2.4s, 1 Continuous Sweep

### Verified Gesture Description:
"In SAD, except the index finger all the fingers are closed with the thumb also closed in a fist on BOTH hands. Both index fingers are placed at the eyes and move simultaneously from UP to DOWN along the cheeks tracing falling tears with a sorrowful expression."

### Kinematic & Anatomical Parameters:
- **Handshape**: Preset Modified G-Handshape / Tear Pointer (`PRESET_SAD_TEAR_INDEX_EYE`).
  - Index finger: Extended with slight distal dip downward along cheek.
  - Middle, Ring, Pinky: Fully flexed into palm (flexion = 0.90–0.95).
  - Thumb: Closed across radial aspect of flexed middle finger.
- **Starting Position**: Index fingertips positioned 2 cm lateral to the inferior orbital rim of both eyes at eye level (+1.65m relative to floor).
- **Movement Trajectory**: Vertical linear downward sweep along anterior facial planes toward the jawline (~14 cm displacement).
- **Final Position**: Index fingertips terminate at the lower mandibular border near chin level; hands lower back toward neutral rest.
- **Facial Expression & Head**: Downward head tilt (pitch = +0.06 rad), relaxed forehead, corners of the mouth depressed into a solemn frown (`mouthFrown` = 0.55).
- **3D Avatar Rig Mapping**:
  - `head`: `[0.06, 0.0, 0.0]`, `neck`: `[0.03, 0.0, 0.0]`
  - `rightarm`: `[-1.05, -0.80, -1.40]`, `rightforearm`: `[-1.90, 1.30, 0.85]`, `righthand`: `[0.20, 0.55, -0.35]`
  - `leftarm`: `[-1.05, 0.80, 1.40]`, `leftforearm`: `[-1.90, -1.30, -0.85]`, `lefthand`: `[0.20, -0.55, 0.35]`

---

## 2. HAPPY (खुश / प्रसन्नता)
**Reference Video**: `happy_reference.mov` (`vid_846fea5634_happy_test.mov`) / INCLUDE Adjective 3
**Class ID**: 20
**Category**: Adjectives / Emotions
**Involves Hands**: Both Hands (Bilateral Synchronous Double Sweep)
**Timing**: Duration 2.76s (69 frames @ 25.0 FPS), 2 Repeated Upward Brushing Sweeps

### Verified Gesture Description:
"In HAPPY, all five fingers are fully straightened and held flat together with the thumb extended outward along the radial plane in an open flat B-handshape on BOTH hands. Both hands start in front of the lower abdomen/chest with palms facing inward toward the body, fingertips pointing obliquely upward and inward toward each other, and both elbows turned inward toward the torso. Both hands move simultaneously from DOWN to UP in a rhythmic upward brushing motion across the chest, briefly lifting outward and returning to repeat a second uplifting sweep, accompanied by an open smiling facial expression and a slight upward head tilt."

### Kinematic & Anatomical Parameters:
- **Handshape**: Flat Open B-Handshape (`PRESET_OPEN_FLAT_B`).
  - All fingers (Index, Middle, Ring, Pinky): Fully extended, adducted edge-to-edge.
  - Thumb: Extended flat in plane with the palm without crossing into the palm center.
- **Starting Position**: Palms placed directly in front of the lower sternum / epigastric region (~32 cm lateral wrist spacing).
- **Movement Trajectory**: Double arc sweep: upward chest-brushing motion (+18 cm vertical displacement), brief release forward-downward, followed by second identical upward chest brush.
- **Final Position**: Hands pause at clavicle height in front of the upper pectoral region before descending smoothly to the sides.
- **Facial Expression & Head**: Radiant positive facial expression with elevated zygomaticus muscles (`mouthSmile` = 0.85), open eyes, and subtle head nod.
- **3D Avatar Rig Mapping**:
  - `rightarm`: `[-0.38, 0.05, -0.95]`, `rightforearm`: `[-1.35, -0.30, -1.45]`, `righthand`: `[-2.14, 0.80, 1.94]`
  - `leftarm`: `[-0.38, -0.05, 0.95]`, `leftforearm`: `[-1.35, 0.30, 1.45]`, `lefthand`: `[-2.14, -0.80, -1.94]`
  - `mouthSmile`: `0.85`

---

## 3. LOUD (ज़ोर / शोर / चिल्लाना)
**Reference Video**: `loud_reference.mov` (`vid_e7c69ae3fb_loud_test.mov`) / INCLUDE Adjective 1
**Class ID**: 28
**Category**: Adjectives / Sensory
**Involves Hands**: Both Hands (Bilateral Outward Expansion)
**Timing**: Duration 2.24s (56 frames @ 25.0 FPS), 1 Powerful Expanding Pulse

### Verified Gesture Description:
"In LOUD, all five fingers on BOTH hands are fully extended, widely spread, and held stiffly open in a 5-spread handshape with thumbs abducted outward. Both hands start positioned close together in front of the upper chest and mouth area with palms facing outward and forward away from the signer. Both hands then thrust simultaneously and emphatically from IN to OUT and UPWARD in an explosive expanding pulse away from the head, opening wide toward the viewer to represent intense sonic volume, accompanied by wide open eyes, raised eyebrows, and an open mouth shout expression."

### Kinematic & Anatomical Parameters:
- **Handshape**: Open Spread 5 (`PRESET_OPEN_SPREAD_5`).
  - All fingers: Maximum abduction (inter-finger spread = 0.45 rad), full extension.
  - Thumb: Abducted 70° outward from index finger.
- **Starting Position**: Hands clustered tightly at chest/chin level (inter-wrist gap ~8 cm), elbows bent sharply in front of torso.
- **Movement Trajectory**: Rapid divergent explosive outward thrust (+28 cm horizontal spread, +15 cm depth expansion forward).
- **Final Position**: Hands held elevated at ear/head level, spread 65 cm apart, palms projected directly toward the conversational partner.
- **Facial Expression & Head**: High emotional intensity: wide eyes, raised eyebrows (`browInnerUp` = 0.65), jaw dropped open simulating a vocal shout (`jawOpen` = 0.60).
- **3D Avatar Rig Mapping**:
  - `rightarm`: `[-1.22, -1.05, -1.70]`, `rightforearm`: `[-2.28, 2.95, 0.80]`, `righthand`: `[0.15, 0.65, -0.45]`
  - `leftarm`: `[-1.22, 1.05, 1.70]`, `leftforearm`: `[-2.28, -2.95, -0.80]`, `lefthand`: `[0.15, -0.65, 0.45]`
  - `jawOpen`: `0.60`

---

## 4. NARROW (संकरा / पतला / संकीर्ण)
**Reference Video**: `canonical_narrow` / AI4Bharat INCLUDE Adjective 57
**Class ID**: 57
**Category**: Adjectives / Spatial Measurement
**Involves Hands**: Both Hands (Bilateral Symmetrical Inward Compression)
**Timing**: Duration 2.4s, 1 Focused Compression Motion

### Verified Gesture Description:
"In NARROW, all four fingers are kept straight and joined closely together with the thumb extended straight upward along the edge of the hand in a vertical flat B-handshape on BOTH hands. Both hands start elevated in front of the torso with palms facing directly inward toward each other, spread wide apart at shoulder width. Both hands move simultaneously along the horizontal X-axis from OUT to IN toward the center midline, closing down until only a very narrow gap of a few centimeters remains between the two vertical palms to demonstrate spatial tightness, accompanied by a focused, slightly squinting facial expression."

### Kinematic & Anatomical Parameters:
- **Handshape**: Vertical Flat B-Handshape (`PRESET_OPEN_FLAT_B`).
  - Fingers: Parallel, adducted edge-to-edge.
  - Thumb: Extended upward, non-opposed.
  - Palm Orientation: Sagittal alignment, palms planar and facing each other.
- **Starting Position**: Mid-chest level, shoulders abducted wide apart (wrist-to-wrist gap ~38 cm).
- **Movement Trajectory**: Pure horizontal medial translation along coronal plane toward sagittal midline (displacement ~16 cm per hand).
- **Final Position**: Hands brought within 5–6 cm of each other in front of the sternum, maintaining vertical parallel palm orientation.
- **Facial Expression & Head**: Attentive, focused squint (`eyeSquint` = 0.40) indicating constriction and precision.
- **3D Avatar Rig Mapping**:
  - `rightarm`: `[-0.20, 0.0, -0.08]`, `rightforearm`: `[-1.57, 0.05, 0.55]`, `righthand`: `[0.05, -0.05, 0.0]`
  - `leftarm`: `[-0.20, 0.0, 0.08]`, `leftforearm`: `[-1.57, -0.05, -0.55]`, `lefthand`: `[-0.05, 0.05, 0.0]`

---

## 5. HELLO / NAMASTE (नमस्ते / अभिवादन)
**Reference Video**: `canonical_hello` / ISL Core Vocabulary
**Class ID**: 22
**Category**: Greetings
**Involves Hands**: Right Hand (Dominant) / Optional Bilateral Anjali Mudra
**Timing**: Duration 2.4s, Forehead Touch followed by Outward Salutation Sweep

### Verified Gesture Description:
"In HELLO, the index, middle, ring, and pinky fingers are straightened together in an open flat handshape while the thumb is tucked flat against the side of the palm on the RIGHT hand. The right hand starts with the tips of the fingers lightly touching the right side of the forehead near the temple, palm facing forward and slightly inward. The hand then sweeps smoothly from IN to OUT, moving laterally away from the forehead in an open welcoming arc toward the conversational partner with the left hand resting neutrally at the side, accompanied by a courteous smile and a welcoming direct gaze."

### Kinematic & Anatomical Parameters:
- **Handshape**: Open Salutation B-Handshape.
- **Starting Position**: Right index/middle fingertips touching right temple / coronal forehead plane.
- **Movement Trajectory**: Arcuate lateral sweep (+24 cm outward, +6 cm forward).
- **Final Position**: Arm extended forward-right at upper chest level, palm facing outward.
- **Facial Expression & Head**: Pleasant welcoming smile (`mouthSmile` = 0.65), neutral chin elevation.
- **3D Avatar Rig Mapping**:
  - `rightarm`: `[-0.80, -0.10, -1.05]`, `rightforearm`: `[-2.00, 0.80, -0.45]`, `righthand`: `[0.40, -0.25, -0.65]`
  - `leftarm`: `NEUTRAL_REST_ARM_LEFT`


---

## 6. OLD / ELDERLY (बूढ़ा / वृद्ध / पुराना)
**Reference Video**: `MVI_9424.MOV` (from `adjective 1file` folder, 21 reference videos)
**Class ID**: 51
**Category**: Descriptors / Adjectives
**Involves Hands**: Right Hand (Dominant Compound Movement)
**Timing**: Duration 3.2s, Full EAT sign followed by hand placement behind the head

### Verified Gesture Description:
"In OLD, the right hand first performs the complete Indian Sign Language EAT gesture by bringing all four fingers and thumb pinched together in a morsel shape from the lower quadrant up to touch the lips. Immediately following the mouth contact, the right hand sweeps smoothly upward and backward behind the head to rest at the occiput/nape, demonstrating the passage of life and seniority, accompanied by a dignified, respectful elder facial expression."

### Kinematic & Anatomical Parameters:
- **Handshape**: Two-phase transition: Pinched Eating Morsel (`PRESET_PINCHED_EATING_MORSEL`) at mouth ──► Relaxed Open Palm (`PRESET_STANDBY_RELAXED`) behind head.
- **Starting Position**: Right hand positioned in lower quadrant (Quadrant III), then raised to lips/mouth.
- **Movement Trajectory**: Compound arc: Quadrant III to lips (+16 cm vertical), then lips up and around behind occiput/nape (+25 cm vertical, +35 cm depth backward).
- **Final Position**: Right hand rests behind the head; left hand remains relaxed in neutral rest at side.
- **Facial Expression & Head**: Modest forward head incline and dignified nod acknowledging elder status.
- **3D Avatar Rig Mapping**:
  - Phase 1 (Mouth): `rightarm`: `[-1.37, -0.45, -0.99]`, `rightforearm`: `[-1.95, 0.45, -0.65]`, `righthand`: `[-0.05, 3.11, 0.11]`
  - Phase 2 (Behind Head): `rightarm`: `[-1.55, -0.25, -1.40]`, `rightforearm`: `[-2.45, 0.90, 0.60]`, `righthand`: `[0.40, 0.25, -0.35]`
  - `leftarm`: `NEUTRAL_REST_ARM_LEFT`

---

## 7. YOUNG / YOUTH (युवा / जवान / नया)
**Reference Video**: `MVI_9504.MOV` (from `adjective 1file` folder; also `MVI_9505.MOV`, `MVI_9506.MOV`)
**Class ID**: 52
**Category**: Descriptors / Adjectives
**Involves Hands**: Right Hand (Dominant Single-Hand Dynamic Gesture)
**Timing**: Duration 2.36s (59 frames @ 25.0 FPS), 5-Phase Fluid Dynamic Trajectory

### Verified Gesture Description:
"In YOUNG, the right hand forms a compact bud with all four fingertips and the thumb closed together, starting from the side of the body beside the hip. The hand raises smoothly toward the face passing the mouth, nose, and eye area, and moves upward near the forehead and right temple with the elbow kept bent. The hand then sweeps outward and away from the head as the fingers and thumb blossom wide open, before lowering smoothly back down toward the side of the body to rest, accompanied by a lively, attentive youthful facial expression and direct gaze."

### Kinematic & Anatomical Parameters:
- **Handshape**: Two-phase Dynamic Morphing Handshape (Closed Bud Pinch `PRESET_PINCHED_EATING_MORSEL` ──► Blossoming Spread 5 `PRESET_OPEN_SPREAD_5`).
  - Phases 1–3 (0.0–1.4s): Thumb pad pressed firmly against index, middle, ring, and pinky pads in a compact bud.
  - Phase 4 (1.4–1.9s): Wide abduction and full extension of all five fingers as the hand sweeps away from the temple.
  - Phase 5 (1.9–2.36s): Hand relaxes back into neutral posture beside the body.
- **Starting Position**: Right hand resting beside the right hip/thigh, elbow relaxed down.
- **Movement Trajectory**:
  - Phase 1 (0.0–0.4s): Raise right hand from side toward face.
  - Phase 2 (0.4–0.8s): Move hand past mouth and nose toward eyes and upward to forehead.
  - Phase 3 (0.8–1.4s): Dwell near forehead and right temple, elbow bent.
  - Phase 4 (1.4–1.9s): Move raised hand outward and away from head while fingers blossom open.
  - Phase 5 (1.9–2.36s): Lower right hand smoothly back down beside body to rest.
- **Final Position**: Right hand terminates beside the body in neutral rest; left hand remains stationary beside the body throughout.
- **Facial Expression & Head**: Alert, youthful expression with eyes open, gentle upward gaze toward temple, and subtle confident nod.
- **3D Avatar Rig Mapping**:
  - `head`: `[0.02, 0.0, 0.0]`, `neck`: `[0.01, 0.0, 0.0]`
  - Phase 1–2 (Face): `rightarm`: `[-0.85, -0.25, -1.10]`, `rightforearm`: `[-1.85, 0.75, 0.35]`, `righthand`: `[0.20, -0.15, -0.30]`
  - Phase 3 (Forehead/Temple): `rightarm`: `[-1.05, -0.35, -1.30]`, `rightforearm`: `[-2.10, 0.95, 0.50]`, `righthand`: `[0.30, -0.20, -0.40]`
  - Phase 4 (Sweep Out): `rightarm`: `[-0.75, 0.20, -1.10]`, `rightforearm`: `[-1.40, 0.55, 0.15]`, `righthand`: `[0.15, -0.10, -0.15]`
  - Phase 5 (Rest): `rightarm`: `[-0.10, 0.05, -0.20]`, `rightforearm`: `[-0.15, 0.05, 0.05]`, `righthand`: `[0.05, 0.0, 0.0]`
  - `leftarm`: `NEUTRAL_REST_ARM_LEFT`
  - `mouthSmile`: `0.35`


---

## 8. UNVERIFIED_001 (विचाराधीन / PENDING)
**Reference Video**: `MVI_9431.MOV` (`SIGN_VIDEO_001`)
**Video Source**: User Provided Reference Video (`adjective 1file/MVI_9431.MOV`)
**Verification Status**: PENDING (`sign_meaning: UNVERIFIED`, `validation_status: PENDING`)
**Language**: Indian Sign Language (ISL)
**Duration**: 2.36 seconds (59 frames @ 25 FPS)
**Gesture Type**: Single-hand dynamic gesture (Primary hand: Right)
**Involves Hands**: Right Hand active, Left Hand stationary

### Verified Gesture Description (SAD-Style Paragraph):
"In UNVERIFIED_001, the thumb pad and index fingertip meet together forming a circular ring loop, while the middle, ring, and pinky fingers are fully extended straight upright and slightly splayed apart. The right hand starts in a neutral resting position beside the right hip, then smoothly raises upward to the right upper chest at clavicle level. The hand is held emphatically in front of the upper chest with the palm facing forward toward the viewer and the three extended fingers pointing straight up, accompanied by an attentive facial expression and a subtle affirmative nod, before lowering smoothly back down beside the hip into resting position while the left hand remains stationary beside the body throughout."

### Kinematic & Anatomical Parameters:
- **Handshape**: Calibrated F / OK / 9 Handshape (`PRESET_F_OK_HANDSHAPE`).
  - Thumb: Moderate opposition and flexion; pad presses directly against distal phalanx pad of index finger (`opposition: 0.65`, `cmc: 0.15`, `mcp: 0.25`, `ip: 0.20`).
  - Index Finger: Curved at MCP and PIP joints to complete closed circular ring loop with thumb (`base: 0.60`, `mid: 0.75`, `tip: 0.50`).
  - Middle Finger: Fully extended straight upright (`base: 0.05`, `mid: 0.02`, `tip: 0.00`, `spread: 0.08`).
  - Ring Finger: Fully extended straight upright (`base: 0.05`, `mid: 0.02`, `tip: 0.00`, `spread: 0.02`).
  - Pinky Finger: Fully extended straight upright (`base: 0.05`, `mid: 0.02`, `tip: 0.00`, `spread: -0.08`).
- **Starting Position**: Right hand resting down naturally beside the right hip (wrist `X ≈ 0.61`, `Y ≈ 0.81`, `Z ≈ 0.00`). Left hand resting beside left hip.
- **Movement Sequence & Timing**:
  - Phase 1 (0.00s – 0.90s / frames 0–22): Smooth ascent from hip toward upper chest while curling thumb and index into the circular ring.
  - Phase 2 (0.90s – 1.40s / frames 22–35): Apex hold in front of right upper chest (wrist `X ≈ 0.42`, `Y ≈ 0.43`, `Z ≈ -0.18`), palm facing forward toward user, three fingers upright, accompanied by slight affirmative head nod (`pitch: +0.02 to +0.06 rad`).
  - Phase 3 (1.40s – 2.00s / frames 35–50): Smooth descent returning hand toward hip along front of body.
  - Phase 4 (2.00s – 2.36s / frames 50–59): Neutral rest beside right hip.
- **Final Position**: Right hand rests beside body in standby posture; left hand remains resting at side throughout.
- **Facial Expression & Head**: Attentive, pleasant facial expression with direct forward gaze, slight smile (`mouthSmile: 0.30`), and affirmative nod during apex hold.
- **3D Avatar Rig Mapping**:
  - `head`: `[headPitch, 0.0, 0.0]`, `neck`: `[headPitch * 0.5, 0.0, 0.0]`
  - Rest at Hip: `rightarm`: `[-0.10, 0.05, -0.20]`, `rightforearm`: `[-0.15, 0.05, 0.05]`, `righthand`: `[0.05, 0.0, 0.0]`
  - Upper Chest Apex: `rightarm`: `[-0.60, 0.10, -0.85]`, `rightforearm`: `[-1.45, 0.35, 0.15]`, `righthand`: `[0.10, -0.15, -0.25]`
  - `leftarm`: `NEUTRAL_REST_ARM_LEFT`, `lefthand`: `PRESET_STANDBY_RELAXED`

---

## 9. UNVERIFIED_002 (विचाराधीन / PENDING)
**Reference Video**: `MVI_9432.MOV` (`SIGN_VIDEO_002`)
**Video Source**: User Provided Reference Video (`adjective 1file/MVI_9432.MOV`)
**Verification Status**: PENDING (`sign_meaning: UNVERIFIED`, `validation_status: PENDING`)
**Language**: Indian Sign Language (ISL)
**Duration**: 2.36 seconds (59 frames @ 25 FPS)
**Gesture Type**: Single-hand dynamic gesture (Primary hand: Right)
**Involves Hands**: Right Hand active, Left Hand stationary

### Verified Gesture Description (SAD-Style Paragraph):
"In UNVERIFIED_002, the thumb pad and index fingertip meet together forming a circular ring loop, while the middle, ring, and pinky fingers are fully extended straight upright and slightly splayed apart. The right hand starts in a neutral resting position beside the right hip, then smoothly raises upward to the right upper chest at clavicle level. The hand is held emphatically in front of the upper chest with the palm facing forward toward the viewer and the three extended fingers pointing straight up, accompanied by an attentive facial expression and a subtle affirmative nod, before lowering smoothly back down beside the hip into resting position while the left hand remains stationary beside the body throughout."

### Kinematic & Anatomical Parameters:
- **Handshape**: Calibrated F / OK / 9 Handshape (`PRESET_F_OK_HANDSHAPE`).
  - Thumb & Index: Form circular loop contact.
  - Middle, Ring, Pinky: Upright, extended, slightly splayed.
- **Starting Position**: Right hand resting beside right hip; left hand resting stationary.
- **Movement Sequence & Timing**:
  - Phase 1 (0.00s – 0.90s): Elevation to upper chest level.
  - Phase 2 (0.90s – 1.40s): Emphatic chest hold with palm facing forward and affirmative head nod.
  - Phase 3 (1.40s – 2.00s): Smooth descent toward hip.
  - Phase 4 (2.00s – 2.36s): Neutral resting state beside body.
- **Final Position**: Neutral rest beside hip.
- **Facial Expression & Head**: Attentive gaze, pleasant expression, slight nod.

---

## 10. UNVERIFIED_003 (विचाराधीन / PENDING)
**Reference Video**: `MVI_9510.MOV` (`SIGN_VIDEO_003`)
**Video Source**: User Provided Reference Video (`adjective 1file/MVI_9510.MOV`)
**Verification Status**: PENDING (`sign_meaning: UNVERIFIED`, `validation_status: PENDING`)
**Language**: Indian Sign Language (ISL)
**Duration**: 2.48 seconds (62 frames @ 25 FPS)
**Gesture Type**: Single-hand dynamic gesture (Primary hand: Right)
**Involves Hands**: Right Hand active, Left Hand stationary

### Verified Gesture Description (SAD-Style Paragraph):
"In UNVERIFIED_003, the thumb pad and index fingertip meet together forming a circular ring loop, while the middle, ring, and pinky fingers are fully extended straight upright and slightly splayed apart. The right hand starts in a neutral resting position beside the right hip, then smoothly raises upward to the right upper chest at clavicle level. The hand is held emphatically in front of the upper chest with the palm facing forward toward the viewer and the three extended fingers pointing straight up, accompanied by an attentive facial expression and a subtle affirmative nod, before lowering smoothly back down beside the hip into resting position while the left hand remains stationary beside the body throughout."

### Kinematic & Anatomical Parameters:
- **Handshape**: Calibrated F / OK / 9 Handshape (`PRESET_F_OK_HANDSHAPE`).
- **Starting Position**: Right hand resting beside right hip; left hand resting stationary.
- **Movement Sequence & Timing**:
  - Phase 1 (0.00s – 0.92s): Smooth ascent from hip to upper chest forming F/OK ring.
  - Phase 2 (0.92s – 1.50s): Apex hold at upper chest with forward palm and subtle affirmative nod.
  - Phase 3 (1.50s – 2.10s): Smooth descent toward hip.
  - Phase 4 (2.10s – 2.48s): Return to neutral resting state beside hip.
- **Final Position**: Neutral rest beside hip.
- **Facial Expression & Head**: Direct attentive eye contact, pleasant expression, subtle nod.

---

## 11. UNVERIFIED_004 (विचाराधीन / PENDING)
**Reference Video**: `MVI_9511.MOV` (`SIGN_VIDEO_004`)
**Video Source**: User Provided Reference Video (`adjective 1file/MVI_9511.MOV`)
**Verification Status**: PENDING (`sign_meaning: UNVERIFIED`, `validation_status: PENDING`)
**Language**: Indian Sign Language (ISL)
**Duration**: 2.24 seconds (56 frames @ 25 FPS)
**Gesture Type**: Single-hand dynamic gesture (Primary hand: Right)
**Involves Hands**: Right Hand active, Left Hand stationary

### Verified Gesture Description (SAD-Style Paragraph):
"In UNVERIFIED_004, the thumb pad and index fingertip meet together forming a circular ring loop, while the middle, ring, and pinky fingers are fully extended straight upright and slightly splayed apart. The right hand starts in a neutral resting position beside the right hip, then smoothly raises upward to the right upper chest at clavicle level. The hand is held emphatically in front of the upper chest with the palm facing forward toward the viewer and the three extended fingers pointing straight up, accompanied by an attentive facial expression and a subtle affirmative nod, before lowering smoothly back down beside the hip into resting position while the left hand remains stationary beside the body throughout."

### Kinematic & Anatomical Parameters:
- **Handshape**: Calibrated F / OK / 9 Handshape (`PRESET_F_OK_HANDSHAPE`).
- **Starting Position**: Right hand resting beside right hip; left hand resting stationary.
- **Movement Sequence & Timing**:
  - Phase 1 (0.00s – 0.88s): Ascent from hip to upper chest.
  - Phase 2 (0.88s – 1.35s): Apex hold at chest level with forward palm and nod.
  - Phase 3 (1.35s – 1.90s): Controlled descent.
  - Phase 4 (1.90s – 2.24s): Rest beside hip.
- **Final Position**: Neutral rest beside hip.
- **Facial Expression & Head**: Direct eye contact, pleasant expression, subtle nod.


---

## 12. UNKNOWN_SIGN_005 (विचाराधीन / PENDING)
**Reference Video**: `MVI_5320.MOV`
**Sign ID**: `UNKNOWN_SIGN_005`
**Video Source**: User Provided Reference Video (`adjective 1file/MVI_5320.MOV`)
**Verification Status**: PENDING (`sign_meaning: UNVERIFIED`, `validation_status: PENDING`)
**Language**: Indian Sign Language (ISL)
**Duration**: 2.00 seconds (50 frames @ 25 FPS)
**Resolution**: 1920 × 1080
**Gesture Type**: Single-hand dynamic gesture (Primary hand: Right)
**Involves Hands**: Right Hand active, Left Hand stationary

### Verified Gesture Description (SAD-Style Paragraph):
"In UNKNOWN_SIGN_005, the right hand starts in a neutral resting position beside the right hip, then smoothly raises upward toward the lower face and chin level with fingers extended straight upright and the palm facing forward toward the viewer. The hand is positioned near the chin and lower face for a brief hold with an attentive facial expression and subtle affirmative nod, before lowering smoothly back down beside the hip into resting position while the left hand remains stationary beside the body throughout."

### Kinematic & Anatomical Parameters:
- **Handshape**: Calibrated Open Flat B / Upright Handshape (`PRESET_OPEN_FLAT_B`).
  - Index, Middle, Ring: Fully straightened upright (`base: 0.05`, `mid: 0.02`, `tip: 0.00`).
  - Pinky Finger: Straight upright with slight inward convergence (`base: 0.08`, `mid: 0.05`, `tip: 0.02`).
  - Thumb: Slightly abducted laterally with relaxed posture.
- **Starting Position**: Right hand resting down naturally beside the right hip (wrist `X ≈ 0.42`, `Y ≈ 0.79`, `Z ≈ 0.00`). Left hand resting beside left hip.
- **Movement Sequence & Timing**:
  - Phase 1 (0.00s – 0.40s / frames 0–10): Smooth elevation from hip toward upper chest and chin level.
  - Phase 2 (0.40s – 0.76s / frames 10–19): Positioned near chin/lower face with palm facing forward, accompanied by attentive gaze and subtle nod.
  - Phase 3 (0.76s – 1.10s / frames 19–27): Controlled downward descent returning hand toward hip along front of torso.
  - Phase 4 (1.10s – 2.00s / frames 27–50): Standby rest beside body at hip level.
- **Final Position**: Right hand resting beside the body in neutral posture; left hand stationary at side throughout.
- **Facial Expression & Head**: Attentive, focused facial expression with slight nod during chin/face positioning.
- **3D Avatar Rig Mapping**:
  - `head`: `[headPitch, 0.0, 0.0]`, `neck`: `[headPitch * 0.5, 0.0, 0.0]`
  - Rest at Hip: `rightarm`: `[-0.10, 0.05, -0.20]`, `rightforearm`: `[-0.15, 0.05, 0.05]`, `righthand`: `[0.05, 0.0, 0.0]`
  - Chin / Face Level: `rightarm`: `[-0.65, 0.12, -0.90]`, `rightforearm`: `[-1.50, 0.40, 0.20]`, `righthand`: `[0.15, -0.10, -0.20]`
  - `leftarm`: `NEUTRAL_REST_ARM_LEFT`, `lefthand`: `PRESET_STANDBY_RELAXED`


---

## 13. UNKNOWN_SIGN_006 (विचाराधीन / PENDING)
**Reference Video**: `MVI_5164.MOV`
**Sign ID**: `UNKNOWN_SIGN_006`
**Video Source**: User Provided Reference Video (`adjective 1file/MVI_5164.MOV`)
**Verification Status**: PENDING (`sign_meaning: UNVERIFIED`, `validation_status: PENDING`)
**Language**: Indian Sign Language (ISL)
**Duration**: 3.32 seconds (83 frames @ 25 FPS)
**Resolution**: 1920 × 1080
**Gesture Type**: Two-hand dynamic gesture (Bilateral dynamic)
**Involves Hands**: Both Hands active (Right leads, Left follows)

### Verified Gesture Description (SAD-Style Paragraph):
"In UNKNOWN_SIGN_006, both hands start in a neutral resting position beside the hips. The right hand begins elevating toward the upper chest first, followed by the left hand rising up into the signing area in front of the chest. Both hands are held in front of the chest with fingers extended upright and palms oriented toward each other and slightly forward, performing a synchronized two-handed chest interaction with an attentive facial expression and subtle affirmative head nod, before both hands lower smoothly back down along the front of the body to rest beside the hips."

### Kinematic & Anatomical Parameters:
- **Handshape**: Calibrated Bilateral Open Flat B / Upright Handshape (`PRESET_OPEN_FLAT_B`).
  - Index, Middle, Ring: Straight upright on both hands.
  - Pinky Finger: Straight upright with slight inward convergence.
  - Thumb: Slightly abducted laterally with relaxed posture.
- **Starting Position**: Both hands resting down naturally beside the hips (Left wrist `Y ≈ 0.79`, Right wrist `Y ≈ 0.79`).
- **Movement Sequence & Timing**:
  - Phase 1 (0.00s – 0.83s / frames 0–21): Right hand begins elevating toward upper chest first, followed by left hand rising from hip.
  - Phase 2 (0.83s – 1.33s / frames 21–33): Both hands enter signing space in front of center chest, palms facing each other/forward.
  - Phase 3 (1.33s – 2.16s / frames 33–54): Both hands interact in front of chest with slight downward wringing/compression pulse and attentive head nod.
  - Phase 4 (2.16s – 2.82s / frames 54–70): Both hands descend smoothly along front torso back toward hips.
  - Phase 5 (2.82s – 3.32s / frames 70–83): Both hands return to bilateral neutral standby rest beside hips.
- **Final Position**: Both hands resting beside the body in neutral standby posture.
- **Facial Expression & Head**: Attentive, focused forward gaze with subtle affirmative nod during chest interaction.
- **3D Avatar Rig Mapping**:
  - `head`: `[headPitch, 0.0, 0.0]`, `neck`: `[headPitch * 0.5, 0.0, 0.0]`
  - Rest at Hips:
    - `rightarm`: `[-0.10, 0.05, -0.20]`, `rightforearm`: `[-0.15, 0.05, 0.05]`, `righthand`: `[0.05, 0.0, 0.0]`
    - `leftarm`: `[-0.10, -0.05, 0.20]`, `leftforearm`: `[-0.15, -0.05, -0.05]`, `lefthand`: `[0.05, 0.0, 0.0]`
  - Chest Interaction Apex:
    - `rightarm`: `[-0.55, 0.15, -0.70]`, `rightforearm`: `[-1.40, 0.35, 0.15]`, `righthand`: `[0.10, -0.20, -0.15]`
    - `leftarm`: `[-0.55, -0.15, 0.70]`, `leftforearm`: `[-1.40, -0.35, -0.15]`, `lefthand`: `[0.10, 0.20, 0.15]`


---

## 14. WET (गीला / नम) — Compound Two-Handed Squeeze/Closing Sign
- **Sign ID**: `wet` (also aliased as `wet_asl`, `wetasl`)
- **Primary Hand**: Both hands symmetrically (Bilateral)
- **Starting Position (शुरुआती स्थिति)**:
  - **Elbow (कोहनी)**: Both elbows bent, elevating hands to chest level. Elbows remain comfortably close beside the body.
  - **Wrist (कलाई)**: Wrists extended backward (`Wrist Extension`), so that both palms face upward toward the sky or the face.
  - **Hand & Fingers**: Fully open like ASL '5' handshape, fingers spread and slightly curved in a natural relaxed posture.
- **The Movement (गतिविधि)**:
  - **Elbow & Forearm Movement**: Both hands move downward simultaneously via slight extension of the forearms and elbows.
  - **Wrist Flexion (कलाई का नीचे झुकना)**: As hands descend, wrists flex downward (`Wrist Flexion`), tilting palms slightly downward and inward.
  - **Hand & Fingers (Closing Motion)**: As wrists flex down, all fingertips come together to touch the thumb tip (`saari ungliyon ke tips ko angoothe se milana`), resembling a pinch or catching water droplets (`chutki`).
  - **Elbow Trajectory**: Right elbow moves from right to left and left elbow moves from left to right towards the stomach.
- **Final Execution (दो बार दोहराना)**:
  - Repeated twice in a rhythmic, natural sequence: Open (wrists up) -> Close (wrists flex down & fingertips pinch) -> Rebound Open -> Close -> Rest at hips.
- **Linguistic Status**: LINGUISTICALLY_VERIFIED


## 15. SORRY (माफ़ कीजिए / पश्चाताप) — Single-Hand Clockwise Sternum Rubbing Sign
- **Sign ID**: `sorry` (aliased: `maaf`, `kshama`, `maafi`, `apology`, `apologize`, `forgive`)
- **Primary Hand**: Right hand
- **Handshape (A-Handshape)**:
  - ASL/ISL 'A' handshape: Four fingers (index, middle, ring, pinky) tightly curled into a closed fist against the palm.
  - Thumb rests upright and straight along the side of the index finger (not tucked inside, nor crossed over knuckles).
- **Orientation & Contact Point**:
  - **Palm Side**: Inward facing the chest/sternum.
  - **Knuckles**: Outward facing the viewer / camera.
  - **Contact Point**: Center of the chest / breastbone (sternum).
- **Joints & Muscle Dynamics (जोड़ों की गतिविधि)**:
  - **Elbow**: Flexed at ~90 degrees, kept stable near the body with subtle rotation to support forearm motion.
  - **Wrist**: Locked stiff in neutral alignment (zero flexion/extension), maintaining the 'A' handshape perpendicular to the chest.
  - **Shoulder**: Shoulder rotation and forearm displacement drive the primary circular path.
- **The Motion Path / Trajectory (मोशन पाथ)**:
  - **Direction**: Clockwise (घड़ी की सुई की दिशा में) as viewed from the front.
  - **Repetition**: 2 to 3 continuous circular rubbing rotations without lifting the fist off the sternum.
- **Facial Expression (Non-Manual Marker)**:
  - Apologetic, remorseful expression (`उदास चेहरा / पश्चाताप`).
  - Head bowed forward in contrition (`head: [0.10, 0, 0]`) with downcast gaze.
- **Step-by-Step AI Dataset Frames**:
  1. **Frame 1 (Start/Contact)**: Right hand 'A' fist ascends and touches the center of the sternum.
  2. **Frame 2 (Up & Right)**: Shoulder and elbow move the fist upward and clockwise to the right.
  3. **Frame 3 (Down & Left)**: Fist sweeps downward and around to complete the circular loop.
  4. **Frame 4 (Repeat)**: Loops 2-3 continuous cycles with constant sternum contact, followed by smooth return to hip rest.
- **AI/ML Model Detection Recommendations**:
  - **MediaPipe / Vision Models**: Track 21 landmarks of the right hand to confirm 'A' handshape (distance from fingertip landmarks 8, 12, 16, 20 to palm base 0 < 0.25; thumb tip 4 aligned alongside MCP 5).
  - **GCN / Spatial Graph Models**: Monitor right wrist position relative to torso landmarks (left_shoulder 11, right_shoulder 12, mid_hip).
  - **LSTM / Temporal Models**: Ensure circular phase continuity ($dx(t) = \sin(\omega t), dy(t) = \cos(\omega t)$) with at least 2 complete cycles for positive classification.
- **Linguistic Status**: LINGUISTICALLY_VERIFIED


## 16. MORE (और / ज्यादा) — Two-Handed Flattened-O X-Axis Convergence Sign
- **Sign ID**: `more` (aliased: `aur`, `extra`, `zyada`, `jyada`, `adhik`)
- **Primary Hand**: Both hands symmetrically (Bilateral)
- **Handshape (Two-Handed Flattened-O / Chutki / Katori)**:
  - Both hands form the Flattened 'O' handshape: All four fingertips (index, middle, ring, pinky) curl inward to touch the thumb tip, creating a small bud/pinch shape.
- **Orientation & Wrist Alignment**:
  - **Wrists**: Held in slight wrist flexion so the fingertips of the right hand point leftward, and the fingertips of the left hand point rightward, directly facing each other across the chest midline.
  - **Palms**: Right palm faces left; Left palm faces right.
- **Elbows & Torso Spatial Placement**:
  - Both elbows bent on either side of the torso, holding both hands floating in mid-air in front of the chest without resting on the body.
- **Cartesian Trajectory (X-Axis Convergence)**:
  - Symmetrical convergence along the horizontal X-axis.
  - Hands begin apart (~18-20cm separation), converge inward to the midline until fingertips collide/tap together, then bounce/recoil outward slightly.
  - Repeated for **3 crisp, rhythmic taps**.
- **Model Tip & AI Landmark Tracking**:
  - **MediaPipe / Vision Metric**: Euclidean distance between opposing thumb tips (Landmark 4) and index tips (Landmark 8) of the right and left hands:
    $$D(t) = \|\mathbf{P}_{\text{right\_tip}}(t) - \mathbf{P}_{\text{left\_tip}}(t)\|$$
    The model tracks $D(t)$ oscillating from positive down to zero (contact touch) and bouncing back positive **2 to 3 times**.
  - **Bounding Box Dynamic**: Bounding boxes of right and left hands converge horizontally with high IoU (overlap) at each tap peak.
- **Linguistic Status**: LINGUISTICALLY_VERIFIED
