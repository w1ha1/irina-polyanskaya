import { content, type Locale } from '@/content';
import { photos } from '@/data/photos';
import { GallerySection } from '@/components/gallery/GallerySection';

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
        <GallerySection photos={photos} filters={c.gallery.filters} locale={locale} />
      </div>
    </main>
  );
}
