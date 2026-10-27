
// Global runtime cache for dynamically learned video sign kinematics
export const DYNAMIC_LEARNED_KINEMATICS: Record<string, any> = {};

export function registerDynamicKinematics(key: string, data: any) {
  if (!key || !data) return;
  const cleanKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
  DYNAMIC_LEARNED_KINEMATICS[cleanKey] = data;
}

﻿/**
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
  isClosedAFist?: boolean;
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
  thumb: { cmc: 0.30, mcp: 0.0, ip: 0.0, opposition: 0.65 }, // Thumb straight & horizontal flat pressed across middle PIP knuckles (not pointing up)
  index: { base: 1.35, mid: 1.38, tip: 1.25, spread: 0.0 },     // Four fingers closed firmly in tight fist, knuckles facing outward 90°
  middle: { base: 1.35, mid: 1.38, tip: 1.25, spread: 0.0 },
  ring: { base: 1.35, mid: 1.38, tip: 1.25, spread: 0.0 },
  pinky: { base: 1.35, mid: 1.38, tip: 1.25, spread: 0.0 },
  isClosedAFist: true,
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



export const PRESET_WET_OPEN: HandAnatomicalPose = {
  thumb:  { cmc: 0.06, mcp: 0.12, ip: 0.08, opposition: 0.25 }, // Open thumb spread outward
  index:  { base: 0.12, mid: 0.14, tip: 0.08, spread: 0.12 },   // Spread 5, slightly relaxed curve
  middle: { base: 0.10, mid: 0.14, tip: 0.08, spread: 0.03 },   // Spread 5
  ring:   { base: 0.12, mid: 0.14, tip: 0.08, spread: -0.07 },  // Spread 5
  pinky:  { base: 0.14, mid: 0.16, tip: 0.08, spread: -0.14 },  // Spread 5
};

export const PRESET_WET_CLOSED: HandAnatomicalPose = {
  thumb:  { cmc: 0.55, mcp: 0.70, ip: 0.60, opposition: 0.85 }, // Thumb pad opposes all 4 fingertips
  index:  { base: 0.82, mid: 0.88, tip: 0.78, spread: -0.04 },  // All fingertips meet thumb pad (chutki / catching water droplet)
  middle: { base: 0.82, mid: 0.88, tip: 0.78, spread: 0.00 },
  ring:   { base: 0.82, mid: 0.88, tip: 0.78, spread: 0.04 },
  pinky:  { base: 0.82, mid: 0.88, tip: 0.78, spread: 0.08 },
  isPinchedMorsel: true,
};
export const PRESET_F_OK_HANDSHAPE: HandAnatomicalPose = {
  thumb: { cmc: 0.15, mcp: 0.25, ip: 0.20, opposition: 0.65 },
  index: { base: 0.60, mid: 0.75, tip: 0.50, spread: -0.05 }, // Form circle/loop with thumb
  middle: { base: 0.05, mid: 0.02, tip: 0.00, spread: 0.08 },  // Extended straight upright
  ring:   { base: 0.05, mid: 0.02, tip: 0.00, spread: 0.02 },  // Extended straight upright
  pinky:  { base: 0.05, mid: 0.02, tip: 0.00, spread: -0.08 }, // Extended straight upright
};
export const PRESET_PINCHED_EATING_MORSEL: HandAnatomicalPose = {
  thumb: { cmc: 0.55, mcp: 0.70, ip: 0.60, opposition: 0.85 }, // Thumb pad opposes all 4 fingertips
  index: { base: 0.85, mid: 0.90, tip: 0.85, spread: -0.05 },  // 4 fingers curved inward together
  middle: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.00 },
  ring: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.05 },
  pinky: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.10 },
  isPinchedMorsel: true,
};

export const PRESET_FLATTENED_O: HandAnatomicalPose = {
  thumb:  { cmc: 0.55, mcp: 0.70, ip: 0.60, opposition: 0.85 }, // Thumb pad opposes all 4 fingertips (Flattened-O / chutki / katori)
  index:  { base: 0.85, mid: 0.90, tip: 0.85, spread: -0.04 },  // All 4 fingertips gathered together touching thumb tip
  middle: { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.00 },
  ring:   { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.04 },
  pinky:  { base: 0.85, mid: 0.90, tip: 0.85, spread: 0.08 },
  isPinchedMorsel: true,
};

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
    durationSeconds: 2.6,
    motionType: "circular",
    measurements: {
      initialWristHeight: -0.08, // Sternum / center chest level
      finalWristHeight: -0.08,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.0,
      depthDisplacement: 0.0,
      totalMovementDistance: 0.25, // Circular circumference
      palmOrientationStart: "Right hand in ASL 'A' fist resting against center chest (sternum), palm facing inward toward chest, knuckles facing outward",
      palmOrientationEnd: "Rubbing in 2-3 continuous clockwise circles over sternum with locked neutral wrist and head bowed in remorse",
      wristRotationDegrees: [20.0, 5.7, 8.6],
      trajectoryType: "circular",
      anatomicalFeatures: [
        "Thumb: Angutha bilkul straight aur baki ungliyon ke middle knuckles (PIP joints) ke upar flat press, horizontal (not pointing up)",
        "Fingers (Index to Pinky): Charo ungliyan tight fist (muthhi), knuckles bahar ki taraf 90-degree angle pr face karenge",
        "Wrist: Bilkul locked aur straight (zero flex/bend), pura haath aur wrist single solid unit",
        "Contact Point: Muthhi ka Thumb-side aur Index finger ka side sternum (chest ke bilkul bich) pr touch karega (0-inch gap)",
        "Shoulder: Relaxed par 10-15 degrees bahar rotated taaki elbow body se thoda door rahe (no upward shrink)",
        "Elbow: Nichli taraf aur bahar (outward) point karegi 45-degree angle banate hue, main pivot point banegi",
        "Motion: 2-3 Clockwise circles (Upar -> Right -> Neeche -> Left) diameter ~3-4 inches",
        "Torso & Head: 5 degrees forward lean, head tilted down (bowed), remorseful expression with compressed lips & lowered brows",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.25, 0.12, -0.95], forearm: [-1.15, 0.15, 0.15], wrist: [0.25, -0.15, 0.15] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_A,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.25, 0.12, -0.95], forearm: [-1.15, 0.15, 0.15], wrist: [0.25, -0.15, 0.15] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_CLOSED_FIST_A,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "SORRY Sign: Right hand moves from 3rd quadrant up to the chest, turning the elbow 90 degrees from right to left towards the chest; dominant hand directly touches the center of the chest (sternum) with zero gap; thumb horizontal flat across middle knuckles; rubs in 2-3 continuous clockwise circles.",
    facialExpression: "Remorseful, apologetic facial expression with head bowed forward and downcast eyes in contrition.",
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
  // --------------------------------------------------------------------------
  // OLD / ELDERLY (Two-Stage Compound Motion requested by user):
  // 1. First perform the complete EAT sign: pinched morsel hand moving from lower
  //    quadrant to mouth / lips and dwelling.
  // 2. Then transition hand upward and backwards behind the head / nape of neck.
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // YOUNG / YOUTH (युवा / जवान / नया):
  // Reverse motion of old:
  // Starts near neck/mouth with closed/pinched hand, wrist turned facing OUTWARD
  // towards the user/viewer (opposite of old).
  // Then the hand moves DOWNWARD in front of chest while all fingers and thumb
  // blossom open facing the user, expressing blooming vitality and youth.
    // --------------------------------------------------------------------------
  // YOUNG (Trained on reference video MVI_9504.MOV / INCLUDE Class 52):
  // Right hand starts beside body, rises toward face and nose/eye, reaches
  // forehead/temple with pinched fingertips, sweeps outward/away, and returns down.
  // --------------------------------------------------------------------------
  young: {
    id: "young",
    name: "Young",
    meaningHindi: "युवा / जवान / नया",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.36,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.65,
      horizontalDisplacement: 0.28,
      depthDisplacement: 0.20,
      totalMovementDistance: 0.72,
      palmOrientationStart: "Right hand begins resting beside body; raises toward face with fingers bunched in bud pinch",
      palmOrientationEnd: "Hand reaches forehead and temple with elbow bent, sweeps outward away from head with blossoming fingers, then lowers back down beside body",
      wristRotationDegrees: [15.0, -12.0, -20.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Phase 1 (0.0–0.4s): Right hand raises smoothly from side beside the body toward the face",
        "Phase 2 (0.4–0.8s): Hand moves toward the nose and eye area, then upward toward the forehead",
        "Phase 3 (0.8–1.4s): Hand positions near the forehead and right temple, keeping elbow bent with fingertips together",
        "Phase 4 (1.4–1.9s): Hand sweeps outward and away from the head as fingers blossom open",
        "Phase 5 (1.9–2.36s): Hand lowers smoothly back toward the side of the body to rest",
        "Left hand remains stationary beside the body throughout the entire gesture",
        "Preserves facial posture observed in reference video MVI_9504.MOV",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PINCHED_EATING_MORSEL,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In Young (trained on ISL reference video MVI_9504.MOV), right hand raises from side of body toward nose and eyes, moves upward near forehead and temple with elbow bent and pinched fingers, sweeps outward away from head as fingers blossom open, and returns smoothly down beside body.",
    facialExpression: "Lively, alert facial expression with direct eye contact matching reference video MVI_9504.MOV.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNKNOWN_SIGN_001 (Reference Video: MVI_9504.MOV)
  // Verified Meaning: PENDING | Validation Status: PENDING
  // Exact 5-phase gesture reproduction from reference video MVI_9504.MOV
  // --------------------------------------------------------------------------
  unknown_sign_001: {
    id: "unknown_sign_001",
    name: "UNKNOWN_SIGN_001",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.36,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.65,
      horizontalDisplacement: 0.28,
      depthDisplacement: 0.20,
      totalMovementDistance: 0.72,
      palmOrientationStart: "Right hand begins resting beside body; raises toward face with fingers bunched in bud pinch",
      palmOrientationEnd: "Hand reaches forehead and temple with elbow bent, sweeps outward away from head with blossoming fingers, then lowers back down beside body",
      wristRotationDegrees: [15.0, -12.0, -20.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Phase 1 (0.0-0.4s): Raise the right hand from the side of the body toward the face with pinched/bud fingers",
        "Phase 2 (0.4-0.8s): Move the hand toward the nose and eye area, then upward toward the forehead",
        "Phase 3 (0.8-1.4s): Position the hand near the forehead and temple, keeping the elbow bent",
        "Phase 4 (1.4-1.9s): Move the raised hand outward and away from the head as fingers blossom open",
        "Phase 5 (1.9-2.36s): Lower the right hand toward the side of the body and return to the initial position",
        "Left hand appears mostly stationary beside the body throughout",
        "Preserves exact reference video MVI_9504.MOV movement sequence and timing",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_PINCHED_EATING_MORSEL,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.02, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNKNOWN_SIGN_001 (reference video MVI_9504.MOV, verified_meaning: PENDING, validation_status: PENDING), the right hand raises from the side of the body toward the nose and eyes, moves upward near the forehead and temple with elbow bent and fingers pinched, sweeps outward and away from the head as fingers blossom open, and returns smoothly down beside the body.",
    facialExpression: "Attentive, engaged facial expression matching reference video MVI_9504.MOV.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNVERIFIED_001 (Reference Video: MVI_9431.MOV, 2.36s, 25 FPS)
  // Verification Status: PENDING
  // Thumb & index form circular loop; middle, ring, pinky extended straight upright
  // --------------------------------------------------------------------------
  unverified_001: {
    id: "unverified_001",
    name: "UNVERIFIED_001",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.36,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.52,
      horizontalDisplacement: 0.22,
      depthDisplacement: 0.18,
      totalMovementDistance: 0.58,
      palmOrientationStart: "Right hand resting beside body at hip; raises toward face with thumb and index touching in ring",
      palmOrientationEnd: "Held at upper chest with three extended fingers upright, palm facing forward toward viewer, then lowers back to hip",
      wristRotationDegrees: [12.0, -10.0, -15.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Thumb pad and index fingertip meet together forming a circular ring loop",
        "Middle, ring, and pinky fingers are fully straightened, flared, and extended upright",
        "Right hand raises from side of body beside hip to upper chest/face level",
        "Holds in front of upper chest with palm facing forward and slight affirmative head nod",
        "Lowers smoothly back to side of body beside hip",
        "Left hand remains stationary beside body throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNVERIFIED_001 (reference video MVI_9431.MOV, 2.36s), the right hand raises from beside the hip toward the upper chest/face while forming an F/OK handshape with thumb and index in a circle and three fingers extended upright. It holds with palm facing forward, then lowers back to the hip; left hand remains stationary beside the body.",
    facialExpression: "Attentive, pleasant facial expression with direct eye contact and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNVERIFIED_002 (Reference Video: MVI_9432.MOV, 2.36s, 25 FPS)
  // --------------------------------------------------------------------------
  unverified_002: {
    id: "unverified_002",
    name: "UNVERIFIED_002",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.36,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.52,
      horizontalDisplacement: 0.22,
      depthDisplacement: 0.18,
      totalMovementDistance: 0.58,
      palmOrientationStart: "Right hand resting beside body at hip; raises toward face with thumb and index touching in ring",
      palmOrientationEnd: "Held at upper chest with three extended fingers upright, palm facing forward toward viewer, then lowers back to hip",
      wristRotationDegrees: [12.0, -10.0, -15.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Thumb pad and index fingertip meet together forming a circular ring loop",
        "Middle, ring, and pinky fingers are fully straightened, flared, and extended upright",
        "Right hand raises from side of body beside hip to upper chest/face level",
        "Holds in front of upper chest with palm facing forward and slight affirmative head nod",
        "Lowers smoothly back to side of body beside hip",
        "Left hand remains stationary beside body throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNVERIFIED_002 (reference video MVI_9432.MOV, 2.36s), the right hand raises from beside the hip toward the upper chest/face while forming an F/OK handshape with thumb and index in a circle and three fingers extended upright. It holds with palm facing forward, then lowers back to the hip; left hand remains stationary beside the body.",
    facialExpression: "Attentive, pleasant facial expression with direct eye contact and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNVERIFIED_003 (Reference Video: MVI_9510.MOV, 2.48s, 25 FPS)
  // --------------------------------------------------------------------------
  unverified_003: {
    id: "unverified_003",
    name: "UNVERIFIED_003",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.48,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.55,
      horizontalDisplacement: 0.22,
      depthDisplacement: 0.18,
      totalMovementDistance: 0.60,
      palmOrientationStart: "Right hand resting beside body at hip; raises toward face with thumb and index touching in ring",
      palmOrientationEnd: "Held at upper chest with three extended fingers upright, palm facing forward toward viewer, then lowers back to hip",
      wristRotationDegrees: [12.0, -10.0, -15.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Thumb pad and index fingertip meet together forming a circular ring loop",
        "Middle, ring, and pinky fingers are fully straightened, flared, and extended upright",
        "Right hand raises from side of body beside hip to upper chest/face level",
        "Holds in front of upper chest with palm facing forward and slight affirmative head nod",
        "Lowers smoothly back to side of body beside hip",
        "Left hand remains stationary beside body throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNVERIFIED_003 (reference video MVI_9510.MOV, 2.48s), the right hand raises from beside the hip toward the upper chest/face while forming an F/OK handshape with thumb and index in a circle and three fingers extended upright. It holds with palm facing forward, then lowers back to the hip; left hand remains stationary beside the body.",
    facialExpression: "Attentive, pleasant facial expression with direct eye contact and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNVERIFIED_004 (Reference Video: MVI_9511.MOV, 2.24s, 25 FPS)
  // --------------------------------------------------------------------------
  unverified_004: {
    id: "unverified_004",
    name: "UNVERIFIED_004",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.24,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.55,
      horizontalDisplacement: 0.22,
      depthDisplacement: 0.18,
      totalMovementDistance: 0.60,
      palmOrientationStart: "Right hand resting beside body at hip; raises toward face with thumb and index touching in ring",
      palmOrientationEnd: "Held at upper chest with three extended fingers upright, palm facing forward toward viewer, then lowers back to hip",
      wristRotationDegrees: [12.0, -10.0, -15.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Thumb pad and index fingertip meet together forming a circular ring loop",
        "Middle, ring, and pinky fingers are fully straightened, flared, and extended upright",
        "Right hand raises from side of body beside hip to upper chest/face level",
        "Holds in front of upper chest with palm facing forward and slight affirmative head nod",
        "Lowers smoothly back to side of body beside hip",
        "Left hand remains stationary beside body throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNVERIFIED_004 (reference video MVI_9511.MOV, 2.24s), the right hand raises from beside the hip toward the upper chest/face while forming an F/OK handshape with thumb and index in a circle and three fingers extended upright. It holds with palm facing forward, then lowers back to the hip; left hand remains stationary beside the body.",
    facialExpression: "Attentive, pleasant facial expression with direct eye contact and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNKNOWN_SIGN_005 (Reference Video: MVI_5320.MOV, 2.0s, 25 FPS)
  // Verification Status: PENDING
  // --------------------------------------------------------------------------
  unknown_sign_005: {
    id: "unknown_sign_005",
    name: "UNKNOWN_SIGN_005",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "right",
    durationSeconds: 2.0,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.52,
      horizontalDisplacement: 0.20,
      depthDisplacement: 0.18,
      totalMovementDistance: 0.58,
      palmOrientationStart: "Right hand resting beside body at hip; raises toward lower face/chin",
      palmOrientationEnd: "Positioned in front of chin/lower face with upright fingers and forward palm, then lowers back to hip",
      wristRotationDegrees: [12.0, -10.0, -15.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Right hand raises from side of body beside hip toward lower face and chin",
        "Fingers extended upright with palm facing forward toward viewer",
        "Holds briefly near chin level with attentive gaze and subtle affirmative head nod",
        "Lowers smoothly back to side of body beside hip into resting posture",
        "Left hand remains stationary beside body throughout",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNKNOWN_SIGN_005 (reference video MVI_5320.MOV, 2.0s), the right hand raises from beside the hip toward the lower face and chin with fingers extended straight upright and palm facing forward toward the viewer. It holds briefly with an attentive expression and subtle nod, then lowers smoothly back to the hip; left hand rests at side.",
    facialExpression: "Attentive facial expression with direct eye contact and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // UNKNOWN_SIGN_006 (Reference Video: MVI_5164.MOV, 3.32s, 25 FPS)
  // Two-hand dynamic gesture in front of chest
  // Verification Status: PENDING
  // --------------------------------------------------------------------------
  unknown_sign_006: {
    id: "unknown_sign_006",
    name: "UNKNOWN_SIGN_006",
    meaningHindi: "विचाराधीन (PENDING)",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 3.32,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.45,
      finalWristHeight: -0.45,
      verticalDisplacement: 0.45,
      horizontalDisplacement: 0.25,
      depthDisplacement: 0.20,
      totalMovementDistance: 0.55,
      palmOrientationStart: "Both hands resting beside body at hips; right hand raises first, then left hand joins at chest",
      palmOrientationEnd: "Both hands interact in front of chest with upright fingers and palms facing inward/forward, then return to hips",
      wristRotationDegrees: [10.0, -10.0, -10.0],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Right hand begins elevating toward upper chest first, followed by left hand rising from hip",
        "Both hands meet in signing space in front of center chest with upright fingers",
        "Both hands perform synchronized two-handed chest interaction with slight affirmative head nod",
        "Both hands lower smoothly back down along front of body to rest beside hips",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm:  { arm: [-0.10, -0.05, 0.20], forearm: [-0.15, -0.05, -0.05], wrist: [0.05, 0.0, 0.0] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm:  { arm: [-0.10, -0.05, 0.20], forearm: [-0.15, -0.05, -0.05], wrist: [0.05, 0.0, 0.0] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "In UNKNOWN_SIGN_006 (reference video MVI_5164.MOV, 3.32s), both hands start beside the hips, raise into the signing space in front of the chest, perform a synchronized two-handed interaction with extended upright fingers and palms facing inward/forward, and lower smoothly back to rest beside the hips.",
    facialExpression: "Attentive facial expression with direct eye contact and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // WET / WET_ASL (गीला / नम / भीगा)
  // Two-hand dynamic gesture with double downward closing pulses
  // Reference: Strong ASL Dictionary — WET / AI4Bharat ISL
  // --------------------------------------------------------------------------
  wet: {
    id: "wet",
    name: "WET",
    meaningHindi: "गीला / नम",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.4,
    motionType: "compound",
    measurements: {
      initialWristHeight: -0.35,
      finalWristHeight: -0.42,
      verticalDisplacement: 0.18,
      horizontalDisplacement: 0.14,
      depthDisplacement: 0.12,
      totalMovementDistance: 0.26,
      palmOrientationStart: "Both hands positioned close together in front of chest, palms facing upward, fingers open and spread",
      palmOrientationEnd: "Both hands move downward twice while fingers close toward thumb bringing fingertips together, then return to rest",
      wristRotationDegrees: [-17.2, 14.3, 37.2],
      trajectoryType: "compound",
      anatomicalFeatures: [
        "Both hands positioned symmetrically in front of chest, palms facing upward",
        "Initial handshape has all fingers and thumb fully open and spread apart",
        "Both hands move downward simultaneously ~12cm while fingers smoothly curl inward to meet thumb pad",
        "Hands rise slightly back up while fingers open back into spread 5 posture",
        "A second downward closing movement is performed synchronously",
        "Hands settle in lower chest position before descending smoothly to hips",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm:  { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm:   { arm: [-0.10, -0.05, 0.20], forearm: [-0.15, -0.05, -0.05], wrist: [0.05, 0.0, 0.0] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand:  PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm:  { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm:   { arm: [-0.10, -0.05, 0.20], forearm: [-0.15, -0.05, -0.05], wrist: [0.05, 0.0, 0.0] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand:  PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "WET Sign (शुरुआती स्थिति और गतिविधि): Starting with elbows bent comfortably near the body at chest level and wrists extended backward (Wrist Extension) so palms face upward toward the sky/face with spread 5 handshape (fingers slightly curved). Both hands move downward simultaneously via elbow/forearm extension while wrists flex downward (Wrist Flexion) tilting palms downward and inward, as all fingertips come together to touch the thumb tip (pinched chutki / catching water droplets) with right elbow moving right-to-left and left elbow moving left-to-right toward the stomach. Repeated twice in a natural open-close rhythm.",
    facialExpression: "Attentive, focused facial expression with slight downward gaze tracking the hands and subtle affirmative nod.",
    verifiedStatus: "LINGUISTICALLY_VERIFIED",
  },

  // --------------------------------------------------------------------------
  // MORE (और / ज्यादा)
  // --------------------------------------------------------------------------
  more: {
    id: "more",
    name: "More",
    meaningHindi: "और / ज्यादा",
    signLanguage: "ISL",
    referenceSource: "Signs Everyone Should Know",
    involvesHands: "both",
    durationSeconds: 2.5,
    motionType: "tap",
    measurements: {
      initialWristHeight: -0.12, // Mid-air in front of chest
      finalWristHeight: -0.12,
      verticalDisplacement: 0.0,
      horizontalDisplacement: 0.18, // X-axis convergence
      depthDisplacement: 0.0,
      totalMovementDistance: 0.36,
      palmOrientationStart: "Both hands in Flattened-O / chutki shape facing each other across chest mid-air",
      palmOrientationEnd: "Fingertips tap together at midline along X-axis 3 times repeatedly",
      wristRotationDegrees: [8.6, -17.2, 8.6],
      trajectoryType: "tap",
      anatomicalFeatures: [
        "Handshape: Two-Handed Flattened-O ('chutki' / 'katori' shape with all fingertips touching thumb tip)",
        "Wrist: Slight wrist flexion so fingertips face each other directly across the midline",
        "Elbows: Bent on both sides, holding hands floating in mid-air in front of the chest",
        "Trajectory: Bilateral X-axis convergence where fingertips tap (collide) 2-3 times repeatedly",
        "AI Tracking: Euclidean distance between opposing fingertips oscillates from positive to zero (contact) 3 times",
      ],
    },
    startPose: {
      timeFraction: 0.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm:  { arm: [-0.10, -0.05, 0.20], forearm: [-0.15, -0.05, -0.05], wrist: [0.05, 0.0, 0.0] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand:  PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    endPose: {
      timeFraction: 1.0,
      rightArm: { arm: [-0.10, 0.05, -0.20], forearm: [-0.15, 0.05, 0.05], wrist: [0.05, 0.0, 0.0] },
      leftArm:  { arm: [-0.10, -0.05, 0.20], forearm: [-0.15, -0.05, -0.05], wrist: [0.05, 0.0, 0.0] },
      rightHand: PRESET_STANDBY_RELAXED,
      leftHand:  PRESET_STANDBY_RELAXED,
      head: [0.0, 0.0, 0.0],
    },
    description: "MORE Sign (और / ज्यादा): Both hands form the Flattened-O / 'chutki' handshape with all fingertips and thumb tips touching together. The wrists maintain slight flexion so the fingertips face each other in front of the chest. Driven by horizontal X-axis convergence, both hands move inward from the sides and tap (collide) their fingertips together 2 to 3 times before returning to rest.",
    facialExpression: "Interested, affirmative expression with slight forward head tilt.",
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
  if (clean === "sorry" || clean === "maaf" || clean === "kshama" || clean === "maafi" || clean === "apology" || clean === "apologize" || clean === "forgive" || clean === "sori") return "sorry";
  if (clean === "stop" || clean === "ruko" || clean === "rok") return "stop";
  if (clean === "pain" || clean === "dard" || clean === "takleef") return "pain";
  if (clean === "eat" || clean === "food" || clean === "khana") return "eat";
  if (clean === "drink" || clean === "drinking" || clean === "peena" || clean === "peeyo" || clean === "water" || clean === "paani") return "drink";
  if (clean === "more" || clean === "aur" || clean === "extra" || clean === "zyada" || clean === "jyada" || clean === "adhik") return "more";
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
  if (clean === "loud" || clean === "adjective" || clean === "mvi5177" || clean === "mvi_5177" || clean === "importedsign" || clean === "imported_sign" || clean === "tez" || clean === "shor" || clean === "awaaz" || clean === "chillana" || clean === "hungama") return "loud";
  if (clean === "happy" || clean === "khush" || clean === "khushi" || clean === "prasann" || clean === "anand") return "happy";
  if (clean === "sad" || clean === "dukhi" || clean === "dukh" || clean === "udaas" || clean === "udas") return "sad";
  if (clean === "beautiful" || clean === "sundar" || clean === "khoobsurat" || clean === "khubsurat" || clean === "pretty") return "beautiful";
  if (clean === "ugly" || clean === "kurup" || clean === "bhadha" || clean === "bhadda" || clean === "badsurat") return "ugly";
  if (clean === "deaf" || clean === "badhir" || clean === "bahra" || clean === "behra") return "deaf";
  if (clean === "blind" || clean === "andha" || clean === "andhaa" || clean === "drishtihin" || clean === "netrahin") return "blind";
  if (clean === "angry" || clean === "gussa" || clean === "krodh" || clean === "krodhi") return "angry";
  if (clean === "go" || clean === "jao" || clean === "jana" || clean === "chalo") return "go";
  if (clean === "come" || clean === "aao" || clean === "aana" || clean === "idhar_aao" || clean === "padharo") return "come";
  if (clean === "want" || clean === "chahiye" || clean === "chahta" || clean === "chahti" || clean === "desire" || clean === "icha" || clean === "chah") return "want";
  if (clean === "dead" || clean === "mar" || clean === "mrit" || clean === "death" || clean === "deceased") return "dead";
  if (clean === "high" || clean === "uncha" || clean === "ooncha" || clean === "uccha") return "high";
  if (clean === "low" || clean === "neecha" || clean === "nicha") return "low";
  if (clean === "narrow" || clean === "sankra" || clean === "patla" || clean === "sankeern") return "narrow";
  if (clean === "old" || clean === "buddha" || clean === "budha" || clean === "elderly" || clean === "vriddha") return "old";
  if (clean === "young" || clean === "yuva" || clean === "jawan" || clean === "naya" || clean === "youth") return "young";

    if (clean === "unknown_sign_001" || clean === "unknownsign001" || clean === "unknown_001" || clean === "mvi_9504") return "unknown_sign_001";
  if (clean === "unverified_001" || clean === "unverified001" || clean === "mvi_9431" || clean === "sign_video_001") return "unverified_001";
  if (clean === "unverified_002" || clean === "unverified002" || clean === "mvi_9432" || clean === "sign_video_002") return "unverified_002";
  if (clean === "unverified_003" || clean === "unverified003" || clean === "mvi_9510" || clean === "sign_video_003") return "unverified_003";
  if (clean === "unverified_004" || clean === "unverified004" || clean === "mvi_9511" || clean === "sign_video_004") return "unverified_004";
  if (clean === "unknown_sign_005" || clean === "unknownsign005" || clean === "mvi_5320") return "unknown_sign_005";
  if (clean === "unknown_sign_006" || clean === "unknownsign006" || clean === "mvi_5164") return "unknown_sign_006";
  if (clean === "wet" || clean === "wet_asl" || clean === "wetasl" || clean === "geela" || clean === "nam" || clean === "bheega") return "wet";
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
  if (DYNAMIC_LEARNED_KINEMATICS[resolved]) {
    const dyn = DYNAMIC_LEARNED_KINEMATICS[resolved];
    const duration = dyn.durationSeconds || 2.4;
    const loopTime = t % duration;
    const rawPhase = loopTime / duration;
    const traj = dyn.trajectory || [];
    if (traj.length > 0) {
      const idx = Math.min(traj.length - 1, Math.floor(rawPhase * traj.length));
      const kf = traj[idx];
      return {
        phase: rawPhase,
        rightArm: kf.rightArm || NEUTRAL_REST_ARM_RIGHT,
        leftArm: kf.leftArm || NEUTRAL_REST_ARM_LEFT,
        rightHand: PRESET_STANDBY_RELAXED,
        leftHand: PRESET_STANDBY_RELAXED,
        head: [0, 0, 0],
        neck: [0, 0, 0],
        spine: [0, 0, 0],
        currentWristHeight: -0.4,
        mouthSmile: 0.0,
      };
    }
  }
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

  // --------------------------------------------------------------------------
  // SORRY (ASL/ISL 'A' Handshape Clockwise Sternum Rubbing)
  // Frame 1: Right hand 'A' fist touches center chest (sternum)
  // Frame 2: Shoulder & forearm move fist Up & Right in clockwise circle
  // Frame 3: Fist sweeps Down & Left completing the circle
  // Frame 4: Repeats 2-3 continuous clockwise loops without lifting off chest
  // --------------------------------------------------------------------------
  if (resolved === "sorry") {
    const cycleDuration = def.durationSeconds || 2.6;
    const c = (t % cycleDuration) / cycleDuration;

    // Quadrant 3 starting pose (lower right quadrant in front of waist / lower torso)
    const rArmQ3: [number, number, number] = [-0.25, 0.12, -0.95];
    const rFAQ3:  [number, number, number] = [-1.15, 0.15, 0.15];
    const rWrQ3:  [number, number, number] = [0.25, -0.15, 0.15];

    // Chest contact target pose:
    // 1. Right elbow turned 90 degrees (1.5708 rad) from right to left towards the chest
    // 2. Dominant hand (fist) touches the center of the chest (sternum) directly with 0-inch gap
    // 3. Thumb flat and horizontal across middle knuckles, wrist locked straight as solid unit
    const rShoulderBase: [number, number, number] = [0.0, -0.22, 0.0]; // Relaxed 10-15 deg outward shoulder rotation
    const rArmCenter:    [number, number, number] = [-0.55, -0.15, -1.05];
    const rFACenter:     [number, number, number] = [-1.55, 1.5708, 0.15]; // Elbow turned 90 degrees towards chest
    const rWrCenter:     [number, number, number] = [0.35, -0.45, 0.25];   // Dominant hand touching chest directly

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let rShoulder: [number, number, number] = [0.0, 0.0, 0.0];
    let rHandCur: HandAnatomicalPose;
    let headPitch = 0.0;
    let smileWeight = 0.0;

    if (c < 0.20) {
      // Phase 1: Move right hand from 3rd Quadrant up to the chest, turning elbow 90° to touch chest
      const u = smoothstep(c / 0.20);
      rShoulder = lerpTuple3([0.0, -0.10, 0.0], rShoulderBase, u);
      rArmCur = lerpTuple3(rArmQ3, rArmCenter, u);
      rFACur  = lerpTuple3(rFAQ3,  rFACenter,  u); // Elbow turns 90° towards chest
      rWrCur  = lerpTuple3(rWrQ3,  rWrCenter,  u); // Dominant hand moves to touch chest
      rHandCur = PRESET_CLOSED_FIST_A;
      headPitch = u * 0.12; // Head bows forward in contrition (~7 degrees)
      smileWeight = -0.35 * u; // Apologetic remorseful facial expression
    } else if (c < 0.82) {
      // Phase 2 (Frames 2-4): 3 continuous Clockwise circles over sternum touching chest (Up -> Right -> Down -> Left)
      const u = (c - 0.20) / 0.62;
      const theta = u * 3.0 * Math.PI * 2.0; // 3 complete clockwise circular loops
      const env = Math.sin(Math.PI * u) ** 0.5;

      const radius = 0.055; // Circular diameter on chest wall
      const dx = Math.sin(theta) * radius * env; // Clockwise horizontal: Up -> Right -> Down -> Left
      const dy = Math.cos(theta) * radius * env; // Clockwise vertical

      // Elbow turned 90° towards chest, dynamically pivoting the circle with 0-inch gap
      rShoulder = [rShoulderBase[0] + dy * 0.10, rShoulderBase[1] + dx * 0.12, 0.0];
      rArmCur = [
        rArmCenter[0] - dy * 0.60,
        rArmCenter[1] + dx * 0.30,
        rArmCenter[2] + dx * 0.40,
      ];
      rFACur = [
        rFACenter[0] - dy * 0.40,
        rFACenter[1] + dx * 0.30,
        rFACenter[2],
      ];
      // Wrist locked, hand touching chest directly
      rWrCur = [...rWrCenter];
      rHandCur = PRESET_CLOSED_FIST_A;
      headPitch = 0.12 + Math.sin(theta) * 0.015; // Contrite bowed head
      smileWeight = -0.35; // Remorseful sad mouth expression
    } else if (c < 0.88) {
      // Phase 3: Settle with dominant hand touching chest
      rShoulder = [...rShoulderBase];
      rArmCur = [...rArmCenter];
      rFACur  = [...rFACenter];
      rWrCur  = [...rWrCenter];
      rHandCur = PRESET_CLOSED_FIST_A;
      headPitch = 0.12;
      smileWeight = -0.35;
    } else {
      // Phase 4: Smooth descent from chest back down to 3rd Quadrant
      const u = smoothstep((c - 0.88) / 0.12);
      rShoulder = lerpTuple3(rShoulderBase, [0.0, -0.10, 0.0], u);
      rArmCur = lerpTuple3(rArmCenter, rArmQ3, u);
      rFACur  = lerpTuple3(rFACenter,  rFAQ3,  u);
      rWrCur  = lerpTuple3(rWrCenter,  rWrQ3,  u);
      rHandCur = PRESET_CLOSED_FIST_A;
      headPitch = 0.12 * (1.0 - u);
      smileWeight = -0.35 * (1.0 - u);
    }

    return {
      definition: def,
      phase: c,
      rightArm: {
        shoulder: rShoulder,
        arm: rArmCur,
        forearm: rFACur,
        wrist: rWrCur,
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.087, 0.0, 0.0], // 5 degree forward torso lean in regret
      currentWristHeight: def.measurements.initialWristHeight,
      mouthSmile: smileWeight,
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
  // --------------------------------------------------------------------------
  // OLD (Requested User Choreography:
  // Phase 1 (0.00 - 0.55): Full complete EAT sign (lower quadrant -> mouth -> touch)
  // Phase 2 (0.55 - 0.85): Hand travels from mouth up and behind the head
  // Phase 3 (0.85 - 1.00): Dwell behind head and return
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // YOUNG (User Requested Specification & Screenshot Match):
  // - Starts at mouth/chin level with wrist facing OUTWARD towards user
  // - Fingers start closed/pinched
  // - Hand descends DOWNWARD in front of chest while all fingers and thumb
  //   blossom from closed to open facing the user
    // --------------------------------------------------------------------------
  // YOUNG (User Calibrated ISL Sign):
  // - Starts directly in front of mouth with wrist facing straight toward user (viewer)
  // - All fingers and thumb begin closed in a bud/pinch
  // - Hand descends straight vertically down in front of mouth, chin, throat, chest
  // - All fingers and thumb blossom wide open facing straight toward user as hand lowers
  // - Avatar displays youthful vibrant smile
    // --------------------------------------------------------------------------
  // YOUNG (Trained on Reference Video MVI_9504.MOV / INCLUDE Class 52):
  // Phase 1 (0.00 - 0.17 | 0.0 - 0.4s): Raise right hand from side beside body toward face with pinched/bud fingers
  // Phase 2 (0.17 - 0.34 | 0.4 - 0.8s): Move hand past mouth/nose toward eyes and upward to forehead
  // Phase 3 (0.34 - 0.59 | 0.8 - 1.4s): Dwell near forehead and right temple, elbow bent
  // Phase 4 (0.59 - 0.80 | 1.4 - 1.9s): Move raised hand outward and away from head/temple with blossoming fingers
  // Phase 5 (0.80 - 1.00 | 1.9 - 2.36s): Lower right hand smoothly back toward side of body to neutral rest
  // Left hand: Rested calmly beside body throughout
  // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
  // UNKNOWN_SIGN_001 (Reference Video: MVI_9504.MOV | Status: PENDING)
  // Exact 5-phase reproduction:
  // Phase 1 (0.0-0.4s): Raise right hand from side beside body toward face with pinched fingers
  // Phase 2 (0.4-0.8s): Move hand toward nose/eyes and upward toward forehead
  // Phase 3 (0.8-1.4s): Dwell near forehead and temple with elbow bent
  // Phase 4 (1.4-1.9s): Move raised hand outward and away from head, fingers blossom open
  // Phase 5 (1.9-2.36s): Lower right hand back toward side of body to rest
  // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
  // UNVERIFIED_001..004 (Reference Videos: MVI_9431.MOV, MVI_9432.MOV, MVI_9510.MOV, MVI_9511.MOV)
  // Exact 4-phase gesture reproduction:
  // Phase 1 (0.00 - 0.38): Smooth ascent from hip to upper chest while forming F/OK ring
  // Phase 2 (0.38 - 0.60): Emphatic hold in front of upper chest with palm facing viewer and head nodding
  // Phase 3 (0.60 - 0.85): Smooth descent back toward hip
  // Phase 4 (0.85 - 1.00): Rest at hip before seamless repeat
  // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
  // UNKNOWN_SIGN_005 (Reference Video: MVI_5320.MOV, 2.0s, 25 FPS)
  // Phase 1 (0.00 - 0.20): Elevation from hip to chin/lower face
  // Phase 2 (0.20 - 0.40): Hold in front of chin with forward palm and subtle nod
  // Phase 3 (0.40 - 0.55): Descent back toward hip
  // Phase 4 (0.55 - 1.00): Rest at hip for remainder of cycle
  // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
  // UNKNOWN_SIGN_006 (Reference Video: MVI_5164.MOV, 3.32s, 25 FPS)
  // Two-hand dynamic gesture
  // Phase 1 (0.00 - 0.25): Right hand leads ascent to chest; left hand begins rising
  // Phase 2 (0.25 - 0.40): Left hand joins right hand in front of chest
  // Phase 3 (0.40 - 0.65): Synchronized bilateral chest interaction with slight nod
  // Phase 4 (0.65 - 0.85): Smooth bilateral descent back toward hips
  // Phase 5 (0.85 - 1.00): Bilateral rest beside hips
  // --------------------------------------------------------------------------
    // --------------------------------------------------------------------------
  // WET / WET_ASL (Double downward closing pulses with palms up)
  // Repetition 1:
  //   0.00 - 0.10: Hands elevate to high chest position, opening to PRESET_WET_OPEN (palms up)
  //   0.10 - 0.30: 1st downward motion + fingers closing to PRESET_WET_CLOSED
  //   0.30 - 0.42: Hands rise back up toward high chest, blooming open to PRESET_WET_OPEN
  // Repetition 2:
  //   0.42 - 0.65: 2nd downward motion + fingers closing to PRESET_WET_CLOSED
  //   0.65 - 0.78: Brief hold/settle at lower chest
  // Return:
  //   0.78 - 0.92: Hands smoothly descend back to hips
  //   0.92 - 1.00: Standby rest at hips
  // --------------------------------------------------------------------------
  if (resolved === "wet") {
    const cycleDuration = def.durationSeconds || 2.4;
    const c = (t % cycleDuration) / cycleDuration;

    // Resting arm poses beside body
    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.0, 0.0];

    const lArmRest: [number, number, number] = [-0.10, -0.05, 0.20];
    const lFARest:  [number, number, number] = [-0.15, -0.05, -0.05];
    const lWrRest:  [number, number, number] = [0.05, 0.0, 0.0];

    // 1. Starting Position (High Chest):
    // - Elbows bent comfortably near the body at chest level
    // - Wrists extended backward (Wrist Extension), palms facing up toward sky/face
    // - Hand: PRESET_WET_OPEN (ASL 5 open spread fingers, slightly curved)
    const rArmHigh: [number, number, number] = [-0.60, 0.08, -0.36];
    const rFAHigh:  [number, number, number] = [-1.42, 0.26, 0.18];
    const rWrHigh:  [number, number, number] = [-0.35, -0.20, 0.70];

    const lArmHigh: [number, number, number] = [-0.60, -0.08, 0.36];
    const lFAHigh:  [number, number, number] = [-1.42, -0.26, -0.18];
    const lWrHigh:  [number, number, number] = [-0.35, 0.20, -0.70];

    // 2. Downward Motion (Low Stomach / Flexion):
    // - Forearm and elbow slight extension (opening downward)
    // - Wrist flexion (palms tilting downward & inward)
    // - Right elbow draws right-to-left and left elbow draws left-to-right toward the stomach
    // - Hand: PRESET_WET_CLOSED (all fingertips meet thumb tip in chutki / water drop shape)
    const rArmLow:  [number, number, number] = [-0.45, 0.06, -0.16];
    const rFALow:   [number, number, number] = [-1.22, 0.20, 0.14];
    const rWrLow:   [number, number, number] = [0.35, -0.20, 0.35];

    const lArmLow:  [number, number, number] = [-0.45, -0.06, 0.16];
    const lFALow:   [number, number, number] = [-1.22, -0.20, -0.14];
    const lWrLow:   [number, number, number] = [0.35, 0.20, -0.35];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let lArmCur: [number, number, number];
    let lFACur:  [number, number, number];
    let lWrCur:  [number, number, number];

    let rHandCur: HandAnatomicalPose;
    let lHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.10) {
      // Starting Position: Smooth ascent to high chest with elbows near body, wrists extended upward, hands open spread 5
      const u = smoothstep(c / 0.10);
      rArmCur = lerpTuple3(rArmRest, rArmHigh, u);
      rFACur  = lerpTuple3(rFARest,  rFAHigh,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrHigh,  u);
      rHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_WET_OPEN, u);

      lArmCur = lerpTuple3(lArmRest, lArmHigh, u);
      lFACur  = lerpTuple3(lFARest,  lFAHigh,  u);
      lWrCur  = lerpTuple3(lWrRest,  lWrHigh,  u);
      lHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_WET_OPEN, u);
      headPitch = u * 0.02;
    } else if (c < 0.30) {
      // Repetition 1: Downward movement with elbow/forearm extension, wrist flexion, fingertips closing to thumb (chutki), elbows moving right-to-left and left-to-right toward stomach
      const u = smoothstep((c - 0.10) / 0.20);
      const phi1 = ((c - 0.10) / 0.20) * Math.PI * 2.0;
      const env1 = Math.sin(Math.PI * u);

      const medialSweep = Math.sin(Math.PI * u) * 0.05;
      const orbitPitch1 = -Math.cos(phi1) * 0.04 * env1;
      const orbitLat1   = Math.sin(phi1) * 0.03 * env1;

      rArmCur = lerpTuple3(rArmHigh, rArmLow, u);
      rArmCur[0] += orbitPitch1;
      rArmCur[2] += medialSweep - orbitLat1; // Right elbow moves right to left toward stomach

      lArmCur = lerpTuple3(lArmHigh, lArmLow, u);
      lArmCur[0] += orbitPitch1;
      lArmCur[2] += -medialSweep + orbitLat1; // Left elbow moves left to right toward stomach

      rFACur  = lerpTuple3(rFAHigh,  rFALow,  u);
      rFACur[0] -= Math.sin(phi1) * 0.02 * env1;

      lFACur  = lerpTuple3(lFAHigh,  lFALow,  u);
      lFACur[0] -= Math.sin(phi1) * 0.02 * env1;

      rWrCur  = lerpTuple3(rWrHigh,  rWrLow,  u); // Wrist flexes down (palms tilt down & inward)
      lWrCur  = lerpTuple3(lWrHigh,  lWrLow,  u);
      rHandCur = lerpHand(PRESET_WET_OPEN, PRESET_WET_CLOSED, u); // Fingers close into chutki
      lHandCur = lerpHand(PRESET_WET_OPEN, PRESET_WET_CLOSED, u);
      headPitch = 0.02 + u * 0.02;
    } else if (c < 0.42) {
      // Rebound/Rise back up to chest: wrists re-extend upward, fingers blossom open back to spread 5
      const u = smoothstep((c - 0.30) / 0.12);
      rArmCur = lerpTuple3(rArmLow, rArmHigh, u);
      rFACur  = lerpTuple3(rFALow,  rFAHigh,  u);
      rWrCur  = lerpTuple3(rWrLow,  rWrHigh,  u);
      rHandCur = lerpHand(PRESET_WET_CLOSED, PRESET_WET_OPEN, u);

      lArmCur = lerpTuple3(lArmLow, lArmHigh, u);
      lFACur  = lerpTuple3(lFALow,  lFAHigh,  u);
      lWrCur  = lerpTuple3(lWrLow,  lWrHigh,  u);
      lHandCur = lerpHand(PRESET_WET_CLOSED, PRESET_WET_OPEN, u);
      headPitch = 0.04 - u * 0.02;
    } else if (c < 0.65) {
      // Repetition 2: 2nd downward movement with wrist flexion and fingertips closing to thumb
      const u = smoothstep((c - 0.42) / 0.23);
      const phi2 = ((c - 0.42) / 0.23) * Math.PI * 2.0;
      const env2 = Math.sin(Math.PI * u);

      const medialSweep = Math.sin(Math.PI * u) * 0.05;
      const orbitPitch2 = -Math.cos(phi2) * 0.04 * env2;
      const orbitLat2   = Math.sin(phi2) * 0.03 * env2;

      rArmCur = lerpTuple3(rArmHigh, rArmLow, u);
      rArmCur[0] += orbitPitch2;
      rArmCur[2] += medialSweep - orbitLat2;

      lArmCur = lerpTuple3(lArmHigh, lArmLow, u);
      lArmCur[0] += orbitPitch2;
      lArmCur[2] += -medialSweep + orbitLat2;

      rFACur  = lerpTuple3(rFAHigh,  rFALow,  u);
      rFACur[0] -= Math.sin(phi2) * 0.02 * env2;

      lFACur  = lerpTuple3(lFAHigh,  lFALow,  u);
      lFACur[0] -= Math.sin(phi2) * 0.02 * env2;

      rWrCur  = lerpTuple3(rWrHigh,  rWrLow,  u); // Wrist flexes down again
      lWrCur  = lerpTuple3(lWrHigh,  lWrLow,  u);
      rHandCur = lerpHand(PRESET_WET_OPEN, PRESET_WET_CLOSED, u);
      lHandCur = lerpHand(PRESET_WET_OPEN, PRESET_WET_CLOSED, u);
      headPitch = 0.02 + u * 0.03;
    } else if (c < 0.78) {
      // Pause/settle at stomach level with closed chutki handshape and flexed wrists
      rArmCur = [...rArmLow];
      rFACur  = [...rFALow];
      rWrCur  = [...rWrLow];
      rHandCur = PRESET_WET_CLOSED;

      lArmCur = [...lArmLow];
      lFACur  = [...lFALow];
      lWrCur  = [...lWrLow];
      lHandCur = PRESET_WET_CLOSED;
      headPitch = 0.05;
    } else if (c < 0.92) {
      // Smooth descent back to hips
      const u = smoothstep((c - 0.78) / 0.14);
      rArmCur = lerpTuple3(rArmLow, rArmRest, u);
      rFACur  = lerpTuple3(rFALow,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrLow,  rWrRest,  u);
      rHandCur = lerpHand(PRESET_WET_CLOSED, PRESET_STANDBY_RELAXED, u);

      lArmCur = lerpTuple3(lArmLow, lArmRest, u);
      lFACur  = lerpTuple3(lFALow,  lFARest,  u);
      lWrCur  = lerpTuple3(lWrLow,  lWrRest,  u);
      lHandCur = lerpHand(PRESET_WET_CLOSED, PRESET_STANDBY_RELAXED, u);
      headPitch = 0.05 * (1.0 - u);
    } else {
      // Standby rest at hips
      rArmCur = [...rArmRest];
      rFACur  = [...rFARest];
      rWrCur  = [...rWrRest];
      rHandCur = PRESET_STANDBY_RELAXED;

      lArmCur = [...lArmRest];
      lFACur  = [...lFARest];
      lWrCur  = [...lWrRest];
      lHandCur = PRESET_STANDBY_RELAXED;
      headPitch = 0.0;
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm:  { arm: lArmCur, forearm: lFACur, wrist: lWrCur },
      rightHand: rHandCur,
      leftHand:  lHandCur,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(-0.45, 0.10, c < 0.10 ? c / 0.10 : (c < 0.78 ? 1.0 : (c < 0.92 ? 1.0 - (c - 0.78) / 0.14 : 0.0))),
      mouthSmile: 0.15,
    };
  }


  // --------------------------------------------------------------------------
  // MORE (Two-Handed Flattened-O / Chutki Fingertip Tapping on X-Axis)
  // --------------------------------------------------------------------------
  if (resolved === "more") {
    const cycleDuration = def.durationSeconds || 2.5;
    const c = (t % cycleDuration) / cycleDuration;

    // Resting arm poses beside body
    const rArmRest: [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:  [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.05, 0.0, 0.0];

    const lArmRest: [number, number, number] = [-0.10, -0.05, 0.20];
    const lFARest:  [number, number, number] = [-0.15, -0.05, -0.05];
    const lWrRest:  [number, number, number] = [0.05, 0.0, 0.0];

    // Apart Pose (Mid-air in front of chest, ~20cm separation on X-axis):
    // - Elbows bent on either side, hands floating mid-air
    // - Wrists in slight flexion so fingertips face each other
    const rArmApart: [number, number, number] = [-0.62, 0.20, -0.90];
    const rFAApart:  [number, number, number] = [-1.48, 0.25, 0.15];
    const rWrApart:  [number, number, number] = [0.15, -0.30, 0.15];

    const lArmApart: [number, number, number] = [-0.62, -0.20, 0.90];
    const lFAApart:  [number, number, number] = [-1.48, -0.25, -0.15];
    const lWrApart:  [number, number, number] = [0.15, 0.30, -0.15];

    // Contact Pose (Touch at midline along X-axis, Euclidean distance drops to 0):
    const rArmTouch: [number, number, number] = [-0.62, 0.20, -0.62];
    const rFATouch:  [number, number, number] = [-1.52, 0.48, 0.15];
    const rWrTouch:  [number, number, number] = [0.15, -0.30, 0.15];

    const lArmTouch: [number, number, number] = [-0.62, -0.20, 0.62];
    const lFATouch:  [number, number, number] = [-1.52, -0.48, -0.15];
    const lWrTouch:  [number, number, number] = [0.15, 0.30, -0.15];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let lArmCur: [number, number, number];
    let lFACur:  [number, number, number];
    let lWrCur:  [number, number, number];

    let rHandCur: HandAnatomicalPose;
    let lHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.18) {
      // Phase 1: Bilateral ascent into mid-air chest signing area in apart position
      const u = smoothstep(c / 0.18);
      rArmCur = lerpTuple3(rArmRest, rArmApart, u);
      rFACur  = lerpTuple3(rFARest,  rFAApart,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrApart,  u);
      rHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_FLATTENED_O, u);

      lArmCur = lerpTuple3(lArmRest, lArmApart, u);
      lFACur  = lerpTuple3(lFARest,  lFAApart,  u);
      lWrCur  = lerpTuple3(lWrRest,  lWrApart,  u);
      lHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_FLATTENED_O, u);
      headPitch = u * 0.03;
    } else if (c < 0.78) {
      // Phase 2: 3 Rhythmic Taps (Collisions) along X-axis
      // Time window 0.18 to 0.78 (duration 0.60, each tap is 0.20)
      const tWindow = c - 0.18;
      const uTap = (tWindow % 0.20) / 0.20;
      // Convergence pulse: at uTap=0.5, contactWeight=1.0 (touch), at 0 and 1, contactWeight=0 (apart)
      const contactWeight = Math.pow(Math.sin(uTap * Math.PI), 1.5);

      rArmCur = lerpTuple3(rArmApart, rArmTouch, contactWeight);
      rFACur  = lerpTuple3(rFAApart,  rFATouch,  contactWeight);
      rWrCur  = lerpTuple3(rWrApart,  rWrTouch,  contactWeight);

      lArmCur = lerpTuple3(lArmApart, lArmTouch, contactWeight);
      lFACur  = lerpTuple3(lFAApart,  lFATouch,  contactWeight);
      lWrCur  = lerpTuple3(lWrApart,  lWrTouch,  contactWeight);

      rHandCur = PRESET_FLATTENED_O;
      lHandCur = PRESET_FLATTENED_O;
      headPitch = 0.03 + contactWeight * 0.02; // Subtle affirmative nod on each tap
    } else if (c < 0.86) {
      // Phase 3: Brief settle together at midline
      rArmCur = [...rArmTouch];
      rFACur  = [...rFATouch];
      rWrCur  = [...rWrTouch];

      lArmCur = [...lArmTouch];
      lFACur  = [...lFATouch];
      lWrCur  = [...lWrTouch];

      rHandCur = PRESET_FLATTENED_O;
      lHandCur = PRESET_FLATTENED_O;
      headPitch = 0.04;
    } else {
      // Phase 4: Smooth descent back to hips
      const u = smoothstep((c - 0.86) / 0.14);
      rArmCur = lerpTuple3(rArmTouch, rArmRest, u);
      rFACur  = lerpTuple3(rFATouch,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrTouch,  rWrRest,  u);
      rHandCur = lerpHand(PRESET_FLATTENED_O, PRESET_STANDBY_RELAXED, u);

      lArmCur = lerpTuple3(lArmTouch, lArmRest, u);
      lFACur  = lerpTuple3(lFATouch,  lFARest,  u);
      lWrCur  = lerpTuple3(lWrTouch,  lWrRest,  u);
      lHandCur = lerpHand(PRESET_FLATTENED_O, PRESET_STANDBY_RELAXED, u);
      headPitch = 0.04 * (1.0 - u);
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm:  { arm: lArmCur, forearm: lFACur, wrist: lWrCur },
      rightHand: rHandCur,
      leftHand:  lHandCur,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: def.measurements.initialWristHeight,
      mouthSmile: 0.15,
    };
  }

  if (resolved === "unknown_sign_006") {
    const cycleDuration = def.durationSeconds || 3.32;
    const c = (t % cycleDuration) / cycleDuration;

    const rArmRest:   [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:    [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:    [number, number, number] = [0.05, 0.0, 0.0];

    const lArmRest:   [number, number, number] = [-0.10, -0.05, 0.20];
    const lFARest:    [number, number, number] = [-0.15, -0.05, -0.05];
    const lWrRest:    [number, number, number] = [0.05, 0.0, 0.0];

    const rArmChest:  [number, number, number] = [-0.55, 0.15, -0.70];
    const rFAChest:   [number, number, number] = [-1.40, 0.35, 0.15];
    const rWrChest:   [number, number, number] = [0.10, -0.20, -0.15];

    const lArmChest:  [number, number, number] = [-0.55, -0.15, 0.70];
    const lFAChest:   [number, number, number] = [-1.40, -0.35, -0.15];
    const lWrChest:   [number, number, number] = [0.10, 0.20, 0.15];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let lArmCur: [number, number, number];
    let lFACur:  [number, number, number];
    let lWrCur:  [number, number, number];

    let rHandCur: HandAnatomicalPose;
    let lHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.25) {
      // Phase 1: Right hand raises toward chest (left lags slightly)
      const uR = smoothstep(c / 0.25);
      const uL = smoothstep(Math.max(0, c - 0.10) / 0.15);
      rArmCur = lerpTuple3(rArmRest, rArmChest, uR);
      rFACur  = lerpTuple3(rFARest,  rFAChest,  uR);
      rWrCur  = lerpTuple3(rWrRest,  rWrChest,  uR);
      rHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_OPEN_FLAT_B, uR);

      lArmCur = lerpTuple3(lArmRest, lArmChest, uL);
      lFACur  = lerpTuple3(lFARest,  lFAChest,  uL);
      lWrCur  = lerpTuple3(lWrRest,  lWrChest,  uL);
      lHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_OPEN_FLAT_B, uL);
      headPitch = uR * 0.02;
    } else if (c < 0.40) {
      // Phase 2: Left hand completes ascent meeting right hand at chest
      const uL = smoothstep((c - 0.25) / 0.15);
      rArmCur = [...rArmChest];
      rFACur  = [...rFAChest];
      rWrCur  = [...rWrChest];
      rHandCur = PRESET_OPEN_FLAT_B;

      lArmCur = lerpTuple3(lerpTuple3(lArmRest, lArmChest, 0.5), lArmChest, uL);
      lFACur  = lerpTuple3(lerpTuple3(lFARest,  lFAChest,  0.5), lFAChest,  uL);
      lWrCur  = lerpTuple3(lerpTuple3(lWrRest,  lWrChest,  0.5), lWrChest,  uL);
      lHandCur = PRESET_OPEN_FLAT_B;
      headPitch = 0.02;
    } else if (c < 0.65) {
      // Phase 3: Bilateral interaction at chest with nod
      const pulse = Math.sin((c - 0.40) / 0.25 * Math.PI * 2) * 0.05;
      rArmCur = [rArmChest[0] + pulse, rArmChest[1], rArmChest[2]];
      rFACur  = [...rFAChest];
      rWrCur  = [...rWrChest];
      rHandCur = PRESET_OPEN_FLAT_B;

      lArmCur = [lArmChest[0] + pulse, lArmChest[1], lArmChest[2]];
      lFACur  = [...lFAChest];
      lWrCur  = [...lWrChest];
      lHandCur = PRESET_OPEN_FLAT_B;
      headPitch = 0.02 + Math.sin((c - 0.40) / 0.25 * Math.PI) * 0.04;
    } else if (c < 0.85) {
      // Phase 4: Bilateral descent back to hips
      const u = smoothstep((c - 0.65) / 0.20);
      rArmCur = lerpTuple3(rArmChest, rArmRest, u);
      rFACur  = lerpTuple3(rFAChest,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrChest,  rWrRest,  u);
      rHandCur = lerpHand(PRESET_OPEN_FLAT_B, PRESET_STANDBY_RELAXED, u);

      lArmCur = lerpTuple3(lArmChest, lArmRest, u);
      lFACur  = lerpTuple3(lFAChest,  lFARest,  u);
      lWrCur  = lerpTuple3(lWrChest,  lWrRest,  u);
      lHandCur = lerpHand(PRESET_OPEN_FLAT_B, PRESET_STANDBY_RELAXED, u);
      headPitch = 0.02 * (1.0 - u);
    } else {
      // Phase 5: Bilateral rest beside hips
      rArmCur = [...rArmRest];
      rFACur  = [...rFARest];
      rWrCur  = [...rWrRest];
      rHandCur = PRESET_STANDBY_RELAXED;

      lArmCur = [...lArmRest];
      lFACur  = [...lFARest];
      lWrCur  = [...lWrRest];
      lHandCur = PRESET_STANDBY_RELAXED;
      headPitch = 0.0;
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm:  { arm: lArmCur, forearm: lFACur, wrist: lWrCur },
      rightHand: rHandCur,
      leftHand:  lHandCur,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(-0.45, 0.15, c < 0.25 ? c / 0.25 : (c < 0.65 ? 1.0 : (c < 0.85 ? 1.0 - (c - 0.65) / 0.20 : 0.0))),
      mouthSmile: 0.25,
    };
  }


  if (resolved === "unknown_sign_005") {
    const cycleDuration = def.durationSeconds || 2.0;
    const c = (t % cycleDuration) / cycleDuration;

    const rArmRest:   [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:    [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:    [number, number, number] = [0.05, 0.0, 0.0];

    const rArmChin:   [number, number, number] = [-0.65, 0.12, -0.90];
    const rFAChin:    [number, number, number] = [-1.50, 0.40, 0.20];
    const rWrChin:    [number, number, number] = [0.15, -0.10, -0.20];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let rHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.20) {
      // Phase 1: Ascent to chin/face
      const u = smoothstep(c / 0.20);
      rArmCur = lerpTuple3(rArmRest, rArmChin, u);
      rFACur  = lerpTuple3(rFARest,  rFAChin,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrChin,  u);
      rHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_OPEN_FLAT_B, u);
      headPitch = u * 0.02;
    } else if (c < 0.40) {
      // Phase 2: Hold at chin with slight nod
      rArmCur = [...rArmChin];
      rFACur  = [...rFAChin];
      rWrCur  = [...rWrChin];
      rHandCur = PRESET_OPEN_FLAT_B;
      headPitch = 0.02 + Math.sin((c - 0.20) / 0.20 * Math.PI) * 0.04;
    } else if (c < 0.55) {
      // Phase 3: Descent back toward hip
      const u = smoothstep((c - 0.40) / 0.15);
      rArmCur = lerpTuple3(rArmChin, rArmRest, u);
      rFACur  = lerpTuple3(rFAChin,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrChin,  rWrRest,  u);
      rHandCur = lerpHand(PRESET_OPEN_FLAT_B, PRESET_STANDBY_RELAXED, u);
      headPitch = 0.02 * (1.0 - u);
    } else {
      // Phase 4: Standby rest at hip
      rArmCur = [...rArmRest];
      rFACur  = [...rFARest];
      rWrCur  = [...rWrRest];
      rHandCur = PRESET_STANDBY_RELAXED;
      headPitch = 0.0;
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(-0.45, 0.18, c < 0.20 ? c / 0.20 : (c < 0.40 ? 1.0 : (c < 0.55 ? 1.0 - (c - 0.40) / 0.15 : 0.0))),
      mouthSmile: 0.25,
    };
  }


  if (
    resolved === "unverified_001" ||
    resolved === "unverified_002" ||
    resolved === "unverified_003" ||
    resolved === "unverified_004"
  ) {
    const cycleDuration = def.durationSeconds || 2.36;
    const c = (t % cycleDuration) / cycleDuration;

    const rArmRest:   [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:    [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:    [number, number, number] = [0.05, 0.0, 0.0];

    const rArmChest:  [number, number, number] = [-0.60, 0.10, -0.85];
    const rFAChest:   [number, number, number] = [-1.45, 0.35, 0.15];
    const rWrChest:   [number, number, number] = [0.10, -0.15, -0.25];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let rHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.38) {
      // Phase 1: Ascent from hip to upper chest while forming F/OK handshape
      const u = smoothstep(c / 0.38);
      rArmCur = lerpTuple3(rArmRest, rArmChest, u);
      rFACur  = lerpTuple3(rFARest,  rFAChest,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrChest,  u);
      rHandCur = lerpHand(PRESET_STANDBY_RELAXED, PRESET_F_OK_HANDSHAPE, u);
      headPitch = u * 0.02;
    } else if (c < 0.60) {
      // Phase 2: Emphatic hold at upper chest with affirmative nod
      rArmCur = [...rArmChest];
      rFACur  = [...rFAChest];
      rWrCur  = [...rWrChest];
      rHandCur = PRESET_F_OK_HANDSHAPE;
      headPitch = 0.02 + Math.sin((c - 0.38) / 0.22 * Math.PI) * 0.04;
    } else if (c < 0.85) {
      // Phase 3: Smooth descent back toward hip
      const u = smoothstep((c - 0.60) / 0.25);
      rArmCur = lerpTuple3(rArmChest, rArmRest, u);
      rFACur  = lerpTuple3(rFAChest,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrChest,  rWrRest,  u);
      rHandCur = lerpHand(PRESET_F_OK_HANDSHAPE, PRESET_STANDBY_RELAXED, u);
      headPitch = 0.02 * (1.0 - u);
    } else {
      // Phase 4: Standby rest at hip
      rArmCur = [...rArmRest];
      rFACur  = [...rFARest];
      rWrCur  = [...rWrRest];
      rHandCur = PRESET_STANDBY_RELAXED;
      headPitch = 0.0;
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(-0.45, 0.15, c < 0.38 ? c / 0.38 : (c < 0.60 ? 1.0 : (1.0 - (c - 0.60) / 0.25))),
      mouthSmile: 0.30,
    };
  }


  if (resolved === "unknown_sign_001") {
    const cycleDuration = def.durationSeconds || 2.36;
    const c = (t % cycleDuration) / cycleDuration;

    const rArmRest:     [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:      [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:      [number, number, number] = [0.05, 0.0, 0.0];

    const rArmFace:     [number, number, number] = [-0.85, -0.25, -1.10];
    const rFAFace:      [number, number, number] = [-1.85, 0.75, 0.35];
    const rWrFace:      [number, number, number] = [0.20, -0.15, -0.30];

    const rArmForehead: [number, number, number] = [-1.05, -0.35, -1.30];
    const rFAForehead:  [number, number, number] = [-2.10, 0.95, 0.50];
    const rWrForehead:  [number, number, number] = [0.30, -0.20, -0.40];

    const rArmSweepOut: [number, number, number] = [-0.75, 0.20, -1.10];
    const rFASweepOut:  [number, number, number] = [-1.40, 0.55, 0.15];
    const rWrSweepOut:  [number, number, number] = [0.15, -0.10, -0.15];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let rHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.17) {
      // Phase 1 (0.0 - 0.4s): Raise from side toward face
      const u = smoothstep(c / 0.17);
      rArmCur = lerpTuple3(rArmRest, rArmFace, u);
      rFACur  = lerpTuple3(rFARest,  rFAFace,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrFace,  u);
      rHandCur = PRESET_PINCHED_EATING_MORSEL;
      headPitch = u * 0.02;
    } else if (c < 0.34) {
      // Phase 2 (0.4 - 0.8s): Move toward nose/eyes and upward toward forehead
      const u = smoothstep((c - 0.17) / 0.17);
      rArmCur = lerpTuple3(rArmFace, rArmForehead, u);
      rFACur  = lerpTuple3(rFAFace,  rFAForehead,  u);
      rWrCur  = lerpTuple3(rWrFace,  rWrForehead,  u);
      rHandCur = PRESET_PINCHED_EATING_MORSEL;
      headPitch = 0.02 + u * 0.02;
    } else if (c < 0.59) {
      // Phase 3 (0.8 - 1.4s): Dwell near forehead and temple, elbow bent
      rArmCur = [...rArmForehead];
      rFACur  = [...rFAForehead];
      rWrCur  = [...rWrForehead];
      rHandCur = PRESET_PINCHED_EATING_MORSEL;
      headPitch = 0.04;
    } else if (c < 0.80) {
      // Phase 4 (1.4 - 1.9s): Move outward and away from head, fingers blossom open
      const u = smoothstep((c - 0.59) / 0.21);
      rArmCur = lerpTuple3(rArmForehead, rArmSweepOut, u);
      rFACur  = lerpTuple3(rFAForehead,  rFASweepOut,  u);
      rWrCur  = lerpTuple3(rWrForehead,  rWrSweepOut,  u);
      rHandCur = lerpHand(PRESET_PINCHED_EATING_MORSEL, PRESET_OPEN_SPREAD_5, u);
      headPitch = 0.04 - u * 0.02;
    } else {
      // Phase 5 (1.9 - 2.36s): Lower back toward side of body
      const u = smoothstep((c - 0.80) / 0.20);
      rArmCur = lerpTuple3(rArmSweepOut, rArmRest, u);
      rFACur  = lerpTuple3(rFASweepOut,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrSweepOut,  rWrRest,  u);
      rHandCur = u > 0.5 ? PRESET_STANDBY_RELAXED : PRESET_OPEN_SPREAD_5;
      headPitch = 0.02 - u * 0.02;
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(-0.45, 0.20, c < 0.59 ? c / 0.59 : 1.0 - (c - 0.59) / 0.41),
      mouthSmile: 0.20,
    };
  }


  if (resolved === "young") {
    const cycleDuration = def.durationSeconds || 2.36;
    const c = (t % cycleDuration) / cycleDuration;

    // Keyframes from MVI_9504.MOV reference motion
    const rArmRest:     [number, number, number] = [-0.10, 0.05, -0.20];
    const rFARest:      [number, number, number] = [-0.15, 0.05, 0.05];
    const rWrRest:      [number, number, number] = [0.05, 0.0, 0.0];

    const rArmFace:     [number, number, number] = [-0.85, -0.25, -1.10];
    const rFAFace:      [number, number, number] = [-1.85, 0.75, 0.35];
    const rWrFace:      [number, number, number] = [0.20, -0.15, -0.30];

    const rArmForehead: [number, number, number] = [-1.05, -0.35, -1.30];
    const rFAForehead:  [number, number, number] = [-2.10, 0.95, 0.50];
    const rWrForehead:  [number, number, number] = [0.30, -0.20, -0.40];

    const rArmSweepOut: [number, number, number] = [-0.75, 0.20, -1.10];
    const rFASweepOut:  [number, number, number] = [-1.40, 0.55, 0.15];
    const rWrSweepOut:  [number, number, number] = [0.15, -0.10, -0.15];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let rHandCur: HandAnatomicalPose;
    let headPitch = 0.0;

    if (c < 0.17) {
      // Phase 1 (0.0 - 0.4s): Raise from side toward face
      const u = smoothstep(c / 0.17);
      rArmCur = lerpTuple3(rArmRest, rArmFace, u);
      rFACur  = lerpTuple3(rFARest,  rFAFace,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrFace,  u);
      rHandCur = PRESET_PINCHED_EATING_MORSEL;
      headPitch = u * 0.02;
    } else if (c < 0.34) {
      // Phase 2 (0.4 - 0.8s): Move toward nose/eyes and upward toward forehead
      const u = smoothstep((c - 0.17) / 0.17);
      rArmCur = lerpTuple3(rArmFace, rArmForehead, u);
      rFACur  = lerpTuple3(rFAFace,  rFAForehead,  u);
      rWrCur  = lerpTuple3(rWrFace,  rWrForehead,  u);
      rHandCur = PRESET_PINCHED_EATING_MORSEL;
      headPitch = 0.02 + u * 0.02;
    } else if (c < 0.59) {
      // Phase 3 (0.8 - 1.4s): Dwell near forehead and temple, elbow bent
      rArmCur = [...rArmForehead];
      rFACur  = [...rFAForehead];
      rWrCur  = [...rWrForehead];
      rHandCur = PRESET_PINCHED_EATING_MORSEL;
      headPitch = 0.04;
    } else if (c < 0.80) {
      // Phase 4 (1.4 - 1.9s): Move outward and away from head, fingers blossom open
      const u = smoothstep((c - 0.59) / 0.21);
      rArmCur = lerpTuple3(rArmForehead, rArmSweepOut, u);
      rFACur  = lerpTuple3(rFAForehead,  rFASweepOut,  u);
      rWrCur  = lerpTuple3(rWrForehead,  rWrSweepOut,  u);
      rHandCur = lerpHand(PRESET_PINCHED_EATING_MORSEL, PRESET_OPEN_SPREAD_5, u);
      headPitch = 0.04 - u * 0.02;
    } else {
      // Phase 5 (1.9 - 2.36s): Lower back toward side of body
      const u = smoothstep((c - 0.80) / 0.20);
      rArmCur = lerpTuple3(rArmSweepOut, rArmRest, u);
      rFACur  = lerpTuple3(rFASweepOut,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrSweepOut,  rWrRest,  u);
      rHandCur = u > 0.5 ? PRESET_STANDBY_RELAXED : PRESET_OPEN_SPREAD_5;
      headPitch = 0.02 - u * 0.02;
    }

    return {
      definition: def,
      phase: c,
      rightArm: { arm: rArmCur, forearm: rFACur, wrist: rWrCur },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.5, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(-0.45, 0.20, c < 0.59 ? c / 0.59 : 1.0 - (c - 0.59) / 0.41),
      mouthSmile: 0.35,
    };
  }

  if (resolved === "old") {
    const cycleDuration = def.durationSeconds || 3.2;
    const c = (t % cycleDuration) / cycleDuration;

    // Posture A: Eat start (low quadrant, pinched morsel)
    const rArmEatStart: [number, number, number] = [0.97, -0.80, 0.59];
    const rFAEatStart:  [number, number, number] = [-2.15, 0.10, -0.45];
    const rWrEatStart:  [number, number, number] = [0.04, 3.11, 0.19];

    // Posture B: Eat mouth touch (lips level, pinched morsel touching mouth)
    const rArmMouth: [number, number, number] = [-1.37, -0.45, -0.99];
    const rFAMouth:  [number, number, number] = [-1.95, 0.45, -0.65];
    const rWrMouth:  [number, number, number] = [-0.05, 3.11, 0.11];

    // Posture C: Behind the head (arm elevated, elbow flexed, hand positioned behind occiput / nape of neck)
    const rArmBehindHead: [number, number, number] = [-1.55, -0.25, -1.40];
    const rFABehindHead:  [number, number, number] = [-2.45, 0.90, 0.60];
    const rWrBehindHead:  [number, number, number] = [0.40, 0.25, -0.35];

    let rArmCur: [number, number, number];
    let rFACur:  [number, number, number];
    let rWrCur:  [number, number, number];
    let rHandCur = PRESET_PINCHED_EATING_MORSEL;
    let headPitch = 0.03;

    if (c < 0.25) {
      // Step 1: Raise pinched hand from low quadrant to mouth
      const u = smoothstep(c / 0.25);
      rArmCur = lerpTuple3(rArmEatStart, rArmMouth, u);
      rFACur  = lerpTuple3(rFAEatStart,  rFAMouth,  u);
      rWrCur  = lerpTuple3(rWrEatStart,  rWrMouth,  u);
      headPitch = 0.03 + u * 0.04;
    } else if (c < 0.50) {
      // Step 2: Dwell at mouth (performing full complete EAT sign)
      rArmCur = [...rArmMouth];
      rFACur  = [...rFAMouth];
      rWrCur  = [...rWrMouth];
      headPitch = 0.07;
    } else if (c < 0.80) {
      // Step 3: Move from mouth smoothly up and behind the head
      const u = smoothstep((c - 0.50) / 0.30);
      rArmCur = lerpTuple3(rArmMouth, rArmBehindHead, u);
      rFACur  = lerpTuple3(rFAMouth,  rFABehindHead,  u);
      rWrCur  = lerpTuple3(rWrMouth,  rWrBehindHead,  u);
      // Hand gradually opens from pinched to relaxed palm behind head
      if (u > 0.5) {
        rHandCur = PRESET_STANDBY_RELAXED;
      }
      headPitch = 0.07 - u * 0.04;
    } else {
      // Step 4: Dwell behind head briefly, then descend smoothly
      const u = smoothstep((c - 0.80) / 0.20);
      rArmCur = lerpTuple3(rArmBehindHead, rArmEatStart, u);
      rFACur  = lerpTuple3(rFABehindHead,  rFAEatStart,  u);
      rWrCur  = lerpTuple3(rWrBehindHead,  rWrEatStart,  u);
      rHandCur = u > 0.6 ? PRESET_PINCHED_EATING_MORSEL : PRESET_STANDBY_RELAXED;
      headPitch = 0.03;
    }

    return {
      definition: def,
      phase: c,
      rightArm: {
        arm: rArmCur,
        forearm: rFACur,
        wrist: rWrCur,
      },
      leftArm: NEUTRAL_REST_ARM_LEFT,
      rightHand: rHandCur,
      leftHand: PRESET_STANDBY_RELAXED,
      head: [headPitch, 0.0, 0.0],
      neck: [headPitch * 0.6, 0.0, 0.0],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: 0.30,
      mouthSmile: 0.0,
    };
  }

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
  // UGLY (Exact match to uploaded AI4Bharat INCLUDE Adjectives Dataset MVI_9576 & MVI_9844):
  // 1. Left arm rests naturally straight down at side throughout entire sign.
  // 2. Right hand rises smoothly from neutral rest up to lower face / chin / mouth level,
  //    curved in front of the mouth.
  // 3. Right hand sweeps horizontally outward to the right away from the face,
  //    releasing/spreading fingers in rejection.
  // 4. Head turns away to the left with an unmistakable expression of distaste/grimace.
  // 5. Right hand drops smoothly back down to neutral rest.
  // --------------------------------------------------------------------------
  if (resolved === "ugly") {
    const cycle = def.durationSeconds || 2.6;
    const c = (t % cycle) / cycle;

    // Resting right arm hanging naturally at the side
    const rArmRest: [number, number, number] = [0.05, 0.05, -1.28];
    const rFARest:  [number, number, number] = [-0.22, 0.05, 0.05];
    const rWrRest:  [number, number, number] = [0.10, 0.00, -0.05];

    // Right hand held directly in front of the chin / mouth (covering lower face)
    const rArmFace: [number, number, number] = [-1.45, -0.45, -0.85];
    const rFAFace:  [number, number, number] = [-1.88, 0.42, -0.40];
    const rWrFace:  [number, number, number] = [-0.35, 1.65, -0.25];

    // Right hand swept outward to the right into space away from the face
    const rArmPull: [number, number, number] = [-0.65, -0.15, -1.45];
    const rFAPull:  [number, number, number] = [-1.15, 0.28, 0.12];
    const rWrPull:  [number, number, number] = [0.15, 0.12, -0.10];

    let rArmCur: number[], rFACur: number[], rWrCur: number[];
    let curPhase = 0.0;
    let headYaw = 0.0;
    let headPitch = 0.0;
    let smileVal = -0.40;

    if (c < 0.28) {
      // Phase 1: Hand rises smoothly from side up to chin/mouth
      const u = smoothstep(c / 0.28);
      rArmCur = lerpTuple3(rArmRest, rArmFace, u);
      rFACur  = lerpTuple3(rFARest,  rFAFace,  u);
      rWrCur  = lerpTuple3(rWrRest,  rWrFace,  u);
      curPhase = u * 0.35;
      headYaw = 0.0;
      headPitch = u * 0.04;
      smileVal = -0.10 - u * 0.25;
    } else if (c < 0.42) {
      // Phase 2: Dwell at chin/mouth covering lower face
      rArmCur = [...rArmFace];
      rFACur  = [...rFAFace];
      rWrCur  = [...rWrFace];
      curPhase = 0.35;
      headYaw = 0.0;
      headPitch = 0.04;
      smileVal = -0.35;
    } else if (c < 0.72) {
      // Phase 3: Sharp outward sweep to right, fingers flicking open, head turns away in distaste
      const u = smoothstep((c - 0.42) / 0.30);
      rArmCur = lerpTuple3(rArmFace, rArmPull, u);
      rFACur  = lerpTuple3(rFAFace,  rFAPull,  u);
      rWrCur  = lerpTuple3(rWrFace,  rWrPull,  u);
      curPhase = 0.35 + u * 0.50;
      headYaw = -u * 0.26; // Head turns away to left
      headPitch = 0.04 - u * 0.02;
      smileVal = -0.35 - u * 0.25;
    } else if (c < 0.85) {
      // Phase 4: Hold repelled/rejected pose
      rArmCur = [...rArmPull];
      rFACur  = [...rFAPull];
      rWrCur  = [...rWrPull];
      curPhase = 0.85;
      headYaw = -0.26;
      headPitch = 0.02;
      smileVal = -0.60;
    } else {
      // Phase 5: Return to neutral rest
      const u = smoothstep((c - 0.85) / 0.15);
      rArmCur = lerpTuple3(rArmPull, rArmRest, u);
      rFACur  = lerpTuple3(rFAPull,  rFARest,  u);
      rWrCur  = lerpTuple3(rWrPull,  rWrRest,  u);
      curPhase = 0.85 + u * 0.15;
      headYaw = -0.26 * (1.0 - u);
      headPitch = 0.02 * (1.0 - u);
      smileVal = -0.60 * (1.0 - u);
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
      head: [0.06 + headPitch, headYaw, -0.04],
      neck: [0.03 + headPitch * 0.5, headYaw * 0.5, -0.02],
      spine: [0.0, 0.0, 0.0],
      currentWristHeight: lerp(def.measurements.initialWristHeight, def.measurements.finalWristHeight, curPhase),
      mouthSmile: smileVal,
    };
  }

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
