import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/db/orders';
import { OrderSuccessContent } from './OrderSuccessContent';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);
  
  if (!order) {
    return { title: 'Order Not Found' };
  }

  return {
    title: `Order ${order.orderNumber} Confirmed`,
    description: `Your order ${order.orderNumber} has been confirmed. Total: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(order.total / 100)}`,
  };
}

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderSuccessContent order={order} />;
}