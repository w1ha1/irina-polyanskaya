import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}));

import { useReducedMotion } from '@/lib/useReducedMotion';
import { SplitHeading } from './SplitHeading';

describe('SplitHeading', () => {
  it('renders the full text when motion is allowed (GSAP splits it into lines)', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(<SplitHeading as="h2">Фотограф Гюмри</SplitHeading>);
    expect(container.textContent).toContain('Фотограф Гюмри');
  });

  it('renders the full text unsplit when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<SplitHeading as="h2">Фотограф Гюмри</SplitHeading>);
    expect(container.textContent).toContain('Фотограф Гюмри');
  });

  it('renders the given tag', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<SplitHeading as="h1">Заголовок</SplitHeading>);
    expect(container.querySelector('h1')).not.toBeNull();
  });
});
