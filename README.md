# Irina Polyanskaya — Photography Portfolio

Bilingual (RU/EN) portfolio and business-card site for photographer Irina Polyanskaya (Gyumri, Armenia).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, Flip, SplitText) · Lenis

## Development

```bash
npm install
npm run copy-photos   # copies source photos from assets/ into public/photos/ (run once, or after editing data/photos.ts)
npm run dev
```

## Testing

```bash
npm test           # Vitest unit/component tests
npm run test:e2e   # Playwright end-to-end smoke tests (builds and serves the app itself)
```

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
