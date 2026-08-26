# New Green — Project Status (Live)

Single source of truth for what is built, deployed, and verified. Companion docs:
[DEPLOY.md](DEPLOY.md), [CMS_SETUP.md](CMS_SETUP.md), [DESIGN.md](DESIGN.md).

_Last verified: full feature sprint (blog, gallery, promo banner, editable content, admin tools) end-to-end tested against a local CMS + verified live, 26 Aug 2026._

## Live URLs
- **Website:** https://newgreenwindowsandhousecleaning.ca (apex). `www` is optional and not required.
- **Admin:** https://newgreenwindowsandhousecleaning.ca/admin (password login)
- **CMS API (worker):** https://newgreen-cms.neegreen512.workers.dev
- **Repo:** `neegreen512-coder/New-Green-windows-House-Cleaning` (default branch `main`)
- **Cloudflare account:** neegreen512 (account id `9958f74e9be097afee7de73607bbea65`)

## Stack & hosting
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, deployed to **Cloudflare Workers via OpenNext** (`@opennextjs/cloudflare`).
- CMS: a separate **Cloudflare Worker** (Hono) + **D1** database `newgreen-db`.
- Display font **Outfit**, body **Geist**, mono **Geist Mono**. Brand mark: two-tone green "N".

## Deployment pipeline (auto-deploy)
On every push to `main`, GitHub Actions deploys automatically:
- **Deploy Site** — builds with OpenNext and deploys the site worker (`newgreen-site`). Runs for any change except `cms/**` and markdown.
- **Deploy CMS** — applies D1 migrations `--remote` and deploys the CMS worker (`newgreen-cms`). Runs on `cms/**` changes.

Auth uses two GitHub repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Both pipelines are green.

## Pages (all return 200)
`/` · `/quote` · `/quote-request-received` · `/pricing` · `/gallery` · `/blog` · `/blog/[slug]` · `/window-cleaning` · `/house-cleaning` · `/deep-cleaning` · `/about` · `/contact` · `/faq` · `/service-areas` · `/privacy` · `/terms` · `/admin`. Plus `/sitemap.xml`, `/icon.svg`, and a Cloudflare-managed `/robots.txt`.

Removed: Move-In / Move-Out (its route 404s by design). Dead-link crawl: clean.

## Homepage
Full-screen photographic hero → Services → before/after slider (same-image dirty→clean) → "A service built on the details" → cinematic band → **interactive 4-step process** (a single light eases along the rail with scroll) → Pricing → Testimonials (sliding marquee; "Leave a review" opens a modal) → final CTA. `AggregateRating` + `HomeAndConstructionBusiness` JSON-LD in the head. No water animation (removed everywhere).

## CMS backend (D1 tables: reviews, pricing, content, quotes, messages, media, **posts**, **gallery**)
`reviews` also has `sort` + `featured`; `quotes`/`messages` also have `admin_notes` (migration `0005_features.sql`).

Public:
- `GET /api/reviews` (approved, ordered featured → sort → newest) · `POST /api/reviews` (visitor submit + avatar/photos, lands pending)
- `GET /api/pricing` · `GET /api/content`
- `GET /api/posts` (published) · `GET /api/posts/:slug` · `GET /api/gallery`
- `POST /api/quotes` · `POST /api/messages` (leads)
- `POST /api/upload` (image → stored in D1) · `GET /media/:id` (serve image)

Admin (behind login on the site, and the worker's secret): full CRUD for reviews (incl. edit / feature / sort), pricing, quotes (status new/handled/won/lost + notes), messages (+ notes), **posts**, **gallery**, and `content` (banner, business details, FAQ, service areas).

Verified: every admin endpoint tested against a local D1 copy — creates/edits persist, public reads reflect them, and the site renders them (blog post, gallery item, promo banner, edited business details, FAQ, city, featured+edited review all confirmed end-to-end).

## Admin (`/admin`) — 7 tabs
- **Login:** password (an `ADMIN_PASSWORD` server env var) → HMAC-signed httpOnly session. No Cloudflare Access / no card. Sign-out included.
- **Overview:** at-a-glance counts — new leads, reviews awaiting approval, total reviews, posts, gallery items (the first two are clickable shortcuts).
- **Reviews:** see all with photos; approve / unapprove; **inline edit** (name/text/rating/service); **feature** (pins to the front of the site); **reorder** (sort number); delete; add (with photo upload); one-click "load sample reviews".
- **Leads:** quotes + messages split into **New** and **Handled — history**; mark handled / reopen; **Won / Lost**; **private owner notes** per lead; **Export CSV**; delete. Handled leads are kept as a permanent record; only Delete removes anything.
- **Pricing:** add / edit / delete (max 3 packages), prices, package image, featured / active / sort, "load starter packages".
- **Gallery:** upload before + after photos, caption, service, ordering. Shows a sample set on the live site until real photos are added.
- **Blog:** write / edit / delete posts (title, excerpt, body with `## ` subheadings, cover upload, tag, read-time, draft/publish); one-click "load the 10 starter posts" to make the built-in articles editable.
- **Site content:** toggle a **promo banner** (text + link, dismissible site-wide); edit **business details** (phone / email / hours / address — flow to footer, contact, FAQ); edit the **FAQ list**; edit the **service-area cities**.

Images (reviewer photo, house photos, package/gallery/blog images) are resized in the browser and stored in D1 (no R2, no card). Owner edits appear on the live site within ~60s (ISR).

## Analytics
Google Analytics 4 tag **G-THHT567H3G** loads site-wide (`next/script`, id in `analytics.ga4Id`). Verified live: the tag initializes (`google_tag_manager['G-THHT567H3G']` present) and fires.

Google Ads quote conversion should point at `https://newgreenwindowsandhousecleaning.ca/quote-request-received`.

## Brand assets (`public/brand/`)
- `newgreen-logo.png` — logo (N + wordmark, transparent)
- `newgreen-logo-white.png` — logo on white
- `newgreen-logo-square.png` — square N mark (for the Ads square-logo slot)
- `newgreen-ad-landscape.jpg` (1200×628) — Google Ads banner + the site's social-share (OG) image
- `newgreen-ad-square.jpg` (1200×1200) — square Ads image

## Security
- `/admin` and `/api/admin/*` require login (401 otherwise).
- The CMS worker's admin API requires the shared secret (401 otherwise).

## Blog & editable content — how it works
- The blog ships with **10 built-in cleaning-tips articles** (`src/lib/blog.ts`) shown as a fallback, so `/blog` is never empty even before the owner writes anything. As soon as any post exists in the CMS, the CMS posts take over. "Load the 10 starter posts" in the Blog tab copies the built-ins into the CMS so they become editable.
- Promo banner, business details, FAQ, and service-area cities live in the `content` key/value store and fall back to the code defaults when unset.

## Optional / not built (none blocking)
- Email notification when a new quote or message arrives (needs an email service — Turnstile spam protection also recommended before heavy traffic).
- Orphan-image cleanup (deleting a review/package/gallery/blog item leaves its uploaded images in D1).
- `www` custom domain (apex works; add via Workers → newgreen-site → Domains & Routes → Add Custom Domain).
- Roll the Cloudflare API token (it was pasted in chat during setup).

## Housekeeping
Delete the automated test rows named "ZZ Automated Test (delete me)" in the admin (1 review, 1 quote, 1 message).
