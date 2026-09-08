import type { Photo, PhotoCategory } from '@/data/photos';

export function filterPhotos(photos: Photo[], category: 'all' | PhotoCategory): Photo[] {
  if (category === 'all') return photos;
  return photos.filter((p) => p.category === category);
}
