import type { ReactNode } from "react";

interface FilterPillProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

export function FilterPill({ selected, onSelect, children }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className="flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-4 font-medium"
      style={{
        border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
        background: selected ? "var(--color-primary)" : "var(--color-surface)",
        color: selected ? "var(--color-primary-contrast)" : "var(--color-fg)",
        fontSize: "var(--text-sm)",
      }}
    >
      {selected ? <span aria-hidden="true">✓</span> : null}
      {children}
    </button>
  );
}
