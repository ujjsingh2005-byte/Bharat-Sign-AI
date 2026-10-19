/**
 * Bone name mapping from legacy Mixamo-style keys (used by the animation logic)
 * to the actual bone names present in the blue‑jacket GLB model.
 *
 * The avatar model contains only high‑level body parts (e.g. Wolf3D_Body,
 * Wolf3D_Head). Fine‑grained bones such as fingers or hands are absent. For
 * those missing bones we deliberately leave the mapping undefined – the
 * animation code will treat the bone as unavailable and perform a no‑op.
 */
export const BONE_MAP: Record<string, string> = {
  // Torso and head
  spine: "Wolf3D_Body",
  spine1: "Wolf3D_Body",
  neck: "Wolf3D_Head",
  head: "Wolf3D_Head",

  // Arms – the model does not have distinct arm bones, map to body as fallback
  rightshoulder: "Wolf3D_Body",
  rightarm: "Wolf3D_Body",
  rightforearm: "Wolf3D_Body",
  righthand: "Wolf3D_Body",
  leftshoulder: "Wolf3D_Body",
  leftarm: "Wolf3D_Body",
  leftforearm: "Wolf3D_Body",
  lefthand: "Wolf3D_Body",

  // Hands/fingers – absent, map to undefined (implicit)
  // e.g., righthandthumb1, lefthandindex2, etc., will not be found.
};
