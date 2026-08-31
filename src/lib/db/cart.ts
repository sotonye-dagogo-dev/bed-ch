import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

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
  createdAt: Date;
  updatedAt: Date;
}

export interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

function getSessionId(): string {
  const cookieStore = cookies();
  let sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }

  return sessionId;
}

export async function getCart(): Promise<CartData | null> {
  const sessionId = getSessionId();

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return cart;
}

export async function getCartTotals(): Promise<CartTotals> {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return { subtotal: 0, deliveryFee: 0, total: 0, itemCount: 0 };
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.variant.price ?? item.variant.product.price;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Free delivery over ₦50,000 (5000000 kobo)
  const deliveryFee = subtotal >= 5000000 ? 0 : 250000; // ₦2,500 standard

  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    itemCount,
  };
}

export async function addToCart(variantId: string, quantity = 1): Promise<CartData> {
  const sessionId = getSessionId();

  // Check if variant exists and has stock
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });

  if (!variant) {
    throw new Error('Product variant not found');
  }

  if (variant.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { sessionId } });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
    });
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (variant.stock < newQuantity) {
      throw new Error('Insufficient stock');
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  // Return updated cart
  const updatedCart = await getCart();
  if (!updatedCart) throw new Error('Failed to retrieve updated cart');
  return updatedCart;
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartData> {
  const sessionId = getSessionId();

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { variant: true },
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  // Verify cart belongs to session
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart || cartItem.cartId !== cart.id) {
    throw new Error('Unauthorized');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    if (cartItem.variant.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  const updatedCart = await getCart();
  if (!updatedCart) throw new Error('Failed to retrieve updated cart');
  return updatedCart;
}

export async function removeFromCart(cartItemId: string): Promise<CartData> {
  const sessionId = getSessionId();

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!cartItem) {
    throw new Error('Cart item not found');
  }

  // Verify cart belongs to session
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart || cartItem.cartId !== cart.id) {
    throw new Error('Unauthorized');
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  const updatedCart = await getCart();
  if (!updatedCart) throw new Error('Failed to retrieve updated cart');
  return updatedCart;
}

export async function clearCart(): Promise<void> {
  const sessionId = getSessionId();

  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function getCartItemCount(): Promise<number> {
  const sessionId = getSessionId();

  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        select: { quantity: true },
      },
    },
  });

  if (!cart) return 0;

  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}