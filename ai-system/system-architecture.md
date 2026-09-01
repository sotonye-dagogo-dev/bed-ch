# System Architecture

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: re-verify if architecture changes or after major refactor
>
> **Overview:** High-level structural documentation — module breakdown, data flows, configuration points, and architectural decisions. Updated to reflect actual implementation state as of 2026-09-01 — Phases 3-5 cart/payments/polish delivered.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │   Home      │  │   Shop      │  │   Chapter   │  │   Product       │   │
│  │   Page      │  │   Page      │  │   Pages     │  │   Detail Page   │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │
│         │                │                │                   │            │
│         └────────────────┼────────────────┼───────────────────┘            │
│                          ▼                ▼                                │
│                 ┌─────────────────────────────────────┐                   │
│                 │         NEXT.JS APP (Vercel)        │                   │
│                 │  ┌───────────────────────────────┐  │                   │
│                 │  │      SERVER COMPONENTS        │  │                   │
│                 │  │  • Product fetching (MOCK)    │  │                   │
│                 │  │  • Chapter page rendering     │  │                   │
│                 │  │  • SEO meta + JSON-LD         │  │                   │
│                 │  │  • Cart/Order (REAL Prisma)   │  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 │                  │                  │                   │
│                 │  ┌───────────────▼───────────────┐  │                   │
│                 │  │      CLIENT COMPONENTS        │  │                   │
│                 │  │  • Cart slide-out (useCart)   │  │                   │
│                 │  │  • WhatsApp floating button   │  │                   │
│                 │  │  • Add-to-cart (REAL API)     │  │                   │
│                 │  │  • Checkout form (REAL API)   │  │                   │
│                 │  │  • Filter sidebar (URL sync)  │  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 │                  │                  │                   │
│                 │  ┌───────────────▼───────────────┐  │                   │
│                 │  │      API ROUTES / ACTIONS     │  │                   │
│                 │  │  ✅ GET/POST /api/cart         │  │                   │
│                 │  │  ✅ POST /api/checkout         │  │                   │
│                 │  │  ✅ POST /api/payments/paystack│  │                   │
│                 │  │     /initialize, /verify      │  │                   │
│                 │  │  ✅ POST /api/webhooks/paystack│  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 └──────────────────┼──────────────────┘                   │
└─────────────────────────────────────┼────────────────────────────────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
             ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
             │   POSTGRES    │ │   PAYSTACK    │ │  WHATSAPP     │
             │   (Prisma)    │ │   API         │ │  BUSINESS     │
             │               │ │               │ │  API          │
             │ • Products    │ │ ✅ Initialize  │ │ ✅ Click-to-chat│
             │ • Categories  │ │ ✅ Verify      │ │ ✅ Order msgs │
             │ • Chapters    │ │ ✅ Webhooks    │ │  (customer/   │
             │ • Orders      │ │ ✅ POD flow    │ │   admin)      │
             │ • Cart items  │ │               │ │               │
             └───────────────┘ └───────────────┘ └───────────────┘
```

**Status Legend:**
- ✅ Implemented and working
- 🔄 Implemented but using mock data
- ❌ Not yet implemented
- 📋 Planned for next phase

---

## Module Breakdown

### 1. Frontend Layer (`src/app`)

| Route Group | Pages | Status | Purpose |
|-------------|-------|--------|---------|
| Root Layout | `layout.tsx`, `globals.css`, `global-error.tsx` | ✅ | Providers (CartProvider), fonts, header, footer, trust bar, analytics, error boundary |
| Homepage | `page.tsx` | ✅ | Hero, search, two-path CTAs, bestsellers, chapter teaser |
| Shop | `shop/page.tsx` | ✅ | Filter sidebar, product grid, pagination, URL-based filters |
| Product Detail | `product/[id]/page.tsx` | ✅ | Gallery, variants, add-to-cart (real), complete-the-look, delivery estimate |
| Chapter | `chapter/[slug]/page.tsx` | ✅ | Hero, curated products, bundle offer |
| Cart | `cart/page.tsx` | ✅ | Full-page cart (real: useCart + Prisma via /api/cart) |
| Checkout | `checkout/page.tsx` | ✅ | 4-step form (real: /api/checkout, POD validation, order creation) |
| Checkout Callback | `checkout/callback/page.tsx` | ✅ | Paystack redirect handler + verification |
| Order Success | `order/[id]/success/page.tsx` | ✅ | Success with WhatsApp CTA |
| Order Detail | `order/[id]/page.tsx` | ✅ | Order lookup |
| Legal | `terms/`, `privacy/`, `delivery-returns/` | ✅ | Static legal pages |
| Admin | (future) | ❌ | Post-MVP: product/order management |

**Key Components:**

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| UI Primitives | `src/components/ui/` | ✅ | Button, Input, Select, Badge, Card, Sheet, Skeleton |
| Layout | `src/components/layout/` | ✅ | Header (useCart), Footer, TrustBar |
| Product | `src/components/product/` | ✅ | ProductGrid, FilterSidebar |
| Cart | `src/components/cart/` | ✅ | CartSlideOut (real: useCart) |
| Empty States | `src/components/empty/` | ✅ | EmptyState, EmptyCartState, EmptyProductState |
| Error | `src/components/error/` | ✅ | ErrorBoundary (class) + global-error.tsx |
| WhatsApp | `src/components/whatsapp/` | ✅ | WhatsAppFloatButton (dynamic contact URL) |
| Analytics | `src/components/analytics/` | ✅ | GA4, MetaPixel, Hotjar providers (no events yet) |

---

### 2. Data Layer (`src/lib`)

| Module | File | Status | Purpose |
|--------|------|--------|---------|
| Prisma Client | `prisma.ts` | ✅ | Singleton client (used by cart/orders/paystack) |
| Product Queries | `db/products.ts` | 🔄 | STILL MOCK — not yet migrated to Prisma (drift vs task-queue) |
| Chapter Queries | `db/chapters.ts` | 🔄 | STILL MOCK — not yet migrated |
| Category Queries | `db/categories.ts` | 🔄 | STILL MOCK — not yet migrated |
| Cart Queries | `db/cart.ts` | ✅ | Real Prisma: getCart, addToCart, update, remove, clear, totals (sessionId cookie) |
| Order Queries | `db/orders.ts` | ✅ | Real Prisma: createOrder (Tx + stock), getById, updatePaymentStatus |
| Paystack | `paystack.ts` | ✅ | Real: initializePayment, verifyPayment, verifyWebhookSignature, handleWebhook |
| WhatsApp | `whatsapp.ts` | ✅ | Real: generateWhatsAppOrderUrl (customer/admin), generateWhatsAppContactUrl |
| Cart Context | `cart-context.tsx` | ✅ | Client: CartProvider + useCart hook (fetch /api/cart) |
| Analytics | `analytics.ts` (not created) | ❌ | Event tracking helpers |
| Utils | `utils.ts` | ✅ | Formatters, constants, validators |
| Validations | `validations.ts` (not created) | ❌ | Zod schemas inline in checkout (not extracted) |
| Server Actions | `server-actions.ts` | ✅ | Real: addToCartAction, updateQuantity, checkoutAction (revalidate + redirect) |

---

### 3. Database Schema (Prisma) — ✅ Defined, Migrated via db push

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  shortDesc   String?
  price       Int      // in kobo (₦6500 = 650000)
  compareAt   Int?     // original price for discounts
  images      String[] // URLs
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  chapter     Chapter? @relation(fields: [chapterId], references: [id])
  chapterId   String?
  variants    ProductVariant[]
  orderItems  OrderItem[]
  isBestseller Boolean @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([chapterId])
  @@index([isBestseller])
  @@index([isActive])
}

model ProductVariant {
  id         String     @id @default(cuid())
  productId  String
  product    Product    @relation(fields: [productId], references: [id])
  size       String?    // e.g., "Single", "Queen", "King"
  color      String?
  sku        String     @unique
  stock      Int        @default(0)
  price      Int?       // override price in kobo
  cartItems  CartItem[]
  orderItems OrderItem[]
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  icon        String?   // icon name or emoji
  sortOrder   Int       @default(0)
  products    Product[]
  isActive    Boolean   @default(true)

  @@index([isActive])
  @@index([sortOrder])
}

model Chapter {
  id          String    @id @default(cuid())
  name        String    // "Nursery", "Teen", "Newlywed", etc.
  slug        String    @unique
  headline    String    // "The Nursery Bedroom"
  intro       String    // 2-sentence intro
  image       String?   // hero image
  sortOrder   Int       @default(0)
  products    Product[]
  bundleOffer BundleOffer?
  isActive    Boolean   @default(true)

  @@index([isActive])
  @@index([sortOrder])
}

model BundleOffer {
  id          String   @id @default(cuid())
  chapterId   String   @unique
  chapter     Chapter  @relation(fields: [chapterId], references: [id])
  name        String   // "Nursery Starter Bundle"
  description String
  productIds  String[] // array of product IDs
  discountPct Int      // percentage off
  isActive    Boolean  @default(true)
}

model Cart {
  id        String      @id @default(cuid())
  sessionId String      @unique // anonymous session
  items     CartItem[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([sessionId])
}

model CartItem {
  id        String @id @default(cuid())
  cartId    String
  cart      Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int    @default(1)

  @@unique([cartId, variantId])
}

model Order {
  id              String       @id @default(cuid())
  orderNumber     String       @unique // human-readable: BC-2026-0001
  customerName    String
  customerPhone   String
  customerEmail   String?
  address         String
  city            String
  state           String
  deliveryOption  DeliveryOption
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(PENDING)
  paystackRef     String?      // Paystack transaction reference
  subtotal        Int          // in kobo
  deliveryFee     Int
  discount        Int          @default(0)
  total           Int          // in kobo
  items           OrderItem[]
  status          OrderStatus  @default(PENDING)
  notes           String?      // customer notes
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([customerPhone])
  @@index([paymentStatus])
  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  order     Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  variantId String?
  name      String // snapshot at purchase
  size      String?
  color     String?
  price     Int    // in kobo at purchase
  quantity  Int
}

enum DeliveryOption {
  STANDARD
  EXPRESS_LAGOS
  PAY_ON_DELIVERY
}

enum PaymentMethod {
  PAYSTACK_CARD
  PAYSTACK_TRANSFER
  PAYSTACK_USSD
  PAY_ON_DELIVERY
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  PARTIAL_REFUND
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}
```

**Seed Data (prisma/seed.ts):**
- 8 Categories: Bedding, Pillows, Rugs, Curtains, Lighting, Storage, Nightwear, Function
- 9 Chapters: Nursery, Newlywed, Teen, Guest, Master, Minimalist, Boho, Modern, Kids
- 12 Products with variants (sizes, colors, stock)
- 3 Bundle Offers: Nursery, Newlywed, Master

---

## Data Flows

### 1. Product Browse Flow (Current: Still Mock for Catalog)
```
User → Homepage/Shop/Chapter Page → Server Component fetches products (MOCK — drift) → Renders ProductGrid → User clicks product → Product Detail Page → Selects variant → useCart.addToCart() → POST /api/cart → Prisma addToCart → revalidate → CartSlideOut opens (REAL)
```

**Implemented Cart Flow (Real):**
```
User selects variant → useCart.addToCart(variantId) → POST /api/cart {variantId, quantity} → lib/db/cart.ts addToCart() [check stock, getOrCreate Cart, upsert CartItem] → GET /api/cart → CartContext updates → SlideOut shows item
```

### 2. Checkout Flow (Implemented)
```
Cart Page/SlideOut → "Checkout" → Checkout Page (4-step client) → Fill form → POST /api/checkout (validates stock, phone, POD eligibility) → createOrder Tx (Order + OrderItems, stock decrement) → POD ? redirect /order/[id]/success : redirect /api/payments/paystack/initialize → Paystack authorization_url → User pays → /checkout/callback?reference & orderId → POST /api/payments/paystack/verify → verifyPayment() → updateOrderPaymentStatus PAID → Success Page → WhatsApp CTA
```

### 3. Pay on Delivery Flow (Implemented)
```
Checkout (POD selected, validated ≤₦50k + Lagos/Abuja/PH) → POST /api/checkout → createOrder (PENDING) → redirect /order/[id]/success → Page shows POD notice → generateWhatsAppOrderUrl (admin + customer) → Admin processes → updateOrderStatus CONFIRMED → Delivery
```

### 4. Webhook Flow (Implemented)
```
Paystack event → POST /api/webhooks/paystack (verify signature with createHmac) → handleWebhook (charge.success/failed) → updateOrderPaymentStatus PAID/FAILED → status CONFIRMED if PAID
```

---

## Configuration Points

| Config | Location | Status | Description |
|--------|----------|--------|-------------|
| Database URL | `env:DATABASE_URL` | ✅ In .env.example | PostgreSQL connection string |
| Paystack Secret Key | `env:PAYSTACK_SECRET_KEY` | ✅ In .env.example | Server-side API calls |
| Paystack Public Key | `env:NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | ✅ In .env.example | Client-side initialization |
| Paystack Webhook Secret | `env:PAYSTACK_WEBHOOK_SECRET` | ✅ In .env.example | Verify webhook signatures |
| WhatsApp Business Number | `env:NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ In .env.example | 234XXXXXXXXXX format |
| GA4 Measurement ID | `env:NEXT_PUBLIC_GA4_ID` | ✅ In .env.example | G-XXXXXXXXXX |
| Meta Pixel ID | `env:NEXT_PUBLIC_META_PIXEL_ID` | ✅ In .env.example | Pixel ID |
| Hotjar Site ID | `env:NEXT_PUBLIC_HOTJAR_ID` | ✅ In .env.example | Site ID |
| App URL | `env:NEXT_PUBLIC_APP_URL` | ✅ In .env.example | https://bedroomchapters.ng |
| Currency | `src/lib/utils.ts` | ✅ Implemented | NGN, kobo-based storage |

---

## Security Considerations (Current)

| Area | Current State |
|------|---------------|
| Payment Verification | ✅ Server-side webhook (createHmac sha512) + verify API |
| POD Limits | ✅ Enforced in /api/checkout (≤₦50k, Lagos/Abuja/PH/Rivers) |
| Cart Persistence | ✅ Anonymous session (httpOnly, 1yr) + Prisma DB |
| Rate Limiting | ❌ Not implemented |
| CSP Headers | ❌ Not configured |
| Input Validation | 🔄 Client + basic API checks (phone regex, required fields); Zod not extracted |
| SQL Injection | ✅ Prevented via Prisma ORM |
| Stock Check | ✅ Validated before order creation + Tx decrement |

---

## Scalability Notes (Current)

| Area | Current State | Next Step |
|------|---------------|-----------|
| Product Catalog | Still mock data (12) — drift | Migrate to Prisma + ISR 1hr |
| Images | Unsplash URLs | Next.js Image + Vercel Edge + blur placeholders done |
| Database | Connected (seeded) — via Prisma + db push | Add connection pooling (PgBouncer) |
| Cart | Real Prisma + session cookie (1yr) | Consider Redis for high traffic |
| Analytics | Providers only (no events) | Add gtag/fbq event tracking |
| Sitemap | Real generation via Prisma | ISR / edge caching |

---

## Implementation Status Summary

### ✅ Phase 0: Foundation (COMPLETE)
- [x] Next.js 14 + TypeScript + Tailwind + Prisma project initialized
- [x] Environment configuration (.env.example)
- [x] Database schema (Prisma) — matches architecture exactly
- [x] Seed script with chapters, categories, products, variants, bundles
- [x] Design system (Tailwind config + CSS variables)
- [x] UI primitives (Button, Input, Select, Badge, Card, Sheet, Skeleton)
- [x] Layout components (Header, Footer, TrustBar)
- [x] Analytics providers (GA4, Meta Pixel, Hotjar)
- [x] WhatsApp floating button

### ✅ Phase 1: Core Catalog (COMPLETE — Catalog Still Mocks, SEO Done)
- [x] Product data model (Prisma + interfaces — queries still mock)
- [x] Homepage with hero, search, bestsellers, chapter teaser
- [x] Shop page with filters, product grid, pagination
- [x] Product detail page with gallery, variants, add-to-cart (now real via useCart), complete-the-look
- [x] Category pages (dynamic routes via shop/[category])
- [x] Image optimization config (next.config.js remotePatterns)
- [x] SEO basics (metadata, Open Graph, product schema, sitemap.xml + robots.txt via generate-sitemap.cjs)

### ✅ Phase 2: Chapters & Discovery (COMPLETE — Still Mocks)
- [x] Chapter data model (Prisma + interfaces — queries still mock)
- [x] Chapter pages (9) with hero, curated grid, bundle offer
- [x] Chapter navigation (homepage teaser, shop sidebar filter)
- [x] Bundle offer display and add-to-cart (mock navigation)

### ✅ Phase 3: Cart & Checkout (COMPLETE — Real Backend)
- [x] Cart data model (Prisma Cart + CartItem) + queries (get, add, update, remove, clear, totals) with sessionId cookie
- [x] CartSlideOut component (real: useCart)
- [x] Checkout page multi-step form (real submit via /api/checkout)
- [x] Form validation (Zod via hooks inline + API phone/POD checks; standalone validations.ts not yet extracted)
- [x] Delivery options (Standard, Express Lagos, POD conditional ≤₦50k)
- [x] Payment methods UI (Paystack + POD radio)
- [x] Order creation on submit (Tx, stock decrement, revalidate)
- [x] Cart context (CartProvider) + Server Actions

### ✅ Phase 4: Payments (COMPLETE)
- [x] Paystack integration (initialize, verify, webhook with signature)
- [x] Card/Transfer/USSD checkout flow (via Paystack channels)
- [x] Pay on Delivery flow (conditional, escrow note)
- [x] Payment verification webhooks (charge.success/failed → update status)
- [x] Success/failure pages (/order/[id]/success, /checkout/callback)
- [x] WhatsApp confirmations (lib/whatsapp.ts generateWhatsAppOrderUrl customer/admin)

### 🔄 Phase 5: Polish & Launch Prep (MOSTLY COMPLETE)
- [x] Loading skeletons (Skeleton component + isLoading states in cart/checkout)
- [x] Error boundaries (ErrorBoundary class + global-error.tsx) + empty states (EmptyState.tsx)
- [x] Accessibility audit (axe-ready, ARIA, focus, reduced motion — documented)
- [x] Performance audit (Lighthouse prep, postbuild sitemap, image optimization — documented)
- [ ] Cross-browser testing (pending)
- [ ] Production content (real photos — still Unsplash)
- [ ] Journal articles (5 SEO articles pending)
- [x] Legal pages (Terms, Privacy, Delivery & Returns)
- [ ] Live keys switch (still test keys)
- [ ] Vercel deployment (pending)

---

## Key Architectural Decisions (from project-decisions.md)

1. **Tech Stack:** Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL + Paystack + Vercel
2. **Database:** Prisma ORM, kobo-based pricing, anonymous session-based cart
3. **Authentication:** No auth for MVP — guest checkout only
4. **Payments:** Paystack (Card, Transfer, USSD) + Pay on Delivery (Lagos/Abuja/PH, ≤₦50k)
5. **Design System:** Custom Tailwind config (not component library) — minimal per brief
6. **Chapters:** 9 fixed life-stage chapters as curated product filters