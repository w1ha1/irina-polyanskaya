import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevealImage } from './RevealImage';

describe('RevealImage', () => {
  it('renders an image with the given src and alt text', () => {
    render(<RevealImage src="/photos/portrait/portrait-04.jpg" alt="A man standing by an old stone wall" width={720} height={900} />);
    const img = screen.getByAltText('A man standing by an old stone wall');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
  });
});
