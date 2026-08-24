import type { Metadata } from "next";
import { QuoteFlow } from "@/components/QuoteFlow";

export const metadata: Metadata = {
  title: "Get a Free Quote",
  description:
    "Request a free, no-pressure quote for window or house cleaning in Mississauga and the GTA. Tell us about your home and we will follow up with clear pricing.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pb-24 pt-32 lg:pt-40">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow eyebrow--center">Free quote</span>
          <h1 className="h1 mt-4">Request a free quote</h1>
          <p className="lead mt-5">
            Answer a few quick questions about your home. It takes under a minute, with no
            obligation, and we will follow up with clear pricing.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <QuoteFlow />
        </div>
      </div>
    </section>
  );
}
