'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { content, type Locale } from '@/content';
import { toggleLocalePath } from '@/lib/localePath';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const c = content[locale];
  const base = locale === 'ru' ? '' : '/en';

  const navLinks = [
    { href: `${base}/#about`, label: c.nav.about },
    { href: `${base}/gallery`, label: c.nav.portfolio },
    { href: `${base}/#services`, label: c.nav.services },
    { href: `${base}/#pricing`, label: c.nav.pricing },
    { href: `${base}/#contacts`, label: c.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-6 py-4 backdrop-blur">
      <Link href={locale === 'ru' ? '/' : '/en'} className="font-display text-xl tracking-wide">
        {c.hero.name}
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-xs uppercase tracking-wider md:flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-wine">
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href={toggleLocalePath(pathname, locale === 'ru' ? 'en' : 'ru')}
          className="font-mono text-xs uppercase tracking-wider hover:text-wine"
          aria-label="Switch language"
        >
          {locale === 'ru' ? 'EN' : 'RU'}
        </Link>
        <MagneticButton
          href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}
          className="hidden sm:inline-flex"
        >
          {c.nav.bookCta}
        </MagneticButton>
      </div>
    </header>
  );
}
