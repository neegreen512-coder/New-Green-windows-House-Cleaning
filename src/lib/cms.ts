/** Client for the New Green CMS worker (Hono + Cloudflare D1). */

export const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8787").replace(/\/$/, "");

export type CmsReview = {
  id: number;
  name: string;
  context: string;
  service: string;
  quote: string;
  rating: number;
  avatar?: string;
  created_at?: string;
};

export type ReviewInput = {
  name: string;
  context?: string;
  service?: string;
  quote: string;
  rating?: number;
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
