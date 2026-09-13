"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile, turnstileEnabled } from "@/components/Turnstile";

type State = "idle" | "sending" | "error";

export function AdminLogin() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [resetTs, setResetTs] = useState(0);

  // A used token cannot be replayed; get a fresh one for the next attempt.
  function failed(message: string) {
    setError(message);
    setState("error");
    setToken("");
    setResetTs((n) => n + 1);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: String(form.get("password") || ""),
          turnstileToken: token,
        }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const j = await res.json().catch(() => ({}));
      failed(j?.error || "Incorrect password.");
    } catch {
      failed("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <span className="eyebrow">Owner admin</span>
      <h1 className="h2 mt-3">Sign in</h1>
      <p className="mt-3 text-sm text-muted">Enter the admin password to manage the site.</p>
      <form onSubmit={onSubmit} className="card mt-6 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
          <input
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600"
          />
        </label>
        <Turnstile onToken={setToken} resetSignal={resetTs} />
        {state === "error" && <p className="mt-3 text-sm text-[var(--color-error)]">{error}</p>}
        <button
          type="submit"
          disabled={state === "sending" || (turnstileEnabled && !token)}
          className="btn btn-primary mt-5 w-full disabled:opacity-60"
        >
          {state === "sending" ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
