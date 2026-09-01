# VRV Associates

Marketing site for VRV Associates — a project management and engineering
consultancy working in thermal and renewable power, power transmission and
energy storage.

Built from the "VRV Associates Website Redesign" Claude Design project.

## Stack

- Next.js 16 (App Router) with Turbopack
- React 19, TypeScript (strict)
- Tailwind CSS v4 — tokens defined in `app/globals.css` via `@theme`
- `next/font` for Instrument Sans and JetBrains Mono (self-hosted, no CDN)

No backend. Every route prerenders to static HTML.

## Running

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx          fonts, metadata, header/footer shell
  globals.css         design tokens + fluid type scale
  page.tsx            Home
  services/           Service areas, grouped by project stage
  experience/         Project record and capability areas
  directors/          Director profiles, career and education
  about/              Firm positioning, principles, client types
  contact/            Details and enquiry form
components/
  site-header.tsx     sticky nav, active underline, mobile disclosure menu
  site-footer.tsx
  motion.tsx          Reveal / Parallax / CountUp
  graphics.tsx        hero blueprint, sector icons, lifecycle diagram
  contact-form.tsx
  ui.tsx              PageHeader, Eyebrow, ArrowLink, CTA bands
lib/
  content.ts          all copy and data
```

## Design system

Tokens live in `app/globals.css`. Colours and type are Tailwind utilities
(`bg-paper`, `text-accent`, `t-hero`, `mono-eyebrow`, …) rather than raw hex,
so the palette can be retuned in one place.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F5F4F1` | page background |
| `ink` | `#0F1417` | text, dark bands |
| `accent` | `#B45309` | active nav, stage labels, hover |
| `body` | `#3C4348` | body copy |
| `muted` | `#6E747A` | secondary copy, mono labels |
| `rule` / `rule-soft` | `#D6D3CC` / `#E2DFD9` | section and list rules |

The source design also offers `#0F766E`, `#3D5A80` and `#6B6256` as alternate
accents — change `--color-accent` to swap.

## Motion

Dependency-free: Web Animations API, IntersectionObserver and one shared
scroll ticker (`lib/motion.ts`) that every scroll-driven effect subscribes to,
rather than each component attaching its own listener.

**Opening sequence** (`components/intro.tsx`). The lockup is structurally
identical to the header logo — same flex, same baseline alignment, same
18/9/10px proportions — just scaled up. That makes the final beat a true FLIP:
the mark flies into the header position, recolours in lockstep with the
lifting curtain, and hands off to the real logo. Plays once per session
(`sessionStorage`).

**Ambient schematic** (`components/schematic-loop.tsx`). The hero blueprint
does not draw once and stop — it re-inks itself every 5–7s in a different
order each time, cycling through seven sequence strategies (sweep across,
sweep down, radiate from centre, converge inward, assemble component by
component, scatter). The stagger window is wide enough that only part of the
drawing is mid-stroke at any moment, so it reads as a wave passing through
rather than the whole thing blinking. To add a sequence, push another entry to
`STRATEGIES` — a strategy only declares what it sorts by.

The loop suspends whenever the schematic is off-screen or the tab is hidden,
and never starts under reduced motion. An infinite background animation has no
business burning cycles nobody is watching.

**Set pieces**
- Sector icons draw themselves via `stroke-dashoffset`
- Headings reveal line by line from behind masks (`SplitLines`)
- The project lifecycle drafts itself once on entry (`Lifecycle`)
- Dark bands wipe open vertically (`Curtain`)
- Stat counters, sliding nav indicator, retracting header, scroll progress

### Rules this code follows

Three things are easy to get wrong here, and all three are load-bearing:

1. **Nothing is hidden without JavaScript.** An inline script in
   `app/layout.tsx` stamps `.js` on `<html>` before first paint; every
   "hidden until animated" rule is scoped to it. No JS means no hidden
   content and no overlay — which is also what crawlers see.
2. **`prefers-reduced-motion` skips the intro entirely** and renders every
   reveal in its final state. Scroll-linked pieces also drop out below 900px.
3. **Ancestors must not clip their own descendants' triggers.** `Curtain`'s
   closed state is `opacity`, not `clip-path`, because an ancestor clip is
   folded into a descendant's IntersectionObserver rect — a clipped wrapper
   silently prevents reveals inside it from ever firing.

`SplitLines` waits on `document.fonts.ready` before measuring and re-splits on
width change, since line grouping is only valid for the line breaks that
produced it. It also sets `aria-label` so the heading reads as one string.

### Page transitions

React's `<ViewTransition>` is canary-only and this project is on stable React
19.2, so navigation uses an enter animation on the incoming content
(`RouteTransition`) instead of `document.startViewTransition`, which is
fragile against the App Router's async rendering. The header never unmounts,
so the mark and nav indicator carry across untouched.

## Content

All copy is in `lib/content.ts`. That module is the seam to replace if a CMS
is introduced — pages import typed data and never inline strings.

Two items are placeholders carried over from the design, pending client input:

- Valli Subramaniam's biography ("Biography to be added.")
- Director photographs ("Photographs to be supplied.")

## Known gap

**The contact form is not wired to a mailbox.** Submitting shows a notice
saying so and directs the visitor to email `vrvassociatesinc@gmail.com`
instead. Connecting it needs a mail provider (Resend, Postmark) behind a
Server Action or route handler — see `components/contact-form.tsx`.

## Deploying

Static output, so any host works. For Vercel:

```bash
npx vercel        # preview
npx vercel --prod # production
```
