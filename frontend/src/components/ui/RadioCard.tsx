import type { ReactNode } from "react";

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: ReactNode;
}

export function RadioCard({ selected, onSelect, title, description }: RadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex w-full min-h-[56px] items-start gap-4 rounded-2xl px-5 py-4 text-left"
      style={{
        background: selected ? "var(--color-primary)" : "var(--color-surface)",
        color: selected ? "var(--color-primary-contrast)" : "var(--color-fg)",
        border: `3px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
      }}
    >
      <span
        aria-hidden="true"
        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
        style={{
          borderColor: selected ? "var(--color-primary-contrast)" : "var(--color-border)",
        }}
      >
        {selected ? (
          <span
            className="block h-3 w-3 rounded-full"
            style={{ background: "var(--color-primary-contrast)" }}
          />
        ) : null}
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
          {title}
        </span>
        {description ? (
          <span
            style={{
              fontSize: "var(--text-sm)",
              color: selected ? "var(--color-primary-contrast)" : "var(--color-fg-muted)",
            }}
          >
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
