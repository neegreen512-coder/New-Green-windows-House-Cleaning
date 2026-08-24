import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icons";
import { trustPoints } from "@/lib/site";

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface/60" aria-label="Why homeowners trust New Green">
      <div className="container-x py-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {trustPoints.map((point, i) => (
            <Reveal as="li" key={point.label} delay={i * 0.06} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={point.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.92rem] font-semibold leading-tight text-ink">
                  {point.label}
                </span>
                <span className="block truncate text-[0.78rem] text-muted">{point.note}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
