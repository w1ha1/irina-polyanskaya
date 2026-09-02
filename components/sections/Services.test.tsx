import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Services } from './Services';

describe('Services', () => {
  it('renders all 5 RU services', () => {
    render(<Services locale="ru" />);
    expect(screen.getByText('Портретная съёмка')).toBeInTheDocument();
    expect(screen.getByText('Love story')).toBeInTheDocument();
    expect(screen.getByText('Коммерческая съёмка')).toBeInTheDocument();
    expect(screen.getByText('Съёмка мероприятий')).toBeInTheDocument();
    expect(screen.getByText('Семейная съёмка')).toBeInTheDocument();
  });

  it('renders all 5 EN services', () => {
    render(<Services locale="en" />);
    expect(screen.getByText('Portrait session')).toBeInTheDocument();
    expect(screen.getByText('Love story')).toBeInTheDocument();
    expect(screen.getByText('Commercial photography')).toBeInTheDocument();
    expect(screen.getByText('Event photography')).toBeInTheDocument();
    expect(screen.getByText('Family session')).toBeInTheDocument();
  });

  it('renders all 5 cards as plain text, with no photo (no representative commercial photo exists)', () => {
    render(<Services locale="ru" />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});
