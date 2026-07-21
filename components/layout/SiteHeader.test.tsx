import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    const cta = screen.getAllByRole('link', { name: 'Записаться' })[0];
    expect(cta.getAttribute('href')).toMatch(/^https:\/\/t\.me\/polka977\?text=/);
  });

  it('mobile menu panel is absent by default and appears on toggle (desktop nav, hidden via CSS on small screens, stays in the DOM either way)', async () => {
    render(<SiteHeader locale="ru" />);
    expect(screen.getAllByRole('link', { name: 'Услуги' })).toHaveLength(1);
    const toggle = screen.getByRole('button', { name: 'Открыть меню' });
    await userEvent.click(toggle);
    expect(screen.getAllByRole('link', { name: 'Услуги' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Закрыть меню' })).toBeInTheDocument();
  });

  it('closes the mobile menu panel when one of its nav links is clicked', async () => {
    render(<SiteHeader locale="ru" />);
    await userEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    const mobileLinks = screen.getAllByRole('link', { name: 'Услуги' });
    await userEvent.click(mobileLinks[mobileLinks.length - 1]);
    expect(screen.getAllByRole('link', { name: 'Услуги' })).toHaveLength(1);
  });
});
