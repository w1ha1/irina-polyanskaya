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
