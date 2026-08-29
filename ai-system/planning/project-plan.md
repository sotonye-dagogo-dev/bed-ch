# Project Plan

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
> - staleness-policy: re-verify after each milestone or scope change

> **Overview:** Feature checklist inferred from codebase and client requirements. Tagged with complexity: [S] <1 day, [M] 1-3 days, [L] 3-5 days, [XL] >5 days.

---

## Phase 0: Foundation (Week 0) — [XL]

- [ ] **Project Setup** — Initialize Next.js 14 + TypeScript + Tailwind + Prisma
- [ ] **Environment Config** — `.env.example` with all required variables
- [ ] **Database Schema** — Prisma schema for Products, Categories, Chapters, Cart, Orders
- [ ] **Seed Data** — Script to populate categories, chapters, sample products
- [ ] **Design System** — Tailwind config with design tokens, global CSS variables
- [ ] **UI Primitives** — Button, Input, Select, Card, Badge, Sheet, Modal, Toast, Skeleton
- [ ] **Layout Components** — Header, Footer, TrustBar, SearchBar, MobileMenu, CartIcon
- [ ] **Analytics Setup** — GA4, Meta Pixel, Hotjar providers
- [ ] **WhatsApp Button** — Floating chat-to-order button with pre-filled message
- [ ] **CI/CD Pipeline** — GitHub Actions for lint, typecheck, test, build, deploy to Vercel

---

## Phase 1: Core Catalog (Week 1) — [L]

- [ ] **Product Data Model** — Prisma models + queries (products, variants, categories)
- [ ] **Homepage** — Hero, search bar, two-path buttons, bestsellers grid, chapter teaser, trust bar
- [ ] **Shop Page** — Filter sidebar (category, price, size, color, chapter), product grid, pagination
- [ ] **Product Detail** — Gallery, size selector, quantity, add-to-cart, complete-the-look, delivery estimate, reviews
- [ ] **Category Pages** — Filtered shop view per category
- [ ] **Image Optimization** — Next.js Image, blur placeholders, CDN configuration
- [ ] **SEO Basics** — Meta tags, Open Graph, product schema, sitemap, robots.txt

---

## Phase 2: Chapters & Discovery (Week 1-2) — [M]

- [ ] **Chapter Data Model** — Prisma models + queries (chapters, bundle offers)
- [ ] **Chapter Pages (9)** — Hero, intro, curated product grid, bundle offer
- [ ] **Chapter Navigation** — Homepage teaser cards, shop sidebar filter, header dropdown
- [ ] **Bundle Offers** — Display on chapter pages, add-bundle-to-cart functionality

---

## Phase 3: Cart & Checkout (Week 2) — [L]

- [ ] **Cart Data Model** — Anonymous session-based cart (Prisma + cookie)
- [ ] **Cart Slide-Out** — Slide-out panel, item management, quantity, subtotal
- [ ] **Checkout Page** — Multi-step: Contact → Delivery → Payment → Confirmation
- [ ] **Form Validation** — Zod schemas for all checkout fields
- [ ] **Delivery Options** — Standard, Express Lagos, Pay on Delivery (conditional)
- [ ] **Order Creation** — Server Action creates Order (PENDING), clears cart

---

## Phase 4: Payments (Week 2-3) — [L]

- [ ] **Paystack Integration** — Client initialization, server verification, webhooks
- [ ] **Card/Transfer/USSD** — Standard Paystack checkout flow
- [ ] **Pay on Delivery** — Conditional (Lagos/Abuja/PH, ≤₦50k), escrow note, admin notification
- [ ] **Payment Verification** — Webhook handler updates order status, sends confirmations
- [ ] **Success/Failure Pages** — Order confirmation, error handling, retry logic
- [ ] **Receipts** — Email/WhatsApp order confirmation with details

---

## Phase 5: Notifications & Polish (Week 3) — [M]

- [ ] **WhatsApp Notifications** — Order confirmation to customer, new order to admin
- [ ] **Loading States** — Skeletons for all async components
- [ ] **Error Boundaries** — Graceful error UI for failed loads
- [ ] **Empty States** — No products, empty cart, no search results
- [ ] **Accessibility Audit** — Focus management, ARIA, contrast, reduced motion
- [ ] **Performance Audit** — LCP < 2.5s, CLS < 0.1, TBT < 200ms on 3G
- [ ] **Cross-Browser Testing** — Chrome, Safari, Firefox mobile/desktop

---

## Phase 6: Launch Prep (Week 3-4) — [M]

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