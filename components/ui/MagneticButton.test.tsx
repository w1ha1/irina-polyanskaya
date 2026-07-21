import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MagneticButton } from './MagneticButton';

describe('MagneticButton', () => {
  it('renders as a link when href is given', () => {
    render(<MagneticButton href="/gallery">Смотреть работы</MagneticButton>);
    const link = screen.getByRole('link', { name: 'Смотреть работы' });
    expect(link).toHaveAttribute('href', '/gallery');
  });

  it('renders as a button and fires onClick when no href is given', async () => {
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>Записаться</MagneticButton>);
    const button = screen.getByRole('button', { name: 'Записаться' });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('marks itself as a cursor focus target', () => {
    render(<MagneticButton onClick={() => {}}>Записаться</MagneticButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-cursor-focus');
  });
});
