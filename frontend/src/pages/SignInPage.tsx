import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { AccessibilityControls } from "../components/AccessibilityControls";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);
  const [showAccessibility, setShowAccessibility] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const result = await api.requestMagicLink(email);
      setStatus("sent");
      setDevMagicLink(result.devMagicLink ?? null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <span aria-hidden="true" style={{ fontSize: "3rem" }}>
          🌿
        </span>
        <h1 className="font-bold" style={{ fontSize: "var(--text-xl)" }}>
          Geriatric Grooves
        </h1>
        <p style={{ fontSize: "var(--text-body)", color: "var(--color-fg-muted)" }}>
          A gentle daily mobility coach. No password needed — we'll email you a link to sign in.
        </p>
      </div>

      {status === "sent" ? (
        <Card className="flex flex-col gap-3 text-center">
          <p style={{ fontSize: "var(--text-body)" }}>
            Check your email for a link from us. Tap it to sign in — no password required.
          </p>
          {devMagicLink ? (
            <div className="flex flex-col gap-2">
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
                Dev mode (no email service configured yet):
              </p>
              <a
                href={devMagicLink}
                className="break-all underline"
                style={{ color: "var(--color-primary)" }}
              >
                {devMagicLink}
              </a>
            </div>
          ) : null}
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-semibold" style={{ fontSize: "var(--text-body)" }}>
              Email address
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-[56px] rounded-2xl border-2 px-4"
              style={{ fontSize: "var(--text-body)", borderColor: "var(--color-border)", background: "var(--color-surface)", color: "var(--color-fg)" }}
              placeholder="you@example.com"
            />
          </label>

          {error ? (
            <p role="alert" style={{ fontSize: "var(--text-sm)", color: "var(--color-caution-fg)" }}>
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Email me a sign-in link"}
          </Button>
        </form>
      )}

      <button
        type="button"
        onClick={() => setShowAccessibility((prev) => !prev)}
        className="min-h-[44px] font-semibold underline"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)" }}
      >
        {showAccessibility ? "Hide display settings" : "Text too small? Adjust display settings"}
      </button>

      {showAccessibility ? (
        <Card>
          <AccessibilityControls />
        </Card>
      ) : null}
    </main>
  );
}
