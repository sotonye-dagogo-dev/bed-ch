# Bedroom Chapters

A modern Nigerian e-commerce platform for quality bedroom essentials — bedding, pillows, rugs, curtains, lighting, and more. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Chapter-based Shopping** — 9 curated life-stage collections (Nursery, Newlywed, Teen, Guest, Master, Minimalist, Boho, Modern, Kids)
- **Pay on Delivery** — Cash/card on delivery in Lagos, Abuja & Port Harcourt (orders ≤₦50k)
- **Lagos Same-Day Delivery** — Order before 12pm for same-day delivery
- **7-Day Returns** — No questions asked return policy
- **Paystack Integration** — Card, bank transfer, and USSD payments
- **WhatsApp Ordering** — Chat-to-order with pre-filled messages
- **Mobile-First** — Optimized for 90% mobile traffic
- **Performance** — ISR, optimized images, <3s load on 3G

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Paystack
- **Analytics**: GA4, Meta Pixel, Hotjar
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Paystack account (for payments)
- WhatsApp Business number

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bed-ch

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run prisma:generate
npm run prisma:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (server) | Yes |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key (client) | Yes |
| `PAYSTACK_WEBHOOK_SECRET` | Paystack webhook signature secret | Yes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business number (234 format) | Yes |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID | No |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | No |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar Site ID | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (shop)/            # Shop route group
│   │   ├── shop/          # Shop page with filters
│   │   ├── product/[id]/  # Product detail page
│   │   ├── chapter/[slug]/# Chapter pages
│   │   ├── cart/          # Cart page
│   │   └── checkout/      # Multi-step checkout
│   ├── globals.css        # Global styles + design tokens
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Sheet.tsx
│   │   └── Skeleton.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── TrustBar.tsx
│   ├── product/           # Product components
│   │   ├── ProductGrid.tsx
│   │   └── FilterSidebar.tsx
│   ├── cart/              # Cart components
│   │   └── CartSlideOut.tsx
│   ├── whatsapp/          # WhatsApp components
│   │   └── WhatsAppFloatButton.tsx
│   └── analytics/         # Analytics providers
│       ├── GA4.tsx
│       ├── MetaPixel.tsx
│       ├── Hotjar.tsx
│       └── AnalyticsProviders.tsx
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   ├── utils.ts           # Utility functions
│   └── db/                # Database queries
│       ├── products.ts
│       ├── categories.ts
│       └── chapters.ts
prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Database seed script
```

## Design System

The design system is defined in `src/app/globals.css` and `tailwind.config.ts` with tokens for:

- **Colors**: Sage green primary, warm sand secondary, neutrals, semantic colors
- **Typography**: Inter font, fluid clamp() sizing
- **Spacing**: 4px base unit system
- **Border Radius**: 4px, 8px, 12px, full
- **Shadows**: 4 levels (sm, md, lg, xl)
- **Components**: Buttons, cards, forms, badges, sheets, skeletons

## Database Schema

Key models:
- **Product** — name, slug, description, price, images, category, chapter, variants
- **ProductVariant** — size, color, SKU, stock, price override
- **Category** — 8 categories (Bedding, Pillows, Rugs, Curtains, Lighting, Storage, Nightwear, Function)
- **Chapter** — 9 life-stage chapters with bundle offers
- **Cart/CartItem** — Anonymous session-based cart
- **Order/OrderItem** — Orders with delivery/payment options
- **BundleOffer** — Chapter-level bundle discounts

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio
npm run db:seed          # Seed database with sample data
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use Vercel Postgres, Supabase, or any PostgreSQL provider.

### Paystack

1. Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
2. Switch to live keys for production

## Development Guidelines

- Follow the `ai-system` command workflows for feature development
- Use `npm run lint` and `npm run typecheck` before committing
- Mobile-first responsive design (375px → 1440px)
- All prices stored in kobo (₦1 = 100 kobo)
- Server Components by default, Client Components for interactivity

## License

MIT License — see [LICENSE](./LICENSE) for details.