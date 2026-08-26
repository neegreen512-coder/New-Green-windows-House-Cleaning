"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminGallery } from "@/lib/adminClient";
import { uploadImage } from "@/lib/cms";

const fc =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

function readForm(f: FormData): Partial<AdminGallery> {
  return {
    before_url: String(f.get("before_url") || ""),
    after_url: String(f.get("after_url") || ""),
    caption: String(f.get("caption") || ""),
    service: String(f.get("service") || ""),
    sort: Number(f.get("sort") || 0),
  };
}

export function GalleryPanel() {
  const [items, setItems] = useState<AdminGallery[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);

  async function load() {
    setErr("");
    try {
      setItems(await adminApi.listGallery());
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

  async function upload(e: React.ChangeEvent<HTMLInputElement>, field: "before_url" | "after_url", id: number | "new") {
    const file = e.target.files?.[0];
    const form = e.target.closest("form");
    if (!file || !form) return;
    setBusy(id);
    setErr("");
    try {
      const url = await uploadImage(file);
      (form.querySelector(`input[name="${field}"]`) as HTMLInputElement).value = url;
      const preview = form.querySelector<HTMLImageElement>(`[data-preview="${field}"]`);
      if (preview) {
        preview.src = url;
        preview.style.display = "block";
      }
    } catch (er) {
      setErr(msg(er));
    } finally {
      setBusy(null);
    }
  }

  function ImageField({ field, label, url }: { field: "before_url" | "after_url"; label: string; url?: string }) {
    return (
      <div>
        <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
        <input type="hidden" name={field} defaultValue={url || ""} />
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-preview={field}
            src={url || ""}
            alt=""
            style={{ display: url ? "block" : "none" }}
            className="h-14 w-20 rounded-lg object-cover ring-1 ring-line"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => upload(e, field, url === undefined ? "new" : -1)}
            className="block text-xs text-muted file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-brand-800"
          />
        </div>
      </div>
    );
  }

  function Fields({ g }: { g?: AdminGallery }) {
    return (
      <>
        <div className="grid gap-3 sm:grid-cols-2">
          <ImageField field="before_url" label="Before photo" url={g?.before_url} />
          <ImageField field="after_url" label="After photo" url={g?.after_url} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input name="caption" placeholder="Caption (e.g. Kitchen deep clean)" defaultValue={g?.caption} className={fc} />
          <input name="service" placeholder="Service" defaultValue={g?.service} className={`${fc} sm:w-40`} />
          <label className="flex items-center gap-1 text-sm text-ink">
            Sort
            <input type="number" name="sort" defaultValue={g?.sort ?? 0} className={`${fc} w-16`} />
          </label>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}
      <p className="text-sm text-muted">
        Upload a before and an after photo of a real job. If you only upload one, the slider still
        works. Until you add your own, a sample set shows on the live gallery.
      </p>

      {items === null ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <>
          {items.map((g) => (
            <form
              key={g.id}
              onSubmit={(e) => {
                e.preventDefault();
                act(() => adminApi.updateGallery(g.id, readForm(new FormData(e.currentTarget))), g.id);
              }}
              className="card p-5"
            >
              <Fields g={g} />
              <div className="mt-3 flex gap-2">
                <button disabled={busy === g.id} className="btn btn-primary px-4 py-2 text-sm disabled:opacity-60">
                  Save
                </button>
                <button
                  type="button"
                  disabled={busy === g.id}
                  onClick={() => {
                    if (window.confirm("Delete this gallery item?")) act(() => adminApi.deleteGallery(g.id), g.id);
                  }}
                  className="btn btn-ghost px-3 py-2 text-sm text-[var(--color-error)] disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              act(() => adminApi.addGallery(readForm(new FormData(form))), "new").then(() => form.reset());
            }}
            className="card border-dashed p-5"
          >
            <h3 className="mb-3 text-sm font-semibold text-ink">Add a before / after</h3>
            <Fields />
            <button disabled={busy === "new"} className="btn btn-primary mt-3 px-4 py-2 text-sm disabled:opacity-60">
              {busy === "new" ? "Adding..." : "Add to gallery"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
