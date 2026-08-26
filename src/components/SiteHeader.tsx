"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List, Phone, X } from "@phosphor-icons/react/dist/ssr";
import { LogoMark } from "./Brand";
import { business, nav } from "@/lib/site";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className="group relative px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[0.72rem] font-bold uppercase tracking-[0.13em] text-ink/80 transition-colors hover:text-ink"
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-3 right-3 h-[2px] origin-left rounded-full bg-ink transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

/** Compact brand lockup: the "N" mark + the full name stacked so it fits. */
function HeaderLockup() {
  return (
    <Link href="/" aria-label={`${business.name}, home`} className="inline-flex items-center gap-2.5">
      <LogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="flex flex-col leading-none">
        <span className="font-[family-name:var(--font-bricolage)] text-[1.15rem] font-bold tracking-[-0.02em] text-ink">
          New Green
        </span>
        <span className="mt-[3px] font-[family-name:var(--font-geist-mono)] text-[0.52rem] font-medium uppercase tracking-[0.22em] text-muted">
          Windows &amp; House Cleaning
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x pt-3 sm:pt-4">
        <div
          className={`relative rounded-2xl border px-4 transition-all duration-300 sm:px-5 ${
            scrolled
              ? "border-line bg-surface/95 shadow-[0_12px_44px_-24px_rgba(16,40,32,0.65)] backdrop-blur-xl"
              : "border-line bg-surface/85 shadow-[0_8px_28px_-20px_rgba(16,40,32,0.5)] backdrop-blur-md"
          }`}
        >
          <div className="flex h-16 items-center justify-between gap-4">
            <HeaderLockup />

            <div className="flex items-center">
              {/* Desktop nav, pushed to the right */}
              <nav className="hidden items-center lg:flex" aria-label="Primary">
                <NavLink href="/" label="Home" />
                {nav.main.map((item) => (
                  <NavLink key={item.href} href={item.href} label={item.label} />
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface/70 text-ink lg:hidden"
                aria-label="Open menu"
              >
                <List className="h-5 w-5" weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[min(88%,22rem)] flex-col bg-bg shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[4.75rem] items-center justify-between border-b border-line px-5">
            <HeaderLockup />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-ink"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" weight="bold" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
            <Link
              href="/"
              className="block rounded-xl px-3 py-3 text-lg font-semibold text-ink transition-colors hover:text-brand-800"
            >
              Home
            </Link>
            {nav.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-lg font-semibold text-ink transition-colors hover:text-brand-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-3 border-t border-line px-5 py-5">
            <Link href="/quote" className="btn btn-primary btn-lg w-full">
              Get a free quote
            </Link>
            <a href={business.phoneHref} className="btn btn-secondary w-full">
              <Phone className="h-4 w-4" weight="bold" />
              {business.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
