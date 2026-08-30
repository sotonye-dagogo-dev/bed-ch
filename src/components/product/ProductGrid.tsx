'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  images: string[];
  isBestseller: boolean;
  category?: { name: string; slug: string };
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
      role="list"
      aria-label="Products"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <Card variant="product" as="article" className="group">
      <Link href={`/product/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            {product.isBestseller && (
              <Badge variant="success" size="sm">Bestseller</Badge>
            )}
            {discount > 0 && (
              <Badge variant="error" size="sm">-{discount}%</Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-fast translate-y-2 group-hover:translate-y-0">
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex items-center justify-center font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 h-10 px-4 text-sm flex-1"
            >
              View Details
            </Link>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {product.category && (
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {product.category.name}
            </p>
          )}
          <h3 className="font-medium text-text truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-text-muted line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}