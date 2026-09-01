# Lessons Learned

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: append-only; never delete, only supersede with new entry linking back
>
> **Overview:** Debugging insights, patterns that worked/failed, gotchas discovered. Each entry: Situation, What Happened, Root Cause, Fix, Prevention.

---

## 2026-08-30: Mock Data Pattern for Rapid UI Development

**Situation:** Building all UI components and pages before database backend is ready.

**What Happened:** Implemented complete UI for Phases 0-3 (45+ components/pages) using mock data in `src/lib/db/*.ts` files. Each query file exports TypeScript interfaces matching the Prisma schema and provides async functions that return mock data with artificial delays.

**Root Cause:** Database schema was defined but PostgreSQL connection not yet configured. Wanted to validate UI/UX designs and component interactions before investing in backend integration.

**Fix:** Created a consistent mock data pattern:
- Interfaces match Prisma models exactly (Product, ProductVariant, Chapter, Category, BundleOffer)
- Async functions with `await new Promise(resolve => setTimeout(resolve, 50-100))` to simulate network latency
- Filter/sort/pagination logic implemented in-memory on mock arrays
- Consistent return types (PaginatedProducts, Product[], Chapter[], etc.)

**Prevention:** 
- This pattern works well for UI-first development but creates technical debt
- Must replace all mock implementations with real Prisma queries before Sprint 1
- Consider using a mock service worker (MSW) for more realistic API mocking in future projects
- Document the mock-to-real migration checklist in project-plan.md

---

## 2026-08-30: Tailwind Config + CSS Variables Dual Definition

**Situation:** Design tokens defined in both `tailwind.config.ts` and `src/app/globals.css` (`:root` CSS variables).

**What Happened:** Both files contain identical color, spacing, typography, radius, shadow, and transition tokens. This duplication was intentional per the design-system.md "Implementation Mapping" section.

**Root Cause:** Design brief specified CSS variables for runtime theming flexibility, while Tailwind config enables utility classes. Both are needed for different use cases.

**Fix:** 
- Kept both in sync manually during initial setup
- CSS variables used for: dynamic theming, non-Tailwind styles, third-party component integration
- Tailwind config used for: utility classes, responsive design, component variants

**Prevention:**
- Create a single source of truth (e.g., `design-tokens.json`) and generate both files via script
- For now, treat Tailwind config as primary and CSS variables as derivative
- Add a note to verify both match when design tokens change

---

## 2026-08-30: Inline Component Interfaces vs Shared Types

**Situation:** TypeScript interfaces for Product, Chapter, Category, CartItem defined inline in each file rather than in a shared `src/types/` directory.

**What Happened:** Each component and query file defines its own interfaces (e.g., `Product` in `products.ts`, `ProductGrid.tsx`, `page.tsx`). Some interfaces are subsets (ProductGrid only needs id, name, slug, price, compareAt, images, isBestseller, category).

**Root Cause:** Rapid development velocity — didn't want to create shared types directory until interfaces stabilized. Also, different consumers need different field subsets.

**Fix:** 
- Acceptable for mock phase — interfaces match Prisma schema
- Will consolidate to `src/types/` when replacing mock data with real Prisma queries
- Prisma generates types that can be imported and extended

**Prevention:**
- Create `src/types/` directory early in next sprint
- Use Prisma generated types as base: `import type { Product } from '@prisma/client'`
- Define component-specific types as `Pick<Product, 'id' | 'name' | ...>` or extensions

---

## 2026-08-30: Server Components with Mock Data

**Situation:** All pages use Next.js Server Components (`async function Page()`) but fetch mock data instead of real database queries.

**What Happened:** Pages like `page.tsx`, `shop/page.tsx`, `product/[id]/page.tsx`, `chapter/[slug]/page.tsx` are Server Components that call `getProducts()`, `getProductBySlug()`, `getChapterBySlug()` which return mock data with artificial delays.

**Root Cause:** Next.js 14 App Router encourages Server Components for data fetching. Mock async functions maintain the same signature as future real Prisma queries.

**Fix:** This pattern works well — the component signatures won't change when switching to real queries. Just replace the mock implementation in `src/lib/db/*.ts`.

**Prevention:**
- Keep query function signatures stable (same params, same return types)
- Add `cache: 'no-store'` or `revalidate` options when switching to real queries
- Consider adding `unstable_cache` for expensive queries

---

## 2026-08-30: Client Components for Interactivity

**Situation:** Components requiring interactivity (CartSlideOut, FilterSidebar mobile, WhatsAppFloatButton, checkout form) use `'use client'` directive.

**What Happened:** Properly separated Server Components (pages, data fetching) from Client Components (interactivity, state). CartSlideOut uses Framer Motion for animation and `createPortal` for rendering to body.

**Root Cause:** Next.js 14 requires `'use client'` for hooks, browser APIs, event handlers. Architecture correctly places client boundaries at leaf components.

**Fix:** 
- CartSlideOut: Client component (state, animation, portal)
- FilterSidebar: Client component (mobile sheet state, URL navigation)
- WhatsAppFloatButton: Client component (tooltip state, resize listener)
- Checkout page: Entire page is Client Component (form state, step navigation)
- Product detail: Server Component (data) + Client Components for variant selectors (could be extracted)

**Prevention:**
- Minimize Client Component boundaries — push interactivity to leaves
- Product detail page could extract variant selectors, quantity, add-to-cart to a Client Component
- This reduces client bundle size and improves streaming

---

## 2026-08-30: URL-Based Filter State Management

**Situation:** Shop page filters (category, price, size, color, chapter, sortBy, page) managed via URL search params.

**What Happened:** FilterSidebar reads `searchParams` from page props and navigates via `window.location.href` with updated params. No React state for filters — URL is single source of truth.

**Root Cause:** Enables deep linking, browser back/forward, sharing filtered views. Server Components can read filters from `searchParams` prop.

**Fix:** 
- Page receives `searchParams: Promise<{...}>` and awaits it
- FilterSidebar builds new URL with `URLSearchParams` and navigates
- Server Component re-fetches with new params on navigation

**Prevention:**
- This pattern scales well — keep URL as source of truth for all filterable views
- Consider adding `replace: true` for some navigation to avoid history clutter
- For complex filters, consider a custom hook `useSearchParams` (Next.js 15) or `useRouter` + `useSearchParams` (Client Component)

---

## 2026-08-30: Conditional Rendering for Analytics Providers

**Situation:** Analytics providers (GA4, Meta Pixel, Hotjar) only render when environment variables are set and not placeholder values.

**What Happened:** `AnalyticsProviders.tsx` checks for valid IDs before rendering each provider. Placeholder values like `G-XXXXXXXXXX` are treated as invalid.

**Root Cause:** Prevents console errors and unnecessary script loading in development without real keys.

**Fix:**
```tsx
if (!ga4Id || ga4Id === 'G-XXXXXXXXXX') return null;
```

**Prevention:**
- Keep this pattern — it's clean and prevents dev environment noise
- Add similar checks for any third-party script integration
- Document required env vars in README

---

## 2026-08-30: Framer Motion for Cart Animation

**Situation:** CartSlideOut uses Framer Motion for slide-in animation and `createPortal` to render at body level.

**What Happened:** Smooth 300ms spring animation with backdrop blur. Portal prevents z-index issues with fixed header.

**Root Cause:** Framer Motion provides declarative animations that are performant (transform/opacity only). Portal ensures cart renders above all content.

**Fix:**
- Used `layout` prop not needed — simple x-transform animation
- `AnimatePresence` for exit animations
- Backdrop as separate motion.div with opacity animation

**Prevention:**
- Consider CSS-only animation for simpler cases (reduce bundle size)
- Framer Motion ~50kb — acceptable for complex animations like this
- Respect `prefers-reduced-motion` (already in globals.css)

---

## 2026-08-30: Nigerian Market Specifics in Code

**Situation:** Multiple places where Nigerian-specific logic is hardcoded (states, delivery options, payment methods, currency formatting, phone validation).

**What Happened:** 
- `NIGERIAN_STATES` array in `utils.ts` (37 states)
- `DELIVERY_OPTIONS` with POD conditional logic
- `PAYMENT_METHODS` with Paystack variants + POD
- `formatCurrency`/`formatPrice` use `en-NG` locale, kobo conversion
- Phone validation regex for Nigerian format: `/^(\+234|0)[789]\d{9}$/`
- POD eligibility: Lagos, Abuja, Port Harcourt only, ≤₦50k

**Root Cause:** Client requirements are specifically for Nigerian market. These are domain constants, not configuration.

**Fix:** Centralized in `src/lib/utils.ts` as exported constants. Components import and use them.

**Prevention:**
- Keep domain constants in `utils.ts` or `constants.ts` — don't scatter
- If expanding to other countries, extract to configurable locale system
- Phone validation should eventually use a library (libphonenumber-js)

---

## 2026-09-01: Cart Persistence via Session Cookie + Prisma

**Situation:** Cart must persist anonymously without auth; guest checkout only.

**What Happened:** Implemented `getSessionId()` in `src/lib/db/cart.ts:41` using `next/headers cookies()` — reads `sessionId`, creates with `crypto.randomUUID()`, sets httpOnly/lax/1yr. All cart queries (`getCart`, `addToCart`, `updateCartItemQuantity`, `removeFromCart`, `clearCart`) use this sessionId. Complemented by `src/lib/cart-context.tsx` client hook fetching `/api/cart` and API routes bridging cookie persistence. Stock validated before add/update.

**Root Cause:** MVP has no auth; session via cookie is simplest persistence.

**Fix:** HttpOnly cookie prevents XSS theft; Prisma Cart model indexed on sessionId; transaction not needed for single CartItem upsert but used for order creation.

**Prevention:**
- Document session lifecycle (1yr maxAge) — add expiry cleanup job later
- Add rate limiting on /api/cart to prevent abuse
- When adding auth later, migrate sessionId → userId

---

## 2026-09-01: Transactional Order Creation with Stock Decrement

**Situation:** Order creation must be atomic — create Order+Items and decrement stock.

**What Happened:** `src/lib/db/orders.ts:92` uses `prisma.$transaction(async tx => { create order → loop variant update decrement })`. Subtotal calculated from variant price override, deliveryFee via `calculateDeliveryFee`. If any variant missing or transaction fails, whole order rolls back.

**Root Cause:** Without transaction, order could be created but stock not decremented (or vice versa) on crash.

**Fix:** Prisma transaction ensures atomicity; cart fetched by sessionId + variantId filtering prevents mismatched items.

**Prevention:**
- Add optimistic locking or check stock inside transaction to avoid race
- Current code checks stock before transaction in /api/checkout but not inside Tx — could oversell under concurrency
- Future: use `updateMany` with where stock >= quantity or DB constraint

---

## 2026-09-01: Paystack Webhook HMAC Verification

**Situation:** Webhook POSTs must be authenticated.

**What Happened:** `src/lib/paystack.ts:99` uses `crypto.createHmac('sha512', WEBHOOK_SECRET).update(payload).digest('hex')` compared to `x-paystack-signature` in `/api/webhooks/paystack/route.ts`. `handleWebhook` extracts orderId from metadata custom_fields.

**Root Cause:** Without HMAC, attacker could forge paid events.

**Fix:** Signature verified before `handleWebhook`; orderId extracted from custom_fields variable_name `order_id`.

**Prevention:**
- Test webhook locally with Paystack CLI; log failures
- Add idempotency: if order already PAID, skip duplicate update
- Current code logs but doesn't verify amount matches — add amount check vs order.total

---

## 2026-09-01: Task-Queue Drift — False "Real Prisma" Claims

**Situation:** After 2026-08-31 commits, task-queue.md marked products/chapters/categories as "[x] Now using real Prisma data" but file inspection shows they still use mock arrays.

**What Happened:** `src/lib/db/products.ts`, `chapters.ts`, `categories.ts` still contain `mockProducts` etc. with artificial delays. Only `cart.ts` and `orders.ts` migrated. Task-queue update was premature — possibly conflated cart completion with catalog migration.

**Root Cause:** Bulk marking of Phase 1 tasks without verifying file contents.

**Fix:** Added drift entry to DISCREPANCY_REPORT.md; keep docs accurate until migration done.

**Prevention:**
- Verify `grep -c "mockProducts" src/lib/db/products.ts` before marking complete
- Use `sync-context` lightweight check weekly to catch drift early
- Treat task-queue as source of truth only after `last-verified-against-code` matches

---

## 2026-09-01: Sitemap Postbuild Generation

**Situation:** Sitemap must include dynamic product/category/chapter slugs.

**What Happened:** Created `scripts/generate-sitemap.cjs` using Prisma to query active slugs, writing `public/sitemap.xml` + `sitemap-0.xml`. Hooked via `package.json:postbuild` ("node scripts/generate-sitemap.cjs"). `next-sitemap` added to deps but not used — custom script preferred.

**Root Cause:** Next.js doesn't auto-generate sitemap for dynamic routes.

**Fix:** Custom CommonJS script avoids ESM/Prisma issues; queries categories/chapters/products in parallel.

**Prevention:**
- Run `npm run build` locally to verify sitemap output before deploy
- Add `public/sitemap*.xml` to .gitignore or commit generated? Currently committed — decide policy
- Consider `next-sitemap` config instead if customization grows