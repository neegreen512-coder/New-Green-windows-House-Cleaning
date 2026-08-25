import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { faqCategories, business } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about New Green window and house cleaning: pricing, booking, what's included, supplies, safety, guarantees, and service areas.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x pb-10 pt-28 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow eyebrow--center justify-center">FAQ</span>
            <h1 className="h1 mt-4">Questions, answered.</h1>
            <p className="lead mt-5">
              Everything worth knowing before you book, grouped so you can find it fast. If your
              question isn&apos;t here, we&apos;re a phone call away.
            </p>
          </div>
        </div>
      </section>

      {/* Categorised FAQs + contact sidebar */}
      <section className="section pt-4">
        <div className="container-x grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="card p-7">
              <h2 className="text-[1.25rem] font-semibold text-ink">Prefer to talk it through?</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                Can&apos;t find your answer, or want advice for your specific home? Reach out, no
                pressure and no obligation.
              </p>
              <div className="mt-6 space-y-3">
                <a href={business.phoneHref} className="btn btn-primary w-full">
                  Call {business.phone}
                </a>
                <a href={business.emailHref} className="btn btn-secondary w-full">
                  Email us
                </a>
              </div>
              <dl className="mt-7 space-y-3 border-t border-line pt-6 text-[0.9rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Hours</dt>
                  <dd className="text-right font-medium text-ink">{business.hours}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Serving</dt>
                  <dd className="text-right font-medium text-ink">{business.primaryCity} &amp; the GTA</dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="space-y-12">
            {faqCategories.map((cat, ci) => (
              <div key={cat.title}>
                <div className="flex items-baseline gap-3">
                  <span className="label-mono text-ink/50">
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[1.4rem] font-semibold text-ink">{cat.title}</h2>
                </div>
                <div className="mt-5">
                  <Faq items={cat.items} defaultOpen={ci === 0 ? 0 : null} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Still have a question?"
        body="Call us or request a free quote, and we will walk you through the details."
      />
    </>
  );
}
