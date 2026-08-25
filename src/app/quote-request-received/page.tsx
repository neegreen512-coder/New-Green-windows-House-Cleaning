import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quote Request Received",
  description:
    "Thank you for contacting New Green Windows & House Cleaning. We have received your request and will get back to you shortly.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/quote-request-received" },
};

export default function QuoteReceivedPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pb-24 pt-32 lg:pt-40">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-800">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <span className="eyebrow eyebrow--center mt-6">Request received</span>
          <h1 className="h1 mt-4">Quote request received</h1>
          <p className="lead mt-5">
            Thank you for contacting {business.name}. We have received your request and will get
            back to you shortly with a clear quote.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-secondary">
              Back to home
            </Link>
            <a href={business.phoneHref} className="btn btn-primary">
              Call {business.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
