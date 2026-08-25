"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewsPanel } from "./ReviewsPanel";
import { LeadsPanel } from "./LeadsPanel";
import { PricingPanel } from "./PricingPanel";
import { ContentPanel } from "./ContentPanel";

const TABS = [
  { id: "reviews", label: "Reviews" },
  { id: "leads", label: "Leads" },
  { id: "pricing", label: "Pricing" },
  { id: "content", label: "Content" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("reviews");

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
        Approve reviews, edit pricing packages, and update text. Changes appear on the site without a
        rebuild.
      </p>

      <div className="mt-8 flex gap-1 rounded-xl border border-line bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-brand-800 text-white" : "text-ink hover:bg-surface-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "leads" && <LeadsPanel />}
        {tab === "pricing" && <PricingPanel />}
        {tab === "content" && <ContentPanel />}
      </div>
    </div>
  );
}
