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
    cityToggle: { gyumri: string; yerevan: string };
    tiers: { name: string; priceByCity: { gyumri: string; yerevan: string }; features: string[] }[];
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
    allLabel: string;
  };
  footer: {
    rights: string;
  };
}
