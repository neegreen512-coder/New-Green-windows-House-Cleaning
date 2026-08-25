import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icons";
import { Pricing } from "@/components/sections/Pricing";
import { CtaBand } from "@/components/CtaBand";
import { faqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "How New Green prices window and house cleaning: a clear, itemised estimate based on your home's size, the services you choose, and how often we visit. No hidden fees.",
  alternates: { canonical: "/pricing" },
};

const factors = [
  {
    icon: "target",
    title: "The size of your home",
    body: "Square footage, number of rooms, and how many windows all shape the time a visit takes.",
  },
  {
    icon: "sparkles",
    title: "The services you choose",
    body: "Windows, a full house clean, or a one-time deep reset. Mix what you need and skip what you don't.",
  },
  {
    icon: "calendar",
    title: "How often we visit",
    body: "Recurring weekly, bi-weekly, or monthly plans cost less per visit than a one-time clean.",
  },
  {
    icon: "clock",
    title: "The condition on day one",
    body: "A first deep clean or a long-neglected space takes more work than keeping an already-tidy home fresh.",
  },
];

const included = [
  "Insured & bonded, background-checked cleaners",
  "All supplies and equipment brought to you",
  "Eco-friendly products, safe for kids and pets",
  "The same cleaner wherever possible",
  "A clear quote before anything is booked",
  "Our make-it-right guarantee on every visit",
];

const priceFaqs = faqs.filter((f) =>
  /cost|price|book|recurring|one-time/i.test(f.q)
);

export default function PricingPage() {
  return (
    <>
      <h1 className="sr-only">Window and house cleaning prices in Mississauga and the GTA</h1>
      {/* Starting-price cards (live from the CMS, with a safe fallback).
          First element on the page, so it carries top padding to clear the header. */}
      <Pricing eyebrow="" className="pt-28 lg:pt-32" />

      {/* What goes into your price */}
      <section className="section bg-surface-muted">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">How it's calculated</span>
            <h2 className="h2 mt-4">What goes into your price.</h2>
            <p className="lead mt-5">
              Four things decide your final number. Tell us about them when you request a quote and
              we will put it all in writing.
            </p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {factors.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="flex gap-4">
                  <span className="icon-tile h-12 w-12 shrink-0 rounded-2xl">
                    <Icon name={f.icon} className="h-[1.4rem] w-[1.4rem]" />
                  </span>
                  <div>
                    <h3 className="text-[1.15rem] font-semibold text-ink">{f.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's always included */}
      <section className="section">
        <div className="container-x">
          <div className="grid items-center gap-10 rounded-[2rem] border border-line bg-surface p-8 shadow-[var(--shadow-md)] sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <span className="eyebrow">No fine print</span>
              <h2 className="h2 mt-4">Every quote already includes it.</h2>
              <p className="lead mt-5">
                The price we give you is the price you pay. These are part of every New Green visit,
                never an add-on line at the end.
              </p>
            </div>
            <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.98rem] text-ink/85">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      {priceFaqs.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="max-w-2xl">
              <span className="eyebrow">Good to know</span>
              <h2 className="h2 mt-4">Pricing questions, answered.</h2>
            </div>
            <dl className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
              {priceFaqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-[1.05rem] font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-[0.96rem] leading-relaxed text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <CtaBand
        title="Ready for a number you can trust?"
        body="Send us a few details about your home and we will follow up with a clear, itemised quote."
      />
    </>
  );
}
