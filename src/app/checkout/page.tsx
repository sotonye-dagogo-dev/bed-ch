'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Truck, Shield, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { formatCurrency, NIGERIAN_STATES, DELIVERY_OPTIONS, PAYMENT_METHODS } from '@/lib/utils';
import { NIGERIAN_PHONE_REGEX, isPODEligibleForOrder } from '@/lib/validations';
import { trackBeginCheckout } from '@/lib/analytics';
import { useCart } from '@/lib/cart-context';

const steps = [
  { id: 'contact', label: 'Contact', number: 1 },
  { id: 'delivery', label: 'Delivery', number: 2 },
  { id: 'payment', label: 'Payment', number: 3 },
  { id: 'confirm', label: 'Confirm', number: 4 },
];

function CheckoutPageContent() {
  const router = useRouter();
  const { cart, totals, isLoading: cartLoading, error: cartError } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Contact
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    // Delivery
    address: '',
    city: '',
    state: '',
    deliveryOption: 'STANDARD',
    // Payment
    paymentMethod: 'PAYSTACK_CARD',
    // Notes
    notes: '',
  });

  const cartItems = cart?.items || [];
  const subtotal = totals.subtotal;
  const deliveryFee = totals.deliveryFee;
  const total = totals.total;

  const currentStepId = steps[currentStep].id;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      try {
        trackBeginCheckout(
          subtotal + deliveryFee,
          cartItems.map((i) => ({
            item_id: i.variant.product.id,
            item_name: i.variant.product.name,
            price: i.variant.price ?? i.variant.product.price,
            quantity: i.quantity,
          }))
        );
      } catch { /* analytics ignore */ }
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const data = await res.json();

      if (data.success) {
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          router.push('/order/success');
        }
      } else {
        setFormError(data.error || 'Checkout failed. Please try again.');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressSteps = steps.map((step, index) => ({
    ...step,
    isActive: index <= currentStep,
    isCurrent: index === currentStep,
  }));

  if (cartLoading) {
    return (
      <div className="pt-8 pb-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (cartError || cartItems.length === 0) {
    return (
      <div className="pt-8 pb-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Truck className="h-16 w-16 text-error mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-text mb-2">Cart is empty</h1>
          <p className="text-text-muted mb-6">
            {cartError || 'Your cart is empty. Add some items before checking out.'}
          </p>
          <Button variant="primary" onClick={() => router.push('/shop')} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Progress Indicator */}
        <nav className="mb-8" aria-label="Checkout progress">
          <ol className="flex items-center">
            {progressSteps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                      step.isActive ? 'bg-primary text-text-inverse' : 'bg-border text-text-muted'
                    )}
                    aria-current={step.isCurrent ? 'step' : undefined}
                  >
                    {step.isActive && index < currentStep ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <span
                    className={clsx(
                      'ml-2 hidden sm:block text-sm font-medium',
                      step.isActive ? 'text-text' : 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'flex-1 h-0.5 mx-4',
                      step.isActive ? 'bg-primary' : 'bg-border'
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Steps */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate>
              {/* Step 1: Contact */}
              {currentStepId === 'contact' && (
                <CheckoutStep title="Contact Information" description="We'll send order updates to your phone and email.">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      required
                      autoComplete="given-name"
                    />
                    <Input
                      label="Last Name *"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="Phone Number *"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="080XXXXXXXX"
                      required
                      autoComplete="tel"
                      error={formData.phone && !NIGERIAN_PHONE_REGEX.test(formData.phone) ? 'Enter a valid Nigerian phone number' : undefined}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      autoComplete="email"
                    />
                  </div>
                </CheckoutStep>
              )}

              {/* Step 2: Delivery */}
              {currentStepId === 'delivery' && (
                <CheckoutStep title="Delivery Details" description="Where should we deliver your order?">
                  <Input
                    label="Delivery Address *"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Street Name, Area"
                    required
                    autoComplete="street-address"
                  />
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <Input
                      label="City *"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Lagos"
                      required
                      autoComplete="address-level2"
                    />
                    <Select
                      label="State *"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))}
                      placeholder="Select state"
                      required
                    />
                  </div>

                  <fieldset className="mt-6">
                    <legend className="label">Delivery Option *</legend>
                    <div className="space-y-3" role="radiogroup" aria-label="Delivery options">
                      {DELIVERY_OPTIONS.map((option) => {
                        const isPOD = option.value === 'PAY_ON_DELIVERY';
                        const isEligible = !isPOD || isPODEligibleForOrder(subtotal, formData.state);
                        const fee = isPOD ? 150000 : option.fee;
                        const isFree = subtotal >= 5000000 && option.value === 'STANDARD';
                        
                        return (
                          <label
                            key={option.value}
                            className={clsx(
                              'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                              formData.deliveryOption === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50',
                              !isEligible && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            <input
                              type="radio"
                              name="deliveryOption"
                              value={option.value}
                              checked={formData.deliveryOption === option.value}
                              onChange={(e) => handleInputChange('deliveryOption', e.target.value)}
                              disabled={!isEligible}
                              className="mt-1 h-4 w-4 text-primary border-border-strong focus:ring-primary focus:ring-2"
                              aria-describedby={`${option.value}-desc`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-text">{option.label}</span>
                                {isFree && (
                                  <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">Free</span>
                                )}
                                {!isFree && fee > 0 && (
                                  <span className="text-xs text-text-muted">{formatCurrency(fee)}</span>
                                )}
                              </div>
                              <p id={`${option.value}-desc`} className="text-sm text-text-muted mt-1">
                                {option.description}
                              </p>
                              {!isEligible && isPOD && (
                                <p className="text-sm text-error mt-1">
                                  Pay on Delivery only available in Lagos, Abuja & Port Harcourt for orders ≤₦50,000
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </CheckoutStep>
              )}

              {/* Step 3: Payment */}
              {currentStepId === 'payment' && (
                <CheckoutStep title="Payment Method" description="Choose how you'd like to pay.">
                  <div className="space-y-3" role="radiogroup" aria-label="Payment methods">
                    {PAYMENT_METHODS.map((method) => {
                      const isPOD = method.value === 'PAY_ON_DELIVERY';
                      const isEligible = !isPOD || isPODEligibleForOrder(subtotal, formData.state);
                      
                      let icon: React.ReactNode = <CreditCard className="h-5 w-5" />;
                      if (method.value === 'PAYSTACK_TRANSFER') icon = <span className="text-lg">🏦</span>;
                      if (method.value === 'PAYSTACK_USSD') icon = <Smartphone className="h-5 w-5" />;
                      if (method.value === 'PAY_ON_DELIVERY') icon = <Shield className="h-5 w-5" />;

                      return (
                        <label
                          key={method.value}
                          className={clsx(
                            'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                            formData.paymentMethod === method.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50',
                            !isEligible && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            disabled={!isEligible}
                            className="h-4 w-4 text-primary border-border-strong focus:ring-primary focus:ring-2"
                          />
                          <span className="text-primary">{icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-text">{method.label}</p>
                            <p className="text-sm text-text-muted">{method.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  
                  {formData.paymentMethod === 'PAY_ON_DELIVERY' && (
                    <div className="mt-4 p-4 bg-trust-bg rounded-lg border border-trust-bg">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-trust-text mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-trust-text">Pay on Delivery Details</p>
                          <p className="text-sm text-trust-text/80 mt-1">
                            You'll pay cash or card when your order is delivered. Our delivery agent will bring a POS terminal for card payments. Available in Lagos, Abuja & Port Harcourt for orders up to ₦50,000.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CheckoutStep>
              )}

              {/* Step 4: Confirm */}
              {currentStepId === 'confirm' && (
                <CheckoutStep title="Confirm Order" description="Review your order details before placing your order.">
                  <div className="space-y-4">
                    <div className="p-4 bg-bg-subtle rounded-lg">
                      <h4 className="font-medium text-text mb-3">Contact Information</h4>
                      <p className="text-text-muted">{formData.firstName} {formData.lastName}</p>
                      <p className="text-text-muted">{formData.phone}</p>
                      {formData.email && <p className="text-text-muted">{formData.email}</p>}
                    </div>

                    <div className="p-4 bg-bg-subtle rounded-lg">
                      <h4 className="font-medium text-text mb-3">Delivery Address</h4>
                      <p className="text-text-muted">{formData.address}</p>
                      <p className="text-text-muted">{formData.city}, {formData.state}</p>
                      <p className="text-text-muted mt-2">
                        <strong>Delivery:</strong> {DELIVERY_OPTIONS.find(o => o.value === formData.deliveryOption)?.label}
                      </p>
                    </div>

                    <div className="p-4 bg-bg-subtle rounded-lg">
                      <h4 className="font-medium text-text mb-3">Payment Method</h4>
                      <p className="text-text-muted">{PAYMENT_METHODS.find(m => m.value === formData.paymentMethod)?.label}</p>
                    </div>

                    <Input
                      label="Order Notes (Optional)"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Special delivery instructions, gift message, etc."
                    />
                    
                    {formError && (
                      <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm" role="alert">
                        {formError}
                      </div>
                    )}
                  </div>
                </CheckoutStep>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {currentStep > 0 && (
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-text">Order Summary</h2>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => {
                    const price = item.variant.price ?? item.variant.product.price;
                    const image = item.variant.product.images[0] || '';
                    const name = item.variant.product.name;
                    const size = item.variant.size;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-bg-subtle">
                          <img src={image} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text truncate">{name}</p>
                          <p className="text-xs text-text-muted">{size} · Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-text">{formatCurrency(price * item.quantity)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-text">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-1">
                      <Truck className="h-4 w-4" aria-hidden="true" />
                      Delivery
                    </span>
                    <span className="font-medium text-text">
                      {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-success">Free delivery on orders over ₦50,000</p>
                  )}
                  <div className="flex justify-between text-base font-semibold text-text pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutStep({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <p className="text-sm text-text-muted mt-1">{description}</p>
        </div>
        {children}
      </div>
    </Card>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}