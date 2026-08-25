# New Green — Project Status (Live)

Single source of truth for what is built, deployed, and verified. Companion docs:
[DEPLOY.md](DEPLOY.md), [CMS_SETUP.md](CMS_SETUP.md), [DESIGN.md](DESIGN.md).

_Last verified: end-to-end backend + integrity audit, 25 Aug 2026._

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
`/` · `/quote` · `/quote-request-received` · `/window-cleaning` · `/house-cleaning` · `/deep-cleaning` · `/about` · `/contact` · `/faq` · `/service-areas` · `/privacy` · `/terms` · `/admin`. Plus `/sitemap.xml`, `/icon.svg`, and a Cloudflare-managed `/robots.txt`.

Removed: Move-In / Move-Out (its route 404s by design). Dead-link crawl: clean.

## CMS backend (D1 tables: reviews, pricing, content, quotes, messages, media)
Public:
- `GET /api/reviews` (approved) · `POST /api/reviews` (visitor submit + avatar/photos, lands pending)
- `GET /api/pricing` · `GET /api/content`
- `POST /api/quotes` · `POST /api/messages` (leads)
- `POST /api/upload` (image → stored in D1) · `GET /media/:id` (serve image)

Admin (behind login on the site, and the worker's secret): full CRUD for reviews, pricing, quotes, messages.

Verified: reads OK, writes validate + persist, image upload/serve round-trips exact bytes.

## Admin (`/admin`)
- **Login:** password (an `ADMIN_PASSWORD` worker secret) → HMAC-signed httpOnly session. No Cloudflare Access / no card. Sign-out included.
- **Reviews:** see all with reviewer photo + house photos, approve / unapprove, delete, add (with photo upload), one-click "load sample reviews".
- **Leads:** quote requests + contact messages, mark handled / reopen, delete.
- **Pricing:** add / edit / delete packages, change prices, upload / remove a package image, featured / active / sort, one-click "load starter packages".

Images (reviewer photo, house photos, package images) are resized in the browser and stored in D1 (no R2, no card).

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

## Optional / not built (none blocking)
- Edit an existing review's text (currently add / approve / delete only).
- Email notification when a new quote or message arrives (needs an email service).
- Orphan-image cleanup (deleting a review/package leaves its uploaded images in D1).
- `www` custom domain (apex works; add via Workers → newgreen-site → Domains & Routes → Add Custom Domain).
- Roll the Cloudflare API token (it was pasted in chat during setup).

## Housekeeping
Delete the automated test rows named "ZZ Automated Test (delete me)" in the admin (1 review, 1 quote, 1 message).
