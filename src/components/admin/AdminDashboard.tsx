"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewsPanel } from "./ReviewsPanel";
import { LeadsPanel } from "./LeadsPanel";
import { PricingPanel } from "./PricingPanel";
import { BlogPanel } from "./BlogPanel";
import { GalleryPanel } from "./GalleryPanel";
import { ContentPanel } from "./ContentPanel";
import { adminApi } from "@/lib/adminClient";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "reviews", label: "Reviews" },
  { id: "leads", label: "Leads" },
  { id: "pricing", label: "Pricing" },
  { id: "gallery", label: "Gallery" },
  { id: "blog", label: "Blog" },
  { id: "site", label: "Site content" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Stat({ value, label, accent }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div className="card p-5">
      <div
        className={`font-[family-name:var(--font-bricolage)] text-[2rem] font-bold leading-none ${
          accent ? "text-accent" : "text-brand-800"
        }`}
      >
        {value}
      </div>
      <div className="mt-2 text-[0.85rem] leading-snug text-muted">{label}</div>
    </div>
  );
}

function Overview({ go }: { go: (t: TabId) => void }) {
  const [s, setS] = useState<{
    newLeads: number;
    pending: number;
    reviews: number;
    posts: number;
    gallery: number;
  } | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.listReviews(),
      adminApi.listQuotes(),
      adminApi.listMessages(),
      adminApi.listPosts(),
      adminApi.listGallery(),
    ])
      .then(([reviews, quotes, messages, posts, gallery]) => {
        setS({
          newLeads:
            quotes.filter((q) => q.status === "new").length +
            messages.filter((m) => m.status === "new").length,
          pending: reviews.filter((r) => r.status === "pending").length,
          reviews: reviews.length,
          posts: posts.length,
          gallery: gallery.length,
        });
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Could not load your summary."));
  }, []);

  if (err) return <p className="text-sm text-[var(--color-error)]">{err}</p>;
  if (!s) return <p className="text-sm text-muted">Loading your summary...</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <button type="button" onClick={() => go("leads")} className="text-left">
          <Stat value={s.newLeads} label="New leads to review" accent={s.newLeads > 0} />
        </button>
        <button type="button" onClick={() => go("reviews")} className="text-left">
          <Stat value={s.pending} label="Reviews awaiting approval" accent={s.pending > 0} />
        </button>
        <Stat value={s.reviews} label="Total reviews" />
        <Stat value={s.posts || "—"} label="Blog posts in the CMS" />
        <Stat value={s.gallery || "—"} label="Gallery items" />
      </div>
      <p className="text-sm text-muted">
        Tip: reviews go live once you approve them, and every quote and message is stored as a
        permanent record under Leads. Changes you make here appear on the site within a minute.
      </p>
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");

  async function signOut() {
    await fetch("/api/admin-login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Owner admin</span>
          <h1 className="h2 mt-3">Manage your site</h1>
        </div>
        <button type="button" onClick={signOut} className="btn btn-secondary shrink-0 px-4 py-2 text-sm">
          Sign out
        </button>
      </div>
      <p className="mt-3 text-[0.95rem] text-muted">
        Approve reviews, read leads, edit pricing, write blog posts, manage your gallery, and update
        your site content. Everything goes live within a minute, no rebuild needed.
      </p>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-brand-800 text-white" : "text-ink hover:bg-surface-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <Overview go={setTab} />}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "leads" && <LeadsPanel />}
        {tab === "pricing" && <PricingPanel />}
        {tab === "gallery" && <GalleryPanel />}
        {tab === "blog" && <BlogPanel />}
        {tab === "site" && <ContentPanel />}
      </div>
    </div>
  );
}
