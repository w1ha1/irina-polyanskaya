import { content, type Locale } from '@/content';
import { heroPhoto, altText } from '@/data/photos';
import { withBasePath } from '@/lib/basePath';
import { HudFrame } from '@/components/ui/HudFrame';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { RevealImage } from '@/components/ui/RevealImage';

export function Hero({ locale }: { locale: Locale }) {
  const c = content[locale];
  const base = `/${locale}`;

  return (
    <section className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-wine">{c.hero.kicker}</p>
        <SplitHeading as="h1" className="mt-4 font-display text-5xl leading-tight md:text-6xl">
          {c.hero.name}
        </SplitHeading>
        <p className="mt-6 max-w-md whitespace-pre-line text-lg text-ink/80">{c.hero.subhead}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <MagneticButton href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}>
            {c.hero.ctaPrimary}
          </MagneticButton>
          <MagneticButton href={`${base}/gallery`}>{c.hero.ctaSecondary}</MagneticButton>
        </div>
      </div>
      <HudFrame>
        <RevealImage
          src={withBasePath(`/photos/${heroPhoto.category}/${heroPhoto.slug}.jpg`)}
          alt={altText(heroPhoto.alt, locale)}
          width={heroPhoto.width}
          height={heroPhoto.height}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="md:h-[640px] lg:h-[720px]"
        />
      </HudFrame>
    </section>
  );
}
