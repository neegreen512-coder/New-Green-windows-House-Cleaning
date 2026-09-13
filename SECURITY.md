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

**Admin protection (no Cloudflare Access / Zero Trust).** The admin is gated in
the app, not at the edge, so it needs no Zero Trust onboarding (which asks for a
billing address even on the free plan). Three layers:
1. **Password** (`ADMIN_PASSWORD`) -> HMAC-signed httpOnly session cookie.
2. **Turnstile on the login form** — an automated bot cannot even attempt a
   password guess without passing the challenge.
3. **IP lockout** — 8 failed attempts from one IP within 15 minutes locks that IP
   for 15 minutes (HTTP 429), tracked in the CMS D1. A missing/invalid Turnstile
   token also counts as a failed attempt. Fail-open on a CMS outage, so the owner
   is never locked out by an outage (the password is still required).

The CMS admin API is separately gated by a shared secret, and the site's
`/api/admin/*` proxy requires the login cookie.

**Required:** `CMS_ADMIN_SECRET` must be set on the site Worker (it is). It signs
the session cookie, and the admin now **fails closed** if it is missing (no
sign-in, rather than falling back to a shared key). The per-IP counters use a
single atomic SQL statement (no read-modify-write race), and the public image
upload endpoint is rate-limited and restricted to raster types (no SVG).

**Admin chrome** — `/admin` now renders as a bare tool (its own route group),
with none of the public marketing header/footer.

## Turnstile keys (configured)

Turnstile is live. The keys are stored as:
- **Site key** (public): `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.production`,
  baked into the site build. Powers the widget on the quote, contact, review,
  and admin-login forms.
- **Secret key**: a GitHub Actions repo secret `TURNSTILE_SECRET`, which the
  Deploy CMS workflow pushes to the Worker (`wrangler secret put`) on each
  deploy. Never committed to the repo.

To rotate: create a new widget in Cloudflare -> Turnstile, update
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.production`, and
`gh secret set TURNSTILE_SECRET` (then redeploy the CMS).

## Client dashboard actions (cannot be done in code)

**`www` does not resolve.** The apex works; `www.newgreenwindowsandhousecleaning.ca`
returns NXDOMAIN. Fix in Cloudflare (DNS/Workers for the domain's zone):
- Easiest: **Rules -> Redirect Rules -> add** "Redirect from www to apex" (301,
  `https://www.$1` -> `https://newgreenwindowsandhousecleaning.ca/$1`), plus a
  proxied `www` DNS record (CNAME `www` -> `@`, orange cloud) so the hostname
  resolves. Or add `www` as a Custom Domain on the `newgreen-site` Worker.

**robots.txt blocks AI crawlers.** Cloudflare serves a *managed* robots.txt that
blocks GPTBot, ClaudeBot, Google-Extended, etc., and it shadows the app's own
`robots.txt`. To let the site appear in AI answers, turn off the managed
robots.txt / "Block AI bots" setting for the domain in the Cloudflare dashboard
(Manage Account/domain -> the robots.txt or AI-bot control). The app then serves
`src/app/robots.ts`, which allows all crawlers except `/admin` and `/api/`.
(Tradeoff: allowing AI crawlers also allows AI training on the public marketing
content, which is generally fine for a marketing site.)

## Cloudflare Access — intentionally skipped

Zero Trust / Access was skipped on purpose (its onboarding requires a payment
method + billing address). The three-layer app-level admin protection above is
used instead. If the client later wants edge Access, it can be added without any
code change.

## Post-deploy checks
- `curl -sSI https://newgreenwindowsandhousecleaning.ca | grep -i content-security`
  shows the CSP header.
- Submit a quote/message/review and confirm it still lands in the admin Leads.
- Watch the browser console on the live site for any CSP violation; if a needed
  resource is blocked, add its host to the relevant CSP directive in
  `next.config.ts`.
