"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getSettings } from "@/lib/cms";

type Banner = { on?: boolean; text?: string; href?: string; label?: string };

const BAR_H = "2.5rem";

/**
 * Owner-toggled promo bar. Reads the `banner` block from the CMS content store,
 * is dismissible per visitor, and offsets the fixed header via --ng-banner-h so
 * the two never overlap.
 */
export function SiteBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let active = true;
    getSettings()
      .then((s) => {
        if (!active) return;
        try {
          const b: Banner = s.banner ? JSON.parse(s.banner) : {};
          if (b && b.on && b.text) {
            setBanner(b);
            let seen = "";
            try {
              seen = localStorage.getItem("ng-banner") || "";
            } catch {}
            setDismissed(seen === b.text);
          }
        } catch {
          /* ignore malformed banner */
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const show = !!banner && !dismissed;

  useEffect(() => {
    const root = document.documentElement;
    if (show) root.style.setProperty("--ng-banner-h", BAR_H);
    else root.style.setProperty("--ng-banner-h", "0px");
    return () => root.style.setProperty("--ng-banner-h", "0px");
  }, [show]);

  if (!show || !banner) return null;

  function dismiss() {
    try {
      if (banner?.text) localStorage.setItem("ng-banner", banner.text);
    } catch {}
    setDismissed(true);
  }

  const Inner = (
    <span className="truncate">
      {banner.text}
      {banner.href && banner.label && (
        <span className="ml-2 font-semibold underline underline-offset-2">{banner.label}</span>
      )}
    </span>
  );

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center bg-brand-800 px-10 text-center text-[0.85rem] font-medium text-white"
      style={{ height: BAR_H }}
    >
      {banner.href ? (
        <Link href={banner.href} className="inline-flex min-w-0 items-center hover:text-brand-50">
          {Inner}
        </Link>
      ) : (
        Inner
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 grid h-6 w-6 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
