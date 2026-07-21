import { content, type Locale } from '@/content';
import { SplitHeading } from '@/components/ui/SplitHeading';

export function Pricing({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="pricing" className="px-6 py-16 md:py-24">
      <SplitHeading as="h2" className="font-display text-4xl">
        {c.pricing.heading}
      </SplitHeading>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {c.pricing.tiers.map((tier) => (
          <div key={tier.name} className="rounded-2xl border border-ink/15 p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-wine">{tier.name}</p>
            <p className="mt-2 font-display text-4xl">{tier.price}</p>
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
