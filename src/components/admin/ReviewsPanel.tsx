"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminReview } from "@/lib/adminClient";
import { testimonials } from "@/lib/site";
import { uploadImage } from "@/lib/cms";

const fieldClass =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

export function ReviewsPanel() {
  const [items, setItems] = useState<AdminReview[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [newAvatar, setNewAvatar] = useState("");
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null, mode: "avatar" | "photos") {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErr("");
    try {
      if (mode === "avatar") {
        setNewAvatar(await uploadImage(files[0]));
      } else {
        const urls: string[] = [];
        for (const f of Array.from(files).slice(0, 6)) urls.push(await uploadImage(f));
        setNewPhotos((prev) => [...prev, ...urls].slice(0, 6));
      }
    } catch (e) {
      setErr(msg(e));
    } finally {
      setUploading(false);
    }
  }

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

  async function loadSamples() {
    setBusy("new");
    setErr("");
    try {
      for (const t of testimonials) {
        await adminApi.addReview({
          name: t.name,
          context: t.context,
          service: t.service,
          quote: t.quote,
          rating: t.rating,
          avatar: t.avatar,
          status: "approved",
        });
      }
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
          avatar: newAvatar,
          photos: newPhotos,
          status: (f.get("status") as string) || "approved",
        }),
      "new"
    );
    form.reset();
    setNewAvatar("");
    setNewPhotos([]);
  }

  const pending = items?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <div className="space-y-8">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}

      <form onSubmit={onAdd} className="card p-5">
        <h3 className="text-sm font-semibold text-ink">Add a review</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input name="name" required placeholder="Name" className={fieldClass} />
          <input name="context" placeholder="Neighbourhood" className={fieldClass} />
          <input name="service" placeholder="Service" className={fieldClass} />
        </div>
        <textarea name="quote" required placeholder="Review text" rows={2} className={`${fieldClass} mt-3`} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-xs font-medium text-muted">Reviewer photo (optional)</span>
            <div className="flex items-center gap-2">
              {newAvatar && (
                <span className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newAvatar} alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-line" />
                  <button
                    type="button"
                    onClick={() => setNewAvatar("")}
                    className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white"
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files, "avatar")}
                className="block text-sm text-muted file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-800"
              />
            </div>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-muted">House photos (optional)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files, "photos")}
              className="block text-sm text-muted file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-800"
            />
            {newPhotos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newPhotos.map((p, i) => (
                  <span key={p} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-line" />
                    <button
                      type="button"
                      onClick={() => setNewPhotos((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white"
                      aria-label="Remove"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
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
          <button disabled={busy === "new" || uploading} className="btn btn-primary ml-auto disabled:opacity-60">
            {uploading ? "Uploading..." : busy === "new" ? "Adding..." : "Add review"}
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
          <div className="card border-dashed p-6 text-center">
            <p className="text-sm text-muted">
              No reviews yet. Load a few samples to see how they look, then edit or delete them.
            </p>
            <button
              type="button"
              disabled={busy === "new"}
              onClick={loadSamples}
              className="btn btn-primary mt-3 px-4 py-2 text-sm disabled:opacity-60"
            >
              {busy === "new" ? "Loading..." : "Load sample reviews"}
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((r) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    {r.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.avatar}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-line"
                      />
                    )}
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
                      {r.photos && r.photos.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.photos.map((p) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={p}
                              src={p}
                              alt=""
                              className="h-14 w-14 rounded-lg object-cover ring-1 ring-line"
                            />
                          ))}
                        </div>
                      )}
                    </div>
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
