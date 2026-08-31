'use client';

import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

interface CartSlideOutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSlideOut({ isOpen, onClose }: CartSlideOutProps) {
  const { cart, totals, isLoading, error, updateQuantity, removeItem, refreshCart } = useCart();

  if (!isOpen) return null;

  const cartItems = cart?.items || [];

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-bg shadow-xl w-full max-w-sm md:max-w-[480px]"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border sticky top-0 bg-bg/95 backdrop-blur z-10">
            <div>
              <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" aria-hidden="true" />
                Your Cart
              </h2>
              <p className="text-sm text-text-muted">{totals.itemCount} item{totals.itemCount !== 1 ? 's' : ''}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close cart"
              className="p-1 -mr-2 -mt-2"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" aria-hidden="true" />
                <p className="text-text-muted">Loading cart...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <ShoppingCart className="h-12 w-12 text-error mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-text mb-1">Error loading cart</h3>
                <p className="text-text-muted text-sm mb-4">{error}</p>
                <Button variant="primary" onClick={refreshCart} className="w-full">
                  Retry
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <ShoppingCart className="h-12 w-12 text-border mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-text mb-1">Your cart is empty</h3>
                <p className="text-text-muted text-sm mb-6">Add some cozy bedding to get started</p>
                <Button variant="primary" onClick={onClose} className="w-full">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <ul className="space-y-4" role="list" aria-label="Cart items">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
                ))}
              </ul>
            )}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-border px-4 py-4 sticky bottom-0 bg-bg/95 backdrop-blur z-10">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium text-text">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted flex items-center gap-1">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Delivery
                </span>
                <span className="font-medium text-text">
                  {totals.deliveryFee === 0 ? 'Free' : formatCurrency(totals.deliveryFee)}
                </span>
              </div>
              {totals.deliveryFee === 0 && (
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                  Free delivery on orders over ₦50,000
                </p>
              )}
              <div className="flex justify-between text-base font-semibold text-text pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={() => {
                onClose();
              }}
              className="inline-flex items-center justify-center font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active h-14 px-8 text-lg w-full"
            >
              Proceed to Checkout
            </Link>
            <p className="text-center text-xs text-text-muted mt-3">
              Secure checkout powered by Paystack
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function CartItem({
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
  const size = item.variant.size;
  const color = item.variant.color;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await onRemove(item.id);
      return;
    }
    if (newQuantity > item.variant.stock) {
      return; // Could show toast here
    }
    await onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <li className="flex gap-3">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-bg-subtle">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-text truncate">{name}</h4>
        <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
          {size && <span>{size}</span>}
          {color && <span>· {color}</span>}
        </div>
        <p className="font-semibold text-text mt-1">
          {formatCurrency(price)}
        </p>
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
          <span className="px-3 text-sm font-medium text-text min-w-[2rem] text-center">
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
        <button
          className="p-1 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors mt-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={`Remove ${name} from cart`}
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}