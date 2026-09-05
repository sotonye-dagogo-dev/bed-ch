import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, handleWebhook } from '@/lib/paystack';
import { updateOrderPaymentStatus } from '@/lib/db/orders';


export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const payload = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(payload);
    const result = await handleWebhook(event);

    if (result) {
      const { orderId, paymentStatus } = result;

      // Update order payment status
      const order = await updateOrderPaymentStatus(orderId, paymentStatus);

      // TODO: Send WhatsApp notifications
      // For now, just log
      console.log(`Order ${order.orderNumber} payment status updated to ${paymentStatus}`);

      // In production, send WhatsApp to customer and admin
      // const customerUrl = generateWhatsAppOrderUrl(order.customerPhone, order, 'customer');
      // const adminUrl = generateWhatsAppOrderUrl(process.env.WHATSAPP_NUMBER!, order, 'admin');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}