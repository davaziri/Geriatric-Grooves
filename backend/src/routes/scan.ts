import { Router } from "express";
import { z } from "zod";
import type { Equipment, EnvironmentTag } from "@geriatric-grooves/shared";
import { prisma } from "../db/client.js";
import { requireAuth } from "../middleware/session.js";
import { toUserProfile } from "../db/mappers.js";
import { analyzeEnvironmentPhoto } from "../services/visionScan.js";

export const scanRouter = Router();

const analyzeSchema = z.object({ imageDataUrl: z.string().min(1) });

// Analyzes the photo and returns the detection only — nothing is persisted
// here. The photo only gets stored later, in /confirm, and only if the user
// explicitly opts in.
scanRouter.post("/analyze", requireAuth, async (req, res) => {
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing photo." });
    return;
  }
  try {
    const detection = await analyzeEnvironmentPhoto(parsed.data.imageDataUrl);
    res.json({ detection });
  } catch (error) {
    console.error("Environment scan failed:", error);
    res.status(502).json({ error: "We couldn't analyze that photo. Please try again." });
  }
});

const detectionSchema = z.object({
  stairs: z.boolean(),
  chair: z.boolean(),
  railing: z.boolean(),
  resistance_band: z.boolean(),
  open_floor: z.boolean(),
  wall_space: z.boolean(),
  light_weights: z.boolean(),
  small_space: z.boolean(),
});

const confirmSchema = z.object({
  detection: detectionSchema,
  savePhoto: z.boolean(),
  imageDataUrl: z.string().optional(),
});

function mapDetectionToTags(detection: z.infer<typeof detectionSchema>): {
  equipment: Equipment[];
  environment: EnvironmentTag[];
} {
  const equipment: Equipment[] = [];
  if (detection.chair) equipment.push("chair");
  if (detection.resistance_band) equipment.push("resistance_band");
  if (detection.wall_space) equipment.push("wall");
  if (detection.stairs) equipment.push("stairs");
  if (detection.light_weights) equipment.push("light_weights");

  const environment: EnvironmentTag[] = [];
  if (detection.open_floor) environment.push("open_floor");
  if (detection.stairs) environment.push("has_stairs");
  if (detection.chair) environment.push("has_chair");
  if (detection.railing) environment.push("has_railing");
  if (detection.small_space) environment.push("small_space");

  return { equipment, environment };
}

function parseJsonArray<T>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Merges the (possibly user-corrected) detected features into the profile's
// equipment/environment so future daily routines reflect what the scan
// found, per the data model's "known_environment_features ... populated by
// onboarding + scans". Only stores the photo itself if savePhoto is true.
scanRouter.post("/confirm", requireAuth, async (req, res) => {
  const parsed = confirmSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }
  const { detection, savePhoto, imageDataUrl } = parsed.data;

  const profileRow = await prisma.userProfile.findUnique({ where: { id: req.userId } });
  if (!profileRow) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }

  const { equipment, environment } = mapDetectionToTags(detection);
  const mergedEquipment = Array.from(
    new Set([...parseJsonArray<Equipment>(profileRow.equipmentOwned), ...equipment]),
  );
  const mergedEnvironment = Array.from(
    new Set([...parseJsonArray<EnvironmentTag>(profileRow.knownEnvironmentFeatures), ...environment]),
  );

  const updatedProfile = await prisma.userProfile.update({
    where: { id: req.userId },
    data: {
      equipmentOwned: JSON.stringify(mergedEquipment),
      knownEnvironmentFeatures: JSON.stringify(mergedEnvironment),
    },
  });

  if (savePhoto && imageDataUrl) {
    await prisma.environmentScan.create({
      data: {
        userId: req.userId!,
        imageData: imageDataUrl,
        detected: JSON.stringify(detection),
      },
    });
  }

  res.json({ profile: toUserProfile(updatedProfile) });
});
