import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { CtaBand } from "@/components/CtaBand";
import { faqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about New Green window and house cleaning: pricing, what is included, booking, supplies, and service areas.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x pb-4 pt-32 lg:pt-40">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow eyebrow--center">FAQ</span>
            <h1 className="h1 mt-4">Questions, answered.</h1>
            <p className="lead mt-5">
              Everything you might want to know before booking. If your question is not here, reach
              out and we will be glad to help.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Still have a question?"
        body="Call us or request a free quote, and we will walk you through the details."
      />
    </>
  );
}
