import type { SiteContent } from './types';

export const en: SiteContent = {
  meta: {
    title: 'Irina Polyanskaya — Photographer in Gyumri and Yerevan',
    description:
      'Portrait and love story photography in Gyumri and Yerevan. Browse the portfolio and book a session.',
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
    kicker: 'PHOTOGRAPHER · YEREVAN · GYUMRI',
    name: 'Irina Polyanskaya',
    subhead: 'Signature shoots with a cinematic mood\nLove Story & portraits\nShooting in Yerevan / Gyumri',
    ctaPrimary: 'Book a session',
    ctaSecondary: 'View the work',
  },
  about: {
    heading: 'About',
    body: "My name is Irina, and I'm a professional photographer with experience creating memorable images. My work centers on portrait photography, and I'm passionate about capturing unique moments and emotions. My style lets me create photos that reflect your individuality and character.",
  },
  portfolioTeaser: {
    heading: 'Portfolio',
    viewAll: 'View the full portfolio',
  },
  services: {
    heading: 'Services',
    items: [
      { title: 'Portrait session', description: 'Individual, focused on a natural look and character.' },
      { title: 'Love story', description: 'Couple session' },
      { title: 'Event photography', description: '?' },
      { title: 'Family session', description: '?' },
    ],
  },
  pricing: {
    heading: 'Pricing',
    cityToggle: { gyumri: 'Gyumri', yerevan: 'Yerevan' },
    tiers: [
      {
        name: 'STANDARD',
        priceByCity: { gyumri: '40,000 ֏', yerevan: '50,000 ֏' },
        features: [
          '1–1.5 hour session',
          '1–2 looks',
          '50–70 edited photos',
          'Help with location and styling',
          'Help with posing',
        ],
      },
      {
        name: 'EXPRESS',
        priceByCity: { gyumri: '25,000 ֏', yerevan: '35,000 ֏' },
        features: [
          'Up to 30 minutes',
          '1 look / 1 location',
          '20–25 edited photos',
          'Help with posing',
        ],
      },
    ],
    footnote: 'Additional retouched photo — 1,500 ֏. Studio and makeup artist billed separately.',
  },
  contacts: {
    heading: 'Contacts',
    location: 'Gyumri, Yerevan, Armenia',
    telegramLabel: 'Telegram',
    instagramLabel: 'Instagram',
    bookingMessage: "Hi! I'd like to book a photo session.",
  },
  gallery: {
    heading: 'Portfolio',
    allLabel: 'All',
  },
  footer: {
    rights: 'Irina Polyanskaya',
  },
};
