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

  // --- love-story (32) ---
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
  { slug: 'love-19', category: 'love-story', sourceFile: 'SnapInsta.to_683766249_18017189375836533_6540760078989453481_n.jpg', width: 720, height: 900, alt: { ru: 'Пара в оранжерее: мужчина держится за опору, женщина смеётся среди роз', en: 'A couple in a greenhouse: the man holds on to a support post, the woman laughs among the roses' } },
  { slug: 'love-20', category: 'love-story', sourceFile: 'SnapInsta.to_684111780_18016284194836533_6198651596713270895_n.jpg', width: 720, height: 900, alt: { ru: 'Пара касается носами в поле, пасмурное небо, цветное фото', en: 'A couple touching noses in a field, overcast sky, color photo' } },
  { slug: 'love-21', category: 'love-story', sourceFile: 'SnapInsta.to_684843279_18016284212836533_4094334937703427035_n.jpg', width: 720, height: 900, alt: { ru: 'Сцепленные руки пары через окно машины под дождём', en: "A couple's clasped hands through a rain-streaked car window" } },
  { slug: 'love-22', category: 'love-story', sourceFile: 'SnapInsta.to_684855309_18017189345836533_2113241894251156481_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: отдых среди роз, деталь книги, поцелуй в листве', en: 'Collage: resting among roses, a book detail, a kiss in the leaves' } },
  { slug: 'love-23', category: 'love-story', sourceFile: 'SnapInsta.to_684946431_18017189402836533_4573255447170964092_n.jpg', width: 720, height: 900, alt: { ru: 'Чёрно-белое фото пары в теплице', en: 'Black-and-white photo of a couple in a greenhouse' } },
  { slug: 'love-24', category: 'love-story', sourceFile: 'SnapInsta.to_685386164_18017189405836533_175695731233902322_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: девушка одна среди роз, деталь книги и объятия пары в теплице', en: 'Collage: a woman alone among roses, a book detail, and a couple embracing in the greenhouse' } },
  { slug: 'love-25', category: 'love-story', sourceFile: 'SnapInsta.to_685956641_18017189429836533_2687868010405871520_n.jpg', width: 720, height: 900, alt: { ru: 'Пара в теплице: мужчина целует девушку в красном платье и меховой накидке среди роз', en: 'A couple in the greenhouse: a man kisses a woman in a red dress and fur wrap among roses' } },
  { slug: 'love-26', category: 'love-story', sourceFile: 'SnapInsta.to_687050582_18017189348836533_46706258812802475_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: девушка одна среди роз и вид вдоль ряда теплицы', en: 'Collage: a woman alone among roses and a view down the greenhouse row' } },
  { slug: 'love-27', category: 'love-story', sourceFile: 'SnapInsta.to_687284927_18017189387836533_3293444089339232783_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара с розой и гранатом среди зелени, романтичный кадр', en: 'Collage: a couple with a rose and pomegranate among greenery, a romantic frame' } },
  { slug: 'love-28', category: 'love-story', sourceFile: 'SnapInsta.to_688888300_18017189414836533_4901679097801555144_n.jpg', width: 720, height: 900, alt: { ru: 'Чёрно-белый нежный кадр двух силуэтов среди тёмной зелени', en: 'Black-and-white tender frame of two silhouettes among dark greenery' } },
  { slug: 'love-29', category: 'love-story', sourceFile: 'SnapInsta.to_683894650_18016284197836533_7423984466739593885_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара пьёт колу в машине, цветной и чёрно-белый кадр', en: 'Collage: a couple drinking Coca-Cola in a car, a color and a black-and-white frame' } },
  { slug: 'love-30', category: 'love-story', sourceFile: 'SnapInsta.to_688833219_18017189330836533_4736488998158937883_n.jpg', width: 720, height: 900, alt: { ru: 'Деталь: спина девушки с красной лямкой платья и жемчужным колье среди роз', en: "Detail: a woman's back with a red dress strap and a pearl necklace among roses" } },
  { slug: 'love-31', category: 'love-story', sourceFile: 'SnapInsta.to_688886403_18017189327836533_3332075026162490702_n.jpg', width: 720, height: 900, alt: { ru: 'Пара целуется среди листвы и роз в оранжерее', en: 'A couple kissing among foliage and roses in the greenhouse' } },
  { slug: 'love-32', category: 'love-story', sourceFile: 'SnapInsta.to_689064694_18017189360836533_4093826099256987331_n.jpg', width: 720, height: 900, alt: { ru: 'Коллаж: пара среди роз в теплице, включая смазанный кадр в движении', en: 'Collage: a couple among roses in the greenhouse, including a motion-blurred frame' } },

  // --- portrait (11) ---
  { slug: 'portrait-01', category: 'portrait', sourceFile: 'SnapInsta.to_657360749_18013061471836533_807684231671720313_n.jpg', width: 850, height: 1133, alt: { ru: 'Крупный план рук, листающих старую книгу, тёплый свет', en: 'Close-up of hands turning pages of an old book, warm light' } },
  { slug: 'portrait-02', category: 'portrait', sourceFile: 'SnapInsta.to_681180916_18016284176836533_1248926197350596796_n.jpg', width: 900, height: 720, alt: { ru: 'Мужчина крупным планом, на фоне размыто — женщина у автомобиля в горах', en: 'Close-up of a man, with a woman by a car in the mountains blurred in the background' } },
  { slug: 'portrait-03', category: 'portrait', sourceFile: 'SnapInsta.to_749756064_18027194900836533_4093777991618701705_n.jpg', width: 720, height: 960, alt: { ru: 'Коллаж: мужчина у стены в тёплом свете, блик радуги, деталь наручных часов, на ступенях', en: 'Collage: a man by a wall in warm light, a rainbow flare, a wristwatch detail, on the steps' } },
  { slug: 'portrait-04', category: 'portrait', sourceFile: 'SnapInsta.to_750086049_18027194873836533_6795609942903314071_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина у туфовой стены с оконными проёмами', en: 'A man by a tuff-stone wall with window openings' } },
  { slug: 'portrait-05', category: 'portrait', sourceFile: 'SnapInsta.to_750255781_18027195026836533_7800854702609093709_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина на лестнице заброшенной постройки среди зелени', en: 'A man on the stairs of an abandoned structure among greenery' } },
  { slug: 'portrait-06', category: 'portrait', sourceFile: 'SnapInsta.to_750828779_18027194870836533_6194109473403876595_n.jpg', width: 720, height: 960, alt: { ru: 'Фасад церкви в Гюмри с фигурой вдалеке', en: 'A church façade in Gyumri with a figure in the distance' } },
  { slug: 'portrait-07', category: 'portrait', sourceFile: 'SnapInsta.to_752451353_18027194897836533_5579632822793879720_n.jpg', width: 720, height: 960, alt: { ru: 'Коллаж: портрет мужчины у стены с чашкой кофе, тёплый свет', en: 'Collage: portrait of a man by a wall with a coffee cup, warm light' } },
  { slug: 'portrait-08', category: 'portrait', sourceFile: 'SnapInsta.to_753093095_18027194978836533_8226840323895672037_n.jpg', width: 960, height: 720, alt: { ru: 'Чёрно-белый кадр арочного дверного портала', en: 'Black-and-white shot of an arched doorway portal' } },
  { slug: 'portrait-09', category: 'portrait', sourceFile: 'SnapInsta.to_753224968_18027194882836533_6796361134869352882_n.jpg', width: 720, height: 960, alt: { ru: 'Портрет мужчины у резной арки, тёплый свет', en: 'Portrait of a man by a carved archway, warm light' } },
  { slug: 'portrait-10', category: 'portrait', sourceFile: 'SnapInsta.to_753255037_18027194960836533_2427192636046982643_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина у резной деревянной двери, в полный рост', en: 'A man by a carved wooden door, full length' } },
  { slug: 'portrait-11', category: 'portrait', sourceFile: 'SnapInsta.to_753418340_18027194996836533_5475697382716152589_n.jpg', width: 720, height: 960, alt: { ru: 'Мужчина, облокотившийся на деревянный столб у лестницы', en: 'A man leaning against a wooden post by the stairs' } },
];

export const heroPhoto: Photo = photos.find((p) => p.slug === 'fashion-20')!;

export const teaserSlugs: string[] = [
  'fashion-16',
  'fashion-10',
  'love-19',
  'love-21',
  'love-11',
  'portrait-09',
  'portrait-10',
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
