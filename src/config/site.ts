/**
 * Central site configuration — single source of truth for navigation,
 * links, trust badges, contact channels and filter metadata.
 *
 * Config/metadata-driven rule: no component should hardcode categories,
 * chapters, footer links, WhatsApp numbers or trust badges. Import from here.
 */

export interface NavEntry {
  name: string;
  slug: string;
  /** Optional display glyph (emoji / icon key). */
  icon?: string;
  description?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface TrustBadge {
  /** Lucide icon key — resolved by the consuming component. */
  icon: 'truck' | 'shield' | 'returns';
  title: string;
  desc: string;
}

const WHATSAPP_FALLBACK = '2348012345678';

export function getWhatsAppNumber(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    WHATSAPP_FALLBACK;
  return raw.replace(/[+\s]/g, '');
}

export function getWhatsAppContactUrl(message?: string): string {
  const defaultMessage =
    "Hello Bedroom Chapters! I'd like to inquire about your products.";
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(
    message ?? defaultMessage,
  )}`;
}

export const siteConfig = {
  name: 'Bedroom Chapters',
  tagline: 'Everything your bedroom needs.',
  description:
    'Shop quality bedding, pillows, rugs, curtains, and bedroom essentials. Pay on delivery in Lagos, Abuja & PH. Same-day delivery in Lagos. 7-day returns.',
  url:
    process.env.NEXT_PUBLIC_APP_URL || 'https://bedroomchapters.ng',

  whatsapp: {
    get number() {
      return getWhatsAppNumber();
    },
    defaultMessage: "Hi Bedroom Chapters, I'd like to ask about...",
    contactMessage:
      'Hi Bedroom Chapters, I have a question about...',
  },

  categories: [
    { name: 'Bedding', slug: 'bedding', icon: '🛏️' },
    { name: 'Pillows', slug: 'pillows', icon: '🛌' },
    { name: 'Rugs', slug: 'rugs', icon: '🧵' },
    { name: 'Curtains', slug: 'curtains', icon: '🪟' },
    { name: 'Lighting', slug: 'lighting', icon: '💡' },
    { name: 'Storage', slug: 'storage', icon: '📦' },
    { name: 'Nightwear', slug: 'nightwear', icon: '👕' },
    { name: 'Function', slug: 'function', icon: '🔧' },
  ] as NavEntry[],

  chapters: [
    { name: 'Nursery', slug: 'nursery', icon: '👶', description: 'Safe, soft, practical' },
    { name: 'Newlywed', slug: 'newlywed', icon: '💍', description: 'Luxury for two' },
    { name: 'Teen', slug: 'teen', icon: '🎮', description: 'Bold & functional' },
    { name: 'Guest', slug: 'guest', icon: '🏨', description: 'Five-star comfort' },
    { name: 'Master', slug: 'master', icon: '👑', description: 'Hotel-quality sleep' },
    { name: 'Minimalist', slug: 'minimalist', icon: '🤍', description: 'Calm & clutter-free' },
    { name: 'Boho', slug: 'boho', icon: '🌿', description: 'Layered & collected' },
    { name: 'Modern', slug: 'modern', icon: '⚡', description: 'Sleek & smart' },
    { name: 'Kids', slug: 'kids', icon: '🧸', description: 'Fun & durable' },
  ] as NavEntry[],

  /** Homepage anchor for the chapter teaser section. */
  chapterTeaserHref: '/#chapters',

  /** Canonical index where all chapters can be viewed. */
  chaptersIndexHref: '/chapters',

  footer: {
    help: [
      { label: 'Delivery & Returns', href: '/delivery-returns' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Size Guide', href: '/size-guide' },
    ] as FooterLink[],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Sustainability', href: '/sustainability' },
    ] as FooterLink[],
  },

  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],

  trustBadges: [
    { icon: 'truck', title: 'Lagos Same-Day', desc: 'Order before 12pm' },
    { icon: 'shield', title: 'Pay on Delivery', desc: 'Lagos, Abuja, PH ≤₦50k' },
    { icon: 'returns', title: '7-Day Returns', desc: 'No questions asked' },
  ] as TrustBadge[],

  filters: {
    priceRanges: [
      { label: 'Under ₦5,000', min: 0, max: 500000 },
      { label: '₦5,000 - ₦15,000', min: 500000, max: 1500000 },
      { label: '₦15,000 - ₦30,000', min: 1500000, max: 3000000 },
      { label: '₦30,000 - ₦50,000', min: 3000000, max: 5000000 },
      { label: 'Over ₦50,000', min: 5000000, max: 10000000 },
    ],
    sizes: [
      'Single',
      'Double',
      'Queen',
      'King',
      'Standard',
      '120x170cm',
      '160x230cm',
      '140x240cm',
      '45cm',
      '180cm',
    ],
    colors: ['White', 'Sage', 'Natural', 'Cream', 'Grey', 'Black', 'Neutral'],
  },
};

/** Canonical href for a shop category filter (query-based, non-breaking). */
export function shopCategoryHref(slug: string): string {
  return `/shop?category=${encodeURIComponent(slug)}`;
}

/** Canonical href for a chapter page. */
export function chapterHref(slug: string): string {
  return `/chapter/${encodeURIComponent(slug)}`;
}

export function isKnownCategory(slug: string): boolean {
  return siteConfig.categories.some((c) => c.slug === slug);
}
