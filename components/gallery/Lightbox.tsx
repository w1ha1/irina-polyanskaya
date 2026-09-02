'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { altText, type Photo } from '@/data/photos';
import type { Locale } from '@/content';
import { nextIndex, prevIndex } from '@/lib/lightboxNav';

export function Lightbox({
  photos,
  index,
  locale,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number;
  locale: Locale;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const photo = photos[index];

  const handleNext = useCallback(
    () => onNavigate(nextIndex(index, photos.length)),
    [index, photos.length, onNavigate]
  );
  const handlePrev = useCallback(
    () => onNavigate(prevIndex(index, photos.length)),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, handleNext, handlePrev]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={altText(photo.alt, locale)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95"
      onClick={onClose}
    >
      <button
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-6 top-6 text-3xl text-paper"
      >
        &times;
      </button>
      {photos.length > 1 && (
        <button
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 text-3xl text-paper md:left-8"
        >
          &#8592;
        </button>
      )}
      <div className="relative max-h-[85vh] max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={`/photos/${photo.category}/${photo.slug}.jpg`}
          alt={altText(photo.alt, locale)}
          width={photo.width}
          height={photo.height}
          sizes="85vw"
          className="max-h-[85vh] w-auto object-contain"
        />
      </div>
      {photos.length > 1 && (
        <button
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 text-3xl text-paper md:right-8"
        >
          &#8594;
        </button>
      )}
    </div>
  );
}
