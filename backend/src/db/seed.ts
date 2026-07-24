import { prisma } from "./client.js";
import { exerciseSeedData } from "./exerciseSeedData.js";

async function main() {
  console.log(`Seeding ${exerciseSeedData.length} exercises...`);

  for (const exercise of exerciseSeedData) {
    await prisma.exercise.upsert({
      where: { id: exercise.id },
      update: {
        name: exercise.name,
        description: exercise.description,
        difficulty: exercise.difficulty,
        durationEstimateSeconds: exercise.durationEstimateSeconds,
        equipmentRequired: JSON.stringify(exercise.equipmentRequired),
        environmentTags: JSON.stringify(exercise.environmentTags),
        bodyFocus: JSON.stringify(exercise.bodyFocus),
        modifications: exercise.modifications,
        cautions: exercise.cautions ?? null,
      },
      create: {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        difficulty: exercise.difficulty,
        durationEstimateSeconds: exercise.durationEstimateSeconds,
        equipmentRequired: JSON.stringify(exercise.equipmentRequired),
        environmentTags: JSON.stringify(exercise.environmentTags),
        bodyFocus: JSON.stringify(exercise.bodyFocus),
        modifications: exercise.modifications,
        cautions: exercise.cautions ?? null,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
