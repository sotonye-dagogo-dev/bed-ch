'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { trackAddToCart } from '@/lib/analytics';

export interface CartItem {
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
}

export interface CartData {
  id: string;
  sessionId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

interface CartContextType {
  cart: CartData | null;
  totals: CartTotals;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (variantId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeItem: (cartItemId: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [totals, setTotals] = useState<CartTotals>({ subtotal: 0, deliveryFee: 0, total: 0, itemCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        setTotals(data.totals);
      } else {
        throw new Error(data.error || 'Failed to fetch cart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      setCart(null);
      setTotals({ subtotal: 0, deliveryFee: 0, total: 0, itemCount: 0 });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  const addToCart = async (variantId: string, quantity = 1) => {
    try {
      setError(null);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        setTotals(data.totals);
        // analytics: infer product from response when available
        try {
          const added = (data.cart?.items as CartItem[] | undefined)?.find((i) => i.variantId === variantId);
          if (added) {
            trackAddToCart({
              item_id: added.variant.product.id,
              item_name: added.variant.product.name,
              price: added.variant.price ?? added.variant.product.price,
              quantity,
              item_category: undefined,
            });
          }
        } catch { /* ignore */ }
        return { success: true };
      } else {
        setError(data.error || 'Failed to add to cart');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setError(null);
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        setTotals(data.totals);
        return { success: true };
      } else {
        setError(data.error || 'Failed to update quantity');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update quantity';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        setTotals(data.totals);
        return { success: true };
      } else {
        setError(data.error || 'Failed to remove item');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to remove item';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
        setTotals(data.totals);
        return { success: true };
      } else {
        setError(data.error || 'Failed to clear cart');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <CartContext.Provider value={{ cart, totals, isLoading, error, refreshCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}