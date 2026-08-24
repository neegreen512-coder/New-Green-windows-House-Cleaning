# New Green — Project Handover

Single source of truth for the New Green Windows & House Cleaning website. Read
this first in any new session. Companion docs: [DESIGN.md](DESIGN.md) (design
system) and [CMS_SETUP.md](CMS_SETUP.md) (backend keys + deploy).

_Last updated: end of the build session that produced the flowing-water
background, water header wordmark, messy/clean before-after slider, and vibrant
process icons._

---

## 1. What this is

A premium marketing website for **New Green Windows & House Cleaning**, a
residential window + house cleaning company serving **Mississauga and the GTA**.
Built from scratch. The homepage is complete and polished; inner pages and the
admin UI are still to build (see section 8).

## 2. Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** + **Tailwind v4**
- Fonts (via `next/font`): **Bricolage Grotesque** (display / headings / logo),
  **Geist** (body), **Geist Mono** (eyebrows / labels / numbers)
- **framer-motion** for reveals + interactions
- Icons: **@phosphor-icons/react** (feature + step icons) and **lucide-react** (small utility glyphs)
- **WebGL** (hand-written shaders) for the flowing-water background and the
  water-filled header wordmark
- **pnpm**
- Backend/CMS: a separate **Cloudflare Worker** (Hono) + **D1** in `cms/`

## 3. Run it

```bash
# --- the website ---
pnpm install
pnpm dev            # http://localhost:3000
pnpm build          # production build (verifies types)

# --- the CMS worker (separate) ---
cd cms
pnpm install
pnpm db:apply:local # create local D1 tables
pnpm db:seed:local  # load demo reviews + pricing
pnpm dev            # http://localhost:8787
```

The site reads live reviews from the worker at `http://localhost:8787`
(configurable via `NEXT_PUBLIC_CMS_URL`); if the worker is off it falls back to
built-in demo reviews, so the site still runs standalone.

**Gotcha:** the local D1 is single-writer. Stop the CMS `wrangler dev` (kill
`workerd.exe`) before running `db:apply:local` / `db:seed:local`, or they hang.

## 4. Seeing the result (important)

This build environment's in-app Browser pane cannot composite frames, so
screenshots there fail. A headless browser is set up in the scratchpad instead:

```bash
node shot.js <url> <out.png> [waitMs] [clipH] [scrollText]
# e.g. node shot.js http://localhost:3000 top.png 3500 760
#      node shot.js http://localhost:3000 reviews.png 4000 760 "What a great clean"
```

`shot.js` lives in the session scratchpad (Playwright + Chromium, swiftshader so
WebGL renders). Re-create it if starting clean: launch chromium, goto url, wait,
screenshot (optionally scroll an element containing `scrollText` into view).

## 5. Design system

Tokens live in `src/app/globals.css` (`@theme`). Full reference in `DESIGN.md`.

- **Colours:** forest green `#124a37` (primary), fresh green `#2e7d5b`, warm
  brass `#c0902f` (accent, sparingly), warm stone `#f6f5f0` (page ground),
  ink `#14201b`, muted `#57655e`.
- **Hard rules (do not break):** no em dashes in copy, no "dot pills", no
  AI-slop animation, premium and restrained.
- **Model split the client set:** Fable 5 for design direction, Opus 4.8 for implementation.

## 6. Structure

```
src/
  app/
    layout.tsx        # fonts, metadata/SEO, WaterBackground, header/footer/mobile bar
    page.tsx          # homepage composition + LocalBusiness JSON-LD
    globals.css       # design tokens + component classes + keyframes
    icon.svg          # favicon (Clear Drop)
  lib/
    site.ts           # ALL editable business data, services, faqs, images, submitQuote seam
    cms.ts            # client for the CMS worker (reviews)
  components/
    Brand.tsx         # LogoMark ("Clear Drop") + wordmark
    WaterBackground.tsx   # full-page flowing water streams (WebGL)
    HeaderWaterLogo.tsx   # water-filled "New Green" wordmark for the header (WebGL)
    SiteHeader.tsx / SiteFooter.tsx / MobileQuoteBar.tsx
    BeforeAfter.tsx   # messy->clean slider (auto-sweep + drag)
    Faq.tsx, ReviewForm.tsx, SectionHeading.tsx, motion.tsx, icons.tsx, Motifs.tsx
    sections/         # Hero, TrustStrip, Services, DifferenceSection, WhyUs,
                      # CinematicBand, Process, FeaturedSection, Testimonials,
                      # ServiceAreaSection, FaqSection, FinalCta
public/images/        # cleaner photos, service-area aerial, before-messy/after-clean, avatars/
cms/                  # Cloudflare Worker (Hono) + D1: migrations/, seed.sql, src/index.ts, wrangler.toml
```

## 7. What's built (done)

**Brand + identity**
- Logo: "Clear Drop" — deep-green pane with a water droplet cut out as negative
  space + a brass gleam (`Brand.tsx`); favicon matches (`icon.svg`).
- Full design system, type scale, buttons, cards, shadows, grain, motion.

**Homepage (top to bottom)**
1. **Water background** (fixed, full-page): flowing teal-green water streams,
   directional, subtle, GPU-cheap, pauses when tab hidden, reduced-motion safe.
2. **Header** (floating glass bar): Clear Drop mark + **water-filled flowing
   "New Green"** wordmark; Services dropdown, animated underlines, active state;
   full-screen mobile menu; "Get a free quote". (No more bubbles.)
3. **Hero:** localized eyebrow, "A cleaner home. A brighter view.", two CTAs,
   trust row, cleaner-in-action photo with "New Green team" + "Fully insured".
4. **Trust strip** (5 points, Phosphor icons).
5. **Services:** two editorial rows (Window + House) with curtain image reveals.
6. **See the difference:** before/after slider, **messy room -> clean room**
   (two images, no blur), **auto-sweeps on scroll-in**, drag + keyboard.
7. **Why New Green** (5 principles, duotone icons).
8. **Cinematic band** ("Cleaning you can see. Care you can feel.", parallax).
9. **Process:** "From quote to spotless in four steps", **vibrant filled green
   icon tiles** (note / receipt / calendar / sparkle), interactive hover lift.
10. **Featured** (house cleaning image band + CTA).
11. **Testimonials:** horizontal **sliding marquee** of reviews with **avatars,
    organic names, star ratings, service tags**; **skeleton loads first**; cards
    lift on hover; a "Leave a review" form; reads **live from the CMS** with a
    static fallback.
12. **Service areas:** real **aerial neighbourhood photo** + area pills
    (Mississauga, Oakville, Brampton, Etobicoke, Milton, Burlington).
13. **FAQ** accordion, **Final CTA**, **Footer** (contact + hours + big wordmark).

**Motion**
- Premium reveals: rise + de-blur (`Reveal`); curtain/clip image reveal
  (`RevealImage`). All respect `prefers-reduced-motion`.

**Real business data** (in `src/lib/site.ts` `business`)
- Phone `+1 437 575 7046`, email `support@newgreenwindowsandhousecleaning.ca`,
  address `3329 McMaster Rd, Mississauga, ON L5L 5H8, Canada`,
  hours `Monday to Saturday, 8:00 AM to 6:00 PM`, primary city Mississauga.

**CMS backend (done + verified via curl)** — `cms/`
- Hono worker + Cloudflare D1. Tables: `reviews` (with `avatar`, `status`
  pending/approved), `pricing`, `content`.
- Public API: `GET /api/reviews|pricing|content`, `POST /api/reviews` (lands
  pending). Admin API (secret-gated `x-cms-secret`): full CRUD + approve/delete.
- Seeded with 6 organic demo reviews + real portrait avatars.
- Deploy keys/steps for the CLIENT's account are in `CMS_SETUP.md` (the one real
  key is a Cloudflare API Token). Do NOT deploy to Sami's own GitHub/Cloudflare.

## 8. Not built yet (next up)

1. **/admin dashboard** in the site (reviews queue / pricing editor / content
   editor). Backend endpoints already exist; the admin page must call the admin
   API through a Next server route that injects `CMS_ADMIN_SECRET` server-side,
   protected by Cloudflare Access.
2. **Pricing section** on the homepage (reads `GET /api/pricing`).
3. **Inner pages** (nav links exist but currently 404):
   `/quote` (5-step quote flow — `submitQuote` in `site.ts` is a mock seam),
   `/window-cleaning`, `/house-cleaning`, `/deep-cleaning`,
   `/move-in-move-out-cleaning`, `/about`, `/contact`, `/faq`, `/service-areas`,
   `/privacy`, `/terms`.
4. **Deploy** the CMS + site to the client's Cloudflare + GitHub (see CMS_SETUP.md).
5. Optional: **R2 bucket** so the owner can upload images.

## 9. Open notes / small fixes flagged

- **Cinematic band photo** (blue gloves / blue spray bottle) is the one cool-blue
  image fighting the green palette — swap for a warmer/greener cleaning shot.
- The before/after slider uses two different stock rooms (mess vs clean); a true
  same-room pair needs the client's own photos.
- Demo reviews are organic + real avatars for presentation; the owner replaces
  them from the admin later.
- Business `hours` is a sensible default; confirm with the client.
