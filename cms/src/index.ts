import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
  ADMIN_SECRET?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: "*",
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

app.get("/api/health", (c) => c.json(ok({ status: "up" })));

/* --------------------------------------------------------------- Media (D1)
   Images are resized small on the client, then stored as BLOBs in D1 and
   served back here. Avoids needing R2. */

const MAX_UPLOAD = 1_600_000; // ~1.6MB after client-side resize

app.post("/api/upload", async (c) => {
  const mime = c.req.header("content-type") || "";
  if (!mime.startsWith("image/")) {
    return c.json({ ok: false, error: "Only image files are allowed." }, 400);
  }
  const buf = await c.req.arrayBuffer();
  if (buf.byteLength === 0) return c.json({ ok: false, error: "Empty file." }, 400);
  if (buf.byteLength > MAX_UPLOAD) return c.json({ ok: false, error: "Image is too large." }, 413);

  const id = crypto.randomUUID().replace(/-/g, "");
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
    },
  });
});

/* ----------------------------------------------------------------- Public */

app.get("/api/reviews", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, context, service, quote, rating, avatar, photos, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 60"
  ).all<Record<string, unknown>>();
  return c.json(ok(results.map((r) => ({ ...r, photos: safeJson(r.photos) }))));
});

// Public review submission -> stored as pending for the owner to approve.
app.post("/api/reviews", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ ok: false, error: "Invalid request." }, 400);

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
  if (secret && c.req.header("x-cms-secret") !== secret) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }
  await next();
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

admin.patch("/reviews/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const status = b.status === "approved" ? "approved" : "pending";
  await c.env.DB.prepare("UPDATE reviews SET status = ? WHERE id = ?")
    .bind(status, c.req.param("id"))
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

admin.patch("/quotes/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const status = b.status === "handled" ? "handled" : "new";
  await c.env.DB.prepare("UPDATE quotes SET status = ? WHERE id = ?")
    .bind(status, c.req.param("id"))
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
  const status = b.status === "handled" ? "handled" : "new";
  await c.env.DB.prepare("UPDATE messages SET status = ? WHERE id = ?")
    .bind(status, c.req.param("id"))
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

admin.post("/pricing", async (c) => {
  const b = await c.req.json().catch(() => ({}));
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
    ).bind(str(k, 60), str(v, 4000))
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

export default app;
