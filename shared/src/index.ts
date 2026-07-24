// Shared types used by both frontend and backend.
// Keep enum-like values as `as const` arrays so they can be validated at runtime,
// not just checked at compile time (SQLite has no native enum type).

export const EQUIPMENT_OPTIONS = [
  "none",
  "resistance_band",
  "chair",
  "wall",
  "stairs",
  "light_weights",
] as const;
export type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

export const ENVIRONMENT_TAGS = [
  "open_floor",
  "has_stairs",
  "has_chair",
  "has_railing",
  "small_space",
] as const;
export type EnvironmentTag = (typeof ENVIRONMENT_TAGS)[number];

export const BODY_FOCUS_OPTIONS = [
  "balance",
  "lower_body",
  "upper_body",
  "core",
  "full_flexibility",
] as const;
export type BodyFocus = (typeof BODY_FOCUS_OPTIONS)[number];

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];

export const FONT_SIZE_OPTIONS = ["large", "extra_large"] as const;
export type FontSize = (typeof FONT_SIZE_OPTIONS)[number];

export interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  durationEstimateSeconds: number;
  equipmentRequired: Equipment[];
  environmentTags: EnvironmentTag[];
  bodyFocus: BodyFocus[];
  modifications: string;
  cautions: string | null;
  demoMediaUrl: string | null;
}

export interface AccessibilityPrefs {
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  mobilityLevel: Difficulty;
  equipmentOwned: Equipment[];
  knownEnvironmentFeatures: EnvironmentTag[];
  accessibilityPrefs: AccessibilityPrefs;
  streakCount: number;
  longestStreak: number;
  streakFreezesAvailable: number;
  xpTotal: number;
  unlockedCosmetics: string[];
  onboardingCompleted: boolean;
  notificationsEnabled: boolean;
  reminderTime: string | null; // "HH:MM"
  createdAt: string;
}

export interface SessionLog {
  id: string;
  userId: string;
  date: string;
  exercisesCompleted: string[];
  selfReportedDifficulty: Difficulty | null;
  notes: string | null;
}

export interface ExerciseFilters {
  difficulty?: Difficulty;
  equipment?: Equipment;
}

export interface DailyRoutine {
  date: string;
  exercises: Exercise[];
}

// Gamification constants. Shared so the backend (which decides unlocks) and
// frontend (which displays them) never drift out of sync on names/emoji.
export const XP_PER_EXERCISE = 10;
export const MAX_STREAK_FREEZES = 2;

export interface StreakMilestone {
  days: number;
  cosmeticId: string;
  name: string;
  emoji: string;
}

// Deliberately just the three the product spec calls out — not a long
// grind ladder. This is a habit-support tool, not a game to optimize.
export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, cosmeticId: "sprout_3day", name: "New Sprout", emoji: "🌿" },
  { days: 7, cosmeticId: "bloom_7day", name: "First Bloom", emoji: "🌸" },
  { days: 30, cosmeticId: "garden_30day", name: "Full Garden", emoji: "🌳" },
];

export const BASE_AVATAR_EMOJI = "🌱";

export interface CompleteExerciseResult {
  profile: UserProfile;
  xpAwarded: number;
  usedStreakFreeze: boolean;
  newlyUnlockedCosmetics: string[];
  alreadyCompleted: boolean;
}

export interface TodaySessionStatus {
  date: string;
  exercisesCompleted: string[];
}

export interface RecentSessionDates {
  dates: string[];
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const DEFAULT_REMINDER_TIME = "09:00";

// Environment scan (Milestone 5). Raw yes/no detections from the vision
// model — kept flat and literal (not pre-mapped to Equipment/EnvironmentTag)
// so the confirmation screen can show/correct exactly what was "seen",
// per the spec's "I see: a staircase, a chair. Is that right?" requirement.
export interface ScanDetectionResult {
  stairs: boolean;
  chair: boolean;
  railing: boolean;
  resistance_band: boolean;
  open_floor: boolean;
  wall_space: boolean;
  light_weights: boolean;
  small_space: boolean;
}

export interface ScanAnalyzeResult {
  detection: ScanDetectionResult;
}

export interface ScanConfirmPayload {
  detection: ScanDetectionResult;
  savePhoto: boolean;
  imageDataUrl?: string;
}
