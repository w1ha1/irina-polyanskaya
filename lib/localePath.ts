export function toggleLocalePath(pathname: string, targetLocale: 'ru' | 'en'): string {
  const isEn = pathname.startsWith('/en');

  if (targetLocale === 'en') {
    if (isEn) return pathname;
    return pathname === '/' ? '/en' : `/en${pathname}`;
  }

  if (!isEn) return pathname;
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
}
