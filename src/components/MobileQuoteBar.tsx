"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { business } from "@/lib/site";

/** Persistent bottom call-to-action for mobile visitors. */
export function MobileQuoteBar() {
  const pathname = usePathname();
  if (pathname === "/quote") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="border-t border-line bg-bg/90 px-4 py-3 backdrop-blur-md [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <a
            href={business.phoneHref}
            aria-label="Call us"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-strong text-brand-800"
          >
            <Phone className="h-5 w-5" strokeWidth={2} />
          </a>
          <Link href="/quote" className="btn btn-primary h-12 flex-1">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
