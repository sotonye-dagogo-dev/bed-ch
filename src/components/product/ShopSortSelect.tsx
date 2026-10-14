'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Best Selling' },
] as const;

/**
 * Client-only sort control for the Shop page.
 * Extracted from the Server Component so `window` / navigation APIs never
 * execute during server rendering (a co-cause of shop-route crashes).
 * Null-safe: works even when searchParams is null during prerender.
 */
function ShopSortSelectInner({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  // NOTE: called unconditionally (rules-of-hooks); may be null during
  // static prerender — all reads below are null-guarded.
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    try {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.set('sortBy', value);
      params.delete('page');
      router.push(`?${params.toString()}`);
    } catch {
      // Fallback for edge cases (e.g. prerender without search params)
      try {
        window.location.href = `?sortBy=${encodeURIComponent(value)}`;
      } catch {
        /* no-op: navigation unavailable */
      }
    }
  };

  return (
    <select
      className="w-full sm:w-auto h-10 px-4 bg-bg border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
      defaultValue={defaultValue}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function ShopSortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <Suspense
      fallback={
        <select
          className="w-full sm:w-auto h-10 px-4 bg-bg border border-border rounded-md text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          defaultValue={defaultValue}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      }
    >
      <ShopSortSelectInner defaultValue={defaultValue} />
    </Suspense>
  );
}
