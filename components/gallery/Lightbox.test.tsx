import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Lightbox } from './Lightbox';
import type { Photo } from '@/data/photos';

const photos: Photo[] = [
  { slug: 'p1', category: 'portrait', sourceFile: 'p1.jpg', width: 720, height: 900, alt: { ru: 'Портрет 1', en: 'Portrait 1' } },
  { slug: 'p2', category: 'portrait', sourceFile: 'p2.jpg', width: 720, height: 900, alt: { ru: 'Портрет 2', en: 'Portrait 2' } },
];

describe('Lightbox', () => {
  it('renders the photo at the given index', () => {
    render(<Lightbox photos={photos} index={0} locale="ru" onClose={() => {}} onNavigate={() => {}} />);
    expect(screen.getByAltText('Портрет 1')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Lightbox photos={photos} index={0} locale="ru" onClose={onClose} onNavigate={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onNavigate with the wrapped-around next index', async () => {
    const onNavigate = vi.fn();
    render(<Lightbox photos={photos} index={1} locale="ru" onClose={() => {}} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('closes on Escape and navigates on the right arrow key', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    render(<Lightbox photos={photos} index={0} locale="ru" onClose={onClose} onNavigate={onNavigate} />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigate).toHaveBeenCalledWith(1);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
