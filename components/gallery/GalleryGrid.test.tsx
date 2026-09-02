import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GalleryGrid } from './GalleryGrid';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'l1', category: 'love-story', sourceFile: 'l1.jpg', width: 720, height: 900, alt: { ru: 'Лав стори 1', en: 'Love story 1' } },
  { slug: 'f1', category: 'fashion-night', sourceFile: 'f1.jpg', width: 720, height: 900, alt: { ru: 'Фэшн 1', en: 'Fashion 1' } },
];

describe('GalleryGrid', () => {
  it('shows all photos', () => {
    render(<GalleryGrid photos={photos} locale="ru" onPhotoClick={() => {}} />);
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('calls onPhotoClick with the clicked photo and the full photos list', async () => {
    const onPhotoClick = vi.fn();
    render(<GalleryGrid photos={photos} locale="ru" onPhotoClick={onPhotoClick} />);
    await userEvent.click(screen.getByAltText('Портрет 1'));
    expect(onPhotoClick).toHaveBeenCalledWith(photos[0], photos);
  });
});
