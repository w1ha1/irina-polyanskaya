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
    body: 'My name is Irina, and I am a professional photographer with 5 years of experience creating vibrant and memorable images. My work encompasses portrait, wedding, and commercial photography, and I am passionate about capturing unique moments and emotions. My style combines classic elegance with a modern approach, allowing me to create photographs that reflect your individuality and unique character.',
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
    cityToggle: { gyumri: 'Gyumri', yerevan: 'Yerevan' },
    tiers: [
      {
        name: 'STANDARD',
        priceByCity: { gyumri: '40,000 ֏', yerevan: '50,000 ֏' },
        features: [
          '1–1.5 hour session',
          '50–70 edited photos (5–10 retouched)',
          'Help with styling, location, and props',
          'Ready in 7–10 days',
        ],
      },
      {
        name: 'EXPRESS',
        priceByCity: { gyumri: '25,000 ֏', yerevan: '35,000 ֏' },
        features: [
          'Up to 30 minutes',
          '20–25 edited photos (up to 5 retouched)',
          'Help with styling, location, and props',
          'Ready in 7–10 days',
        ],
      },
    ],
    footnote: 'Additional retouched photo — 1,500 ֏. Studio and makeup artist billed separately.',
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
    allLabel: 'All',
  },
  footer: {
    rights: 'Irina Polyanskaya',
  },
};
