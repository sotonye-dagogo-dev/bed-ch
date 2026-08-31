# Project Plan

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-08-30
> - staleness-policy: re-verify after each milestone or scope change
>
> **Overview:** Feature checklist inferred from codebase and client requirements. Tagged with complexity: [S] <1 day, [M] 1-3 days, [L] 3-5 days, [XL] >5 days.

---

## Phase 0: Foundation (Week 0) — [XL] ✅ COMPLETE

- [x] **Project Setup** — Initialize Next.js 14 + TypeScript + Tailwind + Prisma
- [x] **Environment Config** — `.env.example` with all required variables
- [x] **Database Schema** — Prisma schema for Products, Categories, Chapters, Cart, Orders
- [x] **Seed Data** — Script to populate categories, chapters, sample products (9 chapters, 8 categories, 12 products, variants, 3 bundles)
- [x] **Design System** — Tailwind config with design tokens, global CSS variables
- [x] **UI Primitives** — Button, Input, Select, Card, Badge, Sheet, Skeleton (Modal, Toast deferred)
- [x] **Layout Components** — Header, Footer, TrustBar, SearchBar, MobileMenu, CartIcon (in Header)
- [x] **Analytics Setup** — GA4, Meta Pixel, Hotjar providers (conditional loading)
- [x] **WhatsApp Button** — Floating chat-to-order button with pre-filled message, pulse animation, tooltip
- [ ] **CI/CD Pipeline** — GitHub Actions for lint, typecheck, test, build, deploy to Vercel

---

## Phase 1: Core Catalog (Week 1) — [L] ✅ UI COMPLETE (Mock Data)

- [x] **Product Data Model** — Prisma models + interfaces defined (queries use mock data)
- [x] **Homepage** — Hero, search bar, two-path buttons, bestsellers grid, chapter teaser, trust bar
- [x] **Shop Page** — Filter sidebar (category, price, size, color, chapter), product grid, pagination
- [x] **Product Detail** — Gallery, size selector, quantity, add-to-cart, complete-the-look, delivery estimate, reviews (placeholder)
- [x] **Category Pages** — Filtered shop view per category (dynamic route `shop/[category]`)
- [x] **Image Optimization** — Next.js Image config (remotePatterns, formats, sizes), priority/lazy loading
- [x] **SEO Basics** — Meta tags, Open Graph, product schema structure, metadata API

---

## Phase 2: Chapters & Discovery (Week 1-2) — [M] ✅ UI COMPLETE (Mock Data)

- [x] **Chapter Data Model** — Prisma models + interfaces defined (queries use mock data)
- [x] **Chapter Pages (9)** — Hero, intro, curated product grid, bundle offer
- [x] **Chapter Navigation** — Homepage teaser cards, shop sidebar filter, header dropdown (mobile menu)
- [x] **Bundle Offers** — Display on chapter pages, add-bundle-to-cart (mock navigation to cart)

---

## Phase 3: Cart & Checkout (Week 2) — [L] 🔄 UI COMPLETE, BACKEND PENDING

- [ ] **Cart Data Model** — Anonymous session-based cart (Prisma schema ready, queries not implemented)
- [x] **Cart Slide-Out** — Slide-out panel, item management, quantity, subtotal (mock data)
- [x] **Checkout Page** — Multi-step: Contact → Delivery → Payment → Confirmation (mock submit)
- [ ] **Form Validation** — Zod schemas for all checkout fields (client-side only, no schemas created)
- [x] **Delivery Options** — Standard, Express Lagos, Pay on Delivery (conditional UI)
- [ ] **Order Creation** — Server Action creates Order (PENDING), clears cart (mock 2s delay → success page)

---

## Phase 4: Payments (Week 2-3) — [L] ❌ NOT STARTED

- [ ] **Paystack Integration** — Client initialization, server verification, webhooks
- [ ] **Card/Transfer/USSD** — Standard Paystack checkout flow
- [ ] **Pay on Delivery** — Conditional (Lagos/Abuja/PH, ≤₦50k), escrow note, admin notification
- [ ] **Payment Verification** — Webhook handler updates order status, sends confirmations
- [ ] **Success/Failure Pages** — Order confirmation, error handling, retry logic
- [ ] **Receipts** — Email/WhatsApp order confirmation with details

---

## Phase 5: Notifications & Polish (Week 3) — [M] ❌ NOT STARTED

- [ ] **WhatsApp Notifications** — Order confirmation to customer, new order to admin
- [ ] **Loading States** — Skeletons for all async components (Skeleton component exists, partial usage)
- [ ] **Error Boundaries** — Graceful error UI for failed loads
- [ ] **Empty States** — No products, empty cart, no search results (basic only)
- [ ] **Accessibility Audit** — Focus management, ARIA, contrast, reduced motion
- [ ] **Performance Audit** — LCP < 2.5s, CLS < 0.1, TBT < 200ms on 3G
- [ ] **Cross-Browser Testing** — Chrome, Safari, Firefox mobile/desktop

---

## Phase 6: Launch Prep (Week 3-4) — [M] ❌ NOT STARTED

- [ ] **Production Database** — Vercel Postgres / Supabase setup
- [ ] **Domain & SSL** — bedroomchapters.ng (or similar)
- [ ] **Paystack Live Keys** — Switch from test to live
- [ ] **Analytics Live** — GA4, Meta Pixel, Hotjar live IDs
- [ ] **WhatsApp Business** — Verified business account
- [ ] **Content Population** — Real product photos, descriptions, prices (8-12 bestsellers minimum)
- [ ] **Journal Articles** — 5 SEO articles for launch
- [ ] **Legal Pages** — Terms, Privacy, Delivery & Returns content
- [ ] **Load Testing** — Simulate launch traffic
- [ ] **Launch Checklist** — Final verification against success metrics

---

## Phase 7: Post-Launch (Week 4+) — [S] each

- [ ] **Admin Dashboard** — Product CRUD, order management, basic analytics
- [ ] **Inventory Management** — Stock tracking, low-stock alerts
- [ ] **Customer Accounts** — Optional login, order history, reorder
- [ ] **Wishlist** — Save for later
- [ ] **Reviews System** — Verified purchase reviews
- [ ] **Loyalty Program** — Points, referrals
- [ ] **Subscription** — Recurring orders for consumables
- [ ] **Multi-language** — Pidgin, Yoruba, Igbo, Hausa
- [ ] **Mobile App** — React Native / Expo

---

## Complexity Legend

| Tag | Effort | Description |
|-----|--------|-------------|
| [S] | < 1 day | Small, well-defined, low risk |
| [M] | 1-3 days | Medium, multiple files, some integration |
| [L] | 3-5 days | Large, cross-cutting, significant integration |
| [XL] | > 5 days | Major milestone, architectural, high uncertainty |

---

## Success Metrics (from Client Brief)

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Sale | Within 48 hours of launch | Paystack dashboard |
| Week 1 Sales | 10 orders | Orders database |
| Page Load (3G) | < 3 seconds | Lighthouse / WebPageTest |
| Mobile Usability | 90+ score | Lighthouse |
| Checkout Completion | > 60% | Funnel analytics |

---

## Dependencies & Risks

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Paystack live approval | Delay in going live | Start test integration early, have POD as fallback |
| Product photography | Poor images hurt conversion | Use placeholder + real photos ASAP, brief photographer |
| WhatsApp Business verification | Can take days | Apply immediately, use personal number for testing |
| Vercel Postgres limits | Free tier limits | Monitor usage, plan upgrade path |
| 3G performance | Nigerian network variability | Test on real devices, optimize aggressively |

---

## Implementation Notes (2026-08-30)

**Current State:** Foundation sprint complete. All UI for Phases 0-3 implemented using mock data. Prisma schema defined and seeded but not connected to queries. No API routes, Server Actions, or Paystack integration yet.

**Next Priority:** Connect Prisma to database, implement cart/checkout backend queries, add Paystack integration, create API routes for cart and checkout operations.

**Technical Debt to Address:**
1. Replace all mock data in `src/lib/db/*.ts` with real Prisma queries
2. Create `src/lib/db/cart.ts` and `src/lib/db/orders.ts` with real implementations
3. Add `src/lib/paystack.ts`, `src/lib/whatsapp.ts`, `src/lib/analytics.ts`
4. Create API routes: `/api/cart`, `/api/checkout`, `/api/payments/*`, `/api/webhooks/paystack`
5. Add Zod validation schemas in `src/lib/validations.ts`
6. Implement session-based cart with cookie
7. Add error boundaries and comprehensive empty states
8. Set up GitHub Actions CI/CD pipeline