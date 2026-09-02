import { describe, it, expect } from 'vitest';
import { formatPrice, formatCurrency, slugify, generateOrderNumber, isPODEligible, calculateDeliveryFee } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats kobo to NGN', () => {
    expect(formatPrice(650000)).toBe('₦6,500');
    expect(formatPrice(1250000)).toBe('₦12,500');
  });
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₦0');
  });
});

describe('generateOrderNumber', () => {
  it('matches BC-YYYY-NNNN', () => {
    expect(generateOrderNumber()).toMatch(/^BC-\d{4}-\d{4}$/);
  });
});

describe('isPODEligible', () => {
  it('allows POD for Lagos under 50k', () => {
    expect(isPODEligible(4000000, 'Lagos')).toBe(true);
  });
  it('rejects over 50k', () => {
    expect(isPODEligible(6000000, 'Lagos')).toBe(false);
  });
});

describe('calculateDeliveryFee', () => {
  it('free over 50k', () => {
    expect(calculateDeliveryFee(6000000, 'STANDARD')).toBe(0);
  });
});
