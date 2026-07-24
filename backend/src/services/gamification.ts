import { MAX_STREAK_FREEZES, STREAK_MILESTONES } from "@geriatric-grooves/shared";

export interface StreakState {
  streakCount: number;
  longestStreak: number;
  streakFreezesAvailable: number;
  unlockedCosmetics: string[];
  lastCompletedDate: string | null; // YYYY-MM-DD
  freezeRefillMonth: string | null; // YYYY-MM
}

export interface StreakUpdateResult extends StreakState {
  usedStreakFreeze: boolean;
  newlyUnlockedCosmetics: string[];
}

function daysBetween(earlier: string, later: string): number {
  const a = new Date(`${earlier}T00:00:00Z`).getTime();
  const b = new Date(`${later}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86_400_000);
}

// Called once, on the first exercise completed in a given day. Missing a
// single day never wipes the streak outright — a streak freeze (refilled
// monthly, capped at MAX_STREAK_FREEZES) silently bridges a one-day gap.
// This is the "biggest risk is quitting after one bad day" design from the
// product brief, not a bug that lets streaks run forever unchecked: a gap
// of two or more days still resets it.
export function applyDailyCompletion(state: StreakState, today: string): StreakUpdateResult {
  const currentMonth = today.slice(0, 7);
  let streakFreezesAvailable = state.streakFreezesAvailable;
  let freezeRefillMonth = state.freezeRefillMonth;

  if (freezeRefillMonth !== currentMonth) {
    streakFreezesAvailable = MAX_STREAK_FREEZES;
    freezeRefillMonth = currentMonth;
  }

  let streakCount = state.streakCount;
  let usedStreakFreeze = false;

  if (!state.lastCompletedDate) {
    streakCount = 1;
  } else {
    const gap = daysBetween(state.lastCompletedDate, today);
    if (gap <= 0) {
      // Already have a completion logged for today; leave the streak as-is.
    } else if (gap === 1) {
      streakCount += 1;
    } else if (gap === 2 && streakFreezesAvailable > 0) {
      streakFreezesAvailable -= 1;
      streakCount += 1;
      usedStreakFreeze = true;
    } else {
      streakCount = 1;
    }
  }

  const longestStreak = Math.max(state.longestStreak, streakCount);

  const unlockedCosmetics = [...state.unlockedCosmetics];
  const newlyUnlockedCosmetics: string[] = [];
  for (const milestone of STREAK_MILESTONES) {
    if (streakCount >= milestone.days && !unlockedCosmetics.includes(milestone.cosmeticId)) {
      unlockedCosmetics.push(milestone.cosmeticId);
      newlyUnlockedCosmetics.push(milestone.cosmeticId);
    }
  }

  return {
    streakCount,
    longestStreak,
    streakFreezesAvailable,
    unlockedCosmetics,
    lastCompletedDate: today,
    freezeRefillMonth,
    usedStreakFreeze,
    newlyUnlockedCosmetics,
  };
}
