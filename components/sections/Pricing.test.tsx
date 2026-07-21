import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pricing } from './Pricing';

describe('Pricing', () => {
  it('renders both RU tiers with prices', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText('STANDARD')).toBeInTheDocument();
    expect(screen.getByText('6 000 ₽')).toBeInTheDocument();
    expect(screen.getByText('EXPRESS')).toBeInTheDocument();
    expect(screen.getByText('3 500 ₽')).toBeInTheDocument();
  });

  it('renders both EN tiers with prices', () => {
    render(<Pricing locale="en" />);
    expect(screen.getByText('6,000 ₽')).toBeInTheDocument();
    expect(screen.getByText('3,500 ₽')).toBeInTheDocument();
  });

  it('renders the footnote mentioning the extra-photo price', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText(/150 ₽/)).toBeInTheDocument();
  });
});
