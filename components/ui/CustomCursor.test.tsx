import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}));

import { useReducedMotion } from '@/lib/useReducedMotion';
import { CustomCursor } from './CustomCursor';

describe('CustomCursor', () => {
  it('renders nothing when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<CustomCursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the cursor element when motion is allowed', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    render(<CustomCursor />);
    expect(screen.getByTestId('custom-cursor')).toBeInTheDocument();
  });
});
