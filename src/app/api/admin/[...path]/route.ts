import { NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";

/**
 * Server-side proxy to the CMS worker's admin API. The admin secret is injected
 * here (server-only env), so the browser never sees it. In production this route
 * AND the /admin page must be protected by Cloudflare Access; the secret alone
 * does not gate access because this proxy adds it for any caller.
 */

export const dynamic = "force-dynamic";

const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8787").replace(/\/$/, "");
const SECRET = process.env.CMS_ADMIN_SECRET || "";

async function proxy(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search || "";
  const target = `${CMS_URL}/api/admin/${path.join("/")}${search}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (SECRET) headers["x-cms-secret"] = SECRET;

  const init: RequestInit = { method: req.method, headers, cache: "no-store" };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  try {
    const res = await fetch(target, init);
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "CMS is unreachable." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

type Ctx = { params: Promise<{ path: string[] }> };
const handler = async (req: NextRequest, ctx: Ctx) => {
  if (!(await isAdminAuthed())) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { path } = await ctx.params;
  return proxy(req, path);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
