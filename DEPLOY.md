# New Green — Deploy Runbook (CMS Worker via GitHub Actions)

This deploys the **CMS worker** (`cms/`) to the client's Cloudflare account. The
Next.js site is hosted separately (see the last section).

> Security: never commit or paste your Cloudflare API token. Add it only in
> GitHub's encrypted secrets UI. If a token is ever exposed, roll it (Cloudflare
> → My Profile → API Tokens → delete and recreate).

## 1. Add the two GitHub Actions secrets

In the client's repo: **Settings → Secrets and variables → Actions → New
repository secret**. Add both:

| Secret name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the API token (perms: Workers Scripts = Edit, D1 = Edit, Account Settings = Read) |
| `CLOUDFLARE_ACCOUNT_ID` | the 32-hex Account ID from the Cloudflare dashboard sidebar |

The Cloudflare **login email is not a secret** and is not added here.

## 2. One-time: create the D1 database and record its id

The CI needs the database to exist and its id committed in `cms/wrangler.toml`.
Run this once in a terminal (token kept in the shell only, never committed):

```bash
cd cms
export CLOUDFLARE_API_TOKEN=your_token_here   # do not commit this
export CLOUDFLARE_ACCOUNT_ID=your_account_id
npx wrangler d1 create newgreen-db
```

Copy the printed `database_id` into `cms/wrangler.toml`:

```toml
database_id = "PASTE_THE_ID_HERE"
```

Then commit that one-line change.

## 3. Push the code to the repo

```bash
git remote add origin <YOUR_REPO_URL>
git push -u origin master        # CI also accepts a "main" branch
```

## 4. CI deploys the worker

The **Deploy CMS** workflow (`.github/workflows/deploy-cms.yml`) runs on any push
that touches `cms/**`. It installs deps, applies D1 migrations `--remote`, and
runs `wrangler deploy`. Watch the repo's **Actions** tab. On success, Cloudflare
prints the **Worker URL** (e.g. `https://newgreen-cms.<subdomain>.workers.dev`).

The workflow deliberately does **not** run `seed.sql` (it wipes tables). Seed once
by hand if you want demo data (step 5).

## 5. One-time production setup

```bash
cd cms
# Optional demo data (WIPES the tables — first-time only):
npx wrangler d1 execute newgreen-db --remote --file=./seed.sql

# Admin secret used by the admin API:
npx wrangler secret put ADMIN_SECRET      # paste a random 32-hex string
```

- **Cloudflare Access:** in Zero Trust → Access → Applications, protect **both**
  `/admin` and `/api/admin/*` on the site, allowing the owner's email.
- Set the same `ADMIN_SECRET` value as `CMS_ADMIN_SECRET` on the **site** host.

## 6. Deploy the site (separate decision)

Next.js 16 does not run natively on Cloudflare Pages. Two options:

- **Vercel:** import the repo, set env `NEXT_PUBLIC_CMS_URL` (the Worker URL) and
  `CMS_ADMIN_SECRET`. Simplest.
- **Cloudflare (OpenNext):** add the `@opennextjs/cloudflare` adapter and deploy
  to Workers/Pages, same env vars.

Set `NEXT_PUBLIC_CMS_URL` to the Worker URL from step 4 so the live site reads the
CMS. `CMS_ADMIN_SECRET` (server-only) must equal the worker's `ADMIN_SECRET`.

## Quick checklist

- [ ] `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` added as GitHub secrets
- [ ] `wrangler d1 create newgreen-db` run, `database_id` pasted into `cms/wrangler.toml`, committed
- [ ] Code pushed to the repo
- [ ] Deploy CMS workflow green; Worker URL noted
- [ ] `ADMIN_SECRET` set on the worker; Cloudflare Access on `/admin` + `/api/admin/*`
- [ ] Site deployed with `NEXT_PUBLIC_CMS_URL` + `CMS_ADMIN_SECRET`
