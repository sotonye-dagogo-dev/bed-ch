'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleReload = () => {
    try {
      // Full page reload guarantees recovery even when the error persists
      // across segment resets (reset() alone often re-throws the same error).
      window.location.reload();
    } catch {
      try {
        reset();
      } catch {
        /* no-op */
      }
    }
  };

  return (
    <html lang="en-NG">
      <head>
        <title>Error - Bedroom Chapters</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-md text-center p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-error" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Application Error</h1>
          <p className="text-text-muted mb-6">
            Something went wrong. Please try refreshing the page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={handleReload} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Refresh Page
            </Button>
            <a href="/" className="w-full sm:w-auto inline-flex">
              <Button variant="secondary" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Home
              </Button>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}