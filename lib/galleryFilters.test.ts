import { describe, it, expect } from 'vitest';
import { buildGalleryFilters } from './galleryFilters';
import { UNCATEGORIZED_CATEGORY, type Photo } from '@/data/photos';

function photo(slug: string, category: string): Photo {
  return {
    slug,
    category,
    sourceFile: `${slug}.jpg`,
    width: 100,
    height: 100,
    alt: { ru: slug, en: slug },
  };
}

const labels = {
  portrait: { ru: 'Портрет', en: 'Portrait' },
  'love-story': { ru: 'Love story', en: 'Love story' },
  'fashion-night': { ru: 'Фэшн/Ночная съёмка', en: 'Fashion/Night' },
};

describe('buildGalleryFilters', () => {
  it('always puts "all" first', () => {
    const filters = buildGalleryFilters([photo('p-01', 'portrait')], labels, 'Все', 'ru');
    expect(filters[0]).toEqual({ id: 'all', label: 'Все' });
  });

  it('only includes categories that have at least one photo', () => {
    const filters = buildGalleryFilters([photo('p-01', 'portrait')], labels, 'Все', 'ru');
    expect(filters.map((f) => f.id)).toEqual(['all', 'portrait']);
  });

  it('hides a category once it has zero photos', () => {
    const filters = buildGalleryFilters([photo('f-01', 'fashion-night')], labels, 'Все', 'ru');
    const ids = filters.map((f) => f.id);
    expect(ids).not.toContain('portrait');
    expect(ids).not.toContain('love-story');
  });

  it('orders known categories the same way regardless of photo order', () => {
    const photos = [photo('f-01', 'fashion-night'), photo('l-01', 'love-story'), photo('p-01', 'portrait')];
    const filters = buildGalleryFilters(photos, labels, 'Все', 'ru');
    expect(filters.map((f) => f.id)).toEqual(['all', 'portrait', 'love-story', 'fashion-night']);
  });

  it('falls back to the raw id as the label for an unlisted category', () => {
    const filters = buildGalleryFilters([photo('c-01', 'commercial')], labels, 'Все', 'ru');
    expect(filters).toContainEqual({ id: 'commercial', label: 'commercial' });
  });

  it('uses the requested locale for known labels', () => {
    const filters = buildGalleryFilters([photo('p-01', 'portrait')], labels, 'All', 'en');
    expect(filters).toContainEqual({ id: 'portrait', label: 'Portrait' });
  });

  it('places known categories before unknown ones, and sorts unknown categories alphabetically among themselves', () => {
    const photos = [
      photo('z-01', 'zebra'),
      photo('p-01', 'portrait'),
      photo('a-01', 'apple'),
    ];
    const filters = buildGalleryFilters(photos, labels, 'Все', 'ru');
    expect(filters.map((f) => f.id)).toEqual(['all', 'portrait', 'apple', 'zebra']);
  });

  it('never creates a filter pill for the reserved uncategorized category', () => {
    const photos = [photo('u-01', UNCATEGORIZED_CATEGORY), photo('p-01', 'portrait')];
    const filters = buildGalleryFilters(photos, labels, 'Все', 'ru');
    expect(filters.map((f) => f.id)).toEqual(['all', 'portrait']);
  });
});
