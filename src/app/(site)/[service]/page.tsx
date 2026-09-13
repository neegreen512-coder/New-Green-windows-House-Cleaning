import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, RevealImage } from "@/components/motion";
import { CtaBand } from "@/components/CtaBand";
import { services, getService, business } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[service]">): Promise<Metadata> {
  const { service } = await params;
  const s = getService(service);
  if (!s) return {};
  return {
    title: s.pageTitle,
    description: s.meta,
    alternates: { canonical: `/${s.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/[service]">) {
  const { service } = await params;
  const s = getService(service);
  if (!s) notFound();

  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-12 pt-28 lg:grid-cols-2 lg:gap-16 lg:pb-16 lg:pt-32">
          <div className="max-w-xl">
            <span className="eyebrow">{s.shortTitle}</span>
            <h1 className="h1 mt-5">{s.title}</h1>
            <p className="lead mt-5">{s.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="btn btn-primary btn-lg">
                Get a free quote
                <ArrowRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
              </Link>
              <a href={business.phoneHref} className="btn btn-secondary btn-lg">
                Call {business.phone}
              </a>
            </div>
          </div>
          <RevealImage>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-xl)]">
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </RevealImage>
        </div>
      </section>

      {/* What's included */}
      <section className="section bg-surface-muted">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <span className="eyebrow">What&apos;s included</span>
              <h2 className="h2 mt-4">The details we cover.</h2>
              <p className="lead mt-5">{s.audience}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.98rem] text-ink/85">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="section">
        <div className="container-x">
          <span className="eyebrow">More from New Green</span>
          <h2 className="h2 mt-4">Explore our other services.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/${o.slug}`} className="card card-hover group flex flex-col p-6">
                <span className="label-mono text-brand-700">{o.shortTitle}</span>
                <h3 className="mt-3 text-[1.2rem] font-semibold text-ink">{o.title}</h3>
                <p className="mt-2 flex-1 text-[0.94rem] leading-relaxed text-muted">{o.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-800">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ready to book your ${s.shortTitle.toLowerCase()}?`}
        body="Tell us about your home and we will follow up with clear, no-pressure pricing."
      />
    </>
  );
}
