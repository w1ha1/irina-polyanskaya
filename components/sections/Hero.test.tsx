import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the RU kicker, name, and subhead', () => {
    render(<Hero locale="ru" />);
    expect(screen.getByText('ФОТОГРАФ · ЕРЕВАН · ГЮМРИ')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ирина Полянская');
    expect(screen.getByText(/Авторские съёмки с атмосферой кино/)).toBeInTheDocument();
  });

  it('renders the primary CTA linking to Telegram and secondary CTA to the gallery', () => {
    render(<Hero locale="ru" />);
    expect(screen.getByRole('link', { name: 'Записаться на съёмку' }).getAttribute('href')).toMatch(
      /t\.me\/polka977/
    );
    expect(screen.getByRole('link', { name: 'Смотреть работы' }).getAttribute('href')).toBe('/gallery');
  });

  it('renders the EN secondary CTA pointing at /en/gallery', () => {
    render(<Hero locale="en" />);
    expect(screen.getByRole('link', { name: 'View the work' }).getAttribute('href')).toBe('/en/gallery');
  });
});
