"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  SquaresFour,
  Star,
  Tray,
  Tag,
  ChatCircle,
  PencilSimple,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { ReviewsPanel } from "./ReviewsPanel";
import { LeadsPanel } from "./LeadsPanel";
import { PricingPanel } from "./PricingPanel";
import { BlogPanel } from "./BlogPanel";
import { LogoMark } from "@/components/Brand";
import { adminApi } from "@/lib/adminClient";

type Counts = { newLeads: number; pending: number; reviews: number; posts: number };
type IconType = ComponentType<{ className?: string; weight?: "regular" | "fill"; "aria-hidden"?: boolean }>;

const TABS: {
  id: string;
  label: string;
  desc: string;
  icon: IconType;
  badge?: keyof Counts;
}[] = [
  { id: "overview", label: "Overview", desc: "A quick snapshot of your business.", icon: SquaresFour },
  { id: "leads", label: "Leads", desc: "Quote requests and contact messages.", icon: Tray, badge: "newLeads" },
  { id: "reviews", label: "Reviews", desc: "Approve, feature, and edit customer reviews.", icon: Star, badge: "pending" },
  { id: "pricing", label: "Pricing", desc: "Your service packages and prices.", icon: Tag },
  { id: "blog", label: "Blog", desc: "Write and manage your blog posts.", icon: PencilSimple },
];

function Stat({
  value,
  label,
  icon: Icon,
  accent,
  onClick,
}: {
  value: number | string;
  label: string;
  icon: IconType;
  accent?: boolean;
  onClick?: () => void;
}) {
  const cls = `card p-5 text-left ${onClick ? "transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]" : ""}`;
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            accent ? "bg-accent/15 text-accent" : "bg-brand-50 text-brand-700"
          }`}
        >
          <Icon className="h-[1.1rem] w-[1.1rem]" weight="fill" aria-hidden />
        </span>
        {accent ? (
          <span className="font-[family-name:var(--font-geist-mono)] text-[0.58rem] uppercase tracking-[0.16em] text-accent">
            Needs you
          </span>
        ) : null}
      </div>
      <div
        className={`mt-3 font-[family-name:var(--font-bricolage)] text-[2rem] font-bold leading-none ${
          accent ? "text-accent" : "text-brand-800"
        }`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[0.85rem] leading-snug text-muted">{label}</div>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} w-full`}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function Overview({ counts, go }: { counts: Counts | null; go: (t: string) => void }) {
  if (!counts) return <p className="text-sm text-muted">Loading your summary...</p>;
  return (
    <div className="space-y-7">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Tray} value={counts.newLeads} label="New leads to review" accent={counts.newLeads > 0} onClick={() => go("leads")} />
        <Stat icon={Star} value={counts.pending} label="Reviews awaiting approval" accent={counts.pending > 0} onClick={() => go("reviews")} />
        <Stat icon={ChatCircle} value={counts.reviews} label="Approved reviews" />
        <Stat icon={PencilSimple} value={counts.posts || "—"} label="Blog posts" />
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-ink">Quick actions</h3>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => go("leads")} className="btn btn-secondary btn-sm">
            View new leads
          </button>
          <button type="button" onClick={() => go("reviews")} className="btn btn-secondary btn-sm">
            Moderate reviews
          </button>
          <button type="button" onClick={() => go("pricing")} className="btn btn-secondary btn-sm">
            Edit pricing
          </button>
          <button type="button" onClick={() => go("blog")} className="btn btn-secondary btn-sm">
            Write a post
          </button>
        </div>
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
    ])
      .then(([reviews, quotes, messages, posts]) =>
        setCounts({
          newLeads:
            quotes.filter((q) => q.status === "new").length +
            messages.filter((m) => m.status === "new").length,
          pending: reviews.filter((r) => r.status === "pending").length,
          reviews: reviews.length,
          posts: posts.length,
        })
      )
      .catch(() => setCounts({ newLeads: 0, pending: 0, reviews: 0, posts: 0 }));
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
          {tab === "leads" && <LeadsPanel />}
          {tab === "reviews" && <ReviewsPanel />}
          {tab === "pricing" && <PricingPanel />}
          {tab === "blog" && <BlogPanel />}
        </div>
      </main>
    </div>
  );
}
