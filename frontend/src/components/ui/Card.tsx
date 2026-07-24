import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", style, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border-2 p-5 ${className}`}
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
