import { z } from 'zod';

export const NIGERIAN_PHONE_REGEX = /^(\+234|0)[789]\d{9}$/;
export const POD_ELIGIBLE_STATES = ['Lagos', 'Abuja', 'Port Harcourt', 'Rivers'];
const POD_MAX_SUBTOTAL_KOBO = 5000000;

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  phone: z.string().regex(NIGERIAN_PHONE_REGEX, 'Enter a valid Nigerian phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  state: z.string().min(1, 'State is required'),
  deliveryOption: z.enum(['STANDARD', 'EXPRESS_LAGOS', 'PAY_ON_DELIVERY']),
  paymentMethod: z.enum(['PAYSTACK_CARD', 'PAYSTACK_TRANSFER', 'PAYSTACK_USSD', 'PAY_ON_DELIVERY']),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function isPODEligibleForOrder(subtotal: number, state: string): boolean {
  const isEligibleState = POD_ELIGIBLE_STATES.some(s => state.toLowerCase().includes(s.toLowerCase()));
  return isEligibleState && subtotal <= POD_MAX_SUBTOTAL_KOBO;
}

export function validateCheckoutBusinessRules(
  data: Pick<CheckoutFormData, 'deliveryOption' | 'paymentMethod' | 'state'>,
  subtotal: number
): string | null {
  const needsPOD = data.deliveryOption === 'PAY_ON_DELIVERY' || data.paymentMethod === 'PAY_ON_DELIVERY';
  if (needsPOD && !isPODEligibleForOrder(subtotal, data.state)) {
    return 'Pay on Delivery not available for this order';
  }
  return null;
}
