# Repair System — Error Knowledge Base

> **Metadata**
>
> - last-updated-by: execute-feature
> - last-verified-against-code: 2026-10-14
> - staleness-policy: individual entries may be stale if the code has changed around them — verify fix still applies before reusing

> **Overview:** Living knowledge base of errors encountered during development, their root causes, and how they were fixed. Agents must search this before diagnosing new errors and log every fixed bug to prevent recurrence.

---

## How to Use

- **Before debugging:** Search this file for patterns matching the current error
- **After fixing a bug:** Add an entry using the template below
- **If a fix no longer applies:** Mark the entry as `[SUPERSEDED]` and link to the new entry

---

## Error Log

### [TEMPLATE]

```
## [Error Title]

**Symptom:**
[What the developer or user sees]

**Root Cause:**
[The actual technical reason]

**Fix Applied:**
[What change was made]

**Prevention:**
[How to avoid this in future]

**Files Affected:**
[list of files]

**Date:** [YYYY-MM-DD]
**Status:** [Active / Superseded]
```

---

## Known Error Patterns

### React / Next.js

**Hydration Mismatch**
- Symptom: `Hydration failed because the initial UI does not match what was rendered on the server`
- Cause: Browser-only logic (window, localStorage, Date.now()) running during server render
- Fix: Wrap in `useEffect` or use `dynamic(() => import(...), { ssr: false })`
- Prevention: Never access browser APIs outside useEffect in components

**Missing Key Prop**
- Symptom: `Each child in a list should have a unique "key" prop`
- Cause: `.map()` rendering without a stable unique key
- Fix: Add `key={item.id}` — use a stable unique ID, not the array index

**Next.js Image Unoptimized**
- Symptom: Images not loading in production, CLS issues
- Cause: Missing `remotePatterns` in `next.config.js` or images from unconfigured domains
- Fix: Add all image CDN domains to `images.remotePatterns`
- Prevention: Configure during setup, test with production-like images

### Prisma / Database

**Prisma Client Not Generated**
- Symptom: `Cannot find module '@prisma/client'` or type errors on Prisma models
- Cause: Forgot to run `prisma generate` after schema changes
- Fix: Run `npx prisma generate` and restart TypeScript server
- Prevention: Add `postinstall: prisma generate` to package.json

**Migration Drift**
- Symptom: `Prisma schema and database are out of sync`
- Cause: Manual DB changes or skipped migrations
- Fix: `prisma db push` (dev) or create proper migration `prisma migrate dev`
- Prevention: Never modify DB directly; always use migrations

**Prepared Statement Limit (PgBouncer)**
- Symptom: `prepared statement "s0" already exists` or connection errors
- Cause: Prisma prepared statements incompatible with PgBouncer transaction pooling
- Fix: Set `prismadb://...?connection_limit=1&pgbouncer=true` or use session pooling
- Prevention: Configure connection string correctly for serverless

**Migrations Run Against the Pooled URL (wrong datasource for migrate)**
- Symptom: `prisma migrate` / `db push` hang, `P1001`, `prepared statement ... already exists`, or `CREATE INDEX CONCURRENTLY cannot run inside a transaction` against a pooler; `prisma migrate status` shows the pooler host/port (e.g. Supabase `:6543`) instead of the direct endpoint
- Cause: `datasource` declares only `url = env("DATABASE_URL")` while the app uses a transaction-mode pooler; `directUrl` never wired, so Prisma Migrate reuses the runtime URL
- Fix: Add `directUrl = env("DIRECT_URL")` to `datasource db` in `prisma/schema.prisma`; keep `url = env("DATABASE_URL")` for Prisma Client. Verify by running `prisma migrate status` and confirming it prints the direct/session-mode host:port
- Prevention: Never point `prisma migrate` at a transaction-mode pooler. Declare both URLs in the schema, document both in `.env.example`, and validate `DIRECT_URL` in deploy scripts (`scripts/db-deploy.mjs` does this with a DATABASE_URL fallback for pooler-less setups)
- Files Affected: `prisma/schema.prisma`, `.env.example`, `scripts/db-deploy.mjs`, `README.md`
- Date: 2026-10-14
- Status: Active

**Deploy Script Skips Migrations Locally (`.env` not loaded)**
- Symptom: `node scripts/db-deploy.mjs` prints `DATABASE_URL is not set. Skipping database deployment.` even though `.env` defines it; same script works on Vercel
- Cause: Script read `process.env` directly without loading repo-root `.env` — CI/Vercel inject env vars, local shells do not
- Fix: Parse repo-root `.env` in the script before reading vars, without overriding process env (dotenv semantics)
- Prevention: Any standalone Node script that reads env vars must load `.env` itself — Next.js/Prisma CLI do it for their own commands, plain `node script.mjs` does not
- Files Affected: `scripts/db-deploy.mjs`
- Date: 2026-10-14
- Status: Active

### Paystack Integration

**Paystack Webhook Signature Verification Failed**
- Symptom: Webhook handler returns 400, Paystack retries
- Cause: Using wrong secret (test vs live) or body parsing issue (raw body needed)
- Fix: Use `crypto.createHmac('sha512', secret).update(rawBody).digest('hex')`; ensure raw body middleware
- Prevention: Store webhook secret separately from API secret; test with Paystack CLI

**Paystack Inline Embed Not Loading**
- Symptom: Payment modal doesn't open, console shows CSP errors
- Cause: CSP headers blocking Paystack domains or script not loaded
- Fix: Add `https://js.paystack.co` to `script-src` and `frame-src` in CSP; load script before initialization
- Prevention: Configure CSP in `next.config.js` headers; test payment flow in staging

**Amount in Kobo vs Naira Mismatch**
- Symptom: Payment amount wrong (e.g., ₦65 charged as ₦6500)
- Cause: Sending Naira instead of kobo to Paystack (or vice versa)
- Fix: Always store/calculate in kobo (integer); multiply by 100 for Paystack
- Prevention: Centralize `formatPrice` and `toKobo` utilities; add type guards

### WhatsApp Integration

**WhatsApp Link Opens Empty Chat**
- Symptom: Clicking button opens WhatsApp but no pre-filled message
- Cause: Message not URL-encoded or `wa.me` format incorrect
- Fix: Use `encodeURIComponent(message)` and format: `https://wa.me/234XXXXXXXXXX?text=<encoded>`
- Prevention: Centralize in `src/lib/whatsapp.ts` with tests

### Tailwind / Styling

**Styles Not Applying in Production**
- Symptom: Classes work in dev but missing in production build
- Cause: Tailwind content paths missing files (e.g., new component directory)
- Fix: Update `content` in `tailwind.config.ts` to include all component paths
- Prevention: Use broad globs: `./src/**/*.{js,ts,jsx,tsx,mdx}`

**CSS Variable Not Working**
- Symptom: `var(--color-primary)` renders as fallback or empty
- Cause: Variable defined in `@layer base` but used in `@layer components` without import order
- Fix: Define all CSS variables in `:root` in globals.css before `@tailwind base`
- Prevention: Keep all design tokens in `:root` at top of globals.css

### TypeScript / Build

**Module Not Found After Refactor**
- Symptom: `Module not found: Can't resolve '@/components/...'`
- Cause: Path alias not configured or tsconfig paths out of sync
- Fix: Verify `baseUrl` and `paths` in `tsconfig.json`; restart TS server
- Prevention: Use `@/*` alias consistently; don't mix relative and absolute imports

**Type Error on Prisma Model After Schema Change**
- Symptom: TypeScript errors on Prisma model properties
- Cause: Prisma client not regenerated after `prisma migrate dev`
- Fix: Run `npx prisma generate`; if persists, delete `node_modules/.prisma` and regenerate
- Prevention: Add `prisma generate` to dev workflow; use `prisma db push` in dev

### Vercel / Deployment

**Build Fails on Vercel but Passes Locally**
- Symptom: Vercel build logs show errors not seen locally
- Cause: Different Node version, missing env vars, case-sensitive filesystem
- Fix: Match Node version in `package.json` (`engines`); add all env vars to Vercel; check import casing
- Prevention: Test build in clean container (`docker build`); use `vercel build` locally

**Function Timeout on Checkout**
- Symptom: `Function invocation timeout` on `/api/checkout`
- Cause: Paystack verification taking >10s (Hobby plan limit) or slow DB query
- Fix: Optimize DB queries; use Paystack webhook for async verification; upgrade Vercel plan
- Prevention: Keep API routes under 10s; use background jobs for slow operations

### Configuration / Environment

**Missing Environment Variable**
- Symptom: `undefined` values in production, features silently broken
- Cause: Variable defined in `.env.local` but not in production environment
- Fix: Add to deployment environment variables
- Prevention: Add a startup validation check that throws if required env vars are missing

**Environment Variable Type Mismatch**
- Symptom: `process.env.PAYSTACK_SECRET_KEY` is `undefined` in API route
- Cause: Variable not prefixed with `NEXT_PUBLIC_` for client-side, but used in client component
- Fix: Use `NEXT_PUBLIC_` prefix only for client-safe vars; keep secrets server-only
- Prevention: Audit all env var usage; document which are client vs server

---

## Project-Specific Patterns (Bedroom Chapters)

### Null `.get()` on Shop/Chapter Routes (2026-10-14)

**Symptom:**
Routing to `/shop` or `/chapter/*` surfaces the error boundary: `Cannot read properties of null (reading 'get')`.

**Root Cause:**
Multiple compounding causes found 2026-10-14:
1. Unguarded `.get()` on hosts that can be null during prerender/edge: `cookies().get`, `headers().get`, `useSearchParams().get`, `formData.get` (`src/lib/db/cart.ts`, `src/app/api/*/route.ts`, `src/lib/server-actions.ts`, `CheckoutCallbackContent.tsx`).
2. `window` + inline `onChange` handler inside the Shop Server Component (`src/app/shop/page.tsx` sort `<select>`) — interactivity cannot execute during server render.
3. Render-time `typeof window !== 'undefined' && window.innerWidth` check in `FilterSidebar` — SSR/client mismatch (hydration fault on `/shop`).
4. Dead `/shop/<slug>` links (no such route) 404ing into `not-found`.

**Fix Applied:**
- Optional-chaining + try/catch guards at every `.get` site; server pages accept `Promise | plain` params and degrade (homepage → skeletons, shop/chapter → segment `error.tsx`).
- Extracted `src/components/product/ShopSortSelect.tsx` (`'use client'`, `useRouter` + null-safe `useSearchParams`, Suspense fallback).
- `FilterSidebar` defers viewport detection to post-mount state (`useEffect`).
- New `src/app/shop/[category]/page.tsx` validates slug (config → DB) and redirects to canonical `/shop?category=<slug>`, else `notFound()`.
- New segment boundaries `src/app/error.tsx`, `src/app/shop/error.tsx`, `src/app/chapter/[slug]/error.tsx` sharing `RouteError` (full `window.location.reload()` recovery); `global-error.tsx` Refresh now reloads.

**Prevention:**
- Grep `\.get\(` each QA pass — every hit needs a null guard.
- Zero `window.` / inline event handlers in `*.tsx` Server Components (no `'use client'` = no interactivity).
- No render-time viewport reads; use mounted state.

**Files Affected:**
`src/lib/db/cart.ts`, `src/app/api/checkout/route.ts`, `src/app/api/webhooks/paystack/route.ts`, `src/lib/server-actions.ts`, `src/app/checkout/callback/CheckoutCallbackContent.tsx`, `src/app/shop/page.tsx`, `src/app/chapter/[slug]/page.tsx`, `src/app/product/[id]/page.tsx`, `src/app/page.tsx`, `src/components/product/ShopSortSelect.tsx` (new), `src/components/product/FilterSidebar.tsx`, `src/app/shop/[category]/page.tsx` (new), `src/app/error.tsx` + `src/app/shop/error.tsx` + `src/app/chapter/[slug]/error.tsx` (new), `src/components/error/RouteError.tsx` (new), `src/app/global-error.tsx`, `src/config/site.ts` (new)

**Date:** 2026-10-14
**Status:** Active