import type { Locale } from '@/content';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { PortfolioTeaser } from '@/components/sections/PortfolioTeaser';
import { Services } from '@/components/sections/Services';
import { Pricing } from '@/components/sections/Pricing';

// Only 'ru' | 'en' are produced by generateStaticParams in layout.tsx. Without
// this, Next's dynamicParams defaults to true and any other locale segment
// (e.g. /fr) would still render this page with an unsupported `locale`,
// throwing when content[locale] is dereferenced instead of 404ing cleanly.
export const dynamicParams = false;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <Hero locale={locale} />
      <About locale={locale} />
      <PortfolioTeaser locale={locale} />
      <Services locale={locale} />
      <Pricing locale={locale} />
    </main>
  );
}
