# BLDR Platform — Complete Authoritative Route Inventory

> **Generated on**: 2026-10-01T13:50:00.198Z via `scripts/list-routes`
> **Source of Truth**: Active filesystem scan across all 5 monorepo applications

## Summary Statistics

| Application | Target Audience / Purpose | Pages | API Routes | Total Endpoints |
|---|---|---|---|---|
| **Storefront** | Learner Storefront, Catalog & Hosted Checkout | 26 | 5 | **31** |
| **Admin Portal** | Studio Store Builder & Operations | 17 | 1 | **18** |
| **Hub (Central Payment Hub)** | Central Financial Governance, Settlements & Ventures | 20 | 0 | **20** |
| **Provider Portal** | Venture Team Member Self-Service Portal | 20 | 0 | **20** |
| **API (NestJS)** | Central Backend REST & Gateway Webhooks | 0 | 77 | **77** |
| **TOTAL** | *Across 5 monorepo applications* | **83** | **83** | **166** |

## Detailed Routes by Application

### Storefront (31 routes)

| Method / Type | Route Path | Source File |
|---|---|---|
| *Page* | `/` | [`apps/storefront/app/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/page.tsx) |
| `ALL` | `/api/activation-codes/redeem` | [`apps/storefront/app/api/activation-codes/redeem/route.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/api/activation-codes/redeem/route.ts) |
| `ALL` | `/api/checkout` | [`apps/storefront/app/api/checkout/route.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/api/checkout/route.ts) |
| `ALL` | `/api/checkout/resolve` | [`apps/storefront/app/api/checkout/resolve/route.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/api/checkout/resolve/route.ts) |
| `ALL` | `/api/cms` | [`apps/storefront/app/api/cms/route.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/api/cms/route.ts) |
| `ALL` | `/api/webhooks/bldr-payments` | [`apps/storefront/app/api/webhooks/bldr-payments/route.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/api/webhooks/bldr-payments/route.ts) |
| *Page* | `/apply-provider` | [`apps/storefront/app/apply-provider/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/apply-provider/page.tsx) |
| *Page* | `/browse` | [`apps/storefront/app/browse/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/browse/page.tsx) |
| *Page* | `/checkout/cancelled` | [`apps/storefront/app/checkout/cancelled/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/checkout/cancelled/page.tsx) |
| *Page* | `/checkout/confirm` | [`apps/storefront/app/checkout/confirm/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/checkout/confirm/page.tsx) |
| *Page* | `/checkout/expired` | [`apps/storefront/app/checkout/expired/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/checkout/expired/page.tsx) |
| *Page* | `/checkout/failed` | [`apps/storefront/app/checkout/failed/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/checkout/failed/page.tsx) |
| *Page* | `/checkout/pending` | [`apps/storefront/app/checkout/pending/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/checkout/pending/page.tsx) |
| *Page* | `/checkout/success` | [`apps/storefront/app/checkout/success/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/checkout/success/page.tsx) |
| *Page* | `/contact` | [`apps/storefront/app/contact/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/contact/page.tsx) |
| *Page* | `/listings/[id]` | [`apps/storefront/app/listings/[id]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/listings/[id]/page.tsx) |
| *Page* | `/orders/[id]/success` | [`apps/storefront/app/orders/[id]/success/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/orders/[id]/success/page.tsx) |
| *Page* | `/pay/[slug]` | [`apps/storefront/app/pay/[slug]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/pay/[slug]/page.tsx) |
| *Page* | `/privacy` | [`apps/storefront/app/privacy/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/privacy/page.tsx) |
| *Page* | `/products` | [`apps/storefront/app/products/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/products/page.tsx) |
| *Page* | `/products/[id]` | [`apps/storefront/app/products/[id]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/products/[id]/page.tsx) |
| *Page* | `/projects` | [`apps/storefront/app/projects/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/projects/page.tsx) |
| *Page* | `/projects/[slug]` | [`apps/storefront/app/projects/[slug]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/projects/[slug]/page.tsx) |
| *Page* | `/providers/[slug]` | [`apps/storefront/app/providers/[slug]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/providers/[slug]/page.tsx) |
| *Page* | `/providers/enroll` | [`apps/storefront/app/providers/enroll/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/providers/enroll/page.tsx) |
| *Page* | `/refund-policy` | [`apps/storefront/app/refund-policy/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/refund-policy/page.tsx) |
| *Page* | `/services` | [`apps/storefront/app/services/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/services/page.tsx) |
| *Page* | `/services/[slug]` | [`apps/storefront/app/services/[slug]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/services/[slug]/page.tsx) |
| *Page* | `/simulate/fawry-checkout/[orderId]` | [`apps/storefront/app/simulate/fawry-checkout/[orderId]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/simulate/fawry-checkout/[orderId]/page.tsx) |
| *Page* | `/simulate/provider-store/[providerId]` | [`apps/storefront/app/simulate/provider-store/[providerId]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/simulate/provider-store/[providerId]/page.tsx) |
| *Page* | `/terms` | [`apps/storefront/app/terms/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/storefront/app/terms/page.tsx) |

### Admin Portal (18 routes)

| Method / Type | Route Path | Source File |
|---|---|---|
| *Page* | `/` | [`apps/admin-portal/app/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/page.tsx) |
| *Page* | `/analytics` | [`apps/admin-portal/app/analytics/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/analytics/page.tsx) |
| `ALL` | `/api/cms` | [`apps/admin-portal/app/api/cms/route.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/api/cms/route.ts) |
| *Page* | `/cms` | [`apps/admin-portal/app/cms/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/cms/page.tsx) |
| *Page* | `/commission` | [`apps/admin-portal/app/commission/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/commission/page.tsx) |
| *Page* | `/dashboard` | [`apps/admin-portal/app/dashboard/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/dashboard/page.tsx) |
| *Page* | `/discounts` | [`apps/admin-portal/app/discounts/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/discounts/page.tsx) |
| *Page* | `/leads` | [`apps/admin-portal/app/leads/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/leads/page.tsx) |
| *Page* | `/login` | [`apps/admin-portal/app/login/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/login/page.tsx) |
| *Page* | `/orders` | [`apps/admin-portal/app/orders/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/orders/page.tsx) |
| *Page* | `/payouts` | [`apps/admin-portal/app/payouts/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/payouts/page.tsx) |
| *Page* | `/products` | [`apps/admin-portal/app/products/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/products/page.tsx) |
| *Page* | `/projects` | [`apps/admin-portal/app/projects/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/projects/page.tsx) |
| *Page* | `/providers` | [`apps/admin-portal/app/providers/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/providers/page.tsx) |
| *Page* | `/providers/[id]` | [`apps/admin-portal/app/providers/[id]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/providers/[id]/page.tsx) |
| *Page* | `/services` | [`apps/admin-portal/app/services/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/services/page.tsx) |
| *Page* | `/simulation` | [`apps/admin-portal/app/simulation/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/simulation/page.tsx) |
| *Page* | `/students` | [`apps/admin-portal/app/students/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/admin-portal/app/students/page.tsx) |

### Hub (Central Payment Hub) (20 routes)

| Method / Type | Route Path | Source File |
|---|---|---|
| *Page* | `/` | [`apps/hub/app/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/page.tsx) |
| *Page* | `/apis` | [`apps/hub/app/apis/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/apis/page.tsx) |
| *Page* | `/audit` | [`apps/hub/app/audit/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/audit/page.tsx) |
| *Page* | `/commission` | [`apps/hub/app/commission/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/commission/page.tsx) |
| *Page* | `/developers` | [`apps/hub/app/developers/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/developers/page.tsx) |
| *Page* | `/login` | [`apps/hub/app/login/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/login/page.tsx) |
| *Page* | `/pay/[linkId]` | [`apps/hub/app/pay/[linkId]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/pay/[linkId]/page.tsx) |
| *Page* | `/payment-links` | [`apps/hub/app/payment-links/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/payment-links/page.tsx) |
| *Page* | `/payment-methods` | [`apps/hub/app/payment-methods/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/payment-methods/page.tsx) |
| *Page* | `/payment-pages` | [`apps/hub/app/payment-pages/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/payment-pages/page.tsx) |
| *Page* | `/payouts` | [`apps/hub/app/payouts/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/payouts/page.tsx) |
| *Page* | `/providers` | [`apps/hub/app/providers/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/providers/page.tsx) |
| *Page* | `/reconciliation` | [`apps/hub/app/reconciliation/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/reconciliation/page.tsx) |
| *Page* | `/refunds` | [`apps/hub/app/refunds/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/refunds/page.tsx) |
| *Page* | `/students` | [`apps/hub/app/students/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/students/page.tsx) |
| *Page* | `/transactions` | [`apps/hub/app/transactions/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/transactions/page.tsx) |
| *Page* | `/transactions/[id]` | [`apps/hub/app/transactions/[id]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/transactions/[id]/page.tsx) |
| *Page* | `/users` | [`apps/hub/app/users/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/users/page.tsx) |
| *Page* | `/ventures` | [`apps/hub/app/ventures/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/ventures/page.tsx) |
| *Page* | `/ventures/[id]` | [`apps/hub/app/ventures/[id]/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/hub/app/ventures/[id]/page.tsx) |

### Provider Portal (20 routes)

| Method / Type | Route Path | Source File |
|---|---|---|
| *Page* | `/` | [`apps/provider-portal/app/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/page.tsx) |
| *Page* | `/activation-codes` | [`apps/provider-portal/app/activation-codes/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/activation-codes/page.tsx) |
| *Page* | `/apis` | [`apps/provider-portal/app/apis/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/apis/page.tsx) |
| *Page* | `/dashboard` | [`apps/provider-portal/app/dashboard/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/dashboard/page.tsx) |
| *Page* | `/integrations` | [`apps/provider-portal/app/integrations/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/integrations/page.tsx) |
| *Page* | `/leads` | [`apps/provider-portal/app/leads/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/leads/page.tsx) |
| *Page* | `/listings` | [`apps/provider-portal/app/listings/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/listings/page.tsx) |
| *Page* | `/listings/new` | [`apps/provider-portal/app/listings/new/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/listings/new/page.tsx) |
| *Page* | `/login` | [`apps/provider-portal/app/login/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/login/page.tsx) |
| *Page* | `/options` | [`apps/provider-portal/app/options/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/options/page.tsx) |
| *Page* | `/orders` | [`apps/provider-portal/app/orders/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/orders/page.tsx) |
| *Page* | `/payment-links` | [`apps/provider-portal/app/payment-links/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/payment-links/page.tsx) |
| *Page* | `/payment-pages` | [`apps/provider-portal/app/payment-pages/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/payment-pages/page.tsx) |
| *Page* | `/payouts` | [`apps/provider-portal/app/payouts/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/payouts/page.tsx) |
| *Page* | `/refund-requests` | [`apps/provider-portal/app/refund-requests/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/refund-requests/page.tsx) |
| *Page* | `/register` | [`apps/provider-portal/app/register/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/register/page.tsx) |
| *Page* | `/settings` | [`apps/provider-portal/app/settings/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/settings/page.tsx) |
| *Page* | `/students` | [`apps/provider-portal/app/students/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/students/page.tsx) |
| *Page* | `/team` | [`apps/provider-portal/app/team/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/team/page.tsx) |
| *Page* | `/transactions` | [`apps/provider-portal/app/transactions/page.tsx`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/provider-portal/app/transactions/page.tsx) |

### API (NestJS) (77 routes)

| Method / Type | Route Path | Source File |
|---|---|---|
| `GET` | `/['activation-codes', 'v1/activation-codes']/audit-failures` | [`apps/api/src/activation-codes/activation-codes.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/activation-codes/activation-codes.controller.ts) |
| `POST` | `/['activation-codes', 'v1/activation-codes']/redeem` | [`apps/api/src/activation-codes/activation-codes.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/activation-codes/activation-codes.controller.ts) |
| `GET` | `/admin/commission` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/admin/commission/global` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/admin/commission/provider/:providerId` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `DELETE` | `/admin/commission/provider/:providerId` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `GET` | `/admin/listings` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/admin/listings` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `PATCH` | `/admin/listings/:id` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `DELETE` | `/admin/listings/:id` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `PATCH` | `/admin/listings/:id/toggle-featured` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `PATCH` | `/admin/listings/:id/toggle-publish` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `GET` | `/admin/providers` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/admin/providers/:id/approve` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/admin/providers/:id/reject` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/admin/providers/:id/suspend` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `GET` | `/admin/stats` | [`apps/api/src/admin/admin.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/admin/admin.controller.ts) |
| `POST` | `/auth/admin/login` | [`apps/api/src/auth/auth.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/auth/auth.controller.ts) |
| `GET` | `/auth/me` | [`apps/api/src/auth/auth.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/auth/auth.controller.ts) |
| `POST` | `/auth/provider/login` | [`apps/api/src/auth/auth.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/auth/auth.controller.ts) |
| `POST` | `/auth/provider/register` | [`apps/api/src/auth/auth.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/auth/auth.controller.ts) |
| `GET` | `/config` | [`apps/api/src/simulation/simulation.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/simulation/simulation.controller.ts) |
| `POST` | `/leads` | [`apps/api/src/leads/leads.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/leads/leads.controller.ts) |
| `GET` | `/leads` | [`apps/api/src/leads/leads.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/leads/leads.controller.ts) |
| `PATCH` | `/leads/:id/status` | [`apps/api/src/leads/leads.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/leads/leads.controller.ts) |
| `GET` | `/leads/mine` | [`apps/api/src/leads/leads.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/leads/leads.controller.ts) |
| `GET` | `/listings` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `POST` | `/listings` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `GET` | `/listings/:id` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `PATCH` | `/listings/:id` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `DELETE` | `/listings/:id` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `POST` | `/listings/:id/media` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `GET` | `/listings/categories` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `GET` | `/listings/featured` | [`apps/api/src/listings/listings.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/listings/listings.controller.ts) |
| `POST` | `/orders` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `GET` | `/orders` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `POST` | `/orders/:id/approve-redirect` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `POST` | `/orders/:id/fallback-redirect` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `GET` | `/orders/:id/status` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `GET` | `/orders/mine` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `POST` | `/orders/report-sale` | [`apps/api/src/orders/orders.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/orders/orders.controller.ts) |
| `GET` | `/payouts` | [`apps/api/src/payouts/payouts.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/payouts/payouts.controller.ts) |
| `POST` | `/payouts/:id/mark-paid` | [`apps/api/src/payouts/payouts.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/payouts/payouts.controller.ts) |
| `GET` | `/payouts/audit-logs` | [`apps/api/src/payouts/payouts.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/payouts/payouts.controller.ts) |
| `POST` | `/payouts/batches` | [`apps/api/src/payouts/payouts.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/payouts/payouts.controller.ts) |
| `POST` | `/payouts/batches/:id/approve` | [`apps/api/src/payouts/payouts.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/payouts/payouts.controller.ts) |
| `GET` | `/payouts/mine` | [`apps/api/src/payouts/payouts.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/payouts/payouts.controller.ts) |
| `PATCH` | `/providers/:id` | [`apps/api/src/providers/providers.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/providers/providers.controller.ts) |
| `GET` | `/providers/public` | [`apps/api/src/providers/providers.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/providers/providers.controller.ts) |
| `GET` | `/providers/public/:slug` | [`apps/api/src/providers/providers.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/providers/providers.controller.ts) |
| `GET` | `/r/:clickId` | [`apps/api/src/tracking/tracking.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/tracking/tracking.controller.ts) |
| `POST` | `/simulation/fawry/trigger` | [`apps/api/src/simulation/simulation.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/simulation/simulation.controller.ts) |
| `POST` | `/simulation/geidea/trigger` | [`apps/api/src/simulation/simulation.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/simulation/simulation.controller.ts) |
| `GET` | `/simulation/orders` | [`apps/api/src/simulation/simulation.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/simulation/simulation.controller.ts) |
| `POST` | `/tracking/conversions` | [`apps/api/src/tracking/tracking.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/tracking/tracking.controller.ts) |
| `POST` | `/tracking/events` | [`apps/api/src/tracking/tracking.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/tracking/tracking.controller.ts) |
| `GET` | `/tracking/pixel` | [`apps/api/src/tracking/tracking.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/tracking/tracking.controller.ts) |
| `POST` | `/v1/admin/products` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `GET` | `/v1/admin/products` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `GET` | `/v1/admin/products` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `GET` | `/v1/admin/products/:id` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `PATCH` | `/v1/admin/products/:id` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `DELETE` | `/v1/admin/products/:id` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `GET` | `/v1/admin/products/:slug` | [`apps/api/src/products/products.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/products/products.controller.ts) |
| `POST` | `/v1/checkout/sessions` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `GET` | `/v1/checkout/sessions/:id` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `POST` | `/v1/checkout/sessions/:id/complete` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `GET` | `/v1/checkout/sessions/:id/public` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `GET` | `/v1/checkout/sessions/outbound-webhooks` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `POST` | `/v1/checkout/sessions/outbound-webhooks/:id/replay` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `GET` | `/v1/checkout/sessions/resolve` | [`apps/api/src/checkout/checkout-sessions.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/checkout/checkout-sessions.controller.ts) |
| `POST` | `/webhooks/fawry` | [`apps/api/src/webhooks/webhooks.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/webhooks/webhooks.controller.ts) |
| `POST` | `/webhooks/gateway` | [`apps/api/src/webhooks/webhooks.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/webhooks/webhooks.controller.ts) |
| `POST` | `/webhooks/geidea` | [`apps/api/src/webhooks/webhooks.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/webhooks/webhooks.controller.ts) |
| `GET` | `/webhooks/inbound-logs` | [`apps/api/src/webhooks/webhooks.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/webhooks/webhooks.controller.ts) |
| `POST` | `/webhooks/inbound-logs/:id/replay` | [`apps/api/src/webhooks/webhooks.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/webhooks/webhooks.controller.ts) |
| `POST` | `/webhooks/paymob` | [`apps/api/src/webhooks/webhooks.controller.ts`](file:////Users/samirrashed/.gemini/antigravity-ide/scratch/bldr/apps/api/src/webhooks/webhooks.controller.ts) |

