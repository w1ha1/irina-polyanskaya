import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function HudFrame({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l border-t border-gold" />
      <span className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r border-t border-gold" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-gold" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-gold" />
      {label && (
        <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-wider text-gold">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
