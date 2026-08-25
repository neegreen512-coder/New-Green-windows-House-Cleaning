"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/cms";
import { quoteOptions } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

export function ReviewForm({ onClose }: { onClose?: () => void }) {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      await submitReview({
        name: String(form.get("name") || ""),
        context: String(form.get("context") || ""),
        service: String(form.get("service") || ""),
        quote: String(form.get("quote") || ""),
        rating,
      });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <h3 className="text-xl font-semibold text-ink">Thank you</h3>
        <p className="mt-2 text-muted">
          Your review has been sent and will appear here once it is approved.
        </p>
        {onClose && (
          <button onClick={onClose} className="btn btn-secondary mt-6">
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-ink">Share your experience</h3>
      <p className="mt-1 text-sm text-muted">
        Reviews are checked before they appear on the site.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Your name</span>
          <input
            name="name"
            required
            minLength={2}
            className="w-full rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600"
            placeholder="First name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Neighbourhood (optional)</span>
          <input
            name="context"
            className="w-full rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600"
            placeholder="e.g. Homeowner"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Service</span>
        <select
          name="service"
          className="w-full rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600"
        >
          <option value="">Select a service</option>
          {["Window Cleaning", "House Cleaning", "Deep Cleaning"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4">
        <span className="mb-1.5 block text-sm font-medium text-ink">Rating</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-checked={rating === n}
              role="radio"
              className="p-1"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  n <= rating ? "fill-accent text-accent" : "text-line-strong"
                }`}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Your review</span>
        <textarea
          name="quote"
          required
          minLength={10}
          rows={4}
          className="w-full resize-y rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600"
          placeholder="Tell us how it went..."
        />
      </label>

      {state === "error" && <p className="mt-3 text-sm text-[var(--color-error)]">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary disabled:opacity-60">
          {state === "sending" ? "Sending..." : "Submit review"}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
