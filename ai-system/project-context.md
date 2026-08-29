# Project Context

> **Metadata**
>
> - last-updated-by: bootstrap-project
> - last-verified-against-code: 2026-08-29
> - staleness-policy: re-verify if >10 sessions old or after major scope changes

> **Overview:** Why this project exists, who it serves, and what constraints govern development. Agents should read this to understand the "why" behind the work.

---

## Project Purpose

The Bedroom Chapters is an online bedroom store for Nigerians, selling everything that goes in a bedroom — bedsheets, pillows, rugs, mirrors, diffusers, towels, lamps, storage, nightwear, mosquito nets, and more. The long-term brand idea is "The Bedroom Chapters" — the concept that every life stage (newborn, teen, newlywed, senior, recovery) needs its own bedroom setup. The immediate goal is to drive sales of bedroom products within 48 hours of launch with a fast, clean, mobile-first product catalogue that lets a Nigerian scroll, add to cart, and check out in under 60 seconds. The "chapters" brand should feel like a helpful organising principle, not a barrier to buying a bedsheet.

---

## Target Users

| User Type | Needs | Key Interactions |
|-----------|-------|-----------------|
| Nigerian shoppers (mobile-first, 90% phone traffic) | Fast browsing, clear prices, easy checkout, trust signals | Browse → Filter by category/chapter → Add to cart → Guest checkout |
| Gift buyers (someone hitting a new life chapter) | Discovery by life stage, curated bundles | Browse chapter pages → View bundles → Purchase |
| WhatsApp-oriented buyers | Chat to order, human assistance | Floating WhatsApp button → Pre-filled message → Order via chat |

---

## Business Constraints

- Must work on 3G networks (under 3 seconds load time)
- Mobile-first — 90% of traffic on phones
- Guest checkout only — no account/login required to buy
- Pay on Delivery for Lagos/Abuja/Port Harcourt (under ₦50k, cash held in escrow)
- Paystack integration for card/transfer/USSD payments
- WhatsApp Business integration for "Chat to order"
- English only (no multi-language for MVP)
- No wishlist, loyalty points, subscriptions, AI chatbot, currency switcher, or mobile app
- Responsive website only

---

## Current Project Phase

Phase: Active Development

Active sprint focus: MVP — Core e-commerce flow (catalog, chapters, cart, checkout, payments, WhatsApp)

---

## Tech Decisions Already Made

| Decision | Reason |
|----------|--------|
| Next.js 14 (App Router) | Server components, fast SSR, excellent Vercel deployment, good SEO |
| TypeScript | Type safety for product catalog, cart, checkout flows |
| Tailwind CSS | Utility-first, mobile-first, small bundle, matches design brief (clean, white, uncluttered) |
| Prisma + PostgreSQL | Type-safe DB, easy migrations, works well with Next.js, Supabase/Vercel Postgres compatible |
| Paystack | Nigerian payment leader, supports card/transfer/USSD + Pay on Delivery |
| Vercel | Native Next.js support, edge functions, global CDN, free tier sufficient for launch |
| WhatsApp Business API | Floating "Chat to order" button, pre-filled messages, Nigerian market standard |
| GA4 + Meta Pixel + Hotjar | Standard analytics stack, free tiers sufficient |

---

## Out of Scope

- User accounts / authentication (guest checkout only)
- Wishlist / saved items
- Loyalty / rewards program
- Subscription / recurring orders
- AI chatbot / product recommendations
- Multi-currency / multi-language
- Native mobile app (iOS/Android)
- Admin dashboard (post-launch)
- Complex product comparison
- Inventory management system (manual for MVP)

---

## External Integrations

| Service | Purpose | Auth Method |
|---------|---------|------------|
| Paystack | Payments (card, transfer, USSD, Pay on Delivery) | Secret key (server), Public key (client) |
| WhatsApp Business | Chat-to-order floating button | Business account + phone number |
| Google Analytics 4 | Traffic & conversion tracking | Measurement ID |
| Meta Pixel | Ad attribution & retargeting | Pixel ID |
| Hotjar | Heatmaps & session recordings (free tier) | Site ID |
| Vercel Postgres / Supabase | Database hosting | Connection string |