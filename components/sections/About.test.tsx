import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About', () => {
  it('renders the RU heading and bio', () => {
    render(<About locale="ru" />);
    expect(screen.getByRole('heading', { name: 'Обо мне' })).toBeInTheDocument();
    expect(screen.getByText(/Пять лет работы с портретом/)).toBeInTheDocument();
  });

  it('renders the EN heading and bio', () => {
    render(<About locale="en" />);
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByText(/Five years shooting portraits/)).toBeInTheDocument();
  });

  it('renders the about photo with locale-specific alt text', () => {
    render(<About locale="ru" />);
    expect(screen.getByAltText('Ирина Полянская в тёплом ночном свете, портрет')).toBeInTheDocument();
  });
});
