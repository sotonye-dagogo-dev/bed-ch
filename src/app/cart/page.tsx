'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { cart, totals, isLoading, error, updateQuantity, removeItem, refreshCart } = useCart();
  const cartItems = cart?.items || [];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" aria-hidden="true" />
          <p className="text-text-muted">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-error mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-text mb-2">Error loading cart</h1>
          <p className="text-text-muted mb-6">{error}</p>
          <Button variant="primary" onClick={refreshCart} className="w-full">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-border mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-text mb-2">Your cart is empty</h1>
          <p className="text-text-muted mb-8">
            Looks like you haven't added anything yet. Time to find the perfect pieces for your bedroom.
          </p>
          <Link href="/shop" className="inline-flex items-center justify-center font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active h-14 px-8 text-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = totals.subtotal;
  const deliveryFee = totals.deliveryFee;
  const total = totals.total;

  return (
    <div className="pt-8 pb-16">
      <div className="container-custom">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-text mb-6">Your Cart ({totals.itemCount} items)</h1>

            <ul className="space-y-4" role="list" aria-label="Cart items">
              {cartItems.map((item) => (
                <CartPageItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 h-12 px-6 text-base w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-text">Order Summary</h2>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-text">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-1">
                      <Truck className="h-4 w-4" aria-hidden="true" />
                      Delivery (Standard)
                    </span>
                    <span className="font-medium text-text">
                      {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                      Free delivery on orders over ₦50,000
                    </p>
                  )}
                  <div className="flex justify-between text-base font-semibold text-text pt-3 border-t border-border">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active h-14 px-8 text-lg w-full"
                >
                  Proceed to Checkout
                </Link>

                <p className="text-center text-xs text-text-muted">
                  Secure checkout powered by Paystack
                </p>

                {/* Trust badges mini */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-trust-bg flex items-center justify-center mx-auto mb-1">
                      <Truck className="h-4 w-4 text-trust-text" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-trust-text">Same-Day Lagos</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-trust-bg flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-trust-text">POD</span>
                    </div>
                    <p className="text-xs text-trust-text">Pay on Delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-trust-bg flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-trust-text">7D</span>
                    </div>
                    <p className="text-xs text-trust-text">7-Day Returns</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPageItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: {
    id: string;
    variantId: string;
    quantity: number;
    variant: {
      id: string;
      sku: string;
      size: string | null;
      color: string | null;
      price: number | null;
      stock: number;
      product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        compareAt: number | null;
        images: string[];
      };
    };
  };
  onUpdateQuantity: (cartItemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  onRemove: (cartItemId: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const price = item.variant.price ?? item.variant.product.price;
  const image = item.variant.product.images[0] || '';
  const name = item.variant.product.name;
  const slug = item.variant.product.slug;
  const size = item.variant.size;
  const color = item.variant.color;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await onRemove(item.id);
      return;
    }
    if (newQuantity > item.variant.stock) {
      return;
    }
    await onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <li className="flex gap-4 p-4 bg-bg border border-border rounded-lg">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-bg-subtle">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${slug}`}
          className="font-medium text-text hover:text-primary transition-colors block truncate"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
          {size && <span>{size}</span>}
          {color && <span>· {color}</span>}
        </div>
        <p className="font-semibold text-text mt-2">{formatCurrency(price)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center border border-border rounded-md">
          <button
            className="p-2 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Decrease quantity of ${name}`}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="px-4 text-sm font-medium text-text min-w-[2rem] text-center">
            {item.quantity}
          </span>
          <button
            className="p-2 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Increase quantity of ${name}`}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.variant.stock}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="font-semibold text-text">
            {formatCurrency(price * item.quantity)}
          </span>
          <button
            className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Remove ${name} from cart`}
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}