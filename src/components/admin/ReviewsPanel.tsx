"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminReview } from "@/lib/adminClient";

const fieldClass =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

export function ReviewsPanel() {
  const [items, setItems] = useState<AdminReview[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);

  async function load() {
    setErr("");
    try {
      setItems(await adminApi.listReviews());
    } catch (e) {
      setErr(msg(e));
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(fn: () => Promise<unknown>, id: number | "new") {
    setBusy(id);
    setErr("");
    try {
      await fn();
      await load();
    } catch (e) {
      setErr(msg(e));
    } finally {
      setBusy(null);
    }
  }

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    await act(
      () =>
        adminApi.addReview({
          name: String(f.get("name") || ""),
          context: String(f.get("context") || ""),
          service: String(f.get("service") || ""),
          quote: String(f.get("quote") || ""),
          rating: Number(f.get("rating") || 5),
          avatar: String(f.get("avatar") || ""),
          status: (f.get("status") as string) || "approved",
        }),
      "new"
    );
    form.reset();
  }

  const pending = items?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <div className="space-y-8">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}

      <form onSubmit={onAdd} className="card p-5">
        <h3 className="text-sm font-semibold text-ink">Add a review</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Name" className={fieldClass} />
          <input name="context" placeholder="Neighbourhood" className={fieldClass} />
          <input name="service" placeholder="Service" className={fieldClass} />
          <input name="avatar" placeholder="Avatar URL (optional)" className={fieldClass} />
        </div>
        <textarea name="quote" required placeholder="Review text" rows={2} className={`${fieldClass} mt-3`} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select name="rating" defaultValue="5" className={`${fieldClass} w-28`}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star
              </option>
            ))}
          </select>
          <select name="status" defaultValue="approved" className={`${fieldClass} w-36`}>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <button disabled={busy === "new"} className="btn btn-primary ml-auto disabled:opacity-60">
            {busy === "new" ? "Adding..." : "Add review"}
          </button>
        </div>
      </form>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">
            All reviews {items ? `(${items.length})` : ""}
          </h3>
          {pending > 0 && <span className="tag">{pending} pending</span>}
        </div>

        {items === null ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((r) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{r.name}</span>
                      <span
                        className={`label-mono ${
                          r.status === "approved" ? "text-brand-700" : "text-[var(--color-warning)]"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted">
                      {[r.context, r.service, `${r.rating} star`].filter(Boolean).join("  ·  ")}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">{r.quote}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {r.status === "pending" ? (
                      <button
                        disabled={busy === r.id}
                        onClick={() => act(() => adminApi.setReviewStatus(r.id, "approved"), r.id)}
                        className="btn btn-primary px-3 py-1.5 text-sm disabled:opacity-60"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        disabled={busy === r.id}
                        onClick={() => act(() => adminApi.setReviewStatus(r.id, "pending"), r.id)}
                        className="btn btn-secondary px-3 py-1.5 text-sm disabled:opacity-60"
                      >
                        Unapprove
                      </button>
                    )}
                    <button
                      disabled={busy === r.id}
                      onClick={() => {
                        if (window.confirm("Delete this review?")) {
                          act(() => adminApi.deleteReview(r.id), r.id);
                        }
                      }}
                      className="btn btn-ghost px-3 py-1.5 text-sm text-[var(--color-error)] disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
