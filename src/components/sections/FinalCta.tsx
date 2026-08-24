import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/motion";
import { business } from "@/lib/site";

export function FinalCta({
  title = "Ready for a cleaner home and a brighter view?",
  subtitle = "Tell us about your home and get a free, no-obligation quote. Every home is different, so we'll help you find the right service.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-800 on-dark">
      <div className="sweep opacity-30" aria-hidden="true" />
      <div
        className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-x relative py-16 lg:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="h2 text-white">{title}</h2>
          <p className="lead mx-auto mt-5 max-w-xl text-brand-100/85">{subtitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quote" className="btn btn-accent btn-lg">
              Get My Free Quote
              <ArrowRight className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
            </Link>
            <a href={business.phoneHref} className="btn btn-on-dark btn-lg">
              <Phone className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
              {business.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
