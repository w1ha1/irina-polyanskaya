import { describe, it, expect } from 'vitest';
import { content } from './index';
import type { Locale } from './types';

const locales: Locale[] = ['ru', 'en', 'hy'];

function keys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  if (Array.isArray(obj)) {
    return obj.length > 0 ? keys(obj[0], `${prefix}[]`) : [`${prefix}[]`];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k)
  );
}

describe('content parity across locales', () => {
  it('ru, en, and hy expose the same key structure', () => {
    const ruKeys = keys(content.ru).sort();
    expect(keys(content.en).sort()).toEqual(ruKeys);
    expect(keys(content.hy).sort()).toEqual(ruKeys);
  });

  it('services has exactly 2 items in every locale', () => {
    for (const locale of locales) {
      expect(content[locale].services.items).toHaveLength(2);
    }
  });

  it('pricing has exactly 2 tiers in every locale', () => {
    for (const locale of locales) {
      expect(content[locale].pricing.tiers).toHaveLength(2);
    }
  });

  it('no string field is empty in any locale', () => {
    function checkStrings(obj: unknown, path = ''): void {
      if (typeof obj === 'string') {
        expect(obj.trim().length, `${path} should not be empty`).toBeGreaterThan(0);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((item, i) => checkStrings(item, `${path}[${i}]`));
        return;
      }
      if (obj !== null && typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj)) checkStrings(v, path ? `${path}.${k}` : k);
      }
    }
    for (const locale of locales) checkStrings(content[locale], locale);
  });
});
