# Test Plan

> **Metadata**
>
> - last-updated-by: update-ai-system
> - last-verified-against-code: 2026-09-01
> - staleness-policy: update when features added or test strategy changes

> **Overview:** Test strategy for detected stack (Next.js 14, TypeScript, Prisma, Paystack, Vercel). Template filled for project.

---

## Test Strategy

| Layer | Tools | Coverage Target | When |
|-------|-------|-----------------|------|
| **Unit** | Vitest + React Testing Library | 80% for lib/, hooks/, utils/ | Every PR |
| **Integration** | Vitest + MSW (API mocking) | 70% for db/, api/, paystack/ | Every PR |
| **E2E** | Playwright | Critical paths: browse → cart → checkout → payment | Pre-deploy |
| **Visual** | Playwright + pixelmatch | Key pages: Home, Product, Cart, Checkout | Pre-deploy |
| **Performance** | Lighthouse CI | LCP < 2.5s, CLS < 0.1, TBT < 200ms | Pre-deploy |
| **Accessibility** | axe-core + Playwright | WCAG AA, no violations | Pre-deploy |

---

## Test Structure

```
tests/
├── unit/
│   ├── lib/
│   │   ├── utils.test.ts           # formatPrice, slugify, generators
│   │   ├── validations.test.ts     # Zod schemas
│   │   ├── paystack.test.ts        # Payment initialization/verification
│   │   └── whatsapp.test.ts        # URL generation
│   ├── hooks/
│   │   ├── useCart.test.ts         # Cart state mutations
│   │   └── useDebounce.test.ts
│   └── components/
│       ├── ui/                     # Button, Input, Card, etc.
│       ├── product/                # ProductCard, SizeSelector
│       └── cart/                   # CartItem, CartSummary
├── integration/
│   ├── db/
│   │   ├── products.test.ts        # Query functions with test DB
│   │   ├── cart.test.ts            # Cart operations
│   │   └── orders.test.ts          # Order creation
│   ├── api/
│   │   ├── cart.test.ts            # GET/POST /api/cart
│   │   ├── checkout.test.ts        # POST /api/checkout
│   │   └── payments.test.ts        # Paystack webhook handling
│   └── paystack/
│       └── webhook.test.ts         # Signature verification, status updates
├── e2e/
│   ├── browse.spec.ts              # Homepage → Shop → Product → Chapter
│   ├── cart.spec.ts                # Add → Update → Remove → Persist
│   ├── checkout-guest.spec.ts      # Full guest checkout flow
│   ├── checkout-paystack.spec.ts   # Card payment success/failure
│   ├── checkout-pod.spec.ts        # Pay on Delivery flow
│   └── whatsapp.spec.ts            # Floating button opens correct URL
├── visual/
│   ├── homepage.visual.spec.ts
│   ├── product-detail.visual.spec.ts
│   ├── cart-slideout.visual.spec.ts
│   └── checkout.visual.spec.ts
├── performance/
│   └── lighthouse.ci.ts            # Budgets + CI integration
└── accessibility/
    └── a11y.spec.ts                # axe-core on all key pages
```

---

## Unit Test Patterns

### Utility Functions
```typescript
// tests/unit/lib/utils.test.ts
import { formatPrice, slugify, generateOrderNumber } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats kobo to NGN with commas', () => {
    expect(formatPrice(650000)).toBe('₦6,500')
    expect(formatPrice(1250000)).toBe('₦12,500')
  })
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₦0')
  })
})

describe('generateOrderNumber', () => {
  it('generates BC-YYYY-NNNN format', () => {
    const num = generateOrderNumber()
    expect(num).toMatch(/^BC-\d{4}-\d{4}$/)
  })
})
```

### Zod Validations
```typescript
// tests/unit/lib/validations.test.ts
import { checkoutSchema } from '@/lib/validations'

describe('checkoutSchema', () => {
  it('validates required fields', () => {
    const result = checkoutSchema.safeParse({
      name: 'John Doe',
      phone: '08012345678',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'Lagos',
      state: 'Lagos',
      deliveryOption: 'STANDARD',
      paymentMethod: 'PAYSTACK_CARD'
    })
    expect(result.success).toBe(true)
  })
  it('rejects invalid phone', () => {
    const result = checkoutSchema.safeParse({
      // ... valid fields
      phone: 'invalid'
    })
    expect(result.success).toBe(false)
  })
})
```

### Paystack Integration
```typescript
// tests/unit/lib/paystack.test.ts
import { initializePayment, verifyPayment } from '@/lib/paystack'

// Mock fetch globally
global.fetch = vi.fn()

describe('initializePayment', () => {
  it('calls Paystack API with correct payload', async () => {
    const mockResponse = { data: { authorization_url: 'https://paystack.com/...', reference: 'ref_123' } }
    ;(fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await initializePayment({
      email: 'test@example.com',
      amount: 650000,
      reference: 'BC-2026-0001'
    })

    expect(result.authorization_url).toContain('paystack.com')
    expect(fetch).toHaveBeenCalledWith(
      'https://api.paystack.co/transaction/initialize',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        })
      })
    )
  })
})
```

---

## Integration Test Patterns

### Database Queries (with test database)
```typescript
// tests/integration/db/products.test.ts
import { getProducts, getProductById } from '@/lib/db/products'
import { prisma } from '@/lib/prisma'

beforeAll(async () => {
  // Seed test database
  await prisma.product.createMany({ data: testProducts })
})

afterAll(async () => {
  await prisma.product.deleteMany()
  await prisma.$disconnect()
})

describe('getProducts', () => {
  it('returns paginated products with filters', async () => {
    const result = await getProducts({ category: 'bedding', page: 1, limit: 10 })
    expect(result.products.length).toBeLessThanOrEqual(10)
    expect(result.products.every(p => p.category.slug === 'bedding')).toBe(true)
  })
})
```

### API Routes (with MSW)
```typescript
// tests/integration/api/checkout.test.ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { POST } from '@/app/api/checkout/route'

const server = setupServer(
  http.post('https://api.paystack.co/transaction/initialize', () => {
    return HttpResponse.json({
      data: { authorization_url: 'https://paystack.com/pay/ref_123', reference: 'ref_123' }
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('POST /api/checkout', () => {
  it('creates order and returns Paystack URL', async () => {
    const request = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify(validCheckoutData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.paymentUrl).toContain('paystack.com')
  })
})
```

---

## E2E Test Patterns (Playwright)

### Critical Path: Browse → Cart → Checkout → Payment
```typescript
// tests/e2e/checkout-paystack.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Guest Checkout with Paystack', () => {
  test('complete purchase flow', async ({ page }) => {
    // 1. Homepage
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Everything your bedroom needs')

    // 2. Navigate to product
    await page.click('text=Shop by Product')
    await page.click('[data-testid="product-card"]:first-child')

    // 3. Select size and add to cart
    await page.click('[data-testid="size-option"]:first-child')
    await page.click('button:has-text("Add to Cart")')

    // 4. Verify cart slide-out
    await expect(page.locator('[data-testid="cart-slideout"]')).toBeVisible()
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)

    // 5. Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")')

    // 6. Fill checkout form
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="phone"]', '08012345678')
    await page.fill('[name="address"]', '123 Test Street')
    await page.selectOption('[name="city"]', 'Lagos')
    await page.selectOption('[name="state"]', 'Lagos')
    await page.click('[value="STANDARD"]') // Delivery
    await page.click('[value="PAYSTACK_CARD"]') // Payment

    // 7. Submit and verify redirect to Paystack
    await page.click('button:has-text("Place Order")')
    await expect(page).toHaveURL(/paystack\.com/)

    // 8. Mock Paystack success (in test, we'd use test card or mock)
    // This would be handled by Paystack test mode
  })
})
```

### Mobile-First Testing
```typescript
// tests/e2e/mobile.spec.ts
test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE

test('mobile homepage loads fast', async ({ page }) => {
  const start = Date.now()
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const loadTime = Date.now() - start
  expect(loadTime).toBeLessThan(3000) // 3G target
})
```

---

## Visual Regression Tests

```typescript
// tests/visual/homepage.visual.spec.ts
import { test, expect } from '@playwright/test'

test('homepage matches baseline', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
    threshold: 0.2
  })
})
```

---

## Performance Budgets (Lighthouse CI)

```yaml
# .github/lighthouse.yml
ci:
  collect:
    numberOfRuns: 3
    settings:
      preset: 'mobile'
      throttling:
        rttMs: 150
        throughputKbps: 1638.4
        cpuSlowdownMultiplier: 4
  assert:
    assertions:
      categories: ['performance', 'accessibility', 'best-practices', 'seo']
      thresholds:
        performance: 90
        accessibility: 95
        best-practices: 90
        seo: 90
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  unit-integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  visual:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:visual

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run start &
      - run: npx lhci autorun

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run start &
      - run: npm run test:a11y
```

---

## Test Data Management

| Strategy | Implementation |
|----------|----------------|
| **Test Database** | Separate PostgreSQL instance (local Docker or CI service) |
| **Seeding** | `prisma/seed.test.ts` — runs before integration tests |
| **Cleanup** | `afterAll` hooks truncate tables, `$disconnect` |
| **Paystack Mocking** | MSW handlers for all Paystack endpoints |
| **WhatsApp Mocking** | MSW intercepts `wa.me` URLs, verifies params |

---

## Coverage Thresholds

```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      },
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        'src/app/**', // Next.js pages tested via E2E
        'src/components/**/*.stories.tsx'
      ]
    }
  }
})
```

---

## Manual Testing Checklist (Pre-Launch)

- [ ] Homepage loads < 3s on 3G throttle (Chrome DevTools)
- [ ] Shop filters update URL, work on mobile/desktop
- [ ] Product images load with blur placeholder, no layout shift
- [ ] Size selector required before add-to-cart
- [ ] Cart slide-out: add, update qty, remove, subtotal correct
- [ ] Checkout form validation (all required fields, phone format)
- [ ] POD only shows for Lagos/Abuja/PH ≤₦50k
- [ ] Paystack test card (4084084084084081) completes successfully
- [ ] Paystack transfer/USSD flows work
- [ ] POD creates order, WhatsApp admin notification sent
- [ ] Webhook updates order status on payment success/failure
- [ ] Success page shows order number, WhatsApp CTA
- [ ] Failure page shows retry option, contact info
- [ ] Chapter pages: 9 chapters accessible, bundles work
- [ ] WhatsApp button opens correct chat with pre-filled message
- [ ] Trust bar visible on all pages (fixed bottom mobile)
- [ ] GA4 events: page_view, view_item, add_to_cart, begin_checkout, purchase
- [ ] Meta Pixel events firing
- [ ] Hotjar recording works
- [ ] 404 page friendly, 500 page doesn't leak stack traces
- [ ] All touch targets ≥44px on mobile
- [ ] No horizontal scroll on any page
- [ ] Reduced motion respected (no animations if enabled)