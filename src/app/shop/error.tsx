'use client';

import { RouteError } from '@/components/error/RouteError';

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Could not load the shop"
      description="We had trouble loading products. Check your connection, then refresh or try again."
    />
  );
}
