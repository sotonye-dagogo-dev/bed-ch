# Project Plan

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
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

## Phase 1: Core Catalog (Week 1) — [L] ✅ UI COMPLETE (Catalog Still Mocks, SEO Done)

- [x] **Product Data Model** — Prisma models + interfaces defined (queries STILL mock — drift, see DISCREPANCY_REPORT)
- [x] **Homepage** — Hero, search bar, two-path buttons, bestsellers grid, chapter teaser, trust bar
- [x] **Shop Page** — Filter sidebar (category, price, size, color, chapter), product grid, pagination
- [x] **Product Detail** — Gallery, size selector, quantity, add-to-cart (now real via useCart), complete-the-look, delivery estimate, reviews (placeholder)
- [x] **Category Pages** — Filtered shop view per category (dynamic route `shop/[category]`)
- [x] **Image Optimization** — Next.js Image config (remotePatterns, formats, sizes), priority/lazy loading
- [x] **SEO Basics** — Meta tags, Open Graph, product schema, sitemap.xml + robots.txt (generate-sitemap.cjs), metadata API

---

## Phase 2: Chapters & Discovery (Week 1-2) — [M] ✅ UI COMPLETE (Still Mocks)

- [x] **Chapter Data Model** — Prisma models + interfaces defined (queries STILL mock — drift)
- [x] **Chapter Pages (9)** — Hero, intro, curated product grid, bundle offer
- [x] **Chapter Navigation** — Homepage teaser cards, shop sidebar filter, header dropdown (mobile menu)
- [x] **Bundle Offers** — Display on chapter pages, add-bundle-to-cart (mock navigation to cart)

---

## Phase 3: Cart & Checkout (Week 2) — [L] ✅ COMPLETE (Real Backend)

- [x] **Cart Data Model** — Anonymous session-based cart (Prisma + cart.ts: getCart, addToCart, update, remove, clear, totals, sessionId cookie 1yr)
- [x] **Cart Slide-Out** — Slide-out panel (real: useCart, Framer Motion, portal)
- [x] **Cart Page** — Full-page cart (real: useCart, EmptyState, ErrorBoundary)
- [x] **Checkout Page** — Multi-step: Contact → Delivery → Payment → Confirm (real: /api/checkout, stock + POD validation)
- [x] **Form Validation** — Zod via react-hook-form inline + API checks (standalone validations.ts still missing)
- [x] **Delivery Options** — Standard, Express Lagos, Pay on Delivery (conditional ≤₦50k, Lagos/Abuja/PH)
- [x] **Order Creation** — Server Actions + /api/checkout creates Order (PENDING, Tx + stock decrement, clears cart) → redirect
- [x] **Cart Context** — CartProvider + useCart hook (fetch /api/cart) + Server Actions

---

## Phase 4: Payments (Week 2-3) — [L] ✅ COMPLETE

- [x] **Paystack Integration** — lib/paystack.ts (initializePayment, verifyPayment, verifyWebhookSignature, handleWebhook)
- [x] **Card/Transfer/USSD** — Paystack channels via /api/payments/paystack/initialize + callback verification
- [x] **Pay on Delivery** — Conditional (Lagos/Abuja/PH/Rivers, ≤₦50k), escrow note, admin WhatsApp
- [x] **Payment Verification** — Webhook handler (/api/webhooks/paystack) + /api/payments/paystack/verify
- [x] **Success/Failure Pages** — /order/[id]/success + /checkout/callback + /order/[id] detail
- [x] **Receipts** — WhatsApp order confirmation URLs (customer + admin) via lib/whatsapp.ts

---

## Phase 5: Notifications & Polish (Week 3) — [M] ✅ MOSTLY COMPLETE

- [x] **WhatsApp Notifications** — lib/whatsapp.ts (generateWhatsAppOrderUrl customer/admin) + floating button dynamic URL
- [x] **Loading States** — Skeleton component + isLoading in cart/checkout/callback
- [x] **Error Boundaries** — ErrorBoundary class + global-error.tsx + error states in cart/checkout
- [x] **Empty States** — EmptyState.tsx (EmptyCartState, EmptyProductState, generic)
- [x] **Accessibility Audit** — ARIA, focus rings, semantic HTML, reduced motion (axe-ready, documented)
- [x] **Performance Audit** — Next.Image optimization, sitemap postbuild, Lighthouse budgets documented
- [ ] **Cross-Browser Testing** — Chrome, Safari, Firefox mobile/desktop (pending)

---

## Phase 6: Launch Prep (Week 3-4) — [M] 🔄 IN PROGRESS

- [ ] **Production Database** — Vercel Postgres / Supabase setup (schema ready, seed ready, local push done)
- [ ] **Domain & SSL** — bedroomchapters.ng (or similar) — pending
- [ ] **Paystack Live Keys** — Switch from test to live — pending
- [ ] **Analytics Live** — GA4, Meta Pixel, Hotjar live IDs — pending
- [ ] **WhatsApp Business** — Verified business account — pending
- [ ] **Content Population** — Real product photos, descriptions, prices (still Unsplash placeholders)
- [ ] **Journal Articles** — 5 SEO articles for launch — pending
- [x] **Legal Pages** — Terms, Privacy, Delivery & Returns (Nigerian consumer law compliant)
- [x] **SEO Assets** — robots.txt + sitemap.xml + sitemap-0.xml via scripts/generate-sitemap.cjs
- [ ] **Load Testing** — Simulate launch traffic — pending
- [ ] **Launch Checklist** — Final verification against success metrics — pending (see task-queue.md)

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

## Implementation Notes (2026-09-01)

**Current State:** Backend Integration + Payments + Polish sprints delivered (2026-08-31). Cart/Payments fully functional with real Prisma. Legal pages, SEO assets, error/empty states complete. Remaining gap: catalog queries (products/chapters/categories) still mock — task-queue incorrectly marks them [x] "Now using real Prisma data" but code inspection shows mock arrays + artificial delays. All other task-queue phases 3-5 correctly completed.

**Next Priority:** Migrate `src/lib/db/products.ts`, `chapters.ts`, `categories.ts` to real Prisma queries (matching cart.ts/orders.ts pattern). Then extract validations.ts, add analytics event tracking, set up CI/CD, cross-browser testing, production content, and Vercel deployment.

**Technical Debt Still Pending:**
1. Replace mock data in `src/lib/db/products.ts`, `chapters.ts`, `categories.ts` with real Prisma queries (HIGH — drift)
2. Extract `src/lib/validations.ts` (Zod schemas currently inline in checkout)
3. Add `src/lib/analytics.ts` event tracking (providers only)
4. Create `src/hooks/` and `src/types/` directories (useCart lives in lib/cart-context, inline interfaces remain)
5. Set up GitHub Actions CI/CD pipeline (only opencode workflows exist)
6. Cross-browser testing, production content, journal articles, live keys, Vercel deployment
7. Add PWA manifest.json, comprehensive tests (test-plan exists, no test files)