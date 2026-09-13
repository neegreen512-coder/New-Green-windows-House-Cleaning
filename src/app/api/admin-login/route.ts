import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { makeSessionToken, ADMIN_COOKIE, ADMIN_MAX_AGE, adminConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8787").replace(/\/$/, "");
const SECRET = process.env.CMS_ADMIN_SECRET || "";

/**
 * IP-based brute-force lockout, backed by the CMS worker's D1 (the only shared,
 * durable store available). Fail-open on any error so a CMS outage can never
 * lock the owner out; the password check still runs regardless.
 */
async function loginGate(
  ip: string,
  result?: "success" | "fail"
): Promise<{ blocked: boolean; retryAfter?: number }> {
  try {
    const res = await fetch(`${CMS_URL}/api/admin/login-attempt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SECRET ? { "x-cms-secret": SECRET } : {}),
      },
      body: JSON.stringify({ ip, result }),
    });
    if (!res.ok) return { blocked: false };
    const j = await res.json().catch(() => null);
    return { blocked: !!j?.data?.blocked, retryAfter: j?.data?.retryAfter };
  } catch {
    return { blocked: false };
  }
}

// Ask the CMS (which holds the Turnstile secret) to verify the login token.
// Fail-open on transport errors so a CMS outage never blocks the owner; the
// password is still required. Returns false only on an explicit failed verdict.
async function verifyLoginTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch(`${CMS_URL}/api/admin/turnstile-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SECRET ? { "x-cms-secret": SECRET } : {}),
      },
      body: JSON.stringify({ token, ip }),
    });
    if (!res.ok) return true;
    const j = await res.json().catch(() => null);
    return j?.data?.success !== false;
  } catch {
    return true;
  }
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // Fail-closed: without the session-signing secret (and password) no one can
  // sign in, and we must not issue a cookie we cannot securely sign.
  if (!adminConfigured() || !process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: "Admin is not configured." }, { status: 503 });
  }

  const ip = clientIp(req);

  // Pre-check the lockout before doing any work (does not count as an attempt).
  const pre = await loginGate(ip);
  if (pre.blocked) {
    return Response.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429, headers: pre.retryAfter ? { "Retry-After": String(pre.retryAfter) } : {} }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  // When Turnstile is configured, require and verify a token before the
  // password check, so automated brute-force cannot even attempt a guess.
  // A failed/missing challenge does NOT count toward the IP lockout: Turnstile
  // already stops the bot, and counting it would let tokenless requests lock out
  // anyone sharing the owner's egress IP.
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    const token = String(body?.turnstileToken ?? "");
    if (!token || !(await verifyLoginTurnstile(token, ip))) {
      return Response.json(
        { ok: false, error: "Verification failed. Please try again." },
        { status: 400 }
      );
    }
  }

  // Fail-closed: no password configured means no one can sign in.
  const ok = expected.length > 0 && password.length > 0 && password === expected;

  // Record the outcome (success resets the counter; failure increments it).
  const post = await loginGate(ip, ok ? "success" : "fail");

  if (!ok) {
    if (post.blocked) {
      return Response.json(
        { ok: false, error: "Too many attempts. Please try again later." },
        { status: 429, headers: post.retryAfter ? { "Retry-After": String(post.retryAfter) } : {} }
      );
    }
    return Response.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await makeSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
