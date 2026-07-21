import { describe, it, expect } from 'vitest';
import { filterPhotos } from './filterPhotos';
import type { Photo } from '@/data/photos';

const sample: Photo[] = [
  { slug: 'a', category: 'portrait', sourceFile: 'a.jpg', width: 1, height: 1, alt: { ru: 'a', en: 'a' } },
  { slug: 'b', category: 'love-story', sourceFile: 'b.jpg', width: 1, height: 1, alt: { ru: 'b', en: 'b' } },
  { slug: 'c', category: 'fashion-night', sourceFile: 'c.jpg', width: 1, height: 1, alt: { ru: 'c', en: 'c' } },
];

describe('filterPhotos', () => {
  it('returns all photos when category is "all"', () => {
    expect(filterPhotos(sample, 'all')).toEqual(sample);
  });

  it('returns only photos matching the given category', () => {
    expect(filterPhotos(sample, 'portrait')).toEqual([sample[0]]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterPhotos([sample[0]], 'love-story')).toEqual([]);
  });
});
