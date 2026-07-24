import type { ScanDetectionResult } from "@geriatric-grooves/shared";

export const SCAN_DETECTION_LABELS: Record<keyof ScanDetectionResult, string> = {
  stairs: "A staircase",
  chair: "A sturdy chair",
  railing: "A railing or handrail",
  resistance_band: "A resistance band",
  open_floor: "Open floor space",
  wall_space: "Open wall space",
  light_weights: "Light hand weights",
  small_space: "A small or tight space",
};

export const SCAN_DETECTION_KEYS = Object.keys(SCAN_DETECTION_LABELS) as (keyof ScanDetectionResult)[];
