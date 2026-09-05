import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

export function formatPrice(amount: number): string {
  return `₦${(amount / 100).toLocaleString()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BC-${year}-${random}`;
}

export function calculateDeliveryFee(subtotal: number, deliveryOption: string): number {
  if (subtotal >= 5000000) return 0; // Free over ₦50k
  if (deliveryOption === 'EXPRESS_LAGOS') return 500000; // ₦5,000
  if (deliveryOption === 'PAY_ON_DELIVERY') return 150000; // ₦1,500
  return 250000; // Standard ₦2,500
}

export function isPODEligible(subtotal: number, state: string): boolean {
  const eligibleStates = ['Lagos', 'Abuja', 'Port Harcourt', 'Rivers'];
  return subtotal <= 5000000 && eligibleStates.some(s => state.toLowerCase().includes(s.toLowerCase()));
}

export function getDeliveryEstimate(deliveryOption: string, _state: string): string {
  const estimates: Record<string, string> = {
    STANDARD: '3-5 business days',
    EXPRESS_LAGOS: 'Same day (order before 12pm)',
    PAY_ON_DELIVERY: '1-2 business days',
  };
  return estimates[deliveryOption] || '3-5 business days';
}

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

export const DELIVERY_OPTIONS = [
  { value: 'STANDARD', label: 'Standard Delivery', description: '3-5 business days', fee: 250000 },
  { value: 'EXPRESS_LAGOS', label: 'Express Lagos', description: 'Same day (order before 12pm)', fee: 500000 },
  { value: 'PAY_ON_DELIVERY', label: 'Pay on Delivery', description: 'Lagos, Abuja, PH only • ≤₦50k', fee: 150000 },
] as const;

export const PAYMENT_METHODS = [
  { value: 'PAYSTACK_CARD', label: 'Card (Paystack)', description: 'Visa, Mastercard, Verve' },
  { value: 'PAYSTACK_TRANSFER', label: 'Bank Transfer (Paystack)', description: 'Pay via bank transfer' },
  { value: 'PAYSTACK_USSD', label: 'USSD (Paystack)', description: 'Pay with USSD code' },
  { value: 'PAY_ON_DELIVERY', label: 'Pay on Delivery', description: 'Cash/Card on delivery (selected areas)' },
] as const;