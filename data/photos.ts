import type { Locale } from '@/content';
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

// Photo captions are only written in ru/en; hy falls back to the ru caption
// rather than requiring a hand-written Armenian caption for every photo.
export function altText(alt: { ru: string; en: string }, locale: Locale): string {
  return alt[locale === 'hy' ? 'ru' : locale];
}

/**
 * Reserved category id for photos that sit loose in the root of
 * assets/source-photos/ (not inside any category subfolder). They still
 * appear on the site — just under "all", never as their own filter pill.
 * See docs/superpowers/specs/2026-07-24-photo-folder-categorization-design.md.
 */
export const UNCATEGORIZED_CATEGORY = 'uncategorized';

export const photos: Photo[] = generatedPhotos;

export const heroPhoto: Photo = photos.find((p) => p.slug === 'love-35')!;

export const teaserSlugs: string[] = [
  'love-31',
  'love-05',
  'love-19',
  'love-21',
  'love-02',
  'portrait-09',
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
 * portrait-08's source file is physically rotated 90° in the original export
 * — no EXIF orientation flag, the pixel data itself is sideways.
 * copy-photos.mjs rotates it 90° clockwise when copying into public/.
 *
 * These entries are tied to a specific source photo, not just a slug number:
 * when a slug gets reassigned to a different photo (an old one deleted, a
 * new one taking its number), a leftover entry here would silently rotate
 * or trim the wrong image. Re-verify visually before adding one back.
 */
export const rotateOnCopy: Record<string, number> = {
  'portrait-08': 90,
};

/**
 * These source files are single (non-collage) photos with a solid white
 * matte baked in around the frame (an Instagram export artifact, not an
 * intentional collage border like the multi-panel "Коллаж" photos have).
 * copy-photos.mjs trims it off when copying into public/. Same slug-reuse
 * caveat as rotateOnCopy above.
 */
export const trimOnCopy = new Set(['portrait-04', 'portrait-05']);

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
  'love-35': { ru: 'Пара идёт по полю рядом с красным автомобилем', en: 'A couple walking through a field beside a red car' },
  'portrait-01': { ru: 'Крупный план рук, листающих старую книгу, тёплый свет', en: 'Close-up of hands turning pages of an old book, warm light' },
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
