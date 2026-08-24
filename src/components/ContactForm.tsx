"use client";

import { useState } from "react";
import { submitContact } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

const fieldClass =
  "w-full rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      await submitContact({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        message: String(form.get("message") || ""),
      });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold text-ink">Message sent</h2>
        <p className="mt-2 text-muted">
          Thank you for reaching out. We will get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-ink">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">We usually reply within one business day.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
          <input name="name" required minLength={2} autoComplete="name" className={fieldClass} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Phone (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="(437) 000 0000" />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">How can we help?</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="Tell us a little about what you need..."
        />
      </label>

      {state === "error" && <p className="mt-3 text-sm text-[var(--color-error)]">{error}</p>}

      <button type="submit" disabled={state === "sending"} className="btn btn-primary mt-6 disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
