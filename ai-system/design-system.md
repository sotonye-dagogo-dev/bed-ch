# Design System

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: re-verify if design tokens or component library changes

> **Overview:** UI/UX rules, design tokens, component patterns, and accessibility standards derived from the design brief.

---

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Clean & Uncluttered** | White background, black text, generous whitespace. Product photos are the color. |
| **Mobile-First** | 90% of traffic on phones. All designs start at 375px, scale up. |
| **Fast** | Under 3 seconds on 3G. Minimal JS, optimized images, ISR for catalog. |
| **Trust-Forward** | "Pay on Delivery", "Lagos Same-Day", "7-Day Returns" visible at all times. |
| **Chapter as Guide** | Life-stage organization helps discovery, never blocks purchase. |

---

## Design Tokens

### Colors

```css
/* Primary — used for buttons, links, trust badges, focus states */
--color-primary: #8FBC8F;        /* Sage Green — primary accent */
--color-primary-hover: #7AA87A;
--color-primary-active: #6B946B;

/* Secondary — warm sand for subtle accents */
--color-secondary: #D2B48C;      /* Warm Sand */
--color-secondary-hover: #C4A57D;

/* Neutrals */
--color-bg: #FFFFFF;             /* Pure white background */
--color-bg-subtle: #FAFAFA;      /* Card backgrounds, hover states */
--color-border: #E5E5E5;         /* Borders, dividers */
--color-border-strong: #D4D4D4;  /* Input borders, focus rings */
--color-text: #1A1A1A;           /* Primary text (near black) */
--color-text-muted: #6B6B6B;     /* Secondary text, descriptions */
--color-text-inverse: #FFFFFF;   /* Text on primary buttons */

/* Semantic */
--color-success: #2E7D32;        /* Success messages, delivered badges */
--color-warning: #F57F17;        /* Low stock, pending states */
--color-error: #C62828;          /* Error messages, out of stock */
--color-info: #1565C0;           /* Info badges, links */

/* Trust Badges */
--color-trust-bg: #F1F8E9;       /* Light sage for trust bar */
--color-trust-text: #2E7D32;     /* Dark green text */
```

### Typography

```css
/* Single font family: Inter (variable font for performance) */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Two weights only */
--font-weight-regular: 400;
--font-weight-bold: 600;

/* Single size hierarchy (mobile-first, fluid scaling) */
--text-xs:     clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);   /* 12-14px */
--text-sm:     clamp(0.875rem, 0.8rem + 0.375vw, 1rem);     /* 14-16px */
--text-base:   clamp(1rem, 0.9rem + 0.5vw, 1.125rem);       /* 16-18px */
--text-lg:     clamp(1.125rem, 1rem + 0.625vw, 1.25rem);    /* 18-20px */
--text-xl:     clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);     /* 20-24px */
--text-2xl:    clamp(1.5rem, 1.3rem + 1vw, 2rem);           /* 24-32px */
--text-3xl:    clamp(2rem, 1.7rem + 1.5vw, 3rem);           /* 32-48px */

/* Line heights */
--leading-tight: 1.1;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing

```css
/* 4px base unit, mobile-first */
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Container widths */
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
--container-full: 100%;
```

### Border Radius

```css
--radius-none: 0;
--radius-sm:   0.25rem;  /* 4px — inputs, badges */
--radius-md:   0.5rem;   /* 8px — cards, buttons */
--radius-lg:   0.75rem;  /* 12px — modals, sheets */
--radius-full: 9999px;   /* pills, avatars */
```

### Shadows

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Transitions

```css
--transition-fast: 150ms ease-out;
--transition-normal: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

---

## Component Patterns

### Buttons

| Variant | Usage | Styles |
|---------|-------|--------|
| **Primary** | Main CTAs (Add to Cart, Checkout, Pay) | Sage green bg, white text, rounded-md, bold, h-12 px-6 |
| **Secondary** | Outline actions (View Details, Continue Shopping) | Transparent bg, sage border, sage text, rounded-md |
| **Ghost** | Subtle actions (Remove, Edit) | Transparent, text-muted, hover:bg-subtle |
| **Trust** | Trust badges (POD, Returns, Shipping) | Light sage bg, dark green text, rounded-full, px-3 py-1 text-sm |

**States:** hover (darker), active (darker + scale-95), focus (ring-2 ring-primary/50), disabled (opacity-50, cursor-not-allowed)

### Cards

| Variant | Usage | Styles |
|---------|-------|--------|
| **Product** | Product grid items | White bg, border, rounded-lg, overflow-hidden, hover:shadow-md transition |
| **Chapter** | Chapter grid on homepage | White bg, border, rounded-lg, aspect-square, hover:shadow-lg |
| **Bundle** | Bundle offer on chapter page | Light sage border, sage accent line top, rounded-lg |
| **Info** | Trust bar, delivery info | Border, rounded-md, p-4 |

### Forms

- **Inputs:** White bg, border-border, rounded-md, h-12 px-4, focus:ring-2 focus:ring-primary/50
- **Labels:** text-sm font-medium text-text, mb-1.5 block
- **Error:** border-error, text-error text-sm mt-1
- **Select:** Same as input, with chevron icon
- **Radio/Checkbox:** Sage accent color, focus:ring-primary/50

### Product Images

- Aspect ratio: 4:5 (portrait) for product cards, 1:1 for thumbnails
- Next.js Image with `priority` for above-fold, `lazy` for below
- Blur placeholder (base64) for LCP optimization
- Max 4 images per product (main + 3 alternates)

### Navigation

- **Header:** Sticky top, white bg, border-b, h-16, logo + search + cart + WhatsApp
- **Search:** Expandable on mobile, full-width on desktop, placeholder "Search bedsheets, pillows..."
- **Mobile Menu:** Slide-out sheet (not dropdown), categories + chapters + pages
- **Trust Bar:** Fixed bottom on mobile (h-12), 3 badges: POD · Same-Day · Returns

### Cart Slide-Out

- Fixed right, full height, w-full max-w-sm (mobile), 480px (desktop)
- Backdrop blur-sm, bg-white, shadow-xl
- Sticky header (title + close), scrollable items, sticky footer (subtotal + checkout CTA)
- Animates with slide-in from right (transition-normal)

### WhatsApp Floating Button

- Fixed bottom-right, 24px from edge (above trust bar on mobile)
- Circular, sage green bg, white WhatsApp icon, shadow-lg
- Pulse animation (subtle, 2s infinite)
- Tooltip on desktop hover: "Chat to order"

---

## Page Templates

### Homepage
```
Header (sticky)
├─ Hero: "Everything your bedroom needs." + Search Bar (full width mobile, centered desktop)
├─ Two Path Buttons: "Shop by Product" | "Shop by Chapter" (stacked mobile, side-by-side desktop)
├─ Bestsellers: "Shop high-quality bedsheets from ₦6,500" + ProductGrid (8-12 items)
├─ Chapter Teaser: 9 small ChapterCards (3x3 grid mobile, 9x1 desktop scroll)
└─ Trust Bar (fixed bottom mobile, sticky footer desktop)
    ├─ Pay on Delivery
    ├─ Lagos Same-Day
    └─ 7-Day Returns
Footer
```

### Shop Page
```
Header
├─ Sidebar (mobile: slide-out sheet; desktop: fixed left 280px)
│  ├─ Categories (with counts)
│  ├─ Price Range (slider)
│  ├─ Size (checkboxes)
│  ├─ Color (color swatches)
│  └─ Chapter (radio)
├─ ProductGrid (responsive: 2-col mobile, 3-col tablet, 4-col desktop)
│  └─ ProductCard: image, name, price from ₦X, "Add to Cart" (icon only mobile)
└─ Pagination / Infinite Scroll
Trust Bar
Footer
```

### Product Detail Page
```
Header
├─ Gallery: Large image (swipeable mobile, thumbnail strip desktop)
├─ Product Info:
│  ├─ Category breadcrumb + Chapter badge (if applicable)
│  ├─ Name (text-2xl bold)
│  ├─ Price (text-3xl bold, primary color) + compareAt strikethrough
│  ├─ Size Selector (radio buttons, required)
│  ├─ Quantity Stepper
│  ├─ "Add to Cart" (sticky bottom mobile, primary button full-width)
│  ├─ "Complete the Look" — 3 related ProductCards (horizontal scroll)
│  ├─ Delivery Estimate by Location (input → shows date)
│  └─ Reviews (stars + count, expandable)
Trust Bar
Footer
```

### Chapter Page
```
Header
├─ ChapterHero: "The [Chapter] Bedroom" + 2-sentence intro + hero image
├─ Curated ProductGrid (12-20 items, same as shop but pre-filtered)
└─ BundleOffer Card (if active): name, description, discounted price, "Add Bundle to Cart"
Trust Bar
Footer
```

### Cart & Checkout
```
Cart Slide-Out (from right)
├─ Header: "Your Cart (X items)" + Close
├─ CartItems: image, name, size, price, qty stepper, remove
├─ Subtotal + Delivery Estimate (based on location)
└─ "Proceed to Checkout" (primary, full-width)

Checkout Page
├─ Progress: Cart → Details → Payment → Confirmation
├─ Form Sections:
│  ├─ Contact: Name*, Phone*, Email
│  ├─ Delivery: Address*, City*, State*, Delivery Option* (radio)
│  └─ Payment: Paystack (card/transfer/USSD) OR Pay on Delivery (conditional)
├─ Order Summary (sticky right desktop, bottom mobile)
│  ├─ Items, Subtotal, Delivery Fee, Discount, Total
└─ "Place Order" (primary, full-width)
Trust Bar
```

---

## Responsive Breakpoints

```css
/* Tailwind defaults — mobile-first */
sm:  640px   /* Large phones / small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

**Grid behavior:**
- ProductGrid: 2-col (sm), 3-col (md), 4-col (lg), 5-col (xl)
- ChapterTeaser: 3-col (sm), 3-col (md), 9-col (lg) with horizontal scroll
- ChapterGrid: 2-col (sm), 3-col (md), 4-col (lg)

---

## Accessibility

- **Color Contrast:** All text meets WCAG AA (4.5:1), large text 3:1
- **Focus Visible:** All interactive elements have visible focus rings (ring-2 ring-primary/50)
- **Semantic HTML:** Proper heading hierarchy, landmarks, button/link semantics
- **Alt Text:** All product images have descriptive alt text (product name + key attribute)
- **ARIA:** Cart slide-out has `role="dialog" aria-modal="true"`, WhatsApp button has `aria-label`
- **Reduced Motion:** Respects `prefers-reduced-motion` for animations
- **Touch Targets:** Minimum 44x44px (h-11 min-height for buttons)

---

## Animation Guidelines

- **Allowed:** Slide-in (cart, mobile menu), fade-in (toasts, modals), scale (button press)
- **Duration:** 150-300ms max
- **Easing:** `ease-out` for entrances, `ease-in` for exits
- **Not Now:** Complex room animations, parallax, 3D transforms (per brief: "later maybe")
- **Performance:** Use `transform` + `opacity` only, `will-change` sparingly

---

## Asset Guidelines

- **Product Photos:** Real Nigerian bedrooms, natural light, products on actual beds (not floating)
- **Format:** WebP (auto via Next.js Image), max 1920px width
- **Chapter Hero:** Lifestyle shot representing the life stage
- **Icons:** Lucide React (consistent, tree-shakeable), 24px default
- **Trust Badges:** SVG, sage green accent, 24x24px

---

## Implementation Mapping

| Token | Tailwind Config | CSS Variable |
|-------|----------------|--------------|
| Colors | `theme.extend.colors` | `--color-*` in `:root` |
| Typography | `theme.extend.fontFamily`, `fontSize` | `--font-*`, `--text-*` |
| Spacing | `theme.extend.spacing` | `--space-*` |
| Radius | `theme.extend.borderRadius` | `--radius-*` |
| Shadows | `theme.extend.boxShadow` | `--shadow-*` |

All tokens defined in `tailwind.config.ts` and `src/app/globals.css` for dual access.