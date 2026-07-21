'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Deliberately setting state synchronously in the effect body (not a lazy
    // useState initializer) so server and first client render both yield `false`.
    // window.matchMedia only exists client-side; reading it during render would
    // desync the SSR/hydration output whenever the visitor's actual preference is
    // `true`, causing a hydration mismatch in any consumer that branches on this value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mql.matches);

    function handleChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
