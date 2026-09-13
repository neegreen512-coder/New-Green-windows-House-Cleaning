# New Green — Security & Anti-Spam

What is in place, and the two steps that need the client's Cloudflare account.

## In the code (active once deployed)

**HTTP security headers** (all routes, `next.config.ts`): Content-Security-Policy,
Strict-Transport-Security (HSTS, 2 years, preload), X-Frame-Options: DENY,
X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy,
X-DNS-Prefetch-Control. The CSP allowlists only self, Google Analytics, the CMS
worker, and Cloudflare Turnstile.

**Form anti-spam** (CMS worker, applies to `/api/quotes`, `/api/messages`,
`/api/reviews`):
1. **Honeypot** — a hidden `website` field; any submission that fills it is
   silently dropped (the bot sees a success response).
2. **Per-IP rate limit** (D1-backed) — quotes/messages 8/hour, reviews 5/hour;
   over the limit returns HTTP 429.
3. **Cloudflare Turnstile** — verified server-side when keys are set (below).

**CORS** — the CMS API now only accepts browser calls from the site's own
origins (was `*`). Server-side calls are unaffected.

**Admin login lockout** — `/api/admin-login` checks a D1-backed counter in the
CMS: 8 failed attempts from one IP within 15 minutes locks that IP for 15
minutes (HTTP 429). Fail-open: if the CMS is unreachable the password check
still runs, so the owner can never be locked out by an outage.

**Admin chrome** — `/admin` now renders as a bare tool (its own route group),
with none of the public marketing header/footer.

## Two steps that need the client's Cloudflare account

### 1. Cloudflare Turnstile (free CAPTCHA)
1. Cloudflare dashboard -> Turnstile -> Add widget (hostname:
   `newgreenwindowsandhousecleaning.ca`). Copy the **site key** and **secret key**.
2. Site: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY = <site key>` (a Worker var on
   `newgreen-site`, or in `.env.production`, then redeploy).
3. CMS worker: `cd cms && wrangler secret put TURNSTILE_SECRET` -> paste the
   **secret key**.

Until these are set, the honeypot + rate limit are the active protection and the
widget simply does not render.

### 2. Cloudflare Access on the admin (defense in depth)
Zero Trust -> Access -> Applications -> protect **both** `/admin` and
`/api/admin/*` on the site, allowing the owner's email. This puts a login in
front of the app before the password screen is even reachable.

## Post-deploy checks
- `curl -sSI https://newgreenwindowsandhousecleaning.ca | grep -i content-security`
  shows the CSP header.
- Submit a quote/message/review and confirm it still lands in the admin Leads.
- Watch the browser console on the live site for any CSP violation; if a needed
  resource is blocked, add its host to the relevant CSP directive in
  `next.config.ts`.
