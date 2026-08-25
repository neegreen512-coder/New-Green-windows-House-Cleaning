import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileQuoteBar } from "@/components/MobileQuoteBar";
import { WaterBackground } from "@/components/WaterBackground";
import { business } from "@/lib/site";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${business.domain}`),
  title: {
    default: `${business.name} | Window & House Cleaning in Canada`,
    template: `%s | ${business.shortName}`,
  },
  description:
    "Professional window and house cleaning for homes across Canada. Streak-free windows, detailed home cleaning, and easy online quotes from New Green.",
  keywords: [
    "window cleaning",
    "house cleaning",
    "residential cleaning",
    "deep cleaning",
    "Canada",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: `https://${business.domain}`,
    siteName: business.name,
    title: `${business.name} | A Cleaner Home. A Brighter View.`,
    description:
      "Professional window and house cleaning for homes across Canada. Easy online quotes.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name}`,
    description:
      "Professional window and house cleaning for homes across Canada. Easy online quotes.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#124a37",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable}`}>
      <body>
        <WaterBackground />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="pb-[5.5rem] lg:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileQuoteBar />
      </body>
    </html>
  );
}
