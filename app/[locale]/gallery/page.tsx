import { content, type Locale } from '@/content';
import { photos } from '@/data/photos';
import { GallerySection } from '@/components/gallery/GallerySection';

// Only 'ru' | 'en' | 'hy' are produced by generateStaticParams in layout.tsx. Without
// this, Next's dynamicParams defaults to true and any other locale segment
// (e.g. /fr) would still render this page with an unsupported `locale`,
// throwing when content[locale] is dereferenced instead of 404ing cleanly.
export const dynamicParams = false;

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];

  return (
    <main className="px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl">{c.gallery.heading}</h1>
      <div className="mt-10">
        <GallerySection photos={photos} locale={locale} />
      </div>
    </main>
  );
}
