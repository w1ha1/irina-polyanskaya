'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { content, type Locale } from '@/content';
import { localePath } from '@/lib/localePath';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn } from '@/lib/cn';

const LOCALES: Locale[] = ['ru', 'en', 'hy'];
const LOCALE_LABELS: Record<Locale, string> = { ru: 'RU', en: 'EN', hy: 'HY' };

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const c = content[locale];
  const base = `/${locale}`;

  const navLinks = [
    { href: `${base}/gallery`, label: c.nav.portfolio },
    { href: `${base}/#services`, label: c.nav.services },
    { href: `${base}/#pricing`, label: c.nav.pricing },
    { href: `${base}/#contacts`, label: c.nav.contacts },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href={base} className="font-display text-xl tracking-wide">
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
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={localePath(pathname, l)}
                aria-current={l === locale ? 'true' : undefined}
                className={cn(l === locale ? 'text-wine' : 'text-ink/70 hover:text-wine')}
              >
                {LOCALE_LABELS[l]}
              </Link>
            ))}
          </div>
          <MagneticButton
            href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}
            className="hidden sm:inline-flex"
          >
            {c.nav.bookCta}
          </MagneticButton>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? (locale === 'ru' ? 'Закрыть меню' : 'Close menu') : (locale === 'ru' ? 'Открыть меню' : 'Open menu')}
            className="font-mono text-xs uppercase tracking-wider md:hidden"
          >
            {menuOpen ? (locale === 'ru' ? 'Закрыть' : 'Close') : (locale === 'ru' ? 'Меню' : 'Menu')}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="flex flex-col gap-5 border-t border-ink/10 px-6 py-6 font-mono text-sm uppercase tracking-wider md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="hover:text-wine">
              {link.label}
            </Link>
          ))}
          <MagneticButton
            href={`https://t.me/polka977?text=${encodeURIComponent(c.contacts.bookingMessage)}`}
            className="mt-2 w-fit"
          >
            {c.nav.bookCta}
          </MagneticButton>
        </nav>
      )}
    </header>
  );
}
