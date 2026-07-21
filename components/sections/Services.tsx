import { content, type Locale } from '@/content';
import { commercialPhoto } from '@/data/photos';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { RevealImage } from '@/components/ui/RevealImage';

const COMMERCIAL_SERVICE_INDEX = 2; // "Коммерческая съёмка" / "Commercial" — 3rd item in both locales

export function Services({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="services" className="px-6 py-16 md:py-24">
      <SplitHeading as="h2" className="font-display text-4xl">
        {c.services.heading}
      </SplitHeading>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {c.services.items.map((item, index) => (
          <div key={item.title} className="border-t border-ink/15 pt-6">
            {index === COMMERCIAL_SERVICE_INDEX && (
              <RevealImage
                src="/photos/commercial/commercial-01.jpg"
                alt={commercialPhoto.alt[locale]}
                width={commercialPhoto.width}
                height={commercialPhoto.height}
                className="mb-4 aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            )}
            <h3 className="font-display text-2xl">{item.title}</h3>
            <p className="mt-2 text-ink/70">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
