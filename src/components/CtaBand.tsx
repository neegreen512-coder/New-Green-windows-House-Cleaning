import Link from "next/link";
import { business } from "@/lib/site";

/** Reusable closing call-to-action band for inner pages. */
export function CtaBand({
  title = "Ready for a cleaner home and a brighter view?",
  body = "Get a free, no-pressure quote today. It only takes a minute.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 on-dark px-6 py-14 text-center shadow-[var(--shadow-lg)] sm:px-12 lg:py-20">
          <div className="sweep opacity-40" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="h2">{title}</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-brand-100/80">{body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/quote" className="btn btn-on-dark btn-lg">
                Get a free quote
              </Link>
              <a
                href={business.phoneHref}
                className="btn btn-lg border border-white/30 text-white transition-colors hover:bg-white/10"
              >
                Call {business.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
