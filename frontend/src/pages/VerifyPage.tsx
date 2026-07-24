import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../api/client";
import { useProfile } from "../context/ProfileContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();
  const [error, setError] = useState<string | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token || attempted.current) return;
    attempted.current = true;

    api
      .verifyMagicLink(token)
      .then(async () => {
        await refreshProfile();
        navigate("/", { replace: true });
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "That link didn't work. Please request a new one.");
      });
  }, [searchParams, navigate, refreshProfile]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      {error ? (
        <Card className="flex flex-col gap-4">
          <p style={{ fontSize: "var(--text-body)" }}>{error}</p>
          <Button onClick={() => navigate("/sign-in", { replace: true })}>Back to sign in</Button>
        </Card>
      ) : (
        <p style={{ fontSize: "var(--text-body)" }}>Signing you in...</p>
      )}
    </main>
  );
}
