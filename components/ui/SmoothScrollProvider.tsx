'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // Lenis drives its own virtual scroll position instead of the native one,
    // so ScrollTrigger has to be told explicitly when it moves — otherwise its
    // trigger points are calculated against a scroll reference that silently
    // drifts from what's on screen, which surfaced as reveal animations firing
    // inconsistently (worked some page loads, not others).
    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Web fonts (Cormorant especially, used for large headings) swap in after
    // ScrollTrigger has already measured trigger positions off the fallback
    // font's metrics; a refresh once they're actually loaded keeps positions
    // accurate instead of relying on luck/cache-warm reloads.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
