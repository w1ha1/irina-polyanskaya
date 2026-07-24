import { describe, it, expect } from 'vitest';
import { categoryLabels } from './categoryLabels';

describe('categoryLabels', () => {
  it('has the 3 known categories, in display order, with non-empty ru and en labels', () => {
    expect(Object.keys(categoryLabels)).toEqual(['portrait', 'love-story', 'fashion-night']);
    for (const id of Object.keys(categoryLabels)) {
      expect(categoryLabels[id].ru.length).toBeGreaterThan(0);
      expect(categoryLabels[id].en.length).toBeGreaterThan(0);
    }
  });
});
