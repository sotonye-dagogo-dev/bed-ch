'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Heading shown on the card. Segment boundaries override per route. */
  title?: string;
  /** Helper copy shown under the heading. */
  description?: string;
}

/**
 * Shared segment error UI (used by `error.tsx` boundaries).
 *
 * Recovery options:
 * - "Try Again" calls `reset()` — re-renders the failed segment in place
 *   without losing the rest of the app state.
 * - "Refresh Page" performs a full `window.location.reload()` — guaranteed
 *   recovery even when the segment error persists across resets.
 */
export function RouteError({
  error,
  reset,
  title = 'Something went wrong',
  description = 'We could not load this section. Please try again.',
}: RouteErrorProps) {
  useEffect(() => {
    try {
      console.error('Route segment error:', error);
    } catch {
      /* logging must never throw */
    }
  }, [error]);

  const handleReload = () => {
    try {
      window.location.reload();
    } catch {
      // Navigation unavailable (e.g. prerender) — fall back to reset.
      try {
        reset();
      } catch {
        /* no-op */
      }
    }
  };

  const handleRetry = () => {
    try {
      reset();
    } catch {
      handleReload();
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md text-center p-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-error" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">{title}</h1>
        <p className="text-text-muted mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={handleReload} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            Refresh Page
          </Button>
          <Button variant="secondary" onClick={handleRetry} className="w-full sm:w-auto">
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Go Home
            </Button>
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left p-4 bg-bg-subtle rounded-lg">
            <summary className="font-medium text-text cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-xs text-error overflow-auto max-h-64">
              {error.toString()}
            </pre>
          </details>
        )}
      </Card>
    </div>
  );
}
