import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/CtaBand";
import { business, serviceAreas, areaNames } from "@/lib/site";
import { getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Service Areas",
  description: `New Green provides window and house cleaning across ${areaNames.join(
    ", "
  )}, and the wider GTA. Ask us about your neighbourhood.`,
  alternates: { canonical: "/service-areas" },
};

export const revalidate = 60;

export default async function ServiceAreasPage() {
  const settings = await getSettings();

  // Owner-edited cities (text) reuse the curated landmark images, cycled.
  const pool = serviceAreas.areas.map((a) => a.image);
  let areas = serviceAreas.areas as {
    name: string;
    landmark: string;
    blurb: string;
    image: { src: string; alt: string };
  }[];
  try {
    const parsed = settings.areas ? JSON.parse(settings.areas) : [];
    if (Array.isArray(parsed) && parsed.length) {
      areas = parsed
        .filter((a) => a?.name)
        .map((a, i) => ({
          name: a.name,
          landmark: a.landmark || "",
          blurb: a.blurb || "",
          image: pool[i % pool.length],
        }));
    }
  } catch {
    /* keep code defaults */
  }

  return (
    <>
      {/* Hero (no generic map — the cities speak for themselves below) */}
      <section className="relative overflow-hidden">
        <div className="container-x pb-10 pt-28 lg:pb-12 lg:pt-32">
          <div className="max-w-2xl">
            <span className="eyebrow">Service areas</span>
            <h1 className="h1 mt-5">Cleaning across {business.primaryCity} and the GTA.</h1>
            <p className="lead mt-5">{serviceAreas.intro}</p>
          </div>
        </div>
      </section>

      {/* Landmark cards — the place each community is known for */}
      <section className="section pt-2">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => {
              const isPrimary = area.name === serviceAreas.primary;
              return (
                <Reveal key={`${area.name}-${i}`} delay={(i % 3) * 0.06}>
                  <article className="card card-hover group flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={area.image.src}
                        alt={area.image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div
                        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(11,42,34,0.72)_100%)]"
                        aria-hidden="true"
                      />
                      {isPrimary && (
                        <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-[#241a05]">
                          Home base
                        </span>
                      )}
                      {area.landmark && (
                        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-4 text-white">
                          <MapPin className="h-4 w-4 text-brand-100" strokeWidth={2} />
                          <span className="text-[0.82rem] font-medium text-brand-50/90">
                            Known for {area.landmark}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-[1.25rem] font-semibold text-ink">{area.name}</h2>
                      {area.blurb && (
                        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{area.blurb}</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
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
