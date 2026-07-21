# Irina Polyanskaya Photography — Site Design

## Overview

A bilingual (RU/EN) portfolio/business-card site for photographer Irina Polyanskaya (Gyumri, Armenia). Goal: showcase her editorial/cinematic photography style, communicate services and pricing, and drive bookings via Telegram/Instagram. Primary audience: Russian-speaking clients in Gyumri/Yerevan; secondary: English-speaking visitors.

Source assets live in `assets/`:
- `assets/source-photos/` — 63 photos, Irina's actual work (mixed genres)
- `assets/source-about/` — price list screenshot, services screenshot, 2 portraits of Irina herself, contacts file
- `assets/example/` — two reference sites (visual inspiration only, not to be copied verbatim)

## Architecture

Next.js 16 (App Router), statically generated, deployed to Netlify (interim presentation hosting — see "Hosting" below; permanent hosting + a purchased domain follow if the site is approved).

Routes:
- `/` — landing page (RU, default locale)
- `/gallery` — full filterable photo gallery (RU)
- `/en` — landing page (EN)
- `/en/gallery` — full filterable photo gallery (EN)

No CMS/backend. Content lives in typed data files (`content/ru.ts`, `content/en.ts`, `data/photos.ts`). Language switcher in the header swaps between `/…` and `/en/…` for the equivalent page.

## Landing page sections (in order)

1. **Hero** — full-bleed portrait photo with camera-viewfinder HUD frame (corner brackets, small mono readout). Kicker "ФОТОГРАФ · ГЮМРИ", name "Ирина Полянская" (large serif), one-line subhead, primary CTA "Записаться на съёмку" (→ Telegram), secondary link "Смотреть портфолио" (→ `/gallery`).
2. **About** — short bio (approved copy below) alongside one of the two Irina portrait photos from `source-about/` (`SnapInsta.to_619248384_...jpg` or `SnapInsta.to_620490125_...jpg`), framed with the same HUD motif as the hero.
3. **Portfolio teaser** — curated grid of 6–8 standout photos spanning multiple categories, "Смотреть всё портфолио" link to `/gallery`.
4. **Services** — 5 cards (see Services content below).
5. **Pricing** — 2 tiers (STANDARD / EXPRESS), copied from Irina's real price list.
6. **Contacts / CTA footer** — Telegram + Instagram links (primary), location "Гюмри, Армения", copyright.

## Gallery page (`/gallery`)

**Full photo audit completed during planning** (all 63 files reviewed via generated contact sheets). Actual visual distribution:
- Фэшн/Ночная съёмка — 20 photos (male editorial series with fur/jewelry/pomegranate props; female series in traditional Armenian costume — both dramatic, styled, low-key lighting)
- Love story — 28 photos (library couple session; rose-greenhouse couple session; vintage red car in a foggy field)
- Портрет — 14 photos (male portraits against Gyumri's tuff-stone architecture) + 1 solo detail shot (reading, warm light)
- Коммерческая — 1 photo (a jewelry/product close-up) — too few to sustain a filter
- Семейная — 0 photos — no family/children photography exists in the current source set

**Decision:** the gallery filter uses only the 3 categories with real, substantial photo coverage — **Все / Портрет / Love story / Фэшн/Ночная съёмка**. "Семейная" and "Коммерческая" are dropped from the gallery filter (not enough source photos to populate them credibly) but remain listed in the landing page's Services section as bookable offerings — a service can be offered without the portfolio having a published example yet.

Masonry grid of all 63 photos, filter pills as above. Filtering re-flows the grid with a FLIP animation. Clicking a photo opens a lightbox (keyboard arrows + swipe navigation, esc to close).

**Note — services vs. gallery categories are intentionally different lists.** The Services section on the landing page describes what a client can book (from Irina's real service menu, 5 items). The gallery filter groups photos by visual style so the portfolio reads coherently.

**Photo data is finalized** (no further audit needed) — the complete filename → category/alt-text/dimensions mapping is provided directly in the implementation plan's `data/photos.ts` task. Hero image and portfolio-teaser selections are also finalized there.

Photos are copied from `assets/source-photos/` into the Next.js project (`public/photos/<category>/<slug>.jpg`), served via `next/image` for lazy loading, responsive sizing, and blur-up placeholders. Original files in `assets/` remain the untouched source of truth.

## Visual design system

**Palette** (light editorial, not dark/moody — the photos themselves carry the drama):
- Background (paper): `#F6F1E9`
- Text (ink): `#1B1714`
- Accent (wine): `#7A2331`
- Accent hairline (gold): `#B08D4F`

**Typography** (all three confirmed to support Cyrillic):
- Display serif — **Cormorant** — headlines, name treatment
- UI sans — **Manrope** — body copy, navigation, buttons
- Mono — **JetBrains Mono** — HUD/EXIF-style labels (aperture, ISO, category pills)

**Camera-viewfinder motif** — the throughline for "wow" without generic AI-template tells (no indigo/violet gradients, no glassmorphism, no glowing status dots): thin corner-bracket frames around key photos, a focus-square that tracks the cursor, small mono readouts (e.g. "35mm · f/1.8 · ISO 200") as decorative-but-thematic labels near the hero and category pills.

## Animation & interaction system

- Lenis for smooth inertia scrolling, synced with GSAP ScrollTrigger
- Mask-reveal wipes on photos as they enter the viewport; headlines split into lines and animate up
- Custom cursor: ring that morphs into an autofocus bracket over photos/links
- Gallery: GSAP Flip plugin for category-filter re-layout; lightbox with keyboard/swipe nav
- Magnetic hover effect on primary CTA buttons
- Very low-opacity film-grain texture overlay (subtle, not a heavy AI-style glow/gradient effect)
- `prefers-reduced-motion: reduce` disables parallax, custom cursor, and magnetic effects; content remains fully usable with simple fades

## Tech stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS + GSAP (ScrollTrigger, Flip, SplitText) + Lenis, statically generated and deployed to Netlify. (Framer Motion/Motion was dropped during implementation planning — GSAP alone covers every animation the spec calls for, so pulling in a second animation library would have been an unused dependency.)

## Content (approved drafts — first-launch copy, editable later)

### About (RU, approved — "Вариант A")
> Ирина Полянская, фотограф, Гюмри. Пять лет работы с портретом, love story и коммерческой съёмкой. Снимаю там, где встречаются тёплый свет и настоящие эмоции — диско-шар в тёмной комнате, роза в теплице, тень старого туфового дома.

### About (EN)
> Irina Polyanskaya, photographer, based in Gyumri. Five years shooting portraits, love stories, and commercial work. I look for the place where warm light meets real emotion — a disco ball in a dark room, a rose in a greenhouse, the shadow of an old tuff-stone house.

### Hero copy
- RU — kicker: "ФОТОГРАФ · ГЮМРИ"; subhead: "Портретная, love story и коммерческая фотография. Снимаю в Гюмри и на выезде."; CTA: "Записаться на съёмку" / "Смотреть работы"
- EN — kicker: "PHOTOGRAPHER · GYUMRI"; subhead: "Portrait, love story, and commercial photography. Based in Gyumri, available on location."; CTA: "Book a session" / "View the work"

### Services (RU / EN)
1. Портретная съёмка / Portrait — "Индивидуальный и семейный портрет с акцентом на естественность и характер." / "Individual and family portraits focused on character, not posing."
2. Love story — "Съёмка пары — от предложения до годовщины, без постановочной неловкости." / "Couple sessions — proposals to anniversaries, without stiff staging."
3. Коммерческая съёмка / Commercial — "Товар, бренд, команда — фотографии для сайта, соцсетей и рекламы." / "Product, brand, and team photography for websites, social media, and ads."
4. Съёмка мероприятий / Events — "Корпоративы, вечеринки, публичные события — репортаж без постановки." / "Corporate events, parties, and public gatherings — documentary style, no staging."
5. Семейная съёмка / Family — "Портрет семьи в естественной обстановке, дома или на улице." / "Family portraits in a natural setting, at home or outdoors."

### Pricing (RU / EN, from Irina's real price list — currency kept as listed, ₽)
- **STANDARD — 6 000 ₽** — 1–1.5 часа съёмки · 50–70 фото в обработке (5–10 в ретуши) · помощь с образом/локацией/реквизитом · готовность 7–10 дней. / **STANDARD — 6,000 ₽** — 1–1.5 hour session · 50–70 edited photos (5–10 retouched) · help with styling/location/props · ready in 7–10 days.
- **EXPRESS — 3 500 ₽** — до 30 минут · 20–25 фото в обработке (до 5 в ретуши) · та же помощь и сроки. / **EXPRESS — 3,500 ₽** — up to 30 minutes · 20–25 edited photos (up to 5 retouched) · same styling help, same turnaround.
- Footnote (both languages): дополнительное фото в ретуши — 150 ₽; студия и визажист оплачиваются отдельно. / additional retouched photo — 150 ₽; studio and makeup artist billed separately.

### Contacts
Telegram: `t.me/polka977` · Instagram: `instagram.com/polyanskaya_photo7` · Гюмри, Армения / Gyumri, Armenia. (WhatsApp and email exist in `assets/source-about/contacts` but are not surfaced as primary CTAs per decision — Telegram and Instagram are the two channels Irina actually uses.)

## Out of scope (non-goals)

- No CMS or admin panel — content changes are code edits
- No blog, e-commerce, or payment processing
- No client proofing/delivery galleries
- No custom domain purchase/setup (site ships on the default Netlify subdomain; a custom domain can be attached later if the site is approved)
- No analytics/tracking beyond what the hosting platform provides by default

## Open items resolved during brainstorming

- Structure: landing + separate gallery page (not full multi-page, not single endless scroll)
- Visual direction: light editorial minimalism (not the dark/moody Goxyvi reference)
- Language: RU (default) + EN
- Location correction: Gyumri, not Yerevan
- Booking CTA: direct links to Telegram/Instagram, no custom form/backend
- Logo: typographic wordmark, no existing logo file
- Hosting: Netlify (revised from the original Vercel choice after a real Vercel deployment attempt hit problems — Netlify is a host the team has used successfully before; interim for presenting to Irina, permanent hosting + domain to follow if she approves)
