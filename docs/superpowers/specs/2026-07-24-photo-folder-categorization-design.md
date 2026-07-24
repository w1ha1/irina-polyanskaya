# Folder-driven photo categorization

## Problem

Every photo's category, slug, width/height, and alt text currently live in one
hand-maintained array in `data/photos.ts`. Adding, re-categorizing, or removing
a photo means editing TypeScript by hand, which is error-prone (several past
bugs traced back to hand-typed width/height) and doesn't match how the site
owner actually wants to work: drag a file into the right bucket and be done.

## Goal

Photo category is decided by which folder a source file lives in, not by code.
An empty category folder means that category simply doesn't appear on the
site. New categories (e.g. a future "commercial" bucket) should work by
creating a folder and dropping files in — no code changes required to
function, though a nicer localized filter label is a one-line opt-in.

`fashion-night` is explicitly out of scope for this change and keeps working
exactly as it does today (hand-written entries in `data/photos.ts`, source
files flat in `assets/source-photos/`). Only `portrait` and `love-story` move
to the new folder-driven system in this pass.

## Folder structure

```
assets/source-photos/
  portrait/       <- any file here = a portrait photo
  love-story/     <- any file here = a love-story photo
  <loose files>   <- ignored by the new system: today this is the 20
                     fashion-night originals (untouched) plus anything
                     genuinely unsorted
```

Any other subdirectory created later under `assets/source-photos/` (e.g.
`commercial/`) is picked up the same way, automatically — the scan is
generic, not hardcoded to these two names.

## Slugs

- Slug prefix defaults to the folder name (`commercial/` → `commercial-01`,
  `commercial-02`, ...). One legacy exception: `love-story/` uses prefix
  `love` (matching today's `love-01`..`love-32`), recorded in a small
  `slugPrefixOverrides` map so the migration doesn't have to renumber
  existing slugs.
- On each `npm run copy-photos` run, the script lists a category folder
  alphabetically. A file already named `<prefix>-<number>.<ext>` keeps that
  slug. Any other filename is new — it gets the next unused number for that
  prefix and is **renamed in place** on disk to `<prefix>-<number>.<ext>`.
  Once assigned, a slug is permanent: adding or removing other files later
  never renumbers it.
- Practical effect: dropping a new file into `portrait/` and running the
  script is the entire authoring step. The folder alone decides the
  category; the script never guesses or infers it.

## Width/height

Computed automatically from `sharp(...).toFile()`'s return value (after any
rotate/trim) for every folder-scanned photo, instead of being hand-typed.
`fashion-night` is unaffected — its dimensions stay hand-written as today.

## Rotate/trim exceptions

`rotateOnCopy` / `trimOnCopy` (keyed by slug, already in `data/photos.ts`)
keep their current entries unchanged and are now consulted by both the
hardcoded `fashion-night` path and the new folder-scan path.

## Alt text

- The 43 existing hand-written descriptions for today's portrait/love-story
  photos are preserved verbatim via a new `altOverrides` map (keyed by slug)
  in `data/photos.ts`, prefilled during migration. Nothing is lost.
- A future new photo with no override falls back to its category's
  localized label (e.g. "Портрет" / "Portrait") from `data/categoryLabels.ts`
  — never empty, but not a full description until one is added by hand.
- `fashion-night` is unaffected — its alt text stays inline on its
  hand-written entries exactly as today.

## Category labels & filter visibility

- New `data/categoryLabels.ts`: single source of truth for known categories'
  display text in both languages, in preferred display order:
  ```ts
  export const categoryLabels: Record<string, { ru: string; en: string }> = {
    portrait: { ru: 'Портрет', en: 'Portrait' },
    'love-story': { ru: 'Love story', en: 'Love story' },
    'fashion-night': { ru: 'Фэшн/Ночная съёмка', en: 'Fashion/Night' },
  };
  ```
  Consumed by `copy-photos.mjs` (alt fallback) and by the gallery page
  (filter pill labels). A category not listed here still works — its filter
  pill falls back to showing the raw folder/category id as the label.
- `content.gallery.filters` (today a static per-locale array listing all 3
  categories) is removed. `content.gallery` keeps only `heading` and a new
  `allLabel` ("Все" / "All"). The actual filter pill list — which categories
  to show, in what order, with what label — is computed at render time by a
  new pure helper `lib/galleryFilters.ts`, from the live `photos` array:
  known categories first (in `categoryLabels` key order), then any unknown
  ones alphabetically, only including a category that has ≥1 photo.
- `PhotoCategory` widens from the fixed union `'portrait' | 'love-story' |
  'fashion-night'` to `string` throughout (`filterPhotos.ts`, `GalleryGrid`,
  `CategoryFilter`, `content/types.ts`), since categories are no longer a
  closed set known at compile time.

## Data flow

```
data/photos.ts
  fashionNightPhotos   (hand-written, unchanged, 20 entries)
  + generatedPhotos     (from data/photos.generated.ts, written by the script)
  = photos              (same shape/shape of exports as today: photos,
                          heroPhoto, teaserSlugs, aboutPhoto)
```

`data/photos.generated.ts` is machine-written by `scripts/copy-photos.mjs`
(header comment marks it as generated) and committed like `public/photos/**`
already is — Netlify's build doesn't run the copy script, so both the
processed images and the generated data file have to be checked in for the
live site to reflect them. (Not this session's concern per the "work
locally, I'll push" instruction — noted here for when it matters.)

## Migration

The 11 portrait + 32 love-story source files move from the flat
`assets/source-photos/` root into their category subfolders, **renamed to
their exact current slug** (`portrait-01.jpg`, `love-14.jpg`, ...) via `git
mv`. This means `heroPhoto` (`love-14`), `teaserSlugs`, and all existing
alt text keep resolving to the same photos with zero behavior change — the
migration is a pure refactor, not a content change. `data/photos.test.ts`'s
existing counts (63 total, 20/32/11 per category) should pass unchanged and
serve as the regression check that nothing was lost or miscounted.

## Testing

- `data/photos.test.ts` — unchanged assertions must keep passing (proves the
  migration preserved every photo).
- New `lib/galleryFilters.ts` + test: only-present categories show, an empty
  category is hidden, an unlisted category id falls back to its raw id as
  the label, known categories keep their preferred order.
- `content/content.test.ts`'s `gallery filters are all and the 3 real
  categories` test is removed (filters no longer live in content); an
  equivalent assertion moves to cover `data/categoryLabels.ts` instead.
- No automated test for `copy-photos.mjs` itself (it's a standalone script
  with no existing test coverage, run against real image fixtures) —
  verified by actually running it against the real photo set and checking
  the result (test suite, lint, build, and a visual pass).

## Out of scope (explicitly not doing here)

- `fashion-night` does not move to folder-driven categorization.
- No change to how `heroPhoto` / `teaserSlugs` are chosen (still hand-pinned
  by slug in `data/photos.ts`).
- No git commit or push — all changes stay in the working tree.
