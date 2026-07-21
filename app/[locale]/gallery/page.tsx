import { content, type Locale } from '@/content';

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];

  return (
    <main>
      <h1 className="font-display text-4xl p-8">{c.gallery.heading}</h1>
    </main>
  );
}
