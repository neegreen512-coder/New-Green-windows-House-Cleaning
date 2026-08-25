import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealImage } from "@/components/motion";
import { Icon } from "@/components/icons";
import { CountUp } from "@/components/CountUp";
import { business, principles, images, areaNames } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "New Green is an owner-operated window and house cleaning company serving Mississauga and the GTA, built on careful work, the same trusted cleaner each visit, and a genuine standard of care.",
  alternates: { canonical: "/about" },
};

const stats = [
  { to: 15, suffix: " yrs", label: "Caring for GTA homes" },
  { to: areaNames.length, suffix: " cities", label: "Across Mississauga & the GTA" },
  { to: 1, suffix: " cleaner", label: "The same familiar face" },
  { to: 100, suffix: "%", label: "Make-it-right guarantee" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-12 pt-28 lg:grid-cols-2 lg:gap-16 lg:pb-16 lg:pt-32">
          <div className="max-w-xl">
            <span className="eyebrow">Our story</span>
            <h1 className="h1 mt-5">
              We treat your home the way we&apos;d want ours treated.
            </h1>
            <p className="lead mt-5">
              New Green is an owner-operated window and house cleaning company in{" "}
              {business.primaryCity}. We started small, with a bucket, a squeegee, and a simple
              promise: leave every home better than we found it, and mean it.
            </p>
          </div>
          <RevealImage>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-xl)]">
              <Image
                src={images.aboutHuman.src}
                alt={images.aboutHuman.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </RevealImage>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-surface-muted">
        <div className="container-x grid grid-cols-2 gap-8 py-10 lg:grid-cols-4 lg:py-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05} className="text-center lg:text-left">
              <CountUp
                to={s.to}
                suffix={s.suffix}
                className="block font-[family-name:var(--font-bricolage)] text-[2.1rem] font-bold leading-none text-brand-800"
              />
              <div className="mt-2 text-[0.9rem] leading-snug text-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The story */}
      <section className="section">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl">
            <span className="eyebrow">Why we started</span>
            <h2 className="h2 mt-4">A clean home is a kind of quiet respect.</h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-muted">
              <p>
                For a lot of families, the home is where the whole week finally slows down. But
                keeping it clean, really clean, is hard to fit around work, kids, and everything
                else. We watched people give up their weekends to it, or hand it to a faceless
                agency that sent someone different every time and never quite got the corners.
              </p>
              <p>
                We thought there was a better way to do this. So we built New Green around a small,
                old-fashioned idea: send the same trusted person, teach them to care about the
                details, stand behind the work, and never treat a home like just another job on the
                list.
              </p>
              <p>
                Years later, that is still the whole business. When we wipe down a window until the
                light pours through, or reach the track behind the tap that most people skip, it is
                not for show. It is because someone lives here, and the way their home feels when
                they walk back into it matters to us.
              </p>
            </div>
            <p className="mt-6 font-[family-name:var(--font-bricolage)] text-[1.05rem] font-semibold text-ink">
              That is the standard on every visit. No exceptions, no off days.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="section bg-surface-muted pt-0">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">What we stand for</span>
            <h2 className="h2 mt-4">The principles behind every visit.</h2>
            <p className="lead mt-5">
              These are not slogans on a van. They are the promises we actually keep, on the good
              days and the busy ones.
            </p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="flex gap-4">
                  <span className="icon-tile h-12 w-12 shrink-0 rounded-2xl">
                    <Icon name={p.icon} className="h-[1.4rem] w-[1.4rem]" />
                  </span>
                  <div>
                    <h3 className="text-[1.15rem] font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The promise */}
      <section className="section">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 on-dark px-6 py-14 shadow-[var(--shadow-lg)] sm:px-12 lg:py-16">
            <div className="sweep opacity-40" aria-hidden="true" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="eyebrow text-accent-soft">Our promise to you</span>
                <h2 className="h2 mt-4 text-white">If it&apos;s not right, we come back.</h2>
                <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-brand-100/85">
                  We are owner-run, insured, and bonded, and our cleaners are background-checked. But
                  the real guarantee is simpler than any of that: if a visit is not up to standard,
                  tell us and we will return to put it right. That is what keeps people with us, year
                  after year.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/quote" className="btn btn-on-dark btn-lg">
                  Get a free quote
                  <ArrowRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                </Link>
                <Link
                  href="/service-areas"
                  className="btn btn-lg border border-white/30 text-white transition-colors hover:bg-white/10"
                >
                  See where we work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
