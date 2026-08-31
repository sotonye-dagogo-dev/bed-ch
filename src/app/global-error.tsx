'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <Button variant="primary" onClick={reset}>
            Refresh Page
          </Button>
        </div>
      </body>
    </html>
  );
}