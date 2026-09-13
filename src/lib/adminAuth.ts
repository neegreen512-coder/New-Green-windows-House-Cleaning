import "server-only";
import { cookies } from "next/headers";

// Simple in-app admin auth: a password (ADMIN_PASSWORD worker secret) grants an
// HMAC-signed, httpOnly session cookie. Signing key is the server-only
// CMS_ADMIN_SECRET. Fail-closed: with no ADMIN_PASSWORD set, login always fails.

export const ADMIN_COOKIE = "ng_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** True only when the session-signing secret is configured. */
export function adminConfigured(): boolean {
  return !!process.env.CMS_ADMIN_SECRET;
}

function signingKey(): Uint8Array {
  const secret = process.env.CMS_ADMIN_SECRET;
  // Fail-closed: never fall back to a shared/constant key (that would make every
  // admin session forgeable). Callers gate on adminConfigured() first, so this
  // only throws on genuine misuse.
  if (!secret) throw new Error("CMS_ADMIN_SECRET is not set; admin auth is disabled.");
  return new TextEncoder().encode(secret);
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    signingKey() as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data) as unknown as BufferSource
  );
  return Buffer.from(new Uint8Array(sig)).toString("base64url");
}

export async function makeSessionToken(): Promise<string> {
  const payload = `admin.${Date.now() + ADMIN_MAX_AGE * 1000}`;
  return `${payload}.${await hmac(payload)}`;
}

async function verify(token: string | undefined): Promise<boolean> {
  if (!adminConfigured()) return false; // fail-closed when the signing key is absent
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  if (role !== "admin") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return sig === (await hmac(`${role}.${expStr}`));
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return verify(store.get(ADMIN_COOKIE)?.value);
}
