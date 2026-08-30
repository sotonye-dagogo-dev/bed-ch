'use client';

import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSlideOutProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    variantId: '1',
    name: 'Organic Cotton Sheet Set',
    size: 'Queen',
    color: 'White',
    price: 1250000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
  },
  {
    id: '2',
    productId: '2',
    variantId: '2',
    name: 'Memory Foam Pillow',
    size: 'Standard',
    price: 850000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1584101557390-d6eec8c4248b?w=400',
  },
];

export function CartSlideOut({ isOpen, onClose }: CartSlideOutProps) {
  const cartItems = mockCartItems;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 5000000 ? 0 : 250000; // Free delivery over ₦50k
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

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
              <p className="text-sm text-text-muted">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
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
            {cartItems.length === 0 ? (
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
                  <li key={item.id} className="flex gap-3">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-bg-subtle">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                        {item.size && <span>{item.size}</span>}
                        {item.color && <span>· {item.color}</span>}
                      </div>
                      <p className="font-semibold text-text mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          className="p-2 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="px-3 text-sm font-medium text-text">{item.quantity}</span>
                        <button
                          className="p-2 text-text-muted hover:text-text hover:bg-bg-subtle transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        className="p-1 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors mt-2"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-border px-4 py-4 sticky bottom-0 bg-bg/95 backdrop-blur z-10">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium text-text">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted flex items-center gap-1">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Delivery
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
              <div className="flex justify-between text-base font-semibold text-text pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
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