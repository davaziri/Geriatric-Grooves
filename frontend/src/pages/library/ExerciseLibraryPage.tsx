import { useEffect, useState } from "react";
import type { Difficulty, Equipment, Exercise } from "@geriatric-grooves/shared";
import { DIFFICULTIES, EQUIPMENT_OPTIONS } from "@geriatric-grooves/shared";
import { api } from "../../api/client";
import { ExerciseSummaryCard } from "../../components/ExerciseSummaryCard";
import { FilterPill } from "../../components/ui/FilterPill";
import { DIFFICULTY_LABELS, EQUIPMENT_LABELS } from "../../utils/difficultyLabels";

export function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getExercises({ difficulty: difficulty ?? undefined, equipment: equipment ?? undefined })
      .then((result) => {
        if (!cancelled) setExercises(result.exercises);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load the exercise library. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [difficulty, equipment]);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
      <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
        Exercise Library
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="font-semibold" style={{ fontSize: "var(--text-sm)" }}>
            Difficulty
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterPill selected={difficulty === null} onSelect={() => setDifficulty(null)}>
              Any
            </FilterPill>
            {DIFFICULTIES.map((level) => (
              <FilterPill key={level} selected={difficulty === level} onSelect={() => setDifficulty(level)}>
                {DIFFICULTY_LABELS[level]}
              </FilterPill>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold" style={{ fontSize: "var(--text-sm)" }}>
            Equipment
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterPill selected={equipment === null} onSelect={() => setEquipment(null)}>
              Any
            </FilterPill>
            {EQUIPMENT_OPTIONS.map((option) => (
              <FilterPill key={option} selected={equipment === option} onSelect={() => setEquipment(option)}>
                {EQUIPMENT_LABELS[option]}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      {loading ? <p style={{ fontSize: "var(--text-body)" }}>Loading exercises...</p> : null}
      {error ? (
        <p role="alert" style={{ fontSize: "var(--text-body)", color: "var(--color-caution-fg)" }}>
          {error}
        </p>
      ) : null}

      {!loading && !error && exercises.length === 0 ? (
        <p style={{ fontSize: "var(--text-body)", color: "var(--color-fg-muted)" }}>
          No exercises match those filters yet. Try "Any" on one of them.
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {exercises.map((exercise) => (
          <ExerciseSummaryCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </main>
  );
}
