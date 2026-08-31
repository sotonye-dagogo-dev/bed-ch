'use client';

import { CheckCircle, Truck, CreditCard, Shield, MessageCircle, Clock, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';
import { OrderWithItems } from '@/lib/db/orders';

interface OrderDetailContentProps {
  order: OrderWithItems;
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const isPOD = order.paymentMethod === 'PAY_ON_DELIVERY';

  const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
    PENDING: { label: 'Pending', icon: <Clock className="h-4 w-4" />, color: '#F57F17', bgColor: '#FFF8E1' },
    CONFIRMED: { label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" />, color: '#2E7D32', bgColor: '#F1F8E9' },
    PROCESSING: { label: 'Processing', icon: <Package className="h-4 w-4" />, color: '#1565C0', bgColor: '#E3F2FD' },
    SHIPPED: { label: 'Shipped', icon: <Truck className="h-4 w-4" />, color: '#1565C0', bgColor: '#E3F2FD' },
    DELIVERED: { label: 'Delivered', icon: <CheckCircle className="h-4 w-4" />, color: '#2E7D32', bgColor: '#F1F8E9' },
    CANCELLED: { label: 'Cancelled', icon: <Clock className="h-4 w-4" />, color: '#C62828', bgColor: '#FEF2F2' },
    RETURNED: { label: 'Returned', icon: <Package className="h-4 w-4" />, color: '#C62828', bgColor: '#FEF2F2' },
  };

  const paymentStatusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: '#F57F17' },
    PAID: { label: 'Paid', color: '#2E7D32' },
    FAILED: { label: 'Failed', color: '#C62828' },
    REFUNDED: { label: 'Refunded', color: '#1565C0' },
    PARTIAL_REFUND: { label: 'Partially Refunded', color: '#1565C0' },
  };

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

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const paymentStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;

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
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-6">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text">Order {order.orderNumber}</h1>
              <p className="text-text-muted">Placed {new Date(order.createdAt).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: status.bgColor }}>
              {status.icon}
              <span className="font-medium text-sm" style={{ color: status.color }}>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Order Items</h2>
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
        </Card>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Delivery Info */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                <Truck className="h-5 w-5" aria-hidden="true" />
                Delivery
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-text-muted mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-text-muted">Address</p>
                    <p className="font-medium text-text">{order.address}, {order.city}, {order.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-text-muted flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-text-muted">Method</p>
                    <p className="font-medium text-text">{deliveryOptionLabels[order.deliveryOption] || order.deliveryOption}</p>
                  </div>
                </div>
                {order.deliveryOption === 'PAY_ON_DELIVERY' && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-trust-text flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-text-muted">Payment</p>
                      <p className="font-medium text-text text-trust-text">Pay on Delivery — Cash/Card accepted</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                {isPOD ? (
                  <Shield className="h-5 w-5 text-trust-text" aria-hidden="true" />
                ) : (
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                )}
                Payment
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {isPOD ? (
                    <Shield className="h-5 w-5 text-trust-text flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <CreditCard className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  )}
                  <div>
                    <p className="text-sm text-text-muted">Method</p>
                    <p className="font-medium text-text">{paymentMethodLabels[order.paymentMethod] || order.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: paymentStatus.color }} aria-hidden="true" />
                  <div>
                    <p className="text-sm text-text-muted">Status</p>
                    <p className="font-medium text-text" style={{ color: paymentStatus.color }}>{paymentStatus.label}</p>
                  </div>
                </div>
                {order.paystackRef && (
                  <div className="flex items-center gap-3">
                    <span className="h-5 w-5 flex-shrink-0" aria-hidden="true">🔖</span>
                    <div>
                      <p className="text-sm text-text-muted">Transaction Reference</p>
                      <p className="font-mono text-sm text-text">{order.paystackRef}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <div className="p-6 space-y-3">
            <h2 className="text-lg font-semibold text-text">Order Summary</h2>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-muted">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-text">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium text-text">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Delivery Fee</span>
                <span className="font-medium text-text">{order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-text pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
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
            Contact Support on WhatsApp
          </a>

          <Link href="/shop">
            <Button variant="secondary" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
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