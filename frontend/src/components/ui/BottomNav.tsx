import { NavLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

// Capped at 4 items per the accessibility spec. Icon + text label together
// (never icon alone) so meaning doesn't depend on recognizing a glyph.
const NAV_ITEMS: NavItem[] = [
  { to: "/home", label: "Home", icon: "🏠" },
  { to: "/library", label: "Library", icon: "📖" },
  { to: "/progress", label: "Progress", icon: "🌿" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 flex border-t-2"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 py-2"
          style={({ isActive }) => ({
            color: isActive ? "var(--color-primary)" : "var(--color-fg-muted)",
            fontWeight: isActive ? 700 : 500,
            borderTop: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
          })}
        >
          <span aria-hidden="true" style={{ fontSize: "var(--text-lg)" }}>
            {item.icon}
          </span>
          <span style={{ fontSize: "var(--text-sm)" }}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
