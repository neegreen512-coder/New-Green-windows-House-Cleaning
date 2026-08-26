"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminPost } from "@/lib/adminClient";
import { uploadImage } from "@/lib/cms";
import { blogPosts } from "@/lib/blog";

const fc =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

function readForm(f: FormData): Partial<AdminPost> {
  return {
    title: String(f.get("title") || ""),
    excerpt: String(f.get("excerpt") || ""),
    body: String(f.get("body") || ""),
    tag: String(f.get("tag") || ""),
    read_min: Number(f.get("read_min") || 4),
    cover: String(f.get("cover") || ""),
    published: f.get("published") ? 1 : 0,
  };
}

export function BlogPanel() {
  const [items, setItems] = useState<AdminPost[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);

  async function load() {
    setErr("");
    try {
      setItems(await adminApi.listPosts());
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

  async function loadStarters() {
    setBusy("new");
    setErr("");
    try {
      for (const p of blogPosts) {
        await adminApi.addPost({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          body: p.body,
          tag: p.tag,
          read_min: p.readMin,
          cover: p.cover,
          published: 1,
        });
      }
      await load();
    } catch (e) {
      setErr(msg(e));
    } finally {
      setBusy(null);
    }
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>, id: number | "new") {
    const file = e.target.files?.[0];
    const form = e.target.closest("form");
    if (!file || !form) return;
    setBusy(id);
    setErr("");
    try {
      const url = await uploadImage(file);
      (form.querySelector('input[name="cover"]') as HTMLInputElement).value = url;
      const preview = form.querySelector<HTMLImageElement>('[data-cover-preview]');
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

  function PostFields({ p }: { p?: AdminPost }) {
    return (
      <>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input name="title" required placeholder="Title" defaultValue={p?.title} className={fc} />
          <div className="flex items-center gap-3">
            <input name="tag" placeholder="Tag" defaultValue={p?.tag} className={`${fc} w-32`} />
            <label className="flex items-center gap-1 text-sm text-ink">
              <input
                type="number"
                name="read_min"
                defaultValue={p?.read_min ?? 4}
                className={`${fc} w-16`}
              />
              min
            </label>
          </div>
        </div>
        <input name="excerpt" placeholder="Short excerpt (shown on the cards)" defaultValue={p?.excerpt} className={`${fc} mt-3`} />
        <textarea
          name="body"
          placeholder={'Body. Blank line = new paragraph. Start a line with "## " for a subheading.'}
          rows={p ? 8 : 6}
          defaultValue={p?.body}
          className={`${fc} mt-3 font-[family-name:var(--font-geist-mono)] text-xs`}
        />
        <input type="hidden" name="cover" defaultValue={p?.cover || ""} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-cover-preview
            src={p?.cover || ""}
            alt=""
            style={{ display: p?.cover ? "block" : "none" }}
            className="h-14 w-24 rounded-lg object-cover ring-1 ring-line"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadCover(e, p?.id ?? "new")}
            className="block text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-800"
          />
          <label className="ml-auto flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="published" defaultChecked={p ? !!p.published : true} /> Published
          </label>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}

      {items === null ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <>
          {items.length === 0 && (
            <div className="card border-dashed p-6 text-center">
              <p className="text-sm text-muted">
                No posts in the CMS yet. Ten ready-made articles are already showing on your live
                blog. Load them here to edit them, or just write your own.
              </p>
              <button
                type="button"
                disabled={busy === "new"}
                onClick={loadStarters}
                className="btn btn-primary mt-3 px-4 py-2 text-sm disabled:opacity-60"
              >
                {busy === "new" ? "Loading..." : "Load the 10 starter posts"}
              </button>
            </div>
          )}

          {items.map((p) => (
            <form
              key={p.id}
              onSubmit={(e) => {
                e.preventDefault();
                act(() => adminApi.updatePost(p.id, readForm(new FormData(e.currentTarget))), p.id);
              }}
              className="card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="label-mono text-muted">/blog/{p.slug}</span>
                <span className={`label-mono ${p.published ? "text-brand-700" : "text-[var(--color-warning)]"}`}>
                  {p.published ? "published" : "draft"}
                </span>
              </div>
              <PostFields p={p} />
              <div className="mt-3 flex gap-2">
                <button disabled={busy === p.id} className="btn btn-primary px-4 py-2 text-sm disabled:opacity-60">
                  Save
                </button>
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => {
                    if (window.confirm("Delete this post?")) act(() => adminApi.deletePost(p.id), p.id);
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
              act(() => adminApi.addPost(readForm(new FormData(form))), "new").then(() => form.reset());
            }}
            className="card border-dashed p-5"
          >
            <h3 className="mb-3 text-sm font-semibold text-ink">Write a new post</h3>
            <PostFields />
            <button disabled={busy === "new"} className="btn btn-primary mt-3 px-4 py-2 text-sm disabled:opacity-60">
              {busy === "new" ? "Publishing..." : "Publish post"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
