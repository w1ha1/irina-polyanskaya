# Irina Polyanskaya Photography Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the bilingual (RU/EN) portfolio/business-card site for photographer Irina Polyanskaya described in `docs/superpowers/specs/2026-07-21-irina-polyanskaya-portfolio-design.md`.

**Architecture:** Next.js 16 App Router site, statically rendered, deployed to Vercel. Locale is expressed via route prefix (`/` = RU, `/en` = EN). All copy lives in typed content files; all photo metadata lives in one typed data file. Shared React components render both locales from the same content-driven props — no page duplicates business logic.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + GSAP (ScrollTrigger, Flip, SplitText — all free) + Lenis (smooth scroll) + Vitest/React Testing Library (unit) + Playwright (E2E smoke tests). Deployed to Vercel.

## Global Constraints

- Palette: paper `#F6F1E9`, ink `#1B1714`, wine accent `#7A2331`, gold hairline `#B08D4F` — exact hex values, no substitutions.
- Fonts: Cormorant (display serif), Manrope (UI sans), JetBrains Mono (HUD/EXIF labels) — all three must load with Cyrillic subset.
- Routes: `/`, `/gallery`, `/en`, `/en/gallery` — no other top-level routes.
- Gallery filter categories: exactly `all`, `portrait`, `love-story`, `fashion-night` (no `family` or `commercial` — confirmed dropped, see spec amendment).
- Services section (landing page) lists all 5 real services regardless of gallery photo coverage: Портретная, Love story, Коммерческая, Мероприятия, Семейная.
- Booking CTA links only to Telegram (`https://t.me/polka977`) and Instagram (`https://instagram.com/polyanskaya_photo7`) — no contact form, no WhatsApp, no email surfaced.
- `prefers-reduced-motion: reduce` must disable parallax, custom cursor, magnetic buttons, and scroll-triggered reveals — content must remain fully readable without them.
- No CMS, no backend, no analytics beyond Vercel defaults, no custom domain setup.
- Original files in `assets/` are never modified or deleted — only copied into `public/`.

## File Structure

```
irina-polyanskaya/
├── app/
│   ├── globals.css                 # Tailwind v4 + @theme tokens
│   ├── fonts.ts                    # next/font/google definitions
│   └── [locale]/
│       ├── layout.tsx              # THE root layout (html/body, lang, providers, header/footer)
│       ├── page.tsx                # landing — RU at `/` (rewritten from /ru), EN at `/en`
│       └── gallery/
│           └── page.tsx            # gallery — RU at `/gallery` (rewritten from /ru/gallery), EN at `/en/gallery`
├── next.config.ts                  # rewrites `/` → `/ru`, `/gallery` → `/ru/gallery`
├── components/
│   ├── layout/SiteHeader.tsx
│   ├── layout/SiteFooter.tsx
│   ├── ui/HudFrame.tsx
│   ├── ui/MagneticButton.tsx
│   ├── ui/SplitHeading.tsx
│   ├── ui/RevealImage.tsx
│   ├── ui/CustomCursor.tsx
│   ├── ui/SmoothScrollProvider.tsx
│   ├── sections/Hero.tsx
│   ├── sections/About.tsx
│   ├── sections/Services.tsx
│   ├── sections/Pricing.tsx
│   ├── sections/PortfolioTeaser.tsx
│   ├── gallery/CategoryFilter.tsx
│   ├── gallery/GalleryGrid.tsx
│   ├── gallery/GallerySection.tsx
│   └── gallery/Lightbox.tsx
├── content/
│   ├── types.ts
│   ├── ru.ts
│   └── en.ts
├── data/
│   └── photos.ts
├── lib/
│   ├── cn.ts
│   ├── filterPhotos.ts
│   ├── lightboxNav.ts
│   ├── localePath.ts
│   └── useReducedMotion.ts
├── public/
│   └── photos/
│       ├── portrait/*.jpg (14)
│       ├── love-story/*.jpg (28)
│       ├── fashion-night/*.jpg (20)
│       └── about/about-irina.jpg
├── scripts/
│   └── copy-photos.mjs
├── e2e/
│   ├── landing.spec.ts
│   └── gallery.spec.ts
├── vitest.config.ts
├── vitest.setup.ts
└── playwright.config.ts
```

---

## Task 1: Scaffold the Next.js project and test tooling

**Files:**
- Create: entire Next.js scaffold via `create-next-app` (package.json, tsconfig.json, next.config.ts, app/layout.tsx, app/page.tsx, app/globals.css, postcss.config.mjs, eslint config)
- Create: `lib/cn.ts`, `lib/cn.test.ts`
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Create: `playwright.config.ts`, `e2e/.gitkeep`
- Modify: `.gitignore` (merge generated one with existing custom entries)

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` — used by every component that needs conditional Tailwind classes.

- [ ] **Step 1: Scaffold Next.js**

Run from `~/TestCode/irina-polyanskaya`:

```bash
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

If prompted interactively for anything the flags didn't cover (e.g. Turbopack), accept the default (press Enter).

Expected: command completes without error; `package.json`, `app/`, `next.config.ts` now exist; `next` and `tailwindcss` appear in `package.json`.

- [ ] **Step 2: Verify the scaffold builds**

Run: `npm run build`
Expected: build completes with `✓ Compiled successfully`, no errors.

- [ ] **Step 3: Restore custom `.gitignore` entries**

Open the generated `.gitignore`. Confirm it already ignores `node_modules`, `.next`, `.vercel`, `.env*.local`, `*.log`. If `.DS_Store` is missing, append it. (The generated file supersedes the placeholder one committed earlier — no separate merge step needed if all five patterns are present.)

- [ ] **Step 4: Install runtime dependencies**

Run: `npm install gsap lenis clsx`
Expected: all three added to `dependencies` in `package.json`.

- [ ] **Step 5: Install test dependencies**

Run: `npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test`
Expected: all packages added to `devDependencies`.

- [ ] **Step 6: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Add to `package.json` `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 7: Write the failing test for the `cn` helper**

Create `lib/cn.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class values with a space', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('supports conditional object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npm test -- lib/cn.test.ts`
Expected: FAIL — `lib/cn.ts` does not exist / `Cannot find module './cn'`.

- [ ] **Step 9: Implement `cn`**

Create `lib/cn.ts`:

```ts
import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm test -- lib/cn.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 11: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

Create empty placeholder `e2e/.gitkeep` (real specs are added in Task 13).

Run: `npx playwright install --with-deps chromium`
Expected: Chromium browser binary installs without error (skip `--with-deps` and just run `npx playwright install chromium` if the sandbox has no apt access for system deps).

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js project with Tailwind, Vitest, and Playwright"
```

---

## Task 2: Photo data file and asset copy script

**Files:**
- Create: `data/photos.ts`
- Create: `data/photos.test.ts`
- Create: `scripts/copy-photos.mjs`

**Interfaces:**
- Produces:
  - `type PhotoCategory = 'portrait' | 'love-story' | 'fashion-night'`
  - `interface Photo { slug: string; category: PhotoCategory; sourceFile: string; width: number; height: number; alt: { ru: string; en: string } }`
  - `export const photos: Photo[]` (62 entries)
  - `export const heroPhoto: Photo`
  - `export const teaserSlugs: string[]` (7 slugs, a subset of `photos`)
  - `export const aboutPhoto: { sourceFile: string; width: number; height: number; alt: { ru: string; en: string } }`
  - `export const commercialPhoto: { sourceFile: string; width: number; height: number; alt: { ru: string; en: string } }`
- Consumed by: Task 10 (Gallery), Task 8/9 (Hero/About), Task 11 (Services, via `commercialPhoto`).

This task hard-codes the full photo audit completed during planning (63 source files reviewed via generated contact sheets — see spec). No further curation is needed by the implementer.

- [ ] **Step 1: Write the failing data-integrity test**

Create `data/photos.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { photos, heroPhoto, teaserSlugs, aboutPhoto, commercialPhoto } from './photos';

describe('photo data', () => {
  it('has exactly 62 gallery photos', () => {
    expect(photos).toHaveLength(62);
  });

  it('has the expected count per category', () => {
    const counts = photos.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts['fashion-night']).toBe(20);
    expect(counts['love-story']).toBe(28);
    expect(counts.portrait).toBe(14);
  });

  it('has unique slugs', () => {
    const slugs = photos.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every photo a positive width, height, and bilingual alt text', () => {
    for (const p of photos) {
      expect(p.width).toBeGreaterThan(0);
      expect(p.height).toBeGreaterThan(0);
      expect(p.alt.ru.length).toBeGreaterThan(0);
      expect(p.alt.en.length).toBeGreaterThan(0);
    }
  });

  it('picks a hero photo that exists in the gallery set', () => {
    expect(photos.some((p) => p.slug === heroPhoto.slug)).toBe(true);
  });

  it('picks 7 teaser slugs that all exist in the gallery set', () => {
    expect(teaserSlugs).toHaveLength(7);
    const slugs = new Set(photos.map((p) => p.slug));
    for (const s of teaserSlugs) expect(slugs.has(s)).toBe(true);
  });

  it('defines aboutPhoto and commercialPhoto with bilingual alt text', () => {
    expect(aboutPhoto.alt.ru.length).toBeGreaterThan(0);
    expect(aboutPhoto.alt.en.length).toBeGreaterThan(0);
    expect(commercialPhoto.alt.ru.length).toBeGreaterThan(0);
    expect(commercialPhoto.alt.en.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- data/photos.test.ts`
Expected: FAIL — `data/photos.ts` does not exist.

- [ ] **Step 3: Create `data/photos.ts`**

Create `data/photos.ts` with this exact content:

```ts
export type PhotoCategory = 'portrait' | 'love-story' | 'fashion-night';

export interface Photo {
  slug: string;
  category: PhotoCategory;
  sourceFile: string;
  width: number;
  height: number;
  alt: { ru: string; en: string };
}

export const photos: Photo[] = [
  // --- fashion-night (20) ---
  { slug: 'fashion-01', category: 'fashion-night', sourceFile: 'SnapInsta.to_586678175_18002390468836533_6049530055749929788_n.jpg', width: 720, height: 960, alt: { ru: 'Мужской портрет с меховой накидкой и серебряным украшением, тёплый низкий свет', en: 'Male portrait with a fur wrap and silver jewelry under warm low light' } },
  { slug: 'fashion-02', category: 'fashion-night', sourceFile: 'SnapInsta.to_590702635_18002391767836533_8088495620075498281_n.jpg', width: 720, height: 960, alt: { ru: 'Крупный план серебряной цепочки-украшения на теле, тёплый свет', en: 'Close-up of a silver chain necklace on skin, warm lighting' } },
  { slug: 'fashion-03', category: 'fashion-night', sourceFile: 'SnapInsta.to_607062739_18002391797836533_727377943724154889_n.jpg', width: 720, height: 960, alt: { ru: 'Съёмочный процесс: стилист поправляет образ модели, чёрно-белое фото', en: "Behind the scenes: a stylist adjusting the model's look, black and white" } },
  { slug: 'fashion-04', category: 'fashion-night', sourceFile: 'SnapInsta.to_607274949_18002391758836533_8750813693826851152_n.jpg', width: 720, height: 960, alt: { ru: 'Портрет мужчины в меховой накидке с украшениями, коллаж из двух кадров', en: 'Portrait of a man in a fur wrap with jewelry, two-frame collage' } },
  { slug: 'fashion-05', category: 'fashion-night', sourceFile: 'SnapInsta.to_607329464_18002390495836533_2771151152964464905_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина с поднятыми руками, серебряное украшение, тёплый свет', en: 'Man with raised arms, silver jewelry, warm lighting' } },
  { slug: 'fashion-06', category: 'fashion-night', sourceFile: 'SnapInsta.to_607499680_18002391728836533_2049392340007366713_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина держит гранат рядом с меховой накидкой и украшениями', en: 'Man holding a pomegranate beside a fur wrap and jewelry' } },
  { slug: 'fashion-07', category: 'fashion-night', sourceFile: 'SnapInsta.to_607752533_18002391776836533_3952286857191519466_n.jpg', width: 720, height: 960, alt: { ru: 'Портрет крупным планом с украшением на шее', en: 'Close-up portrait with a neck ornament' } },
  { slug: 'fashion-08', category: 'fashion-night', sourceFile: 'SnapInsta.to_608009066_18002391737836533_397619562704292638_n.jpg', width: 720, height: 960, alt: { ru: 'Рука с кольцом держит металлический кувшин, тёплый свет', en: 'A ringed hand holding a metal jug, warm light' } },
  { slug: 'fashion-09', category: 'fashion-night', sourceFile: 'SnapInsta.to_608015110_18002390477836533_2999081988753952268_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белый портрет с поднятыми руками, драматичный свет', en: 'Black-and-white portrait with raised arms, dramatic light' } },
  { slug: 'fashion-10', category: 'fashion-night', sourceFile: 'SnapInsta.to_608668936_18002391788836533_7867917680896146780_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белый крупный портрет с цепочками и украшениями', en: 'Black-and-white close portrait with chains and jewelry' } },
  { slug: 'fashion-11', category: 'fashion-night', sourceFile: 'SnapInsta.to_608764795_18002390486836533_5315474832442594631_n.jpg', width: 720, height: 960, alt: { ru: 'Портрет в цветных бликах света, тёплые и золотые тона', en: 'Portrait in colorful light flares, warm and golden tones' } },
  { slug: 'fashion-12', category: 'fashion-night', sourceFile: 'SnapInsta.to_608965876_18002391746836533_2610780283440844424_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина в меховой накидке среди тканей и украшений', en: 'Man in a fur wrap among fabrics and ornaments' } },
  { slug: 'fashion-13', category: 'fashion-night', sourceFile: 'SnapInsta.to_621159664_18005274554836533_4185376247746852724_n.jpg', width: 720, height: 960, alt: { ru: 'Рука с кольцом держит бронзовый кувшин, деталь образа', en: 'A ringed hand holding a bronze jug, styling detail' } },
  { slug: 'fashion-14', category: 'fashion-night', sourceFile: 'SnapInsta.to_621163075_18005274995836533_3077583046511943225_n.jpg', width: 720, height: 960, alt: { ru: 'Женщина в традиционном армянском головном уборе с кувшином', en: 'Woman in a traditional Armenian headdress holding a jug' } },
  { slug: 'fashion-15', category: 'fashion-night', sourceFile: 'SnapInsta.to_621170373_18005273390836533_4763154181290457138_n.jpg', width: 720, height: 960, alt: { ru: 'Женщина в традиционном костюме держит гранат у лица', en: 'Woman in traditional costume holding a pomegranate to her face' } },
  { slug: 'fashion-16', category: 'fashion-night', sourceFile: 'SnapInsta.to_621231435_18005274563836533_5247768775187446014_n.jpg', width: 720, height: 960, alt: { ru: 'Женщина в кружевной фате у резного зеркала', en: 'Woman in a lace veil by a carved mirror' } },
  { slug: 'fashion-17', category: 'fashion-night', sourceFile: 'SnapInsta.to_621386491_18005273372836533_4943831174097132010_n.jpg', width: 720, height: 915, alt: { ru: 'Портрет в традиционном головном уборе с гранатом', en: 'Portrait in a traditional headdress with a pomegranate' } },
  { slug: 'fashion-18', category: 'fashion-night', sourceFile: 'SnapInsta.to_621439328_18005275013836533_5925943867936766653_n.jpg', width: 720, height: 960, alt: { ru: 'Женщина в кружевной фате у окна', en: 'Woman in a lace veil by a window' } },
  { slug: 'fashion-19', category: 'fashion-night', sourceFile: 'SnapInsta.to_622384590_18005273381836533_7579165405186333821_n.jpg', width: 720, height: 960, alt: { ru: 'Женщина в традиционном костюме на фоне ковра, с гранатом', en: 'Woman in traditional costume against a carpet backdrop, with a pomegranate' } },
  { slug: 'fashion-20', category: 'fashion-night', sourceFile: 'SnapInsta.to_622590539_18005275004836533_643580100597053556_n.jpg', width: 720, height: 960, alt: { ru: 'Крупный портрет женщины, пробующей гранат, красная помада', en: 'Close portrait of a woman tasting pomegranate, red lipstick' } },

  // --- love-story (28) ---
  { slug: 'love-01', category: 'love-story', sourceFile: 'SnapInsta.to_656900870_18013061516836533_3224792205916951746_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белый коллаж: пара среди книжных стеллажей библиотеки', en: 'Black-and-white collage: a couple among library bookshelves' } },
  { slug: 'love-02', category: 'love-story', sourceFile: 'SnapInsta.to_657167545_18013061501836533_1051359062774219522_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белое фото пары в проходе между книжными полками', en: 'Black-and-white photo of a couple in a library aisle' } },
  { slug: 'love-03', category: 'love-story', sourceFile: 'SnapInsta.to_657742216_18013061510836533_6707210603101989341_n.jpg', width: 873, height: 1164, alt: { ru: 'Чёрно-белые крупные объятия пары в библиотеке', en: 'Black-and-white close embrace of a couple in a library' } },
  { slug: 'love-04', category: 'love-story', sourceFile: 'SnapInsta.to_657947202_18013061543836533_2187226408794195441_n.jpg', width: 888, height: 1184, alt: { ru: 'Пара смеётся среди книжных полок, цветное фото', en: 'A couple laughing among bookshelves, color photo' } },
  { slug: 'love-05', category: 'love-story', sourceFile: 'SnapInsta.to_658068849_18013061534836533_8175537410738637423_n.jpg', width: 850, height: 1133, alt: { ru: 'Пара смеётся в библиотеке, тёплый свет', en: 'A couple laughing in a library, warm light' } },
  { slug: 'love-06', category: 'love-story', sourceFile: 'SnapInsta.to_658571333_18013061513836533_777481571487651401_n.jpg', width: 720, height: 960, alt: { ru: 'Коллаж: пара в теплице в движении и объятия в библиотеке', en: 'Collage: a couple in motion in a greenhouse and an embrace in a library' } },
  { slug: 'love-07', category: 'love-story', sourceFile: 'SnapInsta.to_658663462_18013061525836533_4579139848462131194_n.jpg', width: 850, height: 1133, alt: { ru: 'Чёрно-белое крепкое объятие пары', en: 'Black-and-white close embrace of a couple' } },
  { slug: 'love-08', category: 'love-story', sourceFile: 'SnapInsta.to_658781924_18013061552836533_3626260022621475761_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белая пара в проходе библиотеки среди книг', en: 'Black-and-white couple in a library aisle among books' } },
  { slug: 'love-09', category: 'love-story', sourceFile: 'SnapInsta.to_659768168_18013061486836533_23612251469581772_n.jpg', width: 720, height: 960, alt: { ru: 'Пара в библиотеке у зелёной лестницы, цветное фото', en: 'A couple in a library by a green ladder, color photo' } },
  { slug: 'love-10', category: 'love-story', sourceFile: 'SnapInsta.to_671144576_18017189378836533_5126313645627150691_n.jpg', width: 720, height: 900, alt: { ru: 'Пара обнимается в оранжерее среди белых роз, смазанный кадр движения', en: 'A couple embracing in a rose greenhouse, motion-blurred frame' } },
  { slug: 'love-11', category: 'love-story', sourceFile: 'SnapInsta.to_671744417_18016284257836533_2406486800303437838_n.jpg', width: 720, height: 900, alt: { ru: 'Пара на капоте винтажного красного автомобиля в туманном поле', en: 'A couple on the hood of a vintage red car in a foggy field' } },
  { slug: 'love-12', category: 'love-story', sourceFile: 'SnapInsta.to_681287093_18016284179836533_4295596013951556829_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара и винтажный автомобиль в туманном поле', en: 'Collage: a couple and a vintage car in a foggy field' } },
  { slug: 'love-13', category: 'love-story', sourceFile: 'SnapInsta.to_681472755_18016284215836533_8821286431723770613_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара в машине под дождём, стекло в каплях', en: 'Collage: a couple in a car in the rain, raindrops on the glass' } },
  { slug: 'love-14', category: 'love-story', sourceFile: 'SnapInsta.to_682056497_18016284161836533_5147284798263578647_n.jpg', width: 720, height: 900, alt: { ru: 'Пара идёт по полю рядом с красным автомобилем', en: 'A couple walking through a field beside a red car' } },
  { slug: 'love-15', category: 'love-story', sourceFile: 'SnapInsta.to_682212785_18016284263836533_450005132832978116_n.jpg', width: 720, height: 897, alt: { ru: 'Красный винтажный автомобиль в туманном поле, мужчина вдалеке', en: 'A red vintage car in a foggy field, a man in the distance' } },
  { slug: 'love-16', category: 'love-story', sourceFile: 'SnapInsta.to_683675586_18016284242836533_6282242942333562559_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: девушка одна и пара на капоте автомобиля', en: 'Collage: a woman alone and a couple on the car hood' } },
  { slug: 'love-17', category: 'love-story', sourceFile: 'SnapInsta.to_683689455_18016284230836533_4304468973816964802_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара держится за руки в поле, ветер треплет волосы', en: "Collage: a couple holding hands in a field, wind in their hair" } },
  { slug: 'love-18', category: 'love-story', sourceFile: 'SnapInsta.to_683762691_18016284233836533_5115990997648937136_n.jpg', width: 720, height: 897, alt: { ru: 'Пара касается лбами в поле, пасмурное небо', en: 'A couple touching foreheads in a field, overcast sky' } },
  { slug: 'love-19', category: 'love-story', sourceFile: 'SnapInsta.to_683766249_18017189375836533_6540760078989453481_n.jpg', width: 720, height: 900, alt: { ru: 'Сцепленные руки пары через окно машины под дождём', en: "A couple's clasped hands through a rain-streaked car window" } },
  { slug: 'love-20', category: 'love-story', sourceFile: 'SnapInsta.to_684111780_18016284194836533_6198651596713270895_n.jpg', width: 720, height: 900, alt: { ru: 'Чёрно-белое фото пары в теплице в полный рост', en: 'Black-and-white full-length photo of a couple in a greenhouse' } },
  { slug: 'love-21', category: 'love-story', sourceFile: 'SnapInsta.to_684843279_18016284212836533_4094334937703427035_n.jpg', width: 720, height: 900, alt: { ru: 'Пара обнимается среди зелени и белых роз в теплице', en: 'A couple embracing among greenery and white roses in a greenhouse' } },
  { slug: 'love-22', category: 'love-story', sourceFile: 'SnapInsta.to_684855309_18017189345836533_2113241894251156481_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: отдых среди роз, деталь книги, поцелуй в листве', en: 'Collage: resting among roses, a book detail, a kiss in the leaves' } },
  { slug: 'love-23', category: 'love-story', sourceFile: 'SnapInsta.to_684946431_18017189402836533_4573255447170964092_n.jpg', width: 720, height: 900, alt: { ru: 'Чёрно-белое фото пары в теплице', en: 'Black-and-white photo of a couple in a greenhouse' } },
  { slug: 'love-24', category: 'love-story', sourceFile: 'SnapInsta.to_685386164_18017189405836533_175695731233902322_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: девушка одна среди роз и пара в меховой накидке в теплице', en: 'Collage: a woman alone among roses and a couple in a fur wrap in the greenhouse' } },
  { slug: 'love-25', category: 'love-story', sourceFile: 'SnapInsta.to_685956641_18017189429836533_2687868010405871520_n.jpg', width: 720, height: 900, alt: { ru: 'Девушка в красном платье и меховой накидке среди роз', en: 'A woman in a red dress and fur wrap among roses' } },
  { slug: 'love-26', category: 'love-story', sourceFile: 'SnapInsta.to_687050582_18017189348836533_46706258812802475_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: девушка одна среди роз и вид вдоль ряда теплицы', en: 'Collage: a woman alone among roses and a view down the greenhouse row' } },
  { slug: 'love-27', category: 'love-story', sourceFile: 'SnapInsta.to_687284927_18017189387836533_3293444089339232783_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара с розой и гранатом среди зелени, романтичный кадр', en: 'Collage: a couple with a rose and pomegranate among greenery, a romantic frame' } },
  { slug: 'love-28', category: 'love-story', sourceFile: 'SnapInsta.to_688888300_18017189327836533_3332075026162490702_n.jpg', width: 720, height: 900, alt: { ru: 'Чёрно-белый нежный кадр двух силуэтов среди тёмной зелени', en: 'Black-and-white tender frame of two silhouettes among dark greenery' } },

  // --- portrait (14) ---
  { slug: 'portrait-01', category: 'portrait', sourceFile: 'SnapInsta.to_657360749_18013061471836533_807684231671720313_n.jpg', width: 850, height: 1133, alt: { ru: 'Крупный план рук, листающих старую книгу, тёплый свет', en: 'Close-up of hands turning pages of an old book, warm light' } },
  { slug: 'portrait-02', category: 'portrait', sourceFile: 'SnapInsta.to_681180916_18016284176836533_1248926197350596796_n.jpg', width: 720, height: 900, alt: { ru: 'Мужчина в дверном проёме на ярком свету, коллаж с деталью', en: 'Man in a doorway in bright light, collage with a detail shot' } },
  { slug: 'portrait-03', category: 'portrait', sourceFile: 'SnapInsta.to_688833219_18017189330836533_4736488998158937883_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: портрет мужчины у стены, деталь часов, на ступенях', en: 'Collage: portrait of a man by a wall, a watch detail, on the steps' } },
  { slug: 'portrait-04', category: 'portrait', sourceFile: 'SnapInsta.to_688886403_18017189327836533_3332075026162490702_n.jpg', width: 720, height: 900, alt: { ru: 'Мужчина стоит у старинной каменной стены', en: 'A man standing by an old stone wall' } },
  { slug: 'portrait-05', category: 'portrait', sourceFile: 'SnapInsta.to_689064694_18017189360836533_4093826099256987331_n.jpg', width: 720, height: 900, alt: { ru: 'Историческое туфовое здание в Гюмри', en: 'A historic tuff-stone building in Gyumri' } },
  { slug: 'portrait-06', category: 'portrait', sourceFile: 'SnapInsta.to_749756064_18027194900836533_4093777991618701705_n.jpg', width: 720, height: 960, alt: { ru: 'Коллаж: мужчина у стены и чёрно-белая сцена у железной дороги', en: 'Collage: a man by a wall and a black-and-white railway scene' } },
  { slug: 'portrait-07', category: 'portrait', sourceFile: 'SnapInsta.to_750086049_18027194873836533_6795609942903314071_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белый кадр резного дверного портала', en: 'Black-and-white shot of a carved doorway portal' } },
  { slug: 'portrait-08', category: 'portrait', sourceFile: 'SnapInsta.to_750255781_18027195026836533_7800854702609093709_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина на лестнице заброшенной постройки среди зелени', en: 'A man on the stairs of an abandoned structure among greenery' } },
  { slug: 'portrait-09', category: 'portrait', sourceFile: 'SnapInsta.to_750828779_18027194870836533_6194109473403876595_n.jpg', width: 720, height: 960, alt: { ru: 'Фасад церкви в Гюмри с фигурами вдалеке', en: 'A church façade in Gyumri with figures in the distance' } },
  { slug: 'portrait-10', category: 'portrait', sourceFile: 'SnapInsta.to_752451353_18027194897836533_5579632822793879720_n.jpg', width: 720, height: 960, alt: { ru: 'Коллаж: портрет мужчины у резной арки в тёплом свете', en: 'Collage: portrait of a man by a carved archway in warm light' } },
  { slug: 'portrait-11', category: 'portrait', sourceFile: 'SnapInsta.to_753093095_18027194978836533_8226840323895672037_n.jpg', width: 720, height: 960, alt: { ru: 'Чёрно-белый кадр арочного дверного портала', en: 'Black-and-white shot of an arched doorway portal' } },
  { slug: 'portrait-12', category: 'portrait', sourceFile: 'SnapInsta.to_753224968_18027194882836533_6796361134869352882_n.jpg', width: 720, height: 960, alt: { ru: 'Портрет мужчины у резной арки, тёплый свет', en: 'Portrait of a man by a carved archway, warm light' } },
  { slug: 'portrait-13', category: 'portrait', sourceFile: 'SnapInsta.to_753255037_18027194960836533_2427192636046982643_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина у резной деревянной двери, в полный рост', en: 'A man by a carved wooden door, full length' } },
  { slug: 'portrait-14', category: 'portrait', sourceFile: 'SnapInsta.to_753418340_18027194996836533_5475697382716152589_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина, облокотившийся на текстурную каменную стену', en: 'A man leaning against a textured stone wall' } },
];

export const heroPhoto: Photo = photos.find((p) => p.slug === 'fashion-20')!;

export const teaserSlugs: string[] = [
  'fashion-16',
  'fashion-10',
  'love-19',
  'love-21',
  'love-11',
  'portrait-04',
  'portrait-13',
];

export const aboutPhoto = {
  sourceFile: 'SnapInsta.to_620490125_18004653029836533_2485777311228399575_n.jpg',
  width: 720,
  height: 960,
  alt: {
    ru: 'Ирина Полянская в тёплом ночном свете, портрет',
    en: 'Irina Polyanskaya in warm night light, portrait',
  },
};

export const commercialPhoto = {
  sourceFile: 'SnapInsta.to_683894650_18016284197836533_7423984466739593885_n.jpg',
  width: 720,
  height: 900,
  alt: {
    ru: 'Детальный кадр украшения на коже, пример предметной съёмки',
    en: 'Detail shot of jewelry on skin, an example of product photography',
  },
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- data/photos.test.ts`
Expected: PASS — 7 tests passed.

- [ ] **Step 5: Write the asset copy script**

Create `scripts/copy-photos.mjs`:

```js
import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const { photos, aboutPhoto, commercialPhoto } = await import(
  path.join(root, 'data', 'photos.ts').startsWith('/')
    ? 'file://' + path.join(root, 'data', 'photos.js')
    : path.join(root, 'data', 'photos.js')
).catch(async () => {
  // photos.ts is TypeScript; run this script with `npx tsx scripts/copy-photos.mjs` instead of plain node.
  throw new Error('Run this script with `npx tsx scripts/copy-photos.mjs` (needs TS support).');
});

const sourceDir = path.join(root, 'assets', 'source-photos');
const sourceAboutDir = path.join(root, 'assets', 'source-about');
const publicPhotosDir = path.join(root, 'public', 'photos');

async function copyOne(sourcePath, destPath) {
  await mkdir(path.dirname(destPath), { recursive: true });
  await copyFile(sourcePath, destPath);
  console.log(`copied ${path.relative(root, destPath)}`);
}

for (const photo of photos) {
  const src = path.join(sourceDir, photo.sourceFile);
  const dest = path.join(publicPhotosDir, photo.category, `${photo.slug}.jpg`);
  if (!existsSync(src)) throw new Error(`missing source file: ${src}`);
  await copyOne(src, dest);
}

await copyOne(
  path.join(sourceAboutDir, aboutPhoto.sourceFile),
  path.join(publicPhotosDir, 'about', 'about-irina.jpg')
);

await copyOne(
  path.join(sourceDir, commercialPhoto.sourceFile),
  path.join(publicPhotosDir, 'commercial', 'commercial-01.jpg')
);

console.log(`Done: ${photos.length} gallery photos + about + commercial copied.`);
```

Since `data/photos.ts` is TypeScript, install a lightweight TS runner: `npm install -D tsx`, then simplify the script's import to a plain relative import (works once run through `tsx`):

Replace the dynamic-import block in `scripts/copy-photos.mjs` with a normal static import at the top of the file:

```js
import { photos, aboutPhoto, commercialPhoto } from '../data/photos.ts';
```

(Remove the `await import(...)` block above — the static import is simpler and works under `tsx`.)

Add to `package.json` `scripts`: `"copy-photos": "tsx scripts/copy-photos.mjs"`.

- [ ] **Step 6: Run the copy script**

Run: `npm run copy-photos`
Expected: 64 lines of `copied public/photos/...`, ending with `Done: 62 gallery photos + about + commercial copied.` Verify with `find public/photos -type f | wc -l` → `64`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add finalized photo dataset and asset copy script"
```

---

## Task 3: Bilingual content data

**Files:**
- Create: `content/types.ts`
- Create: `content/ru.ts`
- Create: `content/en.ts`
- Create: `content/content.test.ts`

**Interfaces:**
- Produces: `type Locale = 'ru' | 'en'`, `interface SiteContent { ... }` (full shape below), `export const content: Record<Locale, SiteContent>` — one object, keyed by locale, combining `ru.ts` and `en.ts`.
- Consumed by: every section component in Tasks 8–12, `SiteHeader`/`SiteFooter` in Task 7.

- [ ] **Step 1: Write the failing locale-parity test**

Create `content/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { content } from './index';

function keys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  if (Array.isArray(obj)) {
    return obj.length > 0 ? keys(obj[0], `${prefix}[]`) : [`${prefix}[]`];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k)
  );
}

describe('bilingual content parity', () => {
  it('ru and en expose the same key structure', () => {
    expect(keys(content.ru).sort()).toEqual(keys(content.en).sort());
  });

  it('services has exactly 5 items in both locales', () => {
    expect(content.ru.services.items).toHaveLength(5);
    expect(content.en.services.items).toHaveLength(5);
  });

  it('pricing has exactly 2 tiers in both locales', () => {
    expect(content.ru.pricing.tiers).toHaveLength(2);
    expect(content.en.pricing.tiers).toHaveLength(2);
  });

  it('gallery filters are all and the 3 real categories', () => {
    const ids = content.ru.gallery.filters.map((f) => f.id);
    expect(ids).toEqual(['all', 'portrait', 'love-story', 'fashion-night']);
  });

  it('no string field is empty in either locale', () => {
    function checkStrings(obj: unknown, path = ''): void {
      if (typeof obj === 'string') {
        expect(obj.trim().length, `${path} should not be empty`).toBeGreaterThan(0);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => checkStrings(item, `${path}[${i}]`));
        return;
      }
      if (obj !== null && typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) checkStrings(v, path ? `${path}.${k}` : k);
      }
    }
    checkStrings(content.ru, 'ru');
    checkStrings(content.en, 'en');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- content/content.test.ts`
Expected: FAIL — `./index` does not exist.

- [ ] **Step 3: Define the content shape**

Create `content/types.ts`:

```ts
export type Locale = 'ru' | 'en';

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    about: string;
    portfolio: string;
    services: string;
    pricing: string;
    contacts: string;
    bookCta: string;
  };
  hero: {
    kicker: string;
    name: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    heading: string;
    body: string;
  };
  portfolioTeaser: {
    heading: string;
    viewAll: string;
  };
  services: {
    heading: string;
    items: { title: string; description: string }[];
  };
  pricing: {
    heading: string;
    tiers: { name: string; price: string; features: string[] }[];
    footnote: string;
  };
  contacts: {
    heading: string;
    location: string;
    telegramLabel: string;
    instagramLabel: string;
    bookingMessage: string;
  };
  gallery: {
    heading: string;
    filters: { id: 'all' | 'portrait' | 'love-story' | 'fashion-night'; label: string }[];
  };
  footer: {
    rights: string;
  };
}
```

- [ ] **Step 4: Write the RU content**

Create `content/ru.ts`:

```ts
import type { SiteContent } from './types';

export const ru: SiteContent = {
  meta: {
    title: 'Ирина Полянская — фотограф в Гюмри',
    description:
      'Портретная, love story и коммерческая фотография в Гюмри. Смотрите портфолио и записывайтесь на съёмку.',
  },
  nav: {
    about: 'Обо мне',
    portfolio: 'Портфолио',
    services: 'Услуги',
    pricing: 'Прайс',
    contacts: 'Контакты',
    bookCta: 'Записаться',
  },
  hero: {
    kicker: 'ФОТОГРАФ · ГЮМРИ',
    name: 'Ирина Полянская',
    subhead: 'Портретная, love story и коммерческая фотография. Снимаю в Гюмри и на выезде.',
    ctaPrimary: 'Записаться на съёмку',
    ctaSecondary: 'Смотреть работы',
  },
  about: {
    heading: 'Обо мне',
    body: 'Ирина Полянская, фотограф, Гюмри. Пять лет работы с портретом, love story и коммерческой съёмкой. Снимаю там, где встречаются тёплый свет и настоящие эмоции — диско-шар в тёмной комнате, роза в теплице, тень старого туфового дома.',
  },
  portfolioTeaser: {
    heading: 'Портфолио',
    viewAll: 'Смотреть всё портфолио',
  },
  services: {
    heading: 'Услуги',
    items: [
      { title: 'Портретная съёмка', description: 'Индивидуальный и семейный портрет с акцентом на естественность и характер.' },
      { title: 'Love story', description: 'Съёмка пары — от предложения до годовщины, без постановочной неловкости.' },
      { title: 'Коммерческая съёмка', description: 'Товар, бренд, команда — фотографии для сайта, соцсетей и рекламы.' },
      { title: 'Съёмка мероприятий', description: 'Корпоративы, вечеринки, публичные события — репортаж без постановки.' },
      { title: 'Семейная съёмка', description: 'Портрет семьи в естественной обстановке, дома или на улице.' },
    ],
  },
  pricing: {
    heading: 'Прайс',
    tiers: [
      {
        name: 'STANDARD',
        price: '6 000 ₽',
        features: [
          '1–1.5 часа съёмки',
          '50–70 фото в обработке (5–10 в ретуши)',
          'Помощь с образом, локацией и реквизитом',
          'Готовность 7–10 дней',
        ],
      },
      {
        name: 'EXPRESS',
        price: '3 500 ₽',
        features: [
          'До 30 минут съёмки',
          '20–25 фото в обработке (до 5 в ретуши)',
          'Помощь с образом, локацией и реквизитом',
          'Готовность 7–10 дней',
        ],
      },
    ],
    footnote: 'Дополнительное фото в ретуши — 150 ₽. Студия и визажист оплачиваются отдельно.',
  },
  contacts: {
    heading: 'Контакты',
    location: 'Гюмри, Армения',
    telegramLabel: 'Telegram',
    instagramLabel: 'Instagram',
    bookingMessage: 'Здравствуйте! Хочу записаться на фотосессию.',
  },
  gallery: {
    heading: 'Портфолио',
    filters: [
      { id: 'all', label: 'Все' },
      { id: 'portrait', label: 'Портрет' },
      { id: 'love-story', label: 'Love story' },
      { id: 'fashion-night', label: 'Фэшн/Ночная съёмка' },
    ],
  },
  footer: {
    rights: 'Ирина Полянская. Все права защищены.',
  },
};
```

- [ ] **Step 5: Write the EN content**

Create `content/en.ts`:

```ts
import type { SiteContent } from './types';

export const en: SiteContent = {
  meta: {
    title: 'Irina Polyanskaya — Photographer in Gyumri',
    description:
      'Portrait, love story, and commercial photography in Gyumri. Browse the portfolio and book a session.',
  },
  nav: {
    about: 'About',
    portfolio: 'Portfolio',
    services: 'Services',
    pricing: 'Pricing',
    contacts: 'Contacts',
    bookCta: 'Book a session',
  },
  hero: {
    kicker: 'PHOTOGRAPHER · GYUMRI',
    name: 'Irina Polyanskaya',
    subhead: 'Portrait, love story, and commercial photography. Based in Gyumri, available on location.',
    ctaPrimary: 'Book a session',
    ctaSecondary: 'View the work',
  },
  about: {
    heading: 'About',
    body: 'Irina Polyanskaya, photographer, based in Gyumri. Five years shooting portraits, love stories, and commercial work. I look for the place where warm light meets real emotion — a disco ball in a dark room, a rose in a greenhouse, the shadow of an old tuff-stone house.',
  },
  portfolioTeaser: {
    heading: 'Portfolio',
    viewAll: 'View the full portfolio',
  },
  services: {
    heading: 'Services',
    items: [
      { title: 'Portrait', description: 'Individual and family portraits focused on character, not posing.' },
      { title: 'Love story', description: 'Couple sessions — proposals to anniversaries, without stiff staging.' },
      { title: 'Commercial', description: 'Product, brand, and team photography for websites, social media, and ads.' },
      { title: 'Events', description: 'Corporate events, parties, and public gatherings — documentary style, no staging.' },
      { title: 'Family', description: 'Family portraits in a natural setting, at home or outdoors.' },
    ],
  },
  pricing: {
    heading: 'Pricing',
    tiers: [
      {
        name: 'STANDARD',
        price: '6,000 ₽',
        features: [
          '1–1.5 hour session',
          '50–70 edited photos (5–10 retouched)',
          'Help with styling, location, and props',
          'Ready in 7–10 days',
        ],
      },
      {
        name: 'EXPRESS',
        price: '3,500 ₽',
        features: [
          'Up to 30 minutes',
          '20–25 edited photos (up to 5 retouched)',
          'Help with styling, location, and props',
          'Ready in 7–10 days',
        ],
      },
    ],
    footnote: 'Additional retouched photo — 150 ₽. Studio and makeup artist billed separately.',
  },
  contacts: {
    heading: 'Contacts',
    location: 'Gyumri, Armenia',
    telegramLabel: 'Telegram',
    instagramLabel: 'Instagram',
    bookingMessage: "Hi! I'd like to book a photo session.",
  },
  gallery: {
    heading: 'Portfolio',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'portrait', label: 'Portrait' },
      { id: 'love-story', label: 'Love story' },
      { id: 'fashion-night', label: 'Fashion/Night' },
    ],
  },
  footer: {
    rights: 'Irina Polyanskaya. All rights reserved.',
  },
};
```

- [ ] **Step 6: Wire the index and locale helper**

Create `content/index.ts`:

```ts
import { ru } from './ru';
import { en } from './en';
import type { Locale, SiteContent } from './types';

export const content: Record<Locale, SiteContent> = { ru, en };
export type { Locale, SiteContent };
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm test -- content/content.test.ts`
Expected: PASS — 5 tests passed.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add bilingual site content (RU/EN) with parity test"
```

---

## Task 4: Locale routing shell, fonts, and global styles

**Files:**
- Create: `lib/localePath.ts`, `lib/localePath.test.ts`
- Create: `app/fonts.ts`
- Create: `app/globals.css` (overwrite the `create-next-app` default)
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx` (minimal placeholder content — real sections added in Tasks 8–12)
- Create: `app/[locale]/gallery/page.tsx` (minimal placeholder — real gallery added in Task 10)
- Modify: `next.config.ts` (add rewrites)
- Delete: `app/page.tsx`, `app/layout.tsx` (the `create-next-app` defaults, superseded by `app/[locale]/*`)

**Interfaces:**
- Produces: `toggleLocalePath(pathname: string, targetLocale: 'ru' | 'en'): string`; `cormorant`, `manrope`, `jetbrainsMono` font objects (each with a `.variable` string) from `app/fonts.ts`.
- Consumed by: Task 7 (`SiteHeader` language switcher uses `toggleLocalePath`); every later layout/page task builds on `app/[locale]/layout.tsx`.

- [ ] **Step 1: Write the failing test for the locale-path helper**

Create `lib/localePath.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { toggleLocalePath } from './localePath';

describe('toggleLocalePath', () => {
  it('converts the RU landing path to the EN landing path', () => {
    expect(toggleLocalePath('/', 'en')).toBe('/en');
  });

  it('converts the EN landing path to the RU landing path', () => {
    expect(toggleLocalePath('/en', 'ru')).toBe('/');
  });

  it('converts the RU gallery path to the EN gallery path', () => {
    expect(toggleLocalePath('/gallery', 'en')).toBe('/en/gallery');
  });

  it('converts the EN gallery path to the RU gallery path', () => {
    expect(toggleLocalePath('/en/gallery', 'ru')).toBe('/gallery');
  });

  it('is a no-op when already on the target locale', () => {
    expect(toggleLocalePath('/gallery', 'ru')).toBe('/gallery');
    expect(toggleLocalePath('/en/gallery', 'en')).toBe('/en/gallery');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/localePath.test.ts`
Expected: FAIL — `lib/localePath.ts` does not exist.

- [ ] **Step 3: Implement `toggleLocalePath`**

Create `lib/localePath.ts`:

```ts
export function toggleLocalePath(pathname: string, targetLocale: 'ru' | 'en'): string {
  const isEn = pathname.startsWith('/en');

  if (targetLocale === 'en') {
    if (isEn) return pathname;
    return pathname === '/' ? '/en' : `/en${pathname}`;
  }

  if (!isEn) return pathname;
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/localePath.test.ts`
Expected: PASS — 5 tests passed.

- [ ] **Step 5: Add the rewrites so `/` and `/gallery` resolve to the `ru` locale segment**

Replace the contents of `next.config.ts` with:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/ru' },
      { source: '/gallery', destination: '/ru/gallery' },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 6: Define the fonts**

Create `app/fonts.ts`:

```ts
import { Cormorant, Manrope, JetBrains_Mono } from 'next/font/google';

export const cormorant = Cormorant({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
```

- [ ] **Step 7: Write the global styles**

Replace the contents of `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-paper: #f6f1e9;
  --color-ink: #1b1714;
  --color-wine: #7a2331;
  --color-gold: #b08d4f;

  --font-display: var(--font-cormorant), Georgia, serif;
  --font-sans: var(--font-manrope), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

html {
  scroll-behavior: auto; /* Lenis (Task 5) drives smooth scroll instead */
}

body {
  background-color: var(--color-paper);
  color: var(--color-ink);
}
```

- [ ] **Step 8: Remove the `create-next-app` defaults**

Run: `rm app/page.tsx app/layout.tsx`
(Keep `app/favicon.ico` if present — it is replaced in Task 14.)

- [ ] **Step 9: Create the root layout under `[locale]`**

Create `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cormorant, manrope, jetbrainsMono } from '../fonts';
import { content, type Locale } from '@/content';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = content[locale];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: locale === 'ru' ? '/' : '/en' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create minimal landing and gallery page placeholders**

Create `app/[locale]/page.tsx`:

```tsx
import { content, type Locale } from '@/content';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];

  return (
    <main>
      <h1 className="font-display text-4xl p-8">{c.hero.name}</h1>
      <p className="px-8 pb-8">{c.hero.subhead}</p>
    </main>
  );
}
```

Create `app/[locale]/gallery/page.tsx`:

```tsx
import { content, type Locale } from '@/content';

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];

  return (
    <main>
      <h1 className="font-display text-4xl p-8">{c.gallery.heading}</h1>
    </main>
  );
}
```

(Both are replaced with full section-driven pages in Task 13 — this step only proves the `[locale]` routing and rewrites work end to end.)

- [ ] **Step 11: Verify the build and the rewrites**

Run: `npm run build && npm run start &`
Then: `curl -s http://localhost:3000/ | grep -o '<html lang="[a-z]*"'` → expect `<html lang="ru"`
Then: `curl -s http://localhost:3000/en | grep -o '<html lang="[a-z]*"'` → expect `<html lang="en"`
Then: `curl -s http://localhost:3000/gallery | grep -o '<h1[^<]*'` should contain "Портфолио".
Then: `curl -s http://localhost:3000/en/gallery | grep -o '<h1[^<]*'` should contain "Portfolio".
Stop the server: `kill %1`

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Add [locale] routing shell, fonts, and global theme"
```

---

## Task 5: Reduced-motion hook, smooth scroll, and custom cursor

**Files:**
- Create: `lib/useReducedMotion.ts`, `lib/useReducedMotion.test.tsx`
- Create: `components/ui/SmoothScrollProvider.tsx`
- Create: `components/ui/CustomCursor.tsx`, `components/ui/CustomCursor.test.tsx`
- Modify: `app/[locale]/layout.tsx` (wrap body content in `SmoothScrollProvider`, render `CustomCursor`)

**Interfaces:**
- Produces: `useReducedMotion(): boolean`; `<SmoothScrollProvider>{children}</SmoothScrollProvider>`; `<CustomCursor />`.
- Consumed by: every later GSAP-driven component (Tasks 6, 8–12) calls `useReducedMotion()` before registering scroll animations.

- [ ] **Step 1: Write the failing test for `useReducedMotion`**

Create `lib/useReducedMotion.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

function mockMatchMedia(initialMatches: boolean) {
  let listener: ((e: MediaQueryListEvent) => void) | null = null;
  const mql = {
    matches: initialMatches,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      listener = cb;
    },
    removeEventListener: () => {
      listener = null;
    },
  };
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;
  return {
    trigger(matches: boolean) {
      mql.matches = matches;
      listener?.({ matches } as MediaQueryListEvent);
    },
  };
}

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('reflects the initial matchMedia state', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', () => {
    const { trigger } = mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => trigger(true));
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/useReducedMotion.test.tsx`
Expected: FAIL — `lib/useReducedMotion.ts` does not exist.

- [ ] **Step 3: Implement `useReducedMotion`**

Create `lib/useReducedMotion.ts`:

```ts
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/useReducedMotion.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Implement `SmoothScrollProvider`**

Create `components/ui/SmoothScrollProvider.tsx`:

```tsx
'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let frame: number;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
```

- [ ] **Step 6: Write the failing test for `CustomCursor`**

Create `components/ui/CustomCursor.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}));

import { useReducedMotion } from '@/lib/useReducedMotion';
import { CustomCursor } from './CustomCursor';

describe('CustomCursor', () => {
  it('renders nothing when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<CustomCursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the cursor element when motion is allowed', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    render(<CustomCursor />);
    expect(screen.getByTestId('custom-cursor')).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm test -- components/ui/CustomCursor.test.tsx`
Expected: FAIL — `./CustomCursor` does not exist.

- [ ] **Step 8: Implement `CustomCursor`**

Create `components/ui/CustomCursor.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = dotRef.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      el!.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }

    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      el!.dataset.state = target.closest('a, button, [data-cursor-focus]') ? 'focus' : 'default';
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={dotRef}
      data-testid="custom-cursor"
      data-state="default"
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-3 -mt-3 hidden h-6 w-6 rounded-full border border-ink mix-blend-difference transition-[width,height] duration-150 ease-out data-[state=focus]:h-4 data-[state=focus]:w-4 data-[state=focus]:border-2 md:block"
    />
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npm test -- components/ui/CustomCursor.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 10: Wire both into the root layout**

Modify `app/[locale]/layout.tsx` — add the imports and wrap the body content:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cormorant, manrope, jetbrainsMono } from '../fonts';
import { content, type Locale } from '@/content';
import { SmoothScrollProvider } from '@/components/ui/SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = content[locale];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: locale === 'ru' ? '/' : '/en' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Verify the full test suite and build still pass**

Run: `npm test && npm run build`
Expected: all Vitest suites pass; build succeeds.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Add smooth scroll, reduced-motion hook, and custom cursor"
```

---

## Task 6: UI primitives — HudFrame, MagneticButton, SplitHeading, RevealImage

**Files:**
- Modify: `vitest.setup.ts` (add a `ResizeObserver` stub — GSAP's ScrollTrigger touches it even in a jsdom environment where it doesn't exist)
- Create: `components/ui/HudFrame.tsx`, `components/ui/HudFrame.test.tsx`
- Create: `components/ui/MagneticButton.tsx`, `components/ui/MagneticButton.test.tsx`
- Create: `components/ui/SplitHeading.tsx`, `components/ui/SplitHeading.test.tsx`
- Create: `components/ui/RevealImage.tsx`, `components/ui/RevealImage.test.tsx`

**Interfaces:**
- Produces:
  - `<HudFrame label?: string className?: string>{children}</HudFrame>`
  - `<MagneticButton href?: string onClick?: () => void className?: string>{children}</MagneticButton>`
  - `<SplitHeading as?: ElementType className?: string>{text: string}</SplitHeading>`
  - `<RevealImage src width height alt className? sizes? priority?>` (no children — wraps `next/image`)
- Consumed by: Task 8 (Hero, About), Task 9 (Services, Pricing), Task 10 (Gallery), Task 12 (PortfolioTeaser).

- [ ] **Step 1: Add the `ResizeObserver` stub**

Modify `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom does not implement ResizeObserver; GSAP/ScrollTrigger expects it to exist.
global.ResizeObserver = global.ResizeObserver ?? ResizeObserverStub;
```

- [ ] **Step 2: Write the failing test for `HudFrame`**

Create `components/ui/HudFrame.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HudFrame } from './HudFrame';

describe('HudFrame', () => {
  it('renders its children', () => {
    render(
      <HudFrame>
        <p>content</p>
      </HudFrame>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders an optional label', () => {
    render(
      <HudFrame label="35mm · f/1.8">
        <p>content</p>
      </HudFrame>
    );
    expect(screen.getByText('35mm · f/1.8')).toBeInTheDocument();
  });

  it('omits the label element when none is given', () => {
    render(
      <HudFrame>
        <p>content</p>
      </HudFrame>
    );
    expect(screen.queryByText(/f\/1\.8/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- components/ui/HudFrame.test.tsx`
Expected: FAIL — `./HudFrame` does not exist.

- [ ] **Step 4: Implement `HudFrame`**

Create `components/ui/HudFrame.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function HudFrame({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l border-t border-gold" />
      <span className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r border-t border-gold" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-gold" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-gold" />
      {label && (
        <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-wider text-gold">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/ui/HudFrame.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 6: Write the failing test for `MagneticButton`**

Create `components/ui/MagneticButton.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MagneticButton } from './MagneticButton';

describe('MagneticButton', () => {
  it('renders as a link when href is given', () => {
    render(<MagneticButton href="/gallery">Смотреть работы</MagneticButton>);
    const link = screen.getByRole('link', { name: 'Смотреть работы' });
    expect(link).toHaveAttribute('href', '/gallery');
  });

  it('renders as a button and fires onClick when no href is given', async () => {
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>Записаться</MagneticButton>);
    const button = screen.getByRole('button', { name: 'Записаться' });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('marks itself as a cursor focus target', () => {
    render(<MagneticButton onClick={() => {}}>Записаться</MagneticButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-cursor-focus');
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm test -- components/ui/MagneticButton.test.tsx`
Expected: FAIL — `./MagneticButton` does not exist.

- [ ] **Step 8: Implement `MagneticButton`**

Create `components/ui/MagneticButton.tsx`:

```tsx
'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

const baseClass =
  'inline-flex items-center justify-center rounded-full border border-ink px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper';

export function MagneticButton({
  children,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-focus
        className={cn(baseClass, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-focus
      className={cn(baseClass, className)}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npm test -- components/ui/MagneticButton.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 10: Write the failing test for `SplitHeading`**

Create `components/ui/SplitHeading.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}));

import { useReducedMotion } from '@/lib/useReducedMotion';
import { SplitHeading } from './SplitHeading';

describe('SplitHeading', () => {
  it('renders the full text when motion is allowed (GSAP splits it into lines)', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(<SplitHeading as="h2">Фотограф Гюмри</SplitHeading>);
    expect(container.textContent).toContain('Фотограф Гюмри');
  });

  it('renders the full text unsplit when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<SplitHeading as="h2">Фотограф Гюмри</SplitHeading>);
    expect(container.textContent).toContain('Фотограф Гюмри');
  });

  it('renders the given tag', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<SplitHeading as="h1">Заголовок</SplitHeading>);
    expect(container.querySelector('h1')).not.toBeNull();
  });
});
```

- [ ] **Step 11: Run the test to verify it fails**

Run: `npm test -- components/ui/SplitHeading.test.tsx`
Expected: FAIL — `./SplitHeading` does not exist.

- [ ] **Step 12: Implement `SplitHeading`**

Create `components/ui/SplitHeading.tsx`:

```tsx
'use client';

import { useEffect, useRef, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useReducedMotion } from '@/lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export function SplitHeading({
  children,
  as = 'h2',
  className,
}: {
  children: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const Tag = as;

  useEffect(() => {
    if (!ref.current || reducedMotion) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      const split = new GSAPSplitText(el, { type: 'lines', linesClass: 'overflow-hidden' });
      gsap.fromTo(
        split.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 13: Run the test to verify it passes**

Run: `npm test -- components/ui/SplitHeading.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 14: Write the failing test for `RevealImage`**

Create `components/ui/RevealImage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevealImage } from './RevealImage';

describe('RevealImage', () => {
  it('renders an image with the given src and alt text', () => {
    render(<RevealImage src="/photos/portrait/portrait-04.jpg" alt="A man standing by an old stone wall" width={720} height={900} />);
    const img = screen.getByAltText('A man standing by an old stone wall');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });
});
```

- [ ] **Step 15: Run the test to verify it fails**

Run: `npm test -- components/ui/RevealImage.test.tsx`
Expected: FAIL — `./RevealImage` does not exist.

- [ ] **Step 16: Implement `RevealImage`**

Create `components/ui/RevealImage.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

gsap.registerPlugin(ScrollTrigger);

export function RevealImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reducedMotion) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
```

- [ ] **Step 17: Run the test to verify it passes**

Run: `npm test -- components/ui/RevealImage.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 18: Run the full suite and commit**

Run: `npm test`
Expected: all suites pass.

```bash
git add -A
git commit -m "Add HudFrame, MagneticButton, SplitHeading, and RevealImage primitives"
```

---

## Task 7: SiteHeader and SiteFooter with language switcher

**Files:**
- Create: `components/layout/SiteHeader.tsx`, `components/layout/SiteHeader.test.tsx`
- Create: `components/layout/SiteFooter.tsx`, `components/layout/SiteFooter.test.tsx`
- Modify: `app/[locale]/layout.tsx` (render `SiteHeader`/`SiteFooter` around `{children}`)

**Interfaces:**
- Consumes: `content`, `toggleLocalePath` (Task 4), `MagneticButton` (Task 6).
- Produces: `<SiteHeader locale: Locale />`, `<SiteFooter locale: Locale />` — both consumed only by `app/[locale]/layout.tsx`.

- [ ] **Step 1: Write the failing test for `SiteHeader`**

Create `components/layout/SiteHeader.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('renders RU nav labels and a language switch link to the EN home', () => {
    render(<SiteHeader locale="ru" />);
    expect(screen.getByText('Обо мне')).toBeInTheDocument();
    expect(screen.getByText('Портфолио')).toBeInTheDocument();
    const langLink = screen.getByRole('link', { name: 'Switch language' });
    expect(langLink.getAttribute('href')).toBe('/en');
  });

  it('renders the booking CTA linking to Telegram with a prefilled message', () => {
    render(<SiteHeader locale="ru" />);
    const cta = screen.getByRole('link', { name: 'Записаться' });
    expect(cta.getAttribute('href')).toMatch(/^https:\/\/t\.me\/polka977\?text=/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/layout/SiteHeader.test.tsx`
Expected: FAIL — `./SiteHeader` does not exist.

- [ ] **Step 3: Implement `SiteHeader`**

Create `components/layout/SiteHeader.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { content, type Locale } from '@/content';
import { toggleLocalePath } from '@/lib/localePath';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const c = content[locale];
  const base = locale === 'ru' ? '' : '/en';

  const navLinks = [
    { href: `${base}/#about`, label: c.nav.about },
    { href: `${base}/gallery`, label: c.nav.portfolio },
    { href: `${base}/#services`, label: c.nav.services },
    { href: `${base}/#pricing`, label: c.nav.pricing },
    { href: `${base}/#contacts`, label: c.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-6 py-4 backdrop-blur">
      <Link href={locale === 'ru' ? '/' : '/en'} className="font-display text-xl tracking-wide">
        {c.hero.name}
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-xs uppercase tracking-wider md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-wine">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href={toggleLocalePath(pathname, locale === 'ru' ? 'en' : 'ru')}
          className="font-mono text-xs uppercase tracking-wider hover:text-wine"
          aria-label="Switch language"
        >
          {locale === 'ru' ? 'EN' : 'RU'}
        </Link>
        <MagneticButton
          href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}
          className="hidden sm:inline-flex"
        >
          {c.nav.bookCta}
        </MagneticButton>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- components/layout/SiteHeader.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Write the failing test for `SiteFooter`**

Create `components/layout/SiteFooter.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders the RU location and both contact links', () => {
    render(<SiteFooter locale="ru" />);
    expect(screen.getByText('Гюмри, Армения')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Telegram' }).getAttribute('href')).toMatch(/t\.me\/polka977/);
    expect(screen.getByRole('link', { name: 'Instagram' }).getAttribute('href')).toBe(
      'https://instagram.com/polyanskaya_photo7'
    );
  });

  it('renders the EN location', () => {
    render(<SiteFooter locale="en" />);
    expect(screen.getByText('Gyumri, Armenia')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- components/layout/SiteFooter.test.tsx`
Expected: FAIL — `./SiteFooter` does not exist.

- [ ] **Step 7: Implement `SiteFooter`**

Create `components/layout/SiteFooter.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <footer id="contacts" className="border-t border-ink/10 px-6 py-16">
      <h2 className="font-display text-3xl">{c.contacts.heading}</h2>
      <p className="mt-2 font-mono text-sm uppercase tracking-wider text-ink/70">{c.contacts.location}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <MagneticButton href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}>
          {c.contacts.telegramLabel}
        </MagneticButton>
        <MagneticButton href="https://instagram.com/polyanskaya_photo7">{c.contacts.instagramLabel}</MagneticButton>
      </div>
      <p className="mt-12 font-mono text-[11px] uppercase tracking-wider text-ink/50">
        © {new Date().getFullYear()} {c.footer.rights}
      </p>
    </footer>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- components/layout/SiteFooter.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 9: Wire both into the root layout**

Modify `app/[locale]/layout.tsx` — import and render around `{children}`:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cormorant, manrope, jetbrainsMono } from '../fonts';
import { content, type Locale } from '@/content';
import { SmoothScrollProvider } from '@/components/ui/SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import '../globals.css';

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = content[locale];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: locale === 'ru' ? '/' : '/en' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${cormorant.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Verify the full suite and build**

Run: `npm test && npm run build`
Expected: all suites pass; build succeeds.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Add SiteHeader and SiteFooter with language switcher"
```

---

## Task 8: Hero and About sections

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/Hero.test.tsx`
- Create: `components/sections/About.tsx`, `components/sections/About.test.tsx`

**Interfaces:**
- Consumes: `content`, `heroPhoto`, `aboutPhoto` (Task 2/3), `HudFrame`, `SplitHeading`, `MagneticButton`, `RevealImage` (Task 6).
- Produces: `<Hero locale: Locale />`, `<About locale: Locale />` — consumed by Task 13's landing page assembly.

- [ ] **Step 1: Write the failing test for `Hero`**

Create `components/sections/Hero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the RU kicker, name, and subhead', () => {
    render(<Hero locale="ru" />);
    expect(screen.getByText('ФОТОГРАФ · ГЮМРИ')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ирина Полянская');
    expect(screen.getByText(/Портретная, love story/)).toBeInTheDocument();
  });

  it('renders the primary CTA linking to Telegram and secondary CTA to the gallery', () => {
    render(<Hero locale="ru" />);
    expect(screen.getByRole('link', { name: 'Записаться на съёмку' }).getAttribute('href')).toMatch(
      /t\.me\/polka977/
    );
    expect(screen.getByRole('link', { name: 'Смотреть работы' }).getAttribute('href')).toBe('/gallery');
  });

  it('renders the EN secondary CTA pointing at /en/gallery', () => {
    render(<Hero locale="en" />);
    expect(screen.getByRole('link', { name: 'View the work' }).getAttribute('href')).toBe('/en/gallery');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/sections/Hero.test.tsx`
Expected: FAIL — `./Hero` does not exist.

- [ ] **Step 3: Implement `Hero`**

Create `components/sections/Hero.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { heroPhoto } from '@/data/photos';
import { HudFrame } from '@/components/ui/HudFrame';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { RevealImage } from '@/components/ui/RevealImage';

export function Hero({ locale }: { locale: Locale }) {
  const c = content[locale];
  const base = locale === 'ru' ? '' : '/en';

  return (
    <section className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-wine">{c.hero.kicker}</p>
        <SplitHeading as="h1" className="mt-4 font-display text-5xl leading-tight md:text-6xl">
          {c.hero.name}
        </SplitHeading>
        <p className="mt-6 max-w-md text-lg text-ink/80">{c.hero.subhead}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <MagneticButton href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}>
            {c.hero.ctaPrimary}
          </MagneticButton>
          <MagneticButton href={`${base}/gallery`}>{c.hero.ctaSecondary}</MagneticButton>
        </div>
      </div>
      <HudFrame label="35mm · f/1.8 · ISO 200">
        <RevealImage
          src={`/photos/${heroPhoto.category}/${heroPhoto.slug}.jpg`}
          alt={heroPhoto.alt[locale]}
          width={heroPhoto.width}
          height={heroPhoto.height}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </HudFrame>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- components/sections/Hero.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Write the failing test for `About`**

Create `components/sections/About.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About', () => {
  it('renders the RU heading and bio', () => {
    render(<About locale="ru" />);
    expect(screen.getByRole('heading', { name: 'Обо мне' })).toBeInTheDocument();
    expect(screen.getByText(/Пять лет работы с портретом/)).toBeInTheDocument();
  });

  it('renders the EN heading and bio', () => {
    render(<About locale="en" />);
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByText(/Five years shooting portraits/)).toBeInTheDocument();
  });

  it('renders the about photo with locale-specific alt text', () => {
    render(<About locale="ru" />);
    expect(screen.getByAltText('Ирина Полянская в тёплом ночном свете, портрет')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- components/sections/About.test.tsx`
Expected: FAIL — `./About` does not exist.

- [ ] **Step 7: Implement `About`**

Create `components/sections/About.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { aboutPhoto } from '@/data/photos';
import { HudFrame } from '@/components/ui/HudFrame';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { RevealImage } from '@/components/ui/RevealImage';

export function About({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="about" className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <HudFrame label={locale === 'ru' ? 'ПОРТРЕТ АВТОРА' : 'PHOTOGRAPHER'} className="order-2 md:order-1">
        <RevealImage
          src="/photos/about/about-irina.jpg"
          alt={aboutPhoto.alt[locale]}
          width={aboutPhoto.width}
          height={aboutPhoto.height}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </HudFrame>
      <div className="order-1 md:order-2">
        <SplitHeading as="h2" className="font-display text-4xl">
          {c.about.heading}
        </SplitHeading>
        <p className="mt-6 max-w-md text-lg text-ink/80">{c.about.body}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- components/sections/About.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add Hero and About sections"
```

---

## Task 9: Services and Pricing sections

**Files:**
- Create: `components/sections/Services.tsx`, `components/sections/Services.test.tsx`
- Create: `components/sections/Pricing.tsx`, `components/sections/Pricing.test.tsx`

**Interfaces:**
- Consumes: `content`, `commercialPhoto` (Task 2/3), `SplitHeading`, `RevealImage` (Task 6).
- Produces: `<Services locale: Locale />`, `<Pricing locale: Locale />` — consumed by Task 13's landing page assembly.

- [ ] **Step 1: Write the failing test for `Services`**

Create `components/sections/Services.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Services } from './Services';

describe('Services', () => {
  it('renders all 5 RU services', () => {
    render(<Services locale="ru" />);
    expect(screen.getByText('Портретная съёмка')).toBeInTheDocument();
    expect(screen.getByText('Love story')).toBeInTheDocument();
    expect(screen.getByText('Коммерческая съёмка')).toBeInTheDocument();
    expect(screen.getByText('Съёмка мероприятий')).toBeInTheDocument();
    expect(screen.getByText('Семейная съёмка')).toBeInTheDocument();
  });

  it('renders all 5 EN services', () => {
    render(<Services locale="en" />);
    expect(screen.getByText('Portrait')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('illustrates the commercial service with the commercial photo', () => {
    render(<Services locale="ru" />);
    expect(
      screen.getByAltText('Детальный кадр украшения на коже, пример предметной съёмки')
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/sections/Services.test.tsx`
Expected: FAIL — `./Services` does not exist.

- [ ] **Step 3: Implement `Services`**

Create `components/sections/Services.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { commercialPhoto } from '@/data/photos';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { RevealImage } from '@/components/ui/RevealImage';

const COMMERCIAL_SERVICE_INDEX = 2; // "Коммерческая съёмка" / "Commercial" — 3rd item in both locales

export function Services({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="services" className="px-6 py-16 md:py-24">
      <SplitHeading as="h2" className="font-display text-4xl">
        {c.services.heading}
      </SplitHeading>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {c.services.items.map((item, index) => (
          <div key={item.title} className="border-t border-ink/15 pt-6">
            {index === COMMERCIAL_SERVICE_INDEX && (
              <RevealImage
                src="/photos/commercial/commercial-01.jpg"
                alt={commercialPhoto.alt[locale]}
                width={commercialPhoto.width}
                height={commercialPhoto.height}
                className="mb-4 aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            )}
            <h3 className="font-display text-2xl">{item.title}</h3>
            <p className="mt-2 text-ink/70">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- components/sections/Services.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Write the failing test for `Pricing`**

Create `components/sections/Pricing.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pricing } from './Pricing';

describe('Pricing', () => {
  it('renders both RU tiers with prices', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText('STANDARD')).toBeInTheDocument();
    expect(screen.getByText('6 000 ₽')).toBeInTheDocument();
    expect(screen.getByText('EXPRESS')).toBeInTheDocument();
    expect(screen.getByText('3 500 ₽')).toBeInTheDocument();
  });

  it('renders both EN tiers with prices', () => {
    render(<Pricing locale="en" />);
    expect(screen.getByText('6,000 ₽')).toBeInTheDocument();
    expect(screen.getByText('3,500 ₽')).toBeInTheDocument();
  });

  it('renders the footnote mentioning the extra-photo price', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText(/150 ₽/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- components/sections/Pricing.test.tsx`
Expected: FAIL — `./Pricing` does not exist.

- [ ] **Step 7: Implement `Pricing`**

Create `components/sections/Pricing.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { SplitHeading } from '@/components/ui/SplitHeading';

export function Pricing({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="pricing" className="px-6 py-16 md:py-24">
      <SplitHeading as="h2" className="font-display text-4xl">
        {c.pricing.heading}
      </SplitHeading>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {c.pricing.tiers.map((tier) => (
          <div key={tier.name} className="rounded-2xl border border-ink/15 p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-wine">{tier.name}</p>
            <p className="mt-2 font-display text-4xl">{tier.price}</p>
            <ul className="mt-6 space-y-2 text-ink/80">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-sm text-ink/60">{c.pricing.footnote}</p>
    </section>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- components/sections/Pricing.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add Services and Pricing sections"
```

---

## Task 10: Gallery filter logic and grid (with Flip re-layout)

**Files:**
- Create: `lib/filterPhotos.ts`, `lib/filterPhotos.test.ts`
- Create: `components/gallery/CategoryFilter.tsx`, `components/gallery/CategoryFilter.test.tsx`
- Create: `components/gallery/GalleryGrid.tsx`, `components/gallery/GalleryGrid.test.tsx`

**Interfaces:**
- Produces:
  - `filterPhotos(photos: Photo[], category: 'all' | PhotoCategory): Photo[]`
  - `<CategoryFilter filters active onChange>` — pure controlled pill group.
  - `<GalleryGrid photos filters locale onPhotoClick: (photo: Photo, visiblePhotos: Photo[]) => void>` — owns the active-category state itself.
- Consumed by: Task 11 (`Lightbox` receives `(photo, visiblePhotos)` from `onPhotoClick`), Task 13 (gallery page assembly).

- [ ] **Step 1: Write the failing test for `filterPhotos`**

Create `lib/filterPhotos.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { filterPhotos } from './filterPhotos';
import type { Photo } from '@/data/photos';

const sample: Photo[] = [
  { slug: 'a', category: 'portrait', sourceFile: 'a.jpg', width: 1, height: 1, alt: { ru: 'a', en: 'a' } },
  { slug: 'b', category: 'love-story', sourceFile: 'b.jpg', width: 1, height: 1, alt: { ru: 'b', en: 'b' } },
  { slug: 'c', category: 'fashion-night', sourceFile: 'c.jpg', width: 1, height: 1, alt: { ru: 'c', en: 'c' } },
];

describe('filterPhotos', () => {
  it('returns all photos when category is "all"', () => {
    expect(filterPhotos(sample, 'all')).toEqual(sample);
  });

  it('returns only photos matching the given category', () => {
    expect(filterPhotos(sample, 'portrait')).toEqual([sample[0]]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterPhotos([sample[0]], 'love-story')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/filterPhotos.test.ts`
Expected: FAIL — `./filterPhotos` does not exist.

- [ ] **Step 3: Implement `filterPhotos`**

Create `lib/filterPhotos.ts`:

```ts
import type { Photo, PhotoCategory } from '@/data/photos';

export function filterPhotos(photos: Photo[], category: 'all' | PhotoCategory): Photo[] {
  if (category === 'all') return photos;
  return photos.filter((p) => p.category === category);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/filterPhotos.test.ts`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Write the failing test for `CategoryFilter`**

Create `components/gallery/CategoryFilter.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilter } from './CategoryFilter';

const filters = [
  { id: 'all', label: 'Все' },
  { id: 'portrait', label: 'Портрет' },
];

describe('CategoryFilter', () => {
  it('marks the active filter as selected', () => {
    render(<CategoryFilter filters={filters} active="all" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Все' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Портрет' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with the clicked filter id', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter filters={filters} active="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Портрет' }));
    expect(onChange).toHaveBeenCalledWith('portrait');
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- components/gallery/CategoryFilter.test.tsx`
Expected: FAIL — `./CategoryFilter` does not exist.

- [ ] **Step 7: Implement `CategoryFilter`**

Create `components/gallery/CategoryFilter.tsx`:

```tsx
'use client';

import { cn } from '@/lib/cn';

export function CategoryFilter({
  filters,
  active,
  onChange,
}: {
  filters: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap gap-3">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={active === f.id}
          onClick={() => onChange(f.id)}
          data-cursor-focus
          className={cn(
            'rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors',
            active === f.id ? 'border-ink bg-ink text-paper' : 'border-ink/30 text-ink/70 hover:border-ink'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- components/gallery/CategoryFilter.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 9: Write the failing test for `GalleryGrid`**

Create `components/gallery/GalleryGrid.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: () => true, // skip GSAP Flip timing in tests
}));

import { GalleryGrid } from './GalleryGrid';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'l1', category: 'love-story', sourceFile: 'l1.jpg', width: 720, height: 900, alt: { ru: 'Лав стори 1', en: 'Love story 1' } },
  { slug: 'f1', category: 'fashion-night', sourceFile: 'f1.jpg', width: 720, height: 900, alt: { ru: 'Фэшн 1', en: 'Fashion 1' } },
];

const filters = [
  { id: 'all' as const, label: 'Все' },
  { id: 'portrait' as const, label: 'Портрет' },
  { id: 'love-story' as const, label: 'Love story' },
  { id: 'fashion-night' as const, label: 'Фэшн/Ночная съёмка' },
];

describe('GalleryGrid', () => {
  it('shows all photos by default', () => {
    render(<GalleryGrid photos={photos} filters={filters} locale="ru" onPhotoClick={() => {}} />);
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('narrows to the selected category', async () => {
    render(<GalleryGrid photos={photos} filters={filters} locale="ru" onPhotoClick={() => {}} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Портрет' }));
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByAltText('Портрет 1')).toBeInTheDocument();
  });

  it('calls onPhotoClick with the clicked photo and the currently visible set', async () => {
    const onPhotoClick = vi.fn();
    render(<GalleryGrid photos={photos} filters={filters} locale="ru" onPhotoClick={onPhotoClick} />);
    await userEvent.click(screen.getByAltText('Портрет 1'));
    expect(onPhotoClick).toHaveBeenCalledWith(photos[0], photos);
  });
});
```

- [ ] **Step 10: Run the test to verify it fails**

Run: `npm test -- components/gallery/GalleryGrid.test.tsx`
Expected: FAIL — `./GalleryGrid` does not exist.

- [ ] **Step 11: Implement `GalleryGrid`**

Create `components/gallery/GalleryGrid.tsx`:

```tsx
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import type { Photo, PhotoCategory } from '@/data/photos';
import type { Locale } from '@/content';
import { filterPhotos } from '@/lib/filterPhotos';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { CategoryFilter } from './CategoryFilter';

gsap.registerPlugin(Flip);

export function GalleryGrid({
  photos,
  filters,
  locale,
  onPhotoClick,
}: {
  photos: Photo[];
  filters: { id: 'all' | PhotoCategory; label: string }[];
  locale: Locale;
  onPhotoClick: (photo: Photo, visiblePhotos: Photo[]) => void;
}) {
  const [active, setActive] = useState<'all' | PhotoCategory>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const visible = filterPhotos(photos, active);

  function handleChange(id: string) {
    const nextCategory = id as 'all' | PhotoCategory;
    if (reducedMotion || !gridRef.current) {
      setActive(nextCategory);
      return;
    }
    const state = Flip.getState(gridRef.current.children);
    setActive(nextCategory);
    requestAnimationFrame(() => {
      if (!gridRef.current) return;
      Flip.from(state, { duration: 0.5, ease: 'power2.out', stagger: 0.02, absolute: true });
    });
  }

  return (
    <div>
      <CategoryFilter filters={filters} active={active} onChange={handleChange} />
      <div ref={gridRef} className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
        {visible.map((photo) => (
          <button
            key={photo.slug}
            type="button"
            data-cursor-focus
            onClick={() => onPhotoClick(photo, visible)}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm"
          >
            <Image
              src={`/photos/${photo.category}/${photo.slug}.jpg`}
              alt={photo.alt[locale]}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 12: Run the test to verify it passes**

Run: `npm test -- components/gallery/GalleryGrid.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Add gallery filter logic, CategoryFilter, and GalleryGrid"
```

---

## Task 11: Lightbox

**Files:**
- Create: `lib/lightboxNav.ts`, `lib/lightboxNav.test.ts`
- Create: `components/gallery/Lightbox.tsx`, `components/gallery/Lightbox.test.tsx`

**Interfaces:**
- Produces: `nextIndex(current: number, length: number): number`, `prevIndex(current: number, length: number): number`, `<Lightbox photos index locale onClose onNavigate>`.
- Consumed by: Task 13 (`GallerySection`, combining `GalleryGrid` + `Lightbox`).

- [ ] **Step 1: Write the failing test for the nav helpers**

Create `lib/lightboxNav.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from './lightboxNav';

describe('nextIndex', () => {
  it('advances to the next index', () => {
    expect(nextIndex(0, 3)).toBe(1);
  });

  it('wraps from the last index back to 0', () => {
    expect(nextIndex(2, 3)).toBe(0);
  });
});

describe('prevIndex', () => {
  it('goes back to the previous index', () => {
    expect(prevIndex(1, 3)).toBe(0);
  });

  it('wraps from 0 back to the last index', () => {
    expect(prevIndex(0, 3)).toBe(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/lightboxNav.test.ts`
Expected: FAIL — `./lightboxNav` does not exist.

- [ ] **Step 3: Implement the nav helpers**

Create `lib/lightboxNav.ts`:

```ts
export function nextIndex(current: number, length: number): number {
  return (current + 1) % length;
}

export function prevIndex(current: number, length: number): number {
  return (current - 1 + length) % length;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/lightboxNav.test.ts`
Expected: PASS — 4 tests passed.

- [ ] **Step 5: Write the failing test for `Lightbox`**

Create `components/gallery/Lightbox.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lightbox } from './Lightbox';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'p2', category: 'portrait', sourceFile: 'p2.jpg', width: 720, height: 900, alt: { ru: 'Портрет 2', en: 'Portrait 2' } },
];

describe('Lightbox', () => {
  it('renders the photo at the given index', () => {
    render(<Lightbox photos={photos} index={0} locale="ru" onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.getByAltText('Портрет 1')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Lightbox photos={photos} index={0} locale="ru" onClose={onClose} onNavigate={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onNavigate with the wrapped-around next index', async () => {
    const onNavigate = vi.fn();
    render(<Lightbox photos={photos} index={1} locale="ru" onClose={() => {}} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('closes on Escape and navigates on the right arrow key', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    render(<Lightbox photos={photos} index={0} locale="ru" onClose={onClose} onNavigate={onNavigate} />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigate).toHaveBeenCalledWith(1);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- components/gallery/Lightbox.test.tsx`
Expected: FAIL — `./Lightbox` does not exist.

- [ ] **Step 7: Implement `Lightbox`**

Create `components/gallery/Lightbox.tsx`:

```tsx
'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import type { Photo } from '@/data/photos';
import type { Locale } from '@/content';
import { nextIndex, prevIndex } from '@/lib/lightboxNav';

export function Lightbox({
  photos,
  index,
  locale,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number;
  locale: Locale;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const photo = photos[index];

  const handleNext = useCallback(
    () => onNavigate(nextIndex(index, photos.length)),
    [index, photos.length, onNavigate]
  );
  const handlePrev = useCallback(
    () => onNavigate(prevIndex(index, photos.length)),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, handleNext, handlePrev]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt[locale]}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95"
      onClick={onClose}
    >
      <button aria-label="Close" onClick={onClose} className="absolute right-6 top-6 text-3xl text-paper">
        &times;
      </button>
      {photos.length > 1 && (
        <button
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 text-3xl text-paper md:left-8"
        >
          &#8592;
        </button>
      )}
      <div className="relative max-h-[85vh] max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={`/photos/${photo.category}/${photo.slug}.jpg`}
          alt={photo.alt[locale]}
          width={photo.width}
          height={photo.height}
          sizes="85vw"
          className="max-h-[85vh] w-auto object-contain"
        />
      </div>
      {photos.length > 1 && (
        <button
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 text-3xl text-paper md:right-8"
        >
          &#8594;
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- components/gallery/Lightbox.test.tsx`
Expected: PASS — 4 tests passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add Lightbox with keyboard navigation"
```

---

## Task 12: PortfolioTeaser section

**Files:**
- Create: `components/sections/PortfolioTeaser.tsx`, `components/sections/PortfolioTeaser.test.tsx`

**Interfaces:**
- Consumes: `content`, `photos`, `teaserSlugs` (Task 2/3), `SplitHeading`, `MagneticButton`, `RevealImage` (Task 6).
- Produces: `<PortfolioTeaser locale: Locale />` — consumed by Task 13's landing page assembly.

- [ ] **Step 1: Write the failing test**

Create `components/sections/PortfolioTeaser.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioTeaser } from './PortfolioTeaser';

describe('PortfolioTeaser', () => {
  it('renders exactly 7 teaser photos', () => {
    render(<PortfolioTeaser locale="ru" />);
    expect(screen.getAllByRole('img')).toHaveLength(7);
  });

  it('links "view all" to the RU gallery', () => {
    render(<PortfolioTeaser locale="ru" />);
    expect(screen.getByRole('link', { name: 'Смотреть всё портфолио' }).getAttribute('href')).toBe('/gallery');
  });

  it('links "view all" to the EN gallery', () => {
    render(<PortfolioTeaser locale="en" />);
    expect(screen.getByRole('link', { name: 'View the full portfolio' }).getAttribute('href')).toBe(
      '/en/gallery'
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/sections/PortfolioTeaser.test.tsx`
Expected: FAIL — `./PortfolioTeaser` does not exist.

- [ ] **Step 3: Implement `PortfolioTeaser`**

Create `components/sections/PortfolioTeaser.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { photos, teaserSlugs, type Photo } from '@/data/photos';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { RevealImage } from '@/components/ui/RevealImage';

export function PortfolioTeaser({ locale }: { locale: Locale }) {
  const c = content[locale];
  const base = locale === 'ru' ? '' : '/en';
  const teaserPhotos = teaserSlugs
    .map((slug) => photos.find((p) => p.slug === slug))
    .filter((p): p is Photo => Boolean(p));

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SplitHeading as="h2" className="font-display text-4xl">
          {c.portfolioTeaser.heading}
        </SplitHeading>
        <MagneticButton href={`${base}/gallery`}>{c.portfolioTeaser.viewAll}</MagneticButton>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {teaserPhotos.map((photo) => (
          <RevealImage
            key={photo.slug}
            src={`/photos/${photo.category}/${photo.slug}.jpg`}
            alt={photo.alt[locale]}
            width={photo.width}
            height={photo.height}
            className="aspect-[3/4] w-full"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- components/sections/PortfolioTeaser.test.tsx`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add PortfolioTeaser section"
```

---

## Task 13: Assemble the landing and gallery pages, add E2E smoke tests

**Files:**
- Create: `components/gallery/GallerySection.tsx`, `components/gallery/GallerySection.test.tsx`
- Modify: `app/[locale]/page.tsx` (replace the Task 4 placeholder with the real section stack)
- Modify: `app/[locale]/gallery/page.tsx` (replace the Task 4 placeholder with `GallerySection`)
- Create: `e2e/landing.spec.ts`
- Create: `e2e/gallery.spec.ts`
- Delete: `e2e/.gitkeep`

**Interfaces:**
- Consumes: `GalleryGrid`, `Lightbox` (Task 10/11), `Hero`, `About`, `PortfolioTeaser`, `Services`, `Pricing` (Tasks 8/9/12), `content`, `photos` (Task 2/3).

- [ ] **Step 1: Write the failing test for `GallerySection`**

Create `components/gallery/GallerySection.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/useReducedMotion', () => ({ useReducedMotion: () => true }));

import { GallerySection } from './GallerySection';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'p2', category: 'portrait', sourceFile: 'p2.jpg', width: 720, height: 900, alt: { ru: 'Портрет 2', en: 'Portrait 2' } },
];

const filters = [
  { id: 'all' as const, label: 'Все' },
  { id: 'portrait' as const, label: 'Портрет' },
];

describe('GallerySection', () => {
  it('opens the lightbox on the clicked photo', async () => {
    render(<GallerySection photos={photos} filters={filters} locale="ru" />);
    await userEvent.click(screen.getByAltText('Портрет 2'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByAltText('Портрет 2')).toHaveLength(2); // grid thumbnail + lightbox
  });

  it('closes the lightbox', async () => {
    render(<GallerySection photos={photos} filters={filters} locale="ru" />);
    await userEvent.click(screen.getByAltText('Портрет 1'));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/gallery/GallerySection.test.tsx`
Expected: FAIL — `./GallerySection` does not exist.

- [ ] **Step 3: Implement `GallerySection`**

Create `components/gallery/GallerySection.tsx`:

```tsx
'use client';

import { useState } from 'react';
import type { Photo, PhotoCategory } from '@/data/photos';
import type { Locale } from '@/content';
import { GalleryGrid } from './GalleryGrid';
import { Lightbox } from './Lightbox';

export function GallerySection({
  photos,
  filters,
  locale,
}: {
  photos: Photo[];
  filters: { id: 'all' | PhotoCategory; label: string }[];
  locale: Locale;
}) {
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  return (
    <>
      <GalleryGrid
        photos={photos}
        filters={filters}
        locale={locale}
        onPhotoClick={(photo, visiblePhotos) =>
          setLightbox({
            photos: visiblePhotos,
            index: visiblePhotos.findIndex((p) => p.slug === photo.slug),
          })
        }
      />
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          locale={locale}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((state) => (state ? { ...state, index } : state))}
        />
      )}
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- components/gallery/GallerySection.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Assemble the landing page**

Replace the contents of `app/[locale]/page.tsx`:

```tsx
import type { Locale } from '@/content';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { PortfolioTeaser } from '@/components/sections/PortfolioTeaser';
import { Services } from '@/components/sections/Services';
import { Pricing } from '@/components/sections/Pricing';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <Hero locale={locale} />
      <About locale={locale} />
      <PortfolioTeaser locale={locale} />
      <Services locale={locale} />
      <Pricing locale={locale} />
    </main>
  );
}
```

- [ ] **Step 6: Assemble the gallery page**

Replace the contents of `app/[locale]/gallery/page.tsx`:

```tsx
import { content, type Locale } from '@/content';
import { photos } from '@/data/photos';
import { GallerySection } from '@/components/gallery/GallerySection';

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];

  return (
    <main className="px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl">{c.gallery.heading}</h1>
      <div className="mt-10">
        <GallerySection photos={photos} filters={c.gallery.filters} locale={locale} />
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Run the full Vitest suite and the build**

Run: `npm test && npm run build`
Expected: every suite passes; build succeeds and prints 4 generated routes (`/ru`, `/ru/gallery`, `/en`, `/en/gallery`).

- [ ] **Step 8: Write the landing E2E smoke test**

Delete `e2e/.gitkeep`. Create `e2e/landing.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('RU landing shows the hero name and a working Telegram CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Ирина Полянская');
  await expect(page.getByRole('link', { name: 'Записаться на съёмку' })).toHaveAttribute(
    'href',
    /t\.me\/polka977/
  );
});

test('EN landing shows English copy', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('Irina Polyanskaya');
  await expect(page.getByRole('link', { name: 'Book a session' }).first()).toBeVisible();
});

test('language switcher moves from RU to EN and back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Switch language' }).click();
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole('link', { name: 'Switch language' }).click();
  await expect(page).toHaveURL(/\/$/);
});
```

- [ ] **Step 9: Write the gallery E2E smoke test**

Create `e2e/gallery.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('gallery filters narrow the visible photos', async ({ page }) => {
  await page.goto('/gallery');
  const allCount = await page.locator('main img').count();
  await page.getByRole('tab', { name: 'Портрет' }).click();
  const portraitCount = await page.locator('main img').count();
  expect(portraitCount).toBeGreaterThan(0);
  expect(portraitCount).toBeLessThan(allCount);
});

test('clicking a photo opens the lightbox and Escape closes it', async ({ page }) => {
  await page.goto('/gallery');
  await page.locator('main img').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
```

- [ ] **Step 10: Run the E2E suite**

Run: `npm run test:e2e`
Expected: 5 tests pass (Playwright builds and starts the app itself per `webServer` in `playwright.config.ts`).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Assemble landing and gallery pages; add E2E smoke tests"
```

---

## Task 14: Favicon, OG image, lint, and README

**Files:**
- Create: `app/icon.svg`
- Create: `app/[locale]/opengraph-image.tsx`
- Create: `README.md`
- Modify: none (verification-only step for lint)

**Interfaces:**
- Consumes: `content` (Task 3) for the OG image text.

- [ ] **Step 1: Add the typographic favicon**

Create `app/icon.svg`:

```svg
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#F6F1E9"/>
  <text x="32" y="42" font-family="Georgia, serif" font-size="28" fill="#7A2331" text-anchor="middle">IP</text>
</svg>
```

Remove the unused `create-next-app` default `app/favicon.ico` if it still exists: `rm -f app/favicon.ico`.

- [ ] **Step 2: Add a locale-aware Open Graph image**

Create `app/[locale]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';
import { content, type Locale } from '@/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const c = content[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F6F1E9',
          color: '#1B1714',
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 4, color: '#7A2331', textTransform: 'uppercase' }}>
          {c.hero.kicker}
        </div>
        <div style={{ fontSize: 72, marginTop: 20 }}>{c.hero.name}</div>
        <div style={{ fontSize: 28, marginTop: 20, maxWidth: 800, textAlign: 'center', color: '#1B171499' }}>
          {c.hero.subhead}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: Run lint, the full test suite, and the build**

Run: `npm run lint`
Expected: no errors (warnings about unused vars, if any, should be fixed before continuing).

Run: `npm test`
Expected: every Vitest suite passes.

Run: `npm run build`
Expected: build succeeds; output lists `/ru`, `/ru/gallery`, `/en`, `/en/gallery` plus the two OG image routes.

- [ ] **Step 4: Write the README**

Create `README.md`:

```markdown
# Irina Polyanskaya — Photography Portfolio

Bilingual (RU/EN) portfolio and business-card site for photographer Irina Polyanskaya (Gyumri, Armenia).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, Flip, SplitText) · Lenis

## Development

\`\`\`bash
npm install
npm run copy-photos   # copies source photos from assets/ into public/photos/ (run once, or after editing data/photos.ts)
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm test           # Vitest unit/component tests
npm run test:e2e   # Playwright end-to-end smoke tests (builds and serves the app itself)
\`\`\`

## Routes

- `/` — RU landing
- `/gallery` — RU gallery (rewritten from the internal `/ru` and `/ru/gallery` routes)
- `/en` — EN landing
- `/en/gallery` — EN gallery

## Content

- All copy lives in `content/ru.ts` and `content/en.ts` (typed by `content/types.ts`).
- All photo metadata (category, dimensions, bilingual alt text) lives in `data/photos.ts`.
- Source photos live in `assets/source-photos` and `assets/source-about` — never edited directly. Run `npm run copy-photos` to (re)populate `public/photos/`.

## Deployment

Deployed to Vercel from the `main` branch of `github.com/w1ha1/irina-polyanskaya`. See `docs/superpowers/specs/2026-07-21-irina-polyanskaya-portfolio-design.md` for the design spec and `docs/superpowers/plans/2026-07-21-irina-polyanskaya-site.md` for the implementation plan.
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add favicon, Open Graph image, lint fixes, and README"
```

---

## Task 15: Deploy to Vercel

**Files:** none (deployment/configuration step, no code changes expected unless the build step below surfaces a fix).

This task requires interactive access to a Vercel account, which an autonomous agent does not have — perform it manually (or hand these exact steps to whoever has the account).

- [ ] **Step 1: Push the finished branch**

Run: `git push origin main`
Expected: the already-connected `origin` remote (`https://github.com/w1ha1/irina-polyanskaya`, set up when the project folder was created) receives all commits from Tasks 1–14.

- [ ] **Step 2: Import the repository into Vercel**

In the Vercel dashboard: **Add New → Project → Import Git Repository**, select `w1ha1/irina-polyanskaya`. Vercel auto-detects the Next.js framework preset — leave build command (`next build`) and output settings at their defaults. No environment variables are required (no backend, no API keys). Click **Deploy**.

- [ ] **Step 3: Verify the live deployment**

Once the deployment finishes, open the generated `https://irina-polyanskaya-*.vercel.app` URL and check:
- `/` renders the RU landing page with the hero photo visible.
- `/en` renders the EN landing page.
- `/gallery` and `/en/gallery` render the full photo grid; clicking a photo opens the lightbox.
- The "Записаться"/"Book a session" buttons open Telegram with the prefilled message.
- The Instagram link opens `instagram.com/polyanskaya_photo7`.

- [ ] **Step 4: (Optional, out of scope for this plan) attach a custom domain**

Per the spec's non-goals, no custom domain purchase/setup is part of this plan. If Irina later buys a domain, attach it under the Vercel project's **Settings → Domains** — no code changes are needed for this.

---
