import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getVentureConfig } from '../../../lib/ventures';

const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BLDR_API_KEY = process.env.BLDR_API_KEY || process.env.BLDR_VENTURE_API_KEY || 'sk_test_bldr_2026';
const STOREFRONT_URL = process.env.STOREFRONT_URL || process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customer, returnUrl, cancelUrl } = body;

    // ── PRICE & CATALOG SECURITY ──────────────────────────────────────────────
    // Checkout must NEVER take price from client request body or URL parameters.
    // Price, currency, title, and owning venture MUST be resolved strictly on the server via apps/api.
    let matchedProduct: any = null;
    try {
      const resolveRes = await fetch(
        `${API_BASE}/v1/checkout/sessions/resolve?productId=${encodeURIComponent(productId)}`,
      );
      if (resolveRes.ok) {
        matchedProduct = await resolveRes.json();
      }
    } catch {
      // Handled below
    }

    // Fallback: If not resolved via apps/api, lookup in shared products catalog
    if (!matchedProduct) {
      try {
        const { PRODUCTS_CATALOG } = await import('../../products/data');
        const localItem = PRODUCTS_CATALOG.find(
          (p: any) => p.id === productId || p.slug === productId || p.paySlug === productId
        );
        if (localItem) {
          matchedProduct = {
            id: localItem.id,
            title: localItem.title,
            titleAr: localItem.titleAr,
            priceEGP: localItem.priceEGP,
            ventureId: localItem.ventureId || localItem.providerCode || 'BLDR',
            providerCode: localItem.providerCode || 'BLDR',
            slug: localItem.slug,
            saleMode: localItem.saleMode || 'DIRECT',
          };
        }
      } catch (e) {}
    }

    if (!matchedProduct) {
      return NextResponse.json(
        { error: `Invalid product or listing ID "${productId}". Product not found in catalog or database.` },
        { status: 400 }
      );
    }

    const title = matchedProduct.title;
    const priceEGP = matchedProduct.priceEGP;
    const currency = 'EGP';
    const amountPiasters = Math.round(priceEGP * 100);

    // Owning venture attribution
    const owningVentureCode = matchedProduct.ventureId || matchedProduct.providerCode || 'BLDR';
    const ventureConfig = getVentureConfig(owningVentureCode);

    const orderId = body.orderId || `bldr_ord_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const idempotencyKey = `buy-now-${orderId}`;

    const customerData = {
      name: customer?.name || 'Valued Learner',
      email: customer?.email || 'student@example.com',
      phone: customer?.phone || '+201001234567',
    };

    const payload = {
      venture_id: ventureConfig.code,
      order_id: orderId,
      amount: amountPiasters,
      currency,
      customer: customerData,
      line_items: [
        {
          id: matchedProduct.id,
          title,
          quantity: 1,
          unit_amount: amountPiasters,
        },
      ],
      success_url: returnUrl || `${STOREFRONT_URL}/orders/${orderId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${STOREFRONT_URL}/products/${matchedProduct.slug || 'products'}`,
      metadata: {
        product_id: matchedProduct.id,
        product_title: title,
        order_id: orderId,
        venture_id: ventureConfig.id,
        venture_code: ventureConfig.code,
        source: 'bldr_storefront_checkout',
      },
    };

    const res = await fetch(`${API_BASE}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${BLDR_API_KEY}`,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Storefront Checkout API Error]', err);
      return NextResponse.json(
        { error: err.message || 'Failed to initialize checkout session with Central Payment Hub' },
        { status: res.status }
      );
    }

    const session = await res.json();

    return NextResponse.json({
      success: true,
      orderId,
      sessionId: session.id,
      checkoutUrl: session.checkout_url,
      amountDisplay: session.amount_display,
    });
  } catch (error: any) {
    console.error('[Storefront Checkout Route Exception]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while initiating checkout' },
      { status: 500 }
    );
  }
}
