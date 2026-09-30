import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PRODUCTS_CATALOG } from '../../products/data';

const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BLDR_API_KEY = process.env.BLDR_API_KEY || process.env.BLDR_VENTURE_API_KEY || 'sk_test_bldr_2026';
const STOREFRONT_URL = process.env.STOREFRONT_URL || process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customer, returnUrl, cancelUrl } = body;

    const matchedProduct = PRODUCTS_CATALOG.find(
      (p) => p.id === productId || p.slug === productId || p.paySlug === productId
    );

    const title = body.title || matchedProduct?.title || 'bldr Founder Edition — Lifetime Access';
    const priceEGP = body.amountEgp || matchedProduct?.priceEGP || 1500;
    const amountPiasters = Math.round(priceEGP * 100);

    const orderId = body.orderId || `bldr_ord_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const idempotencyKey = `buy-now-${orderId}`;

    const customerData = {
      name: customer?.name || 'Valued Learner',
      email: customer?.email || 'student@example.com',
      phone: customer?.phone || '+201001234567',
    };

    const payload = {
      venture_id: 'BLDR',
      order_id: orderId,
      amount: amountPiasters,
      currency: 'EGP',
      customer: customerData,
      line_items: [
        {
          id: matchedProduct?.id || 'prod-custom',
          title,
          quantity: 1,
          unit_amount: amountPiasters,
        },
      ],
      success_url: returnUrl || `${STOREFRONT_URL}/orders/${orderId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${STOREFRONT_URL}/products/${matchedProduct?.slug || 'products'}`,
      metadata: {
        product_id: matchedProduct?.id || 'prod-custom',
        product_title: title,
        order_id: orderId,
        source: 'bldr_storefront_buy_now',
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
