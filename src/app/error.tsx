'use client';

import { RouteError } from '@/components/error/RouteError';

export default function RootError({
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
      title="Something went wrong"
      description="We encountered an unexpected error. Please refresh the page or try again."
    />
  );
}
