import { NextRequest, NextResponse } from 'next/server';
import { updateCartItemQuantity, removeFromCart, getCartTotals } from '@/lib/db/cart';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> }
) {
  try {
    const { cartItemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    const cart = await updateCartItemQuantity(cartItemId, quantity);
    const totals = await getCartTotals();

    return NextResponse.json({ success: true, cart, totals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> }
) {
  try {
    const { cartItemId } = await params;
    const cart = await removeFromCart(cartItemId);
    const totals = await getCartTotals();

    return NextResponse.json({ success: true, cart, totals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}