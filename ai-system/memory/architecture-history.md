# Architecture History

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
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