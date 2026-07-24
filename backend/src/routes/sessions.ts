import { Router } from "express";
import { z } from "zod";
import { XP_PER_EXERCISE } from "@geriatric-grooves/shared";
import { prisma } from "../db/client.js";
import { requireAuth } from "../middleware/session.js";
import { toUserProfile } from "../db/mappers.js";
import { applyDailyCompletion } from "../services/gamification.js";

export const sessionsRouter = Router();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function todayDate(): Date {
  return new Date(`${todayKey()}T00:00:00.000Z`);
}

function parseCompleted(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

sessionsRouter.get("/today", requireAuth, async (req, res) => {
  const log = await prisma.sessionLog.findFirst({ where: { userId: req.userId, date: todayDate() } });
  res.json({ date: todayKey(), exercisesCompleted: log ? parseCompleted(log.exercisesCompleted) : [] });
});

sessionsRouter.get("/recent", requireAuth, async (req, res) => {
  const days = Math.min(60, Math.max(7, Number(req.query.days) || 35));
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  since.setUTCHours(0, 0, 0, 0);

  const logs = await prisma.sessionLog.findMany({
    where: { userId: req.userId, date: { gte: since } },
    orderBy: { date: "asc" },
  });
  const dates = logs
    .filter((log) => parseCompleted(log.exercisesCompleted).length > 0)
    .map((log) => log.date.toISOString().slice(0, 10));

  res.json({ dates });
});

const completeSchema = z.object({ exerciseId: z.string().min(1) });

sessionsRouter.post("/complete-exercise", requireAuth, async (req, res) => {
  const parsed = completeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing exercise id." });
    return;
  }
  const { exerciseId } = parsed.data;

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) {
    res.status(404).json({ error: "Exercise not found." });
    return;
  }

  const profileRow = await prisma.userProfile.findUnique({ where: { id: req.userId } });
  if (!profileRow) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }

  const existingLog = await prisma.sessionLog.findFirst({ where: { userId: req.userId, date: todayDate() } });
  const completedSoFar = existingLog ? parseCompleted(existingLog.exercisesCompleted) : [];

  if (completedSoFar.includes(exerciseId)) {
    res.json({
      profile: toUserProfile(profileRow),
      xpAwarded: 0,
      usedStreakFreeze: false,
      newlyUnlockedCosmetics: [],
      alreadyCompleted: true,
    });
    return;
  }

  const isFirstCompletionToday = completedSoFar.length === 0;
  const today = todayKey();

  const streakUpdate = isFirstCompletionToday
    ? applyDailyCompletion(
        {
          streakCount: profileRow.streakCount,
          longestStreak: profileRow.longestStreak,
          streakFreezesAvailable: profileRow.streakFreezesAvailable,
          unlockedCosmetics: parseCompleted(profileRow.unlockedCosmetics),
          lastCompletedDate: profileRow.lastCompletedDate,
          freezeRefillMonth: profileRow.freezeRefillMonth,
        },
        today,
      )
    : null;

  const updatedProfile = await prisma.userProfile.update({
    where: { id: req.userId },
    data: {
      xpTotal: profileRow.xpTotal + XP_PER_EXERCISE,
      ...(streakUpdate
        ? {
            streakCount: streakUpdate.streakCount,
            longestStreak: streakUpdate.longestStreak,
            streakFreezesAvailable: streakUpdate.streakFreezesAvailable,
            unlockedCosmetics: JSON.stringify(streakUpdate.unlockedCosmetics),
            lastCompletedDate: streakUpdate.lastCompletedDate,
            freezeRefillMonth: streakUpdate.freezeRefillMonth,
          }
        : {}),
    },
  });

  if (existingLog) {
    await prisma.sessionLog.update({
      where: { id: existingLog.id },
      data: { exercisesCompleted: JSON.stringify([...completedSoFar, exerciseId]) },
    });
  } else {
    await prisma.sessionLog.create({
      data: { userId: req.userId!, date: todayDate(), exercisesCompleted: JSON.stringify([exerciseId]) },
    });
  }

  res.json({
    profile: toUserProfile(updatedProfile),
    xpAwarded: XP_PER_EXERCISE,
    usedStreakFreeze: streakUpdate?.usedStreakFreeze ?? false,
    newlyUnlockedCosmetics: streakUpdate?.newlyUnlockedCosmetics ?? [],
    alreadyCompleted: false,
  });
});
