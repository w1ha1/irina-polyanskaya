# Folder-Driven Photo Categorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `portrait` and `love-story` photo categories folder-driven — which category folder a source file lives in decides its category, slug, and (auto-computed) dimensions, so the site owner can add/re-sort photos by moving files instead of editing code.

**Architecture:** `scripts/copy-photos.mjs` gains a generic scan of any subdirectory under `assets/source-photos/`, assigns stable auto-incrementing slugs to new files (renaming them in place), computes width/height via `sharp`, and writes the result to a machine-generated `data/photos.generated.ts`. `data/photos.ts` merges that with a hand-written `fashionNightPhotos` array (unchanged, untouched by this migration) into the same `photos` export the rest of the app already consumes. The gallery page computes its filter pills at render time from whichever categories actually have photos, instead of a static hardcoded list.

**Tech Stack:** Next.js 16 (App Router), TypeScript, sharp, vitest, existing repo conventions.

## Global Constraints

- `fashion-night` is explicitly out of scope: stays hand-written in `data/photos.ts`, stays flat in `assets/source-photos/`, no behavior change.
- The migration must preserve every existing slug exactly (`love-14`, `portrait-09`, etc.) — `heroPhoto`, `teaserSlugs`, and all 43 alt-text entries must keep resolving to the same photos with zero content change.
- No git commit and no git push during this work — every change stays in the working tree for the user to review and commit/push personally.
- Category display labels live in one place: `data/categoryLabels.ts` (ru/en), consumed by both the copy script (alt fallback) and the gallery page (filter labels).
- `PhotoCategory` widens from a fixed 3-value union to `string` — categories are no longer a closed set known at compile time.

---

### Task 1: Category labels module

**Files:**
- Create: `data/categoryLabels.ts`
- Test: `data/categoryLabels.test.ts`

**Interfaces:**
- Produces: `categoryLabels: Record<string, { ru: string; en: string }>`, keyed by category id, in preferred display order (`portrait`, `love-story`, `fashion-night`).

- [ ] **Step 1: Write the failing test**

Create `data/categoryLabels.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { categoryLabels } from './categoryLabels';

describe('categoryLabels', () => {
  it('has the 3 known categories, in display order, with non-empty ru and en labels', () => {
    expect(Object.keys(categoryLabels)).toEqual(['portrait', 'love-story', 'fashion-night']);
    for (const id of Object.keys(categoryLabels)) {
      expect(categoryLabels[id].ru.length).toBeGreaterThan(0);
      expect(categoryLabels[id].en.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- data/categoryLabels.test.ts`
Expected: FAIL — `data/categoryLabels` cannot be found.

- [ ] **Step 3: Write the module**

Create `data/categoryLabels.ts`:

```ts
/**
 * Single source of truth for a category's display text, in both languages.
 * Order here is the preferred display order for filter pills. A category id
 * not listed here (a brand new folder under assets/source-photos/) still
 * works everywhere — it just falls back to showing its raw id as the label
 * until a nicer translation is added here.
 */
export const categoryLabels: Record<string, { ru: string; en: string }> = {
  portrait: { ru: 'Портрет', en: 'Portrait' },
  'love-story': { ru: 'Love story', en: 'Love story' },
  'fashion-night': { ru: 'Фэшн/Ночная съёмка', en: 'Fashion/Night' },
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- data/categoryLabels.test.ts`
Expected: PASS

---

### Task 2: Gallery filter builder

**Files:**
- Create: `lib/galleryFilters.ts`
- Test: `lib/galleryFilters.test.ts`

**Interfaces:**
- Consumes: `Photo` type from `@/data/photos` (`{ slug, category, sourceFile, width, height, alt: { ru, en } }` — unchanged shape); `categoryLabels` shape from Task 1 (`Record<string, { ru: string; en: string }>`).
- Produces: `buildGalleryFilters(photos: Photo[], categoryLabels: Record<string, {ru:string; en:string}>, allLabel: string, locale: 'ru' | 'en'): { id: string; label: string }[]`

- [ ] **Step 1: Write the failing test**

Create `lib/galleryFilters.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildGalleryFilters } from './galleryFilters';
import type { Photo } from '@/data/photos';

function photo(slug: string, category: string): Photo {
  return {
    slug,
    category,
    sourceFile: `${slug}.jpg`,
    width: 100,
    height: 100,
    alt: { ru: slug, en: slug },
  };
}

const labels = {
  portrait: { ru: 'Портрет', en: 'Portrait' },
  'love-story': { ru: 'Love story', en: 'Love story' },
  'fashion-night': { ru: 'Фэшн/Ночная съёмка', en: 'Fashion/Night' },
};

describe('buildGalleryFilters', () => {
  it('always puts "all" first', () => {
    const filters = buildGalleryFilters([photo('p-01', 'portrait')], labels, 'Все', 'ru');
    expect(filters[0]).toEqual({ id: 'all', label: 'Все' });
  });

  it('only includes categories that have at least one photo', () => {
    const filters = buildGalleryFilters([photo('p-01', 'portrait')], labels, 'Все', 'ru');
    expect(filters.map((f) => f.id)).toEqual(['all', 'portrait']);
  });

  it('hides a category once it has zero photos', () => {
    const filters = buildGalleryFilters([photo('f-01', 'fashion-night')], labels, 'Все', 'ru');
    const ids = filters.map((f) => f.id);
    expect(ids).not.toContain('portrait');
    expect(ids).not.toContain('love-story');
  });

  it('orders known categories the same way regardless of photo order', () => {
    const photos = [photo('f-01', 'fashion-night'), photo('l-01', 'love-story'), photo('p-01', 'portrait')];
    const filters = buildGalleryFilters(photos, labels, 'Все', 'ru');
    expect(filters.map((f) => f.id)).toEqual(['all', 'portrait', 'love-story', 'fashion-night']);
  });

  it('falls back to the raw id as the label for an unlisted category', () => {
    const filters = buildGalleryFilters([photo('c-01', 'commercial')], labels, 'Все', 'ru');
    expect(filters).toContainEqual({ id: 'commercial', label: 'commercial' });
  });

  it('uses the requested locale for known labels', () => {
    const filters = buildGalleryFilters([photo('p-01', 'portrait')], labels, 'All', 'en');
    expect(filters).toContainEqual({ id: 'portrait', label: 'Portrait' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- lib/galleryFilters.test.ts`
Expected: FAIL — `./galleryFilters` cannot be found.

- [ ] **Step 3: Write the implementation**

Create `lib/galleryFilters.ts`:

```ts
import type { Photo } from '@/data/photos';

export function buildGalleryFilters(
  photos: Photo[],
  categoryLabels: Record<string, { ru: string; en: string }>,
  allLabel: string,
  locale: 'ru' | 'en'
): { id: string; label: string }[] {
  const present = new Set(photos.map((p) => p.category));
  const knownIds = Object.keys(categoryLabels).filter((id) => present.has(id));
  const unknownIds = [...present].filter((id) => !(id in categoryLabels)).sort();
  const categoryFilters = [...knownIds, ...unknownIds].map((id) => ({
    id,
    label: categoryLabels[id]?.[locale] ?? id,
  }));
  return [{ id: 'all', label: allLabel }, ...categoryFilters];
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- lib/galleryFilters.test.ts`
Expected: PASS (all 6 assertions)

---

### Task 3: Rewire the photo data pipeline (script + data + physical migration)

This is one task because its three parts (data shape, script logic, physical
file moves) are only meaningful together — splitting them would create
checkpoints where the build doesn't actually work. The task starts and ends
green; it's briefly red in the middle by design (see Step 4).

**Files:**
- Modify: `data/photos.ts`
- Create: `data/photos.generated.ts` (placeholder in Step 3, overwritten for real in Step 7)
- Modify: `scripts/copy-photos.mjs`
- Move (via `git mv`): 43 files from `assets/source-photos/` into `assets/source-photos/portrait/` and `assets/source-photos/love-story/`

**Interfaces:**
- Produces: `data/photos.ts` keeps exporting `photos`, `heroPhoto`, `teaserSlugs`, `aboutPhoto`, `rotateOnCopy`, `trimOnCopy` exactly as before (same names, same shapes) — nothing downstream (`filterPhotos.ts`, `GalleryGrid.tsx`, `Lightbox.tsx`, `Hero.tsx`, `PortfolioTeaser.tsx`) needs to change. Also newly exports `fashionNightPhotos`, `slugPrefixOverrides`, `altOverrides` for `scripts/copy-photos.mjs` to consume.
- Consumes: `categoryLabels` from Task 1 (script's alt fallback).

- [ ] **Step 1: Confirm the baseline is green**

Run: `npm test -- data/photos.test.ts`
Expected: PASS (63 total photos; 20/32/11 per category) — this is the safety net for the whole task.

- [ ] **Step 2: Rewrite `data/photos.ts`**

Replace the entire file with:

```ts
import { generatedPhotos } from './photos.generated';

export type PhotoCategory = string;

export interface Photo {
  slug: string;
  category: PhotoCategory;
  sourceFile: string;
  width: number;
  height: number;
  alt: { ru: string; en: string };
}

// fashion-night stays hand-written and untouched — out of scope for the
// folder-driven system (see docs/superpowers/specs/2026-07-24-photo-folder-categorization-design.md).
export const fashionNightPhotos: Photo[] = [
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
];

export const photos: Photo[] = [...fashionNightPhotos, ...generatedPhotos];

export const heroPhoto: Photo = photos.find((p) => p.slug === 'love-14')!;

export const teaserSlugs: string[] = [
  'fashion-16',
  'fashion-10',
  'love-19',
  'love-21',
  'love-11',
  'portrait-09',
  'portrait-10',
  'fashion-19',
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

/**
 * Two source files (portrait-02, portrait-08) are physically rotated 90° in the
 * original export — no EXIF orientation flag, the pixel data itself is sideways.
 * copy-photos.mjs rotates these two slugs 90° clockwise when copying into public/.
 */
export const rotateOnCopy: Record<string, number> = {
  'portrait-02': 90,
  'portrait-08': 90,
};

/**
 * These 4 source files are single (non-collage) photos with a solid white
 * matte baked in around the frame (an Instagram export artifact, not an
 * intentional collage border like the multi-panel "Коллаж" photos have).
 * copy-photos.mjs trims it off when copying into public/.
 */
export const trimOnCopy = new Set(['love-21', 'love-22', 'portrait-04', 'portrait-05']);

/**
 * A folder's slug prefix defaults to its own name (e.g. a future
 * `commercial/` folder gets `commercial-01`, `commercial-02`, ...).
 * love-story is the one recorded exception: its slugs (love-01..love-32)
 * predate the folder system and use prefix "love", not "love-story".
 */
export const slugPrefixOverrides: Record<string, string> = {
  'love-story': 'love',
};

/**
 * Hand-written alt text for folder-scanned photos, keyed by slug. Alt text
 * can't be derived from a filename or folder, so it's recorded here instead
 * of in the generated file. A slug with no entry falls back to its
 * category's label (data/categoryLabels.ts) when copy-photos.mjs generates
 * data/photos.generated.ts.
 */
export const altOverrides: Record<string, { ru: string; en: string }> = {
  'love-01': { ru: 'Чёрно-белый коллаж: пара среди книжных стеллажей библиотеки', en: 'Black-and-white collage: a couple among library bookshelves' },
  'love-02': { ru: 'Чёрно-белое фото пары в проходе между книжными полками', en: 'Black-and-white photo of a couple in a library aisle' },
  'love-03': { ru: 'Чёрно-белые крупные объятия пары в библиотеке', en: 'Black-and-white close embrace of a couple in a library' },
  'love-04': { ru: 'Пара смеётся среди книжных полок, цветное фото', en: 'A couple laughing among bookshelves, color photo' },
  'love-05': { ru: 'Пара смеётся в библиотеке, тёплый свет', en: 'A couple laughing in a library, warm light' },
  'love-06': { ru: 'Коллаж: пара у книжных полок и чёрно-белые объятия в библиотеке', en: 'Collage: a couple by the bookshelves and a black-and-white embrace in the library' },
  'love-07': { ru: 'Чёрно-белое крепкое объятие пары', en: 'Black-and-white close embrace of a couple' },
  'love-08': { ru: 'Чёрно-белая пара в проходе библиотеки среди книг', en: 'Black-and-white couple in a library aisle among books' },
  'love-09': { ru: 'Пара в библиотеке у зелёной лестницы, цветное фото', en: 'A couple in a library by a green ladder, color photo' },
  'love-10': { ru: 'Пара обнимается в оранжерее среди белых роз, смазанный кадр движения', en: 'A couple embracing in a rose greenhouse, motion-blurred frame' },
  'love-11': { ru: 'Пара на капоте винтажного красного автомобиля в туманном поле', en: 'A couple on the hood of a vintage red car in a foggy field' },
  'love-12': { ru: 'Коллаж: пара и винтажный автомобиль в туманном поле', en: 'Collage: a couple and a vintage car in a foggy field' },
  'love-13': { ru: 'Коллаж: пара в машине под дождём, стекло в каплях', en: 'Collage: a couple in a car in the rain, raindrops on the glass' },
  'love-14': { ru: 'Пара идёт по полю рядом с красным автомобилем', en: 'A couple walking through a field beside a red car' },
  'love-15': { ru: 'Красный винтажный автомобиль в туманном поле, мужчина вдалеке', en: 'A red vintage car in a foggy field, a man in the distance' },
  'love-16': { ru: 'Коллаж: девушка одна и пара на капоте автомобиля', en: 'Collage: a woman alone and a couple on the car hood' },
  'love-17': { ru: 'Коллаж: пара держится за руки в поле, ветер треплет волосы', en: "Collage: a couple holding hands in a field, wind in their hair" },
  'love-18': { ru: 'Пара касается лбами в поле, пасмурное небо', en: 'A couple touching foreheads in a field, overcast sky' },
  'love-19': { ru: 'Пара в оранжерее: мужчина держится за опору, женщина смеётся среди роз', en: 'A couple in a greenhouse: the man holds on to a support post, the woman laughs among the roses' },
  'love-20': { ru: 'Пара касается носами в поле, пасмурное небо, цветное фото', en: 'A couple touching noses in a field, overcast sky, color photo' },
  'love-21': { ru: 'Сцепленные руки пары через окно машины под дождём', en: "A couple's clasped hands through a rain-streaked car window" },
  'love-22': { ru: 'Деталь: жемчужное колье среди розовых кустов', en: 'Detail: a pearl necklace among rose bushes' },
  'love-23': { ru: 'Чёрно-белое фото пары в теплице', en: 'Black-and-white photo of a couple in a greenhouse' },
  'love-24': { ru: 'Коллаж: отдых среди роз, деталь книги, поцелуй в листве', en: 'Collage: resting among roses, a book detail, a kiss in the leaves' },
  'love-25': { ru: 'Пара в теплице: мужчина целует девушку в красном платье и меховой накидке среди роз', en: 'A couple in the greenhouse: a man kisses a woman in a red dress and fur wrap among roses' },
  'love-26': { ru: 'Коллаж: девушка одна среди роз и вид вдоль ряда теплицы', en: 'Collage: a woman alone among roses and a view down the greenhouse row' },
  'love-27': { ru: 'Коллаж: пара с розой в теплице, романтичный поцелуй', en: 'Collage: a couple with a rose in the greenhouse, a romantic kiss' },
  'love-28': { ru: 'Чёрно-белый нежный кадр двух силуэтов среди тёмной зелени', en: 'Black-and-white tender frame of two silhouettes among dark greenery' },
  'love-29': { ru: 'Коллаж: пара пьёт колу в машине, цветной и чёрно-белый кадр', en: 'Collage: a couple drinking Coca-Cola in a car, a color and a black-and-white frame' },
  'love-30': { ru: 'Деталь: спина девушки с красной лямкой платья и жемчужным колье среди роз', en: "Detail: a woman's back with a red dress strap and a pearl necklace among roses" },
  'love-31': { ru: 'Пара целуется среди листвы и роз в оранжерее', en: 'A couple kissing among foliage and roses in the greenhouse' },
  'love-32': { ru: 'Коллаж: пара среди роз в теплице, включая смазанный кадр в движении', en: 'Collage: a couple among roses in the greenhouse, including a motion-blurred frame' },
  'portrait-01': { ru: 'Крупный план рук, листающих старую книгу, тёплый свет', en: 'Close-up of hands turning pages of an old book, warm light' },
  'portrait-02': { ru: 'Мужчина крупным планом, на фоне размыто — женщина у автомобиля в горах', en: 'Close-up of a man, with a woman by a car in the mountains blurred in the background' },
  'portrait-03': { ru: 'Коллаж: мужчина у стены в тёплом свете, блик радуги, деталь наручных часов, на ступенях', en: 'Collage: a man by a wall in warm light, a rainbow flare, a wristwatch detail, on the steps' },
  'portrait-04': { ru: 'Мужчина у туфовой стены с оконными проёмами', en: 'A man by a tuff-stone wall with window openings' },
  'portrait-05': { ru: 'Мужчина на лестнице заброшенной постройки среди зелени', en: 'A man on the stairs of an abandoned structure among greenery' },
  'portrait-06': { ru: 'Фасад церкви в Гюмри с фигурой вдалеке', en: 'A church façade in Gyumri with a figure in the distance' },
  'portrait-07': { ru: 'Коллаж: портрет мужчины у стены с чашкой кофе, тёплый свет', en: 'Collage: portrait of a man by a wall with a coffee cup, warm light' },
  'portrait-08': { ru: 'Чёрно-белый кадр арочного дверного портала', en: 'Black-and-white shot of an arched doorway portal' },
  'portrait-09': { ru: 'Портрет мужчины у резной арки, тёплый свет', en: 'Portrait of a man by a carved archway, warm light' },
  'portrait-10': { ru: 'Мужчина у резной деревянной двери, в полный рост', en: 'A man by a carved wooden door, full length' },
  'portrait-11': { ru: 'Мужчина, облокотившийся на деревянный столб у лестницы', en: 'A man leaning against a wooden post by the stairs' },
};
```

- [ ] **Step 3: Create a placeholder `data/photos.generated.ts`**

Create `data/photos.generated.ts` (real content is written by the script in Step 7 — this placeholder just keeps the project compiling until then):

```ts
// AUTO-GENERATED by `npm run copy-photos` — do not hand-edit.
// Source of truth is the folder layout under assets/source-photos/.
// See docs/superpowers/specs/2026-07-24-photo-folder-categorization-design.md
import type { Photo } from './photos';

export const generatedPhotos: Photo[] = [];
```

- [ ] **Step 4: Run the test to confirm the expected (intentional) red state**

Run: `npm test -- data/photos.test.ts`
Expected: FAIL — total photo count is 20 (not 63), `love-story`/`portrait` counts are 0. This is expected: the data is wired up but the folders are still empty because the physical migration (Step 6) and real script run (Step 7) haven't happened yet.

- [ ] **Step 5: Rewrite `scripts/copy-photos.mjs`**

Replace the entire file with:

```js
import { mkdir, readdir, rename } from 'node:fs/promises';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  fashionNightPhotos,
  aboutPhoto,
  rotateOnCopy,
  trimOnCopy,
  slugPrefixOverrides,
  altOverrides,
} from '../data/photos.ts';
import { categoryLabels } from '../data/categoryLabels.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const sourceDir = path.join(root, 'assets', 'source-photos');
const sourceAboutDir = path.join(root, 'assets', 'source-about');
const publicPhotosDir = path.join(root, 'public', 'photos');

const IMAGE_EXT = /\.(jpe?g|png)$/i;

async function copyOne(sourcePath, destPath, rotateDegrees, trim) {
  await mkdir(path.dirname(destPath), { recursive: true });
  let pipeline = sharp(sourcePath);
  const notes = [];
  if (rotateDegrees) {
    pipeline = pipeline.rotate(rotateDegrees);
    notes.push(`rotated ${rotateDegrees}°`);
  }
  if (trim) {
    pipeline = pipeline.trim();
    notes.push('trimmed white border');
  }
  const info = await pipeline.toFile(destPath);
  console.log(`copied ${path.relative(root, destPath)}${notes.length ? ` (${notes.join(', ')})` : ''}`);
  return { width: info.width, height: info.height };
}

async function processHardcodedPhotos(photoList) {
  for (const photo of photoList) {
    const src = path.join(sourceDir, photo.sourceFile);
    const dest = path.join(publicPhotosDir, photo.category, `${photo.slug}.jpg`);
    if (!existsSync(src)) throw new Error(`missing source file: ${src}`);
    await copyOne(src, dest, rotateOnCopy[photo.slug], trimOnCopy.has(photo.slug));
  }
}

async function listCategoryFolders() {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
}

async function scanCategoryFolder(categoryId) {
  const folderPath = path.join(sourceDir, categoryId);
  const prefix = slugPrefixOverrides[categoryId] ?? categoryId;
  const entries = (await readdir(folderPath)).filter((name) => IMAGE_EXT.test(name)).sort();

  const numberedPattern = new RegExp(`^${prefix}-(\\d+)\\.(jpe?g|png)$`, 'i');
  let nextNumber = 1;
  for (const name of entries) {
    const match = name.match(numberedPattern);
    if (match) nextNumber = Math.max(nextNumber, Number(match[1]) + 1);
  }

  const resolved = [];
  for (const name of entries) {
    const match = name.match(numberedPattern);
    if (match) {
      resolved.push({ slug: `${prefix}-${match[1]}`, fileName: name });
      continue;
    }
    const ext = path.extname(name).toLowerCase();
    const slug = `${prefix}-${String(nextNumber).padStart(2, '0')}`;
    const newName = `${slug}${ext}`;
    await rename(path.join(folderPath, name), path.join(folderPath, newName));
    console.log(`renamed ${categoryId}/${name} -> ${categoryId}/${newName}`);
    resolved.push({ slug, fileName: newName });
    nextNumber += 1;
  }

  const generated = [];
  for (const { slug, fileName } of resolved) {
    const src = path.join(folderPath, fileName);
    const dest = path.join(publicPhotosDir, categoryId, `${slug}.jpg`);
    const { width, height } = await copyOne(src, dest, rotateOnCopy[slug], trimOnCopy.has(slug));
    const fallback = categoryLabels[categoryId] ?? { ru: categoryId, en: categoryId };
    const alt = altOverrides[slug] ?? fallback;
    generated.push({ slug, category: categoryId, sourceFile: fileName, width, height, alt });
  }
  return generated;
}

function formatPhotoLiteral(photo) {
  const alt = `{ ru: ${JSON.stringify(photo.alt.ru)}, en: ${JSON.stringify(photo.alt.en)} }`;
  return `  { slug: ${JSON.stringify(photo.slug)}, category: ${JSON.stringify(photo.category)}, sourceFile: ${JSON.stringify(photo.sourceFile)}, width: ${photo.width}, height: ${photo.height}, alt: ${alt} },`;
}

function writeGeneratedFile(generated) {
  const header = `// AUTO-GENERATED by \`npm run copy-photos\` — do not hand-edit.
// Source of truth is the folder layout under assets/source-photos/.
// See docs/superpowers/specs/2026-07-24-photo-folder-categorization-design.md
import type { Photo } from './photos';

export const generatedPhotos: Photo[] = [
`;
  const body = generated.map(formatPhotoLiteral).join('\n');
  const footer = `\n];\n`;
  writeFileSync(path.join(root, 'data', 'photos.generated.ts'), header + body + footer);
  console.log(`wrote data/photos.generated.ts (${generated.length} photos)`);
}

await processHardcodedPhotos(fashionNightPhotos);

const categoryFolders = await listCategoryFolders();
const generatedPhotos = [];
for (const categoryId of categoryFolders) {
  generatedPhotos.push(...(await scanCategoryFolder(categoryId)));
}
writeGeneratedFile(generatedPhotos);

await copyOne(
  path.join(sourceAboutDir, aboutPhoto.sourceFile),
  path.join(publicPhotosDir, 'about', 'about-irina.jpg')
);

console.log(`Done: ${fashionNightPhotos.length + generatedPhotos.length} gallery photos + about copied.`);
```

- [ ] **Step 6: Physically migrate the 43 source files into category folders**

Run this from the project root — it moves each file to its category folder under its *existing* slug, so nothing renumbers:

```bash
mkdir -p assets/source-photos/portrait assets/source-photos/love-story

declare -A PORTRAIT=(
  [portrait-01]="SnapInsta.to_657360749_18013061471836533_807684231671720313_n.jpg"
  [portrait-02]="SnapInsta.to_681180916_18016284176836533_1248926197350596796_n.jpg"
  [portrait-03]="SnapInsta.to_749756064_18027194900836533_4093777991618701705_n.jpg"
  [portrait-04]="SnapInsta.to_750086049_18027194873836533_6795609942903314071_n.jpg"
  [portrait-05]="SnapInsta.to_750255781_18027195026836533_7800854702609093709_n.jpg"
  [portrait-06]="SnapInsta.to_750828779_18027194870836533_6194109473403876595_n.jpg"
  [portrait-07]="SnapInsta.to_752451353_18027194897836533_5579632822793879720_n.jpg"
  [portrait-08]="SnapInsta.to_753093095_18027194978836533_8226840323895672037_n.jpg"
  [portrait-09]="SnapInsta.to_753224968_18027194882836533_6796361134869352882_n.jpg"
  [portrait-10]="SnapInsta.to_753255037_18027194960836533_2427192636046982643_n.jpg"
  [portrait-11]="SnapInsta.to_753418340_18027194996836533_5475697382716152589_n.jpg"
)
for slug in "${!PORTRAIT[@]}"; do
  git mv "assets/source-photos/${PORTRAIT[$slug]}" "assets/source-photos/portrait/${slug}.jpg"
done

declare -A LOVE=(
  [love-01]="SnapInsta.to_656900870_18013061516836533_3224792205916951746_n.jpg"
  [love-02]="SnapInsta.to_657167545_18013061501836533_1051359062774219522_n.jpg"
  [love-03]="SnapInsta.to_657742216_18013061510836533_6707210603101989341_n.jpg"
  [love-04]="SnapInsta.to_657947202_18013061543836533_2187226408794195441_n.jpg"
  [love-05]="SnapInsta.to_658068849_18013061534836533_8175537410738637423_n.jpg"
  [love-06]="SnapInsta.to_658571333_18013061513836533_777481571487651401_n.jpg"
  [love-07]="SnapInsta.to_658663462_18013061525836533_4579139848462131194_n.jpg"
  [love-08]="SnapInsta.to_658781924_18013061552836533_3626260022621475761_n.jpg"
  [love-09]="SnapInsta.to_659768168_18013061486836533_23612251469581772_n.jpg"
  [love-10]="SnapInsta.to_671144576_18017189378836533_5126313645627150691_n.jpg"
  [love-11]="SnapInsta.to_671744417_18016284257836533_2406486800303437838_n.jpg"
  [love-12]="SnapInsta.to_681287093_18016284179836533_4295596013951556829_n.jpg"
  [love-13]="SnapInsta.to_681472755_18016284215836533_8821286431723770613_n.jpg"
  [love-14]="SnapInsta.to_682056497_18016284161836533_5147284798263578647_n.jpg"
  [love-15]="SnapInsta.to_682212785_18016284263836533_450005132832978116_n.jpg"
  [love-16]="SnapInsta.to_683675586_18016284242836533_6282242942333562559_n.jpg"
  [love-17]="SnapInsta.to_683689455_18016284230836533_4304468973816964802_n.jpg"
  [love-18]="SnapInsta.to_683762691_18016284233836533_5115990997648937136_n.jpg"
  [love-19]="SnapInsta.to_683766249_18017189375836533_6540760078989453481_n.jpg"
  [love-20]="SnapInsta.to_684111780_18016284194836533_6198651596713270895_n.jpg"
  [love-21]="SnapInsta.to_684843279_18016284212836533_4094334937703427035_n.jpg"
  [love-22]="SnapInsta.to_684855309_18017189345836533_2113241894251156481_n.jpg"
  [love-23]="SnapInsta.to_684946431_18017189402836533_4573255447170964092_n.jpg"
  [love-24]="SnapInsta.to_685386164_18017189405836533_175695731233902322_n.jpg"
  [love-25]="SnapInsta.to_685956641_18017189429836533_2687868010405871520_n.jpg"
  [love-26]="SnapInsta.to_687050582_18017189348836533_46706258812802475_n.jpg"
  [love-27]="SnapInsta.to_687284927_18017189387836533_3293444089339232783_n.jpg"
  [love-28]="SnapInsta.to_688888300_18017189414836533_4901679097801555144_n.jpg"
  [love-29]="SnapInsta.to_683894650_18016284197836533_7423984466739593885_n.jpg"
  [love-30]="SnapInsta.to_688833219_18017189330836533_4736488998158937883_n.jpg"
  [love-31]="SnapInsta.to_688886403_18017189327836533_3332075026162490702_n.jpg"
  [love-32]="SnapInsta.to_689064694_18017189360836533_4093826099256987331_n.jpg"
)
for slug in "${!LOVE[@]}"; do
  git mv "assets/source-photos/${LOVE[$slug]}" "assets/source-photos/love-story/${slug}.jpg"
done

git status --short assets/source-photos | wc -l
```

Expected: last command prints `43` (all 43 files show as renames in git status).

- [ ] **Step 7: Run the copy script for real**

Run: `npm run copy-photos`
Expected: console output copying 20 fashion-night files, then 11 portrait + 32 love-story files (no "renamed" lines — the migrated files already match the `<prefix>-<number>` pattern from Step 6), then `wrote data/photos.generated.ts (43 photos)`, then `Done: 63 gallery photos + about copied.`

- [ ] **Step 8: Run the test to confirm green again**

Run: `npm test -- data/photos.test.ts`
Expected: PASS — 63 total, 20/32/11 per category (identical to the Step 1 baseline).

---

### Task 4: Dynamic gallery filters wiring

**Files:**
- Modify: `content/types.ts`
- Modify: `content/ru.ts`
- Modify: `content/en.ts`
- Modify: `content/content.test.ts`
- Modify: `app/[locale]/gallery/page.tsx`

**Interfaces:**
- Consumes: `buildGalleryFilters` from Task 2, `categoryLabels` from Task 1, `photos` from Task 3.

- [ ] **Step 1: Narrow `SiteContent['gallery']` in `content/types.ts`**

Find:
```ts
  gallery: {
    heading: string;
    filters: { id: 'all' | 'portrait' | 'love-story' | 'fashion-night'; label: string }[];
  };
```
Replace with:
```ts
  gallery: {
    heading: string;
    allLabel: string;
  };
```

- [ ] **Step 2: Update `content/ru.ts`**

Find:
```ts
  gallery: {
    heading: 'Портфолио',
    filters: [
      { id: 'all', label: 'Все' },
      { id: 'portrait', label: 'Портрет' },
      { id: 'love-story', label: 'Love story' },
      { id: 'fashion-night', label: 'Фэшн/Ночная съёмка' },
    ],
  },
```
Replace with:
```ts
  gallery: {
    heading: 'Портфолио',
    allLabel: 'Все',
  },
```

- [ ] **Step 3: Update `content/en.ts`**

Find:
```ts
  gallery: {
    heading: 'Portfolio',
    filters: [
      { id: 'all', label: 'All' },
      { id: 'portrait', label: 'Portrait' },
      { id: 'love-story', label: 'Love story' },
      { id: 'fashion-night', label: 'Fashion/Night' },
    ],
  },
```
Replace with:
```ts
  gallery: {
    heading: 'Portfolio',
    allLabel: 'All',
  },
```

- [ ] **Step 4: Remove the now-obsolete filters test in `content/content.test.ts`**

Delete this block (filters no longer live in content — coverage for category labels lives in `data/categoryLabels.test.ts`, coverage for filter computation lives in `lib/galleryFilters.test.ts`):
```ts
  it('gallery filters are all and the 3 real categories', () => {
    const ids = content.ru.gallery.filters.map((f) => f.id);
    expect(ids).toEqual(['all', 'portrait', 'love-story', 'fashion-night']);
  });

```

- [ ] **Step 5: Wire `buildGalleryFilters` into the gallery page**

Replace `app/[locale]/gallery/page.tsx` with:

```tsx
import { content, type Locale } from '@/content';
import { photos } from '@/data/photos';
import { categoryLabels } from '@/data/categoryLabels';
import { buildGalleryFilters } from '@/lib/galleryFilters';
import { GallerySection } from '@/components/gallery/GallerySection';

// Only 'ru' | 'en' are produced by generateStaticParams in layout.tsx. Without
// this, Next's dynamicParams defaults to true and any other locale segment
// (e.g. /fr) would still render this page with an unsupported `locale`,
// throwing when content[locale] is dereferenced instead of 404ing cleanly.
export const dynamicParams = false;

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];
  const filters = buildGalleryFilters(photos, categoryLabels, c.gallery.allLabel, locale);

  return (
    <main className="px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl">{c.gallery.heading}</h1>
      <div className="mt-10">
        <GallerySection photos={photos} filters={filters} locale={locale} />
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Run the full test suite**

Run: `npm test -- --run`
Expected: PASS, all files (including the updated `content/content.test.ts` and the two new test files from Tasks 1–2).

- [ ] **Step 7: Typecheck and lint**

Run: `npm run lint`
Expected: no errors.

---

### Task 5: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `npm test -- --run`
Expected: all tests PASS.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: succeeds, all routes generated, no type errors.

- [ ] **Step 3: Visual check on the running dev server**

Start the dev server if it isn't already running (`npm run dev`), open `/gallery` (both `/gallery` and `/en/gallery`), and confirm:
- All 3 filter pills still appear (Портрет / Love story / Фэшн-Ночная съёмка), in that order, with correct counts (11 / 32 / 20).
- Clicking each filter still narrows the grid correctly.
- The hero photo (`love-14`) and all 8 teaser photos on the landing page still render correctly.
- Open browser devtools Network tab and confirm no 404s for `/photos/portrait/*.jpg` or `/photos/love-story/*.jpg`.

- [ ] **Step 4: Confirm nothing was committed or pushed**

Run: `git status --short` and `git log --oneline -3`
Expected: the new/modified files from this plan show as uncommitted changes; the most recent commit is still `b4375f7` (unchanged) — nothing from this session has been committed or pushed.
