export function toggleLocalePath(pathname: string, targetLocale: 'ru' | 'en'): string {
  const isEn = pathname.startsWith('/en');

  // next.config.ts rewrites '/' -> '/ru' and '/gallery' -> '/ru/gallery' transparently
  // at the routing layer, but `usePathname()` reports the internal, rewritten path
  // (e.g. '/ru') rather than the address-bar path (e.g. '/') on those pages. Normalize
  // a leading '/ru' segment away so those internal paths convert the same way their
  // external equivalents do.
  const normalized =
    !isEn && (pathname === '/ru' || pathname.startsWith('/ru/')) ? pathname.slice(3) || '/' : pathname;

  if (targetLocale === 'en') {
    if (isEn) return pathname;
    return normalized === '/' ? '/en' : `/en${normalized}`;
  }

  if (!isEn) return normalized;
  const stripped = pathname.replace(/^\/en/, '');
  return stripped === '' ? '/' : stripped;
}
