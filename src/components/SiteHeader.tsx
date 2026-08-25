"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, CaretDown, List, Phone, X } from "@phosphor-icons/react/dist/ssr";
import { Brand, LogoMark } from "./Brand";
import { HeaderWaterLogo } from "./HeaderWaterLogo";
import { business, nav } from "@/lib/site";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className="group relative px-3 py-2 text-[0.94rem] font-medium text-ink/80 transition-colors hover:text-brand-800"
    >
      {label}
      <span
        className={`absolute bottom-1 left-3 right-3 h-[2px] origin-left rounded-full bg-brand-600 transition-transform duration-300 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
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
          className={`relative rounded-2xl border pl-5 pr-3 transition-all duration-300 ${
            scrolled
              ? "border-line bg-surface/95 shadow-[0_12px_44px_-24px_rgba(16,40,32,0.65)] backdrop-blur-xl"
              : "border-line bg-surface/85 shadow-[0_8px_28px_-20px_rgba(16,40,32,0.5)] backdrop-blur-md"
          }`}
        >
          <div className={`flex items-center justify-between gap-4 ${scrolled ? "h-14" : "h-16"}`}>
            <Link href="/" aria-label="New Green, home" className="inline-flex items-center gap-2.5">
              <LogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
              <HeaderWaterLogo className="h-9 w-auto sm:h-11" />
            </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            <div className="group relative">
              <button
                className="relative flex items-center gap-1 px-3 py-2 text-[0.94rem] font-medium text-ink/80 transition-colors hover:text-brand-800"
                aria-haspopup="true"
              >
                Services
                <CaretDown
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180"
                  weight="bold"
                />
              </button>
              <div className="invisible absolute left-0 top-full translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="w-72 rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-lg)]">
                  <p className="px-3 pb-1.5 pt-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted">
                    Our services
                  </p>
                  {nav.services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="group/svc flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[0.94rem] font-medium text-ink/85 transition-colors hover:bg-brand-50 hover:text-brand-800"
                    >
                      {s.label}
                      <ArrowRight
                        className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/svc:translate-x-0 group-hover/svc:opacity-100"
                        weight="bold"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {nav.main.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/quote" className="btn btn-primary hidden h-11 sm:inline-flex">
              Get a free quote
            </Link>
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
            <Brand />
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
            <button
              onClick={() => setServicesOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-lg font-semibold text-ink"
              aria-expanded={servicesOpen}
            >
              Services
              <CaretDown className={`h-5 w-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} weight="bold" />
            </button>
            {servicesOpen && (
              <div className="mb-2 ml-3 border-l border-line pl-3">
                {nav.services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-muted transition-colors hover:text-brand-800"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
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
