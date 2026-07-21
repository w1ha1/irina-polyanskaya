import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HudFrame } from './HudFrame';

describe('HudFrame', () => {
  it('renders its children', () => {
    render(
      <HudFrame>
        <p>content</p>
      </HudFrame>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders an optional label', () => {
    render(
      <HudFrame label="35mm · f/1.8">
        <p>content</p>
      </HudFrame>
    );
    expect(screen.getByText('35mm · f/1.8')).toBeInTheDocument();
  });

  it('omits the label element when none is given', () => {
    render(
      <HudFrame>
        <p>content</p>
      </HudFrame>
    );
    expect(screen.queryByText(/f\/1\.8/)).not.toBeInTheDocument();
  });
});
