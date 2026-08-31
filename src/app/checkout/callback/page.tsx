'use client';

import { Suspense } from 'react';
import { CheckoutCallbackContent } from './CheckoutCallbackContent';

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md text-center p-8">
          <div className="h-12 w-12 text-primary animate-spin mx-auto mb-6" aria-hidden="true">
            <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Verifying Payment</h1>
          <p className="text-text-muted">Please wait while we confirm your payment...</p>
        </div>
      </div>
    }>
      <CheckoutCallbackContent />
    </Suspense>
  );
}