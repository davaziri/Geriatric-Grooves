import type { ReactNode } from "react";

interface SelectableChipProps {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
  icon?: ReactNode;
}

// Selection is shown with a checkmark + thicker border, not color alone, so
// it reads clearly for colorblind users or on a washed-out screen outdoors.
export function SelectableChip({ selected, onToggle, children, icon }: SelectableChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className="flex min-h-[56px] items-center gap-3 rounded-2xl px-5 text-left font-medium"
      style={{
        background: selected ? "var(--color-primary)" : "var(--color-surface)",
        color: selected ? "var(--color-primary-contrast)" : "var(--color-fg)",
        border: `3px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
        fontSize: "var(--text-body)",
      }}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm"
        style={{
          borderColor: selected ? "var(--color-primary-contrast)" : "var(--color-border)",
          background: selected ? "var(--color-primary-contrast)" : "transparent",
          color: "var(--color-primary)",
        }}
      >
        {selected ? "✓" : ""}
      </span>
      {icon}
      <span>{children}</span>
    </button>
  );
}
