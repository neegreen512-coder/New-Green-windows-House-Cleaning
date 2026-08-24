import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { Brand } from "./Brand";
import { business, nav } from "@/lib/site";

/* Brand glyphs — lucide removed social/brand icons, so these are inline. */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3 0-1.3-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.24H7.7V13h2.77v8h3.03z" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-950 on-dark">
      <div className="sweep opacity-40" aria-hidden="true" />
      <div className="container-x relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Brand tone="onDark" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-brand-100/75">
              Professional window and house cleaning for homes across {business.region}. A cleaner
              home, a brighter view, and a service you can rely on.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { glyph: <InstagramGlyph className="h-[1.15rem] w-[1.15rem]" />, href: business.social.instagram, label: "Instagram" },
                { glyph: <FacebookGlyph className="h-[1.15rem] w-[1.15rem]" />, href: business.social.facebook, label: "Facebook" },
                { glyph: <Star className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.7} />, href: business.social.google, label: "Reviews" },
              ].map(({ glyph, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-brand-100/85 transition-colors hover:border-white/40 hover:text-white"
                >
                  {glyph}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <FooterCol title="Services" links={nav.services} />

          {/* Company */}
          <FooterCol
            title="Company"
            links={[{ label: "Home", href: "/" }, ...nav.main]}
          />

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-100/70">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-3.5 text-[0.95rem] text-brand-100/85">
              <li>
                <a href={business.phoneHref} className="inline-flex items-center gap-2.5 hover:text-white">
                  <Phone className="h-4 w-4 text-accent-soft" strokeWidth={1.8} />
                  {business.phone}
                </a>
              </li>
              <li>
                <a href={business.emailHref} className="inline-flex items-center gap-2.5 hover:text-white">
                  <Mail className="h-4 w-4 text-accent-soft" strokeWidth={1.8} />
                  {business.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" strokeWidth={1.8} />
                <span>{business.address}</span>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" strokeWidth={1.8} />
                <span>{business.hours}</span>
              </li>
            </ul>
            <Link href="/quote" className="btn btn-accent mt-6">
              Get a Free Quote
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-brand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Oversized brand wordmark */}
      <div aria-hidden="true" className="pointer-events-none relative select-none px-4">
        <span className="block translate-y-[14%] text-center font-[family-name:var(--font-bricolage)] text-[clamp(4rem,21vw,17rem)] font-extrabold leading-[0.7] tracking-[-0.045em] text-white/[0.055] whitespace-nowrap">
          New Green
        </span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-100/70">{title}</h3>
      <ul className="mt-5 space-y-3 text-[0.95rem] text-brand-100/85">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
