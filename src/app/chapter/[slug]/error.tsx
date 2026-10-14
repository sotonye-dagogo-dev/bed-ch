'use client';

import { RouteError } from '@/components/error/RouteError';

export default function ChapterError({
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
      title="Could not load this chapter"
      description="We had trouble loading this chapter. Please refresh the page or try again."
    />
  );
}
