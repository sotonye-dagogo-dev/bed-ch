# Dependency Graph

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-08-30
> - staleness-policy: re-verify if module relationships change
>
> **Overview:** Module relationships as text diagram. Auto-regenerable via script.

---

## High-Level Layer Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  src/app/(site)  src/app/(shop)  src/app/(checkout)  src/components│
└─────────────────────────────┬───────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│  src/lib/db/*  src/lib/utils.ts  src/lib/prisma.ts              │
│  src/hooks/* (future)  src/app/api/* (future)                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                              │
│  src/lib/prisma.ts  →  Prisma Client  →  PostgreSQL             │
└─────────────────────────────┬───────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  Paystack API  │  WhatsApp Business API  │  Analytics (GA4/Meta)│
└─────────────────────────────────────────────────────────────────┘
```

---

## Route Group Dependencies

### `(site)` — Marketing Pages
```
src/app/layout.tsx (root)
    ├─ src/components/layout/Header.tsx
    ├─ src/components/layout/Footer.tsx
    ├─ src/components/layout/TrustBar.tsx
    ├─ src/components/whatsapp/WhatsAppFloatButton.tsx
    └─ src/components/analytics/AnalyticsProviders.tsx

src/app/page.tsx (Homepage)
    ├─ src/components/layout/Header.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/components/chapter/ChapterCard.tsx (inline in page.tsx)
    ├─ src/lib/db/products.ts (getBestsellers)
    └─ src/lib/db/chapters.ts (getActiveChapters)
```

### `(shop)` — E-Commerce Pages
```
src/app/shop/page.tsx
    ├─ src/components/product/FilterSidebar.tsx
    │   ├─ src/components/ui/Button.tsx
    │   └─ src/components/ui/Select.tsx (future)
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/lib/db/products.ts (getProducts with filters)
    ├─ src/lib/db/categories.ts (getCategories)
    └─ src/lib/db/chapters.ts (getChapters)

src/app/product/[id]/page.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Badge.tsx
    ├─ src/components/ui/Select.tsx
    ├─ src/components/ui/Input.tsx
    ├─ src/components/product/ProductGrid.tsx (Complete the Look)
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/lib/db/products.ts (getProductBySlug, getRelatedProducts)
    └─ src/lib/utils.ts (formatPrice, NIGERIAN_STATES, getColorHex)

src/app/chapter/[slug]/page.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Badge.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/lib/db/chapters.ts (getChapterBySlug)
    └─ src/lib/db/products.ts (getProductsByChapter)

src/app/cart/page.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/lib/utils.ts (formatCurrency, calculateDeliveryFee)
    └─ (uses mock data - no db queries yet)

src/app/checkout/page.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Input.tsx
    ├─ src/components/ui/Select.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/lib/utils.ts (formatCurrency, calculateDeliveryFee, NIGERIAN_STATES, DELIVERY_OPTIONS, PAYMENT_METHODS)
    └─ (uses mock data - no db queries yet)
```

---

## Component Dependency Tree

### UI Primitives (Leaf Nodes)
```
src/components/ui/Button.tsx
    └─ (no internal deps)

src/components/ui/Input.tsx
    └─ (no internal deps)

src/components/ui/Select.tsx
    └─ (no internal deps)

src/components/ui/Badge.tsx
    └─ (no internal deps)

src/components/ui/Card.tsx
    └─ (no internal deps)

src/components/ui/Sheet.tsx
    └─ (uses Radix UI primitives or headless)

src/components/ui/Skeleton.tsx
    └─ (no internal deps)
```

### Layout Components
```
src/components/layout/Header.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Sheet.tsx
    ├─ src/components/product/FilterSidebar.tsx (mobile)
    ├─ src/components/cart/CartSlideOut.tsx
    ├─ src/components/whatsapp/WhatsAppFloatButton.tsx
    └─ src/components/analytics/AnalyticsProviders.tsx (via root layout)

src/components/layout/Footer.tsx
    └─ (no internal deps - uses lucide-react)

src/components/layout/TrustBar.tsx
    └─ (no internal deps - uses lucide-react)

src/components/whatsapp/WhatsAppFloatButton.tsx
    ├─ src/components/ui/Tooltip.tsx (inline, not a separate component)
    └─ src/lib/utils.ts (environment variable access)

src/components/analytics/GA4.tsx, MetaPixel.tsx, Hotjar.tsx
    └─ next/script

src/components/analytics/AnalyticsProviders.tsx
    ├─ src/components/analytics/GA4.tsx
    ├─ src/components/analytics/MetaPixel.tsx
    └─ src/components/analytics/Hotjar.tsx
```

### Product Components
```
src/components/product/ProductGrid.tsx
    └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx (via inline ProductCard)

src/components/product/FilterSidebar.tsx
    ├─ src/components/ui/Button.tsx
    └─ (uses lucide-react for icons)
```

### Cart Components
```
src/components/cart/CartSlideOut.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Sheet.tsx (via portal + framer-motion)
    └─ src/lib/utils.ts (formatCurrency)
```

---

## Library Dependencies

### Database Queries (`src/lib/db/`)
```
src/lib/db/products.ts
    ├─ src/lib/prisma.ts (imported but not used - using mock data)
    ├─ (inline interfaces for Product, ProductVariant, ProductFilters, PaginatedProducts)
    └─ src/lib/utils.ts (not directly imported, but formatPrice used in components)

src/lib/db/chapters.ts
    ├─ src/lib/prisma.ts (imported but not used - using mock data)
    └─ (inline interfaces for Chapter, BundleOffer)

src/lib/db/categories.ts
    ├─ src/lib/prisma.ts (imported but not used - using mock data)
    └─ (inline interface for Category)
```

### Utilities
```
src/lib/utils.ts
    ├─ clsx / tailwind-merge (class merging)
    ├─ formatPrice (Intl.NumberFormat NGN)
    ├─ formatCurrency (Intl.NumberFormat NGN)
    ├─ slugify
    ├─ generateOrderNumber
    ├─ calculateDeliveryFee
    ├─ isPODEligible
    ├─ getDeliveryEstimate
    ├─ NIGERIAN_STATES (const array)
    ├─ DELIVERY_OPTIONS (const array)
    └─ PAYMENT_METHODS (const array)

src/lib/prisma.ts
    └─ @prisma/client (PrismaClient singleton)
```

---

## External Service Dependencies (Not Yet Integrated)

```
Paystack
    ├─ Initialize Transaction (POST /transaction/initialize) — NOT YET IMPLEMENTED
    ├─ Verify Transaction (GET /transaction/verify/:reference) — NOT YET IMPLEMENTED
    ├─ Webhook Events (charge.success, charge.failed) — NOT YET IMPLEMENTED
    └─ Pay on Delivery (custom integration) — NOT YET IMPLEMENTED

WhatsApp Business API
    └─ Click-to-chat: https://wa.me/234XXXXXXXXXX?text=<encoded_message> — IMPLEMENTED (UI only)

Google Analytics 4
    └─ gtag('event', 'purchase', { ... }) — UI PROVIDER ONLY, NO EVENTS

Meta Pixel
    └─ fbq('track', 'Purchase', { ... }) — UI PROVIDER ONLY, NO EVENTS

Hotjar
    └─ Automatic session recording (script embed) — UI PROVIDER ONLY
```

---

## Current Implementation State

### What's Implemented (Foundation Sprint)
- ✅ Next.js 14 project with TypeScript, Tailwind, Prisma
- ✅ Prisma schema (Products, Categories, Chapters, Cart, Orders, BundleOffers)
- ✅ Seed script with 9 chapters, 8 categories, 12 products, variants, 3 bundle offers
- ✅ Tailwind config with design tokens (colors, typography, spacing, radius, shadows, transitions)
- ✅ Global CSS with CSS variables matching design tokens
- ✅ UI primitives: Button, Input, Select, Badge, Card, Sheet, Skeleton
- ✅ Layout components: Header, Footer, TrustBar
- ✅ WhatsApp floating button with pulse animation and tooltip
- ✅ Analytics providers (GA4, Meta Pixel, Hotjar) - conditional loading
- ✅ Homepage with hero, search, two-path buttons, bestsellers, chapter teaser
- ✅ Shop page with filter sidebar, product grid, pagination
- ✅ Product detail page with gallery, variant selectors, quantity, add-to-cart, complete-the-look, delivery estimate, trust badges
- ✅ Chapter pages with hero, curated products, bundle offer
- ✅ Cart page and CartSlideOut component with mock data
- ✅ Multi-step checkout page (Contact → Delivery → Payment → Confirm) with mock data
- ✅ Environment variable template (.env.example)

### What's Missing / Using Mock Data
- ❌ Prisma client not actually used in db queries (all mock data)
- ❌ No database connection / migrations run
- ❌ No API routes or Server Actions for cart, checkout, payments
- ❌ No Paystack integration
- ❌ No order creation / order management
- ❌ No session-based cart persistence (cookie + database)
- ❌ No WhatsApp message generation with dynamic content
- ❌ No analytics event tracking (only providers loaded)
- ❌ No 404 page, error boundaries, empty states beyond basic
- ❌ No hooks directory (useCart, etc.)
- ❌ No types directory (inline interfaces in each file)
- ❌ No test files
- ❌ No GitHub Actions CI/CD
- ❌ No public assets (favicon, robots.txt, sitemap, manifest)

---

## Critical Path (User Journey - Current Mock Implementation)

```
Homepage → Product Discovery → Product Detail → Add to Cart → Cart Slide-Out → Checkout → (Mock Submit)
     │              │                │              │               │            │
     ▼              ▼                ▼              ▼               ▼            ▼
getBestsellers  getProducts     getProduct    (mock add)       mock cart    mock submit
getChapters     getCategories   getRelated                                         
                                          (no persistence)    (no persistence)
```

---

## Circular Dependency Prevention

| Rule | Enforcement |
|------|-------------|
| UI primitives never import from other components | Manual convention |
| `src/lib/db/*` only imports `src/lib/prisma.ts` and types | Architectural convention |
| Components never import from `src/app/*` | Next.js convention |
| Types only import from other types or Prisma | TypeScript convention |
| Utils only import external libraries | Architectural convention |