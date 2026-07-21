import { content, type Locale } from '@/content';
import { photos, teaserSlugs, type Photo } from '@/data/photos';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { RevealImage } from '@/components/ui/RevealImage';

export function PortfolioTeaser({ locale }: { locale: Locale }) {
  const c = content[locale];
  const base = locale === 'ru' ? '' : '/en';
  const teaserPhotos = teaserSlugs
    .map((slug) => photos.find((p) => p.slug === slug))
    .filter((p): p is Photo => Boolean(p));

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SplitHeading as="h2" className="font-display text-4xl">
          {c.portfolioTeaser.heading}
        </SplitHeading>
        <MagneticButton href={`${base}/gallery`}>{c.portfolioTeaser.viewAll}</MagneticButton>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {teaserPhotos.map((photo) => (
          <RevealImage
            key={photo.slug}
            src={`/photos/${photo.category}/${photo.slug}.jpg`}
            alt={photo.alt[locale]}
            width={photo.width}
            height={photo.height}
            className="aspect-[3/4] w-full"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ))}
      </div>
    </section>
  );
}
