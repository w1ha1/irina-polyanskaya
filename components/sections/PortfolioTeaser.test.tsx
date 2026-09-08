import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioTeaser } from './PortfolioTeaser';

describe('PortfolioTeaser', () => {
  it('renders exactly 6 teaser photos', () => {
    render(<PortfolioTeaser locale="ru" />);
    expect(screen.getAllByRole('img')).toHaveLength(6);
  });

  it('links "view all" to the RU gallery', () => {
    render(<PortfolioTeaser locale="ru" />);
    expect(screen.getByRole('link', { name: 'Смотреть всё портфолио' }).getAttribute('href')).toBe('/ru/gallery');
  });

  it('links "view all" to the EN gallery', () => {
    render(<PortfolioTeaser locale="en" />);
    expect(screen.getByRole('link', { name: 'View the full portfolio' }).getAttribute('href')).toBe(
      '/en/gallery'
    );
  });
});
