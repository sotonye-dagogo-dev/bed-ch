import { prisma } from '@/lib/prisma';

import { calculateDeliveryFee, generateOrderNumber } from '@/lib/utils';

export interface OrderItemData {
  variantId: string;
  quantity: number;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city: string;
  state: string;
  deliveryOption: 'STANDARD' | 'EXPRESS_LAGOS' | 'PAY_ON_DELIVERY';
  paymentMethod: 'PAYSTACK_CARD' | 'PAYSTACK_TRANSFER' | 'PAYSTACK_USSD' | 'PAY_ON_DELIVERY';
  notes?: string;
  items: OrderItemData[];
}

export interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string;
  city: string;
  state: string;
  deliveryOption: string;
  paymentMethod: string;
  paymentStatus: string;
  paystackRef: string | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string;
    variantId: string | null;
    name: string;
    size: string | null;
    color: string | null;
    price: number;
    quantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: string[];
    } | null;
  }>;
}

export async function createOrder(sessionId: string, data: CreateOrderData): Promise<OrderWithItems> {
  // Get cart items with variant and product details
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cart: { sessionId },
      variantId: { in: data.items.map(i => i.variantId) },
    },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
    },
  });

  if (cartItems.length === 0) {
    throw new Error('Cart is empty or items not found');
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant.price ?? item.variant.product.price;
    const quantity = data.items.find(i => i.variantId === item.variantId)?.quantity ?? item.quantity;
    return sum + price * quantity;
  }, 0);

  const deliveryFee = calculateDeliveryFee(subtotal, data.deliveryOption);
  const total = subtotal + deliveryFee;

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        address: data.address,
        city: data.city,
        state: data.state,
        deliveryOption: data.deliveryOption,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'PAY_ON_DELIVERY' ? 'PENDING' : 'PENDING',
        subtotal,
        deliveryFee,
        total,
        notes: data.notes,
        items: {
          create: cartItems.map(item => {
            const quantity = data.items.find(i => i.variantId === item.variantId)?.quantity ?? item.quantity;
            const price = item.variant.price ?? item.variant.product.price;
            return {
              productId: item.variant.productId,
              variantId: item.variantId,
              name: item.variant.product.name,
              size: item.variant.size,
              color: item.variant.color,
              price,
              quantity,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Decrease stock for each variant
    for (const item of cartItems) {
      const quantity = data.items.find(i => i.variantId === item.variantId)?.quantity ?? item.quantity;
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: quantity } },
      });
    }

    return newOrder;
  });

  return order as OrderWithItems;
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order as OrderWithItems | null;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order as OrderWithItems | null;
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND',
  paystackRef?: string
): Promise<OrderWithItems> {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus,
      paystackRef: paystackRef ?? undefined,
      status: paymentStatus === 'PAID' ? 'CONFIRMED' : undefined,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order as OrderWithItems;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
): Promise<OrderWithItems> {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order as OrderWithItems;
}

export async function getOrdersByPhone(phone: string): Promise<OrderWithItems[]> {
  const orders = await prisma.order.findMany({
    where: { customerPhone: phone },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders as OrderWithItems[];
}