interface ProgressStepsProps {
  step: number;
  total: number;
}

export function ProgressSteps({ step, total }: ProgressStepsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className="h-2.5 w-8 rounded-full"
            style={{ background: index < step ? "var(--color-primary)" : "var(--color-border)" }}
          />
        ))}
      </div>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
        Step {step} of {total}
      </span>
    </div>
  );
}
