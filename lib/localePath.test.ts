import { describe, it, expect } from 'vitest';
import { localePath } from './localePath';

describe('localePath', () => {
  it('converts the RU landing path to the EN landing path', () => {
    expect(localePath('/ru', 'en')).toBe('/en');
  });

  it('converts the EN landing path to the RU landing path', () => {
    expect(localePath('/en', 'ru')).toBe('/ru');
  });

  it('converts the RU gallery path to the EN gallery path', () => {
    expect(localePath('/ru/gallery', 'en')).toBe('/en/gallery');
  });

  it('converts the EN gallery path to the RU gallery path', () => {
    expect(localePath('/en/gallery', 'ru')).toBe('/ru/gallery');
  });

  it('converts the RU landing path to the HY landing path', () => {
    expect(localePath('/ru', 'hy')).toBe('/hy');
  });

  it('converts the HY gallery path to the EN gallery path', () => {
    expect(localePath('/hy/gallery', 'en')).toBe('/en/gallery');
  });

  it('is a no-op when already on the target locale', () => {
    expect(localePath('/ru/gallery', 'ru')).toBe('/ru/gallery');
    expect(localePath('/en/gallery', 'en')).toBe('/en/gallery');
    expect(localePath('/hy/gallery', 'hy')).toBe('/hy/gallery');
  });
});
