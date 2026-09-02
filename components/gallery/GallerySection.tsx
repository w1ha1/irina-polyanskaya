'use client';

import { useState } from 'react';
import type { Photo } from '@/data/photos';
import type { Locale } from '@/content';
import { GalleryGrid } from './GalleryGrid';
import { Lightbox } from './Lightbox';

export function GallerySection({
  photos,
  locale,
}: {
  photos: Photo[];
  locale: Locale;
}) {
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  return (
    <>
      <GalleryGrid
        photos={photos}
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
