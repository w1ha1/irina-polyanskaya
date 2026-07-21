import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from './lightboxNav';

describe('nextIndex', () => {
  it('advances to the next index', () => {
    expect(nextIndex(0, 3)).toBe(1);
  });

  it('wraps from the last index back to 0', () => {
    expect(nextIndex(2, 3)).toBe(0);
  });
});

describe('prevIndex', () => {
  it('goes back to the previous index', () => {
    expect(prevIndex(1, 3)).toBe(0);
  });

  it('wraps from 0 back to the last index', () => {
    expect(prevIndex(0, 3)).toBe(2);
  });
});
