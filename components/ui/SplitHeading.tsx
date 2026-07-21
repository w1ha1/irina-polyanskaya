'use client';

import { useEffect, useRef, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useReducedMotion } from '@/lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export function SplitHeading({
  children,
  as = 'h2',
  className,
}: {
  children: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const Tag = as;

  useEffect(() => {
    if (!ref.current || reducedMotion) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      const split = new GSAPSplitText(el, { type: 'lines', linesClass: 'overflow-hidden' });
      gsap.fromTo(
        split.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
