import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { DifferenceSection } from "@/components/sections/DifferenceSection";
import { WhyUs } from "@/components/sections/WhyUs";
import { CinematicBand } from "@/components/sections/CinematicBand";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCta } from "@/components/sections/FinalCta";
import { business, services, testimonials, areaNames } from "@/lib/site";
import { jsonLdScript } from "@/lib/jsonld";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `https://${business.domain}/#business`,
    name: business.name,
    description:
      "Professional window and house cleaning for homes across Mississauga and the GTA, including detailed deep cleaning.",
    url: `https://${business.domain}`,
    telephone: business.phone,
    email: business.email,
    image: `https://${business.domain}/brand/newgreen-ad-landscape.jpg`,
    logo: `https://${business.domain}/brand/newgreen-logo-square.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.streetAddress,
      addressLocality: business.addressLocality,
      addressRegion: business.addressRegion,
      postalCode: business.postalCode,
      addressCountry: business.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: areaNames.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (
        testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      ).toFixed(1),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
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
