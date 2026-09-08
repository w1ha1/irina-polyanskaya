'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { altText, type Photo, type PhotoCategory } from '@/data/photos';
import type { Locale } from '@/content';
import { filterPhotos } from '@/lib/filterPhotos';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { CategoryFilter } from './CategoryFilter';

gsap.registerPlugin(Flip);

export function GalleryGrid({
  photos,
  filters,
  locale,
  onPhotoClick,
}: {
  photos: Photo[];
  filters: { id: 'all' | PhotoCategory; label: string }[];
  locale: Locale;
  onPhotoClick: (photo: Photo, visiblePhotos: Photo[]) => void;
}) {
  const [active, setActive] = useState<'all' | PhotoCategory>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const visible = filterPhotos(photos, active);

  function handleChange(id: string) {
    const nextCategory = id as 'all' | PhotoCategory;
    if (reducedMotion || !gridRef.current) {
      setActive(nextCategory);
      return;
    }
    const state = Flip.getState(gridRef.current.children);
    setActive(nextCategory);
    requestAnimationFrame(() => {
      if (!gridRef.current) return;
      Flip.from(state, { duration: 0.5, ease: 'power2.out', stagger: 0.02, absolute: true });
    });
  }

  return (
    <div>
      <CategoryFilter filters={filters} active={active} onChange={handleChange} />
      <div ref={gridRef} className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4">
        {visible.map((photo) => (
          <button
            key={photo.slug}
            type="button"
            onClick={() => onPhotoClick(photo, visible)}
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
    </div>
  );
}
