import type { MetadataRoute } from "next";
import { business } from "@/lib/site";

/**
 * App-served robots.txt: allow every crawler (search AND AI: GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended, etc.) so the site can appear in AI answers,
 * while keeping the admin and API out of the index.
 *
 * NOTE: Cloudflare currently serves a *managed* robots.txt at the edge that
 * blocks AI crawlers, which shadows this file. To use this one, turn off the
 * managed robots.txt / "Block AI bots" setting in the Cloudflare dashboard
 * (see SECURITY.md / the handover notes).
 */
export default function robots(): MetadataRoute.Robots {
  const base = `https://${business.domain}`;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
