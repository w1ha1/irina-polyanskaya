import { content, type Locale } from '@/content';
import { SplitHeading } from '@/components/ui/SplitHeading';

export function Services({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="services" className="px-6 py-16 md:py-24">
      <SplitHeading as="h2" className="font-display text-4xl">
        {c.services.heading}
      </SplitHeading>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {c.services.items.map((item) => (
          <div key={item.title} className="border-t border-ink/15 pt-6">
            <h3 className="font-display text-2xl">{item.title}</h3>
            <p className="mt-2 text-ink/70">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
