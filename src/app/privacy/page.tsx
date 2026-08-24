import type { Metadata } from "next";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${business.name} collects, uses, and protects your personal information.`,
  alternates: { canonical: "/privacy" },
};

const updated = "25 August 2026";

export default function PrivacyPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-x pb-24 pt-32 lg:pt-40">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow">Legal</span>
          <h1 className="h1 mt-4">Privacy Policy</h1>
          <p className="label-mono mt-4">Last updated: {updated}</p>

          <div className="mt-10 space-y-8 text-[1rem] leading-relaxed text-muted">
            <p>
              {business.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your
              privacy. This policy explains what information we collect when you use our website or
              request our services, how we use it, and the choices you have.
            </p>

            <Section title="Information we collect">
              <p>We collect information you provide directly to us, including:</p>
              <List
                items={[
                  "Contact details such as your name, email address, phone number, and service address, submitted through our quote or contact forms.",
                  "Details about the service you are requesting, such as property type and the areas you would like cleaned.",
                  "Any message or notes you choose to send us.",
                ]}
              />
              <p>
                We also collect limited technical information automatically, such as your browser
                type, device, and general usage data, through cookies and similar technologies.
              </p>
            </Section>

            <Section title="How we use your information">
              <List
                items={[
                  "To respond to your enquiries and provide quotes.",
                  "To schedule, deliver, and manage the services you request.",
                  "To communicate with you about appointments and updates.",
                  "To improve our website and services.",
                  "To meet our legal and regulatory obligations.",
                ]}
              />
            </Section>

            <Section title="Cookies">
              <p>
                Our website uses cookies to keep the site working properly and to understand how it
                is used. You can control cookies through your browser settings. Disabling some
                cookies may affect how the site functions.
              </p>
            </Section>

            <Section title="How we share information">
              <p>
                We do not sell your personal information. We may share it with trusted service
                providers who help us operate our business, and only as needed to provide our
                services. We may also disclose information where required by law.
              </p>
            </Section>

            <Section title="Data retention">
              <p>
                We keep personal information only for as long as necessary to provide our services,
                comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                You may request access to the personal information we hold about you, ask us to
                correct it, or request that we delete it, subject to our legal obligations. To make a
                request, contact us using the details below.
              </p>
            </Section>

            <Section title="Security">
              <p>
                We take reasonable steps to protect your personal information against loss, misuse,
                and unauthorised access. No method of transmission over the internet is completely
                secure, so we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="Children">
              <p>
                Our website and services are intended for adults. We do not knowingly collect
                personal information from children.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p>
                We may update this policy from time to time. Any changes will be posted on this page
                with a revised date.
              </p>
            </Section>

            <Section title="Contact us">
              <p>
                If you have questions about this policy or your personal information, contact us at{" "}
                <a href={business.emailHref} className="font-medium text-brand-800 hover:underline">
                  {business.email}
                </a>{" "}
                or {business.phone}. You can also write to us at {business.address}.
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

function List({ items }: { items: string[] }) {
  return (
    <ul className="ml-5 list-disc space-y-2">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
