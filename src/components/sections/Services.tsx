import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, RevealImage } from "@/components/motion";
import { SectionHeading } from "@/components/SectionHeading";
import { homeServices, type Service } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="What we do"
          title="Two services. One standard of care."
          lead="From crystal-clear windows to a spotless home, New Green covers the details that make a house feel genuinely clean."
        />

        <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
          {homeServices.map((service, i) => (
            <ServiceRow key={service.slug} service={service} flip={i % 2 === 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, flip, index }: { service: Service; flip: boolean; index: number }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <RevealImage className={flip ? "lg:order-2" : ""}>
        <div className="group relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line shadow-[var(--shadow-lg)]">
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </RevealImage>

      <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-mono)] text-sm font-medium text-brand-700">
            {`0${index + 1}`}
          </span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="label-mono">{service.shortTitle}</span>
        </div>
        <h3 className="h3 mt-5 text-[1.6rem]">{service.title}</h3>
        <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">{service.summary}</p>

        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {service.includes.slice(0, 6).map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[0.94rem] text-ink/85">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/${service.slug}`}
          className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand-800"
        >
          Explore {service.shortTitle}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
        </Link>
      </Reveal>
    </div>
  );
}
