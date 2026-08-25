import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { makeSessionToken, ADMIN_COOKIE, ADMIN_MAX_AGE } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  // Fail-closed: no password configured means no one can sign in.
  if (!expected || password.length === 0 || password !== expected) {
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
