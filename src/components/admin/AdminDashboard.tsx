"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  SquaresFour,
  Star,
  Tray,
  Tag,
  Images,
  PencilSimple,
  SlidersHorizontal,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { ReviewsPanel } from "./ReviewsPanel";
import { LeadsPanel } from "./LeadsPanel";
import { PricingPanel } from "./PricingPanel";
import { BlogPanel } from "./BlogPanel";
import { GalleryPanel } from "./GalleryPanel";
import { ContentPanel } from "./ContentPanel";
import { LogoMark } from "@/components/Brand";
import { adminApi } from "@/lib/adminClient";

type Counts = { newLeads: number; pending: number; reviews: number; posts: number; gallery: number };
type IconType = ComponentType<{ className?: string; weight?: "regular" | "fill"; "aria-hidden"?: boolean }>;

const TABS: {
  id: string;
  label: string;
  desc: string;
  icon: IconType;
  badge?: keyof Counts;
}[] = [
  { id: "overview", label: "Overview", desc: "A quick snapshot of your site.", icon: SquaresFour },
  { id: "reviews", label: "Reviews", desc: "Approve, feature, and edit customer reviews.", icon: Star, badge: "pending" },
  { id: "leads", label: "Leads", desc: "Quote requests and contact messages.", icon: Tray, badge: "newLeads" },
  { id: "pricing", label: "Pricing", desc: "Your service packages and prices.", icon: Tag },
  { id: "gallery", label: "Gallery", desc: "Before and after photos of real jobs.", icon: Images },
  { id: "blog", label: "Blog", desc: "Write and manage your blog posts.", icon: PencilSimple },
  { id: "site", label: "Site content", desc: "Promo banner, business details, FAQ, and areas.", icon: SlidersHorizontal },
];

function Stat({ value, label, accent }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div className="card p-5 transition-shadow hover:shadow-[var(--shadow-sm)]">
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

function Overview({ counts, go }: { counts: Counts | null; go: (t: string) => void }) {
  if (!counts) return <p className="text-sm text-muted">Loading your summary...</p>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <button type="button" onClick={() => go("leads")} className="text-left">
          <Stat value={counts.newLeads} label="New leads to review" accent={counts.newLeads > 0} />
        </button>
        <button type="button" onClick={() => go("reviews")} className="text-left">
          <Stat value={counts.pending} label="Reviews awaiting approval" accent={counts.pending > 0} />
        </button>
        <Stat value={counts.reviews} label="Total reviews" />
        <Stat value={counts.posts || "—"} label="Blog posts in the CMS" />
        <Stat value={counts.gallery || "—"} label="Gallery items" />
      </div>
      <p className="text-sm leading-relaxed text-muted">
        Reviews go live once you approve them, and every quote and message is kept as a permanent
        record under Leads. Anything you change here appears on the site within about a minute.
      </p>
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<string>("overview");
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      adminApi.listReviews(),
      adminApi.listQuotes(),
      adminApi.listMessages(),
      adminApi.listPosts(),
      adminApi.listGallery(),
    ])
      .then(([reviews, quotes, messages, posts, gallery]) =>
        setCounts({
          newLeads:
            quotes.filter((q) => q.status === "new").length +
            messages.filter((m) => m.status === "new").length,
          pending: reviews.filter((r) => r.status === "pending").length,
          reviews: reviews.length,
          posts: posts.length,
          gallery: gallery.length,
        })
      )
      .catch(() => setCounts({ newLeads: 0, pending: 0, reviews: 0, posts: 0, gallery: 0 }));
  }, []);

  async function signOut() {
    await fetch("/api/admin-login", { method: "DELETE" });
    router.refresh();
  }

  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
      {/* Sidebar */}
      <aside className="mb-6 lg:mb-0">
        <div className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-sm)] lg:sticky lg:top-28">
          <div className="mb-1 hidden items-center gap-2.5 px-3 pb-3 pt-2.5 lg:flex">
            <LogoMark className="h-7 w-7 shrink-0" />
            <div className="leading-tight">
              <div className="font-[family-name:var(--font-bricolage)] text-[0.95rem] font-bold text-ink">
                New Green
              </div>
              <div className="font-[family-name:var(--font-geist-mono)] text-[0.58rem] uppercase tracking-[0.18em] text-muted">
                Owner admin
              </div>
            </div>
          </div>
          <div className="mb-2 hidden h-px bg-line lg:block" />

          <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
            {TABS.map((t) => {
              const active = tab === t.id;
              const n = t.badge && counts ? counts[t.badge] : 0;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full ${
                    active
                      ? "bg-brand-800 text-white shadow-[0_8px_20px_-10px_rgba(18,74,55,0.7)]"
                      : "text-ink/70 hover:bg-surface-muted hover:text-ink"
                  }`}
                >
                  <Icon className="h-[1.2rem] w-[1.2rem] shrink-0" weight={active ? "fill" : "regular"} aria-hidden />
                  <span className="flex-1 whitespace-nowrap text-left">{t.label}</span>
                  {n > 0 && (
                    <span
                      className={`grid h-5 min-w-[1.25rem] place-items-center rounded-full px-1.5 text-[0.68rem] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-accent text-[#241a05]"
                      }`}
                    >
                      {n}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0">
        <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <h1 className="font-[family-name:var(--font-bricolage)] text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
              {current.label}
            </h1>
            <p className="mt-1 text-sm text-muted">{current.desc}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="btn btn-secondary shrink-0 gap-1.5 px-3 py-2 text-sm"
          >
            <SignOut className="h-4 w-4" weight="bold" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        <div className="mt-7">
          {tab === "overview" && <Overview counts={counts} go={setTab} />}
          {tab === "reviews" && <ReviewsPanel />}
          {tab === "leads" && <LeadsPanel />}
          {tab === "pricing" && <PricingPanel />}
          {tab === "gallery" && <GalleryPanel />}
          {tab === "blog" && <BlogPanel />}
          {tab === "site" && <ContentPanel />}
        </div>
      </main>
    </div>
  );
}
