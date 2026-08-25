import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealImage } from "@/components/motion";
import { Icon } from "@/components/icons";
import { CtaBand } from "@/components/CtaBand";
import { business, principles, images, serviceAreas } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "New Green is a window and house cleaning company serving Mississauga and the GTA, built on careful work, reliable service, and a genuine standard of care.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-16 pt-32 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-40">
          <div className="max-w-xl">
            <span className="eyebrow">About us</span>
            <h1 className="h1 mt-5">A local team that treats your home like ours.</h1>
            <p className="lead mt-5">
              New Green is an owner-operated window and house cleaning company. We have cleaned homes
              around {business.primaryCity} for about five years, and we are now expanding across the
              GTA.
            </p>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
              Because we are owner-run, the person who quotes your home is invested in how it turns
              out. Our cleaners are background-checked, insured, and bonded; we send the same cleaner
              wherever we can; and we use eco-friendly products that are safe for kids and pets.
            </p>
          </div>
          <RevealImage>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-xl)]">
              <Image
                src={images.cleaningAction.src}
                alt={images.cleaningAction.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </RevealImage>
        </div>
      </section>

      <section className="section bg-surface-muted">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">What we stand for</span>
            <h2 className="h2 mt-4">The principles behind every visit.</h2>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-brand-700 shadow-[var(--shadow-sm)] ring-1 ring-line">
                  <Icon name={p.icon} className="h-[1.35rem] w-[1.35rem]" />
                </span>
                <h3 className="mt-4 text-[1.15rem] font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="grid items-center gap-8 rounded-[2rem] border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="eyebrow">Where we work</span>
              <h2 className="h2 mt-4">Proudly serving {business.primaryCity} and the GTA.</h2>
              <p className="lead mt-5">{serviceAreas.intro}</p>
              <Link
                href="/service-areas"
                className="group mt-7 inline-flex items-center gap-2 font-semibold text-brand-800"
              >
                See all service areas
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </Link>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {serviceAreas.areas.map((a) => (
                <li key={a} className="tag">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
