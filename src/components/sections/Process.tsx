import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icons";
import { processSteps } from "@/lib/site";

export function Process() {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="h2">From quote to spotless in four steps.</h2>
        </Reveal>

        <div className="relative mt-14 lg:mt-20">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-line lg:block" aria-hidden="true" />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 0.08} className="group relative">
                <div className="flex items-center gap-4 lg:block">
                  <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-[0_12px_26px_-10px_rgba(18,74,55,0.65)] ring-1 ring-brand-900/10 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_34px_-12px_rgba(18,74,55,0.8)]">
                    <Icon name={step.icon} className="h-[1.7rem] w-[1.7rem]" weight="fill" />
                  </div>
                  <div className="lg:mt-6">
                    <span className="label-mono text-brand-600">Step {step.n}</span>
                    <h3 className="mt-1 text-[1.15rem] font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
