import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { business, analytics } from "@/lib/site";

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

// Display / brand font (Outfit). The CSS variable is kept as --font-bricolage
// so existing references keep working.
const displayFont = Outfit({
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
    images: [
      { url: "/brand/newgreen-ad-landscape.jpg", width: 1200, height: 628, alt: business.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name}`,
    description:
      "Professional window and house cleaning for homes across Canada. Easy online quotes.",
    images: ["/brand/newgreen-ad-landscape.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#124a37",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">
          {children}
        </main>
        <SiteFooter />
        {analytics.ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analytics.ga4Id}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
