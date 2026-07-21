import { describe, it, expect } from 'vitest';
import { toggleLocalePath } from './localePath';

describe('toggleLocalePath', () => {
  it('converts the RU landing path to the EN landing path', () => {
    expect(toggleLocalePath('/', 'en')).toBe('/en');
  });

  it('converts the EN landing path to the RU landing path', () => {
    expect(toggleLocalePath('/en', 'ru')).toBe('/');
  });

  it('converts the RU gallery path to the EN gallery path', () => {
    expect(toggleLocalePath('/gallery', 'en')).toBe('/en/gallery');
  });

  it('converts the EN gallery path to the RU gallery path', () => {
    expect(toggleLocalePath('/en/gallery', 'ru')).toBe('/gallery');
  });

  it('is a no-op when already on the target locale', () => {
    expect(toggleLocalePath('/gallery', 'ru')).toBe('/gallery');
    expect(toggleLocalePath('/en/gallery', 'en')).toBe('/en/gallery');
  });

  // Next's rewrites map '/' -> '/ru' and '/gallery' -> '/ru/gallery' transparently
  // at the routing layer, but `usePathname()` reports the internal, rewritten path
  // (e.g. '/ru') rather than the address-bar path (e.g. '/') on those pages. These
  // internal paths must convert the same way their external equivalents do.
  it('converts the internal RU landing path (as reported by usePathname on a rewritten route) to the EN landing path', () => {
    expect(toggleLocalePath('/ru', 'en')).toBe('/en');
  });

  it('converts the internal RU gallery path (as reported by usePathname on a rewritten route) to the EN gallery path', () => {
    expect(toggleLocalePath('/ru/gallery', 'en')).toBe('/en/gallery');
  });
});
