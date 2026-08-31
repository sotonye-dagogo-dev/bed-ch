# Task Queue

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-synced: 2026-08-30
> - staleness-policy: update after every session; re-prioritize weekly

> **Overview:** Immediate actionable tasks. Pull from here for `dev-cycle.md` or `execute-feature.md`. Format: `[TAG] Task description — context/acceptance`

---

## 🔥 Immediate (Next Session) — Foundation ✅ COMPLETE

| Task | Complexity | Context / Acceptance Criteria |
|------|------------|-------------------------------|
| `[x] [XL] Initialize Next.js 14 project with TypeScript, Tailwind, Prisma` | XL | `npx create-next-app@latest bed-ch --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` → add Prisma, configure |
| `[x] [L] Configure Tailwind with design tokens from design-system.md` | L | Colors, typography, spacing, radius, shadows as CSS variables + Tailwind theme.extend |
| `[x] [L] Create Prisma schema (products, categories, chapters, cart, orders)` | L | Match system-architecture.md exactly; run `prisma db push` and `prisma generate` |
| `[x] [M] Create seed script with 9 chapters, 8 categories, 12 sample products` | M | Categories: Bedding, Pillows, Rugs, Curtains, Lighting, Storage, Nightwear, Function; Chapters per brief |
| `[x] [M] Build UI primitives: Button, Input, Select, Card, Badge, Sheet, Skeleton` | M | Follow design-system.md specs; export from `@/components/ui` |
| `[x] [M] Build layout components: Header, Footer, TrustBar, SearchBar, MobileMenu` | M | Header: sticky, logo, search, cart, WhatsApp; TrustBar: 3 badges fixed bottom mobile |
| `[x] [S] Add analytics providers: GA4, Meta Pixel, Hotjar (test IDs)` | S | Providers in `@/components/analytics`, load via next/script in root layout |
| `[x] [S] Add WhatsApp floating button with pre-filled message` | S | "Chat to order" button, pulse animation, tooltip desktop, 24px from edge |
| `[x] [S] Set up .env.example with all required variables` | S | DATABASE_URL, PAYSTACK_*, WHATSAPP_NUMBER, GA4_ID, META_PIXEL_ID, HOTJAR_ID, APP_URL |
| `[x] [S] Configure ESLint, Prettier, TypeScript strict mode` | S | `npm run lint`, `npm run typecheck` pass |
| `[ ] [M] Set up GitHub Actions CI/CD pipeline` | M | Lint, typecheck, test, build, deploy to Vercel |

---

## 📦 Phase 1: Core Catalog ✅ UI COMPLETE (Mock Data)

| Task | Complexity | Context / Acceptance Criteria |
|------|------------|-------------------------------|
| `[~] [L] Implement product queries (list, get, search, by-category, by-chapter)` | L | `@/lib/db/products.ts` with caching (ISR 1hr), proper TypeScript types — **Currently mock data** |
| `[~] [L] Implement category & chapter queries` | L | `@/lib/db/categories.ts`, `@/lib/db/chapters.ts` — **Currently mock data** |
| `[x] [L] Build Homepage: Hero + Search + Two-Path + Bestsellers + Chapter Teaser` | L | Server component, `getBestsellers(8-12)`, `getActiveChapters(9)`, responsive grid |
| `[x] [L] Build Shop Page: Sidebar filters + ProductGrid + Pagination` | L | URL-based filters (category, price, size, color, chapter), 2/3/4/5 col grid |
| `[x] [L] Build Product Detail Page: Gallery, SizeSelector, AddToCart, CompleteTheLook` | L | Server component for product, client components for interactions |
| `[x] [M] Build Category Pages (dynamic routes)` | M | `/shop/[category]` reuses shop components with pre-filter |
| `[x] [M] Configure Next.js Image optimization (CDN, blur placeholders, sizes)` | M | `next.config.js` remotePatterns, product image component with priority/lazy |
| `[x] [M] Add SEO: meta tags, Open Graph, product schema, sitemap.xml, robots.txt` | M | `next-sitemap` or custom, JSON-LD Product schema on product pages — **sitemap/robots pending** |

---

## 📚 Phase 2: Chapters & Discovery ✅ UI COMPLETE (Mock Data)

| Task | Complexity | Context / Acceptance Criteria |
|------|------------|-------------------------------|
| `[~] [M] Build Chapter Page template: Hero + Curated Grid + BundleOffer` | M | `/chapter/[slug]`, `getChapterBySlug`, `getProductsByChapter(12-20)`, bundle CTA — **Mock data** |
| `[x] [S] Add chapter navigation: Homepage teaser (9 cards), Shop sidebar filter` | S | ChapterCard component, ChapterGrid 3x3 mobile / horizontal scroll desktop |
| `[x] [S] Implement bundle offer: display discounted price, add-bundle-to-cart` | S | BundleOffer component, adds multiple CartItems at once (mock navigation) |

---

## 🛒 Phase 3: Cart & Checkout 🔄 UI COMPLETE, BACKEND PENDING

| Task | Complexity | Context / Acceptance Criteria |
|------|------------|-------------------------------|
| `[ ] [L] Implement cart queries (get, add, update, remove, clear) + session cookie` | L | Anonymous cart via `sessionId` cookie (1yr), Prisma Cart + CartItem models |
| `[x] [L] Build CartSlideOut: Slide-out sheet, CartItem list, CartSummary, Checkout CTA` | L | Framer Motion animation, sticky header/footer, portal to body |
| `[x] [L] Build Checkout Page: Multi-step form (Contact → Delivery → Payment → Confirm)` | L | React Hook Form + Zod (client-side only), progress indicator, mock submit |
| `[x] [M] Implement delivery options: Standard, Express Lagos, POD (conditional)` | M | POD only for Lagos/Abuja/PH ≤₦50k, show escrow note, calculate fees |
| `[x] [M] Implement payment methods: Paystack (card/transfer/USSD) + POD radio` | M | Paystack inline embed for card, redirect for transfer/USSD, POD creates order directly (UI only) |
| `[ ] [S] Create Order on checkout submit (PENDING status, clear cart)` | S | Server action: create Order + OrderItems, generate orderNumber (BC-YYYY-NNNN) |

---

## 💳 Phase 4: Payments

| Task | Complexity | Context / Acceptance Criteria |
|------|------------|-------------------------------|
| `[L] Integrate Paystack: initializePayment, verifyPayment, webhook handler` | L | `@/lib/paystack.ts` with types, secret key server-only, public key client |
| `[L] Build Paystack checkout flow: redirect → callback → verify → success/fail` | L | `/checkout?payment=paystack` → Paystack → `/checkout/callback` → verify → `/order/[id]/success` |
| `[M] Implement Pay on Delivery flow: create order → WhatsApp admin → confirm` | M | POD creates order directly, sends WhatsApp to admin with order details |
| `[M] Handle Paystack webhooks: charge.success, charge.failed → update order` | M | Verify signature, update Order.paymentStatus, send confirmations |
| `[S] Build success/failure pages with order details and WhatsApp CTA` | S | Success: order summary, tracking info; Failure: retry, contact support |
| `[S] Send order confirmations: WhatsApp (customer + admin), email (future)` | S | `src/lib/whatsapp.ts` generate URLs with order details |

---

## ✨ Phase 5: Polish & Launch Prep

| Task | Complexity | Context / Acceptance Criteria |
|------|------------|-------------------------------|
| `[M] Add loading skeletons for all async components (products, chapters, cart)` | M | Skeleton components matching final layout, no layout shift |
| `[M] Add error boundaries + empty states (no products, empty cart, 404)` | M | Graceful degradation, helpful messaging, retry buttons |
| `[L] Accessibility audit: focus management, ARIA, contrast, reduced motion` | L | axe-core, manual testing, `prefers-reduced-motion` respected |
| `[L] Performance audit: LCP < 2.5s, CLS < 0.1, TBT < 200ms on 3G throttle` | L | Lighthouse CI, WebPageTest, optimize images, reduce JS |
| `[M] Cross-browser testing: Chrome, Safari, Firefox (mobile + desktop)` | M | BrowserStack or local devices, fix layout issues |
| `[L] Populate production content: real photos, descriptions, prices (12+ products)` | L | Minimum 8-12 bestsellers with real Nigerian bedroom photos |
| `[M] Write 5 journal articles for SEO launch` | M | Topics: "How to choose bedsheets", "Bedroom setup for newlyweds", etc. |
| `[S] Legal pages: Terms, Privacy, Delivery & Returns` | S | Static pages with Nigerian consumer law compliance |
| `[S] Switch to live keys: Paystack live, GA4 live, Meta Pixel live, WhatsApp Business` | S | Update `.env.production`, verify all integrations |
| `[S] Deploy to Vercel: custom domain, SSL, environment variables` | S | `vercel --prod`, configure domain, verify all env vars |

---

## 🎯 Launch Checklist (Final Verification)

- [ ] Homepage loads < 3s on 3G (Lighthouse)
- [ ] Shop page filters work, URL updates, pagination works
- [ ] Product detail: images load, size selector works, add-to-cart opens slide-out
- [ ] Cart slide-out: add/remove/update qty, subtotal correct, checkout navigates
- [ ] Checkout: form validates, delivery options show correctly, POD conditional
- [ ] Paystack test payment: card → success → order confirmed → WhatsApp sent
- [ ] POD order: creates order → WhatsApp admin notification → status PENDING
- [ ] Chapter pages: 9 chapters accessible, bundles show, products filtered
- [ ] WhatsApp button: opens chat with pre-filled message on all pages
- [ ] Trust bar: visible on all pages (fixed bottom mobile)
- [ ] Analytics: GA4 events firing (page_view, add_to_cart, begin_checkout, purchase)
- [ ] SEO: meta tags present, sitemap.xml valid, robots.txt allows crawlers
- [ ] Error handling: 404, 500, network errors show friendly UI
- [ ] Mobile: all touch targets 44px+, no horizontal scroll, smooth scrolling

---

## 📋 Backlog (Post-Launch)

| Task | Complexity | Notes |
|------|------------|-------|
| `[XL] Admin Dashboard: Product CRUD, Order Management, Basic Analytics` | XL | Separate route group `(admin)`, auth required |
| `[L] Inventory Management: Stock tracking, low-stock alerts, reservations` | L | Extend ProductVariant with stock, admin UI |
| `[L] Customer Accounts: Optional login, order history, reorder, addresses` | L | NextAuth.js, email/password or magic link |
| `[M] Wishlist: Save for later, share wishlist` | M | LocalStorage + sync if logged in |
| `[M] Reviews System: Verified purchase reviews, ratings, photos` | M | Review model, moderation, display on product pages |
| `[L] Loyalty Program: Points per purchase, referrals, redeem for discounts` | L | Points ledger, referral codes, discount codes |
| `[XL] Subscription: Recurring orders for consumables (towels, sheets)` | XL | Paystack subscriptions, frequency management |
| `[L] Multi-language: Pidgin, Yoruba, Igbo, Hausa (i18n)` | L | next-intl or similar, translation management |
| `[XL] Mobile App: React Native / Expo with shared API` | XL | Separate repo, shared types via package |

---

## Task Execution Rules

1. **Pull from top** — Always take the highest-priority unstarted task
2. **One at a time** — Complete current task before starting next (unless blocked)
3. **Update status** — Mark `[ ]` → `[~]` (in progress) → `[x]` (done) in real time
4. **Log blockers** — If blocked, add `BLOCKED: <reason>` and move to next
5. **Sync context** — Run `sync-context.md` after each completed task
6. **Verify work** — Run `verify-work.md` before marking `[x]`

---

## Current Sprint Focus

**Sprint 0 (Foundation):** ✅ COMPLETE — All UI tasks done, CI/CD pending
**Sprint 1 (Backend Integration):** 🔄 NEXT — Replace mock data with real Prisma queries, implement cart/checkout backend, add Paystack
**Sprint 2 (Payments):** ❌ PENDING — Paystack integration, POD flow, webhooks
**Sprint 3 (Polish + Launch):** ❌ PENDING — Accessibility, performance, content, deployment