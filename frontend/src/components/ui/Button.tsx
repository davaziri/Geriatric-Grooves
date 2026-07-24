import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 font-semibold text-center transition-colors " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

// min-height 56px comfortably exceeds the 44px minimum tap target.
const sizing = "min-h-[56px] min-w-[56px] text-[length:var(--text-body)]";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "text-white",
  secondary: "border-2",
  ghost: "border-2 border-transparent",
};

export function Button({ variant = "primary", className = "", style, children, ...rest }: ButtonProps) {
  const variantStyle: CSSProperties =
    variant === "primary"
      ? { background: "var(--color-primary)", color: "var(--color-primary-contrast)" }
      : variant === "secondary"
        ? { background: "var(--color-surface)", color: "var(--color-primary)", borderColor: "var(--color-primary)" }
        : { color: "var(--color-primary)" };

  return (
    <button
      className={`${base} ${sizing} ${variants[variant]} ${className}`}
      style={{ ...variantStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
