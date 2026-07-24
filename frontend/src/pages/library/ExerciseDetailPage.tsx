import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Exercise } from "@geriatric-grooves/shared";
import { api } from "../../api/client";
import { BackButton } from "../../components/ui/BackButton";
import { Card } from "../../components/ui/Card";
import { DisclaimerBanner } from "../../components/ui/DisclaimerBanner";
import {
  BODY_FOCUS_LABELS,
  DIFFICULTY_LABELS,
  ENVIRONMENT_LABELS,
  EQUIPMENT_LABELS,
} from "../../utils/difficultyLabels";

export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    api
      .getExercise(id)
      .then((result) => {
        if (!cancelled) setExercise(result.exercise);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't find that exercise.");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto flex max-w-md flex-col gap-4 px-6 py-10">
        <BackButton fallback="/library" />
        <p style={{ fontSize: "var(--text-body)" }}>{error}</p>
      </main>
    );
  }

  if (!exercise) {
    return (
      <main className="mx-auto flex max-w-md flex-col gap-4 px-6 py-10">
        <p style={{ fontSize: "var(--text-body)" }}>Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
      <BackButton fallback="/library" />

      <div className="flex flex-col gap-2">
        <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
          {exercise.name}
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {DIFFICULTY_LABELS[exercise.difficulty]} · About{" "}
          {Math.round(exercise.durationEstimateSeconds / 60) || 1} min
        </p>
      </div>

      <Card>
        <p style={{ fontSize: "var(--text-body)" }}>{exercise.description}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          If this is too hard
        </span>
        <p style={{ fontSize: "var(--text-body)" }}>{exercise.modifications}</p>
      </Card>

      {exercise.cautions ? (
        <p
          className="rounded-xl border-2 px-4 py-3"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-caution-fg)",
            background: "var(--color-caution-bg)",
            borderColor: "var(--color-caution-fg)",
          }}
        >
          ⚠ {exercise.cautions}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-sm)" }}>
          What you'll need
        </span>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {exercise.equipmentRequired.map((item) => EQUIPMENT_LABELS[item]).join(", ")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-sm)" }}>
          Works well with
        </span>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {exercise.environmentTags.map((item) => ENVIRONMENT_LABELS[item]).join(", ")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-sm)" }}>
          Focus areas
        </span>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {exercise.bodyFocus.map((item) => BODY_FOCUS_LABELS[item]).join(", ")}
        </p>
      </div>

      <DisclaimerBanner />
    </main>
  );
}
