'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = dotRef.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      el!.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }

    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      el!.dataset.state = target.closest('a, button, [data-cursor-focus]') ? 'focus' : 'default';
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={dotRef}
      data-testid="custom-cursor"
      data-state="default"
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-3 -mt-3 hidden h-6 w-6 rounded-full border border-ink mix-blend-difference transition-[width,height] duration-150 ease-out data-[state=focus]:h-4 data-[state=focus]:w-4 data-[state=focus]:border-2 md:block"
    />
  );
}
