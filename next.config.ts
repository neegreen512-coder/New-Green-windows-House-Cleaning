import type { NextConfig } from "next";

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
};

export default nextConfig;
