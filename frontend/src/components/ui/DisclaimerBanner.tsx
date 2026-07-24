// Persistent, low-key medical disclaimer shown on every exercise-related
// screen (routine, exercise detail). Kept short and calm — not a modal, not
// red, not attention-grabbing — per the "never feel rushed or alarmed" goal.
export function DisclaimerBanner() {
  return (
    <p
      className="rounded-xl border-2 px-4 py-3"
      style={{
        fontSize: "var(--text-sm)",
        color: "var(--color-caution-fg)",
        background: "var(--color-caution-bg)",
        borderColor: "var(--color-caution-fg)",
      }}
    >
      This app doesn't replace medical advice. Stop if you feel pain, dizziness, or shortness of
      breath, and check with your doctor before starting a new exercise routine.
    </p>
  );
}
