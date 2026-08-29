# Dependency Graph

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
> - staleness-policy: re-verify if module relationships change

> **Overview:** Module relationships as text diagram. Auto-regenerable via script.

---

## High-Level Layer Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  src/app/(site)  src/app/(shop)  src/app/(admin)  src/components│
└─────────────────────────────┬───────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│  src/lib/db/*  src/lib/paystack.ts  src/lib/whatsapp.ts         │
│  src/hooks/*  src/app/api/*  src/lib/server-actions.ts          │
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
src/app/(site)/layout.tsx
    ├─ src/components/layout/Header.tsx
    ├─ src/components/layout/Footer.tsx
    ├─ src/components/layout/TrustBar.tsx
    ├─ src/components/layout/SearchBar.tsx
    ├─ src/components/whatsapp/WhatsAppFloatButton.tsx
    └─ src/components/providers/CartProvider.tsx (context)

src/app/(site)/page.tsx (Homepage)
    ├─ src/components/layout/Header.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/product/ProductCard.tsx
    ├─ src/components/chapter/ChapterGrid.tsx
    │   └─ src/components/chapter/ChapterCard.tsx
    ├─ src/lib/db/products.ts (getBestsellers)
    └─ src/lib/db/chapters.ts (getActiveChapters)

src/app/(site)/journal/page.tsx
    └─ src/lib/db/journal.ts (getArticles) — future

src/app/(site)/journal/[slug]/page.tsx
    └─ src/lib/db/journal.ts (getArticleBySlug) — future
```

### `(shop)` — E-Commerce Pages
```
src/app/(shop)/layout.tsx
    ├─ src/components/layout/Header.tsx
    ├─ src/components/layout/Footer.tsx
    ├─ src/components/layout/TrustBar.tsx
    ├─ src/components/layout/SearchBar.tsx
    ├─ src/components/whatsapp/WhatsAppFloatButton.tsx
    ├─ src/components/providers/CartProvider.tsx
    └─ src/components/cart/CartSlideOut.tsx (portal)

src/app/(shop)/shop/page.tsx
    ├─ src/components/layout/SearchBar.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/product/ProductCard.tsx
    ├─ src/components/product/CategoryFilters.tsx (sidebar)
    ├─ src/lib/db/products.ts (getProducts with filters)
    └─ src/lib/db/categories.ts (getCategories)

src/app/(shop)/shop/[category]/page.tsx
    └─ (same as shop/page.tsx with category filter)

src/app/(shop)/product/[id]/page.tsx
    ├─ src/components/product/ProductImages.tsx
    ├─ src/components/product/SizeSelector.tsx
    ├─ src/components/product/QuantityStepper.tsx
    ├─ src/components/product/AddToCartButton.tsx
    ├─ src/components/product/CompleteTheLook.tsx
    │   └─ src/components/product/ProductCard.tsx
    ├─ src/components/product/DeliveryEstimate.tsx
    ├─ src/components/product/Reviews.tsx
    ├─ src/lib/db/products.ts (getProductById)
    └─ src/lib/db/products.ts (getRelatedProducts)

src/app/(shop)/chapter/[slug]/page.tsx
    ├─ src/components/chapter/ChapterHero.tsx
    ├─ src/components/product/ProductGrid.tsx
    │   └─ src/components/product/ProductCard.tsx
    ├─ src/components/chapter/BundleOffer.tsx
    ├─ src/lib/db/chapters.ts (getChapterBySlug)
    ├─ src/lib/db/products.ts (getProductsByChapter)
    └─ src/lib/db/chapters.ts (getBundleOffer)

src/app/(shop)/cart/page.tsx
    └─ src/components/cart/CartSlideOut.tsx (full page on mobile)

src/app/(shop)/checkout/page.tsx
    ├─ src/components/cart/CheckoutForm.tsx
    │   ├─ src/components/cart/DeliveryOptions.tsx
    │   ├─ src/components/cart/PaymentMethods.tsx
    │   └─ src/components/cart/OrderSummary.tsx
    ├─ src/lib/db/cart.ts (getCart)
    ├─ src/lib/paystack.ts (initializePayment)
    └─ src/app/api/checkout/route.ts (Server Action)
```

---

## Component Dependency Tree

### UI Primitives (Leaf Nodes)
```
src/components/ui/Button.tsx
    └─ (no internal deps)

src/components/ui/Input.tsx, Select.tsx, Checkbox.tsx, RadioGroup.tsx
    └─ (no internal deps)

src/components/ui/Card.tsx, Badge.tsx, Stepper.tsx
    └─ (no internal deps)

src/components/ui/Sheet.tsx, Modal.tsx, Toast.tsx
    └─ (uses Radix UI primitives or headless)

src/components/ui/Skeleton.tsx, Spinner.tsx
    └─ (no internal deps)
```

### Layout Components
```
src/components/layout/Header.tsx
    ├─ src/components/ui/Button.tsx
    ├─ src/components/layout/SearchBar.tsx
    ├─ src/components/layout/CartIcon.tsx
    │   └─ src/components/ui/Button.tsx
    ├─ src/components/layout/MobileMenu.tsx
    │   └─ src/components/ui/Sheet.tsx
    └─ src/hooks/useCart.ts (cart count)

src/components/layout/Footer.tsx
    └─ src/components/ui/Link.tsx (Next.js Link)

src/components/layout/TrustBar.tsx
    └─ src/components/ui/Badge.tsx (trust variant)

src/components/layout/SearchBar.tsx
    ├─ src/components/ui/Input.tsx
    └─ src/components/ui/Button.tsx

src/components/layout/CartIcon.tsx
    ├─ src/components/ui/Button.tsx
    └─ src/hooks/useCart.ts

src/components/layout/MobileMenu.tsx
    ├─ src/components/ui/Sheet.tsx
    ├─ src/components/ui/Button.tsx
    └─ src/components/chapter/ChapterGrid.tsx (chapter links)
```

### Product Components
```
src/components/product/ProductCard.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/ui/Button.tsx (Add to Cart)
    ├─ src/components/ui/Badge.tsx (bestseller, sale)
    ├─ src/lib/utils.ts (formatPrice)
    └─ next/image

src/components/product/ProductGrid.tsx
    └─ src/components/product/ProductCard.tsx (map)

src/components/product/ProductImages.tsx
    ├─ next/image
    ├─ src/components/ui/Button.tsx (thumbnails)
    └─ src/hooks/useMediaQuery.tsx (swipe vs thumbnails)

src/components/product/SizeSelector.tsx
    ├─ src/components/ui/RadioGroup.tsx
    └─ src/components/ui/Label.tsx

src/components/product/QuantityStepper.tsx
    ├─ src/components/ui/Button.tsx
    └─ src/components/ui/Input.tsx

src/components/product/AddToCartButton.tsx
    ├─ src/components/ui/Button.tsx
    └─ src/hooks/useCart.ts (addToCart mutation)

src/components/product/CompleteTheLook.tsx
    └─ src/components/product/ProductCard.tsx (horizontal scroll)

src/components/product/DeliveryEstimate.tsx
    ├─ src/components/ui/Input.tsx
    └─ src/lib/utils.ts (calculateDeliveryDate)

src/components/product/Reviews.tsx
    ├─ src/components/ui/Button.tsx (expand)
    └─ src/components/ui/Skeleton.tsx (loading)
```

### Cart Components
```
src/components/cart/CartSlideOut.tsx
    ├─ src/components/ui/Sheet.tsx
    ├─ src/components/cart/CartItem.tsx (list)
    ├─ src/components/cart/CartSummary.tsx
    ├─ src/components/ui/Button.tsx (checkout CTA)
    └─ src/hooks/useCart.ts (cart state + actions)

src/components/cart/CartItem.tsx
    ├─ src/components/ui/Button.tsx (remove)
    ├─ src/components/product/QuantityStepper.tsx
    ├─ src/components/ui/Badge.tsx (size/color)
    └─ src/lib/utils.ts (formatPrice)

src/components/cart/CartSummary.tsx
    ├─ src/lib/utils.ts (formatPrice)
    └─ src/components/ui/Button.tsx (checkout)

src/components/cart/CheckoutForm.tsx
    ├─ src/components/ui/Input.tsx
    ├─ src/components/ui/Select.tsx
    ├─ src/components/cart/DeliveryOptions.tsx
    ├─ src/components/cart/PaymentMethods.tsx
    ├─ src/components/cart/OrderSummary.tsx
    └─ src/lib/validations.ts (checkoutSchema)

src/components/cart/DeliveryOptions.tsx
    ├─ src/components/ui/RadioGroup.tsx
    └─ src/lib/constants.ts (DELIVERY_OPTIONS)

src/components/cart/PaymentMethods.tsx
    ├─ src/components/ui/RadioGroup.tsx
    ├─ src/lib/constants.ts (PAYMENT_METHODS)
    └─ src/lib/paystack.ts (loadPaystackScript)

src/components/cart/OrderSummary.tsx
    ├─ src/components/cart/CartItem.tsx (readonly)
    └─ src/lib/utils.ts (formatPrice)
```

### Chapter Components
```
src/components/chapter/ChapterCard.tsx
    ├─ src/components/ui/Card.tsx
    ├─ src/components/ui/Button.tsx (view chapter)
    └─ next/image

src/components/chapter/ChapterGrid.tsx
    └─ src/components/chapter/ChapterCard.tsx (map)

src/components/chapter/ChapterHero.tsx
    ├─ next/image
    └─ src/components/ui/Badge.tsx (chapter label)

src/components/chapter/BundleOffer.tsx
    ├─ src/components/ui/Card.tsx (variant)
    ├─ src/components/product/ProductCard.tsx (bundle items)
    ├─ src/components/ui/Button.tsx (add bundle)
    └─ src/lib/utils.ts (calculateBundlePrice)
```

### WhatsApp Component
```
src/components/whatsapp/WhatsAppFloatButton.tsx
    ├─ src/components/ui/Tooltip.tsx
    ├─ src/lib/whatsapp.ts (generateWhatsAppUrl)
    └─ src/hooks/useMediaQuery.tsx (hide tooltip on mobile)
```

### Analytics Providers
```
src/components/analytics/GA4Provider.tsx
    └─ next/script (GA4 measurement ID)

src/components/analytics/MetaPixelProvider.tsx
    └─ next/script (Meta Pixel ID)

src/components/analytics/HotjarProvider.tsx
    └─ next/script (Hotjar Site ID)
```

---

## Library Dependencies

### Database Queries (`src/lib/db/`)
```
src/lib/db/products.ts
    ├─ src/lib/prisma.ts
    ├─ src/types/product.ts
    └─ src/lib/utils.ts (slugify)

src/lib/db/chapters.ts
    ├─ src/lib/prisma.ts
    ├─ src/types/chapter.ts
    └─ src/lib/db/products.ts (getProductsByChapter)

src/lib/db/categories.ts
    ├─ src/lib/prisma.ts
    └─ src/types/category.ts

src/lib/db/cart.ts
    ├─ src/lib/prisma.ts
    ├─ src/types/cart.ts
    └─ src/lib/utils.ts (generateSessionId)

src/lib/db/orders.ts
    ├─ src/lib/prisma.ts
    ├─ src/types/order.ts
    └─ src/lib/utils.ts (generateOrderNumber)
```

### External Integrations
```
src/lib/paystack.ts
    ├─ src/types/api.ts (Paystack types)
    ├─ src/lib/constants.ts (PAYSTACK_CONFIG)
    └─ fetch (native)

src/lib/whatsapp.ts
    ├─ src/lib/constants.ts (WHATSAPP_NUMBER)
    └─ src/lib/utils.ts (encodeWhatsAppMessage)

src/lib/analytics.ts
    ├─ src/types/analytics.ts (event types)
    └─ window.gtag / window.fbq / window.hj (globals)
```

### Utilities
```
src/lib/utils.ts
    ├─ clsx / tailwind-merge (class merging)
    ├─ formatPrice (Intl.NumberFormat NGN)
    ├─ slugify
    ├─ generateSessionId
    ├─ generateOrderNumber
    └─ calculateDeliveryDate

src/lib/validations.ts
    └─ zod (schemas for checkout, contact, etc.)

src/lib/constants.ts
    ├─ CURRENCY = 'NGN'
    ├─ DELIVERY_OPTIONS
    ├─ PAYMENT_METHODS
    ├─ POD_STATES = ['Lagos', 'Abuja', 'Rivers']
    ├─ POD_MAX_AMOUNT = 5000000 (50k in kobo)
    └─ CHAPTER_SLUGS = ['nursery', 'teen', 'newlywed', ...]
```

### Hooks
```
src/hooks/useCart.ts
    ├─ src/lib/db/cart.ts (server actions)
    ├─ src/types/cart.ts
    └─ React Context (CartProvider)

src/hooks/useDebounce.ts
    └─ (generic, no internal deps)

src/hooks/useLocalStorage.ts
    └─ (generic, no internal deps)

src/hooks/useMediaQuery.tsx
    └─ (generic, no internal deps)
```

---

## API Route Dependencies

```
src/app/api/cart/route.ts
    ├─ src/lib/db/cart.ts
    ├─ src/lib/validations.ts (cartSchema)
    └─ src/types/api.ts

src/app/api/checkout/route.ts
    ├─ src/lib/db/cart.ts
    ├─ src/lib/db/orders.ts
    ├─ src/lib/paystack.ts (initializePayment)
    ├─ src/lib/whatsapp.ts (sendOrderNotification)
    ├─ src/lib/analytics.ts (trackPurchase)
    └─ src/lib/validations.ts (checkoutSchema)

src/app/api/payments/initialize/route.ts
    ├─ src/lib/paystack.ts (initializeTransaction)
    └─ src/lib/validations.ts

src/app/api/payments/verify/route.ts
    └─ src/lib/paystack.ts (verifyTransaction)

src/app/api/payments/webhook/route.ts
    ├─ src/lib/paystack.ts (verifyWebhookSignature)
    ├─ src/lib/db/orders.ts (updateOrderPaymentStatus)
    ├─ src/lib/whatsapp.ts (sendConfirmation)
    └─ src/lib/analytics.ts (trackPurchase)

src/app/api/products/route.ts
    ├─ src/lib/db/products.ts
    └─ src/lib/validations.ts (filterSchema)
```

---

## External Service Dependencies

```
Paystack
    ├─ Initialize Transaction (POST /transaction/initialize)
    ├─ Verify Transaction (GET /transaction/verify/:reference)
    ├─ Webhook Events (charge.success, charge.failed)
    └─ Pay on Delivery (custom integration)

WhatsApp Business API
    └─ Click-to-chat: https://wa.me/234XXXXXXXXXX?text=<encoded_message>

Google Analytics 4
    └─ gtag('event', 'purchase', { ... })

Meta Pixel
    └─ fbq('track', 'Purchase', { ... })

Hotjar
    └─ Automatic session recording (script embed)
```

---

## Type Dependencies

```
src/types/product.ts
    └─ Prisma generated types (Product, ProductVariant, Category)

src/types/chapter.ts
    └─ Prisma generated types (Chapter, BundleOffer)

src/types/cart.ts
    └─ Prisma generated types (Cart, CartItem)

src/types/order.ts
    └─ Prisma generated types (Order, OrderItem, enums)

src/types/api.ts
    └─ Request/Response types for API routes

src/types/analytics.ts
    └─ Event payload types
```

---

## Build-Time Dependencies

```
next.config.js
    ├─ images.remotePatterns (product images CDN)
    ├─ headers (CSP for Paystack)
    ├─ rewrites (legacy URLs)
    └─ env validation

tailwind.config.ts
    ├─ theme.extend.colors (design tokens)
    ├─ theme.extend.fontFamily
    ├─ theme.extend.spacing
    ├─ theme.extend.borderRadius
    ├─ theme.extend.boxShadow
    └─ plugins (typography, forms, aspect-ratio)

tsconfig.json
    ├─ paths: @/* → src/*
    ├─ strict: true
    └─ plugins: next-typescript
```

---

## Critical Path (User Journey)

```
Homepage → Product Discovery → Product Detail → Add to Cart → Cart Slide-Out → Checkout → Payment → Success
     │              │                │              │               │            │          │         │
     ▼              ▼                ▼              ▼               ▼            ▼          ▼         ▼
getBestsellers  getProducts     getProduct    addToCart       getCart      createOrder  verifyPay  trackPurchase
getChapters     getCategories   getRelated    updateCart      (session)    (PENDING)    (webhook)  (analytics)
                                                                    sendWhatsApp
```

---

## Circular Dependency Prevention

| Rule | Enforcement |
|------|-------------|
| UI primitives never import from other components | ESLint rule: `no-restricted-imports` |
| `src/lib/db/*` only imports `src/lib/prisma.ts` and types | Architectural convention |
| `src/hooks/*` only imports `src/lib/db/*` and types | Architectural convention |
| API routes only import `src/lib/*` and types | Next.js convention |
| Components never import from `src/app/*` | Next.js convention |
| Types only import from other types or Prisma | TypeScript convention |