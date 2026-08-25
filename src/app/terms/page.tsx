import type { Metadata } from "next";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms and conditions for using ${business.name} and booking our cleaning services.`,
  alternates: { canonical: "/terms" },
};

const updated = "25 August 2026";

export default function TermsPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pb-14 pt-28 lg:pb-16 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">Legal</span>
          <h1 className="h1 mt-4">Terms &amp; Conditions</h1>
          <p className="label-mono mt-4">Last updated: {updated}</p>

          <div className="mt-10 space-y-8 text-[1rem] leading-relaxed text-muted">
            <p>
              These terms and conditions govern your use of the {business.name} website and the
              services we provide. By using our website or booking a service, you agree to these
              terms.
            </p>

            <Section title="Our services">
              <p>
                We provide residential cleaning services, including window cleaning, house cleaning,
                and deep cleaning. Services are subject to availability and to the service areas we
                cover.
              </p>
            </Section>

            <Section title="Quotes and pricing">
              <p>
                Quotes are based on the information you provide and are estimates until confirmed.
                Final pricing may vary if the actual scope of work differs from what was described.
                Applicable taxes are added where required.
              </p>
            </Section>

            <Section title="Bookings and access">
              <p>
                When you book a service, you agree to provide safe and reasonable access to your home
                at the scheduled time. If we are unable to access the property, additional charges may
                apply.
              </p>
            </Section>

            <Section title="Cancellations and rescheduling">
              <p>
                If you need to cancel or reschedule, we ask for reasonable notice, generally at least
                24 hours before your appointment, so we can offer the time to another customer.
              </p>
            </Section>

            <Section title="Payment">
              <p>
                Payment is due on completion of the service unless we have agreed otherwise in
                writing.
              </p>
            </Section>

            <Section title="Our commitment">
              <p>
                We take pride in our work. If something is not right, let us know within a reasonable
                time and we will do our best to make it right.
              </p>
            </Section>

            <Section title="Liability">
              <p>
                We carry insurance and take care in every home. To the extent permitted by law, we are
                not liable for pre-existing damage, normal wear, or items that were not disclosed as
                fragile or valuable. Please secure valuables and let us know about anything that needs
                special care.
              </p>
            </Section>

            <Section title="Your responsibilities">
              <p>
                Please tell us in advance about hazards, pets, alarm systems, or delicate surfaces,
                and secure any items of particular value or sentimental importance.
              </p>
            </Section>

            <Section title="Website content">
              <p>
                The content on this website, including text, images, and branding, belongs to{" "}
                {business.name} and may not be copied or reused without permission.
              </p>
            </Section>

            <Section title="Governing law">
              <p>
                These terms are governed by the laws of the Province of Ontario and the applicable
                laws of Canada.
              </p>
            </Section>

            <Section title="Changes to these terms">
              <p>
                We may update these terms from time to time. The latest version will always be
                available on this page.
              </p>
            </Section>

            <Section title="Contact us">
              <p>
                Questions about these terms? Contact us at{" "}
                <a href={business.emailHref} className="font-medium text-brand-800 hover:underline">
                  {business.email}
                </a>{" "}
                or {business.phone}.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="h3 text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
