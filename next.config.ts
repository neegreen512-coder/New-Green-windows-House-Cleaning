import type { NextConfig } from "next";

/* Security headers ----------------------------------------------------------
   Applied to every response. The site collects names, emails, phones, and
   addresses, so it ships HSTS, clickjacking, MIME-sniffing, referrer, and
   permissions protection plus a Content-Security-Policy.

   Note on the CSP: `script-src` keeps 'unsafe-inline' because Next's App Router
   emits inline hydration scripts and we render inline GA + JSON-LD. Nonce-based
   CSP would force every page to be dynamically rendered, which we do not want
   for a mostly-static marketing site. The policy still blocks script, frame,
   and object loads from any non-allowlisted host, which is the main win. */

const isDev = process.env.NODE_ENV !== "production";

// The CMS worker the browser talks to directly (reviews, quotes, uploads).
const cmsOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_CMS_URL || "https://newgreen-cms.neegreen512.workers.dev")
      .origin;
  } catch {
    return "https://newgreen-cms.neegreen512.workers.dev";
  }
})();

const TURNSTILE = "https://challenges.cloudflare.com";
const GA = "https://www.googletagmanager.com https://www.google-analytics.com";

const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `img-src 'self' data: blob: https://images.unsplash.com ${GA} ${cmsOrigin}`,
  // 'unsafe-eval' + ws: are dev-only (React Refresh / HMR); never shipped to prod.
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} ${GA} ${TURNSTILE}`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `connect-src 'self' ${GA} https://region1.google-analytics.com ${TURNSTILE} ${cmsOrigin}${
    isDev ? " ws: http://localhost:*" : ""
  }`,
  `frame-src ${TURNSTILE}`,
  `upgrade-insecure-requests`,
]
  .join("; ")
  .replace(/\s+/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    // Served on Cloudflare Workers via OpenNext. We skip the image optimizer
    // (no Cloudflare Images binding / cost) and serve originals; the photos in
    // public/images are already reasonably sized.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
