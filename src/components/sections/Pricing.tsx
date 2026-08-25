"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/motion";
import { pricingFallback, type PricingPackage } from "@/lib/site";
import { getPricing } from "@/lib/cms";

const FALLBACK: PricingPackage[] = pricingFallback;

export function Pricing() {
  const [items, setItems] = useState<PricingPackage[] | null>(null);

  useEffect(() => {
    let active = true;
    getPricing()
      .then((live) => {
        if (!active) return;
        const mapped = live.map((p) => ({
          name: p.name,
          blurb: p.blurb,
          price: p.price,
          unit: p.unit,
          features: p.features,
          featured: !!p.featured,
        }));
        setItems(mapped.length ? mapped : FALLBACK);
      })
      .catch(() => active && setItems(FALLBACK));
    return () => {
      active = false;
    };
  }, []);

  const cards = items ?? FALLBACK;

  return (
    <section id="pricing" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward pricing, no surprises."
          lead="We price each job by its size and scope, and you see the number before anything is booked. Here is what each service covers."
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div
                className={`card relative flex h-full flex-col p-7 ${
                  p.featured ? "ring-2 ring-brand-700" : ""
                }`}
              >
                {p.featured && (
                  <span className="absolute right-6 top-6 label-mono text-brand-700">
                    Most popular
                  </span>
                )}
                <h3 className="text-[1.3rem] font-semibold text-ink">{p.name}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.blurb}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-bricolage)] text-[1.9rem] font-bold text-ink">
                    {p.price}
                  </span>
                  {p.unit && <span className="text-sm text-muted">{p.unit}</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.94rem] text-ink/85">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/quote"
                  className={`btn mt-7 ${p.featured ? "btn-primary" : "btn-secondary"}`}
                >
                  Get a free quote
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
