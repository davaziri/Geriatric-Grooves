import type { Difficulty, Equipment, EnvironmentTag, BodyFocus } from "@geriatric-grooves/shared";

// Plain-language labels so numbers are never the only signal of difficulty
// (also satisfies "never convey information by color alone").
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Gentle",
  2: "Easy",
  3: "Moderate",
  4: "Challenging",
  5: "Advanced",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  none: "No equipment",
  resistance_band: "Resistance band",
  chair: "Chair",
  wall: "Wall",
  stairs: "Stairs",
  light_weights: "Light weights",
};

export const ENVIRONMENT_LABELS: Record<EnvironmentTag, string> = {
  open_floor: "Open floor space",
  has_stairs: "Staircase",
  has_chair: "Chair nearby",
  has_railing: "Railing",
  small_space: "Small space friendly",
};

export const BODY_FOCUS_LABELS: Record<BodyFocus, string> = {
  balance: "Balance",
  lower_body: "Lower body",
  upper_body: "Upper body",
  core: "Core",
  full_flexibility: "Flexibility",
};
