'use server';

import { addToCart, updateCartItemQuantity, removeFromCart, clearCart, getCart, getCartTotals } from '@/lib/db/cart';
import { createOrder } from '@/lib/db/orders';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addToCartAction(variantId: string, quantity = 1) {
  try {
    const cart = await addToCart(variantId, quantity);
    revalidatePath('/', 'layout');
    return { success: true, cart };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add to cart' };
  }
}

export async function updateCartQuantityAction(cartItemId: string, quantity: number) {
  try {
    const cart = await updateCartItemQuantity(cartItemId, quantity);
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true, cart };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update cart' };
  }
}

export async function removeFromCartAction(cartItemId: string) {
  try {
    const cart = await removeFromCart(cartItemId);
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true, cart };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove from cart' };
  }
}

export async function clearCartAction() {
  try {
    await clearCart();
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to clear cart' };
  }
}

export async function getCartAction() {
  try {
    const cart = await getCart();
    const totals = await getCartTotals();
    return { success: true, cart, totals };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get cart' };
  }
}

export async function checkoutAction(formData: FormData) {
  try {
    let sessionId: string | undefined;
    try {
      sessionId = cookies()?.get?.('sessionId')?.value;
    } catch {
      sessionId = undefined;
    }
    if (!sessionId) {
      return { success: false, error: 'No active session' };
    }

    const cart = await getCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const variant = await import('@/lib/prisma').then(m => m.prisma.productVariant.findUnique({
        where: { id: item.variantId },
      }));
      if (!variant || variant.stock < item.quantity) {
        return { success: false, error: `Insufficient stock for ${item.variant.product.name}` };
      }
    }

    // Create order data from form (null-safe FormData reads)
    const str = (key: string): string => {
      try {
        const v = formData?.get?.(key);
        return typeof v === 'string' ? v : '';
      } catch {
        return '';
      }
    };
    const orderData = {
      customerName: `${str('firstName')} ${str('lastName')}`,
      customerPhone: str('phone') as string,
      customerEmail: str('email') || undefined,
      address: str('address') as string,
      city: str('city') as string,
      state: str('state') as string,
      deliveryOption: str('deliveryOption') as 'STANDARD' | 'EXPRESS_LAGOS' | 'PAY_ON_DELIVERY',
      paymentMethod: str('paymentMethod') as 'PAYSTACK_CARD' | 'PAYSTACK_TRANSFER' | 'PAYSTACK_USSD' | 'PAY_ON_DELIVERY',
      notes: str('notes') || undefined,
      items: cart.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    const order = await createOrder(sessionId, orderData);
    
    // Clear cart after successful order creation
    await clearCart();
    revalidatePath('/cart');
    revalidatePath('/checkout');

    // Redirect based on payment method
    if (orderData.paymentMethod === 'PAY_ON_DELIVERY') {
      redirect(`/order/${order.id}/success`);
    } else {
      // For Paystack, redirect to payment initialization
      redirect(`/checkout/paystack?orderId=${order.id}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    return { success: false, error: error instanceof Error ? error.message : 'Checkout failed' };
  }
}