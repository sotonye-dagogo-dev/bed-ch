import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <SearchX className="h-16 w-16 text-primary mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-text mb-2">Page not found</h1>
        <p className="text-text-muted mb-8">The page you are looking for does not exist or has been moved. Try exploring our bestsellers or shop.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center font-semibold rounded-md bg-primary text-text-inverse hover:bg-primary-hover h-11 px-6"
          >
            Go home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center font-semibold rounded-md border border-border text-text hover:bg-bg-subtle h-11 px-6"
          >
            Browse shop
          </Link>
        </div>
      </div>
    </div>
  );
}
