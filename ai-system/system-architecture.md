# System Architecture

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-08-30
> - staleness-policy: re-verify if architecture changes or after major refactor
>
> **Overview:** High-level structural documentation — module breakdown, data flows, configuration points, and architectural decisions. Updated to reflect actual implementation state as of 2026-08-30.

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
│                 │  │  • SEO meta generation        │  │                   │
│                 │  │  • Category/Chapter lists     │  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 │                  │                  │                   │
│                 │  ┌───────────────▼───────────────┐  │                   │
│                 │  │      CLIENT COMPONENTS        │  │                   │
│                 │  │  • Cart slide-out (state)     │  │                   │
│                 │  │  • WhatsApp floating button   │  │                   │
│                 │  │  • Add-to-cart (MOCK)         │  │                   │
│                 │  │  • Checkout form (MOCK)       │  │                   │
│                 │  │  • Filter sidebar (URL sync)  │  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 │                  │                  │                   │
│                 │  ┌───────────────▼───────────────┐  │                   │
│                 │  │      API ROUTES / ACTIONS     │  │                   │
│                 │  │  • NOT YET IMPLEMENTED        │  │                   │
│                 │  │  • Planned:                   │  │                   │
│                 │  │    - POST /api/cart           │  │                   │
│                 │  │    - POST /api/checkout       │  │                   │
│                 │  │    - POST /api/payments/verify│  │                   │
│                 │  │    - POST /api/webhooks/paystack│ │                  │
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
            │ • Products    │ │ • NOT YET     │ │ • Click-to-chat│
            │ • Categories  │ │   INTEGRATED  │ │ • Pre-filled  │
            │ • Chapters    │ │ • Planned:    │ │   messages    │
            │ • Orders      │ │   Initialize  │ │               │
            │ • Cart items  │ │   Verify      │ │               │
            │               │ │   Webhooks    │ │               │
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
| Root Layout | `layout.tsx`, `globals.css` | ✅ | Providers, fonts, header, footer, trust bar, analytics |
| Homepage | `page.tsx` | ✅ | Hero, search, two-path CTAs, bestsellers, chapter teaser |
| Shop | `shop/page.tsx` | ✅ | Filter sidebar, product grid, pagination, URL-based filters |
| Product Detail | `product/[id]/page.tsx` | ✅ | Gallery, variants, add-to-cart, complete-the-look, delivery estimate |
| Chapter | `chapter/[slug]/page.tsx` | ✅ | Hero, curated products, bundle offer |
| Cart | `cart/page.tsx` | 🔄 | Full-page cart (mock data), slide-out via Header |
| Checkout | `checkout/page.tsx` | 🔄 | 4-step form (mock data, no persistence) |
| Admin | (future) | ❌ | Post-MVP: product/order management |

**Key Components:**

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| UI Primitives | `src/components/ui/` | ✅ | Button, Input, Select, Badge, Card, Sheet, Skeleton |
| Layout | `src/components/layout/` | ✅ | Header, Footer, TrustBar |
| Product | `src/components/product/` | ✅ | ProductGrid, FilterSidebar |
| Cart | `src/components/cart/` | 🔄 | CartSlideOut (mock data) |
| WhatsApp | `src/components/whatsapp/` | ✅ | WhatsAppFloatButton |
| Analytics | `src/components/analytics/` | ✅ | GA4, MetaPixel, Hotjar providers (no events yet) |

---

### 2. Data Layer (`src/lib`)

| Module | File | Status | Purpose |
|--------|------|--------|---------|
| Prisma Client | `prisma.ts` | ✅ | Singleton client (not yet used in queries) |
| Product Queries | `db/products.ts` | 🔄 | Mock data implementation, interfaces defined |
| Chapter Queries | `db/chapters.ts` | 🔄 | Mock data implementation, interfaces defined |
| Category Queries | `db/categories.ts` | 🔄 | Mock data implementation, interfaces defined |
| Cart Queries | (not created) | ❌ | Will need: get, add, update, remove, clear |
| Order Queries | (not created) | ❌ | Will need: create, get, update status |
| Paystack | `paystack.ts` (not created) | ❌ | Client, initialization, verification, webhooks |
| WhatsApp | `whatsapp.ts` (not created) | ❌ | URL generation with dynamic messages |
| Analytics | `analytics.ts` (not created) | ❌ | Event tracking helpers |
| Utils | `utils.ts` | ✅ | Formatters, constants, validators |
| Validations | `validations.ts` (not created) | ❌ | Zod schemas for forms/API |
| Server Actions | `server-actions.ts` (not created) | ❌ | Server-side mutations |

---

### 3. Database Schema (Prisma) — ✅ Defined, ❌ Not Migrated

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

### 1. Product Browse Flow (Current: Mock Data)
```
User → Homepage/Shop/Chapter Page → Server Component fetches products (MOCK) → Renders ProductGrid → User clicks product → Product Detail Page (Server Component) → User selects variant → "Add to Cart" → Client updates mock state → CartSlideOut opens
```

**Target Flow (with Database):**
```
User → Homepage/Shop/Chapter Page → Server Component fetches products (ISR 1hr) → Renders ProductGrid → User clicks product → Product Detail Page (Server Component) → User selects variant → "Add to Cart" → Server Action updates cart → CartSlideOut opens
```

### 2. Checkout Flow (Current: Mock Submit)
```
CartSlideOut → "Checkout" → Checkout Page (Client Component) → User fills form → Submit → MOCK delay → Redirect to /order/success
```

**Target Flow (with Paystack):**
```
CartSlideOut → "Checkout" → Checkout Page (Client Component) → User fills form → Submit → Server Action creates Order (PENDING) → Redirect to Paystack (if card/transfer/USSD) OR Confirm Order (if POD) → Paystack Callback → Webhook verifies → Update Order status → Success Page
```

### 3. Pay on Delivery Flow (Not Implemented)
```
Checkout (POD selected) → Server Action creates Order (PENDING, paymentMethod=POD) → WhatsApp notification to admin → SMS/Email to customer → Admin confirms → Order status → CONFIRMED → Delivery
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

## Security Considerations (Current vs Target)

| Area | Current State | Target State |
|------|---------------|--------------|
| Payment Verification | ❌ Not implemented | ✅ Server-side via Paystack webhook + verification API |
| POD Limits | ❌ UI only | ✅ ₦50,000 max, Lagos/Abuja/PH only |
| Cart Persistence | ❌ Mock in-memory | ✅ Anonymous session + DB |
| Rate Limiting | ❌ Not implemented | ✅ On checkout API routes |
| CSP Headers | ❌ Not configured | ✅ For Paystack inline embed |
| Input Validation | ❌ Client-side only | ✅ Zod schemas on all Server Actions |
| SQL Injection | N/A (mock data) | ✅ Prevented via Prisma ORM |

---

## Scalability Notes (Current vs Target)

| Area | Current State | Target State |
|------|---------------|--------------|
| Product Catalog | Mock data (12 products) | ISR with 1-hour revalidate |
| Images | Unsplash URLs | Next.js Image + Vercel Edge Network |
| Database | Not connected | Connection pooling via Prisma + PgBouncer |
| Cart | Mock in-memory | Redis for sessions, DB persistence on checkout |
| Analytics | Providers only | Full event tracking (GA4, Meta, Hotjar) |

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

### 🔄 Phase 1: Core Catalog (MOSTLY COMPLETE — Using Mock Data)
- [x] Product data model (Prisma + interfaces)
- [x] Homepage with hero, search, bestsellers, chapter teaser
- [x] Shop page with filters, product grid, pagination
- [x] Product detail page with gallery, variants, add-to-cart, complete-the-look
- [x] Category pages (dynamic routes via shop/[category])
- [x] Image optimization config (next.config.js remotePatterns)
- [x] SEO basics (metadata, Open Graph, product schema structure)

### 🔄 Phase 2: Chapters & Discovery (COMPLETE — Using Mock Data)
- [x] Chapter data model (Prisma + interfaces)
- [x] Chapter pages (9) with hero, curated grid, bundle offer
- [x] Chapter navigation (homepage teaser, shop sidebar filter)
- [x] Bundle offer display and add-to-cart (mock)

### ❌ Phase 3: Cart & Checkout (UI COMPLETE — No Backend)
- [ ] Cart data model (Prisma ready, queries not implemented)
- [x] CartSlideOut component (mock data)
- [x] Checkout page multi-step form (mock submit)
- [ ] Form validation (Zod schemas not created)
- [x] Delivery options UI (Standard, Express Lagos, POD conditional)
- [x] Payment methods UI (Paystack + POD radio)
- [ ] Order creation on submit

### ❌ Phase 4: Payments (NOT STARTED)
- [ ] Paystack integration (initialize, verify, webhooks)
- [ ] Card/Transfer/USSD checkout flow
- [ ] Pay on Delivery flow
- [ ] Payment verification webhooks
- [ ] Success/failure pages
- [ ] WhatsApp/email confirmations

### ❌ Phase 5: Polish & Launch Prep (NOT STARTED)
- [ ] Loading skeletons (partial — Skeleton component exists)
- [ ] Error boundaries + empty states
- [ ] Accessibility audit
- [ ] Performance audit
- [ ] Cross-browser testing
- [ ] Production content (real photos, descriptions, prices)
- [ ] Journal articles
- [ ] Legal pages
- [ ] Live keys switch
- [ ] Vercel deployment

---

## Key Architectural Decisions (from project-decisions.md)

1. **Tech Stack:** Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL + Paystack + Vercel
2. **Database:** Prisma ORM, kobo-based pricing, anonymous session-based cart
3. **Authentication:** No auth for MVP — guest checkout only
4. **Payments:** Paystack (Card, Transfer, USSD) + Pay on Delivery (Lagos/Abuja/PH, ≤₦50k)
5. **Design System:** Custom Tailwind config (not component library) — minimal per brief
6. **Chapters:** 9 fixed life-stage chapters as curated product filters