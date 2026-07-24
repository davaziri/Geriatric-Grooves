import { Router } from "express";
import { prisma } from "../db/client.js";
import { requireAuth } from "../middleware/session.js";
import { toExercise, toUserProfile } from "../db/mappers.js";
import { generateDailyRoutine } from "../services/routineGenerator.js";

export const routineRouter = Router();

routineRouter.get("/today", requireAuth, async (req, res) => {
  const profileRow = await prisma.userProfile.findUnique({ where: { id: req.userId } });
  if (!profileRow) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const profile = toUserProfile(profileRow);

  const exerciseRows = await prisma.exercise.findMany();
  const exercises = exerciseRows.map(toExercise);

  const dateKey = new Date().toISOString().slice(0, 10);
  const routineExercises = generateDailyRoutine(
    exercises,
    {
      id: profile.id,
      mobilityLevel: profile.mobilityLevel,
      equipmentOwned: profile.equipmentOwned,
      knownEnvironmentFeatures: profile.knownEnvironmentFeatures,
    },
    dateKey,
  );

  res.json({ date: dateKey, exercises: routineExercises });
});
