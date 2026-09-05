import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/db/orders';
import { OrderDetailContent } from './OrderDetailContent';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrderById(id);
  
  if (!order) {
    return { title: 'Order Not Found' };
  }

  return {
    title: `Order ${order.orderNumber}`,
    description: `View your order ${order.orderNumber} details`,
  };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailContent order={order} />;
}