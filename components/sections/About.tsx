import { content, type Locale } from '@/content';
import { aboutPhoto } from '@/data/photos';
import { HudFrame } from '@/components/ui/HudFrame';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { RevealImage } from '@/components/ui/RevealImage';

export function About({ locale }: { locale: Locale }) {
  const c = content[locale];

  return (
    <section id="about" className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <HudFrame label={locale === 'ru' ? 'ПОРТРЕТ АВТОРА' : 'PHOTOGRAPHER'} className="order-2 md:order-1">
        <RevealImage
          src="/photos/about/about-irina.jpg"
          alt={aboutPhoto.alt[locale]}
          width={aboutPhoto.width}
          height={aboutPhoto.height}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </HudFrame>
      <div className="order-1 md:order-2">
        <SplitHeading as="h2" className="font-display text-4xl">
          {c.about.heading}
        </SplitHeading>
        <p className="mt-6 max-w-md text-lg text-ink/80">{c.about.body}</p>
      </div>
    </section>
  );
}
