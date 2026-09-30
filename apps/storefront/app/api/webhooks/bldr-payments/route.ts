import { NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET =
  process.env.BLDR_WEBHOOK_SECRET ||
  process.env.EXTERNAL_WEBHOOK_SECRET ||
  'whsec_test_bldr_pilot_2026';

// In-memory persistent access store for demonstration & simulation test suite
// In production, this writes to the user's LMS database or entitlements table
const grantedEntitlements = new Set<string>();
const processedWebhooks = new Map<string, { event: string; receivedAt: string; status: string }>();

function getEntitlementStatus(orderId: string): boolean {
  return grantedEntitlements.has(orderId);
}

function getAllEntitlements() {
  return Array.from(grantedEntitlements);
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signatureHeader =
      request.headers.get('x-bldr-signature') ||
      request.headers.get('X-BLDR-Signature') ||
      '';

    if (!signatureHeader) {
      console.warn('[Webhook Warning] Missing X-BLDR-Signature header');
      return NextResponse.json(
        { error: 'Missing X-BLDR-Signature signature header' },
        { status: 401 }
      );
    }

    // Parse header: t=1727618000,v1=...
    const parts = signatureHeader.split(',').reduce((acc: Record<string, string>, part) => {
      const [k, v] = part.split('=');
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    }, {});

    const timestamp = parts['t'];
    const expectedSig = parts['v1'];

    if (!timestamp || !expectedSig) {
      console.warn('[Webhook Warning] Malformed signature header format');
      return NextResponse.json(
        { error: 'Malformed signature header format. Expected t=...,v1=...' },
        { status: 401 }
      );
    }

    // Verify HMAC-SHA256(secret, `t=${timestamp}.${rawBody}`)
    const signingInput = `t=${timestamp}.${rawBody}`;
    const computedSig = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(signingInput)
      .digest('hex');

    // Timing-safe comparison to prevent side-channel attacks
    const sigBuf = Buffer.from(computedSig, 'utf8');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      console.error('[Webhook Security] Invalid HMAC signature. Rejected.');
      return NextResponse.json(
        { error: 'Invalid HMAC signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event || payload.type || 'payment.paid';
    const orderId = payload.data?.order_id || payload.data?.orderId || payload.order_id || payload.id;
    const webhookId = payload.id || `wh_${Date.now()}`;

    console.log(`[Storefront Webhook Verified] Event: ${eventType}, Order: ${orderId}`);

    // Idempotency check: if we've already processed this webhook
    if (processedWebhooks.has(webhookId)) {
      console.log(`[Webhook Idempotency] Duplicate webhook ${webhookId} received, skipping replay.`);
      return NextResponse.json({
        received: true,
        idempotent: true,
        event: eventType,
        orderId,
      });
    }

    // Business Logic per ADR-001 / Developer Guide Step 4:
    switch (eventType) {
      case 'payment.paid':
      case 'checkout.session.completed': {
        // Unlock student course/product access
        if (orderId) {
          grantedEntitlements.add(orderId);
          console.log(`[Access Granted] Successfully unlocked course for order: ${orderId}`);
        }
        processedWebhooks.set(webhookId, {
          event: eventType,
          receivedAt: new Date().toISOString(),
          status: 'UNLOCKED',
        });
        return NextResponse.json({
          received: true,
          unlocked: true,
          orderId,
          message: 'Access granted successfully and order fulfilled',
        });
      }

      case 'payment.failed': {
        // Log failure (student already informed on hosted checkout page)
        console.warn(`[Payment Failed Event] Order ${orderId} failed or was abandoned.`);
        processedWebhooks.set(webhookId, {
          event: eventType,
          receivedAt: new Date().toISOString(),
          status: 'FAILED_LOGGED',
        });
        return NextResponse.json({
          received: true,
          status: 'failed_logged',
          orderId,
        });
      }

      case 'refund.processed': {
        // Revoke access if applicable
        if (orderId) {
          grantedEntitlements.delete(orderId);
          console.log(`[Access Revoked] Revoked access for refunded order: ${orderId}`);
        }
        processedWebhooks.set(webhookId, {
          event: eventType,
          receivedAt: new Date().toISOString(),
          status: 'REVOKED',
        });
        return NextResponse.json({
          received: true,
          revoked: true,
          orderId,
          message: 'Access revoked following refund',
        });
      }

      default:
        console.log(`[Webhook Notice] Received unhandled event type: ${eventType}`);
        return NextResponse.json({ received: true, unhandled: true, event: eventType });
    }
  } catch (error: any) {
    console.error('[Storefront Webhook Exception]', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}

// GET endpoint to query entitlement or webhook status (for storefront frontend & tests)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (orderId) {
    const isUnlocked = grantedEntitlements.has(orderId);
    return NextResponse.json({
      orderId,
      unlocked: isUnlocked,
    });
  }

  return NextResponse.json({
    totalEntitlements: grantedEntitlements.size,
    entitlements: Array.from(grantedEntitlements),
    recentWebhooks: Array.from(processedWebhooks.entries()).map(([id, info]) => ({
      id,
      ...info,
    })),
  });
}
