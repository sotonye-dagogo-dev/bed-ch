'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, CreditCard, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export function CheckoutCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState<{
    id: string;
    orderNumber: string;
    total: number;
    paymentMethod: string;
    deliveryOption: string;
  } | null>(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    const orderId = searchParams.get('orderId');
    const trxref = searchParams.get('trxref');

    // Paystack redirects with either reference or trxref
    const paymentRef = reference || trxref;

    if (!paymentRef || !orderId) {
      setStatus('failed');
      setMessage('Invalid callback parameters');
      return;
    }

    // Verify payment with our backend
    verifyPayment(paymentRef, orderId);
  }, [searchParams, router]);

  const verifyPayment = async (reference: string, orderId: string) => {
    try {
      const res = await fetch('/api/payments/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, orderId }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('Payment successful! Your order has been confirmed.');
        setOrder({
          id: orderId,
          orderNumber: data.order?.orderNumber || '',
          total: data.order?.total || 0,
          paymentMethod: data.order?.paymentMethod || '',
          deliveryOption: data.order?.deliveryOption || '',
        });
      } else {
        setStatus('failed');
        setMessage(data.error || 'Payment verification failed');
      }
    } catch {
      setStatus('failed');
      setMessage('An error occurred while verifying payment');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md text-center p-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-text mb-2">Verifying Payment</h1>
          <p className="text-text-muted">Please wait while we confirm your payment...</p>
        </Card>
      </div>
    );
  }

  const isPOD = order?.paymentMethod === 'PAY_ON_DELIVERY';

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container-custom max-w-2xl">
        <Card className={`text-center ${status === 'success' ? 'border-success/20' : 'border-error/20'}`}>
          <div className="p-8 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: status === 'success' ? '#F1F8E9' : '#FEF2F2' }}>
              {status === 'success' ? (
                <CheckCircle className="h-8 w-8" style={{ color: '#2E7D32' }} aria-hidden="true" />
              ) : (
                <XCircle className="h-8 w-8" style={{ color: '#C62828' }} aria-hidden="true" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text mb-2">
                {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </h1>
              <p className="text-text-muted">{message}</p>
            </div>

            {order && (
              <div className="bg-bg-subtle rounded-lg p-6 text-left space-y-4">
                <h3 className="font-semibold text-text">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Order Number</span>
                    <span className="font-medium text-text">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total</span>
                    <span className="font-semibold text-text">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Payment</span>
                    <span className="font-medium text-text flex items-center gap-2">
                      {isPOD ? (
                        <>
                          <Shield className="h-4 w-4 text-trust-text" aria-hidden="true" />
                          Pay on Delivery
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" aria-hidden="true" />
                          Card / Transfer / USSD
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Delivery</span>
                    <span className="font-medium text-text flex items-center gap-2">
                      <Truck className="h-4 w-4" aria-hidden="true" />
                      {order.deliveryOption}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {status === 'success' && (
                <Link href={`/order/${order?.id}/success`}>
                  <Button variant="primary" className="w-full sm:w-auto">
                    View Order Details
                  </Button>
                </Link>
              )}
              {status === 'failed' && (
                <>
                  <Button variant="primary" onClick={() => router.push('/checkout')} className="w-full sm:w-auto">
                    Try Again
                  </Button>
                  <Button variant="secondary" onClick={() => router.push('/cart')} className="w-full sm:w-auto">
                    Back to Cart
                  </Button>
                </>
              )}
              <Link href="/shop">
                <Button variant="ghost" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <p className="text-xs text-text-muted">
              {status === 'success'
                ? 'A confirmation has been sent to your phone. You can also track your order from your account.'
                : 'No charges have been made. Please try again or contact support if the issue persists.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}