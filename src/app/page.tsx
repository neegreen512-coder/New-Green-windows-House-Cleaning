import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { DifferenceSection } from "@/components/sections/DifferenceSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { CinematicBand } from "@/components/sections/CinematicBand";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { business, services } from "@/lib/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    description:
      "Professional window and house cleaning for homes across Canada, including detailed deep cleaning.",
    url: `https://${business.domain}`,
    areaServed: { "@type": "Country", name: "Canada" },
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Services />
      <DifferenceSection />
      <WhyUs />
      <CinematicBand />
      <Process />
      <Pricing />
      <Testimonials />
      <FinalCta />
    </>
  );
}
