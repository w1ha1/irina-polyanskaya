import type { SiteContent } from './types';

export const ru: SiteContent = {
  meta: {
    title: 'Ирина Полянская — фотограф в Гюмри и Ереване',
    description:
      'Портретная и love story в Гюмри и Ереване. Смотрите портфолио и записывайтесь на съёмку.',
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
    kicker: 'ФОТОГРАФ · ЕРЕВАН · ГЮМРИ',
    name: 'Ирина Полянская',
    subhead: 'Авторские съёмки с атмосферой кино\nLove Story & portraits\nСнимаю в Ереване / Гюмри',
    ctaPrimary: 'Записаться на съёмку',
    ctaSecondary: 'Смотреть работы',
  },
  about: {
    heading: 'Обо мне',
    body: 'Меня зовут Ирина, Я профессиональный фотограф с опытом в создании запоминающихся изображений. Моя работа охватывает портретную фотографию и я страстно увлечена запечатлением уникальных моментов и эмоций. Мой стиль позволяет мне создавать фото, которые отражают вашу индивидуальность и особенности.',
  },
  portfolioTeaser: {
    heading: 'Портфолио',
    viewAll: 'Смотреть всё портфолио',
  },
  services: {
    heading: 'Услуги',
    items: [
      { title: 'Портретная съёмка', description: 'Индивидуальная с акцентом на естественность и характер.' },
      { title: 'Love story', description: 'Съёмка пары' },
      { title: 'Съёмка мероприятий', description: '?' },
      { title: 'Семейная съёмка', description: '?' },
    ],
  },
  pricing: {
    heading: 'Прайс',
    cityToggle: { gyumri: 'Гюмри', yerevan: 'Ереван' },
    tiers: [
      {
        name: 'STANDARD',
        priceByCity: { gyumri: '40 000 ֏', yerevan: '50 000 ֏' },
        features: [
          '1–1.5 часа съёмки',
          '1–2 образа',
          '50–70 фото в обработке',
          'Подбор локации и помощь с образом',
          'Помощь с позиционированием',
        ],
      },
      {
        name: 'EXPRESS',
        priceByCity: { gyumri: '25 000 ֏', yerevan: '35 000 ֏' },
        features: [
          'До 30 минут съёмки',
          '1 образ/1 локация',
          '20–25 фото в обработке',
          'Помощь с позированием',
        ],
      },
    ],
    footnote: 'Дополнительное фото в ретуши — 1500 ֏. Студия и визажист оплачиваются отдельно.',
  },
  contacts: {
    heading: 'Контакты',
    location: 'Гюмри, Ереван, Армения',
    telegramLabel: 'Telegram',
    instagramLabel: 'Instagram',
    bookingMessage: 'Здравствуйте! Хочу записаться на фотосессию.',
  },
  gallery: {
    heading: 'Портфолио',
    allLabel: 'Все',
  },
  footer: {
    rights: 'Ирина Полянская',
  },
};
