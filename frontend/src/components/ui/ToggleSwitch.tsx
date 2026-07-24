interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}

// Shows the state as an explicit "On"/"Off" word next to the switch, not
// just a color change, per the "never convey information by color alone" rule.
export function ToggleSwitch({ checked, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex min-h-[56px] items-center justify-between gap-4 rounded-2xl border-2 px-5 py-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <div className="flex flex-col gap-1">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          {label}
        </span>
        {description ? (
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>{description}</span>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="flex min-h-[44px] shrink-0 items-center gap-3 rounded-full border-2 px-3"
        style={{ borderColor: "var(--color-primary)", background: checked ? "var(--color-primary)" : "var(--color-surface)" }}
      >
        <span
          className="font-semibold"
          style={{ fontSize: "var(--text-sm)", color: checked ? "var(--color-primary-contrast)" : "var(--color-primary)" }}
        >
          {checked ? "On" : "Off"}
        </span>
      </button>
    </div>
  );
}
