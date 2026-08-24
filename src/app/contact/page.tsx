import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${business.name}. Call ${business.phone}, email us, or send a message and we will reply within one business day.`,
  alternates: { canonical: "/contact" },
};

const items = [
  { icon: Phone, label: "Phone", value: business.phone, href: business.phoneHref },
  { icon: Mail, label: "Email", value: business.email, href: business.emailHref },
  { icon: MapPin, label: "Address", value: business.address, href: undefined },
  { icon: Clock, label: "Hours", value: business.hours, href: undefined },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pb-24 pt-32 lg:pt-40">
        <div className="max-w-2xl">
          <span className="eyebrow">Contact</span>
          <h1 className="h1 mt-4">Let&apos;s talk about your home.</h1>
          <p className="lead mt-5">
            Questions about a service, or ready to book? Reach us directly, or send a message and we
            will get right back to you.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <ul className="space-y-5">
              {items.map(({ icon: ItemIcon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <ItemIcon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="label-mono">{label}</div>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block text-[1.05rem] font-medium text-ink hover:text-brand-800"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="mt-1 text-[1.05rem] font-medium text-ink">{value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-line bg-surface-muted p-6">
              <p className="text-[0.98rem] leading-relaxed text-muted">
                Prefer a detailed estimate? Use our quick quote flow and we will follow up with clear
                pricing for your home.
              </p>
              <Link href="/quote" className="btn btn-secondary mt-4">
                Get a free quote
              </Link>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
