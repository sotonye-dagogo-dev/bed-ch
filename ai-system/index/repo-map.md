# Repository Map

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-08-30
> - staleness-policy: re-verify if folder structure changes
>
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
└── artifacts/                 # Client-provided references
    ├── placeholder.txt
    └── Bedroom Chapters (1).pdf
```

---

## `src/` — Application Source

```
src/
├── app/                       # Next.js App Router pages
│   ├── globals.css            # Global styles + CSS variables
│   ├── layout.tsx             # Root layout (providers, fonts, header, footer, trust bar)
│   ├── page.tsx               # Homepage (hero, search, bestsellers, chapter teaser)
│   ├── shop/
│   │   └── page.tsx           # Shop listing with filters, product grid, pagination
│   ├── product/
│   │   └── [id]/page.tsx      # Product detail (gallery, variants, add-to-cart, complete the look)
│   ├── chapter/
│   │   └── [slug]/page.tsx    # Chapter page (hero, curated products, bundle offer)
│   ├── cart/
│   │   └── page.tsx           # Full-page cart (also accessible via slide-out)
│   ├── checkout/
│   │   └── page.tsx           # Multi-step checkout (contact → delivery → payment → confirm)
│   └── not-found.tsx          # 404 page (not yet created)
├── components/                # React components
│   ├── ui/                    # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Sheet.tsx          # Slide-out panels (cart, mobile menu, filters)
│   │   ├── Skeleton.tsx       # Loading placeholders
│   │   └── index.ts           # Barrel export
│   ├── layout/                # Layout components
│   │   ├── Header.tsx         # Sticky header with logo, search, cart, WhatsApp, mobile menu
│   │   ├── Footer.tsx         # Footer with links, trust badges, WhatsApp CTA, social
│   │   ├── TrustBar.tsx       # Fixed bottom mobile: Same-Day, POD, Returns
│   │   └── index.ts           # Barrel export
│   ├── product/               # Product-specific components
│   │   ├── ProductGrid.tsx    # Responsive grid of ProductCard
│   │   ├── FilterSidebar.tsx  # Collapsible filters (category, price, size, color, chapter)
│   │   └── index.ts           # Barrel export
│   ├── cart/                  # Cart & checkout components
│   │   └── CartSlideOut.tsx   # Slide-out cart with items, summary, checkout CTA
│   ├── whatsapp/              # WhatsApp integration
│   │   └── WhatsAppFloatButton.tsx  # Floating chat button with pulse + tooltip
│   ├── analytics/             # Analytics providers
│   │   ├── GA4.tsx
│   │   ├── MetaPixel.tsx
│   │   ├── Hotjar.tsx
│   │   ├── AnalyticsProviders.tsx  # Conditional provider wrapper
│   │   └── index.ts           # Barrel export
├── lib/                       # Core utilities & data access
│   ├── prisma.ts              # Prisma client singleton
│   ├── db/                    # Database queries (currently using mock data)
│   │   ├── products.ts        # Product queries (list, get, search, by-category, by-chapter)
│   │   ├── chapters.ts        # Chapter queries (list, get, products-by-chapter)
│   │   └── categories.ts      # Category queries (list, get)
│   ├── utils.ts               # Formatters (currency, slugify), validators, constants
│   └── index.ts               # Barrel export
├── hooks/                     # Custom React hooks (not yet created)
└── types/                     # TypeScript types (not yet created - using inline interfaces)
```

---

## `prisma/` — Database

```
prisma/
├── schema.prisma              # Database schema (matches system-architecture.md)
├── migrations/                # Migration history (not yet created)
└── seed.ts                    # Seed script with 9 chapters, 8 categories, 12 products, variants, bundles
```

---

## `public/` — Static Assets

```
public/
├── images/                    # (empty - using Unsplash URLs for now)
├── icons/                     # (empty - favicon, PWA icons not yet added)
├── fonts/                     # (empty - using Google Fonts)
├── robots.txt                 # (not yet created)
├── sitemap.xml                # (not yet created - will be auto-generated)
└── manifest.json              # (not yet created - PWA manifest)
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts (dev, build, start, lint, typecheck, prisma:generate, prisma:push, prisma:studio, db:seed) |
| `tailwind.config.ts` | Design tokens, theme extension (colors, fonts, spacing, radius, shadows, transitions) |
| `tsconfig.json` | TypeScript config (strict, path aliases @/*) |
| `next.config.js` | Next.js config (images remotePatterns, optimizePackageImports) |
| `.env.example` | Template for required environment variables |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `.eslintrc.json` | ESLint config (Next.js, TypeScript) |
| `.prettierrc` | Prettier config |
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
| DB Push | `npm run prisma:push` | `prisma db push` — Schema to DB |
| DB Studio | `npm run prisma:studio` | `prisma studio` — Visual DB editor |
| Seed | `npm run db:seed` | `tsx prisma/seed.ts` — Seed data |