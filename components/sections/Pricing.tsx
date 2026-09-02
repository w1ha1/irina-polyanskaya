'use client';

import { useState } from 'react';
import { content, type Locale } from '@/content';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { cn } from '@/lib/cn';

type City = 'gyumri' | 'yerevan';

export function Pricing({ locale }: { locale: Locale }) {
  const c = content[locale];
  const [city, setCity] = useState<City>('yerevan');

  return (
    <section id="pricing" className="px-6 py-16 md:py-24">
      <SplitHeading as="h2" className="font-display text-4xl">
        {c.pricing.heading}
      </SplitHeading>
      <div className="mt-6 flex gap-2 font-mono text-xs uppercase tracking-wider">
        {(['gyumri', 'yerevan'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCity(option)}
            aria-pressed={city === option}
            className={cn(
              'rounded-full border px-4 py-2 transition-colors',
              city === option ? 'border-wine bg-wine text-paper' : 'border-ink/15 text-ink/70'
            )}
          >
            {c.pricing.cityToggle[option]}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {c.pricing.tiers.map((tier) => (
          <div key={tier.name} className="rounded-2xl border border-ink/15 p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-wine">{tier.name}</p>
            <p className="mt-2 font-display text-4xl">{tier.priceByCity[city]}</p>
            <ul className="mt-6 space-y-2 text-ink/80">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-sm text-ink/60">{c.pricing.footnote}</p>
    </section>
  );
}
