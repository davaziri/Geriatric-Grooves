import { useLocation, useNavigate } from "react-router-dom";

interface BackButtonProps {
  label?: string;
  /** Used when there's no in-app history to go back to (direct link, reload). */
  fallback?: string;
}

// Goes to the actual previous screen (browser history), not a hardcoded
// route — so it correctly returns to wherever the user actually came from
// (e.g. Home or Library, whichever led to an exercise's detail screen).
export function BackButton({ label = "Back", fallback = "/home" }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick() {
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex min-h-[44px] w-fit items-center gap-1 font-semibold"
      style={{ color: "var(--color-primary)", fontSize: "var(--text-body)" }}
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
}
