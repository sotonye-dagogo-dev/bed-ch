# Project Decisions

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: append-only; never delete, only supersede with new entry linking back

> **Overview:** Explicit decisions with rationale. Each entry: Decision, Context, Alternatives Considered, Consequences, Supersedes.

---

## 2026-08-29: Tech Stack Selection

**Decision:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL + Paystack + Vercel

**Context:** Greenfield e-commerce project for Nigerian market. Requirements: mobile-first, fast on 3G, SEO-critical, Paystack integration, WhatsApp integration, guest checkout.

**Alternatives Considered:**
- Remix + Vite: Smaller ecosystem, less Nigerian developer familiarity
- Nuxt 3: Vue preference, but team has stronger React/Next.js experience
- Plain React + Vite + Express: No SSR/ISR, worse SEO, more boilerplate
- Shopify: Monthly cost, less control, Nigerian payment integration complex
- WooCommerce: PHP, hosting complexity, performance on shared hosting

**Consequences:**
- ✅ Excellent Vercel deployment (zero-config)
- ✅ Server Components reduce client JS bundle
- ✅ ISR for product catalog (fast, fresh)
- ✅ Native Paystack integration via API routes
- ✅ TypeScript end-to-end (Prisma + Next.js)
- ✅ Large Nigerian developer community for hiring/support
- ⚠️ App Router learning curve for team members
- ⚠️ Vercel Postgres free tier limits (plan for upgrade)

**Supersedes:** None (initial decision)

---

## 2026-08-29: Database Schema Approach

**Decision:** Prisma ORM with PostgreSQL, kobo-based pricing (integer), anonymous session-based cart

**Context:** Need type-safe database access, Nigerian currency (NGN) with kobo precision, guest checkout without auth.

**Alternatives Considered:**
- Raw SQL / pg: No type safety, more boilerplate
- Drizzle ORM: Good but Prisma has better migration tooling and studio
- MongoDB: No relational integrity for orders/products
- Firebase: Vendor lock-in, complex queries for e-commerce

**Consequences:**
- ✅ Type-safe queries with autocomplete
- ✅ Prisma Studio for visual DB management
- ✅ Migrations version-controlled
- ✅ Kobo storage avoids floating-point errors
- ✅ Anonymous cart via session cookie (no auth needed)
- ⚠️ Prisma bundle size (mitigate with `@prisma/client` only in server)
- ⚠️ Connection pooling needed for serverless (use PgBouncer/Supabase)

**Supersedes:** None

---

## 2026-08-29: Authentication Strategy

**Decision:** No authentication for MVP — guest checkout only

**Context:** Client explicitly stated: "No account/login required to buy (guest checkout only)". Reduces friction for first purchase.

**Alternatives Considered:**
- NextAuth.js with email/password: Adds complexity, friction
- Magic links: Still requires email entry
- Social login: Privacy concerns, extra dependencies

**Consequences:**
- ✅ Minimum friction to purchase (60-second checkout goal)
- ✅ No auth infrastructure to maintain
- ✅ No password reset, email verification flows
- ⚠️ No order history for customers (mitigate: order lookup by phone/email)
- ⚠️ No saved addresses (mitigate: browser autofill)
- ⚠️ Harder to build loyalty later (plan: add accounts post-launch)

**Supersedes:** None

---

## 2026-08-29: Payment Methods

**Decision:** Paystack (Card, Transfer, USSD) + Pay on Delivery (Lagos/Abuja/PH, ≤₦50k)

**Context:** Nigerian market requires multiple payment options. POD is critical trust signal. Paystack is market leader.

**Alternatives Considered:**
- Flutterwave: Good but Paystack has better POD integration
- PayPal: Not widely used in Nigeria
- Bank transfer only: High friction, no instant confirmation
- Stripe: Not available in Nigeria

**Consequences:**
- ✅ Covers 95%+ of Nigerian payment preferences
- ✅ POD builds trust for new brand
- ✅ Paystack webhooks for reliable verification
- ✅ USSD works on feature phones (no smartphone needed)
- ⚠️ POD operational complexity (escrow, logistics coordination)
- ⚠️ Paystack fees: 1.5% + ₦100 (cap ₦2000) for local cards
- ⚠️ POD limited to 3 states initially

**Supersedes:** None

---

## 2026-08-29: Design System Approach

**Decision:** Custom Tailwind config with design tokens (not a component library like shadcn/ui or MUI)

**Context:** Design brief specifies: "One font. Two weights. One-size hierarchy. Black text, white background, one accent color." Maximum simplicity.

**Alternatives Considered:**
- shadcn/ui: Beautiful but adds many components we don't need
- Material UI: Heavy, opinionated, hard to customize to this minimal spec
- Chakra UI: Good but extra dependency for simple needs
- Headless UI + Tailwind: Good but we need even less

**Consequences:**
- ✅ Minimal bundle size (only what we use)
- ✅ Perfect match to design brief (sage green + warm sand)
- ✅ Full control over every pixel
- ✅ No "fighting the framework" for custom designs
- ⚠️ More initial work to build primitives
- ⚠️ No pre-built complex components (datepicker, etc.) — build as needed

**Supersedes:** None

---

## 2026-08-29: Chapter Organization

**Decision:** 9 fixed chapters (Nursery, Teen, Newlywed, Senior, Recovery, etc.) as product filters, not separate sites

**Context:** Brand concept is "every life stage needs its own bedroom setup" but must not block purchasing.

**Alternatives Considered:**
- Separate subdomains/sites per chapter: SEO dilution, maintenance nightmare
- Tags only (no curated pages): Loses brand narrative
- Dynamic chapters from CMS: Over-engineering for MVP

**Consequences:**
- ✅ Strong brand narrative (differentiator)
- ✅ Curated discovery (helps gift buyers)
- ✅ Simple implementation (Chapter model + product relation)
- ✅ Same product can appear in multiple chapters
- ⚠️ Manual curation needed (mitigate: admin UI later)
- ⚠️ 9 pages to maintain content for

**Supersedes:** None