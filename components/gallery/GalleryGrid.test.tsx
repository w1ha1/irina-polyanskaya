import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: () => true, // skip GSAP Flip timing in tests
}));

import { GalleryGrid } from './GalleryGrid';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'l1', category: 'love-story', sourceFile: 'l1.jpg', width: 720, height: 900, alt: { ru: 'Лав стори 1', en: 'Love story 1' } },
  { slug: 'f1', category: 'fashion-night', sourceFile: 'f1.jpg', width: 720, height: 900, alt: { ru: 'Фэшн 1', en: 'Fashion 1' } },
];

const filters = [
  { id: 'all' as const, label: 'Все' },
  { id: 'portrait' as const, label: 'Портрет' },
  { id: 'love-story' as const, label: 'Love story' },
  { id: 'fashion-night' as const, label: 'Фэшн/Ночная съёмка' },
];

describe('GalleryGrid', () => {
  it('shows all photos by default', () => {
    render(<GalleryGrid photos={photos} filters={filters} locale="ru" onPhotoClick={() => {}} />);
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('narrows to the selected category', async () => {
    render(<GalleryGrid photos={photos} filters={filters} locale="ru" onPhotoClick={() => {}} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Портрет' }));
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByAltText('Портрет 1')).toBeInTheDocument();
  });

  it('calls onPhotoClick with the clicked photo and the currently visible set', async () => {
    const onPhotoClick = vi.fn();
    render(<GalleryGrid photos={photos} filters={filters} locale="ru" onPhotoClick={onPhotoClick} />);
    await userEvent.click(screen.getByAltText('Портрет 1'));
    expect(onPhotoClick).toHaveBeenCalledWith(photos[0], photos);
  });
});
