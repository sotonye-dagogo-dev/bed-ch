# Repair System — Error Knowledge Base

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
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

*Entries will be added as development progresses*