import type { MetadataRoute } from "next";
import { business, services } from "@/lib/site";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${business.domain}`;
  const paths = [
    "",
    "/quote",
    "/pricing",
    "/gallery",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/service-areas",
    "/privacy",
    "/terms",
    ...services.map((s) => `/${s.slug}`),
    ...blogPosts.map((p) => `/blog/${p.slug}`),
  ];
  const now = new Date();
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
