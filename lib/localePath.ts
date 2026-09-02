import type { Locale } from '@/content';

// Next's rewrites map '/' -> '/ru' and '/gallery' -> '/ru/gallery' transparently
// at the routing layer, but `usePathname()` reports the internal, rewritten path
// (e.g. '/ru') rather than the address-bar path (e.g. '/') on those pages. Every
// locale prefix (including the internal-only 'ru' one) is stripped the same way
// so external and internal paths convert identically.
const LOCALE_PREFIXES = ['ru', 'en', 'hy'];

export function localePath(pathname: string, targetLocale: Locale): string {
  let canonical = pathname;
  for (const prefix of LOCALE_PREFIXES) {
    if (canonical === `/${prefix}` || canonical.startsWith(`/${prefix}/`)) {
      canonical = canonical.slice(prefix.length + 1) || '/';
      break;
    }
  }

  if (targetLocale === 'ru') return canonical;
  return canonical === '/' ? `/${targetLocale}` : `/${targetLocale}${canonical}`;
}
