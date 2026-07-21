import '@testing-library/jest-dom/vitest';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom does not implement ResizeObserver; GSAP/ScrollTrigger expects it to exist.
// (No @ts-expect-error needed: tsconfig's "dom" lib already declares the global,
// so the assignment type-checks on its own under this project's config.)
global.ResizeObserver = global.ResizeObserver ?? ResizeObserverStub;

// jsdom has never implemented window.matchMedia. Components that call
// useReducedMotion() without mocking it (e.g. MagneticButton) need a default
// implementation to exist so the hook doesn't throw. Individual tests that
// care about a specific reduced-motion value (see lib/useReducedMotion.test.tsx)
// override this per-test with their own mock.
window.matchMedia =
  window.matchMedia ??
  ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList);
