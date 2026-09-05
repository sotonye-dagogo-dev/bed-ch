# Project AI Context

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
> - installed-ai-system-version: 3.0.0
> - staleness-policy: re-verify before trusting if project structure has changed

> **Overview:** Project overview — the very first file any AI agent should read. Provides a 30-second orientation to what this project is, what stack it uses, and where to find everything.

---

## Quick Reference

| Field            | Value                              |
| ---------------- | ---------------------------------- |
| Project Name     | The Bedroom Chapters               |
| Type             | E-commerce Web Application         |
| Primary Language | TypeScript                         |
| Frontend         | Next.js 14 (App Router)            |
| Backend          | Next.js API Routes / Server Actions|
| Database         | PostgreSQL (via Prisma ORM)        |
| Styling          | Tailwind CSS                       |
| Deployment       | Vercel                             |
| Payments         | Paystack                           |
| Analytics        | GA4, Meta Pixel, Hotjar            |

---

## Key Modules

| Module                 | Location                    | Purpose                                    |
| ---------------------- | --------------------------- | ------------------------------------------ |
| Product Catalog        | `src/app/(shop)/shop`       | Browse products with filters & chapters    |
| Product Detail         | `src/app/(shop)/product/[id]` | Product page with images, variants, CTA  |
| Chapter Pages          | `src/app/(shop)/chapter/[slug]` | Curated product grids by life stage    |
| Cart & Checkout        | `src/app/(shop)/cart`       | Slide-out cart, guest checkout flow        |
| Payments               | `src/app/api/payments`      | Paystack integration (card/transfer/POD)   |
| WhatsApp Integration   | `src/components/whatsapp`   | Floating chat-to-order button              |
| Journal/Blog           | `src/app/(site)/journal`    | SEO content (5 articles at launch)         |
| Admin (future)         | `src/app/(admin)`           | Product/order management (post-launch)     |

---

## Entry Point

The AI system documentation lives in `ai-system/`.

Start with: `ai-system/protocols/entry-protocol.md`

Two catalogs worth knowing exist (read on demand, not up front):
- Skills catalog: `ai-system/skills/README.md` (Tier 3 — load a skill's `SKILL.md` when its trigger matches)
- Tool/resource registry: `ai-system/tools/registry.md` (Tier 3 — check before doing by hand what a registered tool does)

---

## Active Development Focus

Phase 1 (MVP): Build core e-commerce flow — product catalog, chapter pages, cart, guest checkout with Paystack + Pay on Delivery, WhatsApp floating button. Target: first sale within 48 hours of launch.