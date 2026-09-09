import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pricing } from './Pricing';

describe('Pricing', () => {
  it('defaults to Yerevan prices for both RU tiers', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText('STANDARD')).toBeInTheDocument();
    expect(screen.getByText('60 000 ֏')).toBeInTheDocument();
    expect(screen.getByText('EXPRESS')).toBeInTheDocument();
    expect(screen.getByText('45 000 ֏')).toBeInTheDocument();
  });

  it('defaults to Yerevan prices for both EN tiers', () => {
    render(<Pricing locale="en" />);
    expect(screen.getByText('60,000 ֏')).toBeInTheDocument();
    expect(screen.getByText('45,000 ֏')).toBeInTheDocument();
  });

  it('switches both tiers to Gyumri prices when the Gyumri toggle is clicked', async () => {
    render(<Pricing locale="ru" />);
    await userEvent.click(screen.getByRole('button', { name: 'Гюмри' }));
    expect(screen.getByText('40 000 ֏')).toBeInTheDocument();
    expect(screen.getByText('25 000 ֏')).toBeInTheDocument();
    expect(screen.queryByText('60 000 ֏')).not.toBeInTheDocument();
    expect(screen.queryByText('45 000 ֏')).not.toBeInTheDocument();
  });

  it('renders the footnote mentioning the extra-photo price', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText(/1500 ֏/)).toBeInTheDocument();
  });

  it('renders the prepayment note', () => {
    render(<Pricing locale="ru" />);
    expect(screen.getByText(/50% от стоимости выбранного пакета/)).toBeInTheDocument();
  });
});
