import { NextRequest, NextResponse } from 'next/server';
import { getCart, getCartTotals, addToCart, clearCart } from '@/lib/db/cart';

export async function GET() {
  try {
    const cart = await getCart();
    const totals = await getCartTotals();
    return NextResponse.json({ success: true, cart, totals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, quantity = 1 } = body;

    if (!variantId) {
      return NextResponse.json(
        { success: false, error: 'variantId is required' },
        { status: 400 }
      );
    }

    const cart = await addToCart(variantId, quantity);
    const totals = await getCartTotals();

    return NextResponse.json({ success: true, cart, totals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearCart();
    const cart = await getCart();
    const totals = await getCartTotals();
    return NextResponse.json({ success: true, cart, totals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to clear cart' },
      { status: 500 }
    );
  }
}