"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminClient";
import { business, faqs as faqFallback, serviceAreas } from "@/lib/site";

const fc =
  "w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}
function parse<T>(v: string | undefined, fallback: T): T {
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

type Banner = { on: boolean; text: string; href: string; label: string };
type Biz = { phone: string; email: string; hours: string; address: string };
type Faq = { q: string; a: string };
type Area = { name: string; landmark: string; blurb: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

export function ContentPanel() {
  const [banner, setBanner] = useState<Banner>({ on: false, text: "", href: "/quote", label: "Get a quote" });
  const [biz, setBiz] = useState<Biz>({
    phone: business.phone,
    email: business.email,
    hours: business.hours,
    address: business.address,
  });
  const [faqList, setFaqList] = useState<Faq[]>(faqFallback);
  const [areas, setAreas] = useState<Area[]>(
    serviceAreas.areas.map((a) => ({ name: a.name, landmark: a.landmark, blurb: a.blurb }))
  );
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi
      .getContent()
      .then((c) => {
        setBanner(parse(c.banner, banner));
        setBiz(parse(c.business, biz));
        setFaqList(parse(c.faqs, faqList));
        setAreas(parse(c.areas, areas));
      })
      .catch((e) => setErr(msg(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setSaving(true);
    setErr("");
    setSaved(false);
    try {
      await adminApi.putContent({
        banner: JSON.stringify(banner),
        business: JSON.stringify(biz),
        faqs: JSON.stringify(faqList.filter((f) => f.q.trim() && f.a.trim())),
        areas: JSON.stringify(areas.filter((a) => a.name.trim())),
      });
      setSaved(true);
    } catch (e) {
      setErr(msg(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}

      <Section title="Promo banner">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" checked={banner.on} onChange={(e) => setBanner({ ...banner, on: e.target.checked })} />
          Show the banner across the site
        </label>
        <input
          className={fc}
          placeholder="Banner text (e.g. 20% off your first clean this month)"
          value={banner.text}
          onChange={(e) => setBanner({ ...banner, text: e.target.value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={fc}
            placeholder="Link (e.g. /quote)"
            value={banner.href}
            onChange={(e) => setBanner({ ...banner, href: e.target.value })}
          />
          <input
            className={fc}
            placeholder="Link label (e.g. Get a quote)"
            value={banner.label}
            onChange={(e) => setBanner({ ...banner, label: e.target.value })}
          />
        </div>
      </Section>

      <Section title="Business details">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">Phone</span>
            <input className={fc} value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">Email</span>
            <input className={fc} value={biz.email} onChange={(e) => setBiz({ ...biz, email: e.target.value })} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Hours</span>
          <input className={fc} value={biz.hours} onChange={(e) => setBiz({ ...biz, hours: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Address</span>
          <input className={fc} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} />
        </label>
      </Section>

      <Section title="Frequently asked questions">
        {faqList.map((f, i) => (
          <div key={i} className="rounded-lg border border-line p-3">
            <input
              className={`${fc} font-medium`}
              placeholder="Question"
              value={f.q}
              onChange={(e) => setFaqList(faqList.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
            />
            <textarea
              className={`${fc} mt-2`}
              rows={2}
              placeholder="Answer"
              value={f.a}
              onChange={(e) => setFaqList(faqList.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
            />
            <button
              type="button"
              onClick={() => setFaqList(faqList.filter((_, j) => j !== i))}
              className="mt-2 text-xs font-medium text-[var(--color-error)]"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFaqList([...faqList, { q: "", a: "" }])}
          className="btn btn-secondary px-3 py-1.5 text-sm"
        >
          Add a question
        </button>
      </Section>

      <Section title="Service areas">
        {areas.map((a, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-line p-3 sm:grid-cols-[1fr_1fr]">
            <input
              className={fc}
              placeholder="City"
              value={a.name}
              onChange={(e) => setAreas(areas.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
            />
            <input
              className={fc}
              placeholder="Known for (landmark)"
              value={a.landmark}
              onChange={(e) => setAreas(areas.map((x, j) => (j === i ? { ...x, landmark: e.target.value } : x)))}
            />
            <input
              className={`${fc} sm:col-span-2`}
              placeholder="Short blurb"
              value={a.blurb}
              onChange={(e) => setAreas(areas.map((x, j) => (j === i ? { ...x, blurb: e.target.value } : x)))}
            />
            <button
              type="button"
              onClick={() => setAreas(areas.filter((_, j) => j !== i))}
              className="justify-self-start text-xs font-medium text-[var(--color-error)]"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAreas([...areas, { name: "", landmark: "", blurb: "" }])}
          className="btn btn-secondary px-3 py-1.5 text-sm"
        >
          Add a city
        </button>
      </Section>

      <div className="sticky bottom-4 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save all content"}
        </button>
        {saved && <span className="text-sm font-medium text-brand-700">Saved. Live in a moment.</span>}
      </div>
    </div>
  );
}
