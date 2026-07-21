import type { Locale } from '@/content';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { PortfolioTeaser } from '@/components/sections/PortfolioTeaser';
import { Services } from '@/components/sections/Services';
import { Pricing } from '@/components/sections/Pricing';

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
