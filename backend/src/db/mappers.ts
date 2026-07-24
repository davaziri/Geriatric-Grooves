import type { Exercise as PrismaExercise, UserProfile as PrismaUserProfile, SessionLog as PrismaSessionLog } from "@prisma/client";
import type { Exercise, UserProfile, SessionLog, Equipment, EnvironmentTag, BodyFocus, Difficulty } from "@geriatric-grooves/shared";

function parseJsonArray<T>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toExercise(row: PrismaExercise): Exercise {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    difficulty: row.difficulty as Difficulty,
    durationEstimateSeconds: row.durationEstimateSeconds,
    equipmentRequired: parseJsonArray<Equipment>(row.equipmentRequired),
    environmentTags: parseJsonArray<EnvironmentTag>(row.environmentTags),
    bodyFocus: parseJsonArray<BodyFocus>(row.bodyFocus),
    modifications: row.modifications,
    cautions: row.cautions,
    demoMediaUrl: row.demoMediaUrl,
  };
}

export function toUserProfile(row: PrismaUserProfile): UserProfile {
  return {
    id: row.id,
    email: row.email,
    mobilityLevel: row.mobilityLevel as Difficulty,
    equipmentOwned: parseJsonArray<Equipment>(row.equipmentOwned),
    knownEnvironmentFeatures: parseJsonArray<EnvironmentTag>(row.knownEnvironmentFeatures),
    accessibilityPrefs: {
      fontSize: row.fontSize as UserProfile["accessibilityPrefs"]["fontSize"],
      highContrast: row.highContrast,
      reduceMotion: row.reduceMotion,
    },
    streakCount: row.streakCount,
    longestStreak: row.longestStreak,
    streakFreezesAvailable: row.streakFreezesAvailable,
    xpTotal: row.xpTotal,
    unlockedCosmetics: parseJsonArray<string>(row.unlockedCosmetics),
    onboardingCompleted: row.onboardingCompleted,
    notificationsEnabled: row.notificationsEnabled,
    reminderTime: row.reminderTime,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toSessionLog(row: PrismaSessionLog): SessionLog {
  return {
    id: row.id,
    userId: row.userId,
    date: row.date.toISOString(),
    exercisesCompleted: parseJsonArray<string>(row.exercisesCompleted),
    selfReportedDifficulty: row.selfReportedDifficulty as Difficulty | null,
    notes: row.notes,
  };
}
