import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Services } from './Services';

describe('Services', () => {
  it('renders both RU services', () => {
    render(<Services locale="ru" />);
    expect(screen.getByText('Индивидуальная')).toBeInTheDocument();
    expect(screen.getByText('История про Вас.')).toBeInTheDocument();
    expect(screen.getByText('Love story')).toBeInTheDocument();
    expect(screen.getByText('Ваша история — в кадрах, взглядах и моменте.')).toBeInTheDocument();
  });

  it('renders both EN services', () => {
    render(<Services locale="en" />);
    expect(screen.getByText('Individual')).toBeInTheDocument();
    expect(screen.getByText('Love story')).toBeInTheDocument();
  });

  it('renders the cards as plain text, with no photo', () => {
    render(<Services locale="ru" />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});
