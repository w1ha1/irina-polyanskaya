'use client';

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
  return (
    <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap gap-3">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={active === f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            'rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors',
            active === f.id ? 'border-ink bg-ink text-paper' : 'border-ink/30 text-ink/70 hover:border-ink'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
