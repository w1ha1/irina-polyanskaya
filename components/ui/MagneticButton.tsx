'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

const baseClass =
  'inline-flex items-center justify-center rounded-full border border-ink px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper';

export function MagneticButton({
  children,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(baseClass, className)}
        >
          {children}
        </a>
      );
    }

    // next/link (not a plain <a>) so basePath is applied automatically —
    // GitHub Pages serves this site from a /irina-polyanskaya subpath, see
    // next.config.ts.
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(baseClass, className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(baseClass, className)}
    >
      {children}
    </button>
  );
}
