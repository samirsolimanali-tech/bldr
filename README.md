# bldr — Multi-Vendor Service Marketplace

A Turborepo monorepo with three Next.js apps sharing a single NestJS API.

## Architecture

```
bldr/
├── apps/
│   ├── storefront/       # Next.js — public marketplace (http://localhost:3000)
│   ├── provider-portal/  # Next.js — provider dashboard (http://localhost:3001)
│   ├── admin-portal/     # Next.js — admin dashboard (http://localhost:3002)
│   └── api/              # NestJS — REST API (http://localhost:4000)
├── packages/
│   ├── shared-types/     # TypeScript enums + interfaces
│   └── ui/               # Shared React components (future)
└── prisma/               # Prisma schema + seed
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL 14+ running locally

### 2. Database
```bash
# Create the database
createdb bldr

# Or in psql:
# CREATE DATABASE bldr;
```

### 3. Environment
```bash
cp .env.example .env
# Edit .env — fill in your gateway credentials (Geidea + Fawry)
```

### 4. Install dependencies
```bash
pnpm install
```

### 5. Prisma setup
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed (creates admin user, house-brand provider, sample listings)
pnpm db:seed
```

### 6. Start all apps
```bash
pnpm dev
```

This starts all 4 processes in parallel:
- **Storefront**: http://localhost:3000
- **Provider Portal**: http://localhost:3001
- **Admin Portal**: http://localhost:3002
- **API**: http://localhost:4000
- **API Docs (Swagger)**: http://localhost:4000/api/docs

## Seed Credentials

After running `pnpm db:seed`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@bldr.io | Admin@bldr2024! |
| House-brand provider | team@bldr.io | Provider@bldr2024! |
| Sample provider | contact@techbridge.academy | Provider@test2024! |

## Payment Gateways

### Geidea (Phase 1 — Primary)
- Flow: our API creates a session → frontend loads `geideaCheckout.min.js` → `payment.startPayment(sessionId)` opens modal on page
- Set `GEIDEA_MERCHANT_KEY` and `GEIDEA_API_PASSWORD` in `.env`
- Sandbox JS SDK: `https://checkout-demo.geidea.net/geideaCheckout.min.js`
- Production JS SDK: `https://checkout.geidea.net/geideaCheckout.min.js`

### Fawry (Phase 1 — Hosted Link)
- Flow: our API builds a signed URL → frontend redirects user to Fawry's hosted checkout page
- Set `FAWRY_MERCHANT_CODE` and `FAWRY_SECURITY_KEY` in `.env`
- No card data touches our servers (zero PCI scope)

### Switching gateways
Set `DEFAULT_PAYMENT_GATEWAY=fawry` in `.env` to use Fawry as the default.

## Key API Endpoints

```
POST   /auth/provider/register   — Register new provider
POST   /auth/provider/login      — Provider login
POST   /auth/admin/login         — Admin login
GET    /auth/me                  — Current user profile

GET    /listings                 — Browse listings (public)
GET    /listings/featured        — Featured listings (public)
GET    /listings/categories      — All categories (public)
GET    /listings/:id             — Listing detail (public)
POST   /listings                 — Create listing (provider)
PATCH  /listings/:id             — Update listing (provider)

POST   /orders                   — Create order + checkout session (public)
GET    /orders/:id/status        — Poll order status (public)
GET    /orders/mine              — Provider's orders (provider)
GET    /orders                   — All orders (admin)

POST   /leads                    — Submit lead form (public)
GET    /leads/mine               — Provider's leads (provider)
GET    /leads                    — All leads (admin)

POST   /tracking/events          — Log redirect click (public)
GET    /r/:clickId               — Server-side redirect with tracking

POST   /webhooks/geidea          — Geidea payment callback
POST   /webhooks/fawry           — Fawry IPN callback

GET    /payouts/mine             — Provider payout ledger
POST   /payouts/:id/mark-paid   — Admin: mark payout paid

GET    /admin/stats              — Platform stats (admin)
GET    /admin/providers          — Provider list (admin)
POST   /admin/providers/:id/approve
POST   /admin/providers/:id/reject
POST   /admin/providers/:id/suspend
GET    /admin/commission         — Commission rules (admin)
POST   /admin/commission/global  — Set global rate (admin)

GET    /providers/public         — Public provider list
GET    /providers/public/:slug   — Provider profile with listings
```

## Commission & Payouts

On each paid order:
1. `CommissionService.getRate(providerId)` — checks for provider override, falls back to global
2. `commissionAmount = amount × rate`
3. `netAmount = amount − commissionAmount`
4. Monthly `Payout` record upserted (aggregated)

Admin can mark a payout as `PAID` via the admin portal — no automated bank transfer in Phase 1.

## Webhook Security

Both webhook endpoints (`/webhooks/geidea`, `/webhooks/fawry`) verify the gateway signature **before** doing anything. An invalid signature throws `400 Bad Request`. The raw body is preserved via `rawBody: true` in `main.ts`.

Never trust unverified webhook payloads.
