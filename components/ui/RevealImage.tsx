'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cn } from '@/lib/cn';

gsap.registerPlugin(ScrollTrigger);

export function RevealImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reducedMotion) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power3.out',
          // A finished inset(0%) clip-path is a visual no-op but its mere
          // presence still creates a new stacking context — with certain
          // GPU/compositing setups that stranded context stops sibling
          // absolutely-positioned elements (the HudFrame corner label) from
          // painting at all. Dropping the inline style once the reveal is
          // done removes the stacking context along with it.
          clearProps: 'clipPath',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
