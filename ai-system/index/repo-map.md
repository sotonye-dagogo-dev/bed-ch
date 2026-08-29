# Repository Map

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
> - staleness-policy: re-verify if folder structure changes

> **Overview:** Folder structure with purpose of each directory. Auto-regenerable via script.

---

## Root Structure

```
bed-ch/
├── ai-system/                 # AI-assisted development system (this framework)
├── public/                    # Static assets served directly
├── src/                       # Application source code
├── prisma/                    # Database schema & migrations
├── .github/                   # GitHub workflows & templates
├── package.json               # Dependencies & scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
├── .env.example               # Environment variable template
├── README.md                  # Project documentation
├── LICENSE                    # MIT License
├── VERSION                    # ai-system kit version (3.0.0)
├── CHANGELOG.md               # Project changelog
└── MIGRATION.md               # Migration guides
```

---

## `ai-system/` — AI Development Framework

```
ai-system/
├── agents/                    # Function-based role definitions
│   ├── architect.md           # System design & architecture decisions
│   ├── historian.md           # Session summarization & context preservation
│   ├── implementer.md         # Code implementation standards
│   ├── planner.md             # Feature decomposition & task planning
│   ├── reviewer.md            # Code review & quality assurance
│   └── tester-qa.md           # Testing strategy & execution
├── commands/                  # Reusable command pipelines
│   ├── audit-drift.md         # Detect drift between docs and code
│   ├── audit-sources.md       # Verify external references
│   ├── bootstrap-project.md   # One-time project initialization (THIS RUN)
│   ├── cloud-session.md       # Remote agent session handling
│   ├── dev-cycle.md           # Standard development loop
│   ├── execute-feature.md     # End-to-end feature pipeline
│   ├── fix-build.md           # Build failure resolution
│   ├── generate-design-md     # Design reference extraction
│   ├── plan-feature.md        # Feature planning with sign-off
│   ├── pull-template-update.md# Template version upgrades
│   ├── resume-session.md      # Context restoration
│   ├── sync-context.md        # Lightweight context sync
│   ├── update-ai-system.md    # Deep documentation sync
│   ├── verify-work.md         # Quality gate checklist
│   └── visual-review.md       # UI/UX review process
├── checkpoints/               # Session state tracking
│   ├── in-progress.md         # Current work state (singular, overwritten)
│   └── session-log.md         # Append-only session history
├── design-references/         # Pulled reference designs (Tier 4)
│   ├── README.md
│   └── TEMPLATE/DESIGN.md     # Template for new design references
├── index/                     # Auto-regenerable indexes
│   ├── dependency-graph.md    # Module relationships (this file's pair)
│   └── repo-map.md            # This file
├── memory/                    # Persistent knowledge (with supersedes links)
│   ├── architecture-history.md# Architectural decision log
│   ├── lessons-learned.md     # Debugging insights & patterns
│   └── project-decisions.md   # Explicit decisions with rationale
├── planning/                  # Work tracking
│   ├── project-plan.md        # Feature checklist & roadmap
│   └── task-queue.md          # Immediate actionable tasks
├── protocols/                 # Operational protocols (static, metadata-stamped)
│   ├── context-tiering.md     # Context loading rules
│   ├── entry-protocol.md      # Session startup procedure
│   ├── escalation-rules.md    # When to escalate to human
│   ├── quality-gate.md        # Definition of done
│   └── verification-rules.md  # Self-verification requirements
├── skills/                    # On-demand expertise units (Tier 3)
│   ├── acid-transaction-review/
│   ├── design-token-extraction/
│   ├── gh-stack/
│   ├── integration-wrapper-scaffold/
│   ├── lean-debt-audit/
│   ├── pdf-html-asset-inspection/
│   ├── rbac-page-scaffold/
│   ├── research/
│   └── universal-component-check/
├── standards/                 # Engineering principles
│   └── engineering-principles.md
├── summaries/                 # Development history
│   └── dev-history.md
├── system-architecture.md     # Structural documentation
├── project-context.md         # Goals, users, constraints
├── design-system.md           # UI/UX rules & tokens
├── repair-system.md           # Error knowledge base
├── testing/                   # Test artifacts
│   ├── test-plan.md
│   └── test-results.md
├── tools/                     # External resource registry
│   ├── integrations/          # Tool-specific documentation
│   └── registry.md            # Tool catalog
├── commands/                  # (duplicate entry - see above)
└── artifacts/                 # Client-provided references
    ├── placeholder.txt
    └── Bedroom Chapters (1).pdf
```

---

## `src/` — Application Source

```
src/
├── app/                       # Next.js App Router pages
│   ├── (site)/                # Static/marketing route group
│   │   ├── layout.tsx         # Site layout (header, footer, trust bar)
│   │   ├── page.tsx           # Homepage
│   │   ├── about/page.tsx     # About page
│   │   ├── delivery-returns/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── journal/
│   │   │   ├── page.tsx       # Journal index (blog listing)
│   │   │   └── [slug]/page.tsx# Article detail
│   │   └── globals.css        # Global styles + CSS variables
│   ├── (shop)/                # E-commerce route group
│   │   ├── layout.tsx         # Shop layout (with sidebar on desktop)
│   │   ├── page.tsx           # Redirect to /shop
│   │   ├── shop/
│   │   │   ├── page.tsx       # Shop listing with filters
│   │   │   └── [category]/page.tsx
│   │   ├── product/
│   │   │   └── [id]/page.tsx  # Product detail
│   │   ├── chapter/
│   │   │   └── [slug]/page.tsx# Chapter page
│   │   ├── cart/
│   │   │   └── page.tsx       # Cart (also slide-out via component)
│   │   └── checkout/
│   │       └── page.tsx       # Multi-step checkout
│   ├── (admin)/               # Admin route group (future)
│   │   └── layout.tsx
│   ├── api/                   # API Routes & Server Actions
│   │   ├── cart/
│   │   │   └── route.ts       # GET/POST cart operations
│   │   ├── checkout/
│   │   │   └── route.ts       # POST create order
│   │   ├── payments/
│   │   │   ├── initialize/route.ts
│   │   │   ├── verify/route.ts
│   │   │   └── webhook/route.ts # Paystack webhook
│   │   ├── products/
│   │   │   └── route.ts       # Product search/filter API
│   │   └── webhooks/
│   │       └── paystack/route.ts
│   ├── layout.tsx             # Root layout (providers, fonts)
│   ├── page.tsx               # Root redirect to homepage
│   └── not-found.tsx          # 404 page
├── components/                # React components
│   ├── ui/                    # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Checkbox.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── Stepper.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Sheet.tsx          # Slide-out panels (cart, mobile menu)
│   │   ├── Tooltip.tsx
│   │   ├── Avatar.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx       # Loading placeholders
│   │   └── index.ts           # Barrel export
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TrustBar.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── SearchBar.tsx
│   │   └── CartIcon.tsx
│   ├── product/               # Product-specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImages.tsx
│   │   ├── SizeSelector.tsx
│   │   ├── QuantityStepper.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── CompleteTheLook.tsx
│   │   ├── DeliveryEstimate.tsx
│   │   └── Reviews.tsx
│   ├── cart/                  # Cart & checkout components
│   │   ├── CartSlideOut.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── DeliveryOptions.tsx
│   │   ├── PaymentMethods.tsx
│   │   └── OrderSummary.tsx
│   ├── chapter/               # Chapter-specific components
│   │   ├── ChapterCard.tsx
│   │   ├── ChapterGrid.tsx
│   │   ├── ChapterHero.tsx
│   │   └── BundleOffer.tsx
│   ├── whatsapp/              # WhatsApp integration
│   │   └── WhatsAppFloatButton.tsx
│   ├── analytics/             # Analytics providers
│   │   ├── GA4Provider.tsx
│   │   ├── MetaPixelProvider.tsx
│   │   └── HotjarProvider.tsx
│   └── providers/             # Context providers
│       ├── CartProvider.tsx
│       └── ThemeProvider.tsx  # (if dark mode added later)
├── lib/                       # Core utilities & data access
│   ├── prisma.ts              # Prisma client singleton
│   ├── db/                    # Database queries
│   │   ├── products.ts
│   │   ├── chapters.ts
│   │   ├── categories.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   ├── paystack.ts            # Paystack client & helpers
│   ├── whatsapp.ts            # WhatsApp URL generation
│   ├── analytics.ts           # Event tracking helpers
│   ├── utils.ts               # Formatters, validators, helpers
│   ├── constants.ts           # App constants (currency, limits)
│   ├── validations.ts         # Zod schemas for forms/API
│   └── server-actions.ts      # Server Actions (if used)
├── hooks/                     # Custom React hooks
│   ├── useCart.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── types/                     # TypeScript types
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── chapter.ts
│   └── api.ts
├── styles/                    # Additional styles
│   └── globals.css            # (duplicate - see app/globals.css)
└── middleware.ts              # Next.js middleware (auth, redirects, i18n)
```

---

## `prisma/` — Database

```
prisma/
├── schema.prisma              # Database schema (see system-architecture.md)
├── migrations/                # Migration history
│   └── 20260829_init/         # Initial migration
└── seed.ts                    # Seed script for development data
```

---

## `public/` — Static Assets

```
public/
├── images/
│   ├── products/              # Product images (or served from CDN)
│   ├── chapters/              # Chapter hero images
│   ├── heroes/                # Homepage hero images
│   └── placeholders/          # Blur placeholders, fallback images
├── icons/                     # Favicon, PWA icons
├── fonts/                     # Local fonts (Inter variable)
├── robots.txt
├── sitemap.xml                # Auto-generated
└── manifest.json              # PWA manifest
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts (dev, build, start, lint, test, db:push, db:studio) |
| `tailwind.config.ts` | Design tokens, theme extension, plugins |
| `tsconfig.json` | TypeScript config (strict, path aliases @/*, @/components/*) |
| `next.config.js` | Next.js config (images, headers, rewrites, env) |
| `.env.example` | Template for required environment variables |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `eslint.config.js` | ESLint config (Next.js, TypeScript, Tailwind) |
| `prettier.config.js` | Prettier config |
| `.gitignore` | Ignored files (node_modules, .env, .next, dist, *.log) |

---

## Key Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| Dev Server | `npm run dev` | `next dev` — Turbopack enabled |
| Build | `npm run build` | `next build` — Production build |
| Start | `npm run start` | `next start` — Production server |
| Lint | `npm run lint` | `next lint` — ESLint |
| Type Check | `npm run typecheck` | `tsc --noEmit` |
| DB Push | `npm run db:push` | `prisma db push` — Schema to DB |
| DB Studio | `npm run db:studio` | `prisma studio` — Visual DB editor |
| Seed | `npm run db:seed` | `tsx prisma/seed.ts` — Seed data |