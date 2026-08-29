# System Architecture

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
> - staleness-policy: re-verify if architecture changes or after major refactor

> **Overview:** High-level structural documentation — module breakdown, data flows, configuration points, and architectural decisions.

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
│                 │  │  • Product fetching (cached)  │  │                   │
│                 │  │  • Chapter page rendering     │  │                   │
│                 │  │  • SEO meta generation        │  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 │                  │                  │                   │
│                 │  ┌───────────────▼───────────────┐  │                   │
│                 │  │      CLIENT COMPONENTS        │  │                   │
│                 │  │  • Cart slide-out (state)     │  │                   │
│                 │  │  • WhatsApp floating button   │  │                   │
│                 │  │  • Add-to-cart interactions   │  │                   │
│                 │  │  • Checkout form              │  │                   │
│                 │  └───────────────┬───────────────┘  │                   │
│                 │                  │                  │                   │
│                 │  ┌───────────────▼───────────────┐  │                   │
│                 │  │      API ROUTES / ACTIONS     │  │                   │
│                 │  │  • POST /api/cart             │  │                   │
│                 │  │  • POST /api/checkout         │  │                   │
│                 │  │  • POST /api/payments/verify  │  │                   │
│                 │  │  • POST /api/webhooks/paystack│  │                   │
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
            │ • Products    │ │ • Initialize  │ │ • Click-to-chat│
            │ • Categories  │ │ • Verify      │ │ • Pre-filled  │
            │ • Chapters    │ │ • Webhooks    │ │   messages    │
            │ • Orders      │ │ • POD logic   │ │               │
            │ • Cart items  │ │               │ │               │
            └───────────────┘ └───────────────┘ └───────────────┘
```

---

## Module Breakdown

### 1. Frontend Layer (`src/app`)

| Route Group | Pages | Purpose |
|-------------|-------|---------|
| `(site)` | `/`, `/about`, `/delivery-returns`, `/contact`, `/journal`, `/journal/[slug]` | Static/marketing pages, SEO content |
| `(shop)` | `/shop`, `/shop/[category]`, `/product/[id]`, `/chapter/[slug]`, `/cart`, `/checkout` | Core e-commerce flow |
| `(admin)` | `/admin/*` | Future: product/order management (post-MVP) |

**Key Components:**
- `src/components/ui/` — Reusable UI primitives (Button, Card, Input, Badge, etc.)
- `src/components/layout/` — Header, Footer, Navigation, TrustBar
- `src/components/product/` — ProductCard, ProductGrid, ProductImages, SizeSelector
- `src/components/cart/` — CartSlideOut, CartItem, CheckoutForm
- `src/components/chapter/` — ChapterCard, ChapterGrid, ChapterHero
- `src/components/whatsapp/` — WhatsAppFloatButton
- `src/components/analytics/` — GA4, MetaPixel, Hotjar providers

### 2. Data Layer (`src/lib`)

| Module | Purpose |
|--------|---------|
| `prisma.ts` | Prisma client singleton |
| `db/products.ts` | Product queries (list, get, search, by-category, by-chapter) |
| `db/chapters.ts` | Chapter queries (list, get, products-by-chapter) |
| `db/cart.ts` | Cart operations (get, add, update, remove, clear) |
| `db/orders.ts` | Order creation, retrieval, status updates |
| `paystack.ts` | Paystack client, initialization, verification, webhook handling |
| `whatsapp.ts` | WhatsApp URL generation with pre-filled messages |
| `analytics.ts` | Event tracking helpers (GA4, Meta, Hotjar) |
| `utils.ts` | Formatters (currency, slugify), validators |

### 3. Database Schema (Prisma)

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
}

model ProductVariant {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  size       String?  // e.g., "Single", "Queen", "King"
  color      String?
  sku        String   @unique
  stock      Int      @default(0)
  price      Int?     // override price in kobo
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
}

model CartItem {
  id        String @id @default(cuid())
  cartId    String
  cart      Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int    @default(1)
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

---

## Data Flows

### 1. Product Browse Flow
```
User → Homepage/Shop/Chapter Page → Server Component fetches products (cached) → Renders ProductGrid → User clicks product → Product Detail Page (Server Component) → User selects variant → "Add to Cart" → Client Action updates cart → CartSlideOut opens
```

### 2. Checkout Flow
```
CartSlideOut → "Checkout" → Checkout Page (Client Component) → User fills form → Submit → Server Action creates Order (PENDING) → Redirect to Paystack (if card/transfer/USSD) OR Confirm Order (if POD) → Paystack Callback → Webhook verifies → Update Order status → Success Page
```

### 3. Pay on Delivery Flow
```
Checkout (POD selected) → Server Action creates Order (PENDING, paymentMethod=POD) → WhatsApp notification to admin → SMS/Email to customer → Admin confirms → Order status → CONFIRMED → Delivery
```

---

## Configuration Points

| Config | Location | Description |
|--------|----------|-------------|
| Database URL | `env:DATABASE_URL` | PostgreSQL connection string |
| Paystack Secret Key | `env:PAYSTACK_SECRET_KEY` | Server-side API calls |
| Paystack Public Key | `env:NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Client-side initialization |
| Paystack Webhook Secret | `env:PAYSTACK_WEBHOOK_SECRET` | Verify webhook signatures |
| WhatsApp Business Number | `env:NEXT_PUBLIC_WHATSAPP_NUMBER` | 234XXXXXXXXXX format |
| GA4 Measurement ID | `env:NEXT_PUBLIC_GA4_ID` | G-XXXXXXXXXX |
| Meta Pixel ID | `env:NEXT_PUBLIC_META_PIXEL_ID` | Pixel ID |
| Hotjar Site ID | `env:NEXT_PUBLIC_HOTJAR_ID` | Site ID |
| App URL | `env:NEXT_PUBLIC_APP_URL` | https://bedroomchapters.ng |
| Currency | `src/lib/constants.ts` | NGN, kobo-based storage |

---

## Security Considerations

- All payments verified server-side via Paystack webhook + verification API
- POD orders limited to ₦50,000 and Lagos/Abuja/PH only
- Cart tied to anonymous session (no auth required)
- Rate limiting on checkout API routes
- CSP headers for Paystack inline embed
- Input validation on all Server Actions (Zod schemas)
- SQL injection prevented via Prisma ORM

---

## Scalability Notes

- Product catalog: ISR (Incremental Static Regeneration) with 1-hour revalidate
- Images: Optimized via Next.js Image + Vercel Edge Network
- Database: Connection pooling via Prisma + PgBouncer (Supabase/Vercel Postgres)
- Cart: In-memory for session, persisted to DB on checkout
- Future: Redis for cart sessions, CDN for assets, background jobs for order processing