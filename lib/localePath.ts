import type { Locale } from '@/content';

const LOCALE_PREFIX = /^\/(ru|en|hy)(?=\/|$)/;

export function localePath(pathname: string, targetLocale: Locale): string {
  const rest = pathname.replace(LOCALE_PREFIX, '');
  return `/${targetLocale}${rest}`;
}
