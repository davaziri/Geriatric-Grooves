import { Navigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export function RootRedirect() {
  const { status, profile } = useProfile();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p style={{ fontSize: "var(--text-body)" }}>Loading...</p>
      </main>
    );
  }

  if (status === "signed-out" || !profile) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!profile.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/home" replace />;
}
