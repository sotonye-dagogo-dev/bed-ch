import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCart } from '@/lib/db/cart';
import { createOrder } from '@/lib/db/orders';


export async function POST(request: NextRequest) {
  try {
    const sessionId = cookies().get('sessionId')?.value;
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 400 }
      );
    }

    const cart = await getCart();
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.variant.product.name}` },
          { status: 400 }
        );
      }
    }

    const formData = await request.formData();

    // Parse form data
    const orderData = {
      customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
      customerPhone: formData.get('phone') as string,
      customerEmail: formData.get('email') as string || undefined,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      deliveryOption: formData.get('deliveryOption') as 'STANDARD' | 'EXPRESS_LAGOS' | 'PAY_ON_DELIVERY',
      paymentMethod: formData.get('paymentMethod') as 'PAYSTACK_CARD' | 'PAYSTACK_TRANSFER' | 'PAYSTACK_USSD' | 'PAY_ON_DELIVERY',
      notes: formData.get('notes') as string || undefined,
      items: cart.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

    // Validate required fields
    if (!orderData.customerName.trim() || !orderData.customerPhone || !orderData.address || !orderData.city || !orderData.state) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^(\+234|0)[789]\d{9}$/.test(orderData.customerPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate POD eligibility
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant.price ?? item.variant.product.price;
      return sum + price * item.quantity;
    }, 0);

    if (orderData.deliveryOption === 'PAY_ON_DELIVERY') {
      const eligibleStates = ['Lagos', 'Abuja', 'Port Harcourt', 'Rivers'];
      const isEligibleState = eligibleStates.some(s => orderData.state.toLowerCase().includes(s.toLowerCase()));
      if (!isEligibleState || subtotal > 5000000) {
        return NextResponse.json(
          { success: false, error: 'Pay on Delivery not available for this order' },
          { status: 400 }
        );
      }
    }

    // Create order
    const order = await createOrder(sessionId, orderData);

    // Determine redirect based on payment method
    let redirectUrl: string;
    if (orderData.paymentMethod === 'PAY_ON_DELIVERY') {
      redirectUrl = `/order/${order.id}/success`;
    } else {
      redirectUrl = `/checkout/paystack?orderId=${order.id}`;
    }

    return NextResponse.json({ success: true, redirectUrl, orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}