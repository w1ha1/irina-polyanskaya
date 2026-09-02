import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders the RU location and both contact links', () => {
    render(<SiteFooter locale="ru" />);
    expect(screen.getByText('Ереван, Гюмри, Армения')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Telegram' }).getAttribute('href')).toMatch(/t\.me\/polka977/);
    expect(screen.getByRole('link', { name: 'Instagram' }).getAttribute('href')).toBe(
      'https://instagram.com/polyanskaya_photo7'
    );
  });

  it('renders the EN location', () => {
    render(<SiteFooter locale="en" />);
    expect(screen.getByText('Yerevan, Gyumri, Armenia')).toBeInTheDocument();
  });
});
