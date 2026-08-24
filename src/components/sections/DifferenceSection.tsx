import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { BeforeAfter } from "@/components/BeforeAfter";
import { images } from "@/lib/site";

export function DifferenceSection() {
  return (
    <section className="relative overflow-hidden bg-brand-950 on-dark">
      <div className="sweep opacity-30" aria-hidden="true" />
      <div className="container-x section relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow text-accent-soft">See the difference</span>
            <h2 className="h2 mt-4 text-white">Clean you can actually see.</h2>
            <p className="lead mt-5 text-brand-100/80">
              Drag the handle to see how much brighter a space feels once the glass and surfaces
              are truly clean. More daylight, clearer views, and a home that feels cared for.
            </p>
            <p className="mt-4 text-sm text-brand-100/55">
              Illustrative demonstration of the effect, not a photo of a specific customer&apos;s home.
            </p>
            <Link href="/quote" className="btn btn-accent mt-8">
              Get a Free Quote
              <ArrowRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <BeforeAfter before={images.beforeMessy} after={images.afterClean} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
