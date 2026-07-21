export type Locale = 'ru' | 'en';

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    about: string;
    portfolio: string;
    services: string;
    pricing: string;
    contacts: string;
    bookCta: string;
  };
  hero: {
    kicker: string;
    name: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    heading: string;
    body: string;
  };
  portfolioTeaser: {
    heading: string;
    viewAll: string;
  };
  services: {
    heading: string;
    items: { title: string; description: string }[];
  };
  pricing: {
    heading: string;
    tiers: { name: string; price: string; features: string[] }[];
    footnote: string;
  };
  contacts: {
    heading: string;
    location: string;
    telegramLabel: string;
    instagramLabel: string;
    bookingMessage: string;
  };
  gallery: {
    heading: string;
    filters: { id: 'all' | 'portrait' | 'love-story' | 'fashion-night'; label: string }[];
  };
  footer: {
    rights: string;
  };
}
