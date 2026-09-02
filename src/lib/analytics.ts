// Centralized analytics event helpers – wraps gtag + fbq safely.
// No-ops when providers not loaded (e.g. missing env ids or SSR).

type Currency = string;

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number; // in kobo – converted to Naira for GA4
  quantity?: number;
  item_category?: string;
}

function priceToNaira(kobo: number): number {
  return kobo / 100;
}

function safeGtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag === 'function') {
    try {
      (window as unknown as { gtag: (...a: unknown[]) => void }).gtag!(...args);
    } catch { /* ignore */ }
  }
}

function safeFbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq === 'function') {
    try {
      (window as unknown as { fbq: (...a: unknown[]) => void }).fbq!(...args);
    } catch { /* ignore */ }
  }
}

export function trackViewItem(item: AnalyticsItem, currency: Currency = 'NGN') {
  const value = priceToNaira(item.price);
  safeGtag('event', 'view_item', {
    currency,
    value,
    items: [{ item_id: item.item_id, item_name: item.item_name, price: value, item_category: item.item_category }],
  });
  safeFbq('track', 'ViewContent', { content_ids: [item.item_id], content_name: item.item_name, value, currency });
}

export function trackAddToCart(item: AnalyticsItem, currency: Currency = 'NGN') {
  const value = priceToNaira(item.price) * (item.quantity ?? 1);
  safeGtag('event', 'add_to_cart', {
    currency,
    value,
    items: [{ item_id: item.item_id, item_name: item.item_name, price: priceToNaira(item.price), quantity: item.quantity ?? 1, item_category: item.item_category }],
  });
  safeFbq('track', 'AddToCart', { content_ids: [item.item_id], content_name: item.item_name, value, currency });
}

export function trackBeginCheckout(valueKobo: number, items: AnalyticsItem[], currency: Currency = 'NGN') {
  const value = priceToNaira(valueKobo);
  safeGtag('event', 'begin_checkout', {
    currency,
    value,
    items: items.map(i => ({ item_id: i.item_id, item_name: i.item_name, price: priceToNaira(i.price), quantity: i.quantity ?? 1 })),
  });
  safeFbq('track', 'InitiateCheckout', { value, currency, num_items: items.length });
}

export function trackPurchase(orderId: string, valueKobo: number, items: AnalyticsItem[], currency: Currency = 'NGN') {
  const value = priceToNaira(valueKobo);
  safeGtag('event', 'purchase', {
    transaction_id: orderId,
    currency,
    value,
    items: items.map(i => ({ item_id: i.item_id, item_name: i.item_name, price: priceToNaira(i.price), quantity: i.quantity ?? 1 })),
  });
  safeFbq('track', 'Purchase', { value, currency, content_ids: items.map(i => i.item_id) });
}

export function trackViewItemList(listName: string, items: AnalyticsItem[]) {
  safeGtag('event', 'view_item_list', {
    item_list_name: listName,
    items: items.map(i => ({ item_id: i.item_id, item_name: i.item_name })),
  });
}
