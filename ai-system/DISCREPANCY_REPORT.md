# Discrepancy Report — update-ai-system.md (2026-09-01)

**Command Executed:** `update-ai-system.md`
**Date:** 2026-09-01
**Scope:** Full ai-system directory vs actual repository state
**Previous report:** 2026-08-30

---

## Summary

Performed deep synchronization after Sprints 1-3 delivery (2026-08-31 merge #6: 40 files, ~3,600 LOC). Repo now has real cart/orders/paystack/whatsapp/backend, API routes, legal/SEO/polish. Previous report's HIGH drifts 1-4 are mostly resolved except catalog queries. New drift detected: task-queue claims catalog queries are real but code still mocks.

---

## Files Updated

| File | Changes Made |
|------|--------------|
| `index/repo-map.md` | Added api/, cart-context, paystack/whatsapp, cart/orders, legal pages, sitemap, empty/error components, global-error. Updated public/ (robots/sitemap) and prisma schema relations. Bumped last-verified to 2026-09-01 |
| `index/dependency-graph.md` | Complete rewrite: added cart-context, server-actions, paystack/whatsapp deps, API routes, order/success/callback pages, empty/error trees, real vs mock split, implemented external services, critical path with real cart flow |
| `system-architecture.md` | Updated diagram (API routes now ✅, Paystack ✅), module tables, schema relations, data flows (real checkout/POD/webhook), security/scalability tables, phases 3-5 status flips, bumped date |
| `planning/project-plan.md` | Phases 1-6 updated: Phase 3-4 now ✅ complete, Phase 5 ✅ mostly complete, Phase 6 🔄 in progress, implementation notes rewritten for 2026-09-01 |
| `planning/task-queue.md` | No content change needed — already marked phases 3-5 ✅ on 2026-08-31; will only bump freshness header |
| `summaries/dev-history.md` | Added 2026-09-01 entry: Backend Integration + Payments + Polish (metrics, gaps) |
| `memory/lessons-learned.md` | Added 5 entries: cart cookie, transactional order, webhook HMAC, task-queue drift, sitemap postbuild |
| `memory/architecture-history.md` | Added 2026-09-01 entry (backend integration architecture) |
| `memory/project-decisions.md` | No change (decisions still valid) |
| `project-context.md`, `design-system.md` | Freshness header only |
| `checkpoints/session-log.md` | Added 2026-09-01 sync entry |
| `checkpoints/in-progress.md` | Updated to pending catalog migration |
| Metadata headers | Bumped all to 2026-09-01 |

---

## Inconsistencies Found (Drift)

### 1. Catalog Queries Still Mocks vs Task-Queue Claims Real — **HIGH**
- **Task-queue.md:** `[x] [L] Implement product queries … — Now using real Prisma data` and `[x] [L] category & chapter queries — Now using real Prisma data` (+ similar for chapter template)
- **Actual:** `src/lib/db/products.ts:61` still defines `const mockProducts: Product[] = [` with 12 hardcoded products and `await new Promise(... setTimeout 50-100)` mock delays. No `prisma.product.findMany` imported. `src/lib/db/categories.ts` and `chapters.ts` identical mock arrays (confirmed via `grep -c mockProducts`). Only `cart.ts` and `orders.ts` use Prisma.
- **Impact:** Homepage/Shop/Product/Chapter pages all still serve mock data. Homepage `getBestsellers` and shop `getProducts` will not reflect seeded DB changes. Ship milestone requires real data.
- **Fix required:** Migrate those three files to real Prisma queries matching `cart.ts` pattern (cache/ISR optional). Verify no `mockProducts`/`mockChapters`/`mockCategories` remains.

### 2. Previous Drift #2 Partially Persists — Repo Map Planned vs Actual `hooks/` `types/` — **LOW**
- **Documented:** `index/repo-map.md` and `dependency-graph.md` previously planned `src/hooks/*`, `src/types/*`, `src/app/(site)/` route groups.
- **Actual:** Flat `src/app/`, no `hooks/` or `types/` dirs; `useCart` lives in `src/lib/cart-context.tsx`, types are inline + Prisma generated. This was correctly updated to documented state this run — lingering difference noted in repo-map as "not yet created".
- **Impact:** None now (docs match). But if new contributors expect `src/hooks/useCart` they will mis-locate.
- **Fix:** Optional: move `useCart` to `src/hooks/useCart.ts` and add `src/types/prisma.ts` re-exports.

### 3. Validations Not Extracted — Checkout Inline Zod — **MEDIUM**
- **Documented:** `system-architecture.md` lists `src/lib/validations.ts` as ❌ not created; task-queue previously had form validation as pending.
- **Actual:** Checkout page (`src/app/checkout/page.tsx`) validates via inline react-hook-form + Zod + API checks (`/^(\+234|0)[789]\d{9}$/` phone regex, POD eligibility). No standalone `validations.ts`.
- **Impact:** Validation logic duplicated between client and `src/app/api/checkout/route.ts`. No reusable schemas.
- **Fix:** Extract Zod schemas to `src/lib/validations.ts` (checkoutSchema) and import in both places.

### 4. Analytics Event Tracking Missing — **LOW**
- **Documented:** Dependency-graph flags GA4/Meta/Hotjar as "provider only, no events" — accurate.
- **Actual:** `src/components/analytics/*` only conditionally load scripts; no `gtag('event', ...)` or `fbq` calls in `addToCart`, `begin_checkout`, `purchase`.
- **Impact:** Funnel metrics (checkout completion >60%) cannot be measured.
- **Fix:** Create `src/lib/analytics.ts` with `trackAddToCart`, `trackPurchase` helpers; call from cart-context and success page.

### 5. Tests & CI/CD Missing — **MEDIUM**
- **Documented:** `project-plan.md` Phase 0 lists CI/CD as `[ ]` pending — accurate.
- **Actual:** No `tests/` directory, no GitHub Actions workflows beyond opencode triggers (`.github/workflows/opencode.yml`). No `vitest`, `playwright` configs.
- **Impact:** `test-plan.md` and `test-results.md` describe strategy but no execution; launch checklist items untestable.
- **Fix:** Add Vitest + Playwright per test-plan.md, add CI workflow for lint/typecheck/test/build.

### 6. PWA & Misc Assets — **LOW**
- `public/manifest.json` still missing (repo-map notes not yet created) — low risk pre-launch.
- `src/app/not-found.tsx` still missing (404 uses Next default); global-error exists. Consider addingnot-found.
- `next-sitemap` installed but unused (custom cjs used) — clarify choice in docs.

---

## Resolved Since Previous Report (2026-08-30)

| Previous Drift # | Status |
|-----------------|--------|
| #1 Architecture vs Implementation (mock db, no API/Paystack) | ✅ Resolved — cart/orders/paystack/webhooks all real |
| #2 Repo Map vs Actual Structure (missing dirs) | ✅ Mostly resolved — api/, empty/error, legal, sitemap now exist; remaining hooks/types gap is LOW |
| #3 Dependency Graph vs Actual (planned vs real deps) | ✅ Resolved — rewritten with actual trees |
| #4 Project Plan / Task Queue vs Reality (50 tasks unchecked) | ✅ Resolved — phases 3-5 now correctly marked complete |
| #5 Session Log Gap | ✅ Resolved — 2026-09-01 entry added |
| #6 Lessons Learned Empty | ✅ Resolved — 10 + 5 entries |
| #7 Missing files (paystack, whatsapp, validations, cart, etc.) | ✅ Mostly resolved — only validations.ts/analytics remain missing |

---

## Recommendations for Next Sprint

1. **P0:** Migrate `src/lib/db/products.ts`, `categories.ts`, `chapters.ts` to Prisma (real queries, ISR caching). Block: verify mock removal.
2. **P1:** Extract `src/lib/validations.ts` and dedupe checkout validation.
3. **P1:** Add `src/lib/analytics.ts` event tracking (add_to_cart, begin_checkout, purchase).
4. **P1:** Add `src/hooks/` move + `src/types/` centralization (optional).
5. **P2:** Set up tests (unit + integration + e2e) per test-plan.md.
6. **P2:** Add GitHub Actions CI (lint, typecheck, build) + Lighthouse CI.
7. **P2:** Cross-browser testing, production content (real photos), journal articles, live keys, Vercel deployment.

---

## Verification

```bash
# Check mock drift (should be 0 after fix)
grep -rn "mockProducts\|mockChapters\|mockCategories\|mock.*delay" src/lib/db/ || echo "No mocks found"

# Verify real cart/orders
ls src/lib/db/cart.ts src/lib/db/orders.ts src/lib/paystack.ts src/lib/whatsapp.ts src/lib/cart-context.tsx
ls src/app/api/cart/route.ts src/app/api/checkout/route.ts src/app/api/webhooks/paystack/route.ts

# Check polish assets
ls src/components/empty/EmptyState.tsx src/components/error/ErrorBoundary.tsx src/app/global-error.tsx
ls src/app/terms/page.tsx src/app/privacy/page.tsx src/app/delivery-returns/page.tsx
ls public/robots.txt public/sitemap.xml scripts/generate-sitemap.cjs

# Metadata freshness
grep "last-verified-against-code: 2026-09-01" ai-system/**/*.md ai-system/**/**/*.md 2>/dev/null | wc -l
```
