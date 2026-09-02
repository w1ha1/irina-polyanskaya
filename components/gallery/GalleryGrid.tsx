'use client';

import Image from 'next/image';
import { altText, type Photo } from '@/data/photos';
import type { Locale } from '@/content';

export function GalleryGrid({
  photos,
  locale,
  onPhotoClick,
}: {
  photos: Photo[];
  locale: Locale;
  onPhotoClick: (photo: Photo, visiblePhotos: Photo[]) => void;
}) {
  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
      {photos.map((photo) => (
        <button
          key={photo.slug}
          type="button"
          onClick={() => onPhotoClick(photo, photos)}
          className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm"
        >
          <Image
            src={`/photos/${photo.category}/${photo.slug}.jpg`}
            alt={altText(photo.alt, locale)}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="h-auto w-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
