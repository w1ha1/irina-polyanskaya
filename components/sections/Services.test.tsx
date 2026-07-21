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
    expect(screen.getByText('Portrait')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('illustrates the commercial service with the commercial photo', () => {
    render(<Services locale="ru" />);
    expect(
      screen.getByAltText('Детальный кадр украшения на коже, пример предметной съёмки')
    ).toBeInTheDocument();
  });
});
