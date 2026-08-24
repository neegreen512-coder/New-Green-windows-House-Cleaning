# New Green — Design System

A single, coherent brand system. Everything visual is driven by tokens defined
in [`src/app/globals.css`](src/app/globals.css) (the `@theme` block). Change a
token there and it updates everywhere.

## Brand in one line
Premium, calm, trustworthy Canadian home care. **Green is the anchor, not the
whole story** — warm neutrals and a single brass accent keep it from looking
like a stereotypical "green cleaning" template.

## Colour
| Role | Token | Value |
| --- | --- | --- |
| Background (dominant) | `--color-bg` | `#f6f5f0` warm stone |
| Surface / cards | `--color-surface` | `#ffffff` |
| Quiet panels | `--color-surface-muted` | `#eef1ea` |
| Primary text | `--color-ink` | `#14201b` |
| Secondary text | `--color-muted` | `#57655e` |
| Hairline | `--color-line` | `#e4e6dd` |
| **Brand primary** | `--color-brand-800` | `#124a37` deep forest |
| Brand secondary | `--color-brand-500` | `#2e7d5b` fresh green |
| Brand soft | `--color-brand-300` | `#83bd9b` |
| Darkest surface | `--color-brand-950` | `#0b2a22` |
| **Accent (sparingly)** | `--color-accent` | `#c0902f` brass |
| Semantic | success/warning/error | see globals.css |

Green scale runs `brand-50 … brand-950`. Brass is reserved for small emphasis
(eyebrow ticks, star marks, one CTA style, the "lit pane" in the logo).

## Typography
- **Display / headings + logo:** Bricolage Grotesque (`--font-display`,
  `--font-bricolage`) for character.
- **Body:** Geist (`--font-sans`).
- **Mono accents:** Geist Mono (`--font-mono`) for eyebrows, indices, and numbers
  (tabular). This is the editorial-technical detail that reads premium.
- **Icons:** Phosphor (duotone) for feature/trust icons; lucide only for small
  utility glyphs (arrows, checks). The hero uses a pointer-driven 3D tilt.
- Fluid scale tokens: `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`,
  `--text-lead` (all `clamp()` so they scale with viewport).
- Headings use `-0.032em` tracking and `text-wrap: balance`.
- Labels: `.eyebrow` (mono + fine brass rule) and `.label-mono`.

## Radius & elevation
- Radius: `--radius-sm … --radius-3xl` (0.5 → 2.25rem). UI sits around 12–28px.
- Shadows: `--shadow-xs … --shadow-xl` — soft, green-tinted, for layered depth.

## Components (utility classes in globals.css)
`.container-x` (max-width + responsive padding) · `.section` (vertical rhythm) ·
`.eyebrow` (tracked label + brass tick) · `.h-display/.h1/.h2/.h3/.lead` ·
`.btn` + `.btn-primary/.btn-accent/.btn-secondary/.btn-ghost/.btn-on-dark/.btn-lg` ·
`.card` + `.card-hover` · `.pill` · `.sweep` (signature diagonal light motif) ·
`.glow-brand` · `.on-dark` (for green sections).

React building blocks live in `src/components/`:
Brand, SectionHeading, Reveal (motion), Icon, SiteHeader, SiteFooter,
MobileQuoteBar, BeforeAfter, Faq, and the homepage `sections/*`.

## Breakpoints
Tailwind defaults — `sm 640 · md 768 · lg 1024 · xl 1280`. `lg` is the
desktop/mobile switch for nav and most layouts. Verified: no horizontal overflow
at 375 or 1280.

## Motion
- Library: `framer-motion`, used only where it earns its place (hero entrance +
  parallax, scroll reveals, the before/after slider).
- Language: fade + 20px rise, 0.6s, ease `cubic-bezier(0.22,1,0.36,1)`, stagger
  by index. Reveals fire once on scroll-in.
- **Reduced motion:** `Reveal` and the hero honour `prefers-reduced-motion`; a
  global CSS fallback also kills animation. Content is fully visible without JS.

## Editing content
All business info, services, FAQs, service areas, testimonials, and imagery are
in [`src/lib/site.ts`](src/lib/site.ts). Replace every `[PLACEHOLDER]` before
launch. Imagery is curated Unsplash for now — swap the `images` map for real,
self-hosted photos (and the form seam `submitQuote` for a real endpoint).

## Run
```bash
pnpm dev     # http://localhost:3000
pnpm build   # production build
```
