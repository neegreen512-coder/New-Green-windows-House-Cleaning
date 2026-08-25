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
            <span className="eyebrow text-accent-soft">Before &amp; after</span>
            <h2 className="h2 mt-4 text-white">See the difference a real clean makes.</h2>
            <p className="lead mt-5 text-brand-100/80">
              Drag the handle. On the left, a typical starting point. On the right, what we hand
              back: glass, surfaces, and the corners in between actually clean.
            </p>
            <Link href="/quote" className="btn btn-accent mt-8">
              Get a free quote
              <ArrowRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <BeforeAfter
              before={{
                src: images.windowsView.src,
                alt: "The same exterior window looking grimy and streaked before a New Green clean",
              }}
              after={images.windowsView}
              treatBefore
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
