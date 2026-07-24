import { Router } from "express";
import { prisma } from "../db/client.js";
import { toExercise } from "../db/mappers.js";
import type { Equipment } from "@geriatric-grooves/shared";

export const exercisesRouter = Router();

// The library is small (a few dozen rows), so filtering after mapping to the
// shared type in JS is simpler and less fragile than querying the
// JSON-encoded text columns with SQL LIKE clauses.
exercisesRouter.get("/", async (req, res) => {
  const rows = await prisma.exercise.findMany({ orderBy: { difficulty: "asc" } });
  let exercises = rows.map(toExercise);

  const difficultyParam = req.query.difficulty;
  if (typeof difficultyParam === "string" && difficultyParam.length > 0) {
    const difficulty = Number(difficultyParam);
    if (Number.isInteger(difficulty)) {
      exercises = exercises.filter((exercise) => exercise.difficulty === difficulty);
    }
  }

  const equipmentParam = req.query.equipment;
  if (typeof equipmentParam === "string" && equipmentParam.length > 0) {
    const equipment = equipmentParam as Equipment;
    exercises = exercises.filter((exercise) => exercise.equipmentRequired.includes(equipment));
  }

  res.json({ exercises });
});

exercisesRouter.get("/:id", async (req, res) => {
  const row = await prisma.exercise.findUnique({ where: { id: req.params.id } });
  if (!row) {
    res.status(404).json({ error: "Exercise not found." });
    return;
  }
  res.json({ exercise: toExercise(row) });
});
