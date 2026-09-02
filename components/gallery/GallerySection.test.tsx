import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/lib/useReducedMotion', () => ({ useReducedMotion: () => true }));

import { GallerySection } from './GallerySection';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'p2', category: 'portrait', sourceFile: 'p2.jpg', width: 720, height: 900, alt: { ru: 'Портрет 2', en: 'Portrait 2' } },
];

describe('GallerySection', () => {
  it('opens the lightbox on the clicked photo', async () => {
    render(<GallerySection photos={photos} locale="ru" />);
    await userEvent.click(screen.getByAltText('Портрет 2'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByAltText('Портрет 2')).toHaveLength(2); // grid thumbnail + lightbox
  });

  it('closes the lightbox', async () => {
    render(<GallerySection photos={photos} locale="ru" />);
    await userEvent.click(screen.getByAltText('Портрет 1'));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
