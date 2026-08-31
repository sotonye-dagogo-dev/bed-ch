import { NextRequest, NextResponse } from 'next/server';

import { getOrderById } from '@/lib/db/orders';
import { initializePayment } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is already paid
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'Order already paid' },
        { status: 400 }
      );
    }

    // Only allow Paystack payments
    if (!order.paymentMethod.startsWith('PAYSTACK_')) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method for Paystack' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${appUrl}/checkout/callback?orderId=${orderId}`;

    const reference = order.paystackRef || `BC-${order.orderNumber}-${Date.now()}`;

    // Initialize Paystack payment
    const payment = await initializePayment(
      order.customerEmail || `${order.customerPhone}@bedroomchapters.ng`,
      order.total,
      reference,
      callbackUrl,
      { orderId: order.id }
    );

    // Update order with Paystack reference if not set
    if (!order.paystackRef) {
      await import('@/lib/prisma').then(m => m.prisma.order.update({
        where: { id: order.id },
        data: { paystackRef: reference },
      }));
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference: payment.data.reference,
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}