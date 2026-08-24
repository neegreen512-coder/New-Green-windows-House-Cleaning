"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminClient";

const fc =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

export function ContentPanel() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi
      .getContent()
      .then(setData)
      .catch((e) => {
        setErr(e instanceof Error ? e.message : "Failed to load");
        setData({});
      });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setErr("");
    setSaved(false);
    const f = new FormData(form);
    const obj: Record<string, string> = {};
    for (const [k, v] of f.entries()) {
      if (k.startsWith("v_")) obj[k.slice(2)] = String(v);
    }
    const nk = String(f.get("new_key") || "").trim();
    if (nk) obj[nk] = String(f.get("new_value") || "");

    try {
      await adminApi.putContent(obj);
      setData(await adminApi.getContent());
      setSaved(true);
      form.reset();
    } catch (er) {
      setErr(er instanceof Error ? er.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (data === null) return <p className="text-sm text-muted">Loading...</p>;

  const keys = Object.keys(data);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}
      {keys.length === 0 && (
        <p className="text-sm text-muted">No content blocks yet. Add one below.</p>
      )}

      {keys.map((k) => (
        <label key={k} className="card block p-4">
          <span className="label-mono">{k}</span>
          <textarea name={`v_${k}`} defaultValue={data[k]} rows={2} className={`${fc} mt-2`} />
        </label>
      ))}

      <div className="card border-dashed p-4">
        <h3 className="text-sm font-semibold text-ink">Add a block</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-[0.4fr_1fr]">
          <input name="new_key" placeholder="key" className={fc} />
          <input name="new_value" placeholder="value" className={fc} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy ? "Saving..." : "Save content"}
        </button>
        {saved && <span className="text-sm text-brand-700">Saved.</span>}
      </div>
    </form>
  );
}
