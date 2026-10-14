# Discrepancy Report — MVP tightening (2026-10-14)

**Command Executed:** `execute-feature.md` (MVP tightening) + `update-ai-system.md` (deep sync)
**Date:** 2026-10-14
**Scope:** Full ai-system directory vs actual repository state
**Previous report:** 2026-09-02 (drift fix)

---

## Summary

2026-09-02 fixes verified present in code (catalog real Prisma, validations.ts, analytics.ts, tests, manifest, not-found). 2026-10-14 session resolved the shop/chapter null-`get` crash, centralized links in `src/config/site.ts`, fixed footer/WhatsApp-float/error-boundaries, and removed duplicate layout chrome from legal pages. Prior HIGH/MEDIUM drifts #1/#3 confirmed resolved; remaining opens are launch-prep items (content, live keys, deploy) plus two new LOW notes below.

---

## Inconsistencies Found (Drift) — Status as of 2026-10-14

### Prior items (2026-09-02) — re-verified
| # | Item | Status 2026-10-14 |
|---|------|-------------------|
| 1 | Catalog mocks vs real claims | ✅ Resolved (confirmed: `grep -rn "mockProducts" src/lib/db/` = 0; Prisma `findMany/count/findFirst` in all three files) |
| 2 | hooks/types dirs missing | LOW — persists by design (documented in repo-map; `useCart` in `lib/cart-context`, types inline + Prisma) |
| 3 | validations.ts missing | ✅ Resolved (confirmed present with `checkoutSchema` + POD rules, imported by `/api/checkout`) |
| 4 | Analytics events missing | ✅ Resolved (`lib/analytics.ts` + cart-context integration verified) |
| 5 | Tests & CI/CD | 🟡 Partial — unit tests now 15/15 (added `site-config.test.ts`); CI workflow still absent (known permission block) |
| 6 | PWA/misc assets | ✅ Resolved (manifest, not-found verified) |

### New notes (2026-10-14)
7. **TrustBar vs Footer tile duplication — LOW — ✅ FIXED.** Layout co-rendered identical tiles (`Footer.trustBadges` + `TrustBar.trustItems`); TrustBar now mobile-only from shared `siteConfig.trustBadges`.
8. **Legal pages duplicated layout chrome — LOW — ✅ FIXED.** `terms/privacy/delivery-returns` rendered own Header/Footer/TrustBar inside the root layout's chrome; removed (rely on layout), nested `<main>` flattened to `<div>`.
9. **`src/components/product/ProductGrid.tsx` nested `<Link>` — LOW — open.** "View Details" `<Link>` nested inside product `<Link>` (invalid HTML, tolerated by browsers). Left untouched (non-breaking scope); recommend flattening to a single link + absolute-positioned button in a polish pass.
10. **Postbuild sitemap requires live DB — LOW — open/environmental.** `next build` itself is green (24/24 pages); `scripts/generate-sitemap.cjs` fails only when `DATABASE_URL` is unset (as in CI-without-services). Recommend `DATABASE_URL` in CI or a graceful skip with warning.

---

## Verification (2026-10-14)

```bash
npm run typecheck            # ✅ clean
npm run lint                 # ✅ 0 errors (warnings only, pre-existing)
npm test                     # ✅ 15/15 (3 files)
npm run build                # ✅ Compiled + 24/24 pages (postbuild sitemap needs DATABASE_URL)
grep -rn "mockProducts" src/lib/db/ || echo "No mocks found"   # ✅ none
grep -n "\.get(" -r src/app src/lib | grep -v "?.get"           # ✅ every hit null-guarded
grep -rn "234XXXXXXXXXX\|2348012345678" src/                     # only fallback const + .env.example
```
