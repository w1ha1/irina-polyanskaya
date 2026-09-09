'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

export function CategoryFilter({
  filters,
  active,
  onChange,
}: {
  filters: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reducedMotion = useReducedMotion();

  function handleClick(id: string) {
    onChange(id);
    const el = buttonRefs.current[id];
    if (reducedMotion || !el) return;
    gsap.fromTo(el, { scale: 0.88 }, { scale: 1, duration: 0.45, ease: 'back.out(2.5)' });
  }

  return (
    <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap gap-3">
      {filters.map((f) => (
        <button
          key={f.id}
          ref={(el) => {
            buttonRefs.current[f.id] = el;
          }}
          type="button"
          role="tab"
          aria-selected={active === f.id}
          onClick={() => handleClick(f.id)}
          className={cn(
            'rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors active:scale-95',
            active === f.id ? 'border-wine bg-wine text-paper' : 'border-ink/15 text-ink/70 hover:border-wine/50'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
