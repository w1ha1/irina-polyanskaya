import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('renders RU nav labels and a language switch link to the EN home', () => {
    render(<SiteHeader locale="ru" />);
    expect(screen.getByText('Обо мне')).toBeInTheDocument();
    expect(screen.getByText('Портфолио')).toBeInTheDocument();
    const langLink = screen.getByRole('link', { name: 'Switch language' });
    expect(langLink.getAttribute('href')).toBe('/en');
  });

  it('renders the booking CTA linking to Telegram with a prefilled message', () => {
    render(<SiteHeader locale="ru" />);
    const cta = screen.getByRole('link', { name: 'Записаться' });
    expect(cta.getAttribute('href')).toMatch(/^https:\/\/t\.me\/polka977\?text=/);
  });
});
