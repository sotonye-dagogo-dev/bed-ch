import { describe, it, expect } from 'vitest';
import { checkoutSchema, NIGERIAN_PHONE_REGEX } from '@/lib/validations';

describe('checkoutSchema', () => {
  const valid = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '08012345678',
    email: 'john@example.com',
    address: '123 Main St',
    city: 'Lagos',
    state: 'Lagos',
    deliveryOption: 'STANDARD' as const,
    paymentMethod: 'PAYSTACK_CARD' as const,
  };
  it('validates correct data', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects invalid phone', () => {
    expect(checkoutSchema.safeParse({ ...valid, phone: 'invalid' }).success).toBe(false);
  });
  it('phone regex matches +234', () => {
    expect(NIGERIAN_PHONE_REGEX.test('+2348012345678')).toBe(true);
  });
});
