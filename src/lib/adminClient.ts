/** Browser client for the owner admin. Talks to the same-origin Next proxy
 *  (/api/admin/*), which injects the CMS secret server-side. */

export type AdminReview = {
  id: number;
  name: string;
  context: string;
  service: string;
  quote: string;
  rating: number;
  status: string;
  avatar?: string;
  photos?: string[];
  created_at?: string;
};

export type AdminPricing = {
  id: number;
  name: string;
  blurb: string;
  price: string;
  unit: string;
  features: string[];
  featured: number | boolean;
  sort: number;
  active: number | boolean;
  image?: string;
};

export type AdminQuote = {
  id: number;
  services: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  frequency: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
  created_at?: string;
};

export type AdminMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at?: string;
};

const base = "/api/admin";
const jsonHeaders = { "Content-Type": "application/json" };

async function handle(res: Response) {
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json.data;
}

export const adminApi = {
  listReviews: (): Promise<AdminReview[]> =>
    fetch(`${base}/reviews`, { cache: "no-store" }).then(handle),
  addReview: (r: Partial<AdminReview>) =>
    fetch(`${base}/reviews`, { method: "POST", headers: jsonHeaders, body: JSON.stringify(r) }).then(handle),
  setReviewStatus: (id: number, status: string) =>
    fetch(`${base}/reviews/${id}`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify({ status }) }).then(handle),
  deleteReview: (id: number) => fetch(`${base}/reviews/${id}`, { method: "DELETE" }).then(handle),

  listPricing: (): Promise<AdminPricing[]> =>
    fetch(`${base}/pricing`, { cache: "no-store" }).then(handle),
  addPricing: (p: Partial<AdminPricing>) =>
    fetch(`${base}/pricing`, { method: "POST", headers: jsonHeaders, body: JSON.stringify(p) }).then(handle),
  updatePricing: (id: number, p: Partial<AdminPricing>) =>
    fetch(`${base}/pricing/${id}`, { method: "PUT", headers: jsonHeaders, body: JSON.stringify(p) }).then(handle),
  deletePricing: (id: number) => fetch(`${base}/pricing/${id}`, { method: "DELETE" }).then(handle),

  getContent: (): Promise<Record<string, string>> =>
    fetch(`${base}/content`, { cache: "no-store" }).then(handle),
  putContent: (obj: Record<string, string>) =>
    fetch(`${base}/content`, { method: "PUT", headers: jsonHeaders, body: JSON.stringify(obj) }).then(handle),

  listQuotes: (): Promise<AdminQuote[]> => fetch(`${base}/quotes`, { cache: "no-store" }).then(handle),
  setQuoteStatus: (id: number, status: string) =>
    fetch(`${base}/quotes/${id}`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify({ status }) }).then(handle),
  deleteQuote: (id: number) => fetch(`${base}/quotes/${id}`, { method: "DELETE" }).then(handle),

  listMessages: (): Promise<AdminMessage[]> => fetch(`${base}/messages`, { cache: "no-store" }).then(handle),
  setMessageStatus: (id: number, status: string) =>
    fetch(`${base}/messages/${id}`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify({ status }) }).then(handle),
  deleteMessage: (id: number) => fetch(`${base}/messages/${id}`, { method: "DELETE" }).then(handle),
};
