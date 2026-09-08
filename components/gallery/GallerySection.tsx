'use client';

import { useState } from 'react';
import type { Photo, PhotoCategory } from '@/data/photos';
import type { Locale } from '@/content';
import { GalleryGrid } from './GalleryGrid';
import { Lightbox } from './Lightbox';

export function GallerySection({
  photos,
  filters,
  locale,
}: {
  photos: Photo[];
  filters: { id: 'all' | PhotoCategory; label: string }[];
  locale: Locale;
}) {
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  return (
    <>
      <GalleryGrid
        photos={photos}
        filters={filters}
        locale={locale}
        onPhotoClick={(photo, visiblePhotos) =>
          setLightbox({
            photos: visiblePhotos,
            index: visiblePhotos.findIndex((p) => p.slug === photo.slug),
          })
        }
      />
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          locale={locale}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox((state) => (state ? { ...state, index } : state))}
        />
      )}
    </>
  );
}
