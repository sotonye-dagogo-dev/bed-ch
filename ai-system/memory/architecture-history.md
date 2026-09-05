# Architecture History

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: append-only; never delete, only supersede with new entry linking back

> **Overview:** Architectural decision log with timestamps. Each entry: Date, Decision, Context, Impact, Related Files.

---

## 2026-08-29: Initial Architecture Established

**Decision:** Full architecture defined in `system-architecture.md` including:
- Next.js 14 App Router with route groups `(site)`, `(shop)`, `(admin)`
- Prisma + PostgreSQL schema for Products, Categories, Chapters, Cart, Orders
- Paystack integration via API routes + webhooks
- WhatsApp Business click-to-chat integration
- Anonymous session-based cart (no auth)
- Server Components for catalog, Client Components for interactivity

**Context:** Project bootstrap from client brief (Bedroom Chapters PDF). Greenfield project.

**Impact:** Sets foundation for all implementation work. Defines module boundaries, data flows, config points.

**Related Files:**
- `ai-system/system-architecture.md`
- `ai-system/design-system.md`
- `ai-system/project-context.md`
- `ai-system/index/repo-map.md`
- `ai-system/index/dependency-graph.md`
- `ai-system/planning/project-plan.md`
- `ai-system/planning/task-queue.md`

---

## 2026-09-01: Backend Integration & Payments Architecture Added

**Decision:** Added full backend layer to architecture:
- `src/lib/db/cart.ts` + `src/lib/db/orders.ts` (real Prisma) alongside still-mock catalog queries
- `src/lib/cart-context.tsx` (client CartProvider) + `src/lib/server-actions.ts` + 5 API route groups
- `src/lib/paystack.ts` + `src/lib/whatsapp.ts`
- `src/app/order/[id]` + `checkout/callback` + legal pages + sitemap generation + error/empty components
- Schema: added Product↔OrderItem and ProductVariant↔OrderItem relations

**Context:** Sprints 1-3 delivered cart persistence, Paystack flow, polish. Catalog migration deferred — documented as drift.

**Impact:** New dependencies: cart-context → /api/cart → cart.ts → Prisma; checkout → orders.ts → Tx; Paystack webhook HMAC. Sitemap postbuild now part of build pipeline.

**Related Files:**
- `ai-system/system-architecture.md` (updated diagram + module table + data flows)
- `ai-system/index/repo-map.md` + `index/dependency-graph.md` (new api/cart, paystack, cart-context)
- `prisma/schema.prisma` (OrderItem relations)
- `package.json` (postbuild sitemap)
- `ai-system/planning/task-queue.md` (phases 3-5 marked complete)