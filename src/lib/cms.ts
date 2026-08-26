/** Client for the New Green CMS worker (Hono + Cloudflare D1). */

import type { QuotePayload, ContactPayload } from "@/lib/site";

export const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8787").replace(/\/$/, "");

export type CmsReview = {
  id: number;
  name: string;
  context: string;
  service: string;
  quote: string;
  rating: number;
  avatar?: string;
  photos?: string[];
  created_at?: string;
};

export type ReviewInput = {
  name: string;
  context?: string;
  service?: string;
  quote: string;
  rating?: number;
  avatar?: string;
  photos?: string[];
};

export async function getApprovedReviews(): Promise<CmsReview[]> {
  const res = await fetch(`${CMS_URL}/api/reviews`, { cache: "no-store" });
  const json = await res.json();
  if (!json?.ok) throw new Error("Failed to load reviews");
  return json.data as CmsReview[];
}

export async function submitReview(input: ReviewInput): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Could not submit your review.");
}

export type CmsPricing = {
  id: number;
  name: string;
  blurb: string;
  price: string;
  unit: string;
  features: string[];
  featured: boolean;
  sort: number;
  image?: string;
};

export async function getPricing(): Promise<CmsPricing[]> {
  const res = await fetch(`${CMS_URL}/api/pricing`, { cache: "no-store" });
  const json = await res.json();
  if (!json?.ok) throw new Error("Failed to load pricing");
  return json.data as CmsPricing[];
}

export async function submitQuote(payload: QuotePayload): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Could not submit your request.");
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${CMS_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Could not send your message.");
}

/** Resize an image in the browser so uploads stay small. Returns a Blob. */
async function resizeImage(file: File, maxDim = 1280, quality = 0.72): Promise<Blob> {
  if (typeof document === "undefined") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

/* --------------------------------------------------------------- Blog ----- */

export type CmsPost = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  tag?: string;
  read_min?: number;
  created_at?: string;
  body?: string;
};

export async function getPosts(): Promise<CmsPost[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/posts`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json?.ok ? (json.data as CmsPost[]) : [];
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<CmsPost | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.ok ? (json.data as CmsPost) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------- Gallery ---- */

export type CmsGalleryItem = {
  id: number;
  before_url: string;
  after_url: string;
  caption: string;
  service: string;
};

export async function getGallery(): Promise<CmsGalleryItem[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/gallery`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json?.ok ? (json.data as CmsGalleryItem[]) : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------ Settings / content ------- */

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${CMS_URL}/api/content`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json?.ok ? (json.data as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Merge owner-edited business details over the code defaults. */
export function mergeBusiness<T extends Record<string, unknown>>(
  base: T,
  settings: Record<string, string>
): T & { phoneHref: string; emailHref: string } {
  let over: Record<string, string> = {};
  try {
    over = settings.business ? JSON.parse(settings.business) : {};
  } catch {
    over = {};
  }
  const phone = over.phone || (base.phone as string);
  const email = over.email || (base.email as string);
  return {
    ...base,
    phone,
    email,
    hours: over.hours || (base.hours as string),
    address: over.address || (base.address as string),
    phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}`,
    emailHref: `mailto:${email}`,
  };
}

/** Upload an image to the CMS (stored in D1). Returns the served URL. */
export async function uploadImage(file: File): Promise<string> {
  const blob = await resizeImage(file);
  const res = await fetch(`${CMS_URL}/api/upload`, {
    method: "POST",
    headers: { "Content-Type": blob.type || "image/jpeg" },
    body: blob,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Image upload failed.");
  return json.data.url as string;
}
