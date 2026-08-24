import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Faq } from "@/components/Faq";
import { faqs } from "@/lib/site";

export function FaqSection() {
  return (
    <section className="section bg-surface-muted">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <span className="eyebrow">Good to know</span>
            <h2 className="h2 mt-4">Frequently asked questions.</h2>
            <p className="lead mt-5">
              A few of the things homeowners ask most. Have another question?
            </p>
            <Link href="/contact" className="btn btn-secondary mt-6">
              Contact us
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <Faq items={faqs.slice(0, 6)} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
