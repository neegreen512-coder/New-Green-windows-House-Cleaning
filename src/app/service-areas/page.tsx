import type { Metadata } from "next";
import Image from "next/image";
import { RevealImage } from "@/components/motion";
import { CtaBand } from "@/components/CtaBand";
import { business, serviceAreas, images } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service Areas",
  description: `New Green provides window and house cleaning across ${serviceAreas.areas.join(
    ", "
  )}, and the wider GTA. Ask us about your neighbourhood.`,
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-16 pt-32 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-40">
          <div className="max-w-xl">
            <span className="eyebrow">Service areas</span>
            <h1 className="h1 mt-5">Cleaning across {business.primaryCity} and the GTA.</h1>
            <p className="lead mt-5">{serviceAreas.intro}</p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {serviceAreas.areas.map((a) => (
                <li key={a} className="tag">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <RevealImage>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-xl)]">
              <Image
                src={images.serviceArea.src}
                alt={images.serviceArea.alt}
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
            <span className="eyebrow">Coverage</span>
            <h2 className="h2 mt-4">Communities we clean.</h2>
            <p className="lead mt-5">
              We serve homes throughout the following communities and the surrounding region. If you
              do not see your neighbourhood, ask us. Our service area is growing.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.areas.map((a) => (
              <div key={a} className="card flex items-center justify-between p-5">
                <span className="text-[1.05rem] font-semibold text-ink">{a}</span>
                <span className="label-mono text-brand-700">
                  {a === serviceAreas.primary ? "Primary" : "Serviced"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure if we cover your area?"
        body="Get in touch or request a free quote and we will confirm coverage for your home."
      />
    </>
  );
}
