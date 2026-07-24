import type { BodyFocus, Difficulty, EnvironmentTag, Equipment, Exercise } from "@geriatric-grooves/shared";

const ROUTINE_MIN = 4;
const ROUTINE_MAX = 6;

// Stairs and railings are the only environment tags that represent a real
// physical requirement (you either have a staircase or you don't). The
// other tags (open_floor, has_chair, small_space) describe spaces most
// homes have some version of, so they're informational rather than a hard
// gate — requiring an exact match on those would wrongly exclude simple
// seated stretches for anyone who didn't check every box in onboarding.
const HARD_ENVIRONMENT_TAGS: EnvironmentTag[] = ["has_stairs", "has_railing"];

export interface RoutineProfile {
  id: string;
  mobilityLevel: Difficulty;
  equipmentOwned: Equipment[];
  knownEnvironmentFeatures: EnvironmentTag[];
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

// Deterministic PRNG so "today's" routine is stable across reloads but
// changes day to day, without needing to persist a chosen routine.
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function hasRequiredEquipment(exercise: Exercise, owned: Equipment[]): boolean {
  return exercise.equipmentRequired.every((item) => item === "none" || owned.includes(item));
}

function hasRequiredEnvironment(exercise: Exercise, known: EnvironmentTag[]): boolean {
  return exercise.environmentTags
    .filter((tag) => HARD_ENVIRONMENT_TAGS.includes(tag))
    .every((tag) => known.includes(tag));
}

function candidatePool(
  exercises: Exercise[],
  profile: RoutineProfile,
  maxDifficulty: number,
  requireEnvironment: boolean,
): Exercise[] {
  return exercises.filter(
    (exercise) =>
      exercise.difficulty <= maxDifficulty &&
      hasRequiredEquipment(exercise, profile.equipmentOwned) &&
      (requireEnvironment ? hasRequiredEnvironment(exercise, profile.knownEnvironmentFeatures) : true),
  );
}

// Widens the pool step by step (higher difficulty ceiling, then dropping the
// environment requirement, then bodyweight-only as a last resort) so a
// sparse equipment/space profile never leaves someone with nothing to do.
function buildPool(exercises: Exercise[], profile: RoutineProfile): Exercise[] {
  let pool = candidatePool(exercises, profile, profile.mobilityLevel, true);
  if (pool.length < ROUTINE_MIN) {
    pool = candidatePool(exercises, profile, Math.min(profile.mobilityLevel + 1, 5), true);
  }
  if (pool.length < ROUTINE_MIN) {
    pool = candidatePool(exercises, profile, profile.mobilityLevel, false);
  }
  if (pool.length < ROUTINE_MIN) {
    pool = exercises.filter((exercise) => exercise.equipmentRequired.every((item) => item === "none"));
  }
  return pool;
}

export function generateDailyRoutine(exercises: Exercise[], profile: RoutineProfile, dateKey: string): Exercise[] {
  const pool = buildPool(exercises, profile);
  if (pool.length === 0) return [];

  const rng = mulberry32(hashSeed(`${profile.id}:${dateKey}`));
  const shuffled = seededShuffle(pool, rng);
  const targetCount = Math.min(ROUTINE_MAX, shuffled.length);

  const selected: Exercise[] = [];
  const coveredFocus = new Set<BodyFocus>();

  // Pass 1: prioritize covering a different body-focus area with each pick,
  // so a routine touches balance/strength/flexibility rather than one area.
  for (const exercise of shuffled) {
    if (selected.length >= targetCount) break;
    if (exercise.bodyFocus.some((focus) => !coveredFocus.has(focus))) {
      selected.push(exercise);
      exercise.bodyFocus.forEach((focus) => coveredFocus.add(focus));
    }
  }

  // Pass 2: fill any remaining slots regardless of focus overlap.
  for (const exercise of shuffled) {
    if (selected.length >= targetCount) break;
    if (!selected.includes(exercise)) selected.push(exercise);
  }

  return selected;
}
