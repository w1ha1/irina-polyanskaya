import { describe, it, expect, afterEach } from 'vitest';
import { withBasePath } from './basePath';

describe('withBasePath', () => {
  const original = process.env.BASE_PATH;

  afterEach(() => {
    process.env.BASE_PATH = original;
  });

  it('returns the path unchanged when BASE_PATH is unset', () => {
    delete process.env.BASE_PATH;
    expect(withBasePath('/photos/portrait/portrait-01.jpg')).toBe('/photos/portrait/portrait-01.jpg');
  });

  it('prefixes the path with BASE_PATH when set', () => {
    process.env.BASE_PATH = '/irina-polyanskaya';
    expect(withBasePath('/photos/portrait/portrait-01.jpg')).toBe(
      '/irina-polyanskaya/photos/portrait/portrait-01.jpg'
    );
  });
});
