/**
 * Bharat Sign AI - Precise Anatomical Sign-Language Kinematics Engine
 * 
 * Defines standard coordinate frames, anatomical joint limits, keyframed
 * trajectories, wrist orientations, and measurable kinetic metrics for
 * the 19 signs from "Signs Everyone Should Know" + Indian Namaste (Anjali Mudra).
 *
 * ============================================================================
 * COORDINATE SYSTEM SPECIFICATION:
 * ============================================================================
 * - Avatar Local Space:
 *     +X : Avatar's Left (Viewer's Right)
 *     -X : Avatar's Right (Viewer's Left)
 *     +Y : Upward toward head / crown
 *     -Y : Downward toward waist / feet
 *     +Z : Forward toward camera / viewer
 *     -Z : Backward toward avatar's spine
 *
 * - Camera Space:
 *     Position: [0, 1.25, 2.45] pointing at upper chest [0, 1.15, 0]
 *     Field of View: 42°
 *
 * - Normalized Anatomical Reference Heights (Relative to Shoulder Joint Y = 0.0m):
 *     Crown / Forehead:   +0.38m to +0.50m
 *     Temple:             +0.35m
 *     Eyes / Nose:        +0.28m
 *     Lips / Chin:        +0.20m
 *     Throat / Neck:      +0.12m
 *     Shoulder Baseline:   0.00m
 *     Upper Chest / Heart:-0.10m
 *     Solar Plexus:       -0.22m
 *     Waist / Abdomen:    -0.34m
 *     Resting Standby:    -0.55m
 * ============================================================================
 */

export interface FingerJointAngles {
  base: number;   // MCP joint curl (radians, 0 = straight, ~1.4 = fully curled)
  mid: number;    // PIP joint curl (radians, 0 = straight, ~1.4 = fully curled)
  tip: number;    // DIP joint curl (radians, 0 = straight, ~1.3 = fully curled)
  spread?: number;// Abduction / adduction (radians, -0.2 to +0.2)
}

export interface ThumbJointAngles {
  cmc: number;        // Basal joint abduction / extension
  mcp: number;        // Knuckle flexion across palm
  ip: number;         // Tip flexion
  opposition: number; // Rotational opposition toward pinky base
}

export interface HandAnatomicalPose {
  thumb: ThumbJointAngles;
  index: FingerJointAngles;
  middle: FingerJointAngles;
  ring: FingerJointAngles;
  pinky: FingerJointAngles;
  isPinchedMorsel?: boolean;
  isDrinkingCup?: boolean;
  isClosedSFist?: boolean;
  isNoSnap?: boolean;
  snapProgress?: number;
  isPleaseChin?: boolean;
  isQuietShhh?: boolean;
  isSadTearIndex?: boolean;
  isRunLHand?: boolean;
  isBeautifulLHand?: boolean;
  isBeautifulThreeFingers?: boolean;
}

export interface ArmJointAngles {
  shoulder?: [number, number, number]; // [X, Y, Z] Euler rotations in radians
  arm: [number, number, number];       // Shoulder / upper arm [X, Y, Z]
  forearm: [number, number, number];   // Elbow [X, Y, Z]
  wrist: [number, number, number];     // Wrist / hand [X, Y, Z]
}

export interface KineticMeasurements {
  initialWristHeight: number;       // In meters relative to shoulder
  finalWristHeight: number;         // In meters relative to shoulder
  verticalDisplacement: number;     // delta Y (m)
  horizontalDisplacement: number;   // delta X (m)
  depthDisplacement: number;        // delta Z (m)
  totalMovementDistance: number;    // 3D Euclidean displacement (m)
  palmOrientationStart: string;     // Anatomical description
  palmOrientationEnd: string;       // Anatomical description
  wristRotationDegrees: [number, number, number]; // [Pitch, Yaw, Roll] in degrees
  trajectoryType: "linear" | "arc" | "circular" | "tap" | "chop" | "nod" | "wave" | "compound" | "static";
  anatomicalFeatures: string[];
}

export interface PoseKeyframe {
  timeFraction: number; // 0.0 to 1.0
  rightArm?: ArmJointAngles;
  leftArm?: ArmJointAngles;
  rightHand?: HandAnatomicalPose;
  leftHand?: HandAnatomicalPose;
  head?: [number, number, number];
  neck?: [number, number, number];
  spine?: [number, number, number];
}

export interface PreciseGestureDefinition {
  id: string;
  name: string;
  meaningHindi: string;
  signLanguage: "ISL";
  referenceSource: "Signs Everyone Should Know" | "Simple Signs Chart" | "Everyday Things We Do";
  involvesHands: "both" | "right" | "left";
  durationSeconds: number;
  motionType: KineticMeasurements["trajectoryType"];
  startPose: PoseKeyframe;
  endPose: PoseKeyframe;
  intermediateKeyframes?: PoseKeyframe[];
  measurements: KineticMeasurements;
  description: string;
  facialExpression: string;
  verifiedStatus: "LINGUISTICALLY_VERIFIED";
}

// ============================================================================
// STANDARD HANDSHAPE PRESETS (Anatomically Calibrated)
// ============================================================================

export const PRESET_OPEN_FLAT_B: HandAnatomicalPose = {
  thumb: { cmc: 0.1, mcp: 0.15, ip: 0.1, opposition: 0.05 },
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  middle: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  ring: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  pinky: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
};

export const PRESET_SALUTE_B_THUMB_CLOSED: HandAnatomicalPose = {
  thumb: { cmc: 0.60, mcp: 0.85, ip: 0.70, opposition: 0.80 }, // Thumb folded closed across palm
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },         // Four fingers open straight upright
  middle: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  ring: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  pinky: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
};

export const PRESET_PLEASE_CHIN_THUMB_CLOSED: HandAnatomicalPose = {
  thumb: { cmc: 0.65, mcp: 0.90, ip: 0.75, opposition: 0.85 }, // Thumb folded closed across palm
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },         // Four fingers straight together touching chin
  middle: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  ring: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  pinky: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  isPleaseChin: true,
};

export const PRESET_QUIET_SHHH_INDEX_LIPS: HandAnatomicalPose = {
  thumb: { cmc: 0.20, mcp: 0.25, ip: 0.15, opposition: 0.35 }, // Tightly closed & folded across curled fingers
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },         // Single index finger extended straight upright into mouth
  middle: { base: 1.35, mid: 1.40, tip: 1.30, spread: 0.0 },    // Curled tightly into palm
  ring: { base: 1.35, mid: 1.40, tip: 1.30, spread: 0.0 },      // Curled tightly into palm
  pinky: { base: 1.35, mid: 1.40, tip: 1.30, spread: 0.0 },     // Curled tightly into palm
  isQuietShhh: true,
};

export const PRESET_SAD_TEAR_INDEX_EYE: HandAnatomicalPose = {
  thumb: { cmc: 0.20, mcp: 0.25, ip: 0.15, opposition: 0.35 }, // Thumb tightly closed & folded across fist
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },         // Single index finger extended straight
  middle: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },    // Curled tightly into fist
  ring: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },      // Curled tightly into fist
  pinky: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },     // Curled tightly into fist
  isSadTearIndex: true,
};

export const PRESET_RUN_L_HAND: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.25, ip: 0.15, opposition: 0.30 }, // Thumb extended open upright/forward forming L
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },         // Single index finger extended straight
  middle: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },    // Curled tightly into fist against palm
  ring: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },      // Curled tightly into fist against palm
  pinky: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },     // Curled tightly into fist against palm
  isRunLHand: true,
};

export const PRESET_BEAUTIFUL_L_HAND: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.25, ip: 0.15, opposition: 0.30 }, // Thumb extended open upright/forward forming L
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },         // Single index finger extended straight to trace face circle
  middle: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },    // Curled tightly into fist against palm
  ring: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },      // Curled tightly into fist against palm
  pinky: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },     // Curled tightly into fist against palm
  isBeautifulLHand: true,
};

export const PRESET_BEAUTIFUL_THREE_FINGERS: HandAnatomicalPose = {
  thumb: { cmc: 0.35, mcp: 0.40, ip: 0.30, opposition: 0.65 }, // Thumb folded/closed against palm/index
  index: { base: 1.40, mid: 1.45, tip: 1.35, spread: 0.0 },     // Index closed into fist
  middle: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.04 },      // Middle open straight pointing toward user
  ring: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.00 },        // Ring open straight pointing toward user
  pinky: { base: 0.0, mid: 0.0, tip: 0.0, spread: -0.04 },      // Pinky open straight pointing toward user
  isBeautifulThreeFingers: true,
};

export const PRESET_POINTING_1: HandAnatomicalPose = {
  thumb: { cmc: 0.5, mcp: 0.9, ip: 0.8, opposition: 0.7 },
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  middle: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
  ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
  pinky: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
};

export const PRESET_CLOSED_FIST_S: HandAnatomicalPose = {
  thumb: { cmc: 0.20, mcp: 0.20, ip: 0.10, opposition: 0.30 },
  index: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },
  middle: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },
  ring: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },
  pinky: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },
  isClosedSFist: true,
};

export const PRESET_CLOSED_FIST_A: HandAnatomicalPose = {
  thumb: { cmc: 0.1, mcp: 0.2, ip: 0.1, opposition: 0.1 }, // Thumb straight alongside index
  index: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
  middle: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
  ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
  pinky: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
};

export const PRESET_H_HANDSHAPE: HandAnatomicalPose = {
  thumb: { cmc: 0.5, mcp: 0.9, ip: 0.8, opposition: 0.7 },
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 },
  middle: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.0 }, // Index & middle together
  ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
  pinky: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
};

export const PRESET_ILY_HANDSHAPE: HandAnatomicalPose = {
  thumb: { cmc: -0.2, mcp: 0.0, ip: 0.0, opposition: -0.2 }, // Thumb extended outward
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.05 },     // Index extended straight
  middle: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },   // Middle curled to palm
  ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },     // Ring curled to palm
  pinky: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.1 },      // Pinky extended straight
};

export const PRESET_PINCHED_EATING_MORSEL: HandAnatomicalPose = {
  thumb: { cmc: 0.55, mcp: 0.70, ip: 0.60, opposition: 0.85 }, // Thumb pad opposes all 4 fingertips
  index: { base: 0.85, mid: 0.90, tip: 0.85, spread: -0.05 },  // 4 fingers curved inward together
  middle: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.00 },
  ring: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.05 },
  pinky: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.10 },
  isPinchedMorsel: true,
};

export const PRESET_FLATTENED_O: HandAnatomicalPose = PRESET_PINCHED_EATING_MORSEL;

export const PRESET_C_CUP: HandAnatomicalPose = {
  thumb: { cmc: 0.05, mcp: 0.05, ip: 0.0, opposition: 0.10 }, // Open thumb extended forward horizontally (Matches user photo)
  index: { base: 1.10, mid: 1.05, tip: 0.85, spread: 0.0 },    // Four fingers bent in arched cup-holding dome
  middle: { base: 1.10, mid: 1.05, tip: 0.85, spread: 0.0 },
  ring: { base: 1.10, mid: 1.05, tip: 0.85, spread: 0.0 },
  pinky: { base: 1.10, mid: 1.05, tip: 0.85, spread: 0.0 },
  isDrinkingCup: true,
};

export const PRESET_NO_OPEN: HandAnatomicalPose = {
  thumb: { cmc: 0.05, mcp: 0.05, ip: 0.05, opposition: 0.20 }, // Open thumb forming lower beak
  index: { base: -0.05, mid: 0.05, tip: 0.05, spread: -0.03 },  // Index straight open
  middle: { base: -0.05, mid: 0.05, tip: 0.05, spread: 0.03 },  // Middle straight open alongside index
  ring: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },      // Ring curled tightly to palm
  pinky: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },     // Pinky curled tightly to palm
  isNoSnap: true,
  snapProgress: 0.0,
};

export const PRESET_NO_CLOSED: HandAnatomicalPose = {
  thumb: { cmc: 0.13, mcp: 0.23, ip: 0.15, opposition: 0.40 }, // Thumb tip elevates to meet fingertips directly
  index: { base: 1.17, mid: 0.35, tip: 0.21, spread: -0.06 },  // Index touches thumb pad (<6.8mm)
  middle: { base: 1.17, mid: 0.35, tip: 0.21, spread: 0.06 },  // Middle touches thumb pad (<0.7mm)
  ring: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },      // Ring curled tightly to palm
  pinky: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },     // Pinky curled tightly to palm
  isNoSnap: true,
  snapProgress: 1.0,
};

export const PRESET_T_HANDSHAPE: HandAnatomicalPose = {
  thumb: { cmc: 0.4, mcp: 0.6, ip: 0.5, opposition: 0.4 }, // Poking between index & middle
  index: { base: 1.1, mid: 1.35, tip: 1.2, spread: 0.08 },
  middle: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
  ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
  pinky: { base: 1.25, mid: 1.35, tip: 1.2, spread: -0.05 },
};

export const PRESET_OPEN_SPREAD_5: HandAnatomicalPose = {
  thumb: { cmc: -0.2, mcp: 0.0, ip: 0.0, opposition: -0.1 },
  index: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.12 },
  middle: { base: 0.0, mid: 0.0, tip: 0.0, spread: 0.02 },
  ring: { base: 0.0, mid: 0.0, tip: 0.0, spread: -0.08 },
  pinky: { base: 0.0, mid: 0.0, tip: 0.0, spread: -0.18 },
};

export const PRESET_CUPPED_SHOUT_MOUTH: HandAnatomicalPose = {
  thumb: { cmc: 0.10, mcp: 0.25, ip: 0.15, opposition: 0.25 }, // Thumb extended along jawline/corner of mouth
  index: { base: 0.20, mid: 0.15, tip: 0.10, spread: 0.00 },    // Four fingers flat together with gentle natural cup curve around mouth
  middle: { base: 0.20, mid: 0.15, tip: 0.10, spread: 0.00 },
  ring: { base: 0.20, mid: 0.15, tip: 0.10, spread: 0.00 },
  pinky: { base: 0.20, mid: 0.15, tip: 0.10, spread: 0.00 },
};

export const PRESET_STANDBY_RELAXED: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.2, ip: 0.15, opposition: 0.15 },
  index: { base: 0.2, mid: 0.25, tip: 0.2, spread: 0.0 },
  middle: { base: 0.22, mid: 0.28, tip: 0.22, spread: 0.0 },
  ring: { base: 0.24, mid: 0.3, tip: 0.24, spread: 0.0 },
  pinky: { base: 0.25, mid: 0.32, tip: 0.25, spread: 0.0 },
};

export const PRESET_CURVED_GRIP: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.40, ip: 0.35, opposition: 0.45 }, // Open opposed thumb forming lower rung grip
  index: { base: 0.65, mid: 0.85, tip: 0.60, spread: 0.04 },    // Curved hooked fingers over ladder rung
  middle: { base: 0.65, mid: 0.85, tip: 0.60, spread: 0.00 },
  ring: { base: 0.65, mid: 0.85, tip: 0.60, spread: -0.04 },
  pinky: { base: 0.65, mid: 0.85, tip: 0.60, spread: -0.07 },
};

export const PRESET_FLAT_PALM_DOWN: HandAnatomicalPose = {
  thumb: { cmc: 0.05, mcp: 0.10, ip: 0.05, opposition: 0.10 }, // Natural thumb alongside index
  index: { base: 0.05, mid: 0.08, tip: 0.05, spread: 0.02 },    // Fingers straight & flush facing downward (photo match)
  middle: { base: 0.05, mid: 0.08, tip: 0.05, spread: 0.00 },
  ring: { base: 0.05, mid: 0.08, tip: 0.05, spread: -0.02 },
  pinky: { base: 0.05, mid: 0.08, tip: 0.05, spread: -0.04 },
};

export const PRESET_LOOSE_FIST: HandAnatomicalPose = {
  thumb: { cmc: 0.20, mcp: 0.50, ip: 0.40, opposition: 0.35 },
  index: { base: 1.10, mid: 1.20, tip: 0.90, spread: 0.0 },
  middle: { base: 1.15, mid: 1.20, tip: 0.90, spread: 0.0 },
  ring: { base: 1.15, mid: 1.20, tip: 0.90, spread: 0.0 },
  pinky: { base: 1.15, mid: 1.20, tip: 0.90, spread: 0.0 },
};

export const PRESET_SLIGHTLY_BENT_OPEN: HandAnatomicalPose = {
  thumb: { cmc: 0.10, mcp: 0.20, ip: 0.15, opposition: 0.10 },
  index: { base: 0.35, mid: 0.40, tip: 0.25, spread: 0.04 },
  middle: { base: 0.35, mid: 0.40, tip: 0.25, spread: 0.0 },
  ring: { base: 0.35, mid: 0.40, tip: 0.25, spread: -0.04 },
  pinky: { base: 0.35, mid: 0.40, tip: 0.25, spread: -0.08 },
};

export const PRESET_GENTLE_CURVE_PALM_UP: HandAnatomicalPose = {
  thumb: { cmc: -0.10, mcp: 0.10, ip: 0.10, opposition: -0.05 },
  index: { base: 0.25, mid: 0.30, tip: 0.20, spread: 0.05 },
  middle: { base: 0.25, mid: 0.30, tip: 0.20, spread: 0.0 },
  ring: { base: 0.25, mid: 0.30, tip: 0.20, spread: -0.05 },
  pinky: { base: 0.25, mid: 0.30, tip: 0.20, spread: -0.08 },
};

export const PRESET_INDEX_EXTENDED_TEAR: HandAnatomicalPose = {
  thumb: { cmc: 0.30, mcp: 0.50, ip: 0.40, opposition: 0.35 },
  index: { base: 0.05, mid: 0.05, tip: 0.05, spread: 0.0 },
  middle: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
  ring: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
  pinky: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
};

export const PRESET_CURVED_RELAXED_FACE: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.25, ip: 0.20, opposition: 0.15 },
  index: { base: 0.40, mid: 0.45, tip: 0.30, spread: 0.03 },
  middle: { base: 0.40, mid: 0.45, tip: 0.30, spread: 0.0 },
  ring: { base: 0.40, mid: 0.45, tip: 0.30, spread: -0.03 },
  pinky: { base: 0.40, mid: 0.45, tip: 0.30, spread: -0.06 },
};

export const PRESET_INDEX_KICK: HandAnatomicalPose = {
  thumb: { cmc: 0.30, mcp: 0.50, ip: 0.40, opposition: 0.35 },
  index: { base: 0.05, mid: 0.05, tip: 0.05, spread: 0.0 },
  middle: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
  ring: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
  pinky: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
};

export const PRESET_WAIT_CURVED: HandAnatomicalPose = {
  thumb: { cmc: 0.25, mcp: 0.40, ip: 0.30, opposition: 0.25 },
  index: { base: 0.70, mid: 0.80, tip: 0.60, spread: 0.02 },
  middle: { base: 0.70, mid: 0.80, tip: 0.60, spread: 0.0 },
  ring: { base: 0.70, mid: 0.80, tip: 0.60, spread: -0.02 },
  pinky: { base: 0.70, mid: 0.80, tip: 0.60, spread: -0.04 },
};

export const PRESET_INDEX_POINTING_DOWN: HandAnatomicalPose = {
  thumb: { cmc: 0.35, mcp: 0.55, ip: 0.40, opposition: 0.35 },
  index: { base: 0.05, mid: 0.05, tip: 0.05, spread: 0.0 },
  middle: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
  ring: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
  pinky: { base: 1.25, mid: 1.30, tip: 1.15, spread: 0.0 },
};

export const PRESET_CUPPED_WASH: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.30, ip: 0.25, opposition: 0.20 },
  index: { base: 0.50, mid: 0.60, tip: 0.40, spread: 0.02 },
  middle: { base: 0.50, mid: 0.60, tip: 0.40, spread: 0.0 },
  ring: { base: 0.50, mid: 0.60, tip: 0.40, spread: -0.02 },
  pinky: { base: 0.50, mid: 0.60, tip: 0.40, spread: -0.04 },
};

export const PRESET_TWO_FINGERS_LOOK: HandAnatomicalPose = {
  thumb: { cmc: 0.35, mcp: 0.55, ip: 0.40, opposition: 0.40 },
  index: { base: 0.05, mid: 0.05, tip: 0.05, spread: 0.06 },
  middle: { base: 0.05, mid: 0.05, tip: 0.05, spread: -0.06 },
  ring: { base: 1.25, mid: 1.30, tip: 1.20, spread: 0.0 },
  pinky: { base: 1.25, mid: 1.30, tip: 1.20, spread: 0.0 },
};

export const PRESET_JUMP_CURLED: HandAnatomicalPose = {
  thumb: { cmc: 0.20, mcp: 0.35, ip: 0.30, opposition: 0.20 },
  index: { base: 0.60, mid: 0.70, tip: 0.50, spread: 0.03 },
  middle: { base: 0.60, mid: 0.70, tip: 0.50, spread: 0.0 },
  ring: { base: 0.60, mid: 0.70, tip: 0.50, spread: -0.03 },
  pinky: { base: 0.60, mid: 0.70, tip: 0.50, spread: -0.06 },
};

export const PRESET_CLAW_HAND: HandAnatomicalPose = {
  thumb: { cmc: 0.35, mcp: 0.50, ip: 0.45, opposition: 0.50 },
  index: { base: 0.55, mid: 0.70, tip: 0.60, spread: 0.05 },
  middle: { base: 0.55, mid: 0.70, tip: 0.60, spread: 0.0 },
  ring: { base: 0.55, mid: 0.70, tip: 0.60, spread: -0.04 },
  pinky: { base: 0.55, mid: 0.70, tip: 0.60, spread: -0.08 },
};

export const NEUTRAL_REST_ARM_RIGHT: ArmJointAngles = {
  arm: [0.05, 0.05, -1.28],
  forearm: [-0.22, 0.05, 0.05],
  wrist: [0.1, 0.0, -0.05],
};

export const NEUTRAL_REST_ARM_LEFT: ArmJointAngles = {
  arm: [0.05, -0.05, 1.28],
  forearm: [-0.22, -0.05, -0.05],
  wrist: [0.1, 0.0, 0.05],
};

export const PRECISE_GESTURES_MAP: Record<string, PreciseGestureDefinition> = {
  // --------------------------------------------------------------------------
  // 1. HELLO (Right hand touches forehead with thumb closed & 4 fingers open, then sweeps outward to side)
  // --------------------------------------------------------------------------
  hello: {
    id: "hello",
    name: "Hello",
    meaningHindi: "नमस्ते / हैलो",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.4,
    motionType: "arc",
    measurements: {
      initialWristHeight: 0.44, // Touches forehead mesh surface
      finalWristHeight: 0.34,   // Extended outward and downward into Quadrant III
      verticalDisplacement: -0.10,
      horizontalDisplacement: 0.26, // Sweeps outward and downward into Quadrant III (-X, -Y)
      depthDisplacement: 0.08,
      totalMovementDistance: 0.29,
      palmOrientationStart: "Right hand touches forehead mesh surface with thumb closed across palm and 4 fingers straight together, palm facing forward",
      palmOrientationEnd: "Right hand sweeps outward and downward towards Quadrant III (-X, -Y), palm strictly facing forward; left hand down relaxed",
      wristRotationDegrees: [22.9, -14.3, -37.2],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Thumb closed tightly across palm, four fingers (index, middle, ring, pinky) open and straight upright together",
        "Hand touches the right forehead mesh surface directly above the right eyebrow (Z = 0.129)",
        "Arm, forearm and wrist sweep the hand outward and downward towards Quadrant III (-X, -Y) as specified on coordinate plane",
        "Palm remains strictly facing forward toward user/camera (palmNormal.z >= 0.918 to 0.999) throughout entire motion",
        "Left hand down relaxed in neutral rest pose doing nothing",
        "Warm greeting smile with direct eye contact",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.80, -0.10, -1.05], forearm: [-2.00, 0.80, -0.45], wrist: [0.40, -0.25, -0.65] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_SALUTE_B_THUMB_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.04, 0.0, -0.03],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.30, 0.20, -0.80], forearm: [-1.50, 1.20, 0.20], wrist: [-0.20, -0.15, -0.60] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_SALUTE_B_THUMB_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.04, 0.0, -0.03],
    },
    description: "Hand with thumb closed and four fingers open touches forehead mesh surface above right eyebrow, then sweeps smoothly outward and downward towards Quadrant III; left hand rests at side.",
    facialExpression: "Warm greeting smile with direct eye contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 1b. HI (Single right hand elevated above shoulder, waving like goodbye, left hand relaxed at side)
  // --------------------------------------------------------------------------
  hi: {
    id: "hi",
    name: "Hi",
    meaningHindi: "नमस्ते / हाय",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "wave",
    measurements: {
      initialWristHeight: 0.38, // Right hand elevated above shoulder
      finalWristHeight: 0.38,   // Stays elevated above shoulder
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.35, // Dynamic lateral waving displacement left to right
      depthDisplacement: 0.08,
      totalMovementDistance: 0.36,
      palmOrientationStart: "Right hand elevated above shoulder, palm facing directly to front side; left hand down relaxed",
      palmOrientationEnd: "Right hand elevated above shoulder, palm maintained facing directly to front side while waving left to right and right to left (unlike goodbye where both hands are up)",
      wristRotationDegrees: [0.0, 14.3, 25.8],
      trajectoryType: "wave",
      anatomicalFeatures: [
        "Single right hand elevated above shoulder level (Y ≈ +0.38m relative) and waving like goodbye",
        "Right palm maintained strictly facing front side (towards user/camera) without twisting",
        "Continuous nonstop movement sweeping palm from left to right and right to left",
        "Flat straight B-handshape on right hand with all fingers extended straight upright",
        "Left hand rests down relaxed in neutral rest pose doing nothing (unlike goodbye where both hands are up)",
        "Warm greeting smile with direct eye contact",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.40, 0.20, -0.90], forearm: [-1.60, 1.20, 0.0], wrist: [0.0, -0.25, -0.50] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.04, 0.0, -0.03],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.40, 0.20, -0.90], forearm: [-1.60, 1.20, 0.10], wrist: [0.0, -0.25, -0.32] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.04, 0.0, -0.03],
    },
    description: "Right hand elevated above shoulder with palm facing front side, waving continuously from left to right and right to left like goodbye, while left hand rests at side.",
    facialExpression: "Warm greeting smile with direct eye contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 1b. BYE / GOODBYE (Both hands raised above shoulders, straight palms facing front, continuous left-to-right waving)
  // --------------------------------------------------------------------------
  bye: {
    id: "bye",
    name: "Bye",
    meaningHindi: "अलविदा / बाय",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "wave",
    measurements: {
      initialWristHeight: 0.38, // Both hands elevated above shoulders
      finalWristHeight: 0.38,   // Both stay elevated above shoulders
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.35, // Dynamic lateral waving displacement left to right
      depthDisplacement: 0.08,
      totalMovementDistance: 0.36,
      palmOrientationStart: "Both hands elevated above shoulders, palms facing directly to front side",
      palmOrientationEnd: "Both hands elevated above shoulders, palms maintained facing directly to front side while moving left to right and right to left",
      wristRotationDegrees: [0.0, 14.3, 25.8],
      trajectoryType: "wave",
      anatomicalFeatures: [
        "Both hands elevated symmetrically above shoulder level (Y ≈ +0.38m relative)",
        "Both palms maintained strictly facing front side (towards user/camera) without twisting",
        "Continuous nonstop movement sweeping palms from left to right and right to left",
        "Flat straight B-handshape on both hands with all fingers extended straight upright",
        "Warm cheerful departure facial expression with direct eye contact",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.40, 0.20, -0.90], forearm: [-1.60, 1.20, 0.0], wrist: [0.0, -0.25, -0.50] },
      leftArm: { arm: [-0.40, -0.20, 0.90], forearm: [-1.60, -1.20, 0.0], wrist: [-0.05, 0.30, 0.40] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [-0.04, 0.0, -0.03],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.40, 0.20, -0.90], forearm: [-1.60, 1.20, 0.10], wrist: [0.0, -0.25, -0.32] },
      leftArm: { arm: [-0.40, -0.20, 0.90], forearm: [-1.60, -1.20, -0.10], wrist: [-0.05, 0.30, 0.22] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [-0.04, 0.0, -0.03],
    },
    description: "Both hands raised above shoulders with palms facing front side, waving continuously from left to right and right to left in cheerful farewell.",
    facialExpression: "Friendly farewell smile with direct eye contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 2. MY NAME IS...
  // --------------------------------------------------------------------------
  my_name_is: {
    id: "my_name_is",
    name: "My Name Is...",
    meaningHindi: "मेरा नाम ... है",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 4.8,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.10, // Center chest / sternum
      finalWristHeight: -0.12,   // Chest height tapping
      verticalDisplacement: -0.02,
      horizontalDisplacement: 0.15,
      depthDisplacement: 0.08,
      totalMovementDistance: 0.171,
      palmOrientationStart: "Right palm flat resting inward on chest (MY)",
      palmOrientationEnd: "Right H-hand facing down tapping left H-hand (NAME)",
      wristRotationDegrees: [20.0, 5.7, 8.6],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Phase 1 (MY): Flat open palm placed firmly against center of chest",
        "Phase 2 (NAME): Both hands in H-handshape (index+middle straight together)",
        "Right H-fingers tap down squarely twice onto left H-fingers",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, 0.22, -1.05], forearm: [-1.45, 0.12, 0.15], wrist: [0.35, 0.10, 0.15] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.06, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, 0.22, -1.05], forearm: [-1.20, 0.15, -0.05], wrist: [0.40, 0.05, 0.05] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.35, -0.15, 0.05], wrist: [0.20, 0.05, 0.0] },
      rightHand: PRESET_H_HANDSHAPE,
      leftHand: PRESET_H_HANDSHAPE,
      head: [0.04, 0.0, 0.0],
    },
    description: "Two-phase compound self-introduction: 'MY' (palm on chest) followed by 'NAME' (H-hand tap).",
    facialExpression: "Friendly, confident introducing smile.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 3. THANK YOU
  // --------------------------------------------------------------------------
  thank_you: {
    id: "thank_you",
    name: "Thank You",
    meaningHindi: "धन्यवाद / शुक्रिया",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "arc",
    measurements: {
      initialWristHeight: 0.22, // Chin level
      finalWristHeight: 0.05,  // Mid-chest level
      verticalDisplacement: -0.17,
      horizontalDisplacement: 0.01,
      depthDisplacement: 0.29, // Moves forward towards the user
      totalMovementDistance: 0.336,
      palmOrientationStart: "Right flat open B-hand resting on chin with fingertips touching chin/lips and palm facing inward",
      palmOrientationEnd: "Right hand extended forward toward user with palm facing upward and forward in gratitude",
      wristRotationDegrees: [35.5, 3.4, 20.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Flat open B-hand with all four fingers and thumb straight together",
        "Starts with fingertips resting directly on the chin/lips (X = 0.005, Y = 1.515, Z = 0.130)",
        "Hand sweeps smoothly outward and forward towards the user in an appreciative arc",
        "Palm opens upward and forward facing the user at peak extension",
        "Gentle respectful head nod and warm appreciative smile",
        "Left arm remains relaxed naturally down at the side",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-1.57, -0.90, -0.60], forearm: [-1.90, 0.35, -0.50], wrist: [-1.04, 2.82, -0.20] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.57, -0.60, -0.80], forearm: [-0.60, -0.60, -0.40], wrist: [-1.66, 2.88, -0.55] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.12, 0.0, 0.0],
    },
    description: "Right flat open hand with wrist turned 180° opposite and elbow positioned at 90° on shoulder starts placed directly on chin/lips, then sweeps smoothly forward and slightly downward towards the user in gratitude; left hand rests at side.",
    facialExpression: "Warm appreciative smile with respectful forward nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 4. YES
  // --------------------------------------------------------------------------
  yes: {
    id: "yes",
    name: "Yes",
    meaningHindi: "हाँ",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 1.4,
    motionType: "nod",
    measurements: {
      initialWristHeight: 0.12,
      finalWristHeight: 0.05,
      verticalDisplacement: 0.07,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.0,
      totalMovementDistance: 0.095, // Rotational arc distance
      palmOrientationStart: "Closed fist held upright facing directly towards the user, knuckles pointing up",
      palmOrientationEnd: "Closed fist nodding downward at wrist towards user, knuckles dipping down",
      wristRotationDegrees: [80.2, 11.5, 34.4],
      trajectoryType: "nod",
      anatomicalFeatures: [
        "Right elbow turned 45° from right to left into midline",
        "Closed S-fist held upright facing directly towards the user",
        "Nods up and down rhythmically at the wrist joint into the down position",
        "Synchronous head nod affirming agreement",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.50, -0.20, -0.90], forearm: [-1.60, 1.00, -0.25], wrist: [-0.35, -0.20, -0.40] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_S,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.50, -0.20, -0.90], forearm: [-1.60, 1.00, -0.25], wrist: [1.05, -0.40, 0.20] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_S,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.22, 0.0, 0.0],
    },
    description: "Single right hand elevated with elbow turned 45° from right to left, closed S-fist facing directly towards the user (all fingers and thumb closed tightly). Starts in the UP position, and during YES gesture nods firmly DOWN from the wrist; left hand rests relaxed at side.",
    facialExpression: "Affirmative head nod and confident smile.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 5. NO
  // --------------------------------------------------------------------------
  no: {
    id: "no",
    name: "No",
    meaningHindi: "नहीं",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.0,
    motionType: "tap",
    measurements: {
      initialWristHeight: 0.05,
      finalWristHeight: 0.05,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.0,
      totalMovementDistance: 0.065,
      palmOrientationStart: "Index, middle, and thumb open in beak; ring & pinky curled into palm",
      palmOrientationEnd: "Index and middle fingertips touch thumb pad directly; ring & pinky curled into palm",
      wristRotationDegrees: [11.5, 5.7, 2.9],
      trajectoryType: "tap",
      anatomicalFeatures: [
        "Ring and pinky fingers curled tightly into palm throughout gesture",
        "Index and middle fingers extended straight together with thumb open opposing them",
        "Index and middle snap down firmly to touch the thumb pad directly (closing the beak)",
        "Accompanied by a synchronized side-to-side head shake in negation/refusal",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, -0.20, -0.95], forearm: [-1.35, 0.90, -0.10], wrist: [0.20, 0.10, 0.05] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_NO_OPEN,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.15, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, -0.20, -0.95], forearm: [-1.35, 0.90, -0.10], wrist: [0.20, 0.10, 0.05] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_NO_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, -0.15, 0.0],
    },
    description: "Right hand elevated in front of chest/shoulder with elbow turned 45° from right to left, ring and pinky fingers curled tightly into palm. Index finger, middle finger, and thumb start open, then index and middle snap down firmly to touch the thumb pad directly (closing beak) while head shakes side to side in refusal; left hand rests at side.",
    facialExpression: "Firm head shake side-to-side in refusal/negation.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 6. HELP
  // --------------------------------------------------------------------------
  help: {
    id: "help",
    name: "Help",
    meaningHindi: "मदद",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "linear",
    measurements: {
      initialWristHeight: -0.22, // Solar plexus level
      finalWristHeight: -0.06,   // Chest level
      verticalDisplacement: 0.16, // Lifted upward together
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.05,
      totalMovementDistance: 0.168,
      palmOrientationStart: "Left palm flat facing up; Right thumbs-up fist resting on it",
      palmOrientationEnd: "Both hands lifted together upward at chest height",
      wristRotationDegrees: [17.2, 5.7, 5.7],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Left hand holds flat open horizontal palm (support platform)",
        "Right hand forms thumbs-up fist resting squarely on left palm",
        "Both hands elevate together upward ~16cm in supportive motion",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.60, 0.20, -1.05], forearm: [-1.30, 0.15, 0.20], wrist: [0.30, 0.10, 0.10] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.25, -0.15, -0.15], wrist: [0.20, 0.0, 0.0] },
      rightHand: {
        thumb: { cmc: -0.2, mcp: 0.0, ip: 0.0, opposition: 0.0 }, // Thumbs up
        index: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
        middle: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
        ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
        pinky: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
      },
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.05, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.40, 0.20, -1.05], forearm: [-1.30, 0.15, 0.20], wrist: [0.30, 0.10, 0.10] },
      leftArm: { arm: [-0.35, -0.20, 1.05], forearm: [-1.25, -0.15, -0.15], wrist: [0.20, 0.0, 0.0] },
      rightHand: {
        thumb: { cmc: -0.2, mcp: 0.0, ip: 0.0, opposition: 0.0 },
        index: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
        middle: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
        ring: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
        pinky: { base: 1.25, mid: 1.35, tip: 1.2, spread: 0.0 },
      },
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.05, 0.0, 0.0],
    },
    description: "Right thumbs-up fist rests on flat open left palm and both are lifted upward together.",
    facialExpression: "Urgent, attentive, supportive expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 7. I LOVE YOU
  // --------------------------------------------------------------------------
  iloveyou: {
    id: "iloveyou",
    name: "I Love You",
    meaningHindi: "मुझे तुमसे प्यार है",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.10, // Shoulder/neck level
      finalWristHeight: 0.10,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.14, // Pushing forward toward viewer
      totalMovementDistance: 0.14,
      palmOrientationStart: "Palm facing forward directly toward partner",
      palmOrientationEnd: "Pushed forward toward partner with affectionate tilt",
      wristRotationDegrees: [20.0, 2.8, 2.8],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Iconic 'ILY' handshape: Thumb, index, and pinky fully extended",
        "Middle and ring fingers folded tightly into palm",
        "Pushed forward gently twice toward conversational partner",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.65, 0.18, -1.05], forearm: [-1.25, 0.12, 0.08], wrist: [0.35, 0.05, 0.05] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_ILY_HANDSHAPE,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.05, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.65, 0.18, -1.05], forearm: [-1.10, 0.12, 0.08], wrist: [0.45, 0.05, 0.05] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_ILY_HANDSHAPE,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.05, 0.0, 0.0],
    },
    description: "Thumb, index, and pinky extended together facing partner in universal ILY handshape.",
    facialExpression: "Warm affectionate smile with loving eye contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 8. PLEASE
  // --------------------------------------------------------------------------
  please: {
    id: "please",
    name: "Please",
    meaningHindi: "कृपया",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.08, // Chest height right side
      finalWristHeight: -0.08,   // Center chest touch
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.25,
      depthDisplacement: 0.08,
      totalMovementDistance: 0.26,
      palmOrientationStart: "Right arm on right side at chest height, shoulder relaxed to right",
      palmOrientationEnd: "Right palm/wrist directly touching chest, elbow turned 90° from right to left, head bowed down",
      wristRotationDegrees: [20.0, 5.7, 8.6],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Right shoulder moves from right to left across the torso",
        "Right elbow turns 90 degrees from right to left horizontally across the chest",
        "Right wrist and palm touch flat against the center of the chest",
        "Head bows down in humble pleading respect while touching the chest",
        "Left hand remains relaxed at the side in neutral standby",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: {
        shoulder: [0.0, -0.10, 0.0],
        arm: [-0.55, 0.35, -1.05],
        forearm: [-1.45, 0.10, 0.15],
        wrist: [0.25, 0.10, 0.15],
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PLEASE_CHIN_THUMB_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04, 0.0, 0.0],
      neck: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: {
        shoulder: [0.04, 0.7854, 0.02], // Shoulder moved from right to left (45°)
        arm: [-0.55, -0.15, -1.05],      // Upper arm moved across to left
        forearm: [-1.55, 1.5708, 0.15],  // Elbow turned 90° from right to left across chest
        wrist: [0.35, -0.45, 0.25],      // Palm/wrist directly touching chest
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PLEASE_CHIN_THUMB_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.24, 0.0, 0.0], // Head bowed down while touching chest
      neck: [0.10, 0.0, 0.0],
    },
    description: "Right shoulder moves from right to left while the elbow turns 90 degrees from right to left and the palm/wrist touches the chest; head bows down while touching the chest for the please gesture; four fingers straight together and thumb closed across palm; left hand rests at side.",
    facialExpression: "Humble, polite, respectful pleading expression with head bowed down.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 9. SORRY
  // --------------------------------------------------------------------------
  sorry: {
    id: "sorry",
    name: "Sorry",
    meaningHindi: "माफ़ कीजिए",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "circular",
    measurements: {
      initialWristHeight: -0.08, // Sternum / heart level
      finalWristHeight: -0.08,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.0,
      totalMovementDistance: 0.25, // Circular circumference
      palmOrientationStart: "Closed fist knuckles resting against center chest",
      palmOrientationEnd: "Circling clockwise over sternum with head bowed",
      wristRotationDegrees: [25.8, 5.7, 11.5],
      trajectoryType: "circular",
      anatomicalFeatures: [
        "Closed A-handshape (thumb resting alongside index knuckle)",
        "Placed firmly over sternum / heart",
        "Circles clockwise with head bowed slightly in contrition",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, 0.20, -1.05], forearm: [-1.45, 0.15, 0.15], wrist: [0.45, 0.10, 0.20] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_A,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.12, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, 0.20, -1.05], forearm: [-1.45, 0.15, 0.15], wrist: [0.45, 0.10, 0.20] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_A,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.12, 0.0, 0.0],
    },
    description: "Closed fist circles over the chest in a circular motion with an apologetic expression.",
    facialExpression: "Apologetic, remorseful facial expression with head slightly bowed.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 10. STOP
  // --------------------------------------------------------------------------
  stop: {
    id: "stop",
    name: "Stop",
    meaningHindi: "रुको",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "chop",
    measurements: {
      initialWristHeight: 0.05,  // Right hand raised above left palm
      finalWristHeight: -0.15,  // Impact onto left palm
      verticalDisplacement: -0.20, // Decisive downward chop
      horizontalDisplacement: -0.06,
      depthDisplacement: -0.04,
      totalMovementDistance: 0.212,
      palmOrientationStart: "Left palm flat up; Right hand upright chopping angle",
      palmOrientationEnd: "Right pinky-edge flush against open left palm",
      wristRotationDegrees: [22.9, 5.7, -17.2],
      trajectoryType: "chop",
      anatomicalFeatures: [
        "Left hand holds flat open horizontal palm (barrier)",
        "Right hand chops down vertically edge-first (pinky side) with crisp stop",
        "Firm commanding posture and direct gaze",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.65, 0.20, -1.05], forearm: [-1.50, 0.15, 0.10], wrist: [0.40, 0.10, -0.30] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.30, -0.15, 0.0], wrist: [0.25, 0.0, 0.0] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.05, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.50, 0.20, -1.05], forearm: [-1.15, 0.15, 0.10], wrist: [0.40, 0.10, -0.05] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.30, -0.15, 0.0], wrist: [0.25, 0.0, 0.0] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.05, 0.0, 0.0],
    },
    description: "Pinky-edge of flat open right hand chops down firmly onto the open flat left palm.",
    facialExpression: "Firm, commanding, serious expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 11. PAIN
  // --------------------------------------------------------------------------
  pain: {
    id: "pain",
    name: "Pain",
    meaningHindi: "दर्द / तकलीफ",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "tap",
    measurements: {
      initialWristHeight: -0.12, // Chest / abdomen level
      finalWristHeight: -0.12,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.12, // Jabbing inward toward midline
      depthDisplacement: 0.0,
      totalMovementDistance: 0.12,
      palmOrientationStart: "Index fingers pointing toward each other",
      palmOrientationEnd: "Jabbing inward rhythmically without touching",
      wristRotationDegrees: [14.3, 5.7, 5.7],
      trajectoryType: "tap",
      anatomicalFeatures: [
        "Both hands in 1-handshape with index fingers pointing directly inward",
        "Fingertips jab toward each other repeatedly with wrist twists",
        "Pained grimace, furrowed brow, and squinted eyes",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, 0.22, -1.05], forearm: [-1.35, 0.20, 0.10], wrist: [0.25, 0.10, 0.10] },
      leftArm: { arm: [-0.55, -0.22, 1.05], forearm: [-1.35, -0.20, -0.10], wrist: [0.25, -0.10, -0.10] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.10, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, 0.22, -1.05], forearm: [-1.20, 0.20, 0.10], wrist: [0.25, 0.25, 0.10] },
      leftArm: { arm: [-0.55, -0.22, 1.05], forearm: [-1.20, -0.20, -0.10], wrist: [0.25, -0.25, -0.10] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.10, 0.0, 0.0],
    },
    description: "Both index fingers point toward each other and jab inward repeatedly in uncomfortable motion.",
    facialExpression: "Pained grimace with furrowed brows and squinted eyes.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 12. EAT
  // --------------------------------------------------------------------------
  eat: {
    id: "eat",
    name: "Eat",
    meaningHindi: "खाना",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.4,
    motionType: "arc",
    measurements: {
      initialWristHeight: 0.14,
      finalWristHeight: 0.30, // Lips / mouth level
      verticalDisplacement: 0.16,
      horizontalDisplacement: 0.35, // Moves from Quadrant III (-X) to mouth center
      depthDisplacement: -0.35, // Moves inward toward lips
      totalMovementDistance: 0.52,
      palmOrientationStart: "Right hand in Quadrant III (-X, -Y) holding morsel with thumb and four fingers pinched together, wrist turned 90° towards the mouth with palm facing upward/inward and elbow naturally directed towards the mouth",
      palmOrientationEnd: "Pinched fingertips brought directly to lips/mouth touching mouth surface with palm facing inward/upward, matching user reference photo",
      wristRotationDegrees: [97.4, -45.3, -20.1],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Thumb and four fingers (index, middle, ring, pinky) closed together with fingertips meeting thumb pad in pinched morsel eating handshape (matching user hand photo)",
        "From the very start in Quadrant III (-X, -Y), the wrist and finger cone are turned 90° towards the mouth (supinated, palm facing upward/inward), with pinched fingers, thumb, and elbow directed straight towards the mouth",
        "Hand moves smoothly upward and inward from Quadrant III directly to the mouth/lips (matching user selfie photo)",
        "Fingertips physically contact the mouth surface (X = 0.000, Y = 1.513, Z = 0.135)",
        "Left hand rests relaxed down at side doing nothing",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [0.97, -0.80, 0.59], forearm: [-2.15, 0.10, -0.45], wrist: [0.04, 3.11, 0.19] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PINCHED_EATING_MORSEL,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.03, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.37, -0.45, -0.99], forearm: [-1.95, 0.45, -0.65], wrist: [-0.05, 3.11, 0.11] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PINCHED_EATING_MORSEL,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.08, 0.0, 0.0],
    },
    description: "Right hand with thumb and all four fingers pinched together in morsel shape with wrist turned 180° opposite moves smoothly from Quadrant III up to touch the mouth twice in feeding motion; left hand rests at side.",
    facialExpression: "Pleasant, engaged expression with subtle head nod on mouth contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 13. DRINK
  // --------------------------------------------------------------------------
  drink: {
    id: "drink",
    name: "Drink",
    meaningHindi: "पीना",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.4,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.22, // In Quadrant III (lower chest / waist)
      finalWristHeight: 0.22,    // Raised and tilted to lips
      verticalDisplacement: 0.44,
      horizontalDisplacement: 0.22,
      depthDisplacement: -0.07,
      totalMovementDistance: 0.495,
      palmOrientationStart: "Curved 'C' cup hand held in Quadrant III with open thumb and 4 curved fingers",
      palmOrientationEnd: "Tilted up toward mouth touching lips with open thumb and curved fingers",
      wristRotationDegrees: [28.6, 2.9, 17.2],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Open thumb extended straight horizontally with 4 fingers bent in 'C' cup shape (photo match)",
        "Movement starts from Quadrant III and travels smoothly up to the mouth",
        "Elbow, arm, and wrist tilt the cup upward to touch the lips as head tilts gently back",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [0.97, -0.80, 0.59], forearm: [-2.15, 0.10, -0.45], wrist: [0.04, 1.54, 0.19] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_C_CUP,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.37, -0.45, -0.99], forearm: [-1.95, 0.45, -0.65], wrist: [0.15, 1.54, 0.11] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_C_CUP,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.08, 0.0, 0.0],
    },
    description: "From Quadrant III with elbow adjusted to the situation and wrist turned 180° opposite (Y = 1.54 rad), hand in 'C' cup shape (open thumb, 4 bent fingers) moves smoothly towards the lips of the mouth to drink.",
    facialExpression: "Neutral engaged expression with head slight tilt back on mouth contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 14. MORE
  // --------------------------------------------------------------------------
  more: {
    id: "more",
    name: "More",
    meaningHindi: "और / ज्यादा",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "tap",
    measurements: {
      initialWristHeight: -0.12, // Chest level
      finalWristHeight: -0.12,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.16, // Hands meet at midline X = 0
      depthDisplacement: 0.0,
      totalMovementDistance: 0.16,
      palmOrientationStart: "Both flattened 'O' hands spaced apart at chest",
      palmOrientationEnd: "Fingertips tapping together at chest midline",
      wristRotationDegrees: [17.2, 8.6, 5.7],
      trajectoryType: "tap",
      anatomicalFeatures: [
        "Both hands in flattened 'O' shapes held symmetrically at chest",
        "Fingertips tap together at midline repeatedly",
        "Attentive requesting expression",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, 0.20, -1.05], forearm: [-1.35, 0.20, 0.10], wrist: [0.30, 0.15, 0.10] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.35, -0.20, -0.10], wrist: [0.30, -0.15, -0.10] },
      rightHand: PRESET_FLATTENED_O,
      leftHand: PRESET_FLATTENED_O,
      head: [0.05, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, 0.20, -1.05], forearm: [-1.25, 0.20, 0.10], wrist: [0.40, 0.15, 0.10] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.25, -0.20, -0.10], wrist: [0.40, -0.15, -0.10] },
      rightHand: PRESET_FLATTENED_O,
      leftHand: PRESET_FLATTENED_O,
      head: [0.05, 0.0, 0.0],
    },
    description: "Both hands form flattened 'O' shapes and tap fingertips together at center chest repeatedly.",
    facialExpression: "Engaged, requesting or expectant expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 15. BATHROOM
  // --------------------------------------------------------------------------
  bathroom: {
    id: "bathroom",
    name: "Bathroom",
    meaningHindi: "शौचालय / बाथरूम",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "nod",
    measurements: {
      initialWristHeight: 0.10, // Shoulder height
      finalWristHeight: 0.10,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.08, // Rapid side-to-side oscillation
      depthDisplacement: 0.0,
      totalMovementDistance: 0.08,
      palmOrientationStart: "'T' handshape fist facing forward/left",
      palmOrientationEnd: "Shaking side-to-side rapidly at shoulder height",
      wristRotationDegrees: [14.3, 20.0, 5.7],
      trajectoryType: "nod",
      anatomicalFeatures: [
        "'T' handshape: Thumb protruding between index and middle fingers",
        "Held in front of shoulder and shaken rapidly side-to-side",
        "Discreet, polite facial posture",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.65, 0.18, -1.05], forearm: [-1.30, 0.15, 0.10], wrist: [0.25, -0.25, 0.10] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_T_HANDSHAPE,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.65, 0.18, -1.05], forearm: [-1.30, 0.15, 0.10], wrist: [0.25, 0.45, 0.10] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_T_HANDSHAPE,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04, 0.0, 0.0],
    },
    description: "Hand in 'T' handshape shakes side-to-side at shoulder height indicating bathroom/toilet.",
    facialExpression: "Polite, discreet expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 16. HOW
  // --------------------------------------------------------------------------
  how: {
    id: "how",
    name: "How",
    meaningHindi: "कैसे",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.15,
      finalWristHeight: -0.15,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.10, // Rolling outward
      depthDisplacement: 0.08,
      totalMovementDistance: 0.128,
      palmOrientationStart: "Backs of curved hands facing forward, thumbs upright",
      palmOrientationEnd: "Wrists rolled outward so palms face upward",
      wristRotationDegrees: [14.3, 43.0, 5.7],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Both hands curved at chest with thumbs extended upright",
        "Simultaneous outward wrist supination until palms face up",
        "Questioning head tilt and brow furrow",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, 0.18, -1.05], forearm: [-1.25, 0.15, 0.10], wrist: [0.25, 0.10, 0.10] },
      leftArm: { arm: [-0.55, -0.18, 1.05], forearm: [-1.25, -0.15, -0.10], wrist: [0.25, -0.10, -0.10] },
      rightHand: {
        thumb: { cmc: -0.15, mcp: 0.0, ip: 0.0, opposition: 0.0 }, // Thumb upright
        index: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
        middle: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
        ring: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
        pinky: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
      },
      leftHand: {
        thumb: { cmc: -0.15, mcp: 0.0, ip: 0.0, opposition: 0.0 },
        index: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
        middle: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
        ring: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
        pinky: { base: 0.6, mid: 0.7, tip: 0.6, spread: 0.0 },
      },
      head: [0.08, 0.0, 0.05],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, 0.18, -1.05], forearm: [-1.25, 0.15, 0.10], wrist: [0.25, 0.85, 0.10] },
      leftArm: { arm: [-0.55, -0.18, 1.05], forearm: [-1.25, -0.15, -0.10], wrist: [0.25, -0.85, -0.10] },
      rightHand: PRESET_OPEN_SPREAD_5,
      leftHand: PRESET_OPEN_SPREAD_5,
      head: [0.08, 0.0, 0.05],
    },
    description: "Curved hands held at chest roll outward until palms face upward in questioning posture.",
    facialExpression: "Inquisitive brow furrow with gentle forward head tilt.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 17. WHAT
  // --------------------------------------------------------------------------
  what: {
    id: "what",
    name: "What",
    meaningHindi: "क्या",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.16, // Solar plexus / waist level
      finalWristHeight: -0.16,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.14, // Lateral undulation
      depthDisplacement: 0.0,
      totalMovementDistance: 0.14,
      palmOrientationStart: "Both flat open palms facing up in front of waist",
      palmOrientationEnd: "Pulsing side to side with questioning head motion",
      wristRotationDegrees: [14.3, 17.2, 0.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Both open palms held upward in front of waist/abdomen",
        "Undulate side to side symmetrically",
        "Raised eyebrows and questioning head tilt",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, 0.28, -1.05], forearm: [-1.25, 0.15, 0.10], wrist: [0.25, -0.15, 0.0] },
      leftArm: { arm: [-0.55, -0.28, 1.05], forearm: [-1.25, -0.15, -0.10], wrist: [0.25, 0.15, 0.0] },
      rightHand: PRESET_OPEN_SPREAD_5,
      leftHand: PRESET_OPEN_SPREAD_5,
      head: [0.08, -0.06, 0.05],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, 0.08, -1.05], forearm: [-1.25, 0.15, 0.10], wrist: [0.25, 0.15, 0.0] },
      leftArm: { arm: [-0.55, -0.08, 1.05], forearm: [-1.25, -0.15, -0.10], wrist: [0.25, -0.15, 0.0] },
      rightHand: PRESET_OPEN_SPREAD_5,
      leftHand: PRESET_OPEN_SPREAD_5,
      head: [0.08, 0.06, 0.05],
    },
    description: "Both open palms held up at waist level, pulsing side to side in questioning inquiry.",
    facialExpression: "Questioning head tilt and raised eyebrows.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 18. WHERE
  // --------------------------------------------------------------------------
  where: {
    id: "where",
    name: "Where",
    meaningHindi: "कहाँ",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "nod",
    measurements: {
      initialWristHeight: 0.26, // Eye level
      finalWristHeight: 0.26,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.12, // Waving side-to-side
      depthDisplacement: 0.0,
      totalMovementDistance: 0.12,
      palmOrientationStart: "Right upright index finger pointing up at eye level",
      palmOrientationEnd: "Waving side-to-side repeatedly",
      wristRotationDegrees: [14.3, 14.3, 5.7],
      trajectoryType: "nod",
      anatomicalFeatures: [
        "Right index finger pointing upright (1-handshape) at shoulder/eye level",
        "Waves side-to-side with lateral wrist oscillation",
        "Inquisitive head tilt and questioning gaze",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.65, 0.15, -1.05], forearm: [-1.35, 0.15, 0.10], wrist: [0.25, -0.15, 0.10] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.05, -0.08, 0.10],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.65, 0.15, -1.05], forearm: [-1.35, 0.15, 0.10], wrist: [0.25, 0.35, 0.10] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.05, 0.08, 0.10],
    },
    description: "Right hand raised with upright index finger waving side-to-side in questioning gesture.",
    facialExpression: "Inquisitive expression with subtle questioning head tilt.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 19. WHEN
  // --------------------------------------------------------------------------
  when: {
    id: "when",
    name: "When",
    meaningHindi: "कब",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.4,
    motionType: "circular",
    measurements: {
      initialWristHeight: -0.06, // Chest level
      finalWristHeight: -0.06,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.0,
      totalMovementDistance: 0.32, // Circular orbit circumference
      palmOrientationStart: "Left index upright stationary; Right index circling around it",
      palmOrientationEnd: "Right index lands touching left index fingertip",
      wristRotationDegrees: [17.2, 11.5, 11.5],
      trajectoryType: "circular",
      anatomicalFeatures: [
        "Left index finger held stationary upright at chest level",
        "Right index finger traces a complete clockwise circular orbit around left fingertip",
        "Ends by touching the tip of left index finger",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.50, 0.20, -1.05], forearm: [-1.20, 0.20, 0.10], wrist: [0.30, 0.20, 0.20] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.30, -0.20, 0.0], wrist: [0.20, 0.0, 0.0] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.06, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.65, 0.20, -1.05], forearm: [-1.35, 0.20, 0.10], wrist: [0.30, 0.20, 0.20] },
      leftArm: { arm: [-0.55, -0.20, 1.05], forearm: [-1.30, -0.20, 0.0], wrist: [0.20, 0.0, 0.0] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.06, 0.0, 0.0],
    },
    description: "Right index finger circles around left index finger and lands touching its fingertip in questioning motion.",
    facialExpression: "Questioning brow furrow with head tilted slightly.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 20. NAMASTE / ANJALI MUDRA
  // --------------------------------------------------------------------------
  namaste: {
    id: "namaste",
    name: "Namaste",
    meaningHindi: "नमस्ते / नमस्कार",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.4,
    motionType: "linear",
    measurements: {
      initialWristHeight: -0.05, // Midline heart / sternum level
      finalWristHeight: -0.05,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0, // Flush at midline X = 0
      depthDisplacement: 0.0,
      totalMovementDistance: 0.18, // Inward joining travel path
      palmOrientationStart: "Both flat palms angled inward toward chest center",
      palmOrientationEnd: "Both palms pressed flush palm-to-palm at midline (X = 0)",
      wristRotationDegrees: [-68.7, 50.4, -96.2],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Anjali Mudra: Both palms pressed flush palm-to-palm at chest midline (X = 0)",
        "Fingers pointing straight upward with anatomical alignment",
        "Slight respectful head, neck, and upper-spine bow",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [0.10, 0.0, -1.12], forearm: [0.70, 0.0, 0.40], wrist: [-0.80, 0.40, -1.20] },
      leftArm: { arm: [0.10, 0.0, 1.12], forearm: [0.70, 0.0, -0.40], wrist: [-0.80, -0.40, 1.20] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.0, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [0.32, 0.0, -1.12], forearm: [1.00, 0.0, 0.40], wrist: [-1.20, 0.88, -1.68] },
      leftArm: { arm: [0.32, 0.0, 1.12], forearm: [1.00, 0.0, -0.40], wrist: [-1.20, -0.88, 1.68] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.18, 0.0, 0.0],
      neck: [0.10, 0.0, 0.0],
      spine: [0.08, 0.0, 0.0],
    },
    description: "Traditional Indian greeting: Both palms pressed flush together at chest with head slight bow.",
    facialExpression: "Respectful, serene expression with gentle head bow.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 21. YOU (Both hands index fingers pointing forward towards the user)
  // --------------------------------------------------------------------------
  you: {
    id: "you",
    name: "You",
    meaningHindi: "आप / तुम",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "linear",
    measurements: {
      initialWristHeight: -0.05, // Mid-chest level
      finalWristHeight: -0.05,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.15, // Pushing forward directly toward user
      totalMovementDistance: 0.15,
      palmOrientationStart: "Both hands in 1-handshape with index fingers pointing forward towards the user",
      palmOrientationEnd: "Both index fingers pointing directly towards user with subtle forward pulse",
      wristRotationDegrees: [5.7, 0.0, 2.8],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Bilateral pointing gesture: Both hands active simultaneously",
        "Both hands in 1-handshape: Index fingers fully extended pointing forward at user",
        "Remaining fingers (middle, ring, pinky) curled into palms, thumbs tucked over fingers",
        "Both arms extended forward at chest height toward the camera/user",
        "Direct respectful eye contact and engaging forward gaze",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.65, 0.10, -1.05], forearm: [-0.75, 0.05, 0.05], wrist: [0.10, 0.0, 0.05] },
      leftArm: { arm: [-0.65, -0.10, 1.05], forearm: [-0.75, -0.05, -0.05], wrist: [0.10, 0.0, -0.05] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.04, 0.0, 0.0],
      neck: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.65, 0.10, -1.05], forearm: [-0.55, 0.05, 0.05], wrist: [0.10, 0.0, 0.05] },
      leftArm: { arm: [-0.65, -0.10, 1.05], forearm: [-0.55, -0.05, -0.05], wrist: [0.10, 0.0, -0.05] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.04, 0.0, 0.0],
      neck: [0.02, 0.0, 0.0],
    },
    description: "Both hands raised forward with index fingers pointed directly towards the user in a direct bilateral pointing gesture.",
    facialExpression: "Direct attentive eye contact and engaging warm expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 21. CLIMB
  // --------------------------------------------------------------------------
  climb: {
    id: "climb",
    name: "Climb",
    meaningHindi: "चढ़ना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.4,
    motionType: "wave",
    measurements: {
      initialWristHeight: -0.20,
      finalWristHeight: -0.12,
      verticalDisplacement: 0.08,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.06,
      totalMovementDistance: 0.10,
      palmOrientationStart: "Both elbows bent 90° to each other, wrists turned 90° across body (right hand right-to-left, left hand left-to-right) with flat downward palms. Left hand begins lower while right hand starts at base step.",
      palmOrientationEnd: "Both hands continuously climb stairs, alternating steps over each other: first left hand steps up and over right hand, then right hand steps up and over left hand, repeating continuously.",
      wristRotationDegrees: [-65.3, -65.3, -63.6],
      trajectoryType: "wave",
      anatomicalFeatures: [
        "Both elbows bent 90 degrees to each other in front of the body",
        "Both wrists turned 90 degrees across the body: right hand from right to left, left hand from left to right",
        "Both palms flat facing downward throughout the entire climbing sequence",
        "Continuous stairs climbing with both hands actively moving: first left hand steps up and over right hand, then right hand steps up and over left hand",
        "Seamless alternating loop repeating continuously like climbing an endless staircase",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [0.0, 0.0, -0.80], forearm: [1.35, 0.0, -0.40], wrist: [-1.14, -1.14, -1.11] }, // Right hand planted on base step (elbow bent 90°, wrist turned 90° right-to-left, flat palm down)
      leftArm: { arm: [0.0, 0.0, 0.65], forearm: [1.35, 0.0, 0.40], wrist: [-1.14, 1.14, 1.11] },  // Left hand starting below right hand (elbow bent 90°, wrist turned 90° left-to-right, flat palm down)
      rightHand: PRESET_FLAT_PALM_DOWN,
      leftHand: PRESET_FLAT_PALM_DOWN,
      head: [-0.05, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [0.0, 0.0, -1.10], forearm: [1.35, 0.0, -0.40], wrist: [-1.14, -1.14, -1.11] }, // Right hand climbs up and over left hand onto upper step
      leftArm: { arm: [0.0, 0.0, 0.65], forearm: [1.35, 0.0, 0.40], wrist: [-1.14, 1.14, 1.11] },  // Left hand settles down ready for next cycle
      rightHand: PRESET_FLAT_PALM_DOWN,
      leftHand: PRESET_FLAT_PALM_DOWN,
      head: [-0.05, 0.0, 0.0],
    },
    description: "Both hands continuously climb stairs alternating steps over each other: first the left hand moves up and over the right hand onto the higher step, then the right hand steps up and over the left hand onto the next step, repeating continuously with both elbows bent 90 degrees to each other, wrists turned 90 degrees (right from right to left, left from left to right), and flat downward palms.",
    facialExpression: "Attentive, engaged upward gaze with focused climbing expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 22. RUN (Modified L-handshape on both hands with index & thumb open, middle/ring/pinky closed in fists;
  // Left elbow turned 90° from left to right across torso, left index finger touching right thumb from back;
  // Right index finger pointing forward towards the user)
  // --------------------------------------------------------------------------
  run: {
    id: "run",
    name: "Run",
    meaningHindi: "भागना / दौड़ना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.6,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.15,
      finalWristHeight: 0.05,
      verticalDisplacement: 0.20,
      horizontalDisplacement: 0.12,
      depthDisplacement: 0.32,
      totalMovementDistance: 0.40,
      palmOrientationStart: "Both hands in modified L-hands (index & thumb extended, middle/ring/pinky in fists); left elbow turned 90° left-to-right across chest with left index touching posterior right thumb; right index pointing forward towards user",
      palmOrientationEnd: "Both hands maintain hooked contact and propel forward in rhythmic running strokes, pulsing forward along Z towards user before returning to rest",
      wristRotationDegrees: [43.0, -11.5, -20.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Both hands close all fingers except index finger and thumb (modified L-handshape PRESET_RUN_L_HAND)",
        "Middle, ring, and pinky fingers curled tightly into fist against palm",
        "Left hand elbow moved from left to right for 90 degrees across chest",
        "Left hand index finger touches through the thumb of the right hand from the back",
        "Right hand index finger pointing directly forward towards the user (positive Z)",
        "Both hands pulse forward and backward rhythmically together in running stride cadence",
        "Active forward running lean with focused determined gaze",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.35, 0.45, -0.70], forearm: [-1.35, 0.10, -0.95], wrist: [0.75, -0.20, -0.35] },
      leftArm: { arm: [-0.35, -0.05, 1.15], forearm: [-1.45, 0.30, 1.45], wrist: [0.10, 0.20, 0.25] },
      rightHand: PRESET_RUN_L_HAND,
      leftHand: PRESET_RUN_L_HAND,
      head: [0.08, 0.0, 0.0],
      spine: [0.05, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.48, 0.40, -0.70], forearm: [-1.05, 0.10, -0.95], wrist: [0.85, -0.20, -0.35] },
      leftArm: { arm: [-0.48, -0.05, 1.15], forearm: [-1.15, 0.30, 1.45], wrist: [0.15, 0.20, 0.25] },
      rightHand: PRESET_RUN_L_HAND,
      leftHand: PRESET_RUN_L_HAND,
      head: [0.08, 0.0, 0.0],
      spine: [0.05, 0.0, 0.0],
    },
    description: "In RUN sign language: close all fingers except index finger and thumb on both hands (forming modified L-handshapes with middle, ring, pinky in closed fists). The left elbow is turned 90 degrees from left to right across the torso so the left index finger touches the right thumb from the back. The right hand index finger points directly forward towards the user. Both hands perform coordinated forward-and-back running propulsion pulses in running cadence while maintaining touch contact.",
    facialExpression: "Energetic running focus with active forward head tilt and determined gaze.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 23. FALL
  // --------------------------------------------------------------------------
  fall: {
    id: "fall",
    name: "Fall",
    meaningHindi: "गिरना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.12,
      finalWristHeight: -0.22,
      verticalDisplacement: -0.34,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.15,
      totalMovementDistance: 0.37,
      palmOrientationStart: "Both hands in front of body with fingers slightly bent, palms facing forward-down",
      palmOrientationEnd: "Hands drop rapidly downward with wrists flexing down following downward movement",
      wristRotationDegrees: [28.6, 0.0, 5.7],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Both hands positioned in front of the body with fingers slightly bent",
        "Move hands downward to represent falling",
        "Elbows kept slightly bent throughout descent",
        "Wrists flex downward following the falling motion",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.60, -0.15, -0.90], forearm: [-1.30, 0.30, -0.15], wrist: [0.10, 0.0, 0.0] },
      leftArm: { arm: [-0.60, 0.15, 0.90], forearm: [-1.30, -0.30, 0.15], wrist: [0.10, 0.0, 0.0] },
      rightHand: PRESET_SLIGHTLY_BENT_OPEN,
      leftHand: PRESET_SLIGHTLY_BENT_OPEN,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.15, -0.10, -1.15], forearm: [-0.45, 0.15, -0.10], wrist: [0.55, 0.0, 0.10] },
      leftArm: { arm: [-0.15, 0.10, 1.15], forearm: [-0.45, -0.15, 0.10], wrist: [0.55, 0.0, -0.10] },
      rightHand: PRESET_SLIGHTLY_BENT_OPEN,
      leftHand: PRESET_SLIGHTLY_BENT_OPEN,
      head: [0.15, 0.0, 0.0],
    },
    description: "Position both hands in front of the body, with the fingers slightly bent. Move the hands downward to represent falling, keeping the elbows slightly bent and allowing the wrists to follow the downward movement.",
    facialExpression: "Surprised or concerned expression following the downward drop.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 24. GIVE
  // --------------------------------------------------------------------------
  give: {
    id: "give",
    name: "Give",
    meaningHindi: "देना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "linear",
    measurements: {
      initialWristHeight: -0.05,
      finalWristHeight: 0.05,
      verticalDisplacement: 0.10,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.28,
      totalMovementDistance: 0.30,
      palmOrientationStart: "Both hands in front of body close to chest, palms facing upward, fingers gently curved",
      palmOrientationEnd: "Hands moved smoothly forward together in offering, wrists aligned with hands",
      wristRotationDegrees: [5.7, 80.2, 0.0],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Both hands held in front of the body with palms facing upward",
        "Fingers gently curved in open offering cup",
        "Move hands forward together as if offering something to another person",
        "Elbows slightly bent and wrists kept aligned with hands",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.35, -0.10, -0.95], forearm: [-1.45, 0.25, -0.10], wrist: [0.0, -1.40, 0.0] },
      leftArm: { arm: [-0.35, 0.10, 0.95], forearm: [-1.45, -0.25, 0.10], wrist: [0.0, 1.40, 0.0] },
      rightHand: PRESET_GENTLE_CURVE_PALM_UP,
      leftHand: PRESET_GENTLE_CURVE_PALM_UP,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.70, -0.15, -0.90], forearm: [-0.85, 0.15, -0.15], wrist: [-0.10, -1.40, 0.0] },
      leftArm: { arm: [-0.70, 0.15, 0.90], forearm: [-0.85, -0.15, 0.15], wrist: [-0.10, 1.40, 0.0] },
      rightHand: PRESET_GENTLE_CURVE_PALM_UP,
      leftHand: PRESET_GENTLE_CURVE_PALM_UP,
      head: [0.08, 0.0, 0.0],
    },
    description: "Hold both hands in front of the body, with the palms facing upward and the fingers gently curved. Move the hands forward together as if offering something to another person. Keep the elbows slightly bent and the wrists aligned with the hands.",
    facialExpression: "Warm, generous, welcoming smile with polite forward nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 25. PUSH
  // --------------------------------------------------------------------------
  push: {
    id: "push",
    name: "Push",
    meaningHindi: "धक्का देना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.05,
      finalWristHeight: 0.05,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.30,
      totalMovementDistance: 0.30,
      palmOrientationStart: "Both hands in fists in front of chest, elbows bent",
      palmOrientationEnd: "Both forearms thrust forward pushing away, fists maintained, wrists aligned",
      wristRotationDegrees: [0.0, 0.0, 0.0],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Make both hands into fists and position them in front of the chest",
        "Keep elbows bent initially, then move both forearms forward",
        "Move forward as if pushing an object away with force",
        "Maintain fist shape and keep wrists firmly aligned with forearms",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.40, -0.20, -1.05], forearm: [-1.75, 0.35, -0.20], wrist: [0.0, 0.0, 0.0] },
      leftArm: { arm: [-0.40, 0.20, 1.05], forearm: [-1.75, -0.35, 0.20], wrist: [0.0, 0.0, 0.0] },
      rightHand: PRESET_CLOSED_FIST_S,
      leftHand: PRESET_CLOSED_FIST_S,
      head: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.85, -0.15, -0.85], forearm: [-0.60, 0.10, -0.10], wrist: [0.0, 0.0, 0.0] },
      leftArm: { arm: [-0.85, 0.15, 0.85], forearm: [-0.60, -0.10, 0.10], wrist: [0.0, 0.0, 0.0] },
      rightHand: PRESET_CLOSED_FIST_S,
      leftHand: PRESET_CLOSED_FIST_S,
      head: [0.08, 0.0, 0.0],
    },
    description: "Make both hands into fists and position them in front of the chest. Keep the elbows bent, then move both forearms forward as if pushing an object away. Maintain the fist shape and keep the wrists aligned with the forearms.",
    facialExpression: "Determined, firm exertion expression with forward focus.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 26. CRY
  // --------------------------------------------------------------------------
  cry: {
    id: "cry",
    name: "Cry",
    meaningHindi: "रोना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.25,
      finalWristHeight: 0.10,
      verticalDisplacement: -0.15,
      horizontalDisplacement: 0.0,
      depthDisplacement: -0.05,
      totalMovementDistance: 0.16,
      palmOrientationStart: "Both hands raised to eyes, index fingers extended, others curled",
      palmOrientationEnd: "Index fingers trace downward along cheeks representing tears",
      wristRotationDegrees: [14.3, 14.3, 2.9],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Raise both hands toward the eyes",
        "Keep index fingers extended while remaining fingers are gently curled",
        "Move hands downward along the cheeks to represent tears",
        "Keep elbows slightly bent and allow wrists to follow the downward movement",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-1.20, -0.30, -0.65], forearm: [-1.95, 0.30, -0.35], wrist: [-0.20, -0.30, 0.0] },
      leftArm: { arm: [-1.20, 0.30, 0.65], forearm: [-1.95, -0.30, 0.35], wrist: [-0.20, 0.30, 0.0] },
      rightHand: PRESET_INDEX_EXTENDED_TEAR,
      leftHand: PRESET_INDEX_EXTENDED_TEAR,
      head: [0.08, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.95, -0.25, -0.75], forearm: [-1.65, 0.25, -0.30], wrist: [0.25, -0.25, 0.10] },
      leftArm: { arm: [-0.95, 0.25, 0.75], forearm: [-1.65, -0.25, 0.30], wrist: [0.25, 0.25, -0.10] },
      rightHand: PRESET_INDEX_EXTENDED_TEAR,
      leftHand: PRESET_INDEX_EXTENDED_TEAR,
      head: [0.12, 0.0, 0.0],
    },
    description: "Raise both hands toward the eyes, keeping the index fingers extended and the remaining fingers gently curled. Move the hands downward along the cheeks to represent tears, with the elbows slightly bent and the wrists following the movement.",
    facialExpression: "Sorrowful, emotional expression with downturned mouth and soft brow.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 27. SLEEP
  // --------------------------------------------------------------------------
  sleep: {
    id: "sleep",
    name: "Sleep",
    meaningHindi: "सोना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.4,
    motionType: "static",
    measurements: {
      initialWristHeight: 0.28,
      finalWristHeight: 0.28,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.05,
      depthDisplacement: -0.05,
      totalMovementDistance: 0.07,
      palmOrientationStart: "Both hands raised toward sides of face, fingers gently curved, elbows bent",
      palmOrientationEnd: "Hands close to face near temples/cheeks, relaxed wrists, head resting to side",
      wristRotationDegrees: [11.5, 25.8, 5.7],
      trajectoryType: "static",
      anatomicalFeatures: [
        "Raise both hands toward the sides of the face with fingers gently curved",
        "Bring hands closer to the face while keeping elbows bent",
        "Maintain relaxed wrists and position hands near eyes or temples",
        "Head tilts gently to the side resting on the hands",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-1.15, -0.20, -0.65], forearm: [-1.75, 0.40, -0.20], wrist: [-0.15, -0.40, -0.10] },
      leftArm: { arm: [-1.15, 0.20, 0.65], forearm: [-1.75, -0.40, 0.20], wrist: [-0.15, 0.40, 0.10] },
      rightHand: PRESET_CURVED_RELAXED_FACE,
      leftHand: PRESET_CURVED_RELAXED_FACE,
      head: [0.02, 0.02, 0.05],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.25, -0.25, -0.60], forearm: [-1.85, 0.45, -0.25], wrist: [-0.20, -0.45, -0.10] },
      leftArm: { arm: [-1.25, 0.25, 0.60], forearm: [-1.85, -0.45, 0.25], wrist: [-0.20, 0.45, 0.10] },
      rightHand: PRESET_CURVED_RELAXED_FACE,
      leftHand: PRESET_CURVED_RELAXED_FACE,
      head: [0.05, 0.08, 0.22],
    },
    description: "Raise both hands toward the sides of the face, with the fingers gently curved. Bring the hands closer to the face while keeping the elbows bent. Maintain relaxed wrists and position the hands near the eyes or temples, as illustrated.",
    facialExpression: "Peaceful, serene expression with gentle head tilt as if resting asleep.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 28. SIT DOWN
  // --------------------------------------------------------------------------
  sit_down: {
    id: "sit_down",
    name: "Sit Down",
    meaningHindi: "बैठना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.08,
      finalWristHeight: -0.18,
      verticalDisplacement: -0.26,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.10,
      totalMovementDistance: 0.28,
      palmOrientationStart: "Both hands in front of body, fingers slightly bent, palms facing each other",
      palmOrientationEnd: "Both hands move downward together, elbows relaxed, wrists aligned with forearms",
      wristRotationDegrees: [2.9, 8.6, 0.0],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Position both hands in front of the body with fingers slightly bent",
        "Palms oriented toward each other across body midline",
        "Move hands downward together to indicate sitting down",
        "Keep elbows relaxed and wrists aligned with forearms",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, -0.20, -0.95], forearm: [-1.35, 0.35, -0.15], wrist: [0.05, 0.15, 0.0] },
      leftArm: { arm: [-0.55, 0.20, 0.95], forearm: [-1.35, -0.35, 0.15], wrist: [0.05, -0.15, 0.0] },
      rightHand: PRESET_SLIGHTLY_BENT_OPEN,
      leftHand: PRESET_SLIGHTLY_BENT_OPEN,
      head: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.25, -0.15, -1.10], forearm: [-0.85, 0.20, -0.10], wrist: [0.05, 0.15, 0.0] },
      leftArm: { arm: [-0.25, 0.15, 1.10], forearm: [-0.85, -0.20, 0.10], wrist: [0.05, -0.15, 0.0] },
      rightHand: PRESET_SLIGHTLY_BENT_OPEN,
      leftHand: PRESET_SLIGHTLY_BENT_OPEN,
      head: [0.08, 0.0, 0.0],
    },
    description: "Position both hands in front of the body, with the fingers slightly bent and the palms oriented toward each other. Move the hands downward together to indicate sitting down, keeping the elbows relaxed and the wrists aligned with the forearms.",
    facialExpression: "Calm, settling expression with slight downward nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 29. KICK
  // --------------------------------------------------------------------------
  kick: {
    id: "kick",
    name: "Kick",
    meaningHindi: "लात मारना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "right",
    durationSeconds: 1.8,
    motionType: "linear",
    measurements: {
      initialWristHeight: -0.05,
      finalWristHeight: 0.05,
      verticalDisplacement: 0.10,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.22,
      totalMovementDistance: 0.24,
      palmOrientationStart: "Single right hand in front of body, index extended, remaining fingers curled",
      palmOrientationEnd: "Hand strikes forward in short, controlled motion, wrist aligned with forearm",
      wristRotationDegrees: [5.7, 0.0, 0.0],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Hold one hand in front of the body with index finger extended",
        "Remaining fingers curled into palm representing leg action",
        "Move hand forward in a short, controlled motion representing kicking",
        "Elbow slightly bent and wrist kept aligned with forearm",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.45, -0.15, -1.05], forearm: [-1.25, 0.25, -0.15], wrist: [0.10, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_INDEX_KICK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.75, -0.10, -0.95], forearm: [-0.95, 0.15, -0.10], wrist: [0.10, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_INDEX_KICK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.06, 0.0, 0.0],
    },
    description: "Hold one hand in front of the body, with the index finger extended and the remaining fingers curled. Move the hand forward in a short, controlled motion to represent the kicking action. Keep the elbow slightly bent and the wrist aligned with the forearm.",
    facialExpression: "Sharp, energetic focus matching the forward kicking motion.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 30. WAIT
  // --------------------------------------------------------------------------
  wait: {
    id: "wait",
    name: "Wait",
    meaningHindi: "इंतजार करना / रुकना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "static",
    measurements: {
      initialWristHeight: -0.05,
      finalWristHeight: -0.05,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.0,
      totalMovementDistance: 0.04,
      palmOrientationStart: "Both hands held in front of body, fingers curled, wrists bent slightly downward",
      palmOrientationEnd: "Elbows bent, hands held relatively still maintaining expectant wait posture",
      wristRotationDegrees: [16.0, 5.7, 0.0],
      trajectoryType: "static",
      anatomicalFeatures: [
        "Hold both hands in front of the body with fingers curled",
        "Wrists bent slightly downward in expectant posture",
        "Keep elbows bent comfortably",
        "Hands held relatively still maintaining the illustrated waiting position",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.45, -0.15, -1.05], forearm: [-1.30, 0.25, -0.15], wrist: [0.28, 0.10, 0.0] },
      leftArm: { arm: [-0.45, 0.15, 1.05], forearm: [-1.30, -0.25, 0.15], wrist: [0.28, -0.10, 0.0] },
      rightHand: PRESET_WAIT_CURVED,
      leftHand: PRESET_WAIT_CURVED,
      head: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.48, -0.15, -1.05], forearm: [-1.32, 0.25, -0.15], wrist: [0.28, 0.10, 0.0] },
      leftArm: { arm: [-0.48, 0.15, 1.05], forearm: [-1.32, -0.25, 0.15], wrist: [0.28, -0.10, 0.0] },
      rightHand: PRESET_WAIT_CURVED,
      leftHand: PRESET_WAIT_CURVED,
      head: [0.04, 0.0, 0.0],
    },
    description: "Hold both hands in front of the body, with the fingers curled and the wrists bent slightly downward. Keep the elbows bent and the hands relatively still, maintaining the illustrated hand position to represent waiting.",
    facialExpression: "Patient, expectant expression with calm attentive gaze.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 31. WALK
  // --------------------------------------------------------------------------
  walk: {
    id: "walk",
    name: "Walk",
    meaningHindi: "चलना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "wave",
    measurements: {
      initialWristHeight: -0.08,
      finalWristHeight: -0.08,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.20,
      totalMovementDistance: 0.20,
      palmOrientationStart: "Both hands in front of body, fingers curled, index fingers pointing downward",
      palmOrientationEnd: "Hands alternately swing forward and backward representing walking strides",
      wristRotationDegrees: [25.8, 0.0, 0.0],
      trajectoryType: "wave",
      anatomicalFeatures: [
        "Position both hands in front of the body with fingers curled",
        "Index fingers pointing downward representing two walking legs",
        "Move hands alternately forward and backward in walking strides",
        "Elbows slightly bent and wrists kept stable throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, -0.10, -1.05], forearm: [-1.20, 0.20, -0.10], wrist: [0.45, 0.0, 0.0] },
      leftArm: { arm: [-0.30, 0.10, 1.05], forearm: [-1.20, -0.20, 0.10], wrist: [0.45, 0.0, 0.0] },
      rightHand: PRESET_INDEX_POINTING_DOWN,
      leftHand: PRESET_INDEX_POINTING_DOWN,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.30, -0.10, -1.05], forearm: [-1.20, 0.20, -0.10], wrist: [0.45, 0.0, 0.0] },
      leftArm: { arm: [-0.55, 0.10, 1.05], forearm: [-1.20, -0.20, 0.10], wrist: [0.45, 0.0, 0.0] },
      rightHand: PRESET_INDEX_POINTING_DOWN,
      leftHand: PRESET_INDEX_POINTING_DOWN,
      head: [0.04, 0.0, 0.0],
    },
    description: "Position both hands in front of the body, with the fingers curled and the index fingers pointing downward. Move the hands alternately forward and backward to represent walking, keeping the elbows slightly bent and the wrists stable.",
    facialExpression: "Steady, pleasant walking rhythm with relaxed natural expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 32. WASH
  // --------------------------------------------------------------------------
  wash: {
    id: "wash",
    name: "Wash",
    meaningHindi: "धोना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.2,
    motionType: "circular",
    measurements: {
      initialWristHeight: 0.0,
      finalWristHeight: 0.0,
      verticalDisplacement: 0.08,
      horizontalDisplacement: 0.08,
      depthDisplacement: 0.05,
      totalMovementDistance: 0.12,
      palmOrientationStart: "Both hands brought together in front of body, fingers curved, palms facing each other",
      palmOrientationEnd: "Hands move against each other in rhythmic rubbing motion, wrists moving naturally",
      wristRotationDegrees: [8.6, 17.2, 0.0],
      trajectoryType: "circular",
      anatomicalFeatures: [
        "Bring both hands together in front of the body",
        "Fingers curved and palms facing each other in contact",
        "Move hands against each other in an active rubbing motion",
        "Keep elbows bent and allow wrists to move naturally with rubbing",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.55, -0.15, -0.95], forearm: [-1.45, 0.30, -0.20], wrist: [0.15, 0.30, 0.0] },
      leftArm: { arm: [-0.55, 0.15, 0.95], forearm: [-1.45, -0.30, 0.20], wrist: [0.15, -0.30, 0.0] },
      rightHand: PRESET_CUPPED_WASH,
      leftHand: PRESET_CUPPED_WASH,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.55, -0.15, -0.95], forearm: [-1.45, 0.30, -0.20], wrist: [-0.15, 0.30, 0.0] },
      leftArm: { arm: [-0.55, 0.15, 0.95], forearm: [-1.45, -0.30, 0.20], wrist: [-0.15, -0.30, 0.0] },
      rightHand: PRESET_CUPPED_WASH,
      leftHand: PRESET_CUPPED_WASH,
      head: [0.04, 0.0, 0.0],
    },
    description: "Bring both hands together in front of the body, with the fingers curved and the palms facing each other. Move the hands against each other in a rubbing motion, keeping the elbows bent and allowing the wrists to move naturally.",
    facialExpression: "Engaged, clean, attentive hygiene expression with downward gaze.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 33. LOOK
  // --------------------------------------------------------------------------
  look: {
    id: "look",
    name: "Look",
    meaningHindi: "देखना",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "right",
    durationSeconds: 2.0,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.25,
      finalWristHeight: 0.18,
      verticalDisplacement: -0.07,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.25,
      totalMovementDistance: 0.26,
      palmOrientationStart: "Single right hand raised near face, index and middle extended, other fingers curled",
      palmOrientationEnd: "Hand directed smoothly outward from face, elbow bent, wrist aligned with forearm",
      wristRotationDegrees: [0.0, 0.0, 0.0],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Raise one hand near the face representing the eyes",
        "Index and middle fingers extended in 'V' shape pointing forward",
        "Other fingers curled into palm",
        "Direct hand outward from face to represent looking, wrist aligned with forearm",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-1.15, -0.25, -0.70], forearm: [-1.90, 0.30, -0.30], wrist: [-0.15, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_TWO_FINGERS_LOOK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.75, -0.15, -0.90], forearm: [-1.10, 0.15, -0.15], wrist: [0.0, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_TWO_FINGERS_LOOK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.0, 0.0],
    },
    description: "Raise one hand near the face, with the index and middle fingers extended and the other fingers curled. Direct the hand outward from the face to represent looking, keeping the elbow bent and the wrist aligned with the forearm.",
    facialExpression: "Attentive, sharp, clear eye gaze looking forward along the finger direction.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // 34. JUMP
  // --------------------------------------------------------------------------
  jump: {
    id: "jump",
    name: "Jump",
    meaningHindi: "कूदना / छलांग",
    signLanguage: "ISL",
    referenceSource: "Everyday Things We Do",
    involvesHands: "both",
    durationSeconds: 2.0,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.15,
      finalWristHeight: 0.18,
      verticalDisplacement: 0.33,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.08,
      totalMovementDistance: 0.34,
      palmOrientationStart: "Both hands in front of body, fingers curled, palms oriented inward",
      palmOrientationEnd: "Both hands spring upward together, elbows slightly bent, wrists following upward movement",
      wristRotationDegrees: [14.3, 0.0, 0.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Hold both hands in front of the body with fingers curled",
        "Palms oriented inward toward the torso",
        "Move both hands upward together in spring arc to represent jumping",
        "Elbows slightly bent and wrists following the upward leap",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.35, -0.15, -1.10], forearm: [-1.10, 0.25, -0.15], wrist: [0.10, 0.0, 0.0] },
      leftArm: { arm: [-0.35, 0.15, 1.10], forearm: [-1.10, -0.25, 0.15], wrist: [0.10, 0.0, 0.0] },
      rightHand: PRESET_JUMP_CURLED,
      leftHand: PRESET_JUMP_CURLED,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.85, -0.20, -0.85], forearm: [-1.55, 0.35, -0.20], wrist: [-0.25, 0.0, 0.0] },
      leftArm: { arm: [-0.85, 0.20, 0.85], forearm: [-1.55, -0.35, 0.20], wrist: [-0.25, 0.0, 0.0] },
      rightHand: PRESET_JUMP_CURLED,
      leftHand: PRESET_JUMP_CURLED,
      head: [-0.08, 0.0, 0.0],
    },
    description: "Hold both hands in front of the body, with the fingers curled and the palms oriented inward. Move both hands upward together to represent jumping, keeping the elbows slightly bent and the wrists following the upward movement.",
    facialExpression: "Bouncy, playful, joyful jumping expression with head bouncing upward.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // QUIET (Right index finger held vertically upright directly against lips in "shhh" silence gesture)
  // --------------------------------------------------------------------------
  quiet: {
    id: "quiet",
    name: "Quiet",
    meaningHindi: "शांत / चुप",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.2,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.15, // Lower chest standby
      finalWristHeight: 0.20,    // Lips / mouth height (reference height +0.20m)
      verticalDisplacement: 0.35,
      horizontalDisplacement: 0.12,
      depthDisplacement: 0.05,
      totalMovementDistance: 0.37,
      palmOrientationStart: "Right arm poised at lower chest, index finger extended upright, thumb folded across curled fingers",
      palmOrientationEnd: "Single right index finger held vertically upright directly against center of lips in canonical 'shhh' silence gesture; left arm relaxed down at side",
      wristRotationDegrees: [6.9, 2.9, 8.6],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Single right index finger extended vertically upright directly in front of the center of the lips/mouth",
        "Thumb folded closed across the curled fingers",
        "Middle, ring, and pinky fingers curled tightly into a fist against the palm",
        "Palm orientation: back of hand facing forward / slightly outward towards camera",
        "Left arm remains completely relaxed straight down at the side (neutral rest)",
        "Calm, composed facial expression with lips closed in silence",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.15, 0.10, -1.15], forearm: [-0.60, 0.20, 0.10], wrist: [0.10, 0.05, 0.05] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_QUIET_SHHH_INDEX_LIPS,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.2491, -1.0362, -1.6999], forearm: [-2.2844, 2.9492, 0.8000], wrist: [0.1469, 0.6916, -0.3526] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_QUIET_SHHH_INDEX_LIPS,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
    },
    description: "Single right index finger extended vertically upright placed directly on the mouth with wrist turned 45 degrees up and elbow turned 180 degrees towards the mouth; all remaining fingers (middle, ring, pinky) and thumb tightly closed into a firm fist; left arm resting relaxed at side.",
    facialExpression: "Calm, quiet facial expression with closed lips and direct eye contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },
  loud: {
    id: "loud",
    name: "Loud",
    meaningHindi: "ज़ोर / शोर / चिल्लाना",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.6,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.25,
      finalWristHeight: 0.15,
      verticalDisplacement: 0.40,
      horizontalDisplacement: 0.25,
      depthDisplacement: 0.22,
      totalMovementDistance: 0.52,
      palmOrientationStart: "Both arms relaxed down at sides/waist in neutral standing rest position",
      palmOrientationEnd: "Both hands flare outward at face level with spread fingers, projecting sound loudly",
      wristRotationDegrees: [12.0, 8.5, 6.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Phase 1: Neutral starting pose with person standing straight, arms relaxed at waist sides, head forward",
        "Phase 2: Coordinated initial ascent from waist to torso, bending elbows and lifting wrists",
        "Phase 3: Both hands positioned in front of upper chest with relatively close distance, fingers opening",
        "Phase 4: Coordinated upward & outward flare from chest toward face level with open spread fingers",
        "Phase 5: Smooth deceleration returning both arms from chest back to relaxed waist rest pose",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [0.05, 0.05, -1.25], forearm: [-0.25, 0.10, 0.05], wrist: [0.10, 0.05, 0.05] },
      leftArm: { arm: [0.05, -0.05, 1.25], forearm: [-0.25, -0.10, -0.05], wrist: [0.10, -0.05, -0.05] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
    },
    intermediateKeyframes: [
      {
        timeFraction: 0.25,
        rightArm: { arm: [-0.55, 0.10, -0.95], forearm: [-1.25, 0.25, 0.15], wrist: [0.15, 0.40, 0.10] },
        leftArm: { arm: [-0.55, -0.10, 0.95], forearm: [-1.25, -0.25, -0.15], wrist: [0.15, -0.40, -0.10] },
        rightHand: PRESET_CUPPED_SHOUT_MOUTH,
        leftHand: PRESET_CUPPED_SHOUT_MOUTH,
        head: [0.0, 0.0, 0.0],
        neck: [0.0, 0.0, 0.0],
      },
      {
        timeFraction: 0.42,
        rightArm: { arm: [-0.95, -0.15, -1.15], forearm: [-1.65, 0.40, -0.15], wrist: [0.18, 0.85, 0.10] },
        leftArm: { arm: [-0.95, 0.15, 1.15], forearm: [-1.65, -0.40, 0.15], wrist: [0.18, -0.85, -0.10] },
        rightHand: PRESET_CUPPED_SHOUT_MOUTH,
        leftHand: PRESET_CUPPED_SHOUT_MOUTH,
        head: [0.02, 0.0, 0.0],
        neck: [0.01, 0.0, 0.0],
      },
      {
        timeFraction: 0.68,
        rightArm: { arm: [-1.15, -0.18, -1.35], forearm: [-1.40, 0.50, 0.15], wrist: [0.22, 0.20, -0.15] },
        leftArm: { arm: [-1.15, 0.18, 1.35], forearm: [-1.40, -0.50, -0.15], wrist: [0.22, -0.20, 0.15] },
        rightHand: PRESET_OPEN_SPREAD_5,
        leftHand: PRESET_OPEN_SPREAD_5,
        head: [-0.07, 0.0, 0.0],
        neck: [-0.04, 0.0, 0.0],
      },
    ],
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [0.05, 0.05, -1.25], forearm: [-0.25, 0.10, 0.05], wrist: [0.10, 0.05, 0.05] },
      leftArm: { arm: [0.05, -0.05, 1.25], forearm: [-0.25, -0.10, -0.05], wrist: [0.10, -0.05, -0.05] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
    },
    description: "5-phase coordinated trajectory matching reference video: starting from waist sides, ascending to upper chest, expanding upward and outward to face level with open fingers as shouting loudly, then smoothly descending back to neutral standing posture.",
    facialExpression: "Intense shout expression with open mouth, raised eyebrows, and physical exertion of projecting sound loudly.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // HAPPY (Both flat hands brushing upward along chest toward collarbones in rhythmic sweeps)
  // --------------------------------------------------------------------------
  happy: {
    id: "happy",
    name: "Happy",
    meaningHindi: "खुश / प्रसन्नता",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.8,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.22,
      finalWristHeight: 0.12,
      verticalDisplacement: 0.34,
      horizontalDisplacement: 0.02,
      depthDisplacement: 0.02,
      totalMovementDistance: 0.36,
      palmOrientationStart: "Both flat open palms placed in front of lower chest, palms facing inward toward body",
      palmOrientationEnd: "Both flat open palms brush upward along chest toward collarbones/chin with joyful smile",
      wristRotationDegrees: [-11.5, 17.2, -22.9],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Right elbow turned 90 degrees from right to left across in front of lower chest",
        "Left elbow turned 90 degrees from left to right across in front of lower chest",
        "Both flat open palms (PRESET_OPEN_FLAT_B) held flush facing inward toward the chest",
        "Wrists start turned DOWN pointing downward, then turn slowly from DOWN to UP",
        "Slow upward wrist rotation brushes flat palms upward along chest toward collarbones/chin",
        "Warm, radiant joyful smile on avatar face (mouthSmile morph target) with uplifted expression",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.20, 0.00, -0.85], forearm: [-1.35, -0.30, -1.45], wrist: [-1.94, 0.70, -2.04] },
      leftArm: { arm: [-0.20, 0.00, 0.85], forearm: [-1.35, 0.30, 1.45], wrist: [-1.94, -0.70, 2.04] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [-0.02, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.38, 0.05, -0.95], forearm: [-1.35, -0.30, -1.45], wrist: [-2.14, 0.80, 1.94] },
      leftArm: { arm: [-0.38, -0.05, 0.95], forearm: [-1.35, 0.30, 1.45], wrist: [-2.14, -0.80, -1.94] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [-0.10, 0.0, 0.0],
      neck: [-0.04, 0.0, 0.0],
    },
    description: "Both hands position in front of chest with right elbow turned 90 degrees from right to left and left elbow turned 90 degrees from left to right, flat palms facing chest; after that wrists turn slowly from pointing DOWN to pointing UP in repeated uplifting brushes along chest to collarbones with a warm, joyful radiant smile on the face.",
    facialExpression: "Warm, cheerful, radiant smile on the face with uplifted cheeks (mouthSmile morph target = 0.95) and slight head tilt of happiness.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // SAD (Single right index finger extended, all other fingers and thumb closed in a fist; placed at eye and moved from UP to DOWN)
  // --------------------------------------------------------------------------
  sad: {
    id: "sad",
    name: "Sad",
    meaningHindi: "उदास / दुःखी",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.8,
    motionType: "linear",
    measurements: {
      initialWristHeight: 0.35,
      finalWristHeight: 0.18,
      verticalDisplacement: -0.17,
      horizontalDisplacement: 0.03,
      depthDisplacement: 0.13,
      totalMovementDistance: 0.21,
      palmOrientationStart: "Both hands with index fingers extended straight and remaining fingers/thumbs closed in firm fists; placed directly at both eyes",
      palmOrientationEnd: "Both index fingers move simultaneously from UP to DOWN along both cheeks representing tears falling down",
      wristRotationDegrees: [8.6, 37.2, -25.8],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Both hands with index fingers extended straight; middle, ring, pinky and thumbs tightly closed into firm fists",
        "Both index fingertips placed directly at eyes / tear lines",
        "Both index fingers trace simultaneously from UP to DOWN along cheeks representing falling tears",
        "Head droops downward with sorrowful sad facial expression",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-1.22, -1.05, -1.70], forearm: [-2.28, 2.95, 0.80], wrist: [0.15, 0.65, -0.45] },
      leftArm:  { arm: [-1.22, 1.05, 1.70], forearm: [-2.28, -2.95, -0.80], wrist: [0.15, -0.65, 0.45] },
      rightHand: PRESET_SAD_TEAR_INDEX_EYE,
      leftHand: PRESET_SAD_TEAR_INDEX_EYE,
      head: [0.14, 0.0, 0.0],
      neck: [0.06, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.45, -1.25, -1.35], forearm: [-2.20, 2.90, 0.75], wrist: [-0.15, 0.55, -0.45] },
      leftArm:  { arm: [-1.45, 1.25, 1.35], forearm: [-2.20, -2.90, -0.75], wrist: [-0.15, -0.55, 0.45] },
      rightHand: PRESET_SAD_TEAR_INDEX_EYE,
      leftHand: PRESET_SAD_TEAR_INDEX_EYE,
      head: [0.16, 0.0, 0.0],
      neck: [0.08, 0.0, 0.0],
    },
    description: "Both hands have index fingers extended with thumbs and remaining fingers tightly closed in firm fists; index fingers placed at both eyes and moved simultaneously from UP to DOWN along both cheeks representing tears falling, with head drooping sadly in sorrow.",
    facialExpression: "Sorrowful, sad expression with head drooping forward-down and solemn downward gaze.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // BEAUTIFUL (L-hand circles face contour with index, then index & thumb close, 3 fingers open pointing to user with wrist at 90° of elbow)
  // --------------------------------------------------------------------------
  beautiful: {
    id: "beautiful",
    name: "Beautiful",
    meaningHindi: "सुंदर / ख़ूबसूरत",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "right",
    durationSeconds: 3.2,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.25,
      finalWristHeight: 0.28,
      verticalDisplacement: 0.53,
      horizontalDisplacement: 0.24,
      depthDisplacement: 0.20,
      totalMovementDistance: 0.62,
      palmOrientationStart: "Right elbow turns 180 degrees from 3rd quadrant towards the mouth and wrist rotates 180 degrees towards the mouth with L-handshape (all fingers closed except index and thumb); left hand rests at side",
      palmOrientationEnd: "Right index & thumb close, 3 fingers (middle, ring, pinky) open pointing towards user with wrist at 90 degrees to elbow",
      wristRotationDegrees: [83.0, 0.0, 3.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Right elbow turns 180 degrees from 3rd quadrant towards the mouth",
        "Right wrist rotates 180 degrees towards the mouth as the arm ascends",
        "Right hand forms L-handshape: index and thumb extended, middle/ring/pinky closed tightly in a fist",
        "Index finger circles around the contour of the signer's own face starting and finishing at the mouth",
        "At mouth level, index finger and thumb close while middle, ring, and pinky open straight pointing towards the user",
        "Right wrist bends 90 degrees relative to the elbow, directing the three open fingers forward at the user",
        "Warm, appreciative radiant smile with gentle admiring gaze (mouthSmile = 0.92)",
        "Left arm remains naturally relaxed at side throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.20, 0.10, -0.85], forearm: [-1.30, -0.30, -1.57], wrist: [-0.30, -1.57, 0.20] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_BEAUTIFUL_L_HAND,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.04, 0.04, 0.0],
      neck: [-0.02, 0.02, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.45, -0.10, -1.05], forearm: [-1.40, 0.15, 0.10], wrist: [1.57, 0.00, 0.00] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_BEAUTIFUL_THREE_FINGERS,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.05, 0.05, 0.0],
      neck: [-0.02, 0.02, 0.0],
    },
    description: "Turn elbow 180 degrees towards the mouth and rotate wrist also 180 degrees towards the mouth with all fingers closed except index finger and thumb (L-handshape), then round with the index finger on the circle of their own face, and after that close index finger and thumb and open another three fingers pointing towards the user with wrist at 90 degrees of the elbow.",
    facialExpression: "Warm, appreciative radiant smile with gentle admiring gaze (mouthSmile = 0.92).",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UGLY (Right claw hand placed in front of face and sweeps across/pulls away with distaste expression)
  // --------------------------------------------------------------------------
  ugly: {
    id: "ugly",
    name: "Ugly",
    meaningHindi: "कुरूप / भद्दा",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "right",
    durationSeconds: 2.6,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.25,
      finalWristHeight: 0.30,
      verticalDisplacement: 0.55,
      horizontalDisplacement: -0.32,
      depthDisplacement: 0.18,
      totalMovementDistance: 0.66,
      palmOrientationStart: "Right claw hand placed in front of nose/face, palm facing inward; left hand at side",
      palmOrientationEnd: "Right claw sweeps horizontally across face from left to right and pulls away with distaste",
      wristRotationDegrees: [12.0, -25.0, 18.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Right hand curved into claw handshape (PRESET_CLAW_HAND) in front of face",
        "Hand sweeps horizontally across face from left to right as if pulling a distorting mask away",
        "Avatar head turns slightly away with displeased grimace and wrinkled brow",
        "Left arm remains naturally relaxed down at side",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.85, -0.65, -1.25], forearm: [-1.75, 1.10, 0.85], wrist: [0.15, 0.50, -0.30] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLAW_HAND,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.05, -0.12, -0.05],
      neck: [0.02, -0.06, -0.02],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.60, -0.20, -1.55], forearm: [-1.20, 0.40, 0.35], wrist: [0.10, 0.15, -0.10] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLAW_HAND,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.08, -0.18, -0.08],
      neck: [0.04, -0.09, -0.04],
    },
    description: "Right claw hand rises in front of the face, sweeps horizontally across from left to right and pulls away sharply, while the avatar turns head slightly aside with a distasteful facial expression; left hand rests at side.",
    facialExpression: "Displeased expression with wrinkled nose/brow and slight turn of head in distaste.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // DEAF (Right index finger touches ear, then moves forward to touch mouth/chin, indicating cannot hear or speak)
  // --------------------------------------------------------------------------
  deaf: {
    id: "deaf",
    name: "Deaf",
    meaningHindi: "बधिर / बहरा",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "right",
    durationSeconds: 2.8,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.25,
      finalWristHeight: 0.38,
      verticalDisplacement: 0.63,
      horizontalDisplacement: 0.22,
      depthDisplacement: 0.14,
      totalMovementDistance: 0.68,
      palmOrientationStart: "Right index finger points to and touches right ear; left hand rests at side",
      palmOrientationEnd: "Right index finger transitions smoothly from ear to touch corner of mouth/chin",
      wristRotationDegrees: [5.0, 18.0, -12.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Right index finger extended straight while thumb and other fingers remain closed (PRESET_POINTING_1)",
        "Fingertip touches right ear lobe / ear area",
        "Finger sweeps smoothly in a forward arc to touch lips / chin area",
        "Compound ISL sign indicating hearing + speech impairment",
        "Left arm remains naturally relaxed down at side",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.95, -0.90, -1.45], forearm: [-1.95, 1.45, 0.90], wrist: [0.25, 0.60, -0.40] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.08, 0.04],
      neck: [0.01, 0.04, 0.02],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.80, -0.45, -1.20], forearm: [-1.65, 0.95, 0.60], wrist: [0.15, 0.35, -0.20] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.02, 0.0],
      neck: [0.01, 0.01, 0.0],
    },
    description: "Right hand with index finger extended touches the right ear, then moves forward in a smooth arc to touch near the lips/chin, expressing Deaf in Indian Sign Language; left hand rests at side.",
    facialExpression: "Attentive, neutral and respectful facial expression with direct eye contact.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // BLIND (Right V-handshape index & middle fingers point toward eyes, then sweep across with eyes closing)
  // --------------------------------------------------------------------------
  blind: {
    id: "blind",
    name: "Blind",
    meaningHindi: "दृष्टिहीन / अंधा",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "right",
    durationSeconds: 2.7,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.25,
      finalWristHeight: 0.40,
      verticalDisplacement: 0.65,
      horizontalDisplacement: 0.24,
      depthDisplacement: 0.16,
      totalMovementDistance: 0.71,
      palmOrientationStart: "Right V-handshape (index & middle fingers) points toward eyes at eye level; left hand at side",
      palmOrientationEnd: "Two extended fingers sweep horizontally across eye line as avatar gently closes eyes",
      wristRotationDegrees: [8.0, 15.0, -18.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Right hand in V-handshape with index and middle fingers extended apart (PRESET_TWO_FINGERS_LOOK)",
        "Fingertips point toward eye level / eyes",
        "Two fingers sweep horizontally across the eyes from right to left",
        "Avatar head nods slightly with solemn, respectful expression",
        "Left arm remains naturally relaxed down at side",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-1.05, -0.80, -1.40], forearm: [-1.90, 1.30, 0.85], wrist: [0.20, 0.55, -0.35] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_TWO_FINGERS_LOOK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.06, 0.0, 0.0],
      neck: [0.03, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-1.00, -0.40, -1.25], forearm: [-1.80, 0.90, 0.70], wrist: [0.15, 0.35, -0.25] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_TWO_FINGERS_LOOK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.08, 0.0, 0.0],
      neck: [0.04, 0.0, 0.0],
    },
    description: "Right hand in V-handshape points index and middle fingers toward the eyes at eye level, then sweeps horizontally across the sightline to convey Blind in Indian Sign Language; left hand rests at side.",
    facialExpression: "Solemn, respectful facial expression with eyelids gently softening.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },
  // --------------------------------------------------------------------------
  // ANGRY (Claw handshapes at chest, intense tensed expression)
  // --------------------------------------------------------------------------
  angry: {
    id: "angry",
    name: "Angry",
    meaningHindi: "गुस्सा / क्रोध",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.6,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.25,
      finalWristHeight: 0.10,
      verticalDisplacement: 0.35,
      horizontalDisplacement: 0.10,
      depthDisplacement: 0.12,
      totalMovementDistance: 0.39,
      palmOrientationStart: "Both claw hands start in front of lower ribs, palms facing inward toward body",
      palmOrientationEnd: "Both hands rise to upper chest level with tensed claw posture, conveying anger",
      wristRotationDegrees: [-10.0, 15.0, 20.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Both hands formed into claw handshapes with bent, tense fingers",
        "Hands rise upward from lower torso to chest level in rapid, forceful movement",
        "Avatar displays intense furrowed-brow frown with focused angry expression",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.30, 0.10, -0.60], forearm: [-1.20, 0.40, 0.20], wrist: [-0.20, 0.10, 0.20] },
      leftArm: { arm: [0.30, 0.10, -0.60], forearm: [1.20, 0.40, -0.20], wrist: [0.20, 0.10, -0.20] },
      rightHand: PRESET_CLAW_HAND,
      leftHand: PRESET_CLAW_HAND,
      head: [-0.08, 0.0, 0.0],
      neck: [-0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.70, -0.20, -1.10], forearm: [-1.80, 0.80, 0.50], wrist: [0.20, 0.30, -0.20] },
      leftArm: { arm: [0.70, -0.20, -1.10], forearm: [1.80, 0.80, -0.50], wrist: [-0.20, 0.30, 0.20] },
      rightHand: PRESET_CLAW_HAND,
      leftHand: PRESET_CLAW_HAND,
      head: [-0.12, 0.0, 0.0],
      neck: [-0.06, 0.0, 0.0],
    },
    description: "Both hands in claw handshapes rise vigorously up the torso toward the upper chest while the avatar shows a strong furrowed-brow frown, indicating Anger in ISL.",
    facialExpression: "Intense, furrowed frown conveying frustration and anger.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // GO (Both hands point forward and swing outward away from body)
  // --------------------------------------------------------------------------
  go: {
    id: "go",
    name: "Go",
    meaningHindi: "जाओ / जाना",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.4,
    motionType: "linear",
    measurements: {
      initialWristHeight: -0.10,
      finalWristHeight: -0.05,
      verticalDisplacement: 0.05,
      horizontalDisplacement: 0.18,
      depthDisplacement: 0.28,
      totalMovementDistance: 0.34,
      palmOrientationStart: "Index fingers pointing upward and slightly forward near chest",
      palmOrientationEnd: "Both hands pivot forward and thrust away from body toward destination",
      wristRotationDegrees: [25.0, 0.0, 0.0],
      trajectoryType: "linear",
      anatomicalFeatures: [
        "Both hands in index pointing handshape (PRESET_POINTING_1)",
        "Both arms push forward from mid-chest toward the horizon",
        "Wrists flex slightly downward to emphasize directing outward",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.40, 0.0, -0.80], forearm: [-1.40, 0.30, 0.10], wrist: [-0.20, 0.0, 0.0] },
      leftArm: { arm: [0.40, 0.0, -0.80], forearm: [1.40, 0.30, -0.10], wrist: [0.20, 0.0, 0.0] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.20, 0.15, -1.25], forearm: [-0.85, 0.15, 0.05], wrist: [0.35, 0.0, 0.0] },
      leftArm: { arm: [0.20, 0.15, -1.25], forearm: [0.85, 0.15, -0.05], wrist: [-0.35, 0.0, 0.0] },
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_POINTING_1,
      head: [0.04, 0.0, 0.0],
    },
    description: "Both index fingers point and thrust forward away from the body in an outward directional arc, indicating Go in Indian Sign Language.",
    facialExpression: "Attentive, forward-focused gaze indicating direction.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // DEAD (Both flat hands start palm-up, then flip over 180° to palm-down)
  // Corresponds to user's uploaded adjective 1file videos (MVI_9699-9702, MVI_9823-9826)
  // --------------------------------------------------------------------------
  dead: {
    id: "dead",
    name: "Dead",
    meaningHindi: "मृत / मरा हुआ",
    signLanguage: "ISL",
    referenceSource: "Simple Signs Chart",
    involvesHands: "both",
    durationSeconds: 2.8,
    motionType: "arc",
    measurements: {
      initialWristHeight: -0.15,
      finalWristHeight: -0.22,
      verticalDisplacement: -0.07,
      horizontalDisplacement: 0.05,
      depthDisplacement: 0.15,
      totalMovementDistance: 0.18,
      palmOrientationStart: "Both open flat palms held horizontal facing upward in front of waist/chest",
      palmOrientationEnd: "Both forearms rotate 180 degrees flipping palms completely downward to indicate death",
      wristRotationDegrees: [0.0, 0.0, 180.0],
      trajectoryType: "arc",
      anatomicalFeatures: [
        "Both hands held flat with fingers extended together (PRESET_OPEN_FLAT_B)",
        "Hands held at lower chest / upper abdomen level",
        "Both hands flip simultaneously from palm-up to palm-down, representing turnover/cessation of life in ISL",
        "Solemn, respectful facial expression",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.35, 0.15, -0.70], forearm: [-1.45, 0.20, -1.40], wrist: [-0.10, 0.0, -0.30] },
      leftArm: { arm: [0.35, 0.15, -0.70], forearm: [1.45, 0.20, 1.40], wrist: [0.10, 0.0, 0.30] },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [0.04, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.35, 0.15, -0.75], forearm: [-1.30, 0.20, 0.30], wrist: [0.20, 0.0, 0.10] },
      leftArm: { arm: [0.35, 0.15, -0.75], forearm: [1.30, 0.20, -0.30], wrist: [-0.20, 0.0, -0.10] },
      rightHand: PRESET_FLAT_PALM_DOWN,
      leftHand: PRESET_FLAT_PALM_DOWN,
      head: [0.08, 0.0, 0.0],
    },
    description: "Both open hands start palm-up in front of the body and flip 180 degrees over to palm-down, the standard Indian Sign Language gesture for Dead.",
    facialExpression: "Solemn, respectful facial expression.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },
};

// ============================================================================
// KINEMATICS SAMPLER AND INTERPOLATION SOLVER
// ============================================================================

/**
 * Normalizes any gesture token into a registered kinematic gesture definition key.
 */
export function resolveKinematicKey(rawKey: string): string {
  if (!rawKey) return "namaste";
  const clean = rawKey.toLowerCase().replace(/[^a-z0-9_]/g, "").trim();

  if (PRECISE_GESTURES_MAP[clean]) return clean;

  if (clean === "you" || clean === "tum" || clean === "aap" || clean === "tu") return "you";
  if (clean === "hi") return "hi";
  if (clean === "hello" || clean === "hey") return "hello";
  if (clean === "bye" || clean === "goodbye" || clean === "alvida" || clean === "tata") return "bye";
  if (clean === "iloveyou" || clean === "i_love_you" || clean === "ily" || clean === "love_you") return "iloveyou";
  if (clean === "my_name_is" || clean === "my_name") return "my_name_is";
  if (clean === "thank_you" || clean === "thanks" || clean === "thank" || clean === "dhanyawad" || clean === "shukriya") return "thank_you";
  if (clean === "yes" || clean === "haan") return "yes";
  if (clean === "no" || clean === "nahi" || clean === "nahin") return "no";
  if (clean === "help" || clean === "emergency" || clean === "madad") return "help";
  if (clean === "please" || clean === "kripya" || clean === "krpya") return "please";
  if (clean === "sorry" || clean === "maaf" || clean === "kshama") return "sorry";
  if (clean === "stop" || clean === "ruko" || clean === "rok") return "stop";
  if (clean === "pain" || clean === "dard" || clean === "takleef") return "pain";
  if (clean === "eat" || clean === "food" || clean === "khana") return "eat";
  if (clean === "drink" || clean === "drinking" || clean === "peena" || clean === "peeyo" || clean === "water" || clean === "paani") return "drink";
  if (clean === "more" || clean === "aur" || clean === "extra") return "more";
  if (clean === "bathroom" || clean === "toilet" || clean === "washroom" || clean === "shauchalay") return "bathroom";
  if (clean === "how" || clean === "kaise") return "how";
  if (clean === "what" || clean === "kya") return "what";
  if (clean === "where" || clean === "kahan") return "where";
  if (clean === "when" || clean === "kab") return "when";
  if (clean === "namaste" || clean === "namaskar" || clean === "pranam") return "namaste";
  if (clean === "climb" || clean === "chadna" || clean === "chadhna") return "climb";
  if (clean === "run" || clean === "bhagna" || clean === "daudna" || clean === "running") return "run";
  if (clean === "fall" || clean === "girna" || clean === "falling") return "fall";
  if (clean === "give" || clean === "dena" || clean === "giving") return "give";
  if (clean === "push" || clean === "dhakka" || clean === "pushing") return "push";
  if (clean === "cry" || clean === "rona" || clean === "crying") return "cry";
  if (clean === "sleep" || clean === "sona" || clean === "sleeping") return "sleep";
  if (clean === "sit_down" || clean === "sitdown" || clean === "sit" || clean === "baithna" || clean === "baitho") return "sit_down";
  if (clean === "kick" || clean === "laat" || clean === "kicking") return "kick";
  if (clean === "wait" || clean === "intezar" || clean === "waiting") return "wait";
  if (clean === "walk" || clean === "chalna" || clean === "walking") return "walk";
  if (clean === "wash" || clean === "dhona" || clean === "washing") return "wash";
  if (clean === "look" || clean === "dekhna" || clean === "looking") return "look";
  if (clean === "jump" || clean === "koodna" || clean === "jumping" || clean === "chhalang") return "jump";
  if (clean === "quiet" || clean === "shhh" || clean === "shh" || clean === "shaant" || clean === "shant" || clean === "silence" || clean === "chup") return "quiet";
  if (clean === "loud" || clean === "shor" || clean === "awaaz" || clean === "chillana" || clean === "hungama") return "loud";
  if (clean === "happy" || clean === "khush" || clean === "khushi" || clean === "prasann" || clean === "anand") return "happy";
  if (clean === "sad" || clean === "dukhi" || clean === "dukh" || clean === "udaas" || clean === "udas") return "sad";
  if (clean === "beautiful" || clean === "sundar" || clean === "khoobsurat" || clean === "khubsurat" || clean === "pretty") return "beautiful";
  if (clean === "ugly" || clean === "kurup" || clean === "bhadha" || clean === "bhadda" || clean === "badsurat") return "ugly";
  if (clean === "deaf" || clean === "badhir" || clean === "bahra" || clean === "behra") return "deaf";
  if (clean === "blind" || clean === "andha" || clean === "andhaa" || clean === "drishtihin" || clean === "netrahin") return "blind";
  if (clean === "angry" || clean === "gussa" || clean === "krodh" || clean === "krodhi") return "angry";
  if (clean === "go" || clean === "jao" || clean === "jana" || clean === "chalo") return "go";
  if (clean === "dead" || clean === "mar" || clean === "mrit" || clean === "death" || clean === "deceased") return "dead";

  return clean;
}

/**
 * Smooth Hermite / S-Curve easing function: f(t) = 3t^2 - 2t^3
 */
export function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpTuple3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function lerpFinger(a: FingerJointAngles, b: FingerJointAngles, t: number): FingerJointAngles {
  return {
    base: lerp(a.base, b.base, t),
    mid: lerp(a.mid, b.mid, t),
    tip: lerp(a.tip, b.tip, t),
    spread: lerp(a.spread || 0, b.spread || 0, t),
  };
}

export function lerpThumb(a: ThumbJointAngles, b: ThumbJointAngles, t: number): ThumbJointAngles {
  return {
    cmc: lerp(a.cmc, b.cmc, t),
    mcp: lerp(a.mcp, b.mcp, t),
    ip: lerp(a.ip, b.ip, t),
    opposition: lerp(a.opposition, b.opposition, t),
  };
}

export function lerpHand(a: HandAnatomicalPose, b: HandAnatomicalPose, t: number): HandAnatomicalPose {
  return {
    thumb: lerpThumb(a.thumb, b.thumb, t),
    index: lerpFinger(a.index, b.index, t),
    middle: lerpFinger(a.middle, b.middle, t),
    ring: lerpFinger(a.ring, b.ring, t),
    pinky: lerpFinger(a.pinky, b.pinky, t),
  };
}

/**
 * Evaluates the full anatomical skeleton parameters for a given registered gesture
 * at continuous time t (in seconds).
 */
export function sampleKinematicsAtTime(
  gestureKey: string,
  t: number
): {
  definition?: PreciseGestureDefinition;
  phase: number; // 0.0 to 1.0 normalized loop phase
  rightArm: ArmJointAngles;
  leftArm: ArmJointAngles;
  rightHand: HandAnatomicalPose;
  leftHand: HandAnatomicalPose;
  head: [number, number, number];
  neck: [number, number, number];
  spine: [number, number, number];
  currentWristHeight: number;
  mouthSmile?: number;
} {
  const resolved = resolveKinematicKey(gestureKey);
  const def = PRECISE_GESTURES_MAP[resolved];

  if (!def) {
    // Neutral fallback
    return {
      phase: 0,
      rightArm: NEUTRAL_REST_ARM_RIGHT,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0, 0, 0],
      neck: [0, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: -0.55,
      mouthSmile: 0.0,
    };
  }

  const duration = def.durationSeconds || 2.2;
  const loopTime = t % duration;
  const rawPhase = loopTime / duration; // 0 to 1

  // Handle specialized canonical gestures
  // 1. HELLO (Right hand touches forehead with thumb closed & 4 fingers open, then sweeps outward to side)
  if (resolved === "hello") {
    const cycleDuration = def.durationSeconds || 2.4;
    const c = (t % cycleDuration) / cycleDuration;
    let frac = 0.0;
    if (c < 0.25) {
      frac = 0.0; // Dwell at forehead touch (Matches User Selfie Photo)
    } else if (c < 0.70) {
      frac = smoothstep((c - 0.25) / 0.45); // Smooth outward sweep away from forehead to side (Matches Image 2)
    } else if (c < 0.82) {
      frac = 1.0; // Open greeting hold at side
    } else {
      frac = 1.0 - smoothstep((c - 0.82) / 0.18); // Smooth return from side to touch forehead
    }

    const startRA = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const endRA = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;

    const rightArm: ArmJointAngles = {
      arm: lerpTuple3(startRA.arm, endRA.arm, frac),
      forearm: lerpTuple3(startRA.forearm, endRA.forearm, frac),
      wrist: lerpTuple3(startRA.wrist, endRA.wrist, frac),
    };

    return {
      definition: def,
      phase: frac,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_SALUTE_B_THUMB_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: def.startPose.head || [0, 0, 0],
      neck: def.startPose.neck || [0, 0, 0],
      spine: def.startPose.spine || [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, frac),
    };
  }

  // 1b. HI (Single right hand elevated above shoulder, waving like goodbye, left hand relaxed at side)
  if (resolved === "hi") {
    const ramp = Math.min(1.0, Math.max(0.0, (t - 0.35) / 0.35));
    const smoothRamp = ramp * ramp * (3 - 2 * ramp);
    const wave = Math.sin((t - 0.35) * 6.0) * smoothRamp;
    const armSway = Math.sin((t - 0.35) * 6.0) * 0.18 * smoothRamp;

    const rightArm: ArmJointAngles = {
      arm: [-0.40, 0.20, -0.90],
      forearm: [-1.60, 1.20, armSway * 0.25],
      wrist: [0.0, -0.25, -0.50 + wave * 0.45],
    };

    return {
      definition: def,
      phase: (Math.sin(t * 6.0) + 1) / 2,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: def.startPose.head || [-0.04, 0, -0.03],
      neck: def.startPose.neck || [0, 0, 0],
      spine: def.startPose.spine || [0, 0, 0],
      currentWristHeight: 0.38,
    };
  }

  // 2. GOODBYE / BYE (Both hands raised above shoulders, straight palms facing front, continuous left-to-right waving)
  if (resolved === "bye") {
    const ramp = Math.min(1.0, Math.max(0.0, (t - 0.35) / 0.35));
    const smoothRamp = ramp * ramp * (3 - 2 * ramp);
    const wave = Math.sin((t - 0.35) * 6.0) * smoothRamp;
    const armSway = Math.sin((t - 0.35) * 6.0) * 0.18 * smoothRamp;

    const rightArm: ArmJointAngles = {
      arm: [-0.40, 0.20, -0.90],
      forearm: [-1.60, 1.20, armSway * 0.25],
      wrist: [0.0, -0.25, -0.50 + wave * 0.45],
    };

    const leftArm: ArmJointAngles = {
      arm: [-0.40, -0.20, 0.90],
      forearm: [-1.60, -1.20, -armSway * 0.25],
      wrist: [-0.05, 0.30, 0.40 - wave * 0.45],
    };

    return {
      definition: def,
      phase: (wave + 1) / 2,
      rightArm,
      leftArm,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [-0.04, 0.0, -0.03],
      neck: [0, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 3. THANK YOU (Matching reference image media_1792274690401_fe5d1879.jpg: Flat B-hand starts placed directly on chin, then sweeps outward & forward towards user)
  if (resolved === "thank_you") {
    const cycleDuration = def.durationSeconds || 2.2;
    const c = (t % cycleDuration) / cycleDuration;
    let sweep = 0.0;
    if (c < 0.22) {
      sweep = 0.0; // Dwell with fingertips touching chin
    } else if (c < 0.70) {
      sweep = smoothstep((c - 0.22) / 0.48); // Smooth outward & forward sweep towards the user
    } else if (c < 0.84) {
      sweep = 1.0; // Hold forward offering pose toward user
    } else {
      sweep = 1.0 - smoothstep((c - 0.84) / 0.16); // Return arc back to chin
    }

    const startRA = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const endRA = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;

    const rightArm: ArmJointAngles = {
      arm: lerpTuple3(startRA.arm, endRA.arm, sweep),
      forearm: lerpTuple3(startRA.forearm, endRA.forearm, sweep),
      wrist: lerpTuple3(startRA.wrist, endRA.wrist, sweep),
    };

    return {
      definition: def,
      phase: sweep,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04 + sweep * 0.08, 0, 0],
      neck: [0.02 + sweep * 0.04, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, sweep),
    };
  }

  // 4. PLEASE (Shoulder moves from right to left, elbow turns 90° from right to left, palm touches chest, head bows down)
  if (resolved === "please") {
    const cycleDuration = def.durationSeconds || 2.2;
    const u = (t % cycleDuration) / cycleDuration;
    let f = 0.0;
    if (u < 0.40) {
      const s = u / 0.40;
      f = s * s * (3 - 2 * s); // Move shoulder right to left, turn elbow 90°, touch chest, bow head
    } else if (u < 0.75) {
      f = 1.0; // Dwell with palm touching chest, elbow turned 90°, head bowed down
    } else {
      const s = (u - 0.75) / 0.25;
      f = 1.0 - s * s * (3 - 2 * s); // Smooth return to right side
    }

    // Right-side start position (shoulder on right, hand positioned on right side at chest height)
    const startArm = [-0.55, 0.35, -1.05];
    const startFA = [-1.45, 0.10, 0.15];
    const startWrist = [0.25, 0.10, 0.15];
    const startShoulderY = -0.10;

    // Chest target (shoulder moved across to left, elbow turned 90° from right to left, palm touching chest)
    const touchArm = [-0.55, -0.15, -1.05];
    const touchFA = [-1.55, 1.5708, 0.15]; // Elbow turned 90° from right to left across chest
    const touchWrist = [0.35, -0.45, 0.25]; // Palm and wrist touching center chest directly
    const touchShoulderY = 0.7854; // Shoulder moved across to left

    const armX = startArm[0] + (touchArm[0] - startArm[0]) * f;
    const armY = startArm[1] + (touchArm[1] - startArm[1]) * f;
    const armZ = startArm[2] + (touchArm[2] - startArm[2]) * f;

    const faX = startFA[0] + (touchFA[0] - startFA[0]) * f;
    const faY = startFA[1] + (touchFA[1] - startFA[1]) * f;
    const faZ = startFA[2] + (touchFA[2] - startFA[2]) * f;

    const wristX = startWrist[0] + (touchWrist[0] - startWrist[0]) * f;
    const wristY = startWrist[1] + (touchWrist[1] - startWrist[1]) * f;
    const wristZ = startWrist[2] + (touchWrist[2] - startWrist[2]) * f;

    const shoulderY = startShoulderY + (touchShoulderY - startShoulderY) * f;

    const rightArm: ArmJointAngles = {
      shoulder: [0.04 * f, shoulderY, 0.02 * f],
      arm: [armX, armY, armZ],
      forearm: [faX, faY, faZ],
      wrist: [wristX, wristY, wristZ],
    };

    return {
      definition: def,
      phase: f,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PLEASE_CHIN_THUMB_CLOSED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04 + f * 0.20, 0, 0], // Head bows down while touching chest
      neck: [0.02 + f * 0.08, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 5. YES (Matching reference image: Closed fist nodding up and down at wrist, head nodding synchronously)
  if (resolved === "yes") {
    const cycleDuration = def.durationSeconds || 1.4;
    const cycle = (t % cycleDuration) / cycleDuration;
    // Affirmative nod: 0 = UP position (knuckles pointing up), 1 = DOWN position (knuckles dipping down)
    const nod = Math.pow((1 - Math.cos(cycle * Math.PI * 2)) / 2, 1.5);

    const rightArm: ArmJointAngles = {
      arm: [-0.50, -0.20, -0.90],
      forearm: [-1.60, 1.00, -0.25],
      // UP position starts with fist facing toward user, then flexes cleanly DOWN at wrist
      wrist: [
        -0.35 + nod * 1.40,
        -0.20 - nod * 0.20,
        -0.40 + nod * 0.60,
      ],
    };

    return {
      definition: def,
      phase: nod,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_S,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.04 + nod * 0.18, 0, 0],
      neck: [0.02 + nod * 0.08, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 6. NO (Matching reference image media_1792271941698_d19ca306.jpg: Index & middle snap firmly to touch thumb pad, ring & pinky curled to palm, head shakes side-to-side)
  if (resolved === "no") {
    const shake = Math.sin(t * 5.0) * 0.18;
    const snap = Math.pow((Math.sin(t * 6.5) + 1) / 2, 1.8);

    const rightArm: ArmJointAngles = {
      arm: [-0.55, -0.20, -0.95],
      forearm: [-1.35, 0.90, -0.10],
      wrist: [0.20, 0.10, 0.05],
    };

    const rightHand: HandAnatomicalPose = {
      thumb: {
        cmc: 0.05 + snap * 0.08,
        mcp: 0.05 + snap * 0.18,
        ip: 0.05 + snap * 0.10,
        opposition: 0.20 + snap * 0.20,
      },
      index: {
        base: -0.05 + snap * 1.22,
        mid: 0.05 + snap * 0.30,
        tip: 0.05 + snap * 0.16,
        spread: -0.03 - snap * 0.03,
      },
      middle: {
        base: -0.05 + snap * 1.22,
        mid: 0.05 + snap * 0.30,
        tip: 0.05 + snap * 0.16,
        spread: 0.03 + snap * 0.03,
      },
      ring: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },
      pinky: { base: 1.30, mid: 1.35, tip: 1.25, spread: 0.0 },
      isNoSnap: true,
      snapProgress: snap,
    };

    return {
      definition: def,
      phase: snap,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, shake, 0],
      neck: [0.00, shake * 0.6, 0],
      spine: [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 7. EAT / FOOD (Matching user photos: All fingers and thumb pinched in morsel shape, moving from Quadrant III to Mouth)
  if (resolved === "eat") {
    const cycleDuration = def.durationSeconds || 2.4;
    const biteCycle = 1.2;
    const localT = (t % cycleDuration) % biteCycle;
    const u = localT / biteCycle;
    let f = 0.0;
    if (u < 0.40) {
      f = smoothstep(u / 0.40); // Move from Quadrant III to Mouth
    } else if (u < 0.60) {
      f = 1.0; // Dwell touching mouth / lips (Matches User Selfie Photo)
    } else {
      f = 1.0 - smoothstep((u - 0.60) / 0.40); // Return from mouth to Quadrant III
    }

    const startRA = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const endRA = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;

    const rightArm: ArmJointAngles = {
      arm: lerpTuple3(startRA.arm, endRA.arm, f),
      forearm: lerpTuple3(startRA.forearm, endRA.forearm, f),
      wrist: lerpTuple3(startRA.wrist, endRA.wrist, f),
    };

    return {
      definition: def,
      phase: f,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PINCHED_EATING_MORSEL,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.03 + f * 0.05, 0, 0],
      neck: [0.02 + f * 0.03, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, f),
    };
  }

  // 8. DRINK / WATER (Matching user photo & requirements: Open thumb, 4 fingers bent in 'C' cup shape, moving smoothly from Quadrant III to Mouth)
  if (resolved === "drink") {
    const cycleDuration = def.durationSeconds || 2.4;
    const sipCycle = 1.2;
    const localT = (t % cycleDuration) % sipCycle;
    const u = localT / sipCycle;
    let f = 0.0;
    if (u < 0.40) {
      f = smoothstep(u / 0.40); // Move from Quadrant III up to Mouth
    } else if (u < 0.65) {
      f = 1.0; // Dwell tilting cup to mouth / lips
    } else {
      f = 1.0 - smoothstep((u - 0.65) / 0.35); // Return from mouth back to Quadrant III
    }

    const startRA = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const endRA = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;

    const rightArm: ArmJointAngles = {
      arm: lerpTuple3(startRA.arm, endRA.arm, f),
      forearm: lerpTuple3(startRA.forearm, endRA.forearm, f),
      wrist: lerpTuple3(startRA.wrist, endRA.wrist, f),
    };

    return {
      definition: def,
      phase: f,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_C_CUP,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02 + f * 0.06, 0, 0],
      neck: [0.01 + f * 0.03, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, f),
    };
  }

  // --------------------------------------------------------------------------
  // ACTION VERBS (14 Signs)
  // --------------------------------------------------------------------------

  // 21. CLIMB (Both hands continuously climb stairs, alternating steps over each other)
  if (resolved === "climb") {
    const cycleDuration = def.durationSeconds || 2.4;
    const c = (t % cycleDuration) / cycleDuration; // 0.0 to 1.0

    // Joint poses for both hands (elbows bent 90° to each other, wrists turned 90° across body, flat downward palms):
    // Right hand: lower step (R_BASE) to upper step (R_UPPER)
    const R_BASE = {
      arm: [0.0, 0.0, -0.80] as [number, number, number],
      forearm: [1.35, 0.0, -0.40] as [number, number, number],
      wrist: [-1.14, -1.14, -1.11] as [number, number, number],
    };
    const R_UPPER = {
      arm: [0.0, 0.0, -1.10] as [number, number, number],
      forearm: [1.35, 0.0, -0.40] as [number, number, number],
      wrist: [-1.14, -1.14, -1.11] as [number, number, number],
    };

    // Left hand: lower step (L_LOWER) to upper step (L_UPPER)
    const L_LOWER = {
      arm: [0.0, 0.0, 0.65] as [number, number, number],
      forearm: [1.35, 0.0, 0.40] as [number, number, number],
      wrist: [-1.14, 1.14, 1.11] as [number, number, number],
    };
    const L_UPPER = {
      arm: [0.0, 0.0, 1.10] as [number, number, number],
      forearm: [1.35, 0.0, 0.40] as [number, number, number],
      wrist: [-1.14, 1.14, 1.11] as [number, number, number],
    };

    let leftArm: ArmJointAngles;
    let rightArm: ArmJointAngles;

    if (c < 0.50) {
      // Phase 1: Left hand steps up and forward over right hand onto upper step
      const u = c / 0.50;
      const p = smoothstep(Math.min(1.0, u / 0.80));
      const resetP = smoothstep(Math.min(1.0, u * 1.25));
      const forwardArc = Math.sin(p * Math.PI) * 0.16;
      leftArm = {
        arm: [0.0, 0.0, lerp(L_LOWER.arm[2], L_UPPER.arm[2], p) + forwardArc * 0.25],
        forearm: [L_LOWER.forearm[0] + forwardArc * 0.15, 0.0, L_LOWER.forearm[2]],
        wrist: L_LOWER.wrist,
      };
      rightArm = {
        arm: [0.0, 0.0, lerp(R_UPPER.arm[2], R_BASE.arm[2], resetP)],
        forearm: R_BASE.forearm,
        wrist: R_BASE.wrist,
      };
    } else {
      // Phase 2: Right hand steps up and forward over left hand onto upper step
      const u = (c - 0.50) / 0.50;
      const p = smoothstep(Math.min(1.0, u / 0.80));
      const resetP = smoothstep(Math.min(1.0, u * 1.25));
      const forwardArc = Math.sin(p * Math.PI) * 0.16;
      rightArm = {
        arm: [0.0, 0.0, lerp(R_BASE.arm[2], R_UPPER.arm[2], p) - forwardArc * 0.25],
        forearm: [R_BASE.forearm[0] + forwardArc * 0.15, 0.0, R_BASE.forearm[2]],
        wrist: R_BASE.wrist,
      };
      leftArm = {
        arm: [0.0, 0.0, lerp(L_UPPER.arm[2], L_LOWER.arm[2], resetP)],
        forearm: L_UPPER.forearm,
        wrist: L_UPPER.wrist,
      };
    }

    const spineSway = Math.sin(c * Math.PI * 2) * 0.015;

    return {
      definition: def,
      phase: c,
      rightArm,
      leftArm,
      rightHand: PRESET_FLAT_PALM_DOWN,
      leftHand: PRESET_FLAT_PALM_DOWN,
      head: [-0.05, 0, spineSway * 0.5],
      neck: [-0.02, 0, spineSway * 0.3],
      spine: [0, 0, spineSway],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, c < 0.5 ? c * 2 : (1 - c) * 2),
    };
  }

  // 22. RUN
  if (resolved === "run") {
    const runFreq = 6.28 * 2.0;
    const swing = Math.sin(t * runFreq);
    const rSwingFrac = (swing + 1) / 2;
    const lSwingFrac = 1.0 - rSwingFrac;

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    const rightArm: ArmJointAngles = {
      arm: lerpTuple3(rStart.arm, rEnd.arm, rSwingFrac),
      forearm: [-1.65, 0.20, 0.0],
      wrist: [0.0, 0.10, 0.0],
    };
    const leftArm: ArmJointAngles = {
      arm: lerpTuple3(lStart.arm, lEnd.arm, lSwingFrac),
      forearm: [-1.65, -0.20, 0.0],
      wrist: [0.0, -0.10, 0.0],
    };

    return {
      definition: def,
      phase: rSwingFrac,
      rightArm,
      leftArm,
      rightHand: PRESET_LOOSE_FIST,
      leftHand: PRESET_LOOSE_FIST,
      head: [0.02, 0.0, 0.0],
      neck: [0, 0, 0],
      spine: [0, Math.sin(t * runFreq) * 0.05, 0],
      currentWristHeight: 0.05,
    };
  }

  // 23. FALL
  if (resolved === "fall") {
    const cycleDuration = def.durationSeconds || 2.0;
    const c = (t % cycleDuration) / cycleDuration;
    let drop = 0.0;
    if (c < 0.20) {
      drop = 0.0;
    } else if (c < 0.65) {
      drop = smoothstep((c - 0.20) / 0.45);
    } else if (c < 0.85) {
      drop = 1.0;
    } else {
      drop = 1.0 - smoothstep((c - 0.85) / 0.15);
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: drop,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, drop),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, drop),
        wrist: lerpTuple3(rStart.wrist, rEnd.wrist, drop),
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, drop),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, drop),
        wrist: lerpTuple3(lStart.wrist, lEnd.wrist, drop),
      },
      rightHand: PRESET_SLIGHTLY_BENT_OPEN,
      leftHand: PRESET_SLIGHTLY_BENT_OPEN,
      head: [0.02 + drop * 0.12, 0, 0],
      neck: [drop * 0.06, 0, 0],
      spine: [drop * 0.04, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, drop),
    };
  }

  // 24. GIVE
  if (resolved === "give") {
    const cycleDuration = def.durationSeconds || 2.2;
    const c = (t % cycleDuration) / cycleDuration;
    let offer = 0.0;
    if (c < 0.20) {
      offer = 0.0;
    } else if (c < 0.68) {
      offer = smoothstep((c - 0.20) / 0.48);
    } else if (c < 0.85) {
      offer = 1.0;
    } else {
      offer = 1.0 - smoothstep((c - 0.85) / 0.15);
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: offer,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, offer),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, offer),
        wrist: lerpTuple3(rStart.wrist, rEnd.wrist, offer),
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, offer),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, offer),
        wrist: lerpTuple3(lStart.wrist, lEnd.wrist, offer),
      },
      rightHand: PRESET_GENTLE_CURVE_PALM_UP,
      leftHand: PRESET_GENTLE_CURVE_PALM_UP,
      head: [0.04 + offer * 0.06, 0, 0],
      neck: [0.02 + offer * 0.03, 0, 0],
      spine: [0.02 + offer * 0.04, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, offer),
    };
  }

  // 25. PUSH
  if (resolved === "push") {
    const cycleDuration = def.durationSeconds || 2.0;
    const c = (t % cycleDuration) / cycleDuration;
    let thrust = 0.0;
    if (c < 0.22) {
      thrust = 0.0;
    } else if (c < 0.58) {
      thrust = smoothstep((c - 0.22) / 0.36);
    } else if (c < 0.82) {
      thrust = 1.0;
    } else {
      thrust = 1.0 - smoothstep((c - 0.82) / 0.18);
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: thrust,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, thrust),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, thrust),
        wrist: [0, 0, 0],
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, thrust),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, thrust),
        wrist: [0, 0, 0],
      },
      rightHand: PRESET_CLOSED_FIST_S,
      leftHand: PRESET_CLOSED_FIST_S,
      head: [0.02 + thrust * 0.06, 0, 0],
      neck: [thrust * 0.03, 0, 0],
      spine: [thrust * 0.05, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 26. CRY
  if (resolved === "cry") {
    const cycleDuration = def.durationSeconds || 2.2;
    const c = (t % cycleDuration) / cycleDuration;
    const tearCycle = (c * 2) % 1.0;
    const stroke = smoothstep(tearCycle);

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: stroke,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, stroke),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, stroke),
        wrist: lerpTuple3(rStart.wrist, rEnd.wrist, stroke),
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, stroke),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, stroke),
        wrist: lerpTuple3(lStart.wrist, lEnd.wrist, stroke),
      },
      rightHand: PRESET_INDEX_EXTENDED_TEAR,
      leftHand: PRESET_INDEX_EXTENDED_TEAR,
      head: [0.10, 0, 0],
      neck: [0.05, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, stroke),
    };
  }

  // 27. SLEEP
  if (resolved === "sleep") {
    const cycleDuration = def.durationSeconds || 2.4;
    const c = (t % cycleDuration) / cycleDuration;
    let settle = 0.0;
    if (c < 0.40) {
      settle = smoothstep(c / 0.40);
    } else if (c < 0.85) {
      settle = 1.0;
    } else {
      settle = 1.0 - smoothstep((c - 0.85) / 0.15);
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: settle,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, settle),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, settle),
        wrist: lerpTuple3(rStart.wrist, rEnd.wrist, settle),
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, settle),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, settle),
        wrist: lerpTuple3(lStart.wrist, lEnd.wrist, settle),
      },
      rightHand: PRESET_CURVED_RELAXED_FACE,
      leftHand: PRESET_CURVED_RELAXED_FACE,
      head: [0.02 + settle * 0.03, 0.02 + settle * 0.06, 0.05 + settle * 0.17],
      neck: [settle * 0.02, settle * 0.03, settle * 0.10],
      spine: [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 28. SIT DOWN
  if (resolved === "sit_down") {
    const cycleDuration = def.durationSeconds || 2.0;
    const c = (t % cycleDuration) / cycleDuration;
    let sitProgress = 0.0;
    if (c < 0.20) {
      sitProgress = 0.0;
    } else if (c < 0.68) {
      sitProgress = smoothstep((c - 0.20) / 0.48);
    } else if (c < 0.84) {
      sitProgress = 1.0;
    } else {
      sitProgress = 1.0 - smoothstep((c - 0.84) / 0.16);
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: sitProgress,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, sitProgress),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, sitProgress),
        wrist: rStart.wrist,
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, sitProgress),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, sitProgress),
        wrist: lStart.wrist,
      },
      rightHand: PRESET_SLIGHTLY_BENT_OPEN,
      leftHand: PRESET_SLIGHTLY_BENT_OPEN,
      head: [0.02 + sitProgress * 0.06, 0, 0],
      neck: [sitProgress * 0.03, 0, 0],
      spine: [sitProgress * 0.04, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, sitProgress),
    };
  }

  // 29. KICK
  if (resolved === "kick") {
    const cycleDuration = def.durationSeconds || 1.8;
    const c = (t % cycleDuration) / cycleDuration;
    let kickPhase = 0.0;
    if (c < 0.25) {
      kickPhase = 0.0;
    } else if (c < 0.50) {
      kickPhase = smoothstep((c - 0.25) / 0.25);
    } else if (c < 0.70) {
      kickPhase = 1.0 - smoothstep((c - 0.50) / 0.20);
    } else {
      kickPhase = 0.0;
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;

    return {
      definition: def,
      phase: kickPhase,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, kickPhase),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, kickPhase),
        wrist: rStart.wrist,
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_INDEX_KICK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02 + kickPhase * 0.04, 0, 0],
      neck: [0, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, kickPhase),
    };
  }

  // 30. WAIT
  if (resolved === "wait") {
    const breath = Math.sin(t * 2.0) * 0.02;

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: 0.5,
      rightArm: {
        arm: [rStart.arm[0], rStart.arm[1], rStart.arm[2] + breath],
        forearm: rStart.forearm,
        wrist: rStart.wrist,
      },
      leftArm: {
        arm: [lStart.arm[0], lStart.arm[1], lStart.arm[2] - breath],
        forearm: lStart.forearm,
        wrist: lStart.wrist,
      },
      rightHand: PRESET_WAIT_CURVED,
      leftHand: PRESET_WAIT_CURVED,
      head: [0.02 + breath * 0.5, 0, 0],
      neck: [0, 0, 0],
      spine: [breath * 0.3, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 31. WALK
  if (resolved === "walk") {
    const walkFreq = 6.28 * 1.5;
    const stride = Math.sin(t * walkFreq);
    const rStride = (stride + 1) / 2;
    const lStride = 1.0 - rStride;

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: rStride,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, rStride),
        forearm: rStart.forearm,
        wrist: rStart.wrist,
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, lStride),
        forearm: lStart.forearm,
        wrist: lStart.wrist,
      },
      rightHand: PRESET_INDEX_POINTING_DOWN,
      leftHand: PRESET_INDEX_POINTING_DOWN,
      head: [0.04, 0, 0],
      neck: [0, 0, 0],
      spine: [0, Math.sin(t * walkFreq) * 0.03, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 32. WASH
  if (resolved === "wash") {
    const rubAngle = t * 7.0;
    const rubX = Math.cos(rubAngle) * 0.06;
    const rubY = Math.sin(rubAngle) * 0.06;

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: (Math.sin(rubAngle) + 1) / 2,
      rightArm: {
        arm: [rStart.arm[0] + rubY * 0.5, rStart.arm[1], rStart.arm[2] + rubX * 0.4],
        forearm: [rStart.forearm[0], rStart.forearm[1], rStart.forearm[2] + rubX * 0.3],
        wrist: [rStart.wrist[0] + rubY * 0.8, rStart.wrist[1], rStart.wrist[2]],
      },
      leftArm: {
        arm: [lStart.arm[0] - rubY * 0.5, lStart.arm[1], lStart.arm[2] - rubX * 0.4],
        forearm: [lStart.forearm[0], lStart.forearm[1], lStart.forearm[2] - rubX * 0.3],
        wrist: [lStart.wrist[0] - rubY * 0.8, lStart.wrist[1], lStart.wrist[2]],
      },
      rightHand: PRESET_CUPPED_WASH,
      leftHand: PRESET_CUPPED_WASH,
      head: [0.06, 0, 0],
      neck: [0.03, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  }

  // 33. LOOK
  if (resolved === "look") {
    const cycleDuration = def.durationSeconds || 2.0;
    const c = (t % cycleDuration) / cycleDuration;
    let gaze = 0.0;
    if (c < 0.22) {
      gaze = 0.0;
    } else if (c < 0.65) {
      gaze = smoothstep((c - 0.22) / 0.43);
    } else if (c < 0.84) {
      gaze = 1.0;
    } else {
      gaze = 1.0 - smoothstep((c - 0.84) / 0.16);
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;

    return {
      definition: def,
      phase: gaze,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, gaze),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, gaze),
        wrist: lerpTuple3(rStart.wrist, rEnd.wrist, gaze),
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_TWO_FINGERS_LOOK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0 + gaze * 0.04, 0, 0],
      neck: [0, 0, 0],
      spine: [0, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, gaze),
    };
  }

  // 34. JUMP
  if (resolved === "jump") {
    const cycleDuration = def.durationSeconds || 2.0;
    const c = (t % cycleDuration) / cycleDuration;
    let jumpProgress = 0.0;
    if (c < 0.20) {
      jumpProgress = 0.0;
    } else if (c < 0.50) {
      jumpProgress = smoothstep((c - 0.20) / 0.30);
    } else if (c < 0.72) {
      jumpProgress = 1.0 - smoothstep((c - 0.50) / 0.22);
    } else {
      jumpProgress = 0.0;
    }

    const rStart = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rEnd = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const lStart = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const lEnd = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;

    return {
      definition: def,
      phase: jumpProgress,
      rightArm: {
        arm: lerpTuple3(rStart.arm, rEnd.arm, jumpProgress),
        forearm: lerpTuple3(rStart.forearm, rEnd.forearm, jumpProgress),
        wrist: lerpTuple3(rStart.wrist, rEnd.wrist, jumpProgress),
      },
      leftArm: {
        arm: lerpTuple3(lStart.arm, lEnd.arm, jumpProgress),
        forearm: lerpTuple3(lStart.forearm, lEnd.forearm, jumpProgress),
        wrist: lerpTuple3(lStart.wrist, lEnd.wrist, jumpProgress),
      },
      rightHand: PRESET_JUMP_CURLED,
      leftHand: PRESET_JUMP_CURLED,
      head: [0.04 - jumpProgress * 0.12, 0, 0],
      neck: [-jumpProgress * 0.06, 0, 0],
      spine: [-jumpProgress * 0.05, 0, 0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, jumpProgress),
    };
  }

  // 35. QUIET (Right index finger held vertically upright directly against lips/mouth in universal "shhh" silence gesture)
  if (resolved === "quiet") {
    const cycleDuration = def.durationSeconds || 2.2;
    const c = (t % cycleDuration) / cycleDuration;
    let frac = 0.0;
    if (c < 0.25) {
      // Rise smoothly from standby to mouth
      frac = smoothstep(c / 0.25);
    } else {
      // Dwell firmly on mouth with vertical index finger covering the lips
      frac = 1.0;
    }

    const startRA = def.startPose.rightArm || {
      arm: [-0.15, 0.10, -1.15],
      forearm: [-0.60, 0.20, 0.10],
      wrist: [0.10, 0.05, 0.05],
    };
    const endRA = def.endPose.rightArm || {
      arm: [-1.2491, -1.0362, -1.6999],
      forearm: [-2.2844, 2.9492, 0.8000],
      wrist: [0.1469, 0.6916, -0.3526],
    };

    const rightArm: ArmJointAngles = {
      arm: lerpTuple3(startRA.arm, endRA.arm, frac),
      forearm: lerpTuple3(startRA.forearm, endRA.forearm, frac),
      wrist: lerpTuple3(startRA.wrist, endRA.wrist, frac),
    };

    return {
      definition: def,
      phase: frac,
      rightArm,
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_QUIET_SHHH_INDEX_LIPS,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
      neck: [0.0, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, frac),
    };
  }

  // 19b. LOUD / SHOUT (5-Phase Video-Driven Trajectory)
  // Phase 1: Neutral Standing Rest (arms at sides/waist, head forward)
  // Phase 2: Coordinated Ascent (waist to mid/upper chest, bending elbows)
  // Phase 3: Chest Positioning (both hands at upper chest, fingers open, close proximity)
  // Phase 4: Upward & Outward Expansion (chest to face level, outward flare, spread fingers, open-mouth shout)
  // Phase 5: Smooth Descent (hands return past chest down to neutral waist rest without abrupt stop)
  if (resolved === "loud") {
    const cycleDuration = def.durationSeconds || 2.6;
    const c = (t % cycleDuration) / cycleDuration;

    // Posture 1: Neutral Rest at Sides / Waist (Reference Video Phase 1)
    const rArmRest: [number, number, number] = [0.05, 0.05, -1.25];
    const rFARest:  [number, number, number] = [-0.25, 0.10, 0.05];
    const rWrRest:  [number, number, number] = [0.10, 0.05, 0.05];

    const lArmRest: [number, number, number] = [0.05, -0.05, 1.25];
    const lFARest:  [number, number, number] = [-0.25, -0.10, -0.05];
    const lWrRest:  [number, number, number] = [0.10, -0.05, -0.05];

    // Posture 2: Mid-Ascent (Bending elbows, lifting wrists towards torso)
    const rArmAscent: [number, number, number] = [-0.55, 0.10, -0.95];
    const rFAAscent:  [number, number, number] = [-1.25, 0.25, 0.15];
    const rWrAscent:  [number, number, number] = [0.15, 0.40, 0.10];

    const lArmAscent: [number, number, number] = [-0.55, -0.10, 0.95];
    const lFAAscent:  [number, number, number] = [-1.25, -0.25, -0.15];
    const lWrAscent:  [number, number, number] = [0.15, -0.40, -0.10];

    // Posture 3: Upper Chest Positioning (Hands close together, fingers opening)
    const rArmChest: [number, number, number] = [-0.95, -0.15, -1.15];
    const rFAChest:  [number, number, number] = [-1.65, 0.40, -0.15];
    const rWrChest:  [number, number, number] = [0.18, 0.85, 0.10];

    const lArmChest: [number, number, number] = [-0.95, 0.15, 1.15];
    const lFAChest:  [number, number, number] = [-1.65, -0.40, 0.15];
    const lWrChest:  [number, number, number] = [0.18, -0.85, -0.10];

    // Posture 4: Upward & Outward Expansion to Face Level (Shouting megaphone flare)
    const rArmShout: [number, number, number] = [-1.15, -0.18, -1.35];
    const rFAShout:  [number, number, number] = [-1.40, 0.50, 0.15];
    const rWrShout:  [number, number, number] = [0.22, 0.20, -0.15];

    const lArmShout: [number, number, number] = [-1.15, 0.18, 1.35];
    const lFAShout:  [number, number, number] = [-1.40, -0.50, -0.15];
    const lWrShout:  [number, number, number] = [0.22, -0.20, 0.15];

    let rArmCur = rArmRest;
    let rFACur = rFARest;
    let rWrCur = rWrRest;
    let lArmCur = lArmRest;
    let lFACur = lFARest;
    let lWrCur = lWrRest;

    let handPose = PRESET_STANDBY_RELAXED;
    let headPitch = 0.0;
    let neckPitch = 0.0;
    let pulse = 0.0;
    let currentPhase = 0.0;

    if (c < 0.12) {
      // Phase 1: Pure Neutral Standing Rest
      currentPhase = 0.0;
      rArmCur = rArmRest;
      rFACur = rFARest;
      rWrCur = rWrRest;
      lArmCur = lArmRest;
      lFACur = lFARest;
      lWrCur = lWrRest;
      handPose = PRESET_STANDBY_RELAXED;
    } else if (c < 0.32) {
      // Phase 2: Coordinated Ascent from Waist to Chest
      const u = smoothstep((c - 0.12) / 0.20);
      currentPhase = u * 0.35;
      if (u < 0.50) {
        const uSub = u / 0.50;
        rArmCur = lerpTuple3(rArmRest, rArmAscent, uSub);
        rFACur  = lerpTuple3(rFARest, rFAAscent, uSub);
        rWrCur  = lerpTuple3(rWrRest, rWrAscent, uSub);
        lArmCur = lerpTuple3(lArmRest, lArmAscent, uSub);
        lFACur  = lerpTuple3(lFARest, lFAAscent, uSub);
        lWrCur  = lerpTuple3(lWrRest, lWrAscent, uSub);
      } else {
        const uSub = (u - 0.50) / 0.50;
        rArmCur = lerpTuple3(rArmAscent, rArmChest, uSub);
        rFACur  = lerpTuple3(rFAAscent, rFAChest, uSub);
        rWrCur  = lerpTuple3(rWrAscent, rWrChest, uSub);
        lArmCur = lerpTuple3(lArmAscent, lArmChest, uSub);
        lFACur  = lerpTuple3(lFAAscent, lFAChest, uSub);
        lWrCur  = lerpTuple3(lWrAscent, lWrChest, uSub);
      }
      handPose = lerpHand(PRESET_STANDBY_RELAXED, PRESET_CUPPED_SHOUT_MOUTH, u);
    } else if (c < 0.48) {
      // Phase 3: Chest Positioning (Hands close together, fingers opening)
      const u = (c - 0.32) / 0.16;
      currentPhase = 0.35 + u * 0.15;
      rArmCur = rArmChest;
      rFACur  = rFAChest;
      rWrCur  = rWrChest;
      lArmCur = lArmChest;
      lFACur  = lFAChest;
      lWrCur  = lWrChest;
      handPose = PRESET_CUPPED_SHOUT_MOUTH;
      headPitch = 0.02 * Math.sin(u * Math.PI);
    } else if (c < 0.76) {
      // Phase 4: Upward & Outward Expansion toward Face Level
      const u = smoothstep((c - 0.48) / 0.20);
      currentPhase = 0.50 + u * 0.50;
      rArmCur = lerpTuple3(rArmChest, rArmShout, u);
      rFACur  = lerpTuple3(rFAChest, rFAShout, u);
      rWrCur  = lerpTuple3(rWrChest, rWrShout, u);
      lArmCur = lerpTuple3(lArmChest, lArmShout, u);
      lFACur  = lerpTuple3(lFAChest, lFAShout, u);
      lWrCur  = lerpTuple3(lWrChest, lWrShout, u);

      handPose = lerpHand(PRESET_CUPPED_SHOUT_MOUTH, PRESET_OPEN_SPREAD_5, u);
      headPitch = -0.07 * u;
      neckPitch = -0.04 * u;

      if (c >= 0.60) {
        pulse = Math.sin((c - 0.60) * 50.0) * 0.035;
      }
    } else {
      // Phase 5: Smooth Descent Back to Neutral Rest Pose
      const u = smoothstep((c - 0.76) / 0.24);
      currentPhase = 1.0 - u;

      if (u < 0.50) {
        const uSub = u / 0.50;
        rArmCur = lerpTuple3(rArmShout, rArmAscent, uSub);
        rFACur  = lerpTuple3(rFAShout, rFAAscent, uSub);
        rWrCur  = lerpTuple3(rWrShout, rWrAscent, uSub);
        lArmCur = lerpTuple3(lArmShout, lArmAscent, uSub);
        lFACur  = lerpTuple3(lFAShout, lFAAscent, uSub);
        lWrCur  = lerpTuple3(lWrShout, lWrAscent, uSub);
        handPose = lerpHand(PRESET_OPEN_SPREAD_5, PRESET_STANDBY_RELAXED, uSub);
      } else {
        const uSub = (u - 0.50) / 0.50;
        rArmCur = lerpTuple3(rArmAscent, rArmRest, uSub);
        rFACur  = lerpTuple3(rFAAscent, rFARest, uSub);
        rWrCur  = lerpTuple3(rWrAscent, rWrRest, uSub);
        lArmCur = lerpTuple3(lArmAscent, lArmRest, uSub);
        lFACur  = lerpTuple3(lFAAscent, lFARest, uSub);
        lWrCur  = lerpTuple3(lWrAscent, lWrRest, uSub);
        handPose = PRESET_STANDBY_RELAXED;
      }
      headPitch = -0.07 * (1.0 - u);
      neckPitch = -0.04 * (1.0 - u);
    }

    return {
      definition: def,
      phase: currentPhase,
      rightArm: {
        arm: [rArmCur[0], rArmCur[1], rArmCur[2] + pulse],
        forearm: [rFACur[0] + pulse, rFACur[1], rFACur[2]],
        wrist: [rWrCur[0], rWrCur[1] + pulse, rWrCur[2]],
      },
      leftArm: {
        arm: [lArmCur[0], lArmCur[1], lArmCur[2] - pulse],
        forearm: [lFACur[0] + pulse, lFACur[1], lFACur[2]],
        wrist: [lWrCur[0], lWrCur[1] - pulse, lWrCur[2]],
      },
      rightHand: handPose,
      leftHand: handPose,
      head: [headPitch, 0.0, pulse * 0.02],
      neck: [neckPitch, 0.0, 0.0],
      spine: [headPitch * 0.35, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, currentPhase),
    };
  }

  // 19c. HAPPY (Both flat palms brushing upward along chest in double rhythmic uplifting sweeps)
  if (resolved === "happy") {
    const cycleDuration = def.durationSeconds || 2.8;
    const c = (t % cycleDuration) / cycleDuration;

    // Posture 1: Rest at Sides / Waist (Reference Video Phase 1)
    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    const lArmRest: [number, number, number] = [-0.10, -0.05, 0.20];
    const lFARest:  [number, number, number] = [-0.15, -0.05, -0.05];
    const lWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    // User Calibrated: Right elbow turned 90 deg from right to left across to chest,
    // Left elbow turned 90 deg from left to right across to chest.
    const rArmLow: [number, number, number] = [-0.20, 0.00, -0.85];
    const rFALow:  [number, number, number] = [-1.35, -0.30, -1.45]; // Turned 90 deg from right to left

    const lArmLow: [number, number, number] = [-0.20, 0.00, 0.85];
    const lFALow:  [number, number, number] = [-1.35, 0.30, 1.45];   // Turned 90 deg from left to right

    // Upper chest brushing posture
    const rArmHigh: [number, number, number] = [-0.38, 0.05, -0.95];
    const rFAHigh:  [number, number, number] = [-1.35, -0.30, -1.45];

    const lArmHigh: [number, number, number] = [-0.38, -0.05, 0.95];
    const lFAHigh:  [number, number, number] = [-1.35, 0.30, 1.45];

    // Wrists DOWN: fingers pointing downward, wrists turned 180 deg
    const rWrDown: [number, number, number] = [-1.94, 0.70, -2.04];
    const lWrDown: [number, number, number] = [-1.94, -0.70, 2.04];

    // Wrists UP: turned from down to up slowly, fingers pointing upward, wrists turned 180 deg
    const rWrUp:   [number, number, number] = [-2.14, 0.80, 1.94];
    const lWrUp:   [number, number, number] = [-2.14, -0.80, -1.94];

    let rArmCur = rArmRest;
    let rFACur  = rFARest;
    let rWrCur  = rWrRest;
    let lArmCur = lArmRest;
    let lFACur  = lFARest;
    let lWrCur  = lWrRest;

    let headPitch = 0.0;
    let currentPhase = 0.0;
    let currentSmile = 0.0;

    if (c < 0.10) {
      // Phase 1: Waist Rest
      rArmCur = rArmRest; rFACur = rFARest; rWrCur = rWrRest;
      lArmCur = lArmRest; lFACur = lFARest; lWrCur = lWrRest;
      headPitch = 0.0;
      currentPhase = 0.0;
      currentSmile = 0.0;
    } else if (c < 0.20) {
      // Phase 2: Approach to lower chest (elbows turn 90 deg into position, wrists in DOWN pose)
      const u = smoothstep((c - 0.10) / 0.10);
      rArmCur = lerpTuple3(rArmRest, rArmLow, u);
      rFACur  = lerpTuple3(rFARest, rFALow, u);
      rWrCur  = lerpTuple3(rWrRest, rWrDown, u);
      lArmCur = lerpTuple3(lArmRest, lArmLow, u);
      lFACur  = lerpTuple3(lFARest, lFALow, u);
      lWrCur  = lerpTuple3(lWrRest, lWrDown, u);
      headPitch = -0.02 * u;
      currentPhase = u * 0.20;
      currentSmile = 0.40 * u;
    } else if (c < 0.48) {
      // Phase 3 (Stroke 1): "AFTER THAT TURN THE WRIST FROM DOWN TO UP SLOWLY"
      // Wrists turn slowly from DOWN to UP while palms brush upward along chest with a joyful smile!
      const u = smoothstep((c - 0.20) / 0.28);
      rArmCur = lerpTuple3(rArmLow, rArmHigh, u);
      rFACur  = rFAHigh;
      rWrCur  = lerpTuple3(rWrDown, rWrUp, u);
      lArmCur = lerpTuple3(lArmLow, lArmHigh, u);
      lFACur  = lFAHigh;
      lWrCur  = lerpTuple3(lWrDown, lWrUp, u);
      headPitch = -0.02 - 0.07 * u;
      currentPhase = 0.20 + u * 0.50;
      currentSmile = 0.40 + 0.55 * u; // Radiant warm smile (0.95)
    } else if (c < 0.56) {
      // Smooth reset dip between strokes (wrists dip back toward DOWN)
      const u = smoothstep((c - 0.48) / 0.08);
      rArmCur = lerpTuple3(rArmHigh, rArmLow, u * 0.85);
      rFACur  = rFAHigh;
      rWrCur  = lerpTuple3(rWrUp, rWrDown, u * 0.85);
      lArmCur = lerpTuple3(lArmHigh, lArmLow, u * 0.85);
      lFACur  = lFAHigh;
      lWrCur  = lerpTuple3(lWrUp, lWrDown, u * 0.85);
      headPitch = -0.09 + 0.04 * u;
      currentPhase = 0.70 - u * 0.20;
      currentSmile = 0.95 - 0.10 * u;
    } else if (c < 0.80) {
      // Stroke 2: Second slow upward wrist turn (DOWN to UP) brushing upward with warm smile
      const u = smoothstep((c - 0.56) / 0.24);
      const rArmMid = lerpTuple3(rArmHigh, rArmLow, 0.85);
      const lArmMid = lerpTuple3(lArmHigh, lArmLow, 0.85);
      const rWrMid  = lerpTuple3(rWrUp, rWrDown, 0.85);
      const lWrMid  = lerpTuple3(lWrUp, lWrDown, 0.85);
      rArmCur = lerpTuple3(rArmMid, rArmHigh, u);
      rFACur  = rFAHigh;
      rWrCur  = lerpTuple3(rWrMid, rWrUp, u);
      lArmCur = lerpTuple3(lArmMid, lArmHigh, u);
      lFACur  = lFAHigh;
      lWrCur  = lerpTuple3(lWrMid, lWrUp, u);
      headPitch = -0.05 - 0.05 * u;
      currentPhase = 0.50 + u * 0.50;
      currentSmile = 0.85 + 0.10 * u; // Radiant warm smile (0.95)
    } else {
      // Phase 5: Smooth deceleration return back past chest to neutral waist rest
      const u = smoothstep((c - 0.80) / 0.20);
      rArmCur = lerpTuple3(rArmHigh, rArmRest, u);
      rFACur  = lerpTuple3(rFAHigh, rFARest, u);
      rWrCur  = lerpTuple3(rWrUp, rWrRest, u);
      lArmCur = lerpTuple3(lArmHigh, lArmRest, u);
      lFACur  = lerpTuple3(lFAHigh, lFARest, u);
      lWrCur  = lerpTuple3(lWrUp, lWrRest, u);
      headPitch = -0.10 * (1.0 - u);
      currentPhase = 1.0 - u;
      currentSmile = 0.95 * (1.0 - u);
    }

    return {
      definition: def,
      phase: currentPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: {
        arm: lArmCur as [number, number, number],
        forearm: lFACur as [number, number, number],
        wrist: lWrCur as [number, number, number],
      },
      rightHand: PRESET_OPEN_FLAT_B,
      leftHand: PRESET_OPEN_FLAT_B,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.4, 0.0, 0.0],
      spine: [headPitch * 0.35, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, currentPhase),
      mouthSmile: currentSmile,
    };
  }

  // --------------------------------------------------------------------------
  // SAD / DUKH (Tear trace from both eyes down along both cheeks simultaneously)
  // Both hands with index fingers extended, remaining fingers & thumbs tightly closed in fists
  // Both hands ascend to eyes, then move simultaneously from UP to DOWN tracing tears
  // --------------------------------------------------------------------------
  if (resolved === "sad") {
    const cycle = 2.8;
    const c = (t % cycle) / cycle;

    // Resting standby position
    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    const lArmRest: [number, number, number] = [-0.10, -0.05, 0.20];
    const lFARest:  [number, number, number] = [-0.15, -0.05, -0.05];
    const lWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    // High Pose: Extended index fingers placed at both eyes tear lines
    const rArmEye:  [number, number, number] = [-1.22, -1.05, -1.70];
    const rFAEye:   [number, number, number] = [-2.28, 2.95, 0.80];
    const rWrEye:   [number, number, number] = [0.15, 0.65, -0.45];

    const lArmEye:  [number, number, number] = [-1.22, 1.05, 1.70];
    const lFAEye:   [number, number, number] = [-2.28, -2.95, -0.80];
    const lWrEye:   [number, number, number] = [0.15, -0.65, 0.45];

    // Low Pose: Both index fingers moved DOWN along both cheeks to jawline/chin
    const rArmDown: [number, number, number] = [-1.45, -1.25, -1.35];
    const rFADown:  [number, number, number] = [-2.20, 2.90, 0.75];
    const rWrDown:  [number, number, number] = [-0.15, 0.55, -0.45];

    const lArmDown: [number, number, number] = [-1.45, 1.25, 1.35];
    const lFADown:  [number, number, number] = [-2.20, -2.90, -0.75];
    const lWrDown:  [number, number, number] = [-0.15, -0.55, 0.45];

    let rArmCur = rArmRest;
    let rFACur  = rFARest;
    let rWrCur  = rWrRest;

    let lArmCur = lArmRest;
    let lFACur  = lFARest;
    let lWrCur  = lWrRest;

    let headPitch = 0.0;
    let currentPhase = 0.0;

    if (c < 0.12) {
      // Phase 1: Waist Rest
      rArmCur = rArmRest; rFACur = rFARest; rWrCur = rWrRest;
      lArmCur = lArmRest; lFACur = lFARest; lWrCur = lWrRest;
      headPitch = 0.04;
      currentPhase = 0.0;
    } else if (c < 0.24) {
      // Phase 2: Approach to both eyes (both hands ascend, index fingers extend, thumbs & fingers close)
      const u = smoothstep((c - 0.12) / 0.12);
      rArmCur = lerpTuple3(rArmRest, rArmEye, u);
      rFACur  = lerpTuple3(rFARest, rFAEye, u);
      rWrCur  = lerpTuple3(rWrRest, rWrEye, u);
      lArmCur = lerpTuple3(lArmRest, lArmEye, u);
      lFACur  = lerpTuple3(lFARest, lFAEye, u);
      lWrCur  = lerpTuple3(lWrRest, lWrEye, u);
      headPitch = 0.04 + 0.10 * u;
      currentPhase = u * 0.20;
    } else if (c < 0.54) {
      // Phase 3 (Stroke 1): Both index fingers placed at eyes, move slowly from UP to DOWN along cheeks
      const u = smoothstep((c - 0.24) / 0.30);
      rArmCur = lerpTuple3(rArmEye, rArmDown, u);
      rFACur  = lerpTuple3(rFAEye, rFADown, u);
      rWrCur  = lerpTuple3(rWrEye, rWrDown, u);
      lArmCur = lerpTuple3(lArmEye, lArmDown, u);
      lFACur  = lerpTuple3(lFAEye, lFADown, u);
      lWrCur  = lerpTuple3(lWrEye, lWrDown, u);
      headPitch = 0.14 + 0.03 * u;
      currentPhase = 0.20 + u * 0.40;
    } else if (c < 0.62) {
      // Phase 4: Smooth reset back up to eyes
      const u = smoothstep((c - 0.54) / 0.08);
      rArmCur = lerpTuple3(rArmDown, rArmEye, u);
      rFACur  = lerpTuple3(rFADown, rFAEye, u);
      rWrCur  = lerpTuple3(rWrDown, rWrEye, u);
      lArmCur = lerpTuple3(lArmDown, lArmEye, u);
      lFACur  = lerpTuple3(lFADown, lFAEye, u);
      lWrCur  = lerpTuple3(lWrDown, lWrEye, u);
      headPitch = 0.17 - 0.03 * u;
      currentPhase = 0.60;
    } else if (c < 0.84) {
      // Phase 5 (Stroke 2): Second tear trace from eyes down along cheeks
      const u = smoothstep((c - 0.62) / 0.22);
      rArmCur = lerpTuple3(rArmEye, rArmDown, u);
      rFACur  = lerpTuple3(rFAEye, rFADown, u);
      rWrCur  = lerpTuple3(rWrEye, rWrDown, u);
      lArmCur = lerpTuple3(lArmEye, lArmDown, u);
      lFACur  = lerpTuple3(lFAEye, lFADown, u);
      lWrCur  = lerpTuple3(lWrEye, lWrDown, u);
      headPitch = 0.14 + 0.03 * u;
      currentPhase = 0.60 + u * 0.40;
    } else {
      // Phase 6: Smooth deceleration return back to waist rest
      const u = smoothstep((c - 0.84) / 0.16);
      rArmCur = lerpTuple3(rArmDown, rArmRest, u);
      rFACur  = lerpTuple3(rFADown, rFARest, u);
      rWrCur  = lerpTuple3(rWrDown, rWrRest, u);
      lArmCur = lerpTuple3(lArmDown, lArmRest, u);
      lFACur  = lerpTuple3(lFADown, lFARest, u);
      lWrCur  = lerpTuple3(lWrDown, lWrRest, u);
      headPitch = 0.17 * (1.0 - u);
      currentPhase = 1.0 - u;
    }

    return {
      definition: def,
      phase: currentPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: {
        arm: lArmCur as [number, number, number],
        forearm: lFACur as [number, number, number],
        wrist: lWrCur as [number, number, number],
      },
      rightHand: PRESET_SAD_TEAR_INDEX_EYE,
      leftHand: PRESET_SAD_TEAR_INDEX_EYE,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.45, 0.0, 0.0],
      spine: [headPitch * 0.35, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, currentPhase),
      mouthSmile: 0.0,
    };
  }

  // --------------------------------------------------------------------------
  // 22. RUN (Modified L-handshape, left elbow turned 90° left-to-right,
  // left index touches back of right thumb, right index pointing forward towards user)
  // --------------------------------------------------------------------------
  if (resolved === "run") {
    const cycle = def.durationSeconds || 2.6;
    const c = (t % cycle) / cycle;

    // Resting standby position at waist
    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    const lArmRest: [number, number, number] = [-0.10, -0.05, 0.20];
    const lFARest:  [number, number, number] = [-0.15, -0.05, -0.05];
    const lWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    // Running Contact Base Posture:
    // Left elbow turned 90° from left to right across chest
    const lArmBase: [number, number, number] = [-0.35, -0.05, 1.15];
    const lFABase:  [number, number, number] = [-1.45, 0.30, 1.45]; // Turned 90° left to right
    const lWrBase:  [number, number, number] = [0.10, 0.20, 0.25];

    // Right arm with index finger pointing forward towards user, thumb upright touching left index
    const rArmBase: [number, number, number] = [-0.35, 0.45, -0.70];
    const rFABase:  [number, number, number] = [-1.35, 0.10, -0.95];
    const rWrBase:  [number, number, number] = [0.75, -0.20, -0.35]; // Index points forward towards user (+Z)

    // Running Strides (Forward Propulsion Pulse)
    const lArmPulse: [number, number, number] = [-0.48, -0.05, 1.15];
    const lFAPulse:  [number, number, number] = [-1.15, 0.30, 1.45];
    const lWrPulse:  [number, number, number] = [0.15, 0.20, 0.25];

    const rArmPulse: [number, number, number] = [-0.48, 0.40, -0.70];
    const rFAPulse:  [number, number, number] = [-1.05, 0.10, -0.95];
    const rWrPulse:  [number, number, number] = [0.85, -0.20, -0.35];

    let rArmCur = rArmRest;
    let rFACur  = rFARest;
    let rWrCur  = rWrRest;

    let lArmCur = lArmRest;
    let lFACur  = lFARest;
    let lWrCur  = lWrRest;

    let headPitch = 0.0;
    let spinePitch = 0.0;
    let currentPhase = 0.0;
    let handPose = PRESET_RUN_L_HAND;

    if (c < 0.12) {
      // Phase 1: Waist Rest
      rArmCur = rArmRest; rFACur = rFARest; rWrCur = rWrRest;
      lArmCur = lArmRest; lFACur = lFARest; lWrCur = lWrRest;
      headPitch = 0.0;
      spinePitch = 0.0;
      currentPhase = 0.0;
      handPose = PRESET_STANDBY_RELAXED;
    } else if (c < 0.25) {
      // Phase 2: Approach & Contact Setup (Left elbow turns 90° across, right index aims at user, fingers take L-shape, left index touches back of right thumb)
      const u = smoothstep((c - 0.12) / 0.13);
      rArmCur = lerpTuple3(rArmRest, rArmBase, u);
      rFACur  = lerpTuple3(rFARest, rFABase, u);
      rWrCur  = lerpTuple3(rWrRest, rWrBase, u);
      lArmCur = lerpTuple3(lArmRest, lArmBase, u);
      lFACur  = lerpTuple3(lFARest, lFABase, u);
      lWrCur  = lerpTuple3(lWrRest, lWrBase, u);
      headPitch = 0.08 * u;
      spinePitch = 0.05 * u;
      currentPhase = u * 0.25;
      handPose = PRESET_RUN_L_HAND;
    } else if (c < 0.50) {
      // Phase 3 (Running Stride 1): Forward running thrust and rebound while maintaining hook contact
      const u = (c - 0.25) / 0.25;
      const stride = Math.sin(u * Math.PI);
      rArmCur = lerpTuple3(rArmBase, rArmPulse, stride);
      rFACur  = lerpTuple3(rFABase, rFAPulse, stride);
      rWrCur  = lerpTuple3(rWrBase, rWrPulse, stride);
      lArmCur = lerpTuple3(lArmBase, lArmPulse, stride);
      lFACur  = lerpTuple3(lFABase, lFAPulse, stride);
      lWrCur  = lerpTuple3(lWrBase, lWrPulse, stride);
      headPitch = 0.08 + 0.03 * stride;
      spinePitch = 0.05 + 0.02 * stride;
      currentPhase = 0.25 + u * 0.25;
      handPose = PRESET_RUN_L_HAND;
    } else if (c < 0.78) {
      // Phase 4 (Running Stride 2): Second crisp forward propulsion stride
      const u = (c - 0.50) / 0.28;
      const stride = Math.sin(u * Math.PI);
      rArmCur = lerpTuple3(rArmBase, rArmPulse, stride);
      rFACur  = lerpTuple3(rFABase, rFAPulse, stride);
      rWrCur  = lerpTuple3(rWrBase, rWrPulse, stride);
      lArmCur = lerpTuple3(lArmBase, lArmPulse, stride);
      lFACur  = lerpTuple3(lFABase, lFAPulse, stride);
      lWrCur  = lerpTuple3(lWrBase, lWrPulse, stride);
      headPitch = 0.08 + 0.03 * stride;
      spinePitch = 0.05 + 0.02 * stride;
      currentPhase = 0.50 + u * 0.28;
      handPose = PRESET_RUN_L_HAND;
    } else {
      // Phase 5: Smooth deceleration return back to waist rest
      const u = smoothstep((c - 0.78) / 0.22);
      rArmCur = lerpTuple3(rArmBase, rArmRest, u);
      rFACur  = lerpTuple3(rFABase, rFARest, u);
      rWrCur  = lerpTuple3(rWrBase, rWrRest, u);
      lArmCur = lerpTuple3(lArmBase, lArmRest, u);
      lFACur  = lerpTuple3(lFABase, lFARest, u);
      lWrCur  = lerpTuple3(lWrBase, lWrRest, u);
      headPitch = 0.08 * (1.0 - u);
      spinePitch = 0.05 * (1.0 - u);
      currentPhase = 1.0 - u;
      handPose = u > 0.6 ? PRESET_STANDBY_RELAXED : PRESET_RUN_L_HAND;
    }

    return {
      definition: def,
      phase: currentPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: {
        arm: lArmCur as [number, number, number],
        forearm: lFACur as [number, number, number],
        wrist: lWrCur as [number, number, number],
      },
      rightHand: handPose,
      leftHand: handPose,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.4, 0.0, 0.0],
      spine: [spinePitch, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, currentPhase),
      mouthSmile: 0.15,
    };
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // BEAUTIFUL: Elbow turns from 3rd quadrant to face of model, wrist rotates from
  // left to right, all fingers closed except index & thumb (L-hand), index rounds
  // circle of face, then index & thumb close, other 3 fingers open pointing toward
  // user with wrist at 90° of elbow.
  // --------------------------------------------------------------------------
  if (resolved === "beautiful") {
    const cycle = def.durationSeconds || 3.2;
    const c = (t % cycle) / cycle;

    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    // 3rd Quadrant starting pose (right elbow turned in 3rd quadrant across lower body, wrist rotated left)
    const rArmQ3:   [number, number, number] = [-0.20, 0.10, -0.85];
    const rFAQ3:    [number, number, number] = [-1.30, -0.30, -1.57]; // elbow starts turned at -1.57 rad (-90°)
    const rWrQ3:    [number, number, number] = [-0.30, -1.57, 0.20];  // wrist starts turned at -1.57 rad (-90° left)

    // Face contour circle keypoints (Right L-hand traces face circle with index finger)
    // 1. Mouth start: elbow turned 180° towards mouth (+1.57 rad), wrist rotated 180° towards mouth (+1.57 rad)
    const rArmMouth:    [number, number, number] = [-0.72, -0.28, -1.18];
    const rFAMouth:     [number, number, number] = [-1.52, 0.45, 1.57];  // elbow turns 180° (+1.57 - (-1.57) = 3.14 rad / 180°) towards mouth
    const rWrMouth:     [number, number, number] = [0.15, 1.57, -0.15];  // wrist rotates 180° (+1.57 - (-1.57) = 3.14 rad / 180°) towards mouth

    // 2. Right cheek / temple
    const rArmRCheek:   [number, number, number] = [-0.78, -0.32, -1.24];
    const rFARCheek:    [number, number, number] = [-1.58, 0.68, 0.44];
    const rWrRCheek:    [number, number, number] = [0.15, 0.35, -0.22];

    // 3. Forehead top
    const rArmForehead: [number, number, number] = [-0.94, -0.42, -1.34];
    const rFAForehead:  [number, number, number] = [-1.72, 0.82, 0.52];
    const rWrForehead:  [number, number, number] = [0.22, 0.42, -0.28];

    // 4. Left temple / cheek
    const rArmLCheek:   [number, number, number] = [-0.76, -0.52, -1.22];
    const rFALCheek:    [number, number, number] = [-1.62, 0.62, 0.38];
    const rWrLCheek:    [number, number, number] = [0.18, 0.30, -0.22];

    // 5. Finishing presentation pose:
    // "close the index finger and thumb and open another three fingers pointing towards the user wrist should 90 degrre of the elbow"
    const rArmPresent:  [number, number, number] = [-0.45, -0.10, -1.05];
    const rFAPresent:   [number, number, number] = [-1.40, 0.15, 0.10];
    const rWrPresent:   [number, number, number] = [1.57, 0.00, 0.00]; // exactly 90° bend relative to forearm directing fingers to user

    let rArmCur: number[], rFACur: number[], rWrCur: number[];
    let rHandCur: HandAnatomicalPose;
    let curPhase = 0.0;
    let smile = 0.0;

    if (c < 0.25) {
      // Phase 1: Elbow turns 180 degrees from 3rd quadrant towards the mouth,
      // and wrist rotates 180 degrees towards the mouth with L-handshape (all fingers closed except index and thumb)
      const u = smoothstep(c / 0.25);
      rArmCur = lerpTuple3(rArmQ3, rArmMouth, u);
      rFACur  = lerpTuple3(rFAQ3,  rFAMouth,  u); // 180° elbow turn towards mouth
      rWrCur  = lerpTuple3(rWrQ3,  rWrMouth,  u); // 180° wrist rotation towards mouth
      rHandCur = PRESET_BEAUTIFUL_L_HAND;
      curPhase = u * 0.25;
      smile = u * 0.4;
    } else if (c < 0.65) {
      // Phase 2: Index finger traces a smooth circle around own face starting and ending at the mouth
      const u = (c - 0.25) / 0.40; // 0.0 to 1.0
      rHandCur = PRESET_BEAUTIFUL_L_HAND;
      curPhase = 0.25 + u * 0.45;
      smile = 0.4 + u * 0.35;

      if (u < 0.25) {
        const seg = smoothstep(u / 0.25);
        rArmCur = lerpTuple3(rArmMouth, rArmRCheek, seg);
        rFACur  = lerpTuple3(rFAMouth,  rFARCheek,  seg);
        rWrCur  = lerpTuple3(rWrMouth,  rWrRCheek,  seg);
      } else if (u < 0.50) {
        const seg = smoothstep((u - 0.25) / 0.25);
        rArmCur = lerpTuple3(rArmRCheek, rArmForehead, seg);
        rFACur  = lerpTuple3(rFARCheek,  rFAForehead,   seg);
        rWrCur  = lerpTuple3(rWrRCheek,  rWrForehead,   seg);
      } else if (u < 0.75) {
        const seg = smoothstep((u - 0.50) / 0.25);
        rArmCur = lerpTuple3(rArmForehead, rArmLCheek, seg);
        rFACur  = lerpTuple3(rFAForehead,   rFALCheek,  seg);
        rWrCur  = lerpTuple3(rWrForehead,   rWrLCheek,  seg);
      } else {
        const seg = smoothstep((u - 0.75) / 0.25);
        rArmCur = lerpTuple3(rArmLCheek, rArmMouth, seg);
        rFACur  = lerpTuple3(rFALCheek,  rFAMouth,  seg);
        rWrCur  = lerpTuple3(rWrLCheek,  rWrMouth,  seg);
      }
    } else if (c < 0.86) {
      // Phase 3: Transition to 3-finger presentation with wrist at 90° of elbow
      const uTrans = Math.min(1.0, (c - 0.65) / 0.08);
      const eTrans = smoothstep(uTrans);
      rArmCur = lerpTuple3(rArmMouth, rArmPresent, eTrans);
      rFACur  = lerpTuple3(rFAMouth,  rFAPresent,  eTrans);
      rWrCur  = lerpTuple3(rWrMouth,  rWrPresent,  eTrans);
      rHandCur = lerpHand(PRESET_BEAUTIFUL_L_HAND, PRESET_BEAUTIFUL_THREE_FINGERS, eTrans);
      curPhase = 0.70 + (c - 0.65) / 0.21 * 0.30;
      smile = 0.75 + eTrans * 0.17; // radiant 0.92 smile
    } else {
      // Phase 4: Return smoothly to rest
      const u = smoothstep((c - 0.86) / 0.14);
      rArmCur = lerpTuple3(rArmPresent, rArmRest, u);
      rFACur  = lerpTuple3(rFAPresent,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrPresent,  rWrRest,  u);
      rHandCur = lerpHand(PRESET_BEAUTIFUL_THREE_FINGERS, PRESET_STANDBY_RELAXED, u);
      curPhase = 1.0 - u;
      smile = (1.0 - u) * 0.92;
    }

    return {
      definition: def,
      phase: curPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [-0.05, 0.04, 0.0],
      neck: [-0.02, 0.02, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, curPhase),
      mouthSmile: smile,
    };
  }

  // --------------------------------------------------------------------------
  // UGLY: Right claw hand rises in front of face, sweeps across/pulls away with distaste
  // --------------------------------------------------------------------------
  if (resolved === "ugly") {
    const cycle = def.durationSeconds || 2.6;
    const c = (t % cycle) / cycle;

    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    const rArmFace: [number, number, number] = [-0.85, -0.65, -1.25];
    const rFAFace:  [number, number, number] = [-1.75, 1.10, 0.85];
    const rWrFace:  [number, number, number] = [0.15, 0.50, -0.30];

    const rArmPull: [number, number, number] = [-0.55, -0.15, -1.60];
    const rFAPull:  [number, number, number] = [-1.15, 0.35, 0.30];
    const rWrPull:  [number, number, number] = [0.10, 0.10, -0.05];

    let rArmCur: number[], rFACur: number[], rWrCur: number[];
    let curPhase = 0.0;
    let headYaw = 0.0;

    if (c < 0.22) {
      // Approach to face
      const u = smoothstep(c / 0.22);
      rArmCur = lerpTuple3(rArmRest, rArmFace, u);
      rFACur  = lerpTuple3(rFARest,  rFAFace,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrFace,  u);
      curPhase = u * 0.4;
      headYaw = u * -0.08;
    } else if (c < 0.65) {
      // Sweep across face and pull away
      const u = smoothstep((c - 0.22) / 0.43);
      rArmCur = lerpTuple3(rArmFace, rArmPull, u);
      rFACur  = lerpTuple3(rFAFace,  rFAPull,  u);
      rWrCur  = lerpTuple3(rWrFace,  rWrPull,  u);
      curPhase = 0.4 + u * 0.5;
      headYaw = -0.08 - u * 0.12;
    } else if (c < 0.80) {
      // Repelled hold
      rArmCur = [...rArmPull];
      rFACur  = [...rFAPull];
      rWrCur  = [...rWrPull];
      curPhase = 0.9;
      headYaw = -0.20;
    } else {
      // Return to rest
      const u = smoothstep((c - 0.80) / 0.20);
      rArmCur = lerpTuple3(rArmPull, rArmRest, u);
      rFACur  = lerpTuple3(rFAPull,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrPull,  rWrRest,  u);
      curPhase = 1.0 - u;
      headYaw = (1.0 - u) * -0.20;
    }

    return {
      definition: def,
      phase: curPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLAW_HAND,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.06, headYaw, -0.04],
      neck: [0.03, headYaw * 0.5, -0.02],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, curPhase),
      mouthSmile: -0.40,
    };
  }

  // --------------------------------------------------------------------------
  // DEAF: Right index finger touches ear, then sweeps to touch mouth/chin
  // --------------------------------------------------------------------------
  if (resolved === "deaf") {
    const cycle = def.durationSeconds || 2.8;
    const c = (t % cycle) / cycle;

    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    const rArmEar: [number, number, number] = [-0.95, -0.90, -1.45];
    const rFAEar:  [number, number, number] = [-1.95, 1.45, 0.90];
    const rWrEar:  [number, number, number] = [0.25, 0.60, -0.40];

    const rArmMouth: [number, number, number] = [-0.78, -0.40, -1.18];
    const rFAMouth:  [number, number, number] = [-1.60, 0.90, 0.58];
    const rWrMouth:  [number, number, number] = [0.15, 0.35, -0.20];

    let rArmCur: number[], rFACur: number[], rWrCur: number[];
    let curPhase = 0.0;

    if (c < 0.22) {
      // Approach ear
      const u = smoothstep(c / 0.22);
      rArmCur = lerpTuple3(rArmRest, rArmEar, u);
      rFACur  = lerpTuple3(rFARest,  rFAEar,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrEar,  u);
      curPhase = u * 0.35;
    } else if (c < 0.38) {
      // Touch ear
      rArmCur = [...rArmEar];
      rFACur  = [...rFAEar];
      rWrCur  = [...rWrEar];
      curPhase = 0.35 + (c - 0.22) / 0.16 * 0.1;
    } else if (c < 0.68) {
      // Arc from ear to mouth/chin
      const u = smoothstep((c - 0.38) / 0.30);
      rArmCur = lerpTuple3(rArmEar, rArmMouth, u);
      rFACur  = lerpTuple3(rFAEar,  rFAMouth,  u);
      rWrCur  = lerpTuple3(rWrEar,  rWrMouth,  u);
      curPhase = 0.45 + u * 0.35;
    } else if (c < 0.82) {
      // Touch mouth/chin
      rArmCur = [...rArmMouth];
      rFACur  = [...rFAMouth];
      rWrCur  = [...rWrMouth];
      curPhase = 0.8 + (c - 0.68) / 0.14 * 0.15;
    } else {
      // Return to rest
      const u = smoothstep((c - 0.82) / 0.18);
      rArmCur = lerpTuple3(rArmMouth, rArmRest, u);
      rFACur  = lerpTuple3(rFAMouth,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrMouth,  rWrRest,  u);
      curPhase = 1.0 - u;
    }

    return {
      definition: def,
      phase: curPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_POINTING_1,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.04, 0.02],
      neck: [0.01, 0.02, 0.01],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, curPhase),
      mouthSmile: 0.10,
    };
  }

  // --------------------------------------------------------------------------
  // BLIND: Right V-hand points toward eyes and sweeps across sightline
  // --------------------------------------------------------------------------
  if (resolved === "blind") {
    const cycle = def.durationSeconds || 2.7;
    const c = (t % cycle) / cycle;

    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.00, 0.00];

    const rArmEyesStart: [number, number, number] = [-1.05, -0.80, -1.40];
    const rFAEyesStart:  [number, number, number] = [-1.90, 1.30, 0.85];
    const rWrEyesStart:  [number, number, number] = [0.20, 0.55, -0.35];

    const rArmEyesEnd: [number, number, number] = [-0.98, -0.35, -1.20];
    const rFAEyesEnd:  [number, number, number] = [-1.75, 0.85, 0.65];
    const rWrEyesEnd:  [number, number, number] = [0.15, 0.30, -0.20];

    let rArmCur: number[], rFACur: number[], rWrCur: number[];
    let curPhase = 0.0;
    let headPitch = 0.0;

    if (c < 0.24) {
      // Approach eyes
      const u = smoothstep(c / 0.24);
      rArmCur = lerpTuple3(rArmRest, rArmEyesStart, u);
      rFACur  = lerpTuple3(rFARest,  rFAEyesStart,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrEyesStart,  u);
      curPhase = u * 0.4;
      headPitch = u * 0.06;
    } else if (c < 0.70) {
      // Sweep across both eyes
      const u = smoothstep((c - 0.24) / 0.46);
      rArmCur = lerpTuple3(rArmEyesStart, rArmEyesEnd, u);
      rFACur  = lerpTuple3(rFAEyesStart,  rFAEyesEnd,  u);
      rWrCur  = lerpTuple3(rWrEyesStart,  rWrEyesEnd,  u);
      curPhase = 0.4 + u * 0.45;
      headPitch = 0.06 + u * 0.02;
    } else if (c < 0.82) {
      // Hold at end of sweep
      rArmCur = [...rArmEyesEnd];
      rFACur  = [...rFAEyesEnd];
      rWrCur  = [...rWrEyesEnd];
      curPhase = 0.85 + (c - 0.70) / 0.12 * 0.1;
      headPitch = 0.08;
    } else {
      // Return to rest
      const u = smoothstep((c - 0.82) / 0.18);
      rArmCur = lerpTuple3(rArmEyesEnd, rArmRest, u);
      rFACur  = lerpTuple3(rFAEyesEnd,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrEyesEnd,  rWrRest,  u);
      curPhase = 1.0 - u;
      headPitch = (1.0 - u) * 0.08;
    }

    return {
      definition: def,
      phase: curPhase,
      rightArm: {
        arm: rArmCur as [number, number, number],
        forearm: rFACur as [number, number, number],
        wrist: rWrCur as [number, number, number],
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_TWO_FINGERS_LOOK,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, curPhase),
      mouthSmile: 0.0,
    };
  }

  // Handle cyclic motion types
  let easedPhase = rawPhase;
  if (def.motionType === "wave") {
    // 1. Initial straight phase (t <= 0.35s): palms are completely straight and upright facing front side
    // 2. After that: continuous nonstop movement from left to right and right to left with palms maintained facing front side
    const ramp = smoothstep(Math.min(1.0, Math.max(0.0, (t - 0.35) / 0.35)));
    const wave = Math.sin((t - 0.35) * 6.0) * ramp; // -1 to +1

    const startRA = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
    const rightArm: ArmJointAngles = {
      arm: startRA.arm,
      forearm: [startRA.forearm[0], startRA.forearm[1], wave * 0.25],
      wrist: [0.0, -0.25, -0.50 + wave * 0.45], // Palm stays facing directly forward towards user
    };

    const isBothHands = def.involvesHands === "both";
    const startLA = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
    const leftArm: ArmJointAngles = isBothHands
      ? {
          arm: startLA.arm,
          forearm: [startLA.forearm[0], startLA.forearm[1], -wave * 0.25],
          wrist: [-0.05, 0.30, 0.40 - wave * 0.45], // Symmetrically facing directly forward towards user
        }
      : NEUTRAL_REST_ARM_LEFT;

    const rightHand = def.startPose.rightHand || PRESET_OPEN_FLAT_B;
    const leftHand = isBothHands
      ? (def.startPose.leftHand || PRESET_OPEN_FLAT_B)
      : PRESET_STANDBY_RELAXED;

    return {
      definition: def,
      phase: (wave + 1) / 2,
      rightArm,
      leftArm,
      rightHand,
      leftHand,
      head: def.startPose.head || [0, 0, 0],
      neck: def.startPose.neck || [0, 0, 0],
      spine: def.startPose.spine || [0, 0, 0],
      currentWristHeight: def.measurements.initialWristHeight,
    };
  } else if (def.motionType === "nod" || def.motionType === "tap" || def.motionType === "circular") {
    // Ping-pong / oscillatory motion
    const cycle = (Math.sin(rawPhase * Math.PI * 2) + 1) / 2;
    easedPhase = smoothstep(cycle);
  } else {
    // Smooth start-to-end with gentle ease
    easedPhase = smoothstep(rawPhase);
  }

  // Interpolate arms
  const startRA = def.startPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
  const endRA = def.endPose.rightArm || NEUTRAL_REST_ARM_RIGHT;
  const rightArm: ArmJointAngles = {
    arm: lerpTuple3(startRA.arm, endRA.arm, easedPhase),
    forearm: lerpTuple3(startRA.forearm, endRA.forearm, easedPhase),
    wrist: lerpTuple3(startRA.wrist, endRA.wrist, easedPhase),
  };

  const startLA = def.startPose.leftArm || NEUTRAL_REST_ARM_LEFT;
  const endLA = def.endPose.leftArm || NEUTRAL_REST_ARM_LEFT;
  const leftArm: ArmJointAngles = {
    arm: lerpTuple3(startLA.arm, endLA.arm, easedPhase),
    forearm: lerpTuple3(startLA.forearm, endLA.forearm, easedPhase),
    wrist: lerpTuple3(startLA.wrist, endLA.wrist, easedPhase),
  };

  // Interpolate hands
  const startRH = def.startPose.rightHand || PRESET_STANDBY_RELAXED;
  const endRH = def.endPose.rightHand || PRESET_STANDBY_RELAXED;
  const rightHand = lerpHand(startRH, endRH, easedPhase);

  const startLH = def.startPose.leftHand || PRESET_STANDBY_RELAXED;
  const endLH = def.endPose.leftHand || PRESET_STANDBY_RELAXED;
  const leftHand = lerpHand(startLH, endLH, easedPhase);

  // Interpolate head, neck, spine
  const startHead = def.startPose.head || [0, 0, 0];
  const endHead = def.endPose.head || [0, 0, 0];
  const head = lerpTuple3(startHead, endHead, easedPhase);

  const startNeck = def.startPose.neck || [0, 0, 0];
  const endNeck = def.endPose.neck || [0, 0, 0];
  const neck = lerpTuple3(startNeck, endNeck, easedPhase);

  const startSpine = def.startPose.spine || [0, 0, 0];
  const endSpine = def.endPose.spine || [0, 0, 0];
  const spine = lerpTuple3(startSpine, endSpine, easedPhase);

  const currentWristHeight = lerp(
    def.measurements.initialWristHeight,
    def.measurements.finalWristHeight,
    easedPhase
  );

  return {
    definition: def,
    phase: rawPhase,
    rightArm,
    leftArm,
    rightHand,
    leftHand,
    head,
    neck,
    spine,
    currentWristHeight,
  };
}
