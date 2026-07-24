import { UNCATEGORIZED_CATEGORY, type Photo } from '@/data/photos';

export function buildGalleryFilters(
  photos: Photo[],
  categoryLabels: Record<string, { ru: string; en: string }>,
  allLabel: string,
  locale: 'ru' | 'en'
): { id: string; label: string }[] {
  const present = new Set(photos.map((p) => p.category));
  present.delete(UNCATEGORIZED_CATEGORY);
  const knownIds = Object.keys(categoryLabels).filter((id) => present.has(id));
  const unknownIds = [...present].filter((id) => !(id in categoryLabels)).sort();
  const categoryFilters = [...knownIds, ...unknownIds].map((id) => ({
    id,
    label: categoryLabels[id]?.[locale] ?? id,
  }));
  return [{ id: 'all', label: allLabel }, ...categoryFilters];
}
