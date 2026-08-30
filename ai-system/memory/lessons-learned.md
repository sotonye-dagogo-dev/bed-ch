# Lessons Learned

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-08-30
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