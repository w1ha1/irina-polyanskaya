import { describe, it, expect } from 'vitest';
import { photos, heroPhoto, teaserSlugs, aboutPhoto, rotateOnCopy, UNCATEGORIZED_CATEGORY } from './photos';

describe('photo data', () => {
  it('has exactly 63 gallery photos', () => {
    expect(photos).toHaveLength(63);
  });

  it('has the expected count per category', () => {
    const counts = photos.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts[UNCATEGORIZED_CATEGORY]).toBe(20);
    expect(counts['love-story']).toBe(32);
    expect(counts.portrait).toBe(11);
  });

  it('has unique slugs', () => {
    const slugs = photos.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every photo a positive width, height, and bilingual alt text', () => {
    for (const p of photos) {
      expect(p.width).toBeGreaterThan(0);
      expect(p.height).toBeGreaterThan(0);
      expect(p.alt.ru.length).toBeGreaterThan(0);
      expect(p.alt.en.length).toBeGreaterThan(0);
    }
  });

  it('picks a hero photo that exists in the gallery set', () => {
    expect(photos.some((p) => p.slug === heroPhoto.slug)).toBe(true);
  });

  it('picks 8 teaser slugs that all exist in the gallery set', () => {
    expect(teaserSlugs).toHaveLength(8);
    const slugs = new Set(photos.map((p) => p.slug));
    for (const s of teaserSlugs) expect(slugs.has(s)).toBe(true);
  });

  it('defines aboutPhoto with bilingual alt text', () => {
    expect(aboutPhoto.alt.ru.length).toBeGreaterThan(0);
    expect(aboutPhoto.alt.en.length).toBeGreaterThan(0);
  });

  it('only flags rotation for slugs that exist in the gallery set', () => {
    const slugs = new Set(photos.map((p) => p.slug));
    for (const slug of Object.keys(rotateOnCopy)) expect(slugs.has(slug)).toBe(true);
  });
});
