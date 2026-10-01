import { Injectable, BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Order } from '@prisma/client';
import { CheckoutResult, GatewayType } from '@bldr/shared-types';
import { PaymentGateway, WebhookResult } from './gateway.interface';

/**
 * GeideaAdapter — hosted checkout (redirect flow, v2)
 *
 * Spec reference: https://docs.geidea.net/docs/geidea-checkout-v2
 *
 * Session creation
 * ─────────────────────────────────────────────────────────────────
 * POST /api/ams/v1/checkout/session
 * Auth:  Basic base64(publicKey:apiPassword)
 * Sig:   HMAC-SHA256(publicKey + amount2dp + currency + merchantReferenceId + timestamp)
 *        keyed by apiPassword, encoded as Base64.
 * The signature is NOT a simple SHA-256 hash; it is HMAC-keyed.
 *
 * Callback verification (inbound webhook)
 * ─────────────────────────────────────────────────────────────────
 * Geidea sends signature = HMAC-SHA256(
 *   publicKey + orderAmount + orderCurrency + orderId + orderStatus + merchantReferenceId + timestamp
 * ) keyed by apiPassword, encoded as Base64.
 * Only Base64 is checked — no fallback hex or alternative encoding.
 */
@Injectable()
export class GeideaAdapter implements PaymentGateway, OnModuleInit {
  readonly gatewayType = GatewayType.GEIDEA;
  private readonly logger = new Logger(GeideaAdapter.name);

  private readonly merchantKey:  string;
  private readonly apiPassword:  string;
  private readonly baseUrl:      string;
  private readonly apiBaseUrl:   string;
  private readonly storefrontUrl: string;

  constructor(private config: ConfigService) {
    this.merchantKey   = this.config.get<string>('GEIDEA_MERCHANT_KEY')   ?? '';
    this.apiPassword   = this.config.get<string>('GEIDEA_API_PASSWORD')   ?? '';
    this.baseUrl       = this.config.get<string>('GEIDEA_BASE_URL')       ?? 'https://api.merchant.geidea.net';
    this.apiBaseUrl    = this.config.get<string>('API_BASE_URL')          ?? '';
    this.storefrontUrl = this.config.get<string>('STOREFRONT_URL')        ?? '';
  }

  // ─── Startup credential guard ────────────────────────────────────────────────
  // Fail loudly in non-dev environments when placeholder credentials remain.

  onModuleInit() {
    const env = this.config.get<string>('NODE_ENV') ?? 'development';
    if (env === 'development') return;                       // sandbox OK in dev

    const PLACEHOLDER_RE = /placeholder|changeme|your[-_]?key|sk_test_REPLACE|<.+>/i;

    if (!this.merchantKey || PLACEHOLDER_RE.test(this.merchantKey)) {
      throw new Error(
        '[GeideaAdapter] GEIDEA_MERCHANT_KEY is missing or contains a placeholder value. ' +
        'Set the real merchant public key in the environment before starting in non-development mode.',
      );
    }
    if (!this.apiPassword || PLACEHOLDER_RE.test(this.apiPassword)) {
      throw new Error(
        '[GeideaAdapter] GEIDEA_API_PASSWORD is missing or contains a placeholder value. ' +
        'Set the real API password in the environment before starting in non-development mode.',
      );
    }
  }

  // ─── Request Signature ───────────────────────────────────────────────────────
  //
  // Per spec: HMAC-SHA256(publicKey + amount2dp + currency + merchantReferenceId + timestamp)
  //           keyed by apiPassword, encoded as Base64.

  private buildRequestSignature(
    amount: string,
    currency: string,
    merchantReferenceId: string,
    timestamp: string,
  ): string {
    const message =
      this.merchantKey + amount + currency + merchantReferenceId + timestamp;
    return crypto
      .createHmac('sha256', this.apiPassword)
      .update(message)
      .digest('base64');
  }

  // ─── Callback Signature (for verification) ──────────────────────────────────
  //
  // Per spec: HMAC-SHA256(
  //   publicKey + orderAmount + orderCurrency + orderId + orderStatus + merchantReferenceId + timestamp
  // ) keyed by apiPassword, encoded as Base64.

  private buildCallbackSignature(
    orderAmount: string,
    orderCurrency: string,
    orderId: string,
    orderStatus: string,
    merchantReferenceId: string,
    timestamp: string,
  ): string {
    const message =
      this.merchantKey +
      orderAmount +
      orderCurrency +
      orderId +
      orderStatus +
      merchantReferenceId +
      timestamp;
    return crypto
      .createHmac('sha256', this.apiPassword)
      .update(message)
      .digest('base64');
  }

  // ─── Create Checkout Session ─────────────────────────────────────────────────

  async createCheckoutSession(
    order: Order & { listing?: { title?: string } },
  ): Promise<CheckoutResult> {
    const amount    = Number(order.amount).toFixed(2);
    const timestamp = new Date().toISOString();
    const signature = this.buildRequestSignature(
      amount,
      order.currency,
      order.id,
      timestamp,
    );

    const body = {
      amount:              Number(amount),
      currency:            order.currency,
      timestamp,
      merchantReferenceId: order.id,
      signature,
      language:            'en',
      callbackUrl:         `${this.apiBaseUrl}/webhooks/geidea`,
      returnUrl:           `${this.storefrontUrl}/checkout/confirm?order_id=${order.id}`,
      customerEmail:       order.customerEmail,
      paymentOperation:    'Pay',
      tokenizationEnabled: false,
    };

    this.logger.debug(`[Geidea] Creating session for order ${order.id}, amount=${amount} ${order.currency}`);

    const response = await fetch(`${this.baseUrl}/api/ams/v1/checkout/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Basic auth: base64(publicKey:apiPassword)
        Authorization: `Basic ${Buffer.from(`${this.merchantKey}:${this.apiPassword}`).toString('base64')}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new BadRequestException(`Geidea session error [${response.status}]: ${errText}`);
    }

    const data = await response.json() as {
      session?: { id: string };
      responseCode?: string;
      detailedResponseMessage?: string;
    };

    if (!data.session?.id) {
      throw new BadRequestException(
        `Geidea did not return a session ID: ${data.detailedResponseMessage ?? JSON.stringify(data)}`,
      );
    }

    this.logger.log(`[Geidea] Session created: ${data.session.id} for order ${order.id}`);

    return {
      type:        'session_id',
      value:       data.session.id,
      gatewayUsed: GatewayType.GEIDEA,
    };
  }

  // ─── Inbound Callback Verification ──────────────────────────────────────────

  async handleWebhook(payload: unknown, _rawSignature: string): Promise<WebhookResult> {
    const p      = payload as Record<string, unknown>;
    const order  = (p.order  as Record<string, unknown>) ?? {};
    const allowBypass = this.config.get<string>('ALLOW_INSECURE_WEBHOOK_BYPASS') === 'true';

    // Extract fields from Geidea callback payload
    const orderAmount       = String(Number(order.totalAmount ?? p.amount ?? 0).toFixed(2));
    const orderCurrency     = String(order.currency    ?? p.currency    ?? '');
    const orderId           = String(order.id          ?? p.orderId     ?? '');
    const orderStatus       = String(order.status      ?? p.status      ?? '');
    const merchantRefId     = String(p.merchantReferenceId ?? order.merchantReferenceId ?? '');
    const timestamp         = String(order.updatedDate ?? order.creationDate ?? p.timestamp ?? '');

    // Received signature — Geidea sends it in the body as `signature`
    const receivedSig = String(p.signature ?? _rawSignature ?? '');

    if (!receivedSig && !allowBypass) {
      throw new BadRequestException('Missing Geidea callback signature');
    }

    if (receivedSig) {
      // Single encoding per spec: HMAC-SHA256 → Base64
      const expectedSig = this.buildCallbackSignature(
        orderAmount, orderCurrency, orderId, orderStatus, merchantRefId, timestamp,
      );

      if (receivedSig !== expectedSig && !allowBypass) {
        this.logger.warn(
          `[Geidea] Webhook signature mismatch for order ${merchantRefId || orderId}. ` +
          `received="${receivedSig}" expected="${expectedSig}"`,
        );
        throw new BadRequestException('Geidea callback signature mismatch');
      }
    }

    const isPaid =
      orderStatus.toLowerCase() === 'success' ||
      orderStatus.toLowerCase() === 'paid'    ||
      (p.responseCode === '000' && p.detailedResponseCode === '000');

    return {
      orderId:    merchantRefId || orderId,
      status:     isPaid ? 'paid' : 'failed',
      gatewayRef: orderId,
      rawPayload: payload,
    };
  }
}
