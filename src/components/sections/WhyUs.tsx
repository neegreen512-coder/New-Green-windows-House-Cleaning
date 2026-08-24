import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icons";
import { principles } from "@/lib/site";

export function WhyUs() {
  return (
    <section className="section bg-surface-muted">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">Why New Green</span>
            <h2 className="h2 mt-4">A service built on the details.</h2>
            <p className="lead mt-5">
              We&apos;re a newer company with an old-fashioned commitment to doing the job properly.
              Here&apos;s what you can count on with every visit.
            </p>
            <Link href="/about" className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-800">
              More about our approach
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </Link>
          </Reveal>

          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="flex flex-col">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-brand-700 shadow-[var(--shadow-sm)] ring-1 ring-line">
                    <Icon name={p.icon} className="h-[1.35rem] w-[1.35rem]" />
                  </span>
                  <h3 className="mt-4 text-[1.15rem] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
