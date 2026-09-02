'use client';

import { useEffect } from 'react';
import { CheckCircle, Truck, CreditCard, Shield, MessageCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { OrderWithItems } from '@/lib/db/orders';
import { trackPurchase } from '@/lib/analytics';

interface OrderSuccessContentProps {
  order: OrderWithItems;
}

export function OrderSuccessContent({ order }: OrderSuccessContentProps) {
  const isPOD = order.paymentMethod === 'PAY_ON_DELIVERY';

  useEffect(() => {
    trackPurchase(
      order.orderNumber,
      order.total,
      order.items.map((i) => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity }))
    );
  }, [order.orderNumber, order.total, order.items]);

  const deliveryOptionLabels: Record<string, string> = {
    STANDARD: 'Standard Delivery (3-5 business days)',
    EXPRESS_LAGOS: 'Express Lagos (Same day if ordered before 12pm)',
    PAY_ON_DELIVERY: 'Pay on Delivery (1-2 business days)',
  };

  const paymentMethodLabels: Record<string, string> = {
    PAYSTACK_CARD: 'Card (Paystack)',
    PAYSTACK_TRANSFER: 'Bank Transfer (Paystack)',
    PAYSTACK_USSD: 'USSD (Paystack)',
    PAY_ON_DELIVERY: 'Pay on Delivery',
  };

  const customerWhatsAppUrl = generateWhatsAppOrderUrl(order.customerPhone, {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    address: order.address,
    city: order.city,
    state: order.state,
    deliveryOption: order.deliveryOption,
    paymentMethod: order.paymentMethod,
    total: order.total,
    items: order.items.map(item => ({
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    })),
    createdAt: order.createdAt,
  }, 'customer');

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container-custom max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-trust-bg flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-trust-text" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Order Confirmed!</h1>
          <p className="text-text-muted text-lg">Thank you for your order, {order.customerName.split(' ')[0]}.</p>
          <p className="text-primary font-medium mt-2">Order Number: <span className="text-text">{order.orderNumber}</span></p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <div className="p-6 space-y-6">
            {/* Items */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" aria-hidden="true" />
                Order Items
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-bg-subtle rounded-lg">
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-bg">
                      <img 
                        src={item.product?.images[0] || ''} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text truncate">{item.name}</p>
                      <p className="text-sm text-text-muted">
                        {item.size && `${item.size}`}
                        {item.color && ` · ${item.color}`}
                        {` · Qty: ${item.quantity}`}
                      </p>
                      <p className="font-semibold text-text">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="p-4 bg-bg-subtle rounded-lg">
                <h3 className="text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Delivery
                </h3>
                <p className="font-medium text-text">{deliveryOptionLabels[order.deliveryOption] || order.deliveryOption}</p>
                <p className="text-sm text-text-muted mt-1">
                  {order.address}, {order.city}, {order.state}
                </p>
              </div>

              <div className="p-4 bg-bg-subtle rounded-lg">
                <h3 className="text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
                  {isPOD ? (
                    <Shield className="h-4 w-4 text-trust-text" aria-hidden="true" />
                  ) : (
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                  )}
                  Payment
                </h3>
                <p className="font-medium text-text">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</p>
                <p className="text-sm text-text-muted mt-1">
                  {isPOD 
                    ? 'Payment due on delivery (Cash/Card)'
                    : `Status: ${order.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}`
                  }
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-lg font-bold text-text">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              {isPOD && (
                <p className="text-sm text-trust-text mt-2 flex items-center gap-1">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  Amount due on delivery
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 border-primary/20">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
              What happens next?
            </h2>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <span>{isPOD ? 'Our team will call you to confirm delivery details' : 'Your order is being prepared for shipment'}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <span>You'll receive a WhatsApp confirmation with tracking info</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                <span>{isPOD ? 'Pay cash or card when your order arrives' : 'Your order will be delivered to your address'}</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={customerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active h-14 px-8 text-lg w-full sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Get Order Updates on WhatsApp
          </a>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/shop">
              <Button variant="secondary" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link href={`/order/${order.id}`}>
              <Button variant="ghost" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                View Order Details
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="grid grid-cols-3 gap-3 pt-8 border-t border-border mt-8">
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-trust-bg flex items-center justify-center mx-auto mb-2">
              <Truck className="h-5 w-5 text-trust-text" aria-hidden="true" />
            </div>
            <p className="text-xs text-trust-text font-medium">Same-Day Lagos</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-trust-bg flex items-center justify-center mx-auto mb-2">
              {isPOD ? (
                <Shield className="h-5 w-5 text-trust-text" aria-hidden="true" />
              ) : (
                <CreditCard className="h-5 w-5 text-trust-text" aria-hidden="true" />
              )}
            </div>
            <p className="text-xs text-trust-text font-medium">{isPOD ? 'Pay on Delivery' : 'Secure Payment'}</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-full bg-trust-bg flex items-center justify-center mx-auto mb-2">
              <span className="text-xs font-bold text-trust-text">7D</span>
            </div>
            <p className="text-xs text-trust-text font-medium">7-Day Returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}