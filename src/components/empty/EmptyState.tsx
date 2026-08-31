'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { ShoppingCart, Package, Search, Truck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      {icon && (
        <div className="mx-auto w-16 h-16 rounded-full bg-border flex items-center justify-center mb-6 text-border-strong">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold text-text mb-2">{title}</h2>
      <p className="text-text-muted mb-6 max-w-sm">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button variant={action.variant || 'primary'} className="w-full sm:w-auto">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}

export function EmptyCartState() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-8 w-8" aria-hidden="true" />}
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Time to find the perfect pieces for your bedroom."
      action={{ label: 'Continue Shopping', href: '/shop' }}
    />
  );
}

export function EmptyProductState() {
  return (
    <EmptyState
      icon={<Package className="h-8 w-8" aria-hidden="true" />}
      title="No products found"
      description="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
      action={{ label: 'Clear Filters', href: '/shop', variant: 'secondary' }}
    />
  );
}

export function EmptySearchState() {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8" aria-hidden="true" />}
      title="No results found"
      description="Your search didn't match any products. Try different keywords or browse our categories."
      action={{ label: 'Browse All Products', href: '/shop' }}
    />
  );
}

export function EmptyWishlistState() {
  return (
    <EmptyState
      icon={<Heart className="h-8 w-8" aria-hidden="true" />}
      title="Your wishlist is empty"
      description="Save products you love to your wishlist and come back to them later."
      action={{ label: 'Start Shopping', href: '/shop' }}
    />
  );
}

export function EmptyOrderState() {
  return (
    <EmptyState
      icon={<Truck className="h-8 w-8" aria-hidden="true" />}
      title="No orders yet"
      description="When you place an order, it will appear here. You can track status and view details."
      action={{ label: 'Start Shopping', href: '/shop' }}
    />
  );
}