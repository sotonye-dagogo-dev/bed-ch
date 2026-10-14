import { describe, it, expect } from 'vitest';
import {
  siteConfig,
  shopCategoryHref,
  chapterHref,
  isKnownCategory,
  getWhatsAppContactUrl,
} from '@/config/site';

describe('siteConfig', () => {
  it('exposes 9 chapters and 8 categories', () => {
    expect(siteConfig.chapters).toHaveLength(9);
    expect(siteConfig.categories).toHaveLength(8);
  });

  it('exposes exactly one trustBadges source with 3 entries', () => {
    expect(siteConfig.trustBadges).toHaveLength(3);
    expect(siteConfig.trustBadges.map((b) => b.title)).toEqual([
      'Lagos Same-Day',
      'Pay on Delivery',
      '7-Day Returns',
    ]);
  });

  it('builds canonical shop category hrefs (query-based)', () => {
    expect(shopCategoryHref('bedding')).toBe('/shop?category=bedding');
  });

  it('builds canonical chapter hrefs', () => {
    expect(chapterHref('nursery')).toBe('/chapter/nursery');
  });

  it('exposes a chapters index href for View-all-chapters links', () => {
    expect(siteConfig.chaptersIndexHref).toBe('/chapters');
  });

  it('validates known vs unknown categories', () => {
    expect(isKnownCategory('bedding')).toBe(true);
    expect(isKnownCategory('nope')).toBe(false);
  });

  it('builds an encoded WhatsApp contact URL', () => {
    const url = getWhatsAppContactUrl('Hello');
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(url).toContain(encodeURIComponent('Hello'));
  });
});
