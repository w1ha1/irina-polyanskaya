import { content, type Locale } from '@/content';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const c = content[locale];

  return (
    <main>
      <h1 className="font-display text-4xl p-8">{c.hero.name}</h1>
      <p className="px-8 pb-8">{c.hero.subhead}</p>
    </main>
  );
}
