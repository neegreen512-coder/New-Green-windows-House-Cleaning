"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminPricing } from "@/lib/adminClient";
import { pricingFallback } from "@/lib/site";

const fc =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

function readForm(f: FormData): Partial<AdminPricing> {
  return {
    name: String(f.get("name") || ""),
    blurb: String(f.get("blurb") || ""),
    price: String(f.get("price") || ""),
    unit: String(f.get("unit") || ""),
    features: String(f.get("features") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    featured: f.get("featured") ? 1 : 0,
    active: f.get("active") ? 1 : 0,
    sort: Number(f.get("sort") || 0),
  };
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function PricingPanel() {
  const [items, setItems] = useState<AdminPricing[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);

  async function load() {
    setErr("");
    try {
      setItems(await adminApi.listPricing());
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

  async function loadStarter() {
    setBusy("new");
    setErr("");
    try {
      for (let i = 0; i < pricingFallback.length; i++) {
        const p = pricingFallback[i];
        await adminApi.addPricing({
          name: p.name,
          blurb: p.blurb,
          price: p.price,
          unit: p.unit,
          features: p.features,
          featured: p.featured ? 1 : 0,
          active: 1,
          sort: i + 1,
        });
      }
      await load();
    } catch (e) {
      setErr(msg(e));
    } finally {
      setBusy(null);
    }
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
                No packages yet. Load the starter set, then edit prices and details.
              </p>
              <button
                type="button"
                disabled={busy === "new"}
                onClick={loadStarter}
                className="btn btn-primary mt-3 px-4 py-2 text-sm disabled:opacity-60"
              >
                {busy === "new" ? "Loading..." : "Load starter packages"}
              </button>
            </div>
          )}
          {items.map((p) => (
            <form
              key={p.id}
              onSubmit={(e) => {
                e.preventDefault();
                act(() => adminApi.updatePricing(p.id, readForm(new FormData(e.currentTarget))), p.id);
              }}
              className="card p-5"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input name="name" defaultValue={p.name} className={fc} />
                </Field>
                <Field label="Price">
                  <input name="price" defaultValue={p.price} className={fc} />
                </Field>
                <Field label="Blurb">
                  <input name="blurb" defaultValue={p.blurb} className={fc} />
                </Field>
                <Field label="Unit">
                  <input name="unit" defaultValue={p.unit} className={fc} />
                </Field>
              </div>
              <Field label="Features (one per line)" className="mt-3">
                <textarea name="features" defaultValue={p.features.join("\n")} rows={4} className={fc} />
              </Field>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" name="featured" defaultChecked={!!p.featured} /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" name="active" defaultChecked={!!p.active} /> Active
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  Sort
                  <input type="number" name="sort" defaultValue={p.sort} className={`${fc} w-20`} />
                </label>
                <div className="ml-auto flex gap-2">
                  <button disabled={busy === p.id} className="btn btn-primary px-4 py-2 text-sm disabled:opacity-60">
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={busy === p.id}
                    onClick={() => {
                      if (window.confirm("Delete this package?")) {
                        act(() => adminApi.deletePricing(p.id), p.id);
                      }
                    }}
                    className="btn btn-ghost px-3 py-2 text-sm text-[var(--color-error)] disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </form>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              act(() => adminApi.addPricing(readForm(new FormData(form))), "new").then(() => form.reset());
            }}
            className="card border-dashed p-5"
          >
            <h3 className="text-sm font-semibold text-ink">Add a package</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input name="name" required placeholder="Name" className={fc} />
              <input name="price" placeholder="Price (e.g. Custom quote)" className={fc} />
              <input name="blurb" placeholder="Short blurb" className={fc} />
              <input name="unit" placeholder="Unit (e.g. per visit)" className={fc} />
            </div>
            <textarea name="features" placeholder="Features, one per line" rows={3} className={`${fc} mt-3`} />
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" name="featured" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" name="active" defaultChecked /> Active
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                Sort
                <input type="number" name="sort" defaultValue={0} className={`${fc} w-20`} />
              </label>
              <button disabled={busy === "new"} className="btn btn-primary ml-auto px-4 py-2 text-sm disabled:opacity-60">
                {busy === "new" ? "Adding..." : "Add package"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
