import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilter } from './CategoryFilter';

const filters = [
  { id: 'all', label: 'Все' },
  { id: 'portrait', label: 'Портрет' },
];

describe('CategoryFilter', () => {
  it('marks the active filter as selected', () => {
    render(<CategoryFilter filters={filters} active="all" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Все' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Портрет' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with the clicked filter id', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter filters={filters} active="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Портрет' }));
    expect(onChange).toHaveBeenCalledWith('portrait');
  });
});
