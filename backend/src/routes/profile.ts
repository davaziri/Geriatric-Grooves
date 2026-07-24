import { Router } from "express";
import { z } from "zod";
import { EQUIPMENT_OPTIONS, ENVIRONMENT_TAGS, FONT_SIZE_OPTIONS } from "@geriatric-grooves/shared";
import { prisma } from "../db/client.js";
import { requireAuth } from "../middleware/session.js";
import { toUserProfile } from "../db/mappers.js";

export const profileRouter = Router();

profileRouter.get("/me", requireAuth, async (req, res) => {
  const profile = await prisma.userProfile.findUnique({ where: { id: req.userId } });
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  res.json({ profile: toUserProfile(profile) });
});

const updateProfileSchema = z.object({
  mobilityLevel: z.number().int().min(1).max(5).optional(),
  equipmentOwned: z.array(z.enum(EQUIPMENT_OPTIONS)).optional(),
  knownEnvironmentFeatures: z.array(z.enum(ENVIRONMENT_TAGS)).optional(),
  accessibilityPrefs: z
    .object({
      fontSize: z.enum(FONT_SIZE_OPTIONS).optional(),
      highContrast: z.boolean().optional(),
      reduceMotion: z.boolean().optional(),
    })
    .optional(),
  onboardingCompleted: z.boolean().optional(),
});

// Single flexible endpoint: used incrementally during onboarding and later
// from the settings screen, rather than one endpoint per step.
profileRouter.patch("/me", requireAuth, async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid request." });
    return;
  }
  const { mobilityLevel, equipmentOwned, knownEnvironmentFeatures, accessibilityPrefs, onboardingCompleted } =
    parsed.data;

  const profile = await prisma.userProfile.update({
    where: { id: req.userId },
    data: {
      ...(mobilityLevel !== undefined ? { mobilityLevel } : {}),
      ...(equipmentOwned !== undefined ? { equipmentOwned: JSON.stringify(equipmentOwned) } : {}),
      ...(knownEnvironmentFeatures !== undefined
        ? { knownEnvironmentFeatures: JSON.stringify(knownEnvironmentFeatures) }
        : {}),
      ...(accessibilityPrefs?.fontSize !== undefined ? { fontSize: accessibilityPrefs.fontSize } : {}),
      ...(accessibilityPrefs?.highContrast !== undefined ? { highContrast: accessibilityPrefs.highContrast } : {}),
      ...(accessibilityPrefs?.reduceMotion !== undefined ? { reduceMotion: accessibilityPrefs.reduceMotion } : {}),
      ...(onboardingCompleted !== undefined ? { onboardingCompleted } : {}),
    },
  });

  res.json({ profile: toUserProfile(profile) });
});
