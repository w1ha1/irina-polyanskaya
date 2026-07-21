import { describe, it, expect } from 'vitest';
import { content } from './index';

function keys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  if (Array.isArray(obj)) {
    return obj.length > 0 ? keys(obj[0], `${prefix}[]`) : [`${prefix}[]`];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k)
  );
}

describe('bilingual content parity', () => {
  it('ru and en expose the same key structure', () => {
    expect(keys(content.ru).sort()).toEqual(keys(content.en).sort());
  });

  it('services has exactly 5 items in both locales', () => {
    expect(content.ru.services.items).toHaveLength(5);
    expect(content.en.services.items).toHaveLength(5);
  });

  it('pricing has exactly 2 tiers in both locales', () => {
    expect(content.ru.pricing.tiers).toHaveLength(2);
    expect(content.en.pricing.tiers).toHaveLength(2);
  });

  it('gallery filters are all and the 3 real categories', () => {
    const ids = content.ru.gallery.filters.map((f) => f.id);
    expect(ids).toEqual(['all', 'portrait', 'love-story', 'fashion-night']);
  });

  it('no string field is empty in either locale', () => {
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
    checkStrings(content.ru, 'ru');
    checkStrings(content.en, 'en');
  });
});
