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

/**
 * Reserved category id for photos that sit loose in the root of
 * assets/source-photos/ (not inside any category subfolder). They still
 * appear on the site — just under "all", never as their own filter pill.
 * See docs/superpowers/specs/2026-07-24-photo-folder-categorization-design.md.
 */
export const UNCATEGORIZED_CATEGORY = 'uncategorized';

export const photos: Photo[] = generatedPhotos;

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
  'fashion-01': { ru: 'Мужской портрет с меховой накидкой и серебряным украшением, тёплый низкий свет', en: 'Male portrait with a fur wrap and silver jewelry under warm low light' },
  'fashion-02': { ru: 'Крупный план серебряной цепочки-украшения на теле, тёплый свет', en: 'Close-up of a silver chain necklace on skin, warm lighting' },
  'fashion-03': { ru: 'Съёмочный процесс: стилист поправляет образ модели, чёрно-белое фото', en: "Behind the scenes: a stylist adjusting the model's look, black and white" },
  'fashion-04': { ru: 'Портрет мужчины в меховой накидке с украшениями, коллаж из двух кадров', en: 'Portrait of a man in a fur wrap with jewelry, two-frame collage' },
  'fashion-05': { ru: 'Мужчина с поднятыми руками, серебряное украшение, тёплый свет', en: 'Man with raised arms, silver jewelry, warm lighting' },
  'fashion-06': { ru: 'Мужчина держит гранат рядом с меховой накидкой и украшениями', en: 'Man holding a pomegranate beside a fur wrap and jewelry' },
  'fashion-07': { ru: 'Портрет крупным планом с украшением на шее', en: 'Close-up portrait with a neck ornament' },
  'fashion-08': { ru: 'Рука с кольцом держит металлический кувшин, тёплый свет', en: 'A ringed hand holding a metal jug, warm light' },
  'fashion-09': { ru: 'Чёрно-белый портрет с поднятыми руками, драматичный свет', en: 'Black-and-white portrait with raised arms, dramatic light' },
  'fashion-10': { ru: 'Чёрно-белый крупный портрет с цепочками и украшениями', en: 'Black-and-white close portrait with chains and jewelry' },
  'fashion-11': { ru: 'Портрет в цветных бликах света, тёплые и золотые тона', en: 'Portrait in colorful light flares, warm and golden tones' },
  'fashion-12': { ru: 'Мужчина в меховой накидке среди тканей и украшений', en: 'Man in a fur wrap among fabrics and ornaments' },
  'fashion-13': { ru: 'Рука с кольцом держит бронзовый кувшин, деталь образа', en: 'A ringed hand holding a bronze jug, styling detail' },
  'fashion-14': { ru: 'Женщина в традиционном армянском головном уборе с кувшином', en: 'Woman in a traditional Armenian headdress holding a jug' },
  'fashion-15': { ru: 'Женщина в традиционном костюме держит гранат у лица', en: 'Woman in traditional costume holding a pomegranate to her face' },
  'fashion-16': { ru: 'Женщина в кружевной фате у резного зеркала', en: 'Woman in a lace veil by a carved mirror' },
  'fashion-17': { ru: 'Портрет в традиционном головном уборе с гранатом', en: 'Portrait in a traditional headdress with a pomegranate' },
  'fashion-18': { ru: 'Женщина в кружевной фате у окна', en: 'Woman in a lace veil by a window' },
  'fashion-19': { ru: 'Женщина в традиционном костюме на фоне ковра, с гранатом', en: 'Woman in traditional costume against a carpet backdrop, with a pomegranate' },
  'fashion-20': { ru: 'Крупный портрет женщины, пробующей гранат, красная помада', en: 'Close portrait of a woman tasting pomegranate, red lipstick' },
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
