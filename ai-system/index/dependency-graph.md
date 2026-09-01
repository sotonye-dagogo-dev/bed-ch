# Dependency Graph

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: re-verify if module relationships change
>
> **Overview:** Module relationships as text diagram. Auto-regenerable via script.

---

## High-Level Layer Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  src/app/*  src/components/*  (ui, layout, product, cart, empty)│
└─────────────────────────────┬───────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│  src/lib/cart-context.tsx  src/lib/server-actions.ts             │
│  src/lib/db/*  src/lib/paystack.ts  src/lib/whatsapp.ts         │
│  src/lib/utils.ts  src/app/api/*                                 │
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
    ├─ src/components/layout/Header.tsx (useCart)
    ├─ src/components/layout/Footer.tsx
    ├─ src/components/layout/TrustBar.tsx
    ├─ src/components/whatsapp/WhatsAppFloatButton.tsx
    ├─ src/components/analytics/AnalyticsProviders.tsx
    └─ src/lib/cart-context.tsx (CartProvider wrapping)

src/app/page.tsx (Homepage)
    ├─ src/components/layout/Header.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/components/chapter/ChapterCard.tsx (inline in page.tsx)
    ├─ src/lib/db/products.ts (getBestsellers) — MOCK
    └─ src/lib/db/chapters.ts (getActiveChapters) — MOCK

src/app/global-error.tsx
    └─ next/error (global boundary)
```

### `(shop)` — E-Commerce Pages
```
src/app/shop/page.tsx
    ├─ src/components/product/FilterSidebar.tsx
    │   ├─ src/components/ui/Button.tsx
    │   └─ src/components/ui/Select.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/lib/db/products.ts (getProducts with filters) — MOCK
    ├─ src/lib/db/categories.ts (getCategories) — MOCK
    └─ src/lib/db/chapters.ts (getChapters) — MOCK

src/app/product/[id]/page.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Badge.tsx
    ├─ src/components/ui/Select.tsx
    ├─ src/components/ui/Input.tsx
    ├─ src/components/product/ProductGrid.tsx (Complete the Look)
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/lib/db/products.ts (getProductBySlug, getRelatedProducts) — MOCK
    └─ src/lib/utils.ts (formatPrice, NIGERIAN_STATES, getColorHex)

src/app/chapter/[slug]/page.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Badge.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/ui/Card.tsx, Badge.tsx, Button.tsx
    ├─ src/lib/db/chapters.ts (getChapterBySlug) — MOCK
    └─ src/lib/db/products.ts (getProductsByChapter) — MOCK

src/app/cart/page.tsx (client, useCart)
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/empty/EmptyState.tsx (EmptyCartState)
    ├─ src/components/error/ErrorBoundary.tsx (error state)
    ├─ src/lib/cart-context.tsx (useCart)
    └─ src/lib/utils.ts (formatCurrency, calculateDeliveryFee)

src/app/checkout/page.tsx (client, useCart)
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Input.tsx
    ├─ src/components/ui/Select.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/lib/cart-context.tsx (useCart)
    └─ src/lib/utils.ts (formatCurrency, calculateDeliveryFee, NIGERIAN_STATES, DELIVERY_OPTIONS, PAYMENT_METHODS)

src/app/checkout/callback/page.tsx
    ├─ src/app/checkout/callback/CheckoutCallbackContent.tsx
    │   ├─ src/app/api/payments/paystack/verify (fetch)
    │   └─ src/lib/utils.ts (formatCurrency)
    └─ src/components/ui/Card.tsx, Button.tsx

src/app/order/[id]/page.tsx
    ├─ src/lib/db/orders.ts (getOrderById) — REAL Prisma
    └─ src/app/order/[id]/OrderDetailContent.tsx

src/app/order/[id]/success/page.tsx
    ├─ src/lib/db/orders.ts (getOrderById) — REAL Prisma
    └─ src/app/order/[id]/success/OrderSuccessContent.tsx
        ├─ src/lib/whatsapp.ts (generateWhatsAppOrderUrl)
        └─ src/lib/utils.ts (formatCurrency)

src/app/terms/page.tsx, privacy/page.tsx, delivery-returns/page.tsx
    └─ (static, no data deps — Header/Footer only)

src/app/api/cart/route.ts
    ├─ src/lib/db/cart.ts (getCart, addToCart, clearCart) — REAL
    └─ src/lib/db/cart.ts → prisma

src/app/api/cart/[cartItemId]/route.ts
    ├─ src/lib/db/cart.ts (updateCartItemQuantity, removeFromCart) — REAL
    └─ src/lib/db/cart.ts → prisma

src/app/api/checkout/route.ts
    ├─ src/lib/db/cart.ts (getCart) — REAL
    ├─ src/lib/db/orders.ts (createOrder Tx) — REAL
    └─ src/lib/utils.ts (POD eligibility, phone validation)

src/app/api/payments/paystack/initialize/route.ts
    ├─ src/lib/db/orders.ts (getOrderById) — REAL
    └─ src/lib/paystack.ts (initializePayment)

src/app/api/payments/paystack/verify/route.ts
    ├─ src/lib/paystack.ts (verifyPayment)
    └─ src/lib/db/orders.ts (updateOrderPaymentStatus)

src/app/api/webhooks/paystack/route.ts
    ├─ src/lib/paystack.ts (verifyWebhookSignature, handleWebhook)
    └─ src/lib/db/orders.ts (updateOrderPaymentStatus)
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
    ├─ src/lib/cart-context.tsx (useCart for badge count)
    └─ src/components/analytics/AnalyticsProviders.tsx (via root layout)

src/components/layout/Footer.tsx
    └─ (no internal deps - uses lucide-react)

src/components/layout/TrustBar.tsx
    └─ (no internal deps - uses lucide-react)

src/components/whatsapp/WhatsAppFloatButton.tsx
    ├─ src/components/ui/Tooltip.tsx (inline, not a separate component)
    └─ src/lib/whatsapp.ts (generateWhatsAppContactUrl)
    └─ env.NEXT_PUBLIC_WHATSAPP_NUMBER

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
src/components/cart/CartSlideOut.tsx (client, useCart)
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Sheet.tsx (via portal + framer-motion)
    ├─ src/lib/cart-context.tsx (useCart)
    └─ src/lib/utils.ts (formatCurrency)
```

### Empty / Error Components
```
src/components/empty/EmptyState.tsx
    ├─ src/components/ui/Button.tsx
    └─ lucide-react (ShoppingCart, Package, Search, Truck, Heart)

src/components/error/ErrorBoundary.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/ui/Card.tsx
    └─ lucide-react (AlertCircle, RefreshCw, Home)
```

---

## Library Dependencies

### Database Queries (`src/lib/db/`)
```
src/lib/db/products.ts — MOCK (uses mockProducts array, no prisma)
    ├─ (inline interfaces for Product, ProductVariant, ProductFilters, PaginatedProducts)
    └─ (artificial delay 50-100ms)

src/lib/db/chapters.ts — MOCK (mockChapters array)
    └─ (inline interfaces for Chapter, BundleOffer)

src/lib/db/categories.ts — MOCK (mockCategories array)
    └─ (inline interface for Category)

src/lib/db/cart.ts — REAL Prisma
    ├─ src/lib/prisma.ts
    ├─ next/headers cookies (sessionId)
    └─ Prisma: Cart, CartItem, ProductVariant

src/lib/db/orders.ts — REAL Prisma
    ├─ src/lib/prisma.ts
    ├─ src/lib/utils.ts (calculateDeliveryFee, generateOrderNumber)
    └─ Prisma: Order, OrderItem, CartItem, ProductVariant (transaction + stock decrement)
```

### Context & Server Actions
```
src/lib/cart-context.tsx (client)
    ├─ React Context + useState/useEffect/useCallback
    ├─ fetch /api/cart (GET, POST, PATCH, DELETE)
    └─ Provides: cart, totals, isLoading, refreshCart, addToCart, updateQuantity, removeItem, clearCart

src/lib/server-actions.ts (server)
    ├─ src/lib/db/cart.ts (addToCart, updateCartItemQuantity, removeFromCart, clearCart, getCart)
    ├─ src/lib/db/orders.ts (createOrder)
    ├─ next/cache revalidatePath, next/headers cookies, next/navigation redirect
    └─ Used by: checkoutAction (FormData → createOrder → redirect)
```

### Paystack & WhatsApp
```
src/lib/paystack.ts
    ├─ env.PAYSTACK_SECRET_KEY, env.PAYSTACK_WEBHOOK_SECRET
    ├─ fetch https://api.paystack.co/transaction/{initialize,verify}
    ├─ crypto.createHmac (webhook signature)
    └─ Exports: initializePayment, verifyPayment, verifyWebhookSignature, handleWebhook

src/lib/whatsapp.ts
    ├─ env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ├─ Intl.NumberFormat en-NG
    └─ Exports: generateWhatsAppOrderUrl (customer/admin), generateWhatsAppContactUrl

src/lib/utils.ts
    ├─ clsx / tailwind-merge (class merging)
    ├─ formatPrice, formatCurrency (Intl.NumberFormat NGN)
    ├─ slugify, generateOrderNumber, calculateDeliveryFee, isPODEligible, getDeliveryEstimate
    ├─ NIGERIAN_STATES (const array)
    ├─ DELIVERY_OPTIONS (const array)
    └─ PAYMENT_METHODS (const array)

src/lib/prisma.ts
    └─ @prisma/client (PrismaClient singleton)

scripts/generate-sitemap.cjs
    ├─ @prisma/client (PrismaClient)
    ├─ fs write public/sitemap.xml + sitemap-0.xml
    └─ next-sitemap alternative (custom)
```

---

## External Service Dependencies (Implemented)

```
Paystack — IMPLEMENTED
    ├─ Initialize Transaction (POST /transaction/initialize) — via src/lib/paystack.ts + /api/payments/paystack/initialize
    ├─ Verify Transaction (GET /transaction/verify/:reference) — via src/lib/paystack.ts + /api/payments/paystack/verify
    ├─ Webhook Events (charge.success, charge.failed) — via /api/webhooks/paystack + verifyWebhookSignature
    └─ Pay on Delivery (custom) — via isPODEligible check in /api/checkout + /lib/utils

WhatsApp Business API — IMPLEMENTED
    ├─ Click-to-chat: https://wa.me/234XXXXXXXXXX?text=<encoded_message> — via src/lib/whatsapp.ts
    ├─ Customer confirmation URL — generateWhatsAppOrderUrl(..., 'customer')
    ├─ Admin notification URL — generateWhatsAppOrderUrl(..., 'admin')
    └─ Floating button — WhatsAppFloatButton.tsx (generateWhatsAppContactUrl)

Google Analytics 4 — PROVIDER ONLY
    └─ gtag('event', ...) — UI PROVIDER ONLY, NO EVENT TRACKING YET

Meta Pixel — PROVIDER ONLY
    └─ fbq('track', ...) — UI PROVIDER ONLY, NO EVENT TRACKING YET

Hotjar — PROVIDER ONLY
    └─ Automatic session recording (script embed) — UI PROVIDER ONLY
```

---

## Current Implementation State

### What's Implemented (Phases 0-4 UI + Backend)
- ✅ Next.js 14 project with TypeScript, Tailwind, Prisma (postbuild sitemap)
- ✅ Prisma schema (Products, Variants, Categories, Chapters, BundleOffers, Cart, CartItem, Order, OrderItem) — now with Product↔OrderItem and ProductVariant↔OrderItem relations
- ✅ Seed script with 8 categories, 9 chapters, 12 products, variants, 3 bundle offers
- ✅ Tailwind config with design tokens
- ✅ Global CSS with CSS variables
- ✅ UI primitives: Button, Input, Select, Badge, Card, Sheet, Skeleton
- ✅ Layout components: Header (now with useCart badge), Footer, TrustBar
- ✅ WhatsApp floating button + lib/whatsapp.ts (dynamic order messages)
- ✅ Analytics providers (GA4, Meta Pixel, Hotjar) - conditional loading
- ✅ Homepage, Shop, Product detail, Chapter pages (all using mock data still)
- ✅ Cart: CartSlideOut + Cart page (now REAL: useCart + /api/cart + Prisma cart.ts)
- ✅ Checkout: Multi-step form (REAL: validates via /api/checkout, creates Order, handles POD/Paystack)
- ✅ Paystack: initializePayment, verifyPayment, webhook handler (real API calls, signature verification)
- ✅ Orders: createOrder (transaction, stock decrement), getOrderById, updateOrderPaymentStatus
- ✅ Cart Context: CartProvider + useCart hook (fetch /api/cart)
- ✅ Server Actions: addToCartAction, checkoutAction etc. (revalidatePath)
- ✅ API Routes: /api/cart, /api/cart/[cartItemId], /api/checkout, /api/payments/paystack/{initialize,verify}, /api/webhooks/paystack
- ✅ Empty states (EmptyState, EmptyCartState, EmptyProductState)
- ✅ Error boundaries (ErrorBoundary class + global-error.tsx)
- ✅ Legal pages: /terms, /privacy, /delivery-returns
- ✅ SEO: robots.txt, sitemap.xml + sitemap-0.xml via scripts/generate-sitemap.cjs
- ✅ Environment variable template (.env.example)

### What's Still Missing / Using Mock Data
- ❌ products.ts, chapters.ts, categories.ts STILL use mock data (not migrated to Prisma despite task-queue marking [x])
- ❌ No src/lib/validations.ts (Zod schemas inline in checkout)
- ❌ No analytics event tracking (only providers loaded)
- ❌ No tests (no tests/ directory)
- ❌ No GitHub Actions CI/CD (only opencode workflows)
- ❌ No src/hooks/* or src/types/* directories (useCart lives in lib/cart-context)
- ❌ No PWA manifest.json
- ❌ No 404 page (not-found.tsx missing, relies on Next.js default + global-error)
- ❌ Performance/Accessibility audits not yet documented (checklist exists but not run)

---

## Critical Path (User Journey - Current)

```
Homepage → Shop/Chapter → Product Detail → Add to Cart (useCart → /api/cart → Prisma) → Cart Page/SlideOut → Checkout (useCart) → POST /api/checkout → Order created (Tx) → POD ? /order/[id]/success : /api/payments/paystack/initialize → Paystack → /checkout/callback → /api/payments/paystack/verify → /order/[id]/success
     │              │                │              │               │            │
     ▼              ▼                ▼              ▼               ▼            ▼
getBestsellers getProducts     getProduct    useCart.addToCart  useCart.cart  POST checkout
getChapters    getCategories   getRelated   (REAL Prisma)      (REAL Prisma) (REAL Prisma)
(MOCK)         (MOCK)          (MOCK)
                                              Webhook: /api/webhooks/paystack → updateOrderPaymentStatus → PAID/CONFIRMED
                                              WhatsApp: generateWhatsAppOrderUrl (customer + admin)
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
| `src/lib/cart-context.tsx` is client-only, never imported in server db files | Client/server boundary |
| API routes import from lib/db, not vice versa | Layering convention |
