# New Green CMS — Setup, Keys, and Deploy

The owner admin (manage reviews, pricing packages, and content) is a small
Cloudflare-native backend built from open-source libraries:

- **Hono** (open source) API running on a **Cloudflare Worker**
- **Cloudflare D1** (free SQLite database) for reviews, pricing, and content
- **Cloudflare Access** (free) to lock the admin behind the owner's login
- The website reads live data from the Worker, so edits appear without a rebuild

Everything runs and is tested **locally** with `wrangler` (no account needed for
dev). You only need the keys below to deploy to the **client's** Cloudflare and
GitHub. I will not deploy to your accounts.

---

## What you (the client) need to create

Do these on the **client's** Cloudflare + GitHub. Send me the values marked
"→ give me", or paste them into the files/secrets noted.

| # | Resource | How to get it | Where it goes |
|---|----------|---------------|---------------|
| 1 | **Cloudflare account** | Free sign-up at dash.cloudflare.com | — |
| 2 | **Account ID** | Cloudflare dashboard → right sidebar | GitHub secret `CLOUDFLARE_ACCOUNT_ID` |
| 3 | **API Token** | Cloudflare → My Profile → API Tokens → Create. Permissions: **D1 = Edit**, **Workers Scripts = Edit**, **Cloudflare Pages = Edit**, **Account Settings = Read** | GitHub secret `CLOUDFLARE_API_TOKEN` |
| 4 | **D1 database** | `wrangler d1 create newgreen-db` → copy the `database_id` | Paste into `cms/wrangler.toml` (`database_id`) → give me if you want me to paste it |
| 5 | **Admin secret** | Generate a random string: `openssl rand -hex 32` | `cd cms && wrangler secret put ADMIN_SECRET` (paste when prompted), and set the same value as a Pages env var `CMS_ADMIN_SECRET` |
| 6 | **GitHub repo** | Create a repo on the client's GitHub, push this project | Connect it to Cloudflare Pages + Workers |
| 7 | **Cloudflare Access** | Zero Trust → Access → Applications → protect **both** `/admin` and `/api/admin/*`, allow the owner's email | Owner logs in with email one-time-code |
| 8 | **Worker URL** | After the first `wrangler deploy`, Cloudflare prints the Worker URL | Set as website env var `NEXT_PUBLIC_CMS_URL` |

**The only true "API key" is #3** (the Cloudflare API Token). Items 2 and 5 are
values, not keys. Nothing here touches your personal accounts.

---

## Run it locally (works today, no account)

```bash
cd cms
pnpm install
pnpm db:apply:local      # create the tables in a local database
pnpm db:seed:local       # load sample reviews + pricing
pnpm dev                 # API on http://localhost:8787
```

Quick check:

```bash
curl http://localhost:8787/api/reviews
```

---

## Deploy (on the client's account)

```bash
cd cms
# 1. Log in to the CLIENT's Cloudflare
wrangler login
# 2. Create the database, paste the id into wrangler.toml
wrangler d1 create newgreen-db
# 3. Create tables + seed on the real database
pnpm db:apply:remote
pnpm db:seed:remote
# 4. Set the admin secret
wrangler secret put ADMIN_SECRET
# 5. Deploy the API
pnpm deploy
```

Then protect the admin with Cloudflare Access and set `NEXT_PUBLIC_CMS_URL` +
`CMS_ADMIN_SECRET` on the website (Pages) project.

---

## API surface (already built)

Public (used by the website):
- `GET /api/reviews` — approved reviews
- `POST /api/reviews` — visitor submits a review (saved as pending)
- `GET /api/pricing` — active pricing packages
- `GET /api/content` — editable text blocks

Admin (behind Cloudflare Access + `x-cms-secret`):
- `GET/POST /api/admin/reviews`, `PATCH/DELETE /api/admin/reviews/:id` — moderate, add, approve, delete
- `GET/POST /api/admin/pricing`, `PUT/DELETE /api/admin/pricing/:id` — manage packages
- `GET/PUT /api/admin/content` — edit text blocks

---

## Admin screen (built)

The website now includes an `/admin` dashboard (reviews queue, pricing editor,
content editor). It never holds the admin secret: the browser calls a same-origin
Next proxy at `/api/admin/*` (`src/app/api/admin/[...path]/route.ts`), which
injects `CMS_ADMIN_SECRET` server-side and forwards to this worker's admin API.

**Security (important):** because the proxy adds the secret for any caller, the
secret alone does not protect the admin. In production you MUST put Cloudflare
Access in front of **both** `/admin` and `/api/admin/*` (see row 7 above). Set
`CMS_ADMIN_SECRET` as a server-side env var on the website (Pages) project, equal
to the worker's `ADMIN_SECRET`. The website's testimonials and pricing already
read live from this API with a safe static fallback.

## Still to come (next steps)

- Optional: R2 bucket for owner-uploaded images
- Wire the quote and contact forms (`submitQuote` / `submitContact`) to a real
  endpoint (a worker route or email); they are frontend-only mocks today
