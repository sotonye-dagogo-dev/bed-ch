import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/paystack';
import { updateOrderPaymentStatus } from '@/lib/db/orders';

export async function POST(request: NextRequest) {
  try {
    const { reference, orderId } = await request.json();

    if (!reference || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Reference and orderId are required' },
        { status: 400 }
      );
    }

    // Verify with Paystack
    const payment = await verifyPayment(reference);

    // Check if payment was successful
    if (payment.data.status !== 'success') {
      await updateOrderPaymentStatus(orderId, 'FAILED', reference);
      return NextResponse.json(
        { success: false, error: payment.data.gateway_response || 'Payment failed' },
        { status: 400 }
      );
    }

    // Update order status to paid
    const order = await updateOrderPaymentStatus(orderId, 'PAID', reference);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        deliveryOption: order.deliveryOption,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}