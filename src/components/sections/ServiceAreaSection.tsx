import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Reveal, RevealImage } from "@/components/motion";
import { serviceAreas, images } from "@/lib/site";

export function ServiceAreaSection() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">Where we work</span>
            <h2 className="h2 mt-4">Serving homes across the region.</h2>
            <p className="lead mt-5">{serviceAreas.intro}</p>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {serviceAreas.areas.map((area, i) => (
                <li key={`${area}-${i}`}>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-1.5 text-[0.9rem] font-medium text-ink/85">
                    <MapPin className="h-3.5 w-3.5 text-brand-600" strokeWidth={2} />
                    {area}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/contact" className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-800">
              Ask about your area
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </Link>
          </Reveal>

          <RevealImage delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-lg)]">
              <Image
                src={images.serviceArea.src}
                alt={images.serviceArea.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brand-950/75 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4 text-accent-soft" strokeWidth={2} />
                <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em]">
                  Mississauga &amp; the GTA
                </span>
              </div>
            </div>
          </RevealImage>
        </div>
      </div>
    </section>
  );
}
