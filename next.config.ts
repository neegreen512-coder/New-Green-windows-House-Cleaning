import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Curated stock imagery is served from Unsplash for now. Every image
    // reference lives in src/lib/site.ts, so swapping to real, self-hosted
    // business photography later is a single-file change.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
