import { Link } from "react-router-dom";
import type { Exercise } from "@geriatric-grooves/shared";
import { Card } from "./ui/Card";
import { DIFFICULTY_LABELS, EQUIPMENT_LABELS } from "../utils/difficultyLabels";

interface ExerciseSummaryCardProps {
  exercise: Exercise;
  /** When provided (e.g. on the daily routine), shows a "mark done" control. */
  completed?: boolean;
  onComplete?: () => void;
}

export function ExerciseSummaryCard({ exercise, completed, onComplete }: ExerciseSummaryCardProps) {
  return (
    <Card className="flex items-center gap-3">
      <Link to={`/library/${exercise.id}`} className="flex flex-1 flex-col gap-2">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          {exercise.name}
        </span>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {DIFFICULTY_LABELS[exercise.difficulty]} · About{" "}
          {Math.round(exercise.durationEstimateSeconds / 60) || 1} min
        </span>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          {exercise.equipmentRequired.map((item) => EQUIPMENT_LABELS[item]).join(", ")}
        </span>
      </Link>

      {onComplete ? (
        <button
          type="button"
          aria-pressed={completed}
          onClick={onComplete}
          disabled={completed}
          className="flex min-h-[56px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-4 font-semibold"
          style={{
            borderColor: completed ? "var(--color-primary)" : "var(--color-border)",
            background: completed ? "var(--color-primary)" : "var(--color-surface)",
            color: completed ? "var(--color-primary-contrast)" : "var(--color-primary)",
            fontSize: "var(--text-sm)",
          }}
        >
          <span aria-hidden="true">{completed ? "✓" : ""}</span>
          <span>{completed ? "Done" : "Mark done"}</span>
        </button>
      ) : null}
    </Card>
  );
}
