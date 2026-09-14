import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
  ADMIN_SECRET?: string;
  TURNSTILE_SECRET?: string;
  // Set to "1" ONLY for local dev to allow the admin API without a secret.
  // Production must leave this unset so the admin gate fails closed.
  ALLOW_INSECURE_ADMIN?: string;
};

// Constant-time string compare, so the admin-secret check does not leak length
// or content via timing.
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

const app = new Hono<{ Bindings: Bindings }>();

// Only the site's own origins may call the API from a browser. Server-side
// (SSR) fetches send no Origin and are unaffected. This is hygiene, not the
// spam defence (bots ignore CORS) — see the honeypot + rate limit + Turnstile
// applied to the public POST endpoints below.
const ALLOWED_ORIGINS = new Set([
  "https://newgreenwindowsandhousecleaning.ca",
  "https://www.newgreenwindowsandhousecleaning.ca",
  "https://newgreen-site.neegreen512.workers.dev",
  "http://localhost:3000",
]);

app.use(
  "*",
  cors({
    origin: (origin) =>
      origin && ALLOWED_ORIGINS.has(origin)
        ? origin
        : "https://newgreenwindowsandhousecleaning.ca",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "x-cms-secret"],
  })
);

const ok = (data: unknown) => ({ ok: true as const, data });
const clamp = (v: unknown, min: number, max: number, fallback: number) => {
  const n = parseInt(String(v), 10);
  return Number.isNaN(n) ? fallback : Math.max(min, Math.min(max, n));
};
const str = (v: unknown, max: number) => (v == null ? "" : String(v)).slice(0, max);

/* ------------------------------------------------------------- Anti-spam ---
   Honeypot + per-IP rate limiting + optional Cloudflare Turnstile. All three
   apply to the public submission endpoints (quotes, messages, reviews). */

function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// A filled honeypot ("website") means a bot; real users never see the field.
const isHoneypot = (b: Record<string, unknown> | null) =>
  !!b && typeof b.website === "string" && b.website.trim().length > 0;

// Fixed-window per-IP rate limit, backed by D1. The increment is a single
// atomic UPSERT (SQLite serializes the write) so concurrent requests cannot
// race the read-modify-write and evade the limit.
async function rateLimit(
  db: D1Database,
  bucket: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; retryAfter: number }> {
  const t = Date.now();
  const row = await db
    .prepare(
      `INSERT INTO rate_limit (bucket, count, window_start, locked_until)
       VALUES (?1, 1, ?2, 0)
       ON CONFLICT(bucket) DO UPDATE SET
         count        = CASE WHEN ?2 - rate_limit.window_start > ?3 THEN 1 ELSE rate_limit.count + 1 END,
         window_start = CASE WHEN ?2 - rate_limit.window_start > ?3 THEN ?2 ELSE rate_limit.window_start END
       RETURNING count, window_start`
    )
    .bind(bucket, t, windowMs)
    .first<{ count: number; window_start: number }>();
  const count = Number(row?.count ?? 1);
  const windowStart = Number(row?.window_start ?? t);
  if (count > limit) return { ok: false, retryAfter: Math.ceil((windowStart + windowMs - t) / 1000) };
  return { ok: true, retryAfter: 0 };
}

// Verify a Turnstile token. If no secret is configured, verification is skipped
// (returns true) so the site works before keys are provisioned.
async function verifyTurnstile(
  secret: string | undefined,
  token: string,
  ip: string
): Promise<boolean> {
  if (!secret) return true;
  if (!token) return false;
  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (ip && ip !== "unknown") form.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const j = (await res.json().catch(() => ({}))) as { success?: boolean };
    return !!j.success;
  } catch {
    return false;
  }
}

app.get("/api/health", (c) => c.json(ok({ status: "up" })));

/* --------------------------------------------------------------- Media (D1)
   Images are resized small on the client, then stored as BLOBs in D1 and
   served back here. Avoids needing R2. */

const MAX_UPLOAD = 1_600_000; // ~1.6MB after client-side resize
// Raster types only. SVG is deliberately excluded (an uploaded SVG served from
// the CMS origin would be a stored-XSS / script vector).
const UPLOAD_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
// Hard cap on total media stored in D1, so this public endpoint cannot fill the
// shared database (which would take down leads/reviews/everything).
const MEDIA_MAX_BYTES = 200_000_000; // ~200MB
const MEDIA_MAX_ROWS = 4000;

// Verify the bytes actually match the declared image type (don't trust the
// client Content-Type header), so arbitrary blobs can't be stored as "images".
function magicOk(buf: ArrayBuffer, mime: string): boolean {
  const b = new Uint8Array(buf.slice(0, 16));
  const at = (sig: number[], off = 0) => sig.every((v, i) => b[off + i] === v);
  if (mime === "image/jpeg") return at([0xff, 0xd8, 0xff]);
  if (mime === "image/png") return at([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (mime === "image/gif") return at([0x47, 0x49, 0x46, 0x38]); // "GIF8"
  if (mime === "image/webp") return at([0x52, 0x49, 0x46, 0x46]) && at([0x57, 0x45, 0x42, 0x50], 8); // RIFF....WEBP
  return false;
}

app.post("/api/upload", async (c) => {
  const mime = (c.req.header("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!UPLOAD_TYPES.has(mime)) {
    return c.json({ ok: false, error: "Only JPEG, PNG, WebP, or GIF images are allowed." }, 400);
  }
  // Per-IP rate limit so this public storage endpoint cannot be flooded.
  const ip = clientIp(c.req.raw);
  const rl = await rateLimit(c.env.DB, `upload:${ip}`, 60, 60 * 60 * 1000);
  if (!rl.ok) {
    return c.json({ ok: false, error: "Too many uploads. Please try again later." }, 429, {
      "Retry-After": String(rl.retryAfter),
    });
  }
  const buf = await c.req.arrayBuffer();
  if (buf.byteLength === 0) return c.json({ ok: false, error: "Empty file." }, 400);
  if (buf.byteLength > MAX_UPLOAD) return c.json({ ok: false, error: "Image is too large." }, 413);
  if (!magicOk(buf, mime))
    return c.json({ ok: false, error: "That file does not look like a valid image." }, 400);

  // Global storage cap: never let uploads fill the shared D1 database.
  const stats = await c.env.DB.prepare(
    "SELECT COUNT(*) AS n, COALESCE(SUM(LENGTH(data)), 0) AS bytes FROM media"
  ).first<{ n: number; bytes: number }>();
  if (
    Number(stats?.n ?? 0) >= MEDIA_MAX_ROWS ||
    Number(stats?.bytes ?? 0) + buf.byteLength > MEDIA_MAX_BYTES
  ) {
    return c.json({ ok: false, error: "Storage limit reached. Please contact us." }, 507);
  }

  const id = crypto.randomUUID().replace(/-/g, "");
  // media.created_at defaults to datetime('now') (migration 0004).
  await c.env.DB.prepare("INSERT INTO media (id, mime, data) VALUES (?, ?, ?)")
    .bind(id, mime, buf)
    .run();

  return c.json(ok({ url: `${new URL(c.req.url).origin}/media/${id}` }));
});

app.get("/media/:id", async (c) => {
  const row = await c.env.DB.prepare("SELECT mime, data FROM media WHERE id = ?")
    .bind(c.req.param("id"))
    .first<{ mime: string; data: ArrayBuffer | number[] }>();
  if (!row) return c.notFound();
  const bytes = row.data instanceof ArrayBuffer ? new Uint8Array(row.data) : Uint8Array.from(row.data);
  return new Response(bytes, {
    headers: {
      "Content-Type": row.mime || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
});

/* ----------------------------------------------------------------- Public */

app.get("/api/reviews", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, context, service, quote, rating, avatar, photos, featured, created_at FROM reviews WHERE status = 'approved' ORDER BY featured DESC, sort ASC, created_at DESC LIMIT 60"
  ).all<Record<string, unknown>>();
  return c.json(ok(results.map((r) => ({ ...r, featured: !!r.featured, photos: safeJson(r.photos) }))));
});

// Before / after gallery (public).
app.get("/api/gallery", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, before_url, after_url, caption, service FROM gallery ORDER BY sort ASC, id DESC"
  ).all();
  return c.json(ok(results));
});

// Blog posts (public): list without body, then single by slug.
app.get("/api/posts", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, slug, title, excerpt, cover, tag, read_min, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC"
  ).all();
  return c.json(ok(results));
});

app.get("/api/posts/:slug", async (c) => {
  const row = await c.env.DB.prepare(
    "SELECT id, slug, title, excerpt, body, cover, tag, read_min, created_at FROM posts WHERE slug = ? AND published = 1"
  )
    .bind(c.req.param("slug"))
    .first();
  if (!row) return c.json({ ok: false, error: "Not found" }, 404);
  return c.json(ok(row));
});

// Public review submission -> stored as pending for the owner to approve.
app.post("/api/reviews", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid request." }, 400);

  // Honeypot: pretend success so bots do not learn they were caught.
  if (isHoneypot(body)) return c.json(ok({ submitted: true }));
  const ip = clientIp(c.req.raw);
  const rl = await rateLimit(c.env.DB, `reviews:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.ok)
    return c.json({ ok: false, error: "Too many submissions. Please try again later." }, 429, {
      "Retry-After": String(rl.retryAfter),
    });
  if (!(await verifyTurnstile(c.env.TURNSTILE_SECRET, str(body.turnstileToken, 4000), ip)))
    return c.json({ ok: false, error: "Verification failed. Please try again." }, 400);

  const name = str(body.name, 80).trim();
  const quote = str(body.quote, 1200).trim();
  const service = str(body.service, 60).trim();
  const context = str(body.context, 80).trim();
  const rating = clamp(body.rating, 1, 5, 5);

  if (name.length < 2) return c.json({ ok: false, error: "Please add your name." }, 400);
  if (quote.length < 10)
    return c.json({ ok: false, error: "Please write a little more about your experience." }, 400);

  const photos = Array.isArray(body.photos) ? body.photos.slice(0, 6).map((p: unknown) => str(p, 400)) : [];

  await c.env.DB.prepare(
    "INSERT INTO reviews (name, context, service, quote, rating, status, avatar, photos) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)"
  )
    .bind(name, context, service, quote, rating, str(body.avatar, 400), JSON.stringify(photos))
    .run();

  return c.json(ok({ submitted: true }));
});

app.get("/api/pricing", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, blurb, price, unit, features, featured, sort, image FROM pricing WHERE active = 1 ORDER BY sort ASC"
  ).all<Record<string, unknown>>();
  const data = results.map((r) => ({
    ...r,
    featured: !!r.featured,
    features: safeJson(r.features),
  }));
  return c.json(ok(data));
});

app.get("/api/content", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT key, value FROM content").all<{
    key: string;
    value: string;
  }>();
  return c.json(ok(Object.fromEntries(results.map((r) => [r.key, r.value]))));
});

const emailish = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Public quote request -> stored as a new lead for the owner.
app.post("/api/quotes", async (c) => {
  const b = await c.req.json().catch(() => null);
  if (!b) return c.json({ ok: false, error: "Invalid request." }, 400);

  if (isHoneypot(b)) return c.json(ok({ submitted: true }));
  const ip = clientIp(c.req.raw);
  const rl = await rateLimit(c.env.DB, `quotes:${ip}`, 8, 60 * 60 * 1000);
  if (!rl.ok)
    return c.json({ ok: false, error: "Too many requests. Please try again later." }, 429, {
      "Retry-After": String(rl.retryAfter),
    });
  if (!(await verifyTurnstile(c.env.TURNSTILE_SECRET, str(b.turnstileToken, 4000), ip)))
    return c.json({ ok: false, error: "Verification failed. Please try again." }, 400);

  const name = str(b.name, 80).trim();
  const email = str(b.email, 120).trim();
  if (name.length < 2) return c.json({ ok: false, error: "Please add your name." }, 400);
  if (!emailish(email)) return c.json({ ok: false, error: "Please add a valid email." }, 400);

  const services = Array.isArray(b.services) ? b.services.join(", ") : str(b.services, 200);

  await c.env.DB.prepare(
    "INSERT INTO quotes (services, property_type, bedrooms, bathrooms, frequency, name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      str(services, 200),
      str(b.propertyType, 40),
      str(b.bedrooms, 20),
      str(b.bathrooms, 20),
      str(b.frequency, 40),
      name,
      email,
      str(b.phone, 40),
      str(b.address, 200),
      str(b.notes, 2000)
    )
    .run();

  return c.json(ok({ submitted: true }));
});

// Public contact message -> stored as a new lead for the owner.
app.post("/api/messages", async (c) => {
  const b = await c.req.json().catch(() => null);
  if (!b) return c.json({ ok: false, error: "Invalid request." }, 400);

  if (isHoneypot(b)) return c.json(ok({ submitted: true }));
  const ip = clientIp(c.req.raw);
  const rl = await rateLimit(c.env.DB, `messages:${ip}`, 8, 60 * 60 * 1000);
  if (!rl.ok)
    return c.json({ ok: false, error: "Too many messages. Please try again later." }, 429, {
      "Retry-After": String(rl.retryAfter),
    });
  if (!(await verifyTurnstile(c.env.TURNSTILE_SECRET, str(b.turnstileToken, 4000), ip)))
    return c.json({ ok: false, error: "Verification failed. Please try again." }, 400);

  const name = str(b.name, 80).trim();
  const email = str(b.email, 120).trim();
  const message = str(b.message, 4000).trim();
  if (name.length < 2) return c.json({ ok: false, error: "Please add your name." }, 400);
  if (!emailish(email)) return c.json({ ok: false, error: "Please add a valid email." }, 400);
  if (message.length < 5) return c.json({ ok: false, error: "Please add a message." }, 400);

  await c.env.DB.prepare("INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)")
    .bind(name, email, str(b.phone, 40), message)
    .run();

  return c.json(ok({ submitted: true }));
});

/* ------------------------------------------------------------------ Admin
   Gated by a shared secret AND (in production) by Cloudflare Access on the
   route. If ADMIN_SECRET is unset (local dev only) the gate is open. */

const admin = new Hono<{ Bindings: Bindings }>();

admin.use("*", async (c, next) => {
  const secret = c.env.ADMIN_SECRET;
  if (!secret) {
    // Fail closed: a missing secret must NOT open the admin API. The open path
    // is an explicit local-dev opt-in only, never the default when unset.
    if (c.env.ALLOW_INSECURE_ADMIN !== "1") {
      return c.json({ ok: false, error: "Admin is not configured." }, 503);
    }
  } else if (!timingSafeEqual(c.req.header("x-cms-secret") || "", secret)) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }
  await next();
});

/* Login brute-force lockout. Called by the site's /api/admin-login (which holds
   the secret). Body: { ip, result?: "success" | "fail" }. With no result it is
   a pure pre-check. 8 failures within 15 minutes locks that IP for 15 minutes. */
admin.post("/login-attempt", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const ip = str(b.ip, 64) || "unknown";
  const result = b.result === "success" ? "success" : b.result === "fail" ? "fail" : undefined;
  const bucket = `login:${ip}`;
  const t = Date.now();
  const WINDOW = 15 * 60 * 1000;
  const MAX_FAILS = 8;
  const LOCK = 15 * 60 * 1000;

  const existing = await c.env.DB.prepare("SELECT locked_until FROM rate_limit WHERE bucket = ?")
    .bind(bucket)
    .first<{ locked_until: number }>();

  const lockedUntil = Number(existing?.locked_until ?? 0);
  if (lockedUntil > t) {
    return c.json(ok({ blocked: true, retryAfter: Math.ceil((lockedUntil - t) / 1000) }));
  }

  if (result === "success") {
    await c.env.DB.prepare("DELETE FROM rate_limit WHERE bucket = ?").bind(bucket).run();
    return c.json(ok({ blocked: false }));
  }

  if (result === "fail") {
    // Atomic increment + lock in a single statement (no read-modify-write race).
    const updated = await c.env.DB.prepare(
      `INSERT INTO rate_limit (bucket, count, window_start, locked_until)
       VALUES (?1, 1, ?2, 0)
       ON CONFLICT(bucket) DO UPDATE SET
         window_start = CASE WHEN ?2 - rate_limit.window_start > ?3 THEN ?2 ELSE rate_limit.window_start END,
         count        = CASE WHEN ?2 - rate_limit.window_start > ?3 THEN 1 ELSE rate_limit.count + 1 END,
         locked_until = CASE WHEN (CASE WHEN ?2 - rate_limit.window_start > ?3 THEN 1 ELSE rate_limit.count + 1 END) >= ?4
                             THEN ?2 + ?5 ELSE 0 END
       RETURNING count, locked_until`
    )
      .bind(bucket, t, WINDOW, MAX_FAILS, LOCK)
      .first<{ count: number; locked_until: number }>();
    const count = Number(updated?.count ?? 1);
    const newLock = Number(updated?.locked_until ?? 0);
    const blocked = count >= MAX_FAILS;
    return c.json(
      ok({
        blocked,
        retryAfter: blocked ? Math.ceil((newLock - t) / 1000) : 0,
        remaining: Math.max(0, MAX_FAILS - count),
      })
    );
  }

  return c.json(ok({ blocked: false }));
});

/* Verify a Turnstile token for the admin login (the site holds the secret only
   for the CMS admin API, not the Turnstile secret, so it asks the CMS to
   verify). Returns { success } — true when Turnstile is not configured. */
admin.post("/turnstile-verify", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const success = await verifyTurnstile(c.env.TURNSTILE_SECRET, str(b.token, 4000), str(b.ip, 64));
  return c.json(ok({ success }));
});

// Reviews
admin.get("/reviews", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM reviews ORDER BY (status = 'pending') DESC, created_at DESC"
  ).all<Record<string, unknown>>();
  return c.json(ok(results.map((r) => ({ ...r, photos: safeJson(r.photos) }))));
});

admin.post("/reviews", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const name = str(b.name, 80).trim();
  const quote = str(b.quote, 1200).trim();
  if (name.length < 2 || quote.length < 5)
    return c.json({ ok: false, error: "Name and review text are required." }, 400);
  const photos = Array.isArray(b.photos) ? b.photos.slice(0, 6).map((p: unknown) => str(p, 400)) : [];
  await c.env.DB.prepare(
    "INSERT INTO reviews (name, context, service, quote, rating, status, avatar, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      name,
      str(b.context, 80),
      str(b.service, 60),
      quote,
      clamp(b.rating, 1, 5, 5),
      b.status === "approved" ? "approved" : "pending",
      str(b.avatar, 400),
      JSON.stringify(photos)
    )
    .run();
  return c.json(ok({ created: true }));
});

// Partial update: status, featured, and/or sort (used by approve / pin / reorder).
admin.patch("/reviews/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (b.status !== undefined) {
    sets.push("status = ?");
    vals.push(b.status === "approved" ? "approved" : "pending");
  }
  if (b.featured !== undefined) {
    sets.push("featured = ?");
    vals.push(b.featured ? 1 : 0);
  }
  if (b.sort !== undefined) {
    sets.push("sort = ?");
    vals.push(clamp(b.sort, 0, 9999, 0));
  }
  if (!sets.length) return c.json(ok({ updated: false }));
  vals.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE reviews SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...vals)
    .run();
  return c.json(ok({ updated: true }));
});

// Full edit of a review's content.
admin.put("/reviews/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const photos = Array.isArray(b.photos) ? b.photos.slice(0, 6).map((p: unknown) => str(p, 400)) : [];
  await c.env.DB.prepare(
    "UPDATE reviews SET name=?, context=?, service=?, quote=?, rating=?, status=?, avatar=?, photos=? WHERE id=?"
  )
    .bind(
      str(b.name, 80),
      str(b.context, 80),
      str(b.service, 60),
      str(b.quote, 1200),
      clamp(b.rating, 1, 5, 5),
      b.status === "approved" ? "approved" : "pending",
      str(b.avatar, 400),
      JSON.stringify(photos),
      c.req.param("id")
    )
    .run();
  return c.json(ok({ updated: true }));
});

admin.delete("/reviews/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM reviews WHERE id = ?").bind(c.req.param("id")).run();
  return c.json(ok({ deleted: true }));
});

// Quote requests (leads)
admin.get("/quotes", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM quotes ORDER BY (status = 'new') DESC, created_at DESC"
  ).all();
  return c.json(ok(results));
});

const QUOTE_STATUSES = ["new", "handled", "won", "lost"];
admin.patch("/quotes/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (b.status !== undefined) {
    sets.push("status = ?");
    vals.push(QUOTE_STATUSES.includes(b.status) ? b.status : "new");
  }
  if (b.admin_notes !== undefined) {
    sets.push("admin_notes = ?");
    vals.push(str(b.admin_notes, 2000));
  }
  if (!sets.length) return c.json(ok({ updated: false }));
  vals.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE quotes SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...vals)
    .run();
  return c.json(ok({ updated: true }));
});

admin.delete("/quotes/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM quotes WHERE id = ?").bind(c.req.param("id")).run();
  return c.json(ok({ deleted: true }));
});

// Contact messages (leads)
admin.get("/messages", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM messages ORDER BY (status = 'new') DESC, created_at DESC"
  ).all();
  return c.json(ok(results));
});

admin.patch("/messages/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (b.status !== undefined) {
    sets.push("status = ?");
    vals.push(b.status === "handled" ? "handled" : "new");
  }
  if (b.admin_notes !== undefined) {
    sets.push("admin_notes = ?");
    vals.push(str(b.admin_notes, 2000));
  }
  if (!sets.length) return c.json(ok({ updated: false }));
  vals.push(c.req.param("id"));
  await c.env.DB.prepare(`UPDATE messages SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...vals)
    .run();
  return c.json(ok({ updated: true }));
});

admin.delete("/messages/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM messages WHERE id = ?").bind(c.req.param("id")).run();
  return c.json(ok({ deleted: true }));
});

// Pricing
admin.get("/pricing", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM pricing ORDER BY sort ASC").all<
    Record<string, unknown>
  >();
  return c.json(ok(results.map((r) => ({ ...r, features: safeJson(r.features) }))));
});

const MAX_PACKAGES = 3;

admin.post("/pricing", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  // Hard cap: at most 3 packages. Enforced here so the limit holds no matter
  // what calls the admin API.
  const countRow = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM pricing").first<{ n: number }>();
  if (Number(countRow?.n ?? 0) >= MAX_PACKAGES) {
    return c.json(
      { ok: false, error: `You can have at most ${MAX_PACKAGES} packages. Delete one before adding another.` },
      400
    );
  }
  await c.env.DB.prepare(
    "INSERT INTO pricing (name, blurb, price, unit, features, featured, sort, active, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      str(b.name, 80),
      str(b.blurb, 200),
      str(b.price, 40),
      str(b.unit, 40),
      JSON.stringify(Array.isArray(b.features) ? b.features : []),
      b.featured ? 1 : 0,
      clamp(b.sort, 0, 999, 0),
      b.active === false ? 0 : 1,
      str(b.image, 400)
    )
    .run();
  return c.json(ok({ created: true }));
});

admin.put("/pricing/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare(
    "UPDATE pricing SET name=?, blurb=?, price=?, unit=?, features=?, featured=?, sort=?, active=?, image=? WHERE id=?"
  )
    .bind(
      str(b.name, 80),
      str(b.blurb, 200),
      str(b.price, 40),
      str(b.unit, 40),
      JSON.stringify(Array.isArray(b.features) ? b.features : []),
      b.featured ? 1 : 0,
      clamp(b.sort, 0, 999, 0),
      b.active === false ? 0 : 1,
      str(b.image, 400),
      c.req.param("id")
    )
    .run();
  return c.json(ok({ updated: true }));
});

admin.delete("/pricing/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM pricing WHERE id = ?").bind(c.req.param("id")).run();
  return c.json(ok({ deleted: true }));
});

// Gallery (before / after)
admin.get("/gallery", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM gallery ORDER BY sort ASC, id DESC").all();
  return c.json(ok(results));
});
admin.post("/gallery", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare(
    "INSERT INTO gallery (before_url, after_url, caption, service, sort) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(str(b.before_url, 400), str(b.after_url, 400), str(b.caption, 200), str(b.service, 60), clamp(b.sort, 0, 999, 0))
    .run();
  return c.json(ok({ created: true }));
});
admin.put("/gallery/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare(
    "UPDATE gallery SET before_url=?, after_url=?, caption=?, service=?, sort=? WHERE id=?"
  )
    .bind(
      str(b.before_url, 400),
      str(b.after_url, 400),
      str(b.caption, 200),
      str(b.service, 60),
      clamp(b.sort, 0, 999, 0),
      c.req.param("id")
    )
    .run();
  return c.json(ok({ updated: true }));
});
admin.delete("/gallery/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM gallery WHERE id = ?").bind(c.req.param("id")).run();
  return c.json(ok({ deleted: true }));
});

// Blog posts
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

admin.get("/posts", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  return c.json(ok(results));
});
admin.post("/posts", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const title = str(b.title, 160).trim();
  if (title.length < 3) return c.json({ ok: false, error: "A title is required." }, 400);
  let slug = (str(b.slug, 80).trim() && slugify(str(b.slug, 80))) || slugify(title) || `post-${Date.now()}`;
  const exists = await c.env.DB.prepare("SELECT id FROM posts WHERE slug = ?").bind(slug).first();
  if (exists) slug = `${slug}-${Date.now().toString().slice(-5)}`;
  await c.env.DB.prepare(
    "INSERT INTO posts (slug, title, excerpt, body, cover, tag, read_min, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      slug,
      title,
      str(b.excerpt, 300),
      str(b.body, 20000),
      str(b.cover, 400),
      str(b.tag, 40),
      clamp(b.read_min, 1, 60, 4),
      b.published === false ? 0 : 1
    )
    .run();
  return c.json(ok({ created: true, slug }));
});
admin.put("/posts/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare(
    "UPDATE posts SET title=?, excerpt=?, body=?, cover=?, tag=?, read_min=?, published=?, updated_at=datetime('now') WHERE id=?"
  )
    .bind(
      str(b.title, 160),
      str(b.excerpt, 300),
      str(b.body, 20000),
      str(b.cover, 400),
      str(b.tag, 40),
      clamp(b.read_min, 1, 60, 4),
      b.published === false ? 0 : 1,
      c.req.param("id")
    )
    .run();
  return c.json(ok({ updated: true }));
});
admin.delete("/posts/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(c.req.param("id")).run();
  return c.json(ok({ deleted: true }));
});

// Content (editable text blocks)
admin.get("/content", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT key, value FROM content").all<{
    key: string;
    value: string;
  }>();
  return c.json(ok(Object.fromEntries(results.map((r) => [r.key, r.value]))));
});

admin.put("/content", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  if (!b || typeof b !== "object") return c.json({ ok: false, error: "Invalid body" }, 400);
  const stmts = Object.entries(b).map(([k, v]) =>
    c.env.DB.prepare(
      "INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    ).bind(str(k, 60), str(v, 20000))
  );
  if (stmts.length) await c.env.DB.batch(stmts);
  return c.json(ok({ saved: true }));
});

app.route("/api/admin", admin);

function safeJson(v: unknown): string[] {
  try {
    const parsed = JSON.parse(String(v ?? "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* --------------------------------------------------------------- Cron cleanup
   Runs on a schedule (see [triggers] in wrangler.toml). Bounds the two tables
   that would otherwise grow forever: stale rate-limit counters, and orphaned
   media uploads (older than a 2-day grace and referenced by nothing). */
async function cleanup(env: Bindings) {
  const now = Date.now();
  // Prune rate-limit rows whose window has elapsed and which are not locked.
  await env.DB.prepare("DELETE FROM rate_limit WHERE locked_until < ? AND window_start < ?")
    .bind(now, now - 60 * 60 * 1000)
    .run();
  // Remove orphaned media older than the grace period (referenced nowhere).
  await env.DB.prepare(
    `DELETE FROM media
     WHERE created_at < datetime('now', '-2 days')
       AND id NOT IN (
         SELECT m.id FROM media m WHERE
              EXISTS (SELECT 1 FROM reviews r WHERE r.avatar LIKE '%' || m.id || '%' OR r.photos LIKE '%' || m.id || '%')
           OR EXISTS (SELECT 1 FROM pricing p WHERE p.image LIKE '%' || m.id || '%')
           OR EXISTS (SELECT 1 FROM gallery g WHERE g.before_url LIKE '%' || m.id || '%' OR g.after_url LIKE '%' || m.id || '%')
           OR EXISTS (SELECT 1 FROM posts po WHERE po.cover LIKE '%' || m.id || '%')
           OR EXISTS (SELECT 1 FROM content c WHERE c.value LIKE '%' || m.id || '%')
       )`
  ).run();
}

export default {
  fetch: app.fetch,
  scheduled: (_event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) => {
    ctx.waitUntil(cleanup(env));
  },
};
