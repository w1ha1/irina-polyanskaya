import { describe, it, expect } from 'vitest';
import { localePath } from './localePath';

describe('localePath', () => {
  it('converts the RU landing path to the EN landing path', () => {
    expect(localePath('/', 'en')).toBe('/en');
  });

  it('converts the EN landing path to the RU landing path', () => {
    expect(localePath('/en', 'ru')).toBe('/');
  });

  it('converts the RU gallery path to the EN gallery path', () => {
    expect(localePath('/gallery', 'en')).toBe('/en/gallery');
  });

  it('converts the EN gallery path to the RU gallery path', () => {
    expect(localePath('/en/gallery', 'ru')).toBe('/gallery');
  });

  it('converts the RU landing path to the HY landing path', () => {
    expect(localePath('/', 'hy')).toBe('/hy');
  });

  it('converts the HY gallery path to the EN gallery path', () => {
    expect(localePath('/hy/gallery', 'en')).toBe('/en/gallery');
  });

  it('is a no-op when already on the target locale', () => {
    expect(localePath('/gallery', 'ru')).toBe('/gallery');
    expect(localePath('/en/gallery', 'en')).toBe('/en/gallery');
    expect(localePath('/hy/gallery', 'hy')).toBe('/hy/gallery');
  });

  // Next's rewrites map '/' -> '/ru' and '/gallery' -> '/ru/gallery' transparently
  // at the routing layer, but `usePathname()` reports the internal, rewritten path
  // (e.g. '/ru') rather than the address-bar path (e.g. '/') on those pages. These
  // internal paths must convert the same way their external equivalents do.
  it('converts the internal RU landing path (as reported by usePathname on a rewritten route) to the EN landing path', () => {
    expect(localePath('/ru', 'en')).toBe('/en');
  });

  it('converts the internal RU gallery path (as reported by usePathname on a rewritten route) to the EN gallery path', () => {
    expect(localePath('/ru/gallery', 'en')).toBe('/en/gallery');
  });
});
