import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCart } from '@/lib/db/cart';
import { createOrder } from '@/lib/db/orders';
import { checkoutSchema, validateCheckoutBusinessRules } from '@/lib/validations';


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

    const raw = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || undefined,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      deliveryOption: formData.get('deliveryOption') as string,
      paymentMethod: formData.get('paymentMethod') as string,
      notes: formData.get('notes') as string || undefined,
    };

    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant.price ?? item.variant.product.price;
      return sum + price * item.quantity;
    }, 0);

    const businessError = validateCheckoutBusinessRules(parsed.data, subtotal);
    if (businessError) {
      return NextResponse.json({ success: false, error: businessError }, { status: 400 });
    }

    const orderData = {
      customerName: `${parsed.data.firstName} ${parsed.data.lastName}`,
      customerPhone: parsed.data.phone,
      customerEmail: parsed.data.email || undefined,
      address: parsed.data.address,
      city: parsed.data.city,
      state: parsed.data.state,
      deliveryOption: parsed.data.deliveryOption,
      paymentMethod: parsed.data.paymentMethod,
      notes: parsed.data.notes || undefined,
      items: cart.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };

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